// Essence Yogurt - Global Compliance, Risk and Operations Brain 2025
// AI-powered compliance auditing, fraud detection, and incident management

import { GoogleGenAI } from "@google/genai";
import { storage } from "../storage";

// Country codes supported
export type CountryCode = "SA" | "AE" | "IL" | "GR" | "AU" | "EU" | "OTHER";

// Risk event types
export type RiskEventType =
  | "POS_VOID_EXCESS"
  | "REFUND_EXCESS"
  | "AFTER_HOURS_ACCESS"
  | "WASTE_EXCESS"
  | "INVENTORY_SHRINKAGE"
  | "TEMPERATURE_BREACH"
  | "UNPAID_UTILITY"
  | "PERMIT_EXPIRED"
  | "INSURANCE_EXPIRED"
  | "INCIDENT_REPORTED";

// Incident categories
export type IncidentCategory =
  | "CUSTOMER_INJURY"
  | "STAFF_INJURY"
  | "FOOD_SAFETY"
  | "EQUIPMENT_FAILURE"
  | "UTILITY_ISSUE"
  | "HYGIENE_CLEANING"
  | "SECURITY"
  | "HARASSMENT_OR_CONDUCT"
  | "NEAR_MISS"
  | "OTHER";

// Severity levels
export type Severity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

// Compliance status
export type ComplianceStatus = "GREEN" | "AMBER" | "RED";

// AI Compliance Client
class AIComplianceClient {
  private genAI: GoogleGenAI | null = null;

  constructor() {
    const apiKey = process.env.AI_INTEGRATIONS_GEMINI_API_KEY;
    if (apiKey) {
      this.genAI = new GoogleGenAI({ apiKey });
    }
  }

  isConfigured(): boolean {
    return this.genAI !== null;
  }

  async analyzeCompliance(input: {
    countryCode: string;
    unitCode: string;
    permits: any[];
    insurances: any[];
    utilities: any[];
    wasteLogs: any[];
    temperatures: any[];
    riskEvents: any[];
  }): Promise<{
    overallStatus: ComplianceStatus;
    summary: string;
    requiredActions: string[];
    legalReferences: string[];
  }> {
    if (!this.genAI) {
      return {
        overallStatus: "AMBER",
        summary: "AI compliance engine not configured. Manual review required.",
        requiredActions: ["Configure AI engine for automated compliance analysis."],
        legalReferences: [],
      };
    }

    try {
      const prompt = `You are an expert compliance auditor for Essence Yogurt, a luxury frozen yogurt chain operating in ${input.countryCode}.

Analyze the following compliance data for unit ${input.unitCode} and provide a comprehensive audit:

PERMITS (${input.permits.length}):
${JSON.stringify(input.permits, null, 2)}

INSURANCES (${input.insurances.length}):
${JSON.stringify(input.insurances, null, 2)}

UTILITY BILLS (${input.utilities.length}):
${JSON.stringify(input.utilities, null, 2)}

WASTE LOGS (${input.wasteLogs.length}):
${JSON.stringify(input.wasteLogs, null, 2)}

TEMPERATURE READINGS (${input.temperatures.length}):
${JSON.stringify(input.temperatures, null, 2)}

RECENT RISK EVENTS (${input.riskEvents.length}):
${JSON.stringify(input.riskEvents, null, 2)}

Provide your analysis in this exact JSON format:
{
  "overallStatus": "GREEN" | "AMBER" | "RED",
  "summary": "Brief summary of compliance status",
  "requiredActions": ["Action 1", "Action 2"],
  "legalReferences": ["Reference 1", "Reference 2"]
}

Consider:
- Expired or soon-to-expire permits/insurances (RED if expired, AMBER if expires within 60 days)
- Overdue utility bills (RED if overdue)
- Temperature breaches (RED for food safety violations)
- Excessive waste patterns
- Unresolved risk events
- Country-specific regulations for ${input.countryCode}`;

      const model = this.genAI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
      });

      const response = await model;
      const text = response.text || "";

