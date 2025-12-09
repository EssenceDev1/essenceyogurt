import { Router } from "express";
import { 
  loyaltyChat, 
  findShiftReplacement, 
  analyzeInventoryHealth, 
  analyzeSalesInsights,
  customerSupport,
  getCommandCenterStatus,
  essenceConcierge
} from "../services/ai-services";
import { storage } from "../storage";
import { logTranslationUsage } from "../middleware/monitoring";

function detectLanguage(text: string): string {
  const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
  const hebrewPattern = /[\u0590-\u05FF]/;
  const hiraganaKatakana = /[\u3040-\u309F\u30A0-\u30FF]/;
  const chineseOnly = /[\u4E00-\u9FFF]/;
  const koreanPattern = /[\uAC00-\uD7AF\u1100-\u11FF]/;
  const thaiPattern = /[\u0E00-\u0E7F]/;
  const frenchPattern = /[àâäéèêëïîôùûüÿœæç]/i;
  const spanishPattern = /[áéíóúüñ¿¡]/i;
  const germanPattern = /[äöüß]/i;
  const italianPattern = /[àèéìíîòóùú]/i;
  const dutchPattern = /[ĳëïü]/i;
  
  if (arabicPattern.test(text)) return "ar";
  if (hebrewPattern.test(text)) return "he";
  if (koreanPattern.test(text)) return "ko";
  if (thaiPattern.test(text)) return "th";
  
  if (hiraganaKatakana.test(text)) return "ja";
  
  if (chineseOnly.test(text) && !hiraganaKatakana.test(text)) return "zh";
  
  if (frenchPattern.test(text)) return "fr";
  if (spanishPattern.test(text)) return "es";
  if (germanPattern.test(text)) return "de";
  if (italianPattern.test(text)) return "it";
  if (dutchPattern.test(text)) return "nl";
  
  return "en";
}

const router = Router();

// Loyalty AI Chat - Customer facing
router.post("/loyalty", async (req, res) => {
  try {
    const { message, customerId } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    let context: {
      customerId?: string;
      customerName?: string;
      currentPoints?: number;
      tier?: string;
      recentPurchases?: unknown[];
      availableRewards?: unknown[];
    } = {};
    
    if (customerId) {
      const customer = await storage.getCustomerById(customerId);
      if (customer) {
        context = {
          customerId: customer.id,
          customerName: customer.fullName,
          currentPoints: Number(customer.loyaltyPoints) || 0,
          tier: customer.loyaltyTierId || "Silver",
        };
      }
    }

    const response = await loyaltyChat(message, context);
    res.json(response);
  } catch (error) {
    console.error("Loyalty chat error:", error);
    res.status(500).json({ 
      message: "I'd be happy to help! What would you like to know about your Essence rewards?",
      suggestions: ["Check my points", "View rewards", "Find a store"],
    });
  }
});

// Customer Support Bot
router.post("/support", async (req, res) => {
  try {
    const { question, customerName, sessionMessages } = req.body;
    
    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    const response = await customerSupport(question, {
      customerName,
      previousMessages: sessionMessages,
    });
    
    res.json(response);
  } catch (error) {
    console.error("Support chat error:", error);
    res.status(500).json({
      answer: "I apologize for the inconvenience. Please try again or contact us directly.",
      category: "general",
      confidence: 0,
      needsHumanEscalation: true,
    });
  }
});

// VIP Loyalty Concierge - For mobile app dashboard
router.post("/loyalty-concierge", async (req, res) => {
  try {
    const { message, tier, points, region } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const context = {
      tier: tier || "Classic",
      currentPoints: points || 0,
      region: region || "USA",
    };

    const response = await loyaltyChat(message, context);
    res.json({
      reply: response.message || "I'm here to help with your VIP benefits, points, and exclusive offers. How can I assist you today?",
      suggestions: response.suggestions || ["Check my tier benefits", "View special offers", "Find premium flavors"],
    });
  } catch (error) {
    console.error("Loyalty concierge error:", error);
    res.status(500).json({ 
      reply: "I'm your Essence Concierge. I can help you with your VIP status, points balance, and exclusive offers. What would you like to know?",
      suggestions: ["My tier benefits", "Points history", "Exclusive offers"],
    });
  }
});

// Staff AI - Sick Replacement (Protected - requires auth)
router.post("/staff/replacement", async (req, res) => {
  try {
    const { sickEmployee } = req.body;
    
    if (!sickEmployee) {
      return res.status(400).json({ error: "Sick employee details required" });
    }

    const employees = await storage.getAllEmployees();
    const availableStaff = employees
      .filter(e => e.id !== sickEmployee.employeeId && e.isActive)
      .map(e => ({
        employeeId: e.id,
        name: e.fullName,
        roles: [e.role],
        hoursThisWeek: 0,
        maxHoursPerWeek: 40,
        preferredLocations: e.essenceUnitId ? [e.essenceUnitId] : [],
        rating: 4.5,
      }));

    const result = await findShiftReplacement(sickEmployee, availableStaff);
    res.json(result);
  } catch (error) {
    console.error("Staff replacement error:", error);
    res.status(500).json({ error: "Failed to find replacements" });
  }
});

