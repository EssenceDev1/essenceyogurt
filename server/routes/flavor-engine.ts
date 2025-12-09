import { Router } from "express";
import { db } from "../../db/index";
import { flavors } from "@shared/schema";
import { eq, desc, sql } from "drizzle-orm";
import { FLAVOR_LIBRARY_2026, REGION_PROFILES, COMPLIANCE_PROFILES, type Flavor, type FlavorTier } from "@shared/essence-os-2026";

const router = Router();

function isFlavorActive(flavor: Flavor): boolean {
  const now = new Date().toISOString();
  if (flavor.activeFrom && now < flavor.activeFrom) return false;
  if (flavor.activeTo && now > flavor.activeTo) return false;
  return true;
}

router.get("/library", async (req, res) => {
  try {
    const { tier, region, isActive, search } = req.query;
    
    let allFlavors = [...FLAVOR_LIBRARY_2026];
    
    if (tier) {
      const tierUpper = (tier as string).toUpperCase();
      allFlavors = allFlavors.filter(f => f.tier === tierUpper);
    }
    
    if (region) {
      const regionCode = (region as string).toUpperCase();
      allFlavors = allFlavors.filter(f => 
        f.regionAvailability.includes(regionCode as any)
      );
    }
    
    if (isActive === "true") {
      allFlavors = allFlavors.filter(f => isFlavorActive(f));
    }
    
    if (search) {
      const searchLower = (search as string).toLowerCase();
      allFlavors = allFlavors.filter(f => 
        f.marketingName.toLowerCase().includes(searchLower) ||
        f.description.toLowerCase().includes(searchLower)
      );
    }
    
    const grouped = {
      core: allFlavors.filter(f => f.tier === "CORE"),
      aussie_native: allFlavors.filter(f => f.tier === "AUSSIE_NATIVE"),
      dessert_remix: allFlavors.filter(f => f.tier === "DESSERT_REMIX"),
      special: allFlavors.filter(f => f.tier === "SPECIAL")
    };
    
    res.json({
      flavors: allFlavors,
      grouped,
      summary: {
        total: allFlavors.length,
        byTier: {
          core: grouped.core.length,
          aussie_native: grouped.aussie_native.length,
          dessert_remix: grouped.dessert_remix.length,
          special: grouped.special.length
        }
      }
    });
  } catch (error) {
    console.error("Error fetching flavor library:", error);
    res.status(500).json({ error: "Failed to fetch flavor library" });
  }
});

router.get("/library/:internalCode", async (req, res) => {
  try {
    const { internalCode } = req.params;
    
    const flavor = FLAVOR_LIBRARY_2026.find(f => f.internalCode === internalCode);
    
    if (!flavor) {
      return res.status(404).json({ error: "Flavor not found" });
    }
    
    const pairingRecommendations = FLAVOR_LIBRARY_2026
      .filter(f => f.internalCode !== internalCode && isFlavorActive(f))
      .slice(0, 3)
      .map(f => ({ internalCode: f.internalCode, name: f.marketingName }));
    
    res.json({
      flavor,
      pairingRecommendations,
      pricing: {
        costPerGram: flavor.costPerUnitGram,
        pricePerGram: flavor.pricePerUnitGram
      }
    });
  } catch (error) {
    console.error("Error fetching flavor details:", error);
    res.status(500).json({ error: "Failed to fetch flavor details" });
  }
});

router.get("/database", async (req, res) => {
  try {
    const { tier, isActive } = req.query;
    
    let dbFlavors = await db.select()
      .from(flavors)
      .orderBy(desc(flavors.displayOrder));
    
    if (tier) {
      dbFlavors = dbFlavors.filter(f => f.tier === tier);
    }
    
    if (isActive !== undefined) {
      dbFlavors = dbFlavors.filter(f => f.isActive === (isActive === "true"));
    }
    
    res.json({ flavors: dbFlavors });
  } catch (error) {
    console.error("Error fetching database flavors:", error);
    res.status(500).json({ error: "Failed to fetch flavors" });
  }
});

router.post("/database/sync-library", async (req, res) => {
  try {
    const libraryFlavors = FLAVOR_LIBRARY_2026;
    let synced = 0;
    let updated = 0;
    let errors = 0;
    
    for (const libFlavor of libraryFlavors) {
      try {
        const existing = await db.select()
          .from(flavors)
          .where(eq(flavors.internalCode, libFlavor.internalCode))
          .limit(1);
        
        const flavorData = {
          name: libFlavor.marketingName,
          internalCode: libFlavor.internalCode,
          type: libFlavor.category.toLowerCase(),
          description: libFlavor.description,
          tier: libFlavor.tier.toLowerCase(),
          baseIngredients: [],
          allergens: libFlavor.allergens,
          isVegan: libFlavor.isVegan,
          isGlutenFree: !libFlavor.allergens.includes("GLUTEN"),
          isActive: isFlavorActive(libFlavor),
          displayOrder: 0
        };
        
        if (existing.length === 0) {
          await db.insert(flavors).values(flavorData);
          synced++;
        } else {
          await db.update(flavors)
            .set(flavorData)
            .where(eq(flavors.internalCode, libFlavor.internalCode));
          updated++;
        }
      } catch (err) {
        console.error(`Error syncing flavor ${libFlavor.internalCode}:`, err);
        errors++;
      }
    }
    
    res.json({
      success: true,
      synced,
      updated,
      errors,
      totalInLibrary: libraryFlavors.length
    });
  } catch (error) {
    console.error("Error syncing flavor library:", error);
    res.status(500).json({ error: "Failed to sync flavor library" });
  }
});