      // Parse JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          overallStatus: parsed.overallStatus || "AMBER",
          summary: parsed.summary || "Analysis complete",
          requiredActions: parsed.requiredActions || [],
          legalReferences: parsed.legalReferences || [],
        };
      }

      return {
        overallStatus: "AMBER",
        summary: "AI analysis completed but response format unclear.",
        requiredActions: ["Review compliance data manually."],
        legalReferences: [],
      };
    } catch (error) {
      console.error("AI compliance analysis error:", error);
      return {
        overallStatus: "AMBER",
        summary: "AI compliance analysis failed. Manual review required.",
        requiredActions: ["Manual compliance review needed."],
        legalReferences: [],
      };
    }
  }

  async triageIncident(input: {
    countryCode: string;
    category: IncidentCategory;
    title: string;
    description: string;
    locationInShop?: string;
    peopleInvolved?: string;
  }): Promise<{
    severity: Severity;
    summary: string;
    recommendedActions: string[];
    requiresRegulatorReport: boolean;
    regulatorDeadlineAt?: string;
  }> {
    if (!this.genAI) {
      return {
        severity: this.defaultSeverityForCategory(input.category),
        summary: "AI triage not configured. Using default severity based on category.",
        recommendedActions: [
          "Notify local manager",
          "Document all details",
          "Take photos if applicable",
          "Secure the area if needed",
        ],
        requiresRegulatorReport: input.category === "CUSTOMER_INJURY" || input.category === "STAFF_INJURY",
      };
    }

    try {
      const prompt = `You are a safety and compliance expert for Essence Yogurt in ${input.countryCode}.

Triage this incident and provide recommendations:

INCIDENT:
- Category: ${input.category}
- Title: ${input.title}
- Description: ${input.description}
- Location in Shop: ${input.locationInShop || "Not specified"}
- People Involved: ${input.peopleInvolved || "Not specified"}

Provide your triage in this exact JSON format:
{
  "severity": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "summary": "Brief triage summary",
  "recommendedActions": ["Action 1", "Action 2", "Action 3"],
  "requiresRegulatorReport": true | false,
  "regulatorDeadlineAt": "ISO date if applicable, or null"
}

Consider:
- Immediate safety concerns
- Legal obligations in ${input.countryCode}
- Food safety regulations
- Worker safety laws
- Customer liability
- Documentation requirements`;

      const model = this.genAI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
      });

      const response = await model;
      const text = response.text || "";

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          severity: parsed.severity || "MEDIUM",
          summary: parsed.summary || "Incident triaged",
          recommendedActions: parsed.recommendedActions || [],
          requiresRegulatorReport: Boolean(parsed.requiresRegulatorReport),
          regulatorDeadlineAt: parsed.regulatorDeadlineAt,
        };
      }

      return {
        severity: this.defaultSeverityForCategory(input.category),
        summary: "AI triage completed but response format unclear.",
        recommendedActions: ["Document all details", "Notify supervisor"],
        requiresRegulatorReport: false,
      };
    } catch (error) {
      console.error("AI incident triage error:", error);
      return {
        severity: this.defaultSeverityForCategory(input.category),
        summary: "AI triage failed. Using default assessment.",
        recommendedActions: ["Document all details", "Notify supervisor"],
        requiresRegulatorReport: false,
      };
    }
  }

  private defaultSeverityForCategory(category: IncidentCategory): Severity {
    switch (category) {
      case "CUSTOMER_INJURY":
      case "STAFF_INJURY":
      case "FOOD_SAFETY":
      case "SECURITY":
      case "HARASSMENT_OR_CONDUCT":
        return "HIGH";
      case "EQUIPMENT_FAILURE":
      case "UTILITY_ISSUE":
      case "HYGIENE_CLEANING":
        return "MEDIUM";
      case "NEAR_MISS":
      case "OTHER":
      default:
        return "LOW";
    }
  }
}

// Singleton instance
const aiCompliance = new AIComplianceClient();

// Helper functions
function daysBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

// Core compliance functions
export async function refreshPermitStatuses(essenceUnitId: string): Promise<void> {
  const permits = await storage.getRegulatoryPermitsByUnit(essenceUnitId);
  const today = new Date();

  for (const permit of permits) {
    if (!permit.expiryDate) continue;

    const expiryDate = new Date(permit.expiryDate);
    const daysToExpiry = daysBetween(today, expiryDate);
    let status: "valid" | "expires_soon" | "expired" = "valid";

    if (daysToExpiry <= 0) {
      status = "expired";
      await storage.createRiskEvent({
        essenceUnitId,
        riskType: "PERMIT_EXPIRED",
        severity: "CRITICAL",
        message: `Permit ${permit.permitType} is expired. Expiry date was ${permit.expiryDate}.`,
        detectedByAi: false,
      });
    } else if (daysToExpiry <= 60) {
      status = "expires_soon";
    }

    if (permit.status !== status) {
      await storage.updateRegulatoryPermit(permit.id, { status });
    }
  }
}

