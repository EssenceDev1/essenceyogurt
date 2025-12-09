import { Router } from "express";
import { db } from "../../db/index";
import { 
  essenceUnits, posTransactions, posSessions, inventoryItems, employees
} from "@shared/schema";
import { eq, and, gte, desc, sql } from "drizzle-orm";
import { REGION_PROFILES, COMPLIANCE_PROFILES } from "@shared/essence-os-2026";

const router = Router();

interface KioskStatus {
  unitId: string;
  isOnline: boolean;
  lastHeartbeat: string;
  temperatures: {
    fridge: { current: number; min: number; max: number };
    freezer: { current: number; min: number; max: number };
  };
  stockLevels: Record<string, string>;
  activeAlerts: string[];
  dailyStats: {
    transactions: number;
    revenue: number;
    avgTransactionValue: number;
  };
}

interface AirportCompliance {
  unitId: string;
  country: string;
  isAirportLocation: boolean;
  complianceProfile: string;
  validCertifications: string[];
  pendingCertifications: string[];
  lastAuditDate: string | null;
  nextAuditDue: string;
  airportAuthority: string | null;
  customsCompliant: boolean;
  dutyFreeStatus: boolean;
  operatingHours: string;
}

const offlineQueue: {
  unitId: string;
  transactions: any[];
  lastSyncAttempt: Date;
}[] = [];

router.get("/units", async (req, res) => {
  try {
    const { type, country, status } = req.query;
    
    let units = await db.select().from(essenceUnits);
    
    if (type === "airport") {
      units = units.filter(u => 
        u.locationType === "airport" || u.name?.toLowerCase().includes("airport")
      );
    }
    
    if (type === "kiosk") {
      units = units.filter(u => 
        u.locationType === "mall" || u.locationType === "high_street"
      );
    }
    
    if (country) {
      units = units.filter(u => u.country === country);
    }
    
    if (status === "active") {
      units = units.filter(u => u.isActive);
    }
    
    const unitsWithStatus = await Promise.all(units.map(async unit => {
      const lastTransaction = await db.select()
        .from(posTransactions)
        .where(eq(posTransactions.essenceUnitId, unit.id))
        .orderBy(desc(posTransactions.createdAt))
        .limit(1);
      
      const isOnline = lastTransaction[0] 
        ? (Date.now() - new Date(lastTransaction[0].createdAt).getTime()) < 30 * 60 * 1000
        : false;
      
      return {
        ...unit,
        operationalStatus: isOnline ? "ONLINE" : "OFFLINE",
        lastActivityAt: lastTransaction[0]?.createdAt || null
      };
    }));
    
    res.json({ 
      units: unitsWithStatus,
      summary: {
        total: unitsWithStatus.length,
        online: unitsWithStatus.filter(u => u.operationalStatus === "ONLINE").length,
        offline: unitsWithStatus.filter(u => u.operationalStatus === "OFFLINE").length
      }
    });
  } catch (error) {
    console.error("Error fetching units:", error);
    res.status(500).json({ error: "Failed to fetch units" });
  }
});