// Inventory AI - Health Analysis (Protected)
router.get("/inventory/health", async (req, res) => {
  try {
    const unitId = req.query.unitId as string | undefined;
    
    let items: Awaited<ReturnType<typeof storage.getInventoryItemsByUnit>> = [];
    
    if (unitId) {
      items = await storage.getInventoryItemsByUnit(unitId);
    }

    const itemsWithLocation = items.map(item => ({
      id: item.id,
      name: item.itemName,
      category: item.category || "general",
      currentQuantity: Number(item.currentQuantity),
      reorderLevel: Number(item.minQuantity) || 10,
      unit: item.unit,
      expiryDate: undefined,
      locationId: item.essenceUnitId,
      locationName: "Location",
    }));

    // Get real temperature readings from the last 7 days
    let temperatureData: { fridgeId: string; locationId: string; temperature: number; timestamp: string }[] = [];
    if (unitId) {
      const tempReadings = await storage.getTemperatureReadingsByEssenceUnit(unitId, 7);
      temperatureData = tempReadings.map(r => ({
        fridgeId: r.refrigerationUnitId,
        locationId: unitId,
        temperature: Number(r.temperature),
        timestamp: r.recordedAt?.toISOString() || new Date().toISOString(),
      }));
    }

    // Get real waste data from the last 30 days
    let wasteData: { itemName: string; quantity: number; reason: string; value: number }[] = [];
    if (unitId) {
      const wasteReports = await storage.getWasteReports(unitId);
      const recentWaste = wasteReports.slice(0, 50); // Last 50 waste reports
      wasteData = recentWaste.map(w => ({
        itemName: w.description?.split(" ")[0] || "Item",
        quantity: Number(w.quantity),
        reason: w.wasteReason,
        value: Number(w.estimatedCost) || 0,
      }));
    }

    const result = await analyzeInventoryHealth({
      items: itemsWithLocation,
      temperatureReadings: temperatureData,
      recentWaste: wasteData,
    });
    
    res.json(result);
  } catch (error) {
    console.error("Inventory health error:", error);
    res.status(500).json({ error: "Failed to analyze inventory" });
  }
});

// Sales Insights AI (Protected)
router.get("/sales/insights", async (req, res) => {
  try {
    const period = (req.query.period as string) || "today";
    const sessionId = req.query.sessionId as string | undefined;
    const unitId = req.query.unitId as string | undefined;
    
    let transactions: Awaited<ReturnType<typeof storage.getPosTransactionsBySession>> = [];
    
    if (sessionId) {
      // Get transactions for specific session
      transactions = await storage.getPosTransactionsBySession(sessionId);
    } else {
      // Get recent transactions (optionally filtered by unit)
      transactions = await storage.getRecentPosTransactions(200, unitId);
    }

    // Filter by period
    const now = new Date();
    const filteredTransactions = transactions.filter(t => {
      if (!t.createdAt) return true;
      const txDate = new Date(t.createdAt);
      if (period === "today") {
        return txDate.toDateString() === now.toDateString();
      } else if (period === "week") {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return txDate >= weekAgo;
      } else if (period === "month") {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return txDate >= monthAgo;
      }
      return true;
    });

    const formattedTransactions = filteredTransactions.map(t => ({
      id: t.id,
      amount: Number(t.totalAmount),
      itemCount: 1, // Individual transactions count as 1 item
      timestamp: t.createdAt?.toISOString() || new Date().toISOString(),
      locationId: t.essenceUnitId,
      paymentMethod: "card", // Default payment method
    }));

    const result = await analyzeSalesInsights({
      transactions: formattedTransactions,
      period,
    });
    
    res.json(result);
  } catch (error) {
    console.error("Sales insights error:", error);
    res.status(500).json({ error: "Failed to analyze sales" });
  }
});

// Essence AI Concierge - Premium Customer Chat (Public)
router.post("/concierge", async (req, res) => {
  try {
    const { message, history } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const inputLanguage = detectLanguage(message);
    const response = await essenceConcierge(message, history || []);
    const outputLanguage = detectLanguage(response.reply);
    
    if (inputLanguage !== "en" || outputLanguage !== "en") {
      logTranslationUsage({
        sourceLanguage: inputLanguage,
        targetLanguage: outputLanguage,
        translationKey: "ai_concierge_response",
        sourceText: message.slice(0, 500),
        translatedText: response.reply.slice(0, 500),
        context: "Gemini AI Concierge multilingual response",
        region: "global",
      }).catch(err => console.error("Translation log failed:", err));
    }
    
    res.json(response);
  } catch (error) {
    console.error("Essence Concierge error:", error);
    res.status(500).json({ 
      reply: "Welcome to Essence Yogurt! I'm your AI concierge, ready to help with anything about our luxury frozen yogurt experience. How may I assist you today?",
      suggestions: ["Tell me about your flavors", "How does loyalty work?", "Find locations"],
    });
  }
});

// Command Center Status (Protected)
router.get("/command-center/status", async (req, res) => {
  try {
    const [locations, employees] = await Promise.all([
      storage.getAllLocations(),
      storage.getAllEmployees(),
    ]);

    const result = await getCommandCenterStatus({
      transactions: [],
      alerts: [],
      locations: locations.map(l => ({ ...l, status: l.status?.toLowerCase() || "unknown" })),
      staff: employees.map(e => ({ ...e, onDuty: e.isActive })),
      inventory: [],
    });
    
    res.json(result);
  } catch (error) {
    console.error("Command center error:", error);
    res.status(500).json({ error: "Failed to get status" });
  }
});

export default router;