export async function refreshInsuranceStatuses(essenceUnitId: string): Promise<void> {
  const insurances = await storage.getInsuranceRecordsByUnit(essenceUnitId);
  const today = new Date();

  for (const policy of insurances) {
    if (!policy.expiryDate) continue;

    const expiryDate = new Date(policy.expiryDate);
    const daysToExpiry = daysBetween(today, expiryDate);
    let status: "VALID" | "EXPIRES_SOON" | "EXPIRED" = "VALID";

    if (daysToExpiry <= 0) {
      status = "EXPIRED";
      await storage.createRiskEvent({
        essenceUnitId,
        riskType: "INSURANCE_EXPIRED",
        severity: "CRITICAL",
        message: `Insurance ${policy.insuranceType} is expired.`,
        detectedByAi: false,
      });
    } else if (daysToExpiry <= 45) {
      status = "EXPIRES_SOON";
    }

    if (policy.status !== status) {
      await storage.updateInsuranceRecord(policy.id, { status, lastCheckedAt: new Date() });
    }
  }
}

export async function checkTemperatureBreaches(essenceUnitId: string): Promise<void> {
  const readings = await storage.getOutOfRangeReadings(essenceUnitId);

  for (const reading of readings) {
    const temp = parseFloat(String(reading.temperature));
    const readingType = reading.readingType?.toLowerCase() || "";
    const isFreezer = readingType.includes("freezer");
    const isFridge = readingType.includes("fridge") || readingType.includes("refriger");

    if (isFreezer && temp > -15) {
      await storage.createRiskEvent({
        essenceUnitId,
        riskType: "TEMPERATURE_BREACH",
        severity: "CRITICAL",
        message: `Freezer temperature above safe level at ${temp}°C`,
        detectedByAi: false,
      });
    }

    if (isFridge && temp > 5) {
      await storage.createRiskEvent({
        essenceUnitId,
        riskType: "TEMPERATURE_BREACH",
        severity: "HIGH",
        message: `Fridge temperature above safe level at ${temp}°C`,
        detectedByAi: false,
      });
    }
  }
}

// Fraud detection heuristics
export interface FraudCheckContext {
  essenceUnitId: string;
  last30DaySalesCount: number;
  last30DayRefundCount: number;
  last30DayVoidCount: number;
  wasteKgLast30Days: number;
  avgWasteKgBaseline: number;
}

export async function runFraudHeuristics(ctx: FraudCheckContext): Promise<void> {
  const ratioRefunds = ctx.last30DaySalesCount === 0
    ? 0
    : ctx.last30DayRefundCount / ctx.last30DaySalesCount;

  const ratioVoids = ctx.last30DaySalesCount === 0
    ? 0
    : ctx.last30DayVoidCount / ctx.last30DaySalesCount;

  if (ratioRefunds > 0.05) {
    await storage.createRiskEvent({
      essenceUnitId: ctx.essenceUnitId,
      riskType: "REFUND_EXCESS",
      severity: "MEDIUM",
      message: `Refund ratio high (${Math.round(ratioRefunds * 100)}% of sales). Check staff behaviour.`,
      detectedByAi: false,
    });
  }

  if (ratioVoids > 0.05) {
    await storage.createRiskEvent({
      essenceUnitId: ctx.essenceUnitId,
      riskType: "POS_VOID_EXCESS",
      severity: "HIGH",
      message: `Void ratio high (${Math.round(ratioVoids * 100)}%). Possible staff fraud or training issue.`,
      detectedByAi: false,
    });
  }

  if (ctx.wasteKgLast30Days > ctx.avgWasteKgBaseline * 1.5) {
    await storage.createRiskEvent({
      essenceUnitId: ctx.essenceUnitId,
      riskType: "WASTE_EXCESS",
      severity: "MEDIUM",
      message: "Waste is more than 150% of baseline. Check expiry management and staff handling.",
      detectedByAi: false,
    });
  }
}

