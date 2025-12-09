import { Router } from "express";
import { db } from "../../db/index";
import { 
  franchiseApplications, essenceUnits, posTransactions,
  insertFranchiseApplicationSchema
} from "@shared/schema";
import { eq, and, gte, lte, desc, sql, sum } from "drizzle-orm";
import {
  calculateFranchiseRoyalties,
  FRANCHISE_LIFECYCLE_STAGES,
  type Franchise,
  type RoyaltyCalculation,
  type FranchiseLifecycleStage,
  type CountryCode,
  type CurrencyCode,
  REGION_PROFILES
} from "@shared/essence-os-2026";

const router = Router();

router.get("/lifecycle-stages", async (req, res) => {
  try {
    const stagesWithDescriptions = FRANCHISE_LIFECYCLE_STAGES.map((stage, index) => ({
      stage,
      order: index + 1,
      description: getStageDescription(stage)
    }));
    
    res.json({ stages: stagesWithDescriptions });
  } catch (error) {
    console.error("Error fetching lifecycle stages:", error);
    res.status(500).json({ error: "Failed to fetch lifecycle stages" });
  }
});

function getStageDescription(stage: FranchiseLifecycleStage): string {
  const descriptions: Record<FranchiseLifecycleStage, string> = {
    LEAD: "Initial contact and interest expression",
    APPLICATION: "Formal franchise application submitted",
    DUE_DILIGENCE: "Background checks and financial verification",
    NEGOTIATION: "Contract terms and territory negotiation",
    CONTRACT_SIGNING: "Legal agreements finalized",
    SITE_SELECTION: "Location scouting and approval",
    BUILD_OUT: "Store construction and equipment installation",
    TRAINING: "Staff and owner training program",
    PRE_OPENING: "Final preparations and soft launch",
    GRAND_OPENING: "Official store launch",
    OPERATIONAL: "Active franchise operation",
    RENEWAL: "Contract renewal evaluation"
  };
  return descriptions[stage];
}

