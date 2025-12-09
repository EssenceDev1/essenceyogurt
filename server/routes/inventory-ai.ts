import { Router } from "express";
import { db } from "../../db/index";
import { 
  inventoryItems, inventoryMovements, wasteReports, 
  insertInventoryItemSchema, insertInventoryMovementSchema, insertWasteReportSchema
} from "@shared/schema";
import { eq, and, lte, gte, desc, sql } from "drizzle-orm";
import {
  evaluateFridgeSensor,
  type FridgeSensor,
  type InventoryAlert
} from "@shared/essence-os-2026";

const router = Router();

router.get("/items/:essenceUnitId", async (req, res) => {
  try {
    const { essenceUnitId } = req.params;
    const { category, lowStock } = req.query;
    
    let items = await db.select()
      .from(inventoryItems)
      .where(eq(inventoryItems.essenceUnitId, essenceUnitId));
    
    if (category) {
      items = items.filter(item => item.category === category);
    }
    
    if (lowStock === "true") {
      items = items.filter(item => {
        const current = parseFloat(item.currentQuantity);
        const min = parseFloat(item.minQuantity || "0");
        return current <= min;
      });
    }
    
    const itemsWithStatus = items.map(item => ({
      ...item,
      currentQuantity: parseFloat(item.currentQuantity),
      minQuantity: item.minQuantity ? parseFloat(item.minQuantity) : null,
      maxQuantity: item.maxQuantity ? parseFloat(item.maxQuantity) : null,
      isLowStock: parseFloat(item.currentQuantity) <= parseFloat(item.minQuantity || "0")
    }));
    
    res.json({ items: itemsWithStatus });
  } catch (error) {
    console.error("Error fetching inventory items:", error);
    res.status(500).json({ error: "Failed to fetch inventory items" });
  }
});

router.get("/alerts/:essenceUnitId", async (req, res) => {
  try {
    const { essenceUnitId } = req.params;
    const now = new Date();
    
    const items = await db.select()
      .from(inventoryItems)
      .where(eq(inventoryItems.essenceUnitId, essenceUnitId));
    
    const alerts: InventoryAlert[] = [];
    
    for (const item of items) {
      const currentQty = parseFloat(item.currentQuantity);
      const minQty = parseFloat(item.minQuantity || "0");
      
      if (currentQty <= minQty) {
        alerts.push({
          id: `ALERT_LOW_${item.id}`,
          storeId: essenceUnitId,
          sku: item.supplyItemId || item.id,
          type: "LOW_STOCK",
          severity: currentQty === 0 ? "CRITICAL" : "WARNING",
          message: `${item.itemName} is ${currentQty === 0 ? "out of stock" : "below minimum quantity"}. Current: ${currentQty} ${item.unit}, Min: ${minQty} ${item.unit}`,
          createdAt: now.toISOString(),
        });
      }
    }
    
    const alertsSummary = {
      total: alerts.length,
      critical: alerts.filter(a => a.severity === "CRITICAL").length,
      warning: alerts.filter(a => a.severity === "WARNING").length,
      info: alerts.filter(a => a.severity === "INFO").length
    };
    
    res.json({ 
      alerts,
      summary: alertsSummary
    });
  } catch (error) {
    console.error("Error generating alerts:", error);
    res.status(500).json({ error: "Failed to generate alerts" });
  }
});

router.post("/fridge-reading", async (req, res) => {
  try {
    const { sensorId, essenceUnitId, temperatureC, sensorType, minTempC, maxTempC } = req.body;
    
    if (temperatureC === undefined || !essenceUnitId) {
      return res.status(400).json({ error: "temperatureC and essenceUnitId required" });
    }
    
    const now = new Date();
    
    const sensor: FridgeSensor = {
      id: sensorId || `sensor-${essenceUnitId}`,
      storeId: essenceUnitId,
      sensorType: sensorType || "FRIDGE",
      minTempC: minTempC ?? (sensorType === "FREEZER" ? -25 : 0),
      maxTempC: maxTempC ?? (sensorType === "FREEZER" ? -15 : 5),
      lastReadingTempC: temperatureC,
      lastReadingAt: now.toISOString()
    };
    
    const alerts = evaluateFridgeSensor(sensor, temperatureC, now);
    const isInRange = temperatureC >= sensor.minTempC && temperatureC <= sensor.maxTempC;
    
    res.json({
      reading: {
        sensorId: sensor.id,
        temperatureC,
        timestamp: now.toISOString(),
        inRange: isInRange,
        acceptableRange: { min: sensor.minTempC, max: sensor.maxTempC }
      },
      alerts,
      status: alerts.length > 0 ? "ALERT" : "OK"
    });
  } catch (error) {
    console.error("Error processing fridge reading:", error);
    res.status(500).json({ error: "Failed to process fridge reading" });
  }
});

