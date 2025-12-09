import { GoogleGenAI } from "@google/genai";
import pLimit from "p-limit";
import pRetry from "p-retry";

const ai = new GoogleGenAI({
  apiKey: process.env.AI_INTEGRATIONS_GEMINI_API_KEY || "",
  httpOptions: {
    apiVersion: "",
    baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL || "",
  },
});

const limit = pLimit(3);

function isRateLimitError(error: any): boolean {
  const errorMsg = error?.message || String(error);
  return (
    errorMsg.includes("429") ||
    errorMsg.includes("RATELIMIT_EXCEEDED") ||
    errorMsg.toLowerCase().includes("quota") ||
    errorMsg.toLowerCase().includes("rate limit")
  );
}

async function generateWithRetry(prompt: string, model: string = "gemini-2.5-flash"): Promise<string> {
  return limit(() =>
    pRetry(
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
          throw error;
        }
      },
      {
        retries: 3,
        minTimeout: 1000,
        maxTimeout: 10000,
        factor: 2,
      }
    )
  );
}

// ============================================
// LOYALTY AI CHAT - Customer-facing chatbot
// ============================================

export interface LoyaltyChatResponse {
  message: string;
  suggestions?: string[];
  actions?: { type: string; label: string; data?: any }[];
  pointsInfo?: {
    currentPoints: number;
    tier: string;
    nextTierPoints?: number;
  };
}

export async function loyaltyChat(
  message: string,
  context: {
    customerId?: string;
    customerName?: string;
    currentPoints?: number;
    tier?: string;
    recentPurchases?: any[];
    availableRewards?: any[];
  }
): Promise<LoyaltyChatResponse> {
  const systemPrompt = `You are the Essence Yogurt Loyalty Assistant - a friendly, helpful AI that assists customers with their loyalty rewards.

BRAND VOICE: Warm, premium, enthusiastic about frozen yogurt. Use occasional gold/luxury references.

CUSTOMER CONTEXT:
- Name: ${context.customerName || "Valued Guest"}
- Points Balance: ${context.currentPoints?.toLocaleString() || 0} points
- Tier: ${context.tier || "Silver"} (Gold = 1.1x, Platinum = 1.25x, Diamond = 1.5x multiplier)
- Recent Purchases: ${context.recentPurchases?.length || 0} orders

LOYALTY PROGRAM DETAILS:
- Earn 1 point per gram of yogurt purchased
- Tier multipliers: Silver (1x), Gold (1.1x), Platinum (1.25x), Diamond (1.5x)
- Points can be redeemed for free yogurt, toppings, or exclusive rewards
- E-Gift packages available: Golden Touch ($25), Platinum Indulgence ($50), Diamond Experience ($100)

AVAILABLE REWARDS:
${context.availableRewards?.slice(0, 5).map(r => `- ${r.name}: ${r.pointsCost} points`).join('\n') || "Loading rewards..."}

You can help with:
1. Checking points balance and tier status
2. Finding available rewards
3. Explaining how to earn more points
4. E-gift card information
5. Store locations and hours
6. Flavor recommendations

Keep responses concise (2-3 sentences max) and friendly.`;

  const prompt = `${systemPrompt}

Customer Message: "${message}"

Respond with JSON only:
{
  "message": "<your friendly response>",
  "suggestions": [<2-3 quick reply suggestions>],
  "actions": [{"type": "<check_points|redeem|find_store|view_rewards>", "label": "<button label>", "data": {}}]
}`;

  try {
    const response = await generateWithRetry(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        ...parsed,
        pointsInfo: context.currentPoints !== undefined ? {
          currentPoints: context.currentPoints,
          tier: context.tier || "Silver",
        } : undefined,
      };
    }
    return {
      message: "I'd be happy to help you with your Essence rewards! What would you like to know?",
      suggestions: ["Check my points", "View rewards", "Find a store"],
    };
  } catch (error) {
    console.error("Loyalty chat error:", error);
    return {
      message: "I'm here to help with your Essence rewards. How can I assist you today?",
      suggestions: ["Check my points", "View rewards", "Find a store"],
    };
  }
}

// ============================================
// STAFF AI - Sick Replacement Engine
// ============================================