router.get("/applications", async (req, res) => {
  try {
    const { status, country } = req.query;
    
    let query = db.select().from(franchiseApplications).orderBy(desc(franchiseApplications.createdAt));
    
    const applications = await query;
    
    let filtered = applications;
    if (status) {
      filtered = filtered.filter(a => a.status === status);
    }
    if (country) {
      filtered = filtered.filter(a => a.country === country);
    }
    
    res.json({ applications: filtered });
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});

router.post("/applications", async (req, res) => {
  try {
    const data = insertFranchiseApplicationSchema.parse(req.body);
    
    const [application] = await db.insert(franchiseApplications)
      .values({
        ...data,
        status: "LEAD"
      })
      .returning();
    
    res.status(201).json({ success: true, application });
  } catch (error) {
    console.error("Error creating application:", error);
    res.status(400).json({ error: "Failed to create application" });
  }
});

router.patch("/applications/:id/stage", async (req, res) => {
  try {
    const { id } = req.params;
    const { newStage, notes } = req.body;
    
    if (!FRANCHISE_LIFECYCLE_STAGES.includes(newStage)) {
      return res.status(400).json({ error: "Invalid lifecycle stage" });
    }
    
    const [updated] = await db.update(franchiseApplications)
      .set({
        status: newStage,
        notes: notes || undefined
      })
      .where(eq(franchiseApplications.id, id))
      .returning();
    
    if (!updated) {
      return res.status(404).json({ error: "Application not found" });
    }
    
    res.json({ success: true, application: updated });
  } catch (error) {
    console.error("Error updating stage:", error);
    res.status(500).json({ error: "Failed to update stage" });
  }
});

router.post("/royalty/calculate", async (req, res) => {
  try {
    const { franchiseId, periodStart, periodEnd, grossRevenue, currency } = req.body;
    
    if (!franchiseId || !periodStart || !periodEnd || grossRevenue === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    const franchise: Franchise = {
      id: franchiseId,
      name: "Franchise",
      legalEntity: "Franchise LLC",
      country: "SA" as CountryCode,
      contactEmail: "franchise@example.com",
      royaltyPercent: 6,
      marketingPercent: 2,
      technologyFeePercent: 1,
      contractStart: "2024-01-01",
      isSuspended: false
    };
    
    const calculation = calculateFranchiseRoyalties(
      franchise,
      grossRevenue,
      currency || "USD",
      periodStart,
      periodEnd
    );
    
    res.json({ calculation });
  } catch (error) {
    console.error("Error calculating royalties:", error);
    res.status(500).json({ error: "Failed to calculate royalties" });
  }
});

router.get("/units", async (req, res) => {
  try {
    const { country, locationType, isActive } = req.query;
    
    let units = await db.select().from(essenceUnits);
    
    if (country) {
      units = units.filter(u => u.country === country);
    }
    if (locationType) {
      units = units.filter(u => u.locationType === locationType);
    }
    if (isActive !== undefined) {
      units = units.filter(u => u.isActive === (isActive === "true"));
    }
    
    res.json({ units });
  } catch (error) {
    console.error("Error fetching units:", error);
    res.status(500).json({ error: "Failed to fetch units" });
  }
});

router.get("/units/:id/performance", async (req, res) => {
  try {
    const { id } = req.params;
    const { periodDays } = req.query;
    const days = parseInt(periodDays as string) || 30;
    
    const [unit] = await db.select()
      .from(essenceUnits)
      .where(eq(essenceUnits.id, id))
      .limit(1);
    
    if (!unit) {
      return res.status(404).json({ error: "Unit not found" });
    }
    
    const since = new Date();
    since.setDate(since.getDate() - days);
    
    const transactions = await db.select()
      .from(posTransactions)
      .where(
        and(
          eq(posTransactions.essenceUnitId, id),
          gte(posTransactions.createdAt, since)
        )
      );
    
    const totalRevenue = transactions.reduce((sum, t) => 
      sum + parseFloat(t.totalAmount || "0"), 0
    );
    
    const avgTransaction = transactions.length > 0 
      ? totalRevenue / transactions.length 
      : 0;
    
    const region = REGION_PROFILES.find(r => r.country === unit.country as CountryCode);
    
    res.json({
      unit: {
        id: unit.id,
        name: unit.name,
        code: unit.code,
        country: unit.country,
        city: unit.city,
        locationType: unit.locationType
      },
      period: {
        days,
        since: since.toISOString()
      },
      performance: {
        totalTransactions: transactions.length,
        totalRevenue: totalRevenue.toFixed(2),
        averageTransaction: avgTransaction.toFixed(2),
        currency: region?.currency || "USD",
        transactionsPerDay: (transactions.length / days).toFixed(1),
        revenuePerDay: (totalRevenue / days).toFixed(2)
      },
      benchmarks: {
        targetTransactionsPerDay: unit.maxCupsPerHour ? unit.maxCupsPerHour * 12 : 100,
        targetRevenuePerDay: 500,
        performance: totalRevenue / days >= 500 ? "ABOVE_TARGET" : 
                     totalRevenue / days >= 300 ? "ON_TARGET" : "BELOW_TARGET"
      }
    });
  } catch (error) {
    console.error("Error fetching performance:", error);
    res.status(500).json({ error: "Failed to fetch performance data" });
  }
});

router.get("/territories", async (req, res) => {
  try {
    const territories = REGION_PROFILES.map(r => ({
      id: r.id,
      country: r.country,
      currency: r.currency,
      defaultLanguage: r.defaultLanguage,
      vatRate: r.vatRate,
      complianceProfile: r.complianceProfile,
      features: {
        allowMada: r.allowMada,
        allowTapToPay: r.allowTapToPay,
        allowOfflinePos: r.allowOfflinePos
      }
    }));
    
    res.json({ territories });
  } catch (error) {
    console.error("Error fetching territories:", error);
    res.status(500).json({ error: "Failed to fetch territories" });
  }
});

router.get("/territory/regions", async (req, res) => {
  try {
    const regions = REGION_PROFILES.map(r => ({
      id: r.id,
      country: r.country,
      currency: r.currency,
      defaultLanguage: r.defaultLanguage,
      vatRate: r.vatRate,
      complianceProfile: r.complianceProfile,
      features: {
        allowMada: r.allowMada,
        allowTapToPay: r.allowTapToPay,
        allowOfflinePos: r.allowOfflinePos
      }
    }));
    
    res.json({ regions });
  } catch (error) {
    console.error("Error fetching regions:", error);
    res.status(500).json({ error: "Failed to fetch regions" });
  }
});

router.get("/dashboard/summary", async (req, res) => {
  try {
    const applications = await db.select().from(franchiseApplications);
    const units = await db.select().from(essenceUnits);
    
    const applicationsByStage: Record<string, number> = {};
    applications.forEach(a => {
      applicationsByStage[a.status] = (applicationsByStage[a.status] || 0) + 1;
    });
    
    const unitsByCountry: Record<string, number> = {};
    units.forEach(u => {
      unitsByCountry[u.country] = (unitsByCountry[u.country] || 0) + 1;
    });
    
    const unitsByType: Record<string, number> = {};
    units.forEach(u => {
      unitsByType[u.locationType] = (unitsByType[u.locationType] || 0) + 1;
    });
    
    res.json({
      overview: {
        totalApplications: applications.length,
        activeUnits: units.filter(u => u.isActive).length,
        totalUnits: units.length,
        countries: Object.keys(unitsByCountry).length
      },
      applications: {
        byStage: applicationsByStage,
        recent: applications.slice(0, 5)
      },
      units: {
        byCountry: unitsByCountry,
        byType: unitsByType
      },
      pipeline: {
        leads: applicationsByStage["LEAD"] || 0,
        inProgress: Object.entries(applicationsByStage)
          .filter(([stage]) => !["LEAD", "OPERATIONAL", "RENEWAL"].includes(stage))
          .reduce((sum, [, count]) => sum + count, 0),
        operational: applicationsByStage["OPERATIONAL"] || 0
      }
    });
  } catch (error) {
    console.error("Error fetching dashboard:", error);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
});

export default router;