router.get("/reorder-recommendations/:essenceUnitId", async (req, res) => {
  try {
    const { essenceUnitId } = req.params;
    
    const items = await db.select()
      .from(inventoryItems)
      .where(eq(inventoryItems.essenceUnitId, essenceUnitId));
    
    const recommendations = items
      .filter(item => {
        const current = parseFloat(item.currentQuantity);
        const min = parseFloat(item.minQuantity || "0");
        const max = parseFloat(item.maxQuantity || String(min * 3));
        return current <= min * 1.5;
      })
      .map(item => {
        const current = parseFloat(item.currentQuantity);
        const min = parseFloat(item.minQuantity || "0");
        const max = parseFloat(item.maxQuantity || String(min * 3));
        
        return {
          itemId: item.id,
          itemName: item.itemName,
          category: item.category,
          currentQuantity: current,
          minQuantity: min,
          unit: item.unit,
          recommendedOrderQuantity: Math.max(max - current, min * 2),
          urgency: current === 0 ? "HIGH" : current <= min ? "MEDIUM" : "LOW" as "HIGH" | "MEDIUM" | "LOW",
          supplyItemId: item.supplyItemId
        };
      })
      .sort((a, b) => {
        const urgencyOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
        return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
      });
    
    res.json({
      essenceUnitId,
      generatedAt: new Date().toISOString(),
      recommendations,
      summary: {
        totalItems: recommendations.length,
        highUrgency: recommendations.filter(r => r.urgency === "HIGH").length,
        mediumUrgency: recommendations.filter(r => r.urgency === "MEDIUM").length,
        lowUrgency: recommendations.filter(r => r.urgency === "LOW").length
      }
    });
  } catch (error) {
    console.error("Error generating reorder recommendations:", error);
    res.status(500).json({ error: "Failed to generate recommendations" });
  }
});

router.post("/movement", async (req, res) => {
  try {
    const data = insertInventoryMovementSchema.parse(req.body);
    
    const [item] = await db.select()
      .from(inventoryItems)
      .where(eq(inventoryItems.id, data.inventoryItemId))
      .limit(1);
    
    if (!item) {
      return res.status(404).json({ error: "Inventory item not found" });
    }
    
    const currentQty = parseFloat(item.currentQuantity);
    const moveQty = parseFloat(String(data.quantity));
    
    const quantityChange = data.movementType === "in" || data.movementType === "adjustment_add"
      ? moveQty
      : -moveQty;
    
    const newQuantity = currentQty + quantityChange;
    
    if (newQuantity < 0) {
      return res.status(400).json({ error: "Insufficient inventory" });
    }
    
    await db.update(inventoryItems)
      .set({ 
        currentQuantity: String(newQuantity),
        updatedAt: new Date()
      })
      .where(eq(inventoryItems.id, item.id));
    
    const [movement] = await db.insert(inventoryMovements)
      .values(data)
      .returning();
    
    res.json({
      success: true,
      movement,
      newQuantity,
      item: { id: item.id, name: item.itemName }
    });
  } catch (error) {
    console.error("Error recording movement:", error);
    res.status(500).json({ error: "Failed to record movement" });
  }
});

router.post("/waste-report", async (req, res) => {
  try {
    const data = insertWasteReportSchema.parse(req.body);
    
    const [report] = await db.insert(wasteReports)
      .values(data)
      .returning();
    
    const fraudIndicators: string[] = [];
    const quantity = parseFloat(String(data.quantity));
    
    if (quantity > 10) {
      fraudIndicators.push("HIGH_QUANTITY");
    }
    
    if (!data.photoUrl) {
      fraudIndicators.push("NO_PHOTO_EVIDENCE");
    }
    
    if (data.wasteCategory === "suspicious") {
      fraudIndicators.push("MARKED_SUSPICIOUS");
    }
    
    const isSuspicious = fraudIndicators.length > 0;
    
    res.json({
      success: true,
      report,
      fraudAnalysis: {
        isSuspicious,
        indicators: fraudIndicators,
        requiresManagerReview: isSuspicious
      }
    });
  } catch (error) {
    console.error("Error submitting waste report:", error);
    res.status(500).json({ error: "Failed to submit waste report" });
  }
});

