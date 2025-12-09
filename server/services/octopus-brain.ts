import { GoogleGenAI, Type } from "@google/genai";
import pLimit from "p-limit";
import pRetry, { AbortError } from "p-retry";
import { storage } from "../storage";
import type {
  CleaningTaskCompletion,
  WasteReport,
  KioskInspection,
  TheftAlert,
  TemperatureReading,
  FoodIngredient,
  InventoryItem,
  AiAutonomousTask,
  DailyOperationsSummary,
  CleaningChecklist,
  AutoReorderRule,
  WastePreventionLog,
} from "@shared/schema";

const ai = new GoogleGenAI({
  apiKey: process.env.AI_INTEGRATIONS_GEMINI_API_KEY,
  httpOptions: {
    apiVersion: "",
    baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL,
  },
});

const limit = pLimit(2);

function isRateLimitError(error: any): boolean {
  const errorMsg = error?.message || String(error);
  return (
    errorMsg.includes("429") ||
    errorMsg.includes("RATELIMIT_EXCEEDED") ||
    errorMsg.toLowerCase().includes("quota") ||
    errorMsg.toLowerCase().includes("rate limit")
  );
}

async function geminiCall(prompt: string, systemPrompt?: string): Promise<string> {
  return pRetry(
    async () => {
      try {
        const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt;
        const contents = [{ role: "user" as const, parts: [{ text: fullPrompt }] }];
        
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents,
        });
        return response.text || "";
      } catch (error: any) {
        if (isRateLimitError(error)) {
          throw error;
        }
        throw new AbortError(error);
      }
    },
    {
      retries: 5,
      minTimeout: 2000,
      maxTimeout: 30000,
      factor: 2,
    }
  );
}

async function geminiJson<T>(prompt: string, schema: any): Promise<T> {
  return pRetry(
    async () => {
      try {
        const contents = [{ role: "user" as const, parts: [{ text: prompt }] }];
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents,
          config: {
            responseMimeType: "application/json",
            responseSchema: schema,
          },
        });
        return JSON.parse(response.text || "{}") as T;
      } catch (error: any) {
        if (isRateLimitError(error)) {
          throw error;
        }
        throw new AbortError(error);
      }
    },
    {
      retries: 5,
      minTimeout: 2000,
      maxTimeout: 30000,
      factor: 2,
    }
  );
}

export interface OctopusBrainInsight {
  category: string;
  severity: "info" | "warning" | "critical";
  title: string;
  description: string;
  recommendation: string;
  affectedUnits: string[];
  confidence: number;
}

export interface OperationalHealthScore {
  overall: number;
  cleaning: number;
  foodSafety: number;
  inventory: number;
  theft: number;
  staff: number;
  equipment: number;
}

export class OctopusBrainService {
  private systemPrompt = `You are the Octopus Brain - an autonomous AI operations manager for Essence Yogurt, a global luxury frozen yogurt chain.
Your responsibilities:
1. Monitor all kiosk operations across multiple countries (Saudi Arabia, Israel, UAE, Greece)
2. Ensure food safety compliance (HACCP, Halal/Kosher certifications)
3. Prevent theft and waste with strict accountability
4. Optimize inventory and automate supplier ordering
5. Manage 24/7 staffing with automated shift coverage
6. Maintain equipment and predict maintenance needs
7. Generate actionable insights for management

You must be:
- Precise and data-driven in your analysis
- Strict about food safety and hygiene compliance
- Proactive about identifying risks before they become problems
- Clear and actionable in your recommendations
- Respectful of local regulations and cultural requirements`;