// AI Compliance Sweep
export async function runAIComplianceSweep(essenceUnitId: string): Promise<{
  overallStatus: ComplianceStatus;
  summary: string;
  requiredActions: string[];
  legalReferences: string[];
}> {
  const startTime = Date.now();

  // Gather all compliance data
  const [permits, insurances, utilities, wasteLogs, temperatures, riskEvents, unit] = await Promise.all([
    storage.getRegulatoryPermitsByUnit(essenceUnitId),
    storage.getInsuranceRecordsByUnit(essenceUnitId),
    storage.getUtilityBillsByUnit(essenceUnitId, 90),
    storage.getWasteLogsByUnit(essenceUnitId, 90),
    storage.getTemperatureReadingsByEssenceUnit(essenceUnitId, 7),
    storage.getRiskEventsByUnit(essenceUnitId, 90),
    storage.getEssenceUnitById(essenceUnitId),
  ]);

  const countryCode = unit?.country || "OTHER";

  // Run AI analysis
  const audit = await aiCompliance.analyzeCompliance({
    countryCode,
    unitCode: unit?.code || essenceUnitId,
    permits,
    insurances,
    utilities,
    wasteLogs,
    temperatures,
    riskEvents,
  });

  // Log the audit
  await storage.createComplianceAuditLog({
    essenceUnitId,
    countryCode,
    auditType: "DAILY_SWEEP",
    overallStatus: audit.overallStatus,
    aiSummary: audit.summary,
    requiredActions: JSON.stringify(audit.requiredActions),
    legalReferences: JSON.stringify(audit.legalReferences),
    permitsChecked: permits.length,
    insurancesChecked: insurances.length,
    issuesFound: audit.requiredActions.length,
    aiModelUsed: "gemini-2.0-flash",
    processingTimeMs: Date.now() - startTime,
  });

  // Create risk event if not GREEN
  if (audit.overallStatus !== "GREEN") {
    await storage.createRiskEvent({
      essenceUnitId,
      riskType: "PERMIT_EXPIRED",
      severity: audit.overallStatus === "RED" ? "HIGH" : "MEDIUM",
      message: `AI compliance sweep: ${audit.summary}`,
      detectedByAi: true,
    });
  }

  return audit;
}

// Incident reporting
export async function reportIncident(input: {
  essenceUnitId: string;
  reportedByUserId: string;
  category: IncidentCategory;
  title: string;
  description: string;
  incidentTime?: Date;
  locationInShop?: string;
  peopleInvolved?: string;
  attachments?: { url: string; type: string }[];
}): Promise<{
  id: string;
  severity: Severity;
  aiTriageSummary: string;
  aiRecommendedActions: string[];
  requiresRegulatorReport: boolean;
}> {
  // Get unit info for country code
  const unit = await storage.getEssenceUnitById(input.essenceUnitId);
  const countryCode = unit?.country || "OTHER";

  // AI triage
  const triage = await aiCompliance.triageIncident({
    countryCode,
    category: input.category,
    title: input.title,
    description: input.description,
    locationInShop: input.locationInShop,
    peopleInvolved: input.peopleInvolved,
  });

  // Create incident record
  const incident = await storage.createIncidentRecord({
    essenceUnitId: input.essenceUnitId,
    reportedByUserId: input.reportedByUserId,
    incidentTime: input.incidentTime,
    category: input.category,
    severity: triage.severity,
    title: input.title,
    description: input.description,
    locationInShop: input.locationInShop,
    peopleInvolved: input.peopleInvolved,
    attachments: input.attachments ? JSON.stringify(input.attachments) : undefined,
    aiTriageSummary: triage.summary,
    aiRecommendedActions: JSON.stringify(triage.recommendedActions),
    requiresRegulatorReport: triage.requiresRegulatorReport,
    regulatorDeadlineAt: triage.regulatorDeadlineAt ? new Date(triage.regulatorDeadlineAt) : undefined,
    status: "OPEN",
  });

  // Create linked risk event
  await storage.createRiskEvent({
    essenceUnitId: input.essenceUnitId,
    riskType: "INCIDENT_REPORTED",
    severity: triage.severity,
    message: `[Incident] ${input.title} - ${input.category} - ${triage.summary}`,
    detectedByAi: true,
  });

  // If regulator report needed, create critical alert
  if (triage.requiresRegulatorReport) {
    await storage.createRiskEvent({
      essenceUnitId: input.essenceUnitId,
      riskType: "INCIDENT_REPORTED",
      severity: "CRITICAL",
      message: `Regulator report may be required. Deadline: ${triage.regulatorDeadlineAt || "See local law"}`,
      detectedByAi: true,
    });
  }

  return {
    id: incident.id,
    severity: triage.severity,
    aiTriageSummary: triage.summary,
    aiRecommendedActions: triage.recommendedActions,
    requiresRegulatorReport: triage.requiresRegulatorReport,
  };
}

// Daily compliance sweep for all active units
export async function runDailyComplianceSweepAllUnits(): Promise<{
  unitsProcessed: number;
  issues: number;
}> {
  const units = await storage.getAllEssenceUnits();
  const activeUnits = units.filter(u => u.isActive);
  let totalIssues = 0;

  for (const unit of activeUnits) {
    await refreshPermitStatuses(unit.id);
    await refreshInsuranceStatuses(unit.id);
    await checkTemperatureBreaches(unit.id);
    const audit = await runAIComplianceSweep(unit.id);
    totalIssues += audit.requiredActions.length;
  }

  return {
    unitsProcessed: activeUnits.length,
    issues: totalIssues,
  };
}

export { aiCompliance };