router.get("/waste-analysis/:essenceUnitId", async (req, res) => {
  try {
    const { essenceUnitId } = req.params;
    const { days } = req.query;
    const daysBack = parseInt(days as string) || 30;
    
    const since = new Date();
    since.setDate(since.getDate() - daysBack);
    
    const reports = await db.select()
      .from(wasteReports)
      .where(
        and(
          eq(wasteReports.essenceUnitId, essenceUnitId),
          gte(wasteReports.reportedAt, since)
        )
      )
      .orderBy(desc(wasteReports.reportedAt));
    
    const items = await db.select()
      .from(inventoryItems)
      .where(eq(inventoryItems.essenceUnitId, essenceUnitId));
    
    const totalWaste = reports.reduce((sum, r) => sum + parseFloat(r.quantity), 0);
    const totalInventory = items.reduce((sum, i) => sum + parseFloat(i.currentQuantity), 0);
    
    const wastePercentage = totalInventory > 0 
      ? ((totalWaste / totalInventory) * 100).toFixed(2)
      : "0";
    
    const wasteByReason: Record<string, number> = {};
    reports.forEach(r => {
      wasteByReason[r.wasteReason] = (wasteByReason[r.wasteReason] || 0) + parseFloat(r.quantity);
    });
    
    const wastePercentNum = parseFloat(wastePercentage);
    const fraudRisk = wastePercentNum > 5 ? "HIGH" : wastePercentNum > 2 ? "MEDIUM" : "LOW";
    
    res.json({
      essenceUnitId,
      period: { days: daysBack, since: since.toISOString() },
      summary: {
        totalWasteQuantity: totalWaste,
        totalInventory,
        wastePercentage: wastePercentNum,
        reportCount: reports.length
      },
      wasteByReason,
      fraudRiskAssessment: {
        riskLevel: fraudRisk,
        message: fraudRisk === "HIGH" 
          ? "Waste levels significantly above normal. Investigation recommended."
          : fraudRisk === "MEDIUM"
          ? "Waste levels slightly elevated. Monitor closely."
          : "Waste levels within acceptable range."
      },
      recentReports: reports.slice(0, 10)
    });
  } catch (error) {
    console.error("Error analyzing waste:", error);
    res.status(500).json({ error: "Failed to analyze waste data" });
  }
});

router.get("/stock-status/:essenceUnitId", async (req, res) => {
  try {
    const { essenceUnitId } = req.params;
    
    const items = await db.select()
      .from(inventoryItems)
      .where(eq(inventoryItems.essenceUnitId, essenceUnitId));
    
    const categorized = {
      ok: [] as any[],
      low: [] as any[],
      critical: [] as any[],
      outOfStock: [] as any[]
    };
    
    items.forEach(item => {
      const current = parseFloat(item.currentQuantity);
      const min = parseFloat(item.minQuantity || "0");
      
      const itemData = {
        ...item,
        currentQuantity: current,
        minQuantity: min
      };
      
      if (current === 0) {
        categorized.outOfStock.push(itemData);
      } else if (current <= min * 0.5) {
        categorized.critical.push(itemData);
      } else if (current <= min) {
        categorized.low.push(itemData);
      } else {
        categorized.ok.push(itemData);
      }
    });
    
    res.json({
      essenceUnitId,
      generatedAt: new Date().toISOString(),
      summary: {
        ok: categorized.ok.length,
        low: categorized.low.length,
        critical: categorized.critical.length,
        outOfStock: categorized.outOfStock.length
      },
      items: categorized,
      actionRequired: categorized.outOfStock.length > 0 || categorized.critical.length > 0
    });
  } catch (error) {
    console.error("Error generating stock status:", error);
    res.status(500).json({ error: "Failed to generate stock status" });
  }
});

export default router;