export interface StaffReplacement {
  originalShift: {
    employeeId: string;
    employeeName: string;
    date: string;
    startTime: string;
    endTime: string;
    locationId: string;
    role: string;
  };
  recommendedReplacements: {
    employeeId: string;
    employeeName: string;
    matchScore: number;
    reasons: string[];
    availability: string;
    distance?: string;
    overtimeRisk: boolean;
  }[];
  urgency: "low" | "medium" | "high" | "critical";
  autoNotifyRecommended: boolean;
  summary: string;
}

export async function findShiftReplacement(
  sickEmployee: {
    employeeId: string;
    employeeName: string;
    shiftDate: string;
    shiftStart: string;
    shiftEnd: string;
    locationId: string;
    locationName: string;
    role: string;
  },
  availableStaff: {
    employeeId: string;
    name: string;
    roles: string[];
    hoursThisWeek: number;
    maxHoursPerWeek: number;
    preferredLocations: string[];
    rating: number;
    distance?: number;
  }[]
): Promise<StaffReplacement> {
  const prompt = `You are an HR AI assistant for Essence Yogurt. A staff member has called in sick and you need to find the best replacement.

SICK EMPLOYEE:
- Name: ${sickEmployee.employeeName}
- Date: ${sickEmployee.shiftDate}
- Shift: ${sickEmployee.shiftStart} - ${sickEmployee.shiftEnd}
- Location: ${sickEmployee.locationName}
- Role: ${sickEmployee.role}

AVAILABLE STAFF FOR REPLACEMENT:
${availableStaff.map((s, i) => `
${i + 1}. ${s.name}
   - Roles: ${s.roles.join(", ")}
   - Hours this week: ${s.hoursThisWeek}/${s.maxHoursPerWeek}
   - Preferred locations: ${s.preferredLocations.join(", ")}
   - Rating: ${s.rating}/5
   ${s.distance ? `- Distance: ${s.distance}km` : ""}`).join("\n")}

RULES:
- Prioritize staff with matching roles
- Avoid overtime (max ${availableStaff[0]?.maxHoursPerWeek || 40} hours/week)
- Consider preferred locations
- Higher rated staff preferred for urgent shifts

Respond with JSON only:
{
  "recommendedReplacements": [
    {
      "employeeId": "<id>",
      "employeeName": "<name>",
      "matchScore": <0-100>,
      "reasons": ["<why this person is good>"],
      "availability": "<available/needs_confirmation>",
      "overtimeRisk": <boolean>
    }
  ],
  "urgency": "<low|medium|high|critical>",
  "autoNotifyRecommended": <boolean>,
  "summary": "<brief summary of recommendation>"
}`;

  try {
    const response = await generateWithRetry(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);
      return {
        originalShift: {
          employeeId: sickEmployee.employeeId,
          employeeName: sickEmployee.employeeName,
          date: sickEmployee.shiftDate,
          startTime: sickEmployee.shiftStart,
          endTime: sickEmployee.shiftEnd,
          locationId: sickEmployee.locationId,
          role: sickEmployee.role,
        },
        ...result,
      };
    }
    return {
      originalShift: {
        employeeId: sickEmployee.employeeId,
        employeeName: sickEmployee.employeeName,
        date: sickEmployee.shiftDate,
        startTime: sickEmployee.shiftStart,
        endTime: sickEmployee.shiftEnd,
        locationId: sickEmployee.locationId,
        role: sickEmployee.role,
      },
      recommendedReplacements: [],
      urgency: "medium",
      autoNotifyRecommended: false,
      summary: "Unable to analyze - manual review required",
    };
  } catch (error) {
    console.error("Staff replacement error:", error);
    return {
      originalShift: {
        employeeId: sickEmployee.employeeId,
        employeeName: sickEmployee.employeeName,
        date: sickEmployee.shiftDate,
        startTime: sickEmployee.shiftStart,
        endTime: sickEmployee.shiftEnd,
        locationId: sickEmployee.locationId,
        role: sickEmployee.role,
      },
      recommendedReplacements: [],
      urgency: "high",
      autoNotifyRecommended: false,
      summary: "Error finding replacements - contact manager",
    };
  }
}

// ============================================
// INVENTORY AI - Fridge Safety & Expiry
// ============================================

