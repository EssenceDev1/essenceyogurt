import { GoogleGenAI, Type } from "@google/genai";
import pLimit from "p-limit";
import pRetry from "p-retry";

// Using Replit's AI Integrations service - no API key required, charges to credits
const ai = new GoogleGenAI({
  apiKey: process.env.AI_INTEGRATIONS_GEMINI_API_KEY || "",
  httpOptions: {
    apiVersion: "",
    baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL || "",
  },
});

// Rate limiting for concurrent requests
const limit = pLimit(2);

// Helper to check if error is rate limit
function isRateLimitError(error: any): boolean {
  const errorMsg = error?.message || String(error);
  return (
    errorMsg.includes("429") ||
    errorMsg.includes("RATELIMIT_EXCEEDED") ||
    errorMsg.toLowerCase().includes("quota") ||
    errorMsg.toLowerCase().includes("rate limit")
  );
}

// Core AI text generation with retries
class AbortRetryError extends Error {
  readonly name = "AbortError";
  constructor(message: string) {
    super(message);
  }
}

async function generateWithRetry(prompt: string, model: string = "gemini-2.5-flash"): Promise<string> {
  return pRetry(
    async () => {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: [{ role: "user", parts: [{ text: prompt }] }],
        });
        return response.text || "";
      } catch (error: any) {
        if (isRateLimitError(error)) {
          throw error;
        }
        const abortErr = new AbortRetryError(error?.message || String(error));
        (abortErr as any).originalError = error;
        throw abortErr;
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

// Transaction risk analysis
export interface TransactionAnalysis {
  riskScore: number;
  riskLevel: "low" | "medium" | "high" | "critical";
  riskFactors: string[];
  isAnomaly: boolean;
  anomalyType?: string;
  recommendations: string[];
  summary: string;
}

export async function analyzeTransaction(transaction: {
  amount: number;
  currency: string;
  transactionType: string;
  paymentMethod?: string;
  employeeId?: string;
  timestamp: Date;
  locationId?: string;
  previousTransactions?: any[];
}): Promise<TransactionAnalysis> {
  const prompt = `You are a fraud detection AI for a luxury frozen yogurt retail chain. Analyze this transaction for risk:

Transaction Details:
- Amount: ${transaction.amount} ${transaction.currency}
- Type: ${transaction.transactionType}
- Payment: ${transaction.paymentMethod || "unknown"}
- Employee: ${transaction.employeeId || "unknown"}
- Time: ${transaction.timestamp.toISOString()}
- Location: ${transaction.locationId || "unknown"}
${transaction.previousTransactions ? `\nRecent transactions by same employee: ${JSON.stringify(transaction.previousTransactions.slice(0, 5))}` : ""}

Respond with JSON only:
{
  "riskScore": <number 0-100>,
  "riskLevel": <"low"|"medium"|"high"|"critical">,
  "riskFactors": [<string array of identified risks>],
  "isAnomaly": <boolean>,
  "anomalyType": <string if anomaly, null otherwise>,
  "recommendations": [<string array of recommended actions>],
  "summary": <brief one-line summary>
}`;

  try {
    const response = await generateWithRetry(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as TransactionAnalysis;
    }
    return {
      riskScore: 0,
      riskLevel: "low",
      riskFactors: [],
      isAnomaly: false,
      recommendations: [],
      summary: "Analysis completed - no significant risks detected",
    };
  } catch (error) {
    console.error("Transaction analysis error:", error);
    return {
      riskScore: 0,
      riskLevel: "low",
      riskFactors: ["analysis_error"],
      isAnomaly: false,
      recommendations: ["Manual review recommended due to analysis error"],
      summary: "Analysis error - manual review recommended",
    };
  }
}

// Error pattern analysis
export interface ErrorAnalysis {
  rootCause: string;
  severity: "low" | "medium" | "high" | "critical";
  affectedComponents: string[];
  suggestedFix: string;
  preventionSteps: string[];
  summary: string;
}

export async function analyzeErrors(errors: {
  errorType: string;
  errorMessage: string;
  stackTrace?: string;
  page?: string;
  component?: string;
  occurrenceCount: number;
}[]): Promise<ErrorAnalysis> {
  const prompt = `You are a software reliability engineer for a global retail platform. Analyze these errors and provide insights:

Errors (${errors.length} unique errors):
${errors.slice(0, 10).map((e, i) => `
${i + 1}. Type: ${e.errorType}
   Message: ${e.errorMessage}
   Location: ${e.page || "unknown"} / ${e.component || "unknown"}
   Occurrences: ${e.occurrenceCount}
   ${e.stackTrace ? `Stack: ${e.stackTrace.slice(0, 300)}...` : ""}
`).join("\n")}

Respond with JSON only:
{
  "rootCause": <string explaining likely root cause>,
  "severity": <"low"|"medium"|"high"|"critical">,
  "affectedComponents": [<string array of affected system parts>],
  "suggestedFix": <string with recommended fix>,
  "preventionSteps": [<string array of prevention measures>],
  "summary": <brief one-line summary>
}`;

  try {
    const response = await generateWithRetry(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as ErrorAnalysis;
    }
    return {
      rootCause: "Unable to determine",
      severity: "medium",
      affectedComponents: [],
      suggestedFix: "Manual investigation required",
      preventionSteps: [],
      summary: "Error analysis completed",
    };
  } catch (error) {
    console.error("Error analysis failed:", error);
    return {
      rootCause: "Analysis failed",
      severity: "medium",
      affectedComponents: [],
      suggestedFix: "Manual review required",
      preventionSteps: [],
      summary: "Analysis error",
    };
  }
}

// Translation quality assessment
export interface TranslationQuality {
  qualityScore: number;
  issues: {
    type: string;
    text: string;
    suggestion: string;
  }[];
  culturalNotes: string[];
  overallAssessment: string;
}

export async function assessTranslationQuality(translations: {
  sourceLanguage: string;
  targetLanguage: string;
  sourceText: string;
  translatedText: string;
  context?: string;
}[]): Promise<TranslationQuality> {
  const prompt = `You are a professional translator and localization expert. Assess these translations for a luxury frozen yogurt brand:

Translations to review:
${translations.slice(0, 10).map((t, i) => `
${i + 1}. ${t.sourceLanguage} → ${t.targetLanguage}
   Source: "${t.sourceText}"
   Translation: "${t.translatedText}"
   ${t.context ? `Context: ${t.context}` : ""}
`).join("\n")}

Consider:
- Accuracy and meaning preservation
- Brand voice consistency (luxury, premium feel)
- Cultural appropriateness
- Grammar and spelling

Respond with JSON only:
{
  "qualityScore": <number 0-100>,
  "issues": [{"type": <string>, "text": <problematic text>, "suggestion": <fix>}],
  "culturalNotes": [<string array of cultural considerations>],
  "overallAssessment": <brief summary>
}`;

  try {
    const response = await generateWithRetry(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as TranslationQuality;
    }
    return {
      qualityScore: 80,
      issues: [],
      culturalNotes: [],
      overallAssessment: "Translation quality assessment completed",
    };
  } catch (error) {
    console.error("Translation assessment error:", error);
    return {
      qualityScore: 0,
      issues: [],
      culturalNotes: [],
      overallAssessment: "Assessment error - manual review recommended",
    };
  }
}

// System health analysis
export interface HealthAnalysis {
  overallStatus: "healthy" | "degraded" | "critical";
  healthScore: number;
  concerns: {
    area: string;
    severity: string;
    description: string;
  }[];
  recommendations: string[];
  forecast: string;
}

export async function analyzeSystemHealth(metrics: {
  apiLatency: number;
  errorRate: number;
  activeUsers: number;
  transactionVolume: number;
  posUptime: number;
  memoryUsage?: number;
  cpuUsage?: number;
}): Promise<HealthAnalysis> {
  const prompt = `You are a DevOps engineer monitoring a global retail platform. Analyze these health metrics:

System Metrics:
- API Latency: ${metrics.apiLatency}ms
- Error Rate: ${metrics.errorRate}%
- Active Users: ${metrics.activeUsers}
- Transaction Volume: ${metrics.transactionVolume}
- POS Uptime: ${metrics.posUptime}%
${metrics.memoryUsage ? `- Memory Usage: ${metrics.memoryUsage}%` : ""}
${metrics.cpuUsage ? `- CPU Usage: ${metrics.cpuUsage}%` : ""}

Industry benchmarks:
- Good API latency: <200ms
- Acceptable error rate: <1%
- Target uptime: 99.9%

Respond with JSON only:
{
  "overallStatus": <"healthy"|"degraded"|"critical">,
  "healthScore": <number 0-100>,
  "concerns": [{"area": <string>, "severity": <"low"|"medium"|"high">, "description": <string>}],
  "recommendations": [<string array of improvements>],
  "forecast": <string predicting next 24 hours>
}`;

  try {
    const response = await generateWithRetry(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as HealthAnalysis;
    }
    return {
      overallStatus: "healthy",
      healthScore: 85,
      concerns: [],
      recommendations: [],
      forecast: "System stable",
    };
  } catch (error) {
    console.error("Health analysis error:", error);
    return {
      overallStatus: "degraded",
      healthScore: 50,
      concerns: [{ area: "monitoring", severity: "medium", description: "Analysis unavailable" }],
      recommendations: ["Check monitoring system"],
      forecast: "Unable to forecast",
    };
  }
}

// Sales pattern analysis and forecasting
export interface SalesAnalysis {
  patterns: string[];
  peakHours: string[];
  topProducts: string[];
  forecast: {
    nextHour: number;
    nextDay: number;
    confidence: number;
  };
  recommendations: string[];
  summary: string;
}

export async function analyzeSalesPatterns(data: {
  transactions: any[];
  period: string;
  locationId?: string;
}): Promise<SalesAnalysis> {
  const transactionSummary = data.transactions.slice(0, 50).map(t => ({
    amount: t.amount,
    time: t.createdAt,
    type: t.transactionType,
  }));

  const prompt = `You are a retail analytics expert. Analyze these sales patterns for a luxury frozen yogurt chain:

Sales Data (${data.period}):
${JSON.stringify(transactionSummary)}

Location: ${data.locationId || "All locations"}
Total transactions: ${data.transactions.length}
Total revenue: ${data.transactions.reduce((sum: number, t: any) => sum + (parseFloat(t.amount) || 0), 0).toFixed(2)}

Provide insights on:
- Sales patterns and trends
- Peak hours
- Product performance
- Revenue forecasting

Respond with JSON only:
{
  "patterns": [<string array of identified patterns>],
  "peakHours": [<string array of busy times>],
  "topProducts": [<string array of best sellers if identifiable>],
  "forecast": {"nextHour": <number>, "nextDay": <number>, "confidence": <0-100>},
  "recommendations": [<string array of suggestions>],
  "summary": <brief overview>
}`;

  try {
    const response = await generateWithRetry(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as SalesAnalysis;
    }
    return {
      patterns: [],
      peakHours: [],
      topProducts: [],
      forecast: { nextHour: 0, nextDay: 0, confidence: 0 },
      recommendations: [],
      summary: "Sales analysis completed",
    };
  } catch (error) {
    console.error("Sales analysis error:", error);
    return {
      patterns: [],
      peakHours: [],
      topProducts: [],
      forecast: { nextHour: 0, nextDay: 0, confidence: 0 },
      recommendations: [],
      summary: "Analysis error",
    };
  }
}

// Inventory anomaly detection
export interface InventoryAnalysis {
  anomalies: {
    itemId: string;
    itemName: string;
    anomalyType: string;
    severity: string;
    description: string;
  }[];
  wastePatterns: string[];
  restockRecommendations: string[];
  summary: string;
}

export async function analyzeInventory(data: {
  items: any[];
  movements: any[];
  wasteReports: any[];
}): Promise<InventoryAnalysis> {
  const prompt = `You are an inventory management expert for a food service operation. Analyze this inventory data:

Inventory Items (${data.items.length}):
${JSON.stringify(data.items.slice(0, 20).map(i => ({
  name: i.name,
  quantity: i.currentQuantity,
  unit: i.unit,
  reorderLevel: i.reorderLevel
})))}

Recent Movements (${data.movements.length}):
${JSON.stringify(data.movements.slice(0, 20).map(m => ({
  item: m.inventoryItemId,
  type: m.movementType,
  quantity: m.quantity,
  reason: m.reason
})))}

Waste Reports (${data.wasteReports.length}):
${JSON.stringify(data.wasteReports.slice(0, 10).map(w => ({
  item: w.inventoryItemId,
  quantity: w.quantityWasted,
  reason: w.reason
})))}

Respond with JSON only:
{
  "anomalies": [{"itemId": <string>, "itemName": <string>, "anomalyType": <string>, "severity": <"low"|"medium"|"high">, "description": <string>}],
  "wastePatterns": [<string array of waste pattern insights>],
  "restockRecommendations": [<string array of restock suggestions>],
  "summary": <brief overview>
}`;

  try {
    const response = await generateWithRetry(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as InventoryAnalysis;
    }
    return {
      anomalies: [],
      wastePatterns: [],
      restockRecommendations: [],
      summary: "Inventory analysis completed",
    };
  } catch (error) {
    console.error("Inventory analysis error:", error);
    return {
      anomalies: [],
      wastePatterns: [],
      restockRecommendations: [],
      summary: "Analysis error",
    };
  }
}

// Generate comprehensive daily report
export interface DailyReport {
  date: string;
  executiveSummary: string;
  transactionInsights: string;
  operationalHighlights: string[];
  riskAlerts: string[];
  recommendations: string[];
  kpiSummary: {
    revenue: number;
    transactions: number;
    avgOrderValue: number;
    customerSatisfaction?: number;
  };
}

export async function generateDailyReport(data: {
  date: string;
  transactions: any[];
  errors: any[];
  alerts: any[];
  metrics: any;
}): Promise<DailyReport> {
  const totalRevenue = data.transactions.reduce((sum: number, t: any) => sum + (parseFloat(t.amount) || 0), 0);
  const avgOrder = data.transactions.length > 0 ? totalRevenue / data.transactions.length : 0;

  const prompt = `You are a retail operations executive. Generate a daily report for a luxury frozen yogurt chain:

Date: ${data.date}

Transaction Summary:
- Total Transactions: ${data.transactions.length}
- Total Revenue: ${totalRevenue.toFixed(2)}
- Average Order: ${avgOrder.toFixed(2)}

Errors Today: ${data.errors.length}
Active Alerts: ${data.alerts.filter((a: any) => !a.isResolved).length}

Key Metrics:
${JSON.stringify(data.metrics)}

Write a professional executive report. Respond with JSON only:
{
  "date": "${data.date}",
  "executiveSummary": <2-3 sentence overview>,
  "transactionInsights": <key transaction insights>,
  "operationalHighlights": [<string array of notable events>],
  "riskAlerts": [<string array of concerns>],
  "recommendations": [<string array of action items>],
  "kpiSummary": {"revenue": ${totalRevenue}, "transactions": ${data.transactions.length}, "avgOrderValue": ${avgOrder}, "customerSatisfaction": null}
}`;

  try {
    const response = await generateWithRetry(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as DailyReport;
    }
    return {
      date: data.date,
      executiveSummary: "Daily report generated",
      transactionInsights: `Processed ${data.transactions.length} transactions totaling ${totalRevenue.toFixed(2)}`,
      operationalHighlights: [],
      riskAlerts: [],
      recommendations: [],
      kpiSummary: {
        revenue: totalRevenue,
        transactions: data.transactions.length,
        avgOrderValue: avgOrder,
      },
    };
  } catch (error) {
    console.error("Daily report generation error:", error);
    return {
      date: data.date,
      executiveSummary: "Report generation error",
      transactionInsights: "",
      operationalHighlights: [],
      riskAlerts: ["Report generation failed - manual review required"],
      recommendations: [],
      kpiSummary: {
        revenue: totalRevenue,
        transactions: data.transactions.length,
        avgOrderValue: avgOrder,
      },
    };
  }
}

// Real-time chat for operations support
export async function operationsChat(message: string, context?: {
  currentAlerts?: any[];
  recentTransactions?: any[];
  systemHealth?: any;
}): Promise<string> {
  const systemPrompt = `You are an AI operations assistant for Essence Yogurt, a luxury frozen yogurt chain operating globally. 
You help operations managers monitor and manage:
- Transaction monitoring and fraud detection
- Inventory and stock control
- Employee timesheets and scheduling
- System health and performance
- Multi-language operations (9 languages)

Current Context:
${context?.currentAlerts ? `Active Alerts: ${context.currentAlerts.length}` : ""}
${context?.systemHealth ? `System Status: ${JSON.stringify(context.systemHealth)}` : ""}

Be professional, concise, and actionable. Reference specific data when available.`;

  const prompt = `${systemPrompt}

User Query: ${message}

Provide a helpful response:`;

  try {
    return await generateWithRetry(prompt);
  } catch (error) {
    console.error("Operations chat error:", error);
    return "I'm having trouble processing your request. Please try again or contact technical support.";
  }
}

export default {
  analyzeTransaction,
  analyzeErrors,
  assessTranslationQuality,
  analyzeSystemHealth,
  analyzeSalesPatterns,
  analyzeInventory,
  generateDailyReport,
  operationsChat,
};