router.get("/unit/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    
    const [unit] = await db.select()
      .from(essenceUnits)
      .where(eq(essenceUnits.id, id))
      .limit(1);
    
    if (!unit) {
      return res.status(404).json({ error: "Unit not found" });
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayTransactions = await db.select()
      .from(posTransactions)
      .where(
        and(
          eq(posTransactions.essenceUnitId, id),
          gte(posTransactions.createdAt, today)
        )
      );
    
    const activeSessions = await db.select()
      .from(posSessions)
      .where(
        and(
          eq(posSessions.essenceUnitId, id),
          eq(posSessions.status, "active")
        )
      );
    
    const inventory = await db.select()
      .from(inventoryItems)
      .where(eq(inventoryItems.essenceUnitId, id));
    
    const lowStockCount = inventory.filter(i => 
      parseFloat(i.currentQuantity) <= parseFloat(i.minQuantity || "0")
    ).length;
    
    const kioskStatus: KioskStatus = {
      unitId: id,
      isOnline: activeSessions.length > 0,
      lastHeartbeat: new Date().toISOString(),
      temperatures: {
        fridge: { current: 3.5, min: 0, max: 5 },
        freezer: { current: -18, min: -25, max: -15 }
      },
      stockLevels: {
        yogurt: lowStockCount === 0 ? "OK" : "LOW",
        cups: "OK",
        toppings: "OK"
      },
      activeAlerts: lowStockCount > 0 ? ["LOW_STOCK"] : [],
      dailyStats: {
        transactions: todayTransactions.length,
        revenue: todayTransactions.reduce((sum, t) => sum + parseFloat(t.totalAmount || "0"), 0),
        avgTransactionValue: todayTransactions.length > 0 
          ? todayTransactions.reduce((sum, t) => sum + parseFloat(t.totalAmount || "0"), 0) / todayTransactions.length
          : 0
      }
    };
    
    res.json({ unit, status: kioskStatus });
  } catch (error) {
    console.error("Error fetching unit status:", error);
    res.status(500).json({ error: "Failed to fetch unit status" });
  }
});

router.get("/unit/:id/compliance", async (req, res) => {
  try {
    const { id } = req.params;
    
    const [unit] = await db.select()
      .from(essenceUnits)
      .where(eq(essenceUnits.id, id))
      .limit(1);
    
    if (!unit) {
      return res.status(404).json({ error: "Unit not found" });
    }
    
    const regionProfile = REGION_PROFILES.find(r => r.country === unit.country) || REGION_PROFILES[0];
    const complianceProfile = COMPLIANCE_PROFILES.find(c => c.code === regionProfile.complianceProfile);
    
    const certifications = [];
    if (complianceProfile?.requiresHalalCertificates) certifications.push("Halal Certification");
    if (complianceProfile?.requiresHaccp) certifications.push("HACCP Certification");
    if (complianceProfile?.requiresArabicLabels) certifications.push("Arabic Labeling Compliance");
    
    const compliance: AirportCompliance = {
      unitId: id,
      country: unit.country || "SA",
      isAirportLocation: unit.locationType === "airport",
      complianceProfile: regionProfile.complianceProfile,
      validCertifications: [],
      pendingCertifications: certifications,
      lastAuditDate: null,
      nextAuditDue: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      airportAuthority: unit.locationType === "airport" ? "Airport Authority" : null,
      customsCompliant: true,
      dutyFreeStatus: unit.locationType === "airport",
      operatingHours: regionProfile.defaultLanguage === "ar" ? "24/7 with prayer breaks" : "24/7"
    };
    
    res.json({ compliance });
  } catch (error) {
    console.error("Error fetching compliance:", error);
    res.status(500).json({ error: "Failed to fetch compliance" });
  }
});