export interface InventoryAlert {
  alertId: string;
  type: "expiry" | "temperature" | "low_stock" | "waste" | "anomaly";
  severity: "info" | "warning" | "critical";
  itemId: string;
  itemName: string;
  locationId: string;
  locationName: string;
  message: string;
  actionRequired: string;
  expiresAt?: string;
  temperature?: number;
  recommendedAction: string;
}

export interface InventoryAIAnalysis {
  alerts: InventoryAlert[];
  fridgeSafetyStatus: "safe" | "warning" | "danger";
  expiryReport: {
    expiringSoon: number;
    expired: number;
    healthy: number;
  };
  reorderSuggestions: {
    itemId: string;
    itemName: string;
    currentStock: number;
    suggestedOrder: number;
    urgency: string;
    reason: string;
  }[];
  wasteAnalysis: {
    totalWasteValue: number;
    topWasteItems: string[];
    preventionTips: string[];
  };
  summary: string;
}

export async function analyzeInventoryHealth(data: {
  items: {
    id: string;
    name: string;
    category: string;
    currentQuantity: number;
    reorderLevel: number;
    unit: string;
    expiryDate?: string;
    locationId: string;
    locationName: string;
  }[];
  temperatureReadings: {
    fridgeId: string;
    locationId: string;
    temperature: number;
    timestamp: string;
  }[];
  recentWaste: {
    itemName: string;
    quantity: number;
    reason: string;
    value: number;
  }[];
}): Promise<InventoryAIAnalysis> {
  const now = new Date();
  const expiringSoon = data.items.filter(i => {
    if (!i.expiryDate) return false;
    const expiry = new Date(i.expiryDate);
    const daysUntilExpiry = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return daysUntilExpiry > 0 && daysUntilExpiry <= 3;
  });
  
  const expired = data.items.filter(i => {
    if (!i.expiryDate) return false;
    return new Date(i.expiryDate) < now;
  });

  const unsafeTemps = data.temperatureReadings.filter(t => t.temperature > 4 || t.temperature < -1);

  const prompt = `You are a food safety and inventory AI for Essence Yogurt (frozen yogurt chain).

INVENTORY STATUS:
- Total items tracked: ${data.items.length}
- Expiring within 3 days: ${expiringSoon.length}
- Already expired: ${expired.length}
- Low stock items: ${data.items.filter(i => i.currentQuantity <= i.reorderLevel).length}

TEMPERATURE READINGS:
${data.temperatureReadings.slice(0, 10).map(t => 
  `- Fridge ${t.fridgeId}: ${t.temperature}°C ${t.temperature > 4 ? "⚠️ HIGH" : t.temperature < -1 ? "⚠️ LOW" : "✓"}`
).join("\n")}

EXPIRING ITEMS:
${expiringSoon.slice(0, 10).map(i => `- ${i.name}: expires ${i.expiryDate} (${i.currentQuantity} ${i.unit})`).join("\n") || "None"}

RECENT WASTE:
${data.recentWaste.slice(0, 5).map(w => `- ${w.itemName}: ${w.quantity} units ($${w.value}) - ${w.reason}`).join("\n") || "None recorded"}

SAFETY RULES:
- Fridge temp must be 0-4°C
- Dairy products max 5 days after opening
- Fruit toppings max 3 days after cutting

Generate alerts and recommendations. Respond with JSON only:
{
  "alerts": [
    {
      "alertId": "<unique_id>",
      "type": "<expiry|temperature|low_stock|waste|anomaly>",
      "severity": "<info|warning|critical>",
      "itemId": "<id or fridge_id>",
      "itemName": "<name>",
      "locationId": "<loc_id>",
      "locationName": "<loc_name>",
      "message": "<alert message>",
      "actionRequired": "<yes/no>",
      "recommendedAction": "<what to do>"
    }
  ],
  "fridgeSafetyStatus": "<safe|warning|danger>",
  "expiryReport": {
    "expiringSoon": ${expiringSoon.length},
    "expired": ${expired.length},
    "healthy": ${data.items.length - expiringSoon.length - expired.length}
  },
  "reorderSuggestions": [
    {
      "itemId": "<id>",
      "itemName": "<name>",
      "currentStock": <number>,
      "suggestedOrder": <number>,
      "urgency": "<low|medium|high>",
      "reason": "<why>"
    }
  ],
  "wasteAnalysis": {
    "totalWasteValue": <number>,
    "topWasteItems": ["<item names>"],
    "preventionTips": ["<tips>"]
  },
  "summary": "<brief overview>"
}`;

  try {
    const response = await generateWithRetry(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return {
      alerts: [],
      fridgeSafetyStatus: unsafeTemps.length > 0 ? "warning" : "safe",
      expiryReport: {
        expiringSoon: expiringSoon.length,
        expired: expired.length,
        healthy: data.items.length - expiringSoon.length - expired.length,
      },
      reorderSuggestions: [],
      wasteAnalysis: {
        totalWasteValue: data.recentWaste.reduce((sum, w) => sum + w.value, 0),
        topWasteItems: [],
        preventionTips: [],
      },
      summary: "Inventory analysis completed",
    };
  } catch (error) {
    console.error("Inventory AI error:", error);
    return {
      alerts: unsafeTemps.length > 0 ? [{
        alertId: "temp_warning",
        type: "temperature",
        severity: "warning",
        itemId: "fridge",
        itemName: "Temperature Check",
        locationId: "",
        locationName: "",
        message: "Temperature readings need review",
        actionRequired: "yes",
        recommendedAction: "Check fridge temperatures manually",
      }] : [],
      fridgeSafetyStatus: unsafeTemps.length > 0 ? "warning" : "safe",
      expiryReport: {
        expiringSoon: expiringSoon.length,
        expired: expired.length,
        healthy: data.items.length - expiringSoon.length - expired.length,
      },
      reorderSuggestions: [],
      wasteAnalysis: {
        totalWasteValue: 0,
        topWasteItems: [],
        preventionTips: [],
      },
      summary: "Basic analysis completed - AI enhancement unavailable",
    };
  }
}

// ============================================
// SALES INSIGHTS AI - Pattern Analysis
// ============================================

export interface SalesInsight {
  patterns: {
    type: string;
    description: string;
    confidence: number;
    impact: string;
  }[];
  forecasts: {
    period: string;
    predictedRevenue: number;
    predictedTransactions: number;
    confidence: number;
  }[];
  peakAnalysis: {
    peakHours: string[];
    peakDays: string[];
    seasonalTrends: string[];
  };
  productInsights: {
    topSellers: string[];
    underperformers: string[];
    trendingUp: string[];
    trendingDown: string[];
  };
  recommendations: {
    category: string;
    action: string;
    expectedImpact: string;
    priority: "low" | "medium" | "high";
  }[];
  summary: string;
}

export async function analyzeSalesInsights(data: {
  transactions: {
    id: string;
    amount: number;
    itemCount: number;
    timestamp: string;
    locationId: string;
    paymentMethod: string;
  }[];
  period: string;
  previousPeriodRevenue?: number;
  locationBreakdown?: { locationId: string; locationName: string; revenue: number }[];
}): Promise<SalesInsight> {
  const totalRevenue = data.transactions.reduce((sum, t) => sum + t.amount, 0);
  const avgOrder = data.transactions.length > 0 ? totalRevenue / data.transactions.length : 0;
  
  const hourlyBreakdown: Record<number, number> = {};
  data.transactions.forEach(t => {
    const hour = new Date(t.timestamp).getHours();
    hourlyBreakdown[hour] = (hourlyBreakdown[hour] || 0) + t.amount;
  });

  const prompt = `You are a retail analytics AI for Essence Yogurt (luxury frozen yogurt chain).

SALES DATA (${data.period}):
- Total Transactions: ${data.transactions.length}
- Total Revenue: $${totalRevenue.toFixed(2)}
- Average Order: $${avgOrder.toFixed(2)}
${data.previousPeriodRevenue ? `- Previous Period: $${data.previousPeriodRevenue.toFixed(2)} (${((totalRevenue - data.previousPeriodRevenue) / data.previousPeriodRevenue * 100).toFixed(1)}% change)` : ""}

HOURLY BREAKDOWN:
${Object.entries(hourlyBreakdown).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([hour, rev]) => 
  `- ${hour}:00: $${rev.toFixed(2)}`
).join("\n")}

LOCATION BREAKDOWN:
${data.locationBreakdown?.map(l => `- ${l.locationName}: $${l.revenue.toFixed(2)}`).join("\n") || "Single location"}

PAYMENT METHODS:
${(() => {
  const methods: Record<string, number> = {};
  data.transactions.forEach(t => {
    methods[t.paymentMethod] = (methods[t.paymentMethod] || 0) + 1;
  });
  return Object.entries(methods).map(([m, c]) => `- ${m}: ${c} (${(c/data.transactions.length*100).toFixed(1)}%)`).join("\n");
})()}

Analyze patterns and provide actionable insights. Respond with JSON only:
{
  "patterns": [
    {"type": "<type>", "description": "<description>", "confidence": <0-100>, "impact": "<low|medium|high>"}
  ],
  "forecasts": [
    {"period": "<next_hour|today|tomorrow|this_week>", "predictedRevenue": <number>, "predictedTransactions": <number>, "confidence": <0-100>}
  ],
  "peakAnalysis": {
    "peakHours": ["<HH:00 format>"],
    "peakDays": ["<day names>"],
    "seasonalTrends": ["<observations>"]
  },
  "productInsights": {
    "topSellers": ["<items if identifiable>"],
    "underperformers": ["<items>"],
    "trendingUp": ["<items>"],
    "trendingDown": ["<items>"]
  },
  "recommendations": [
    {"category": "<staffing|inventory|pricing|marketing>", "action": "<specific action>", "expectedImpact": "<impact>", "priority": "<low|medium|high>"}
  ],
  "summary": "<executive summary>"
}`;

  try {
    const response = await generateWithRetry(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return getDefaultSalesInsight(totalRevenue, data.transactions.length, avgOrder);
  } catch (error) {
    console.error("Sales insights error:", error);
    return getDefaultSalesInsight(totalRevenue, data.transactions.length, avgOrder);
  }
}

function getDefaultSalesInsight(revenue: number, count: number, avg: number): SalesInsight {
  return {
    patterns: [],
    forecasts: [{
      period: "today",
      predictedRevenue: revenue * 1.1,
      predictedTransactions: count,
      confidence: 50,
    }],
    peakAnalysis: {
      peakHours: ["12:00", "18:00"],
      peakDays: ["Saturday", "Sunday"],
      seasonalTrends: [],
    },
    productInsights: {
      topSellers: [],
      underperformers: [],
      trendingUp: [],
      trendingDown: [],
    },
    recommendations: [],
    summary: `${count} transactions totaling $${revenue.toFixed(2)} with $${avg.toFixed(2)} average order`,
  };
}

// ============================================
// CUSTOMER SUPPORT BOT - FAQ & Inquiries
// ============================================

export interface SupportResponse {
  answer: string;
  category: string;
  confidence: number;
  suggestedActions?: { label: string; action: string }[];
  relatedFaqs?: string[];
  needsHumanEscalation: boolean;
  escalationReason?: string;
}

export async function customerSupport(
  question: string,
  context: {
    customerName?: string;
    orderHistory?: any[];
    currentIssue?: string;
    previousMessages?: { role: string; content: string }[];
  }
): Promise<SupportResponse> {
  const prompt = `You are a customer support AI for Essence Yogurt, a luxury frozen yogurt chain.

BRAND INFO:
- Premium self-serve frozen yogurt by weight (1g = 1 loyalty point)
- Locations in airports, malls, and flagship stores
- Global presence: Saudi Arabia, UAE, Greece, Israel, and expanding
- Loyalty tiers: Silver, Gold (1.1x), Platinum (1.25x), Diamond (1.5x)

COMMON TOPICS:
1. Store hours and locations
2. Loyalty program questions
3. Allergies and ingredients
4. Franchise opportunities
5. Complaints and feedback
6. Order issues
7. Gift cards
8. Catering inquiries

CUSTOMER: ${context.customerName || "Guest"}
${context.currentIssue ? `CURRENT ISSUE: ${context.currentIssue}` : ""}
${context.previousMessages?.length ? `CONVERSATION HISTORY:\n${context.previousMessages.slice(-3).map(m => `${m.role}: ${m.content}`).join("\n")}` : ""}

QUESTION: "${question}"

Provide helpful, friendly support. Escalate to human if:
- Complaint about serious issue (health, safety, discrimination)
- Request for refund over $50
- Legal matters
- Complex account issues

Respond with JSON only:
{
  "answer": "<helpful response, 2-3 sentences max>",
  "category": "<loyalty|locations|products|complaints|orders|general>",
  "confidence": <0-100>,
  "suggestedActions": [{"label": "<button text>", "action": "<action_type>"}],
  "relatedFaqs": ["<related questions>"],
  "needsHumanEscalation": <boolean>,
  "escalationReason": "<reason if escalating>"
}`;

  try {
    const response = await generateWithRetry(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return {
      answer: "I'd be happy to help you! Could you tell me more about your question?",
      category: "general",
      confidence: 50,
      needsHumanEscalation: false,
    };
  } catch (error) {
    console.error("Customer support error:", error);
    return {
      answer: "I apologize, but I'm having trouble understanding your request. Would you like to speak with a team member?",
      category: "general",
      confidence: 0,
      needsHumanEscalation: true,
      escalationReason: "AI processing error",
    };
  }
}

// ============================================
// UNIFIED AI COMMAND CENTER ANALYSIS
// ============================================

export interface CommandCenterStatus {
  overallHealth: "excellent" | "good" | "warning" | "critical";
  healthScore: number;
  activeAlerts: number;
  systemsStatus: {
    name: string;
    status: "online" | "degraded" | "offline";
    lastUpdate: string;
  }[];
  aiInsights: string[];
  priorityActions: {
    action: string;
    urgency: "low" | "medium" | "high" | "critical";
    assignedTo?: string;
  }[];
  metrics: {
    todayRevenue: number;
    todayTransactions: number;
    activeLocations: number;
    staffOnDuty: number;
  };
}

export async function getCommandCenterStatus(data: {
  transactions: any[];
  alerts: any[];
  locations: any[];
  staff: any[];
  inventory: any[];
}): Promise<CommandCenterStatus> {
  const todayRevenue = data.transactions
    .filter(t => new Date(t.timestamp).toDateString() === new Date().toDateString())
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const activeAlerts = data.alerts.filter(a => !a.resolved).length;
  
  const prompt = `You are the central AI for Essence Yogurt's Command Center.

CURRENT STATUS:
- Today's Revenue: $${todayRevenue.toFixed(2)}
- Today's Transactions: ${data.transactions.filter(t => new Date(t.timestamp).toDateString() === new Date().toDateString()).length}
- Active Alerts: ${activeAlerts}
- Active Locations: ${data.locations.filter(l => l.status === "open").length}/${data.locations.length}
- Staff On Duty: ${data.staff.filter(s => s.onDuty).length}

ALERTS:
${data.alerts.filter(a => !a.resolved).slice(0, 5).map(a => `- ${a.type}: ${a.message}`).join("\n") || "No active alerts"}

Provide a quick status assessment. Respond with JSON only:
{
  "overallHealth": "<excellent|good|warning|critical>",
  "healthScore": <0-100>,
  "aiInsights": ["<3-5 key insights>"],
  "priorityActions": [{"action": "<action>", "urgency": "<low|medium|high|critical>"}]
}`;

  try {
    const response = await generateWithRetry(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);
      return {
        ...result,
        activeAlerts,
        systemsStatus: [
          { name: "POS System", status: "online", lastUpdate: new Date().toISOString() },
          { name: "Loyalty Engine", status: "online", lastUpdate: new Date().toISOString() },
          { name: "Inventory AI", status: "online", lastUpdate: new Date().toISOString() },
          { name: "Staff AI", status: "online", lastUpdate: new Date().toISOString() },
        ],
        metrics: {
          todayRevenue,
          todayTransactions: data.transactions.filter(t => new Date(t.timestamp).toDateString() === new Date().toDateString()).length,
          activeLocations: data.locations.filter(l => l.status === "open").length,
          staffOnDuty: data.staff.filter(s => s.onDuty).length,
        },
      };
    }
  } catch (error) {
    console.error("Command center error:", error);
  }

  return {
    overallHealth: activeAlerts > 5 ? "warning" : "good",
    healthScore: activeAlerts > 5 ? 70 : 90,
    activeAlerts,
    systemsStatus: [
      { name: "POS System", status: "online", lastUpdate: new Date().toISOString() },
      { name: "Loyalty Engine", status: "online", lastUpdate: new Date().toISOString() },
      { name: "Inventory AI", status: "online", lastUpdate: new Date().toISOString() },
      { name: "Staff AI", status: "online", lastUpdate: new Date().toISOString() },
    ],
    aiInsights: ["System running normally", "All services operational"],
    priorityActions: [],
    metrics: {
      todayRevenue,
      todayTransactions: data.transactions.filter(t => new Date(t.timestamp).toDateString() === new Date().toDateString()).length,
      activeLocations: data.locations.filter(l => l.status === "open").length,
      staffOnDuty: data.staff.filter(s => s.onDuty).length,
    },
  };
}

// ============================================
// ESSENCE AI CONCIERGE - Premium Customer Chat
// Comprehensive knowledge of Essence Yogurt
// ============================================

export interface EssenceConciergeResponse {
  reply: string;
  suggestions?: string[];
}

const ESSENCE_KNOWLEDGE_BASE = `
## ESSENCE YOGURT - COMPREHENSIVE KNOWLEDGE BASE

### BRAND IDENTITY
- Essence Yogurt is a luxury self-serve frozen yogurt brand
- Tagline: "Pure Soft Serve - Gold Standard"
- Design: Pure white architecture with real gold accents
- Target: VIP travelers, mall shoppers, event guests
- Founded with 19+ countries of retail/media/tech experience

### PRODUCT & PRICING
- Self-serve pay-by-weight model using NTEP-certified digital scales
- Premium 98% fat-free yogurt with live cultures
- Regional pricing:
  * Saudi Arabia: 185 SAR/kg
  * UAE: 180 AED/kg  
  * Greece: 45 EUR/kg
  * Israel: 160 ILS/kg
  * Australia: 50 AUD/kg

### SIGNATURE FLAVORS (2026 Collection)
1. Desert Gold (FLV_DXB_GOLD) - Dubai Signature: Single origin chocolate with cardamom, pairs with roasted pistachio
2. Halo Cloud (FLV_CORE_VAN) - Core: Premium high vanilla, perfect canvas for toppings
3. Desert Glow (FLV_AUS_QUA) - Native Australia: Quandong inspired tart stone fruit
4. Original Greek - Classic tangy yogurt
5. Belgian Chocolate - Rich European chocolate
6. Mango Passion - Tropical fruit blend
7. Strawberry Bliss - Fresh berry flavor
8. Pistachio Dream - Middle Eastern favorite

### TOPPINGS & SAUCES
- Fresh-cut fruits: strawberries, mango, blueberries, kiwi
- Premium nuts: almonds, pistachios, walnuts, hazelnuts
- Crunchy cereals: granola, chocolate crispies
- Warm sauce taps: Hazelnut chocolate, Pistachio cream, Salted caramel
- All toppings prepared fresh daily

### VIP LOYALTY PROGRAM (Essence Circle)
4 Tiers with increasing benefits:
1. Classic - Base tier, 1x points multiplier
2. Gold - 1.2x points multiplier, priority service
3. Diamond - 1.5x points multiplier, exclusive tastings
4. Black Signature - 2x points multiplier, VIP concierge, private events

Earning: 1 point per 1 SAR/AED/EUR spent
Features: Personal inbox, QR scan at cashier, birthday rewards, tier progress tracking

### E-GIFT CARDS
3 Premium Packages:
1. Golden Touch - 150 credits (basic)
2. Platinum Indulgence - 500 credits (most popular)
3. Black Signature - 1000 credits (VIP)
- Instant email delivery
- Non-transferable for security
- Redeemable at all locations

### LOCATIONS & EXPANSION
Phase 1: Saudi Arabia & Dubai - Airport terminals, premium malls, selected events
Phase 2: Israel & Greece - City centers, tourist areas, select resorts
Future: Australia expansion planned

Target venues: International airports, luxury malls, beach clubs, hotels, stadiums, corporate events

### FRANCHISE & PARTNERSHIPS
- Master Franchise agreements available
- Revenue Share JV models for airports and malls
- Full support: logistics, compliance, training, branding
- Contact: Visit /franchise page or email support@essenceyogurt.com

### EVENTS & CATERING
- Essence Carts for corporate events, weddings, VIP gatherings
- Unlimited self-serve packages available (fixed hourly rate)
- 600+ guest events handled
- Full logistics, staff, and reporting included
- Digital invoicing for finance teams

### HOW IT WORKS
1. Grab a cup from our premium station
2. Swirl your own yogurt from self-serve machines
3. Add fresh toppings and warm sauces at the topping bar
4. Weigh at the digital scale and pay
5. Scan your VIP QR code to earn loyalty points

### TECHNOLOGY
- Octopus Brain AI operations system
- Gemini-powered AI concierge (that's me!)
- Real-time inventory monitoring
- Multi-language support: English, Arabic, Hebrew, Greek, French, German, Spanish, Italian, Russian
- Checkout.com payment integration
- ZATCA e-invoicing compliance (Saudi Arabia)

### DIETARY INFORMATION
- 98% fat-free yogurt base
- Contains live active cultures
- Halal-friendly ingredients
- Gluten-free yogurt base (check toppings individually)
- Vegetarian friendly

### CONTACT
- Website: essenceyogurt.com
- Email: support@essenceyogurt.com
- Available pages: /locations, /flavours, /loyalty, /egift, /franchise, /contact, /events
`;

export async function essenceConcierge(
  message: string,
  history: { role: string; content: string }[] = []
): Promise<EssenceConciergeResponse> {
  const conversationHistory = history
    .slice(-4)
    .map(m => `${m.role === "user" ? "Customer" : "Concierge"}: ${m.content}`)
    .join("\n");

  const prompt = `You are the Essence Yogurt AI Concierge - a sophisticated, warm, and knowledgeable assistant for a luxury frozen yogurt brand.

${ESSENCE_KNOWLEDGE_BASE}

## YOUR PERSONALITY
- Warm, elegant, and premium - like a luxury hotel concierge
- Use occasional gold/luxury references naturally
- Be helpful and informative without being pushy
- Show genuine enthusiasm for frozen yogurt
- Keep responses concise but complete (2-4 sentences typically)
- Use the customer's language style

## CONVERSATION HISTORY
${conversationHistory || "New conversation"}

## CURRENT QUESTION
Customer: ${message}

## INSTRUCTIONS
1. Answer based on the knowledge base above
2. Be specific with prices, tier benefits, and features when relevant
3. Guide customers to appropriate pages (/locations, /loyalty, /franchise, etc.) when helpful
4. For franchise/partnership inquiries, encourage them to visit /franchise or contact support@essenceyogurt.com
5. If asked about something not in the knowledge base, politely acknowledge and offer what you do know
6. End with a helpful follow-up question or suggestion when appropriate

Respond naturally as the Essence Concierge. Do not use markdown formatting, bullet points, or numbered lists in your response - write in flowing conversational sentences.`;

  try {
    const response = await generateWithRetry(prompt);
    
    const suggestions = [];
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes("location") || lowerMessage.includes("where")) {
      suggestions.push("Tell me about VIP loyalty", "What flavors do you have?");
    } else if (lowerMessage.includes("loyalty") || lowerMessage.includes("vip") || lowerMessage.includes("point")) {
      suggestions.push("How do E-Gift cards work?", "Where are your locations?");
    } else if (lowerMessage.includes("flavor") || lowerMessage.includes("flavour")) {
      suggestions.push("What toppings are available?", "How does loyalty work?");
    } else if (lowerMessage.includes("franchise") || lowerMessage.includes("partner")) {
      suggestions.push("Tell me about locations", "What's the VIP program?");
    } else if (lowerMessage.includes("gift") || lowerMessage.includes("egift")) {
      suggestions.push("What are the loyalty tiers?", "Find locations");
    } else {
      suggestions.push("Explore our flavors", "Learn about VIP loyalty");
    }
    
    return {
      reply: response.trim() || "Welcome to Essence Yogurt! I'm here to help you discover our premium self-serve frozen yogurt experience. Would you like to know about our signature flavors, VIP loyalty program, or find a location near you?",
      suggestions,
    };
  } catch (error) {
    console.error("Essence Concierge error:", error);
    return {
      reply: "Welcome to Essence Yogurt! I'm your AI concierge, ready to help with anything about our luxury frozen yogurt experience. You can ask me about our signature flavors, VIP loyalty program, locations, e-gift cards, or franchise opportunities. How may I assist you today?",
      suggestions: ["Tell me about your flavors", "How does loyalty work?", "Find locations"],
    };
  }
}

export default {
  loyaltyChat,
  findShiftReplacement,
  analyzeInventoryHealth,
  analyzeSalesInsights,
  customerSupport,
  getCommandCenterStatus,
  essenceConcierge,
};