router.get("/tiers", async (req, res) => {
  try {
    const tiers: Record<FlavorTier, { name: string; description: string; priceMultiplier: number }> = {
      CORE: {
        name: "Core Collection",
        description: "Our signature yogurt flavors available year-round",
        priceMultiplier: 1.0
      },
      AUSSIE_NATIVE: {
        name: "Aussie Native Collection",
        description: "Premium Australian-inspired frozen yogurt experiences",
        priceMultiplier: 1.15
      },
      DESSERT_REMIX: {
        name: "Dessert Remix Collection",
        description: "Indulgent dessert-inspired creations",
        priceMultiplier: 1.25
      },
      SPECIAL: {
        name: "Special Edition",
        description: "Exclusive seasonal and collaboration flavors",
        priceMultiplier: 1.35
      }
    };
    
    const tiersWithCounts = Object.entries(tiers).map(([key, value]) => ({
      tier: key,
      ...value,
      activeFlavorCount: FLAVOR_LIBRARY_2026.filter(f => f.tier === key && isFlavorActive(f)).length
    }));
    
    res.json({ tiers: tiersWithCounts });
  } catch (error) {
    console.error("Error fetching tiers:", error);
    res.status(500).json({ error: "Failed to fetch tiers" });
  }
});

router.get("/region/:countryCode", async (req, res) => {
  try {
    const { countryCode } = req.params;
    
    const regionCode = countryCode.toUpperCase();
    const region = REGION_PROFILES.find(r => r.country === regionCode);
    
    if (!region) {
      return res.status(404).json({ error: "Region not found" });
    }
    
    const availableFlavors = FLAVOR_LIBRARY_2026.filter(f => 
      isFlavorActive(f) && f.regionAvailability.includes(regionCode as any)
    );
    
    const compliance = COMPLIANCE_PROFILES.find(c => c.code === region.complianceProfile);
    
    res.json({
      region: regionCode,
      currency: region.currency,
      language: region.defaultLanguage,
      vatRate: region.vatRate,
      availableFlavors: availableFlavors.map(f => ({
        internalCode: f.internalCode,
        name: f.marketingName,
        tier: f.tier,
        pricePerGram: f.pricePerUnitGram,
        localPrice: (f.pricePerUnitGram * (1 + region.vatRate)).toFixed(4)
      })),
      complianceProfile: compliance
    });
  } catch (error) {
    console.error("Error fetching regional flavors:", error);
    res.status(500).json({ error: "Failed to fetch regional flavors" });
  }
});

router.get("/featured", async (req, res) => {
  try {
    const { region } = req.query;
    
    const activeFlavors = FLAVOR_LIBRARY_2026.filter(f => isFlavorActive(f));
    const featuredFlavors = activeFlavors.slice(0, 6);
    
    const dubaiChocolate = FLAVOR_LIBRARY_2026.find(f => 
      f.internalCode.includes("DUBAI") || f.marketingName.toLowerCase().includes("dubai")
    );
    
    res.json({
      spotlight: dubaiChocolate || featuredFlavors[0],
      featured: featuredFlavors,
      seasonal: FLAVOR_LIBRARY_2026.filter(f => f.tier === "SPECIAL" && isFlavorActive(f)),
      newArrivals: activeFlavors.slice(-3)
    });
  } catch (error) {
    console.error("Error fetching featured flavors:", error);
    res.status(500).json({ error: "Failed to fetch featured flavors" });
  }
});

router.get("/nutrition/:internalCode", async (req, res) => {
  try {
    const { internalCode } = req.params;
    const { weight } = req.query;
    
    const flavor = FLAVOR_LIBRARY_2026.find(f => f.internalCode === internalCode);
    
    if (!flavor) {
      return res.status(404).json({ error: "Flavor not found" });
    }
    
    const grams = weight ? parseFloat(weight as string) : 100;
    
    res.json({
      internalCode,
      name: flavor.marketingName,
      allergens: flavor.allergens,
      dietaryInfo: {
        isVegan: flavor.isVegan,
        isHalal: flavor.isHalal,
        isKosherOptional: flavor.isKosherOptional
      },
      servingSize: `${grams}g`
    });
  } catch (error) {
    console.error("Error fetching nutrition info:", error);
    res.status(500).json({ error: "Failed to fetch nutrition info" });
  }
});

router.get("/allergens", async (req, res) => {
  try {
    const allAllergens = new Set<string>();
    
    FLAVOR_LIBRARY_2026.forEach(f => {
      f.allergens.forEach(a => allAllergens.add(a));
    });
    
    const allergenMap: Record<string, { name: string; flavors: string[] }> = {};
    
    allAllergens.forEach(allergen => {
      const flavorsWithAllergen = FLAVOR_LIBRARY_2026
        .filter(f => f.allergens.includes(allergen as any))
        .map(f => f.internalCode);
      
      allergenMap[allergen] = {
        name: allergen,
        flavors: flavorsWithAllergen
      };
    });
    
    const allergenFreeFlavors = FLAVOR_LIBRARY_2026
      .filter(f => (f.allergens.length === 0 || f.allergens.includes("NONE")) && isFlavorActive(f))
      .map(f => ({ internalCode: f.internalCode, name: f.marketingName }));
    
    res.json({
      allergens: Array.from(allAllergens),
      allergenDetails: allergenMap,
      allergenFreeFlavors,
      veganFlavors: FLAVOR_LIBRARY_2026
        .filter(f => f.isVegan && isFlavorActive(f))
        .map(f => ({ internalCode: f.internalCode, name: f.marketingName })),
      halalFlavors: FLAVOR_LIBRARY_2026
        .filter(f => f.isHalal && isFlavorActive(f))
        .map(f => ({ internalCode: f.internalCode, name: f.marketingName }))
    });
  } catch (error) {
    console.error("Error fetching allergen info:", error);
    res.status(500).json({ error: "Failed to fetch allergen info" });
  }
});

export default router;
