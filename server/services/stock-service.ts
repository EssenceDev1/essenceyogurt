import { storage } from "../storage";
import { operationsChat } from "./gemini-monitor";

export interface StockHealthReport {
  locationId: string;
  timestamp: Date;
  expiredItems: number;
  atRiskItems: number;
  lowStockItems: number;
  healthyItems: number;
  alerts: StockAlert[];
}

export interface StockAlert {
  type: "EXPIRED" | "EXPIRING_SOON" | "LOW_STOCK" | "TEMPERATURE_BREACH";
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  itemName: string;
  itemId: string;
  message: string;
  actionRequired: string;
}

export interface ShrinkageReport {
  locationId: string;
  periodStart: Date;
  periodEnd: Date;
  gramsDispensed: number;
  gramsSold: number;
  differenceGrams: number;
  differencePercentage: number;
  suspicionLevel: "LOW" | "MEDIUM" | "HIGH";
  estimatedLossValue: number;
  currency: string;
}

export class StockService {
  async evaluateExpiryAndHealth(essenceUnitId: string): Promise<StockHealthReport> {
    const now = new Date();
    const ingredients = await storage.getFoodIngredientsByEssenceUnit(essenceUnitId);
    
    const alerts: StockAlert[] = [];
    let expiredItems = 0;
    let atRiskItems = 0;
    let lowStockItems = 0;
    let healthyItems = 0;

    for (const item of ingredients) {
      const expiry = new Date(item.expiryDate);
      const daysUntilExpiry = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

      if (daysUntilExpiry < 0) {
        expiredItems++;
        alerts.push({
          type: "EXPIRED",
          severity: "CRITICAL",
          itemName: item.ingredientName,
          itemId: item.id,
          message: `${item.ingredientName} has expired on ${expiry.toLocaleDateString()}`,
          actionRequired: "Remove from inventory immediately and dispose properly"
        });

        await storage.updateFoodIngredient(item.id, { status: "expired" });
        
        await storage.createFoodSafetyAlert({
          essenceUnitId,
          alertType: "ingredient_expired",
          severity: "critical",
          ingredientId: item.id,
          title: `Expired: ${item.ingredientName}`,
          message: `${item.ingredientName} (${item.quantity}${item.unit}) expired on ${expiry.toLocaleDateString()}`,
          actionRequired: "Dispose immediately per HACCP protocol",
          status: "open"
        });
      } else if (daysUntilExpiry <= 3) {
        atRiskItems++;
        alerts.push({
          type: "EXPIRING_SOON",
          severity: daysUntilExpiry <= 1 ? "HIGH" : "MEDIUM",
          itemName: item.ingredientName,
          itemId: item.id,
          message: `${item.ingredientName} expires in ${Math.ceil(daysUntilExpiry)} day(s)`,
          actionRequired: "Use immediately or prepare for disposal"
        });

        await storage.updateFoodIngredient(item.id, { status: "expiring_soon" });
      } else {
        healthyItems++;
        await storage.updateFoodIngredient(item.id, { status: "in_stock" });
      }

      const minThreshold = 1.0; // Default minimum threshold in kg
      const quantity = parseFloat(item.quantity || "0");
      if (quantity < minThreshold) {
        lowStockItems++;
        alerts.push({
          type: "LOW_STOCK",
          severity: quantity < minThreshold * 0.5 ? "HIGH" : "MEDIUM",
          itemName: item.ingredientName,
          itemId: item.id,
          message: `${item.ingredientName} is running low (${quantity}${item.unit} remaining)`,
          actionRequired: "Reorder from supplier"
        });
      }
    }

    return {
      locationId: essenceUnitId,
      timestamp: now,
      expiredItems,
      atRiskItems,
      lowStockItems,
      healthyItems,
      alerts
    };
  }

  async detectSuspiciousShrinkage(
    essenceUnitId: string,
    periodStart: Date,
    periodEnd: Date,
    gramsDispensedFromScale: number,
    gramsSoldFromTransactions: number,
    pricePerGram: number = 0.15,
    currency: string = "USD"
  ): Promise<ShrinkageReport> {
    const diff = gramsDispensedFromScale - gramsSoldFromTransactions;
    const diffPercentage = gramsDispensedFromScale > 0 
      ? (diff / gramsDispensedFromScale) * 100 
      : 0;

    let suspicionLevel: "LOW" | "MEDIUM" | "HIGH" = "LOW";

    if (diff > 5000 || diffPercentage > 15) {
      suspicionLevel = "HIGH";
    } else if (diff > 1000 || diffPercentage > 8) {
      suspicionLevel = "MEDIUM";
    }

    const estimatedLoss = diff * pricePerGram;

    if (suspicionLevel === "HIGH" || suspicionLevel === "MEDIUM") {
      await storage.createTheftAlert({
        essenceUnitId,
        alertType: "shrinkage_detected",
        severity: suspicionLevel === "HIGH" ? "critical" : "high",
        description: `Significant shrinkage detected: ${diff}g (${diffPercentage.toFixed(1)}%) unaccounted for`,
        variance: diff.toString(),
        posTransactionId: null,
        employeeId: null,
        status: "open"
      });
    }

    return {
      locationId: essenceUnitId,
      periodStart,
      periodEnd,
      gramsDispensed: gramsDispensedFromScale,
      gramsSold: gramsSoldFromTransactions,
      differenceGrams: diff,
      differencePercentage: diffPercentage,
      suspicionLevel,
      estimatedLossValue: estimatedLoss,
      currency
    };
  }

  async getAiStockAnalysis(essenceUnitId: string): Promise<string> {
    const healthReport = await this.evaluateExpiryAndHealth(essenceUnitId);
    const expiringIngredients = await storage.getExpiringIngredients(7);
    
    const prompt = `Analyze stock health for frozen yogurt location:

CURRENT STATUS:
- Expired items: ${healthReport.expiredItems}
- At-risk items (expiring soon): ${healthReport.atRiskItems}
- Low stock items: ${healthReport.lowStockItems}
- Healthy items: ${healthReport.healthyItems}

ALERTS:
${healthReport.alerts.map(a => `- ${a.severity}: ${a.message}`).join('\n')}

EXPIRING IN 7 DAYS:
${expiringIngredients.map(i => `- ${i.ingredientName}: ${i.quantity}${i.unit}, expires ${i.expiryDate}`).join('\n')}

Provide:
1. Priority actions for today
2. Stock ordering recommendations
3. Waste prevention strategies
4. HACCP compliance notes`;

    return await operationsChat(prompt);
  }
}

export const stockService = new StockService();