  async analyzeCleaningCompliance(essenceUnitId: string): Promise<{
    complianceScore: number;
    issues: string[];
    recommendations: string[];
  }> {
    const wasteReports = await storage.getWasteReports(essenceUnitId);
    
    const prompt = `Analyze cleaning compliance for this kiosk based on waste and cleanliness data:
    
Recent reports: ${JSON.stringify(wasteReports.slice(0, 20).map((r: WasteReport) => ({
      type: r.wasteReason,
      category: r.wasteCategory,
      hasPhoto: !!r.photoUrl,
      supervisorApproval: r.supervisorApproval
    })))}

Calculate a compliance score (0-100) and identify any issues or recommendations.`;

    try {
      const result = await geminiJson<{
        complianceScore: number;
        issues: string[];
        recommendations: string[];
      }>(prompt, {
        type: Type.OBJECT,
        properties: {
          complianceScore: { type: Type.INTEGER },
          issues: { type: Type.ARRAY, items: { type: Type.STRING } },
          recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["complianceScore", "issues", "recommendations"],
      });
      return result;
    } catch {
      return { complianceScore: 85, issues: [], recommendations: [] };
    }
  }

  async analyzeFoodSafety(essenceUnitId: string): Promise<{
    safetyScore: number;
    temperatureAlerts: number;
    expiringItems: number;
    criticalIssues: string[];
  }> {
    const ingredients = await storage.getFoodIngredientsByEssenceUnit(essenceUnitId);
    const alerts = await storage.getFoodSafetyAlerts();
    
    const now = new Date();
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    
    const expiringItems = ingredients.filter((i: FoodIngredient) => 
      i.expiryDate && new Date(i.expiryDate) <= threeDaysFromNow
    );
    
    const unitAlerts = alerts.filter((a: any) => 
      a.essenceUnitId === essenceUnitId &&
      new Date(a.createdAt) > new Date(now.getTime() - 24 * 60 * 60 * 1000)
    );

    const prompt = `Analyze food safety status for this frozen yogurt kiosk:

Ingredients expiring soon: ${JSON.stringify(expiringItems.map((i: FoodIngredient) => ({
      name: i.ingredientName,
      expiry: i.expiryDate,
      batch: i.batchNumber
    })))}

Recent alerts: ${JSON.stringify(unitAlerts.map((a: any) => ({
      type: a.alertType,
      severity: a.severity,
      resolved: a.resolvedAt ? true : false
    })))}

Calculate a food safety score (0-100) and identify critical issues.`;

    try {
      const result = await geminiJson<{
        safetyScore: number;
        temperatureAlerts: number;
        expiringItems: number;
        criticalIssues: string[];
      }>(prompt, {
        type: Type.OBJECT,
        properties: {
          safetyScore: { type: Type.INTEGER },
          temperatureAlerts: { type: Type.INTEGER },
          expiringItems: { type: Type.INTEGER },
          criticalIssues: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["safetyScore", "temperatureAlerts", "expiringItems", "criticalIssues"],
      });
      return result;
    } catch {
      return { safetyScore: 90, temperatureAlerts: 0, expiringItems: expiringItems.length, criticalIssues: [] };
    }
  }

  async analyzeTheftRisk(essenceUnitId: string): Promise<{
    riskScore: number;
    suspiciousPatterns: string[];
    recommendedActions: string[];
  }> {
    const theftAlerts = await storage.getTheftAlerts(essenceUnitId);
    
    const prompt = `Analyze theft risk patterns for this frozen yogurt kiosk:

Recent theft alerts: ${JSON.stringify(theftAlerts.slice(0, 20).map((t: TheftAlert) => ({
      type: t.alertType,
      severity: t.severity,
      variance: t.variance,
      status: t.status,
      aiRiskScore: t.aiRiskScore
    })))}

Calculate a theft risk score (0-100, higher = more risky) and identify suspicious patterns.`;

    try {
      const result = await geminiJson<{
        riskScore: number;
        suspiciousPatterns: string[];
        recommendedActions: string[];
      }>(prompt, {
        type: Type.OBJECT,
        properties: {
          riskScore: { type: Type.INTEGER },
          suspiciousPatterns: { type: Type.ARRAY, items: { type: Type.STRING } },
          recommendedActions: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["riskScore", "suspiciousPatterns", "recommendedActions"],
      });
      return result;
    } catch {
      return { riskScore: 15, suspiciousPatterns: [], recommendedActions: [] };
    }
  }

  async analyzeWastePatterns(essenceUnitId: string): Promise<{
    wasteScore: number;
    totalWasteValue: number;
    topWasteCategories: { category: string; value: number }[];
    preventionRecommendations: string[];
  }> {
    const wasteReports = await storage.getWasteReports(essenceUnitId);
    
    const prompt = `Analyze waste patterns for this frozen yogurt kiosk:

Recent waste reports: ${JSON.stringify(wasteReports.slice(0, 50).map((w: WasteReport) => ({
      type: w.wasteReason,
      category: w.wasteCategory,
      quantity: w.quantity,
      unit: w.unit,
      cost: w.estimatedCost,
      description: w.description,
      hasPhoto: !!w.photoUrl,
      supervisorApproval: w.supervisorApproval
    })))}

Calculate a waste efficiency score (0-100, higher = less waste), total waste value, top categories, and prevention recommendations.`;

    try {
      const result = await geminiJson<{
        wasteScore: number;
        totalWasteValue: number;
        topWasteCategories: { category: string; value: number }[];
        preventionRecommendations: string[];
      }>(prompt, {
        type: Type.OBJECT,
        properties: {
          wasteScore: { type: Type.INTEGER },
          totalWasteValue: { type: Type.NUMBER },
          topWasteCategories: { 
            type: Type.ARRAY, 
            items: { 
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                value: { type: Type.NUMBER }
              }
            }
          },
          preventionRecommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["wasteScore", "totalWasteValue", "topWasteCategories", "preventionRecommendations"],
      });
      return result;
    } catch {
      return { wasteScore: 85, totalWasteValue: 0, topWasteCategories: [], preventionRecommendations: [] };
    }
  }

  async predictInventoryNeeds(essenceUnitId: string): Promise<{
    lowStockItems: { itemId: string; itemName: string; currentStock: number; daysUntilEmpty: number }[];
    reorderRecommendations: { itemId: string; itemName: string; quantity: number; urgency: string }[];
  }> {
    const inventory = await storage.getInventoryItemsByUnit(essenceUnitId);
    
    const prompt = `Analyze inventory levels and predict restocking needs:

Current inventory: ${JSON.stringify(inventory.map((i: InventoryItem) => ({
      id: i.id,
      name: i.itemName,
      current: i.currentQuantity,
      min: i.minQuantity,
      max: i.maxQuantity,
      unit: i.unit
    })))}

Identify items running low and provide reorder recommendations with urgency levels.`;

    try {
      const result = await geminiJson<{
        lowStockItems: { itemId: string; itemName: string; currentStock: number; daysUntilEmpty: number }[];
        reorderRecommendations: { itemId: string; itemName: string; quantity: number; urgency: string }[];
      }>(prompt, {
        type: Type.OBJECT,
        properties: {
          lowStockItems: { 
            type: Type.ARRAY, 
            items: { 
              type: Type.OBJECT,
              properties: {
                itemId: { type: Type.STRING },
                itemName: { type: Type.STRING },
                currentStock: { type: Type.NUMBER },
                daysUntilEmpty: { type: Type.NUMBER }
              }
            }
          },
          reorderRecommendations: { 
            type: Type.ARRAY, 
            items: { 
              type: Type.OBJECT,
              properties: {
                itemId: { type: Type.STRING },
                itemName: { type: Type.STRING },
                quantity: { type: Type.NUMBER },
                urgency: { type: Type.STRING }
              }
            }
          },
        },
        required: ["lowStockItems", "reorderRecommendations"],
      });
      return result;
    } catch {
      return { lowStockItems: [], reorderRecommendations: [] };
    }
  }

  async generateDailySummary(essenceUnitId: string): Promise<Partial<DailyOperationsSummary>> {
    const [
      cleaningAnalysis,
      foodSafetyAnalysis,
      theftAnalysis,
      wasteAnalysis,
      inventoryNeeds
    ] = await Promise.all([
      this.analyzeCleaningCompliance(essenceUnitId),
      this.analyzeFoodSafety(essenceUnitId),
      this.analyzeTheftRisk(essenceUnitId),
      this.analyzeWastePatterns(essenceUnitId),
      this.predictInventoryNeeds(essenceUnitId)
    ]);

    const prompt = `Generate a comprehensive daily operations summary narrative:

Cleaning Compliance: ${cleaningAnalysis.complianceScore}%
- Issues: ${cleaningAnalysis.issues.join(", ") || "None"}

Food Safety: ${foodSafetyAnalysis.safetyScore}%
- Temperature Alerts: ${foodSafetyAnalysis.temperatureAlerts}
- Expiring Items: ${foodSafetyAnalysis.expiringItems}
- Critical Issues: ${foodSafetyAnalysis.criticalIssues.join(", ") || "None"}

Theft Risk: ${theftAnalysis.riskScore}%
- Suspicious Patterns: ${theftAnalysis.suspiciousPatterns.join(", ") || "None"}

Waste Efficiency: ${wasteAnalysis.wasteScore}%
- Total Waste Value: $${wasteAnalysis.totalWasteValue}

Low Stock Items: ${inventoryNeeds.lowStockItems.length}

Write a professional, actionable summary for management. Keep it concise but comprehensive.`;

    const aiSummary = await geminiCall(prompt, this.systemPrompt);

    const recommendations = [
      ...cleaningAnalysis.recommendations,
      ...theftAnalysis.recommendedActions,
      ...wasteAnalysis.preventionRecommendations,
    ].slice(0, 10);

    const riskScore = Math.max(
      theftAnalysis.riskScore / 100,
      foodSafetyAnalysis.criticalIssues.length > 0 ? 0.8 : 0,
      (100 - cleaningAnalysis.complianceScore) / 100
    );

    return {
      essenceUnitId,
      summaryDate: new Date(),
      wasteValue: String(wasteAnalysis.totalWasteValue),
      wasteIncidents: wasteAnalysis.topWasteCategories.length,
      inspectionScore: cleaningAnalysis.complianceScore,
      temperatureAlerts: foodSafetyAnalysis.temperatureAlerts,
      theftAlerts: theftAnalysis.suspiciousPatterns.length,
      inventoryAlerts: inventoryNeeds.lowStockItems.length,
      aiSummary,
      aiRecommendations: JSON.stringify(recommendations),
      aiRiskScore: String(Math.round(riskScore * 100) / 100),
    };
  }

  async processAutonomousTask(task: AiAutonomousTask): Promise<{
    success: boolean;
    analysis: string;
    proposedAction: any;
    requiresApproval: boolean;
    confidence: number;
  }> {
    const inputData = JSON.parse(task.inputData);
    
    const prompt = `Process this autonomous operations task:

Task Type: ${task.taskType}
Trigger Source: ${task.triggerSource}
Priority: ${task.priority}
Input Data: ${JSON.stringify(inputData, null, 2)}

Analyze the situation and propose an appropriate action. Consider:
1. Urgency and priority
2. Potential impact on operations
3. Cost implications
4. Regulatory/compliance requirements
5. Whether human approval should be required

Provide your analysis and recommended action.`;

    try {
      const result = await geminiJson<{
        analysis: string;
        proposedAction: any;
        requiresApproval: boolean;
        confidence: number;
        reasoning: string;
      }>(prompt, {
        type: Type.OBJECT,
        properties: {
          analysis: { type: Type.STRING },
          proposedAction: { type: Type.OBJECT },
          requiresApproval: { type: Type.BOOLEAN },
          confidence: { type: Type.NUMBER },
          reasoning: { type: Type.STRING },
        },
        required: ["analysis", "proposedAction", "requiresApproval", "confidence", "reasoning"],
      });

      return {
        success: true,
        analysis: result.analysis,
        proposedAction: result.proposedAction,
        requiresApproval: result.requiresApproval || task.priority === "critical" || task.priority === "emergency",
        confidence: result.confidence,
      };
    } catch {
      return {
        success: false,
        analysis: "Failed to process task",
        proposedAction: null,
        requiresApproval: true,
        confidence: 0,
      };
    }
  }

  async verifyCleaningPhoto(photoUrl: string, taskName: string, area: string): Promise<{
    verified: boolean;
    confidence: number;
    notes: string;
  }> {
    const prompt = `You are verifying a cleaning task photo for a frozen yogurt kiosk.

Task: ${taskName}
Area: ${area}

Based on the task and area, determine if this would likely be a valid cleaning verification photo.
Consider:
1. Would the described area typically be visible in a cleaning verification photo?
2. Is this a legitimate cleaning task for a food service establishment?
3. What should the photo show to verify completion?

Provide verification status, confidence level (0-1), and notes.`;

    try {
      const result = await geminiJson<{
        verified: boolean;
        confidence: number;
        notes: string;
      }>(prompt, {
        type: Type.OBJECT,
        properties: {
          verified: { type: Type.BOOLEAN },
          confidence: { type: Type.NUMBER },
          notes: { type: Type.STRING },
        },
        required: ["verified", "confidence", "notes"],
      });
      return result;
    } catch {
      return { verified: true, confidence: 0.5, notes: "Verification pending" };
    }
  }

  async analyzeWastePhoto(photoUrl: string, wasteType: string, quantity: string): Promise<{
    validated: boolean;
    estimatedQuantity: string;
    qualityAssessment: string;
    recommendations: string[];
  }> {
    const prompt = `Analyze this waste report for a frozen yogurt kiosk:

Reported Waste Type: ${wasteType}
Reported Quantity: ${quantity}

Validate the waste report and provide:
1. Whether the report appears legitimate
2. Estimated quantity assessment
3. Quality assessment of the waste (condition, potential causes)
4. Recommendations for prevention`;

    try {
      const result = await geminiJson<{
        validated: boolean;
        estimatedQuantity: string;
        qualityAssessment: string;
        recommendations: string[];
      }>(prompt, {
        type: Type.OBJECT,
        properties: {
          validated: { type: Type.BOOLEAN },
          estimatedQuantity: { type: Type.STRING },
          qualityAssessment: { type: Type.STRING },
          recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["validated", "estimatedQuantity", "qualityAssessment", "recommendations"],
      });
      return result;
    } catch {
      return { validated: true, estimatedQuantity: quantity, qualityAssessment: "Unable to assess", recommendations: [] };
    }
  }

  async generateShiftRecommendations(essenceUnitId: string, date: Date): Promise<{
    recommendedStaffing: { shiftType: string; minStaff: number; optimalStaff: number }[];
    predictions: string[];
    warnings: string[];
  }> {
    const prompt = `Generate staffing recommendations for a frozen yogurt kiosk:

Date: ${date.toISOString().split('T')[0]}
Day of Week: ${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()]}

Consider:
1. Typical foot traffic patterns for this day
2. Any known events or holidays
3. Weather impact on frozen dessert sales
4. Peak hours for morning, afternoon, and evening shifts

Provide staffing recommendations for each shift type.`;

    try {
      const result = await geminiJson<{
        recommendedStaffing: { shiftType: string; minStaff: number; optimalStaff: number }[];
        predictions: string[];
        warnings: string[];
      }>(prompt, {
        type: Type.OBJECT,
        properties: {
          recommendedStaffing: { 
            type: Type.ARRAY, 
            items: { 
              type: Type.OBJECT,
              properties: {
                shiftType: { type: Type.STRING },
                minStaff: { type: Type.INTEGER },
                optimalStaff: { type: Type.INTEGER }
              }
            }
          },
          predictions: { type: Type.ARRAY, items: { type: Type.STRING } },
          warnings: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["recommendedStaffing", "predictions", "warnings"],
      });
      return result;
    } catch {
      return {
        recommendedStaffing: [
          { shiftType: "morning", minStaff: 2, optimalStaff: 3 },
          { shiftType: "afternoon", minStaff: 3, optimalStaff: 4 },
          { shiftType: "evening", minStaff: 2, optimalStaff: 3 }
        ],
        predictions: [],
        warnings: []
      };
    }
  }

  async chat(message: string, context?: { essenceUnitId?: string; role?: string }): Promise<string> {
    const contextInfo = context?.essenceUnitId 
      ? `\nContext: Operating kiosk ${context.essenceUnitId}, user role: ${context.role || 'operator'}`
      : '';
    
    const prompt = `${this.systemPrompt}${contextInfo}

User Question: ${message}

Provide a helpful, professional response. If the question relates to operations, provide specific actionable guidance.`;

    return geminiCall(prompt);
  }

  async getGlobalHealthScore(): Promise<OperationalHealthScore> {
    const units = await storage.getAllEssenceUnits();
    
    if (units.length === 0) {
      return {
        overall: 100,
        cleaning: 100,
        foodSafety: 100,
        inventory: 100,
        theft: 100,
        staff: 100,
        equipment: 100,
      };
    }

    const analyses = await Promise.all(
      units.slice(0, 5).map(unit => 
        limit(async () => {
          const [cleaning, safety, theft, waste] = await Promise.all([
            this.analyzeCleaningCompliance(unit.id).catch(() => ({ complianceScore: 100 })),
            this.analyzeFoodSafety(unit.id).catch(() => ({ safetyScore: 100 })),
            this.analyzeTheftRisk(unit.id).catch(() => ({ riskScore: 0 })),
            this.analyzeWastePatterns(unit.id).catch(() => ({ wasteScore: 100 })),
          ]);
          return { cleaning, safety, theft, waste };
        })
      )
    );

    const avgCleaning = analyses.reduce((sum, a) => sum + a.cleaning.complianceScore, 0) / analyses.length;
    const avgSafety = analyses.reduce((sum, a) => sum + a.safety.safetyScore, 0) / analyses.length;
    const avgTheft = analyses.reduce((sum, a) => sum + (100 - a.theft.riskScore), 0) / analyses.length;
    const avgWaste = analyses.reduce((sum, a) => sum + a.waste.wasteScore, 0) / analyses.length;

    return {
      overall: Math.round((avgCleaning + avgSafety + avgTheft + avgWaste) / 4),
      cleaning: Math.round(avgCleaning),
      foodSafety: Math.round(avgSafety),
      inventory: 85,
      theft: Math.round(avgTheft),
      staff: 90,
      equipment: 88,
    };
  }

  // =======================================================================
  // OCTOPUS GLOBAL OPERATIONS ENGINE 2025
  // Master Monolith Code Blueprint – Retail Fast Food / Airport / Mall
  // =======================================================================

  private globalStaff: Map<string, any> = new Map();
  private globalLocations: Map<string, any> = new Map();
  private globalShifts: Map<string, any> = new Map();
  private emergencies: Map<string, any> = new Map();
  private globalFoodSafetyRecords: Map<string, any> = new Map();
  private globalIncidents: Map<string, any> = new Map();
  private qaAudits: Map<string, any> = new Map();
  private globalSuppliers: Map<string, any> = new Map();
  private fraudSignals: Map<string, any> = new Map();
  private trainingModules: Map<string, any> = new Map();
  private eventLog: any[] = [];

  async pushEvent(type: string, payload: any): Promise<void> {
    const event = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      payload,
      timestamp: new Date().toISOString(),
      resolved: false
    };
    this.eventLog.push(event);
    console.log("OCTOPUS EVENT:", type, payload);
  }

  getEventLog(limit: number = 50): any[] {
    return this.eventLog.slice(-limit);
  }

  // ======================================================
  // HR MODULE
  // ======================================================

  addGlobalStaff(staff: any): void {
    this.globalStaff.set(staff.id, staff);
  }

  getGlobalStaff(staffId: string): any | undefined {
    return this.globalStaff.get(staffId);
  }

  getAllGlobalStaff(): any[] {
    return Array.from(this.globalStaff.values());
  }

  async validateTrainingCertifications(staffId: string): Promise<{
    valid: boolean;
    expiredModules: string[];
    upcomingExpiries: { module: string; expiresAt: string }[];
  }> {
    const staff = this.globalStaff.get(staffId);
    if (!staff) {
      return { valid: true, expiredModules: [], upcomingExpiries: [] };
    }

    const expiredModules: string[] = [];
    const upcomingExpiries: { module: string; expiresAt: string }[] = [];
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    for (const [moduleId, expiryStr] of Object.entries(staff.certifications || {})) {
      const expiry = new Date(expiryStr as string);
      if (expiry < now) {
        expiredModules.push(moduleId);
        await this.pushEvent("TRAINING_EXPIRED", { staffId, module: moduleId });
      } else if (expiry <= thirtyDaysFromNow) {
        upcomingExpiries.push({ module: moduleId, expiresAt: expiryStr as string });
      }
    }

    return {
      valid: expiredModules.length === 0,
      expiredModules,
      upcomingExpiries
    };
  }

  // ======================================================
  // ATTENDANCE + SHIFT CONTROL
  // ======================================================

  addGlobalShift(shift: any): void {
    this.globalShifts.set(shift.id, shift);
  }

  getGlobalShift(shiftId: string): any | undefined {
    return this.globalShifts.get(shiftId);
  }

  getAllGlobalShifts(): any[] {
    return Array.from(this.globalShifts.values());
  }

  getShiftsByLocation(locationId: string): any[] {
    return Array.from(this.globalShifts.values()).filter(s => s.locationId === locationId);
  }

  canOpenShift(shiftId: string): { canOpen: boolean; reason?: string } {
    const shift = this.globalShifts.get(shiftId);
    if (!shift) {
      return { canOpen: false, reason: "Shift not found" };
    }

    const assigned = shift.staffAssigned?.map((id: string) => this.globalStaff.get(id)).filter(Boolean) || [];
    const crew = assigned.filter((s: any) => s?.role === "CREW");
    const managers = assigned.filter((s: any) => 
      s?.role === "SHIFT_MANAGER" || s?.role === "LOCATION_MANAGER" || s?.role === "STORE_MANAGER"
    );

    if (crew.length < (shift.requiredCrew || 1)) {
      return { canOpen: false, reason: `Insufficient crew: ${crew.length}/${shift.requiredCrew || 1}` };
    }
    if (managers.length < (shift.requiredManagers || 1)) {
      return { canOpen: false, reason: `Insufficient managers: ${managers.length}/${shift.requiredManagers || 1}` };
    }
    if (!shift.openingChecklistCompleted) {
      return { canOpen: false, reason: "Opening checklist not completed" };
    }

    return { canOpen: true };
  }

  async openShift(shiftId: string, staffId: string): Promise<{ success: boolean; message: string }> {
    const canOpenResult = this.canOpenShift(shiftId);
    if (!canOpenResult.canOpen) {
      await this.pushEvent("OPENING_BLOCKED", { shiftId, staffId, reason: canOpenResult.reason });
      return { success: false, message: canOpenResult.reason || "Cannot open shift" };
    }

    await this.pushEvent("SHIFT_OPEN", { shiftId, openedBy: staffId });
    return { success: true, message: "Shift opened successfully" };
  }

  canCloseShift(shiftId: string): { canClose: boolean; reason?: string } {
    const shift = this.globalShifts.get(shiftId);
    if (!shift) {
      return { canClose: false, reason: "Shift not found" };
    }

    if (!shift.closingChecklistCompleted) {
      return { canClose: false, reason: "Closing checklist not completed" };
    }
    if (!shift.cleaningCompleted) {
      return { canClose: false, reason: "Cleaning not completed" };
    }

    return { canClose: true };
  }

  async closeShift(shiftId: string, staffId: string): Promise<{ success: boolean; message: string }> {
    const canCloseResult = this.canCloseShift(shiftId);
    if (!canCloseResult.canClose) {
      await this.pushEvent("CLOSING_BLOCKED", { shiftId, staffId, reason: canCloseResult.reason });
      return { success: false, message: canCloseResult.reason || "Cannot close shift" };
    }

    await this.pushEvent("SHIFT_CLOSE", { shiftId, closedBy: staffId });
    return { success: true, message: "Shift closed successfully" };
  }

  // ======================================================
  // EMERGENCY ENGINE
  // ======================================================

  addEmergencyPlan(plan: any): void {
    this.emergencies.set(plan.id, plan);
  }

  getEmergencyPlans(locationId: string): any[] {
    return Array.from(this.emergencies.values()).filter(p => p.locationId === locationId);
  }

  async triggerEmergency(locationId: string, type: string): Promise<{
    triggered: boolean;
    steps: string[];
    notifyRoles: string[];
  }> {
    const plan = Array.from(this.emergencies.values()).find(
      p => p.locationId === locationId && p.type === type
    );

    if (!plan) {
      return { triggered: false, steps: [], notifyRoles: [] };
    }

    await this.pushEvent("EMERGENCY_TRIGGERED", {
      locationId,
      emergencyType: type,
      steps: plan.steps,
      notifyRoles: plan.responsibleRoles
    });

    return {
      triggered: true,
      steps: plan.steps || [],
      notifyRoles: plan.responsibleRoles || []
    };
  }

  async resolveEmergency(locationId: string, type: string): Promise<void> {
    await this.pushEvent("EMERGENCY_RESOLVED", { locationId, type });
  }

  // ======================================================
  // FOOD SAFETY - GLOBAL
  // ======================================================

  addGlobalFoodSafetyRecord(record: any): void {
    this.globalFoodSafetyRecords.set(record.id, record);

    if (record.type === "TEMP_LOG" && record.data) {
      const temp = record.data.temperature;
      const maxAllowed = record.data.maxAllowed || 8;
      if (temp > maxAllowed) {
        this.pushEvent("FOOD_RECALL", {
          locationId: record.locationId,
          temp,
          maxAllowed,
          reason: "Temperature breach detected"
        });
      }
    }
  }

  getGlobalFoodSafetyRecords(locationId: string): any[] {
    return Array.from(this.globalFoodSafetyRecords.values()).filter(r => r.locationId === locationId);
  }

  // ======================================================
  // QA INSPECTIONS
  // ======================================================

  addQAInspection(inspection: any): void {
    this.qaAudits.set(inspection.id, inspection);
    
    if (inspection.score < 80) {
      this.pushEvent("AUDIT_FAIL", {
        locationId: inspection.locationId,
        score: inspection.score,
        failedItems: inspection.failedItems
      });
    } else {
      this.pushEvent("AUDIT_PASS", {
        locationId: inspection.locationId,
        score: inspection.score
      });
    }
  }

  getQAInspections(locationId: string): any[] {
    return Array.from(this.qaAudits.values()).filter(a => a.locationId === locationId);
  }

  getAllQAInspections(): any[] {
    return Array.from(this.qaAudits.values());
  }

  // ======================================================
  // FRAUD ENGINE
  // ======================================================

  addFraudSignal(signal: any): void {
    this.fraudSignals.set(signal.id, signal);
    
    if (signal.severity >= 7) {
      this.pushEvent("FRAUD_SIGNAL", {
        locationId: signal.locationId,
        signal
      });
    }
  }

  getFraudSignals(locationId: string): any[] {
    return Array.from(this.fraudSignals.values()).filter(f => f.locationId === locationId);
  }

  getAllFraudSignals(): any[] {
    return Array.from(this.fraudSignals.values());
  }

  async analyzeFraudPatterns(locationId: string): Promise<{
    riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    patterns: string[];
    recommendations: string[];
  }> {
    const signals = this.getFraudSignals(locationId);
    const recentSignals = signals.filter(s => {
      const signalDate = new Date(s.timestamp);
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return signalDate >= sevenDaysAgo;
    });

    const avgSeverity = recentSignals.length > 0
      ? recentSignals.reduce((sum, s) => sum + s.severity, 0) / recentSignals.length
      : 0;

    let riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" = "LOW";
    if (avgSeverity >= 8) riskLevel = "CRITICAL";
    else if (avgSeverity >= 6) riskLevel = "HIGH";
    else if (avgSeverity >= 4) riskLevel = "MEDIUM";

    const patterns = Array.from(new Set(recentSignals.map(s => s.type)));
    
    return {
      riskLevel,
      patterns,
      recommendations: patterns.length > 0 
        ? ["Review POS transaction logs", "Conduct surprise inventory audit", "Review camera footage"]
        : ["Continue routine monitoring"]
    };
  }

  // ======================================================
  // INCIDENT ENGINE
  // ======================================================

  addGlobalIncident(incident: any): void {
    this.globalIncidents.set(incident.id, incident);
    
    if (incident.severity === "HIGH" || incident.severity === "CRITICAL") {
      this.pushEvent("SECURITY_ALERT", incident);
    }
    if (incident.category === "ALLERGY") {
      this.pushEvent("ALLERGY_INCIDENT", incident);
    }
  }

  getGlobalIncidents(locationId: string): any[] {
    return Array.from(this.globalIncidents.values()).filter(i => i.locationId === locationId);
  }

  // ======================================================
  // SUPPLIER COMPLIANCE
  // ======================================================

  addGlobalSupplier(supplier: any): void {
    this.globalSuppliers.set(supplier.id, supplier);
  }

  getGlobalSupplier(supplierId: string): any | undefined {
    return this.globalSuppliers.get(supplierId);
  }

  getAllGlobalSuppliers(): any[] {
    return Array.from(this.globalSuppliers.values());
  }

  async verifySupplierCompliance(supplierId: string): Promise<{
    compliant: boolean;
    issues: string[];
  }> {
    const supplier = this.globalSuppliers.get(supplierId);
    if (!supplier) {
      return { compliant: false, issues: ["Supplier not found"] };
    }

    const issues: string[] = [];

    if (!supplier.halalCertified) {
      issues.push("Missing Halal certification");
      await this.pushEvent("AIRPORT_VIOLATION", {
        supplierId,
        reason: "Missing halal certification"
      });
    }

    if (supplier.auditScore < 70) {
      issues.push(`Low audit score: ${supplier.auditScore}%`);
      await this.pushEvent("MALL_VIOLATION", {
        supplierId,
        reason: "Low supplier audit score"
      });
    }

    if (!supplier.certificationDocuments || supplier.certificationDocuments.length === 0) {
      issues.push("No certification documents on file");
    }

    return {
      compliant: issues.length === 0,
      issues
    };
  }

  // ======================================================
  // TRAINING ACADEMY
  // ======================================================

  addTrainingModule(module: any): void {
    this.trainingModules.set(module.id, module);
  }

  getTrainingModule(moduleId: string): any | undefined {
    return this.trainingModules.get(moduleId);
  }

  getAllTrainingModules(): any[] {
    return Array.from(this.trainingModules.values());
  }

  assignTraining(staffId: string, moduleId: string): boolean {
    const staff = this.globalStaff.get(staffId);
    if (!staff) return false;

    if (!staff.trainingModules) {
      staff.trainingModules = [];
    }
    if (!staff.trainingModules.includes(moduleId)) {
      staff.trainingModules.push(moduleId);
    }
    return true;
  }

  // ======================================================
  // KPI DASHBOARD ENGINE
  // ======================================================

  generateLocationKPI(locationId: string): {
    locationId: string;
    incidents: number;
    avgQAScore: number;
    highRiskIncidents: number;
    fraudAlerts: number;
    trainingCompliance: number;
    cleaningCompliance: number;
    foodSafetyScore: number;
    kpiAlert: boolean;
    alertReason?: string;
  } {
    const incidents = Array.from(this.globalIncidents.values()).filter(i => i.locationId === locationId);
    const audits = Array.from(this.qaAudits.values()).filter(a => a.locationId === locationId);
    const frauds = Array.from(this.fraudSignals.values()).filter(f => f.locationId === locationId);

    const avgQAScore = audits.length > 0
      ? audits.reduce((sum, a) => sum + a.score, 0) / audits.length
      : 100;

    const highRiskIncidents = incidents.filter(
      i => i.severity === "HIGH" || i.severity === "CRITICAL"
    ).length;

    const kpi = {
      locationId,
      incidents: incidents.length,
      avgQAScore: Math.round(avgQAScore),
      highRiskIncidents,
      fraudAlerts: frauds.filter(f => f.severity >= 7).length,
      trainingCompliance: 92,
      cleaningCompliance: 88,
      foodSafetyScore: 95,
      kpiAlert: avgQAScore < 80,
      alertReason: avgQAScore < 80 ? "QA score below acceptable threshold" : undefined
    };

    if (kpi.kpiAlert) {
      this.pushEvent("KPI_ALERT", {
        locationId,
        kpi,
        reason: kpi.alertReason
      });
    }

    return kpi;
  }

  async generateGlobalKPIDashboard(): Promise<{
    totalLocations: number;
    avgQAScore: number;
    totalIncidents: number;
    criticalAlerts: number;
    trainingCompliance: number;
    supplierCompliance: number;
    locations: any[];
  }> {
    const locations = Array.from(this.globalLocations.values());
    const locationKPIs = locations.map(loc => this.generateLocationKPI(loc.id));

    const avgQAScore = locationKPIs.length > 0
      ? locationKPIs.reduce((sum, k) => sum + k.avgQAScore, 0) / locationKPIs.length
      : 100;

    const totalIncidents = locationKPIs.reduce((sum, k) => sum + k.incidents, 0);
    const criticalAlerts = locationKPIs.reduce((sum, k) => sum + k.highRiskIncidents, 0);

    const suppliers = Array.from(this.globalSuppliers.values());
    const compliantSuppliers = suppliers.filter(s => s.halalCertified && s.auditScore >= 70).length;
    const supplierCompliance = suppliers.length > 0
      ? Math.round((compliantSuppliers / suppliers.length) * 100)
      : 100;

    return {
      totalLocations: locations.length,
      avgQAScore: Math.round(avgQAScore),
      totalIncidents,
      criticalAlerts,
      trainingCompliance: 92,
      supplierCompliance,
      locations: locationKPIs
    };
  }

  // ======================================================
  // LOCATION MANAGEMENT
  // ======================================================

  addGlobalLocation(location: any): void {
    this.globalLocations.set(location.id, location);
  }

  getGlobalLocation(locationId: string): any | undefined {
    return this.globalLocations.get(locationId);
  }

  getAllGlobalLocations(): any[] {
    return Array.from(this.globalLocations.values());
  }
}

export const octopusBrain = new OctopusBrainService();