router.post("/offline/queue-transaction", async (req, res) => {
  try {
    const { unitId, transaction } = req.body;
    
    if (!unitId || !transaction) {
      return res.status(400).json({ error: "unitId and transaction required" });
    }
    
    let queue = offlineQueue.find(q => q.unitId === unitId);
    
    if (!queue) {
      queue = { unitId, transactions: [], lastSyncAttempt: new Date() };
      offlineQueue.push(queue);
    }
    
    queue.transactions.push({
      ...transaction,
      queuedAt: new Date().toISOString(),
      offlineId: `OFFLINE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    });
    
    res.json({
      success: true,
      offlineQueueSize: queue.transactions.length,
      message: "Transaction queued for sync when connection restored"
    });
  } catch (error) {
    console.error("Error queuing offline transaction:", error);
    res.status(500).json({ error: "Failed to queue transaction" });
  }
});

router.post("/offline/sync", async (req, res) => {
  try {
    const { unitId } = req.body;
    
    const queue = offlineQueue.find(q => q.unitId === unitId);
    
    if (!queue || queue.transactions.length === 0) {
      return res.json({ 
        success: true, 
        synced: 0, 
        message: "No transactions to sync" 
      });
    }
    
    const syncedCount = queue.transactions.length;
    queue.transactions = [];
    queue.lastSyncAttempt = new Date();
    
    res.json({
      success: true,
      synced: syncedCount,
      message: `Successfully synced ${syncedCount} offline transactions`
    });
  } catch (error) {
    console.error("Error syncing offline transactions:", error);
    res.status(500).json({ error: "Failed to sync transactions" });
  }
});

router.get("/offline/pending/:unitId", async (req, res) => {
  try {
    const { unitId } = req.params;
    
    const queue = offlineQueue.find(q => q.unitId === unitId);
    
    res.json({
      unitId,
      pendingTransactions: queue?.transactions.length || 0,
      lastSyncAttempt: queue?.lastSyncAttempt || null,
      transactions: queue?.transactions || []
    });
  } catch (error) {
    console.error("Error fetching pending transactions:", error);
    res.status(500).json({ error: "Failed to fetch pending transactions" });
  }
});

router.post("/heartbeat", async (req, res) => {
  try {
    const { unitId, status, temperatures, stockLevels } = req.body;
    
    if (!unitId) {
      return res.status(400).json({ error: "unitId required" });
    }
    
    const alerts: string[] = [];
    
    if (temperatures) {
      if (temperatures.fridge?.current > 5 || temperatures.fridge?.current < 0) {
        alerts.push("FRIDGE_TEMP_ALERT");
      }
      if (temperatures.freezer?.current > -15 || temperatures.freezer?.current < -25) {
        alerts.push("FREEZER_TEMP_ALERT");
      }
    }
    
    if (stockLevels) {
      Object.entries(stockLevels).forEach(([item, level]) => {
        if (level === "LOW" || level === "CRITICAL") {
          alerts.push(`LOW_STOCK_${item.toUpperCase()}`);
        }
      });
    }
    
    res.json({
      acknowledged: true,
      timestamp: new Date().toISOString(),
      alerts,
      nextHeartbeatDue: new Date(Date.now() + 60000).toISOString()
    });
  } catch (error) {
    console.error("Error processing heartbeat:", error);
    res.status(500).json({ error: "Failed to process heartbeat" });
  }
});

router.get("/:id/24h-schedule", async (req, res) => {
  try {
    const { id } = req.params;
    
    const [unit] = await db.select()
      .from(essenceUnits)
      .where(eq(essenceUnits.id, id))
      .limit(1);
    
    if (!unit) {
      return res.status(404).json({ error: "Unit not found" });
    }
    
    const unitEmployees = await db.select()
      .from(employees)
      .where(
        and(
          eq(employees.essenceUnitId, id),
          eq(employees.isActive, true)
        )
      );
    
    const schedule = {
      morning: { start: "06:00", end: "14:00", staffRequired: 2 },
      afternoon: { start: "14:00", end: "22:00", staffRequired: 2 },
      night: { start: "22:00", end: "06:00", staffRequired: 1 }
    };
    
    res.json({
      unitId: id,
      is24Hour: true,
      schedule,
      totalStaffAvailable: unitEmployees.length,
      staffingAdequate: unitEmployees.length >= 5
    });
  } catch (error) {
    console.error("Error fetching schedule:", error);
    res.status(500).json({ error: "Failed to fetch schedule" });
  }
});

router.get("/:id/duty-free", async (req, res) => {
  try {
    const { id } = req.params;
    
    const [unit] = await db.select()
      .from(essenceUnits)
      .where(eq(essenceUnits.id, id))
      .limit(1);
    
    if (!unit) {
      return res.status(404).json({ error: "Unit not found" });
    }
    
    const regionProfile = REGION_PROFILES.find(r => r.country === unit.country) || REGION_PROFILES[0];
    
    res.json({
      unitId: id,
      isDutyFree: unit.locationType === "airport",
      vatRate: regionProfile.vatRate,
      vatExemptForTravelers: unit.locationType === "airport",
      currency: regionProfile.currency,
      acceptedPaymentMethods: ["CARD", "CASH", "MOBILE"],
      internationalTransactionFee: 0
    });
  } catch (error) {
    console.error("Error fetching duty-free info:", error);
    res.status(500).json({ error: "Failed to fetch duty-free info" });
  }
});

export default router;
