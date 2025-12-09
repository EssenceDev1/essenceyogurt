import { Router } from "express";
import { storage } from "../storage";
import { 
  insertCountryConfigurationSchema, insertRegulatoryPermitSchema, insertTaxConfigurationSchema,
  insertRefrigerationUnitSchema, insertTemperatureReadingSchema, insertFoodIngredientSchema,
  insertFoodSafetyAlertSchema, insertFinancialTransactionSchema, insertFinancialReportSchema,
  insertEmployeeProfileSchema, insertShiftScheduleSchema, insertAbsenceRequestSchema,
  insertShiftCoverRequestSchema, insertVipInboxMessageSchema, insertNotificationConsentSchema,
  insertEGiftPackageSchema, insertEGiftPurchaseSchema, insertPosScaleDeviceSchema, insertTheftAlertSchema
} from "@shared/schema";
import { operationsChat } from "../services/gemini-monitor";

const router = Router();

// ============================================
// COUNTRY CONFIGURATIONS
// ============================================
router.get("/countries", async (req, res) => {
  try {
    const countries = await storage.getAllCountryConfigurations();
    res.json(countries);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/countries/:code", async (req, res) => {
  try {
    const country = await storage.getCountryByCode(req.params.code);
    if (!country) return res.status(404).json({ error: "Country not found" });
    res.json(country);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/countries", async (req, res) => {
  try {
    const parsed = insertCountryConfigurationSchema.parse(req.body);
    const country = await storage.createCountryConfiguration(parsed);
    res.status(201).json(country);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.patch("/countries/:id", async (req, res) => {
  try {
    const country = await storage.updateCountryConfiguration(req.params.id, req.body);
    if (!country) return res.status(404).json({ error: "Country not found" });
    res.json(country);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// ============================================
// REGULATORY PERMITS
// ============================================
router.get("/permits", async (req, res) => {
  try {
    const { countryCode, essenceUnitId, expiringDays } = req.query;
    let permits;
    if (expiringDays) {
      permits = await storage.getExpiringPermits(Number(expiringDays));
    } else if (countryCode) {
      permits = await storage.getRegulatoryPermitsByCountry(countryCode as string);
    } else if (essenceUnitId) {
      permits = await storage.getRegulatoryPermitsByUnit(essenceUnitId as string);
    } else {
      permits = await storage.getExpiringPermits(365);
    }
    res.json(permits);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/permits", async (req, res) => {
  try {
    const parsed = insertRegulatoryPermitSchema.parse(req.body);
    const permit = await storage.createRegulatoryPermit(parsed);
    res.status(201).json(permit);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.patch("/permits/:id", async (req, res) => {
  try {
    const permit = await storage.updateRegulatoryPermit(req.params.id, req.body);
    if (!permit) return res.status(404).json({ error: "Permit not found" });
    res.json(permit);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// ============================================
// TAX CONFIGURATIONS
// ============================================
router.get("/taxes/:countryCode", async (req, res) => {
  try {
    const taxes = await storage.getTaxConfigurationsByCountry(req.params.countryCode);
    res.json(taxes);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/taxes", async (req, res) => {
  try {
    const parsed = insertTaxConfigurationSchema.parse(req.body);
    const tax = await storage.createTaxConfiguration(parsed);
    res.status(201).json(tax);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// ============================================
// REFRIGERATION UNITS & TEMPERATURE MONITORING
// ============================================
router.get("/refrigeration/:essenceUnitId", async (req, res) => {
  try {
    const units = await storage.getRefrigerationUnitsByEssenceUnit(req.params.essenceUnitId);
    res.json(units);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/refrigeration", async (req, res) => {
  try {
    const parsed = insertRefrigerationUnitSchema.parse(req.body);
    const unit = await storage.createRefrigerationUnit(parsed);
    res.status(201).json(unit);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/temperature/:refrigerationUnitId", async (req, res) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 100;
    const readings = await storage.getTemperatureReadingsByUnit(req.params.refrigerationUnitId, limit);
    res.json(readings);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/temperature", async (req, res) => {
  try {
    if (!req.body.essenceUnitId) {
      return res.status(400).json({ error: "essenceUnitId is required for HACCP compliance traceability" });
    }
    const parsed = insertTemperatureReadingSchema.parse(req.body);
    const reading = await storage.createTemperatureReading(parsed);
    if (!reading.isWithinRange) {
      await storage.createFoodSafetyAlert({
        essenceUnitId: req.body.essenceUnitId,
        alertType: "temperature_breach",
        severity: "high",
        refrigerationUnitId: reading.refrigerationUnitId,
        title: "Temperature Out of Range",
        message: `Temperature reading of ${reading.temperature}°C is outside safe range`,
        actionRequired: "Check equipment immediately and verify food safety",
        status: "open"
      });
    }
    res.status(201).json(reading);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/temperature/alerts/:essenceUnitId", async (req, res) => {
  try {
    const readings = await storage.getOutOfRangeReadings(req.params.essenceUnitId);
    res.json(readings);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// FOOD INGREDIENTS & EXPIRY MANAGEMENT
// ============================================
router.get("/ingredients/:essenceUnitId", async (req, res) => {
  try {
    const ingredients = await storage.getFoodIngredientsByEssenceUnit(req.params.essenceUnitId);
    res.json(ingredients);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/ingredients/expiring/:days", async (req, res) => {
  try {
    const ingredients = await storage.getExpiringIngredients(Number(req.params.days));
    res.json(ingredients);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/ingredients", async (req, res) => {
  try {
    const parsed = insertFoodIngredientSchema.parse(req.body);
    const ingredient = await storage.createFoodIngredient(parsed);
    res.status(201).json(ingredient);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.patch("/ingredients/:id", async (req, res) => {
  try {
    const ingredient = await storage.updateFoodIngredient(req.params.id, req.body);
    if (!ingredient) return res.status(404).json({ error: "Ingredient not found" });
    res.json(ingredient);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/ingredients/:id/dispose", async (req, res) => {
  try {
    const { disposedBy, reason } = req.body;
    const ingredient = await storage.updateFoodIngredient(req.params.id, {
      status: "disposed",
      disposedAt: new Date(),
      disposedBy,
      disposalReason: reason
    });
    if (!ingredient) return res.status(404).json({ error: "Ingredient not found" });
    res.json(ingredient);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// ============================================
// FOOD SAFETY ALERTS
// ============================================
router.get("/food-safety/alerts", async (req, res) => {
  try {
    const { essenceUnitId, openOnly } = req.query;
    let alerts;
    if (openOnly === "true") {
      alerts = await storage.getOpenFoodSafetyAlerts();
    } else {
      alerts = await storage.getFoodSafetyAlerts(essenceUnitId as string);
    }
    res.json(alerts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/food-safety/alerts", async (req, res) => {
  try {
    const parsed = insertFoodSafetyAlertSchema.parse(req.body);
    const alert = await storage.createFoodSafetyAlert(parsed);
    res.status(201).json(alert);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.patch("/food-safety/alerts/:id", async (req, res) => {
  try {
    const alert = await storage.updateFoodSafetyAlert(req.params.id, req.body);
    if (!alert) return res.status(404).json({ error: "Alert not found" });
    res.json(alert);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/food-safety/alerts/:id/acknowledge", async (req, res) => {
  try {
    const { acknowledgedBy } = req.body;
    const alert = await storage.updateFoodSafetyAlert(req.params.id, {
      status: "acknowledged",
      acknowledgedBy,
      acknowledgedAt: new Date()
    });
    if (!alert) return res.status(404).json({ error: "Alert not found" });
    res.json(alert);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/food-safety/alerts/:id/resolve", async (req, res) => {
  try {
    const { resolvedBy, resolutionNotes } = req.body;
    const alert = await storage.updateFoodSafetyAlert(req.params.id, {
      status: "resolved",
      resolvedBy,
      resolvedAt: new Date(),
      resolutionNotes
    });
    if (!alert) return res.status(404).json({ error: "Alert not found" });
    res.json(alert);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// AI-powered food safety check
router.post("/food-safety/ai-check", async (req, res) => {
  try {
    const expiringIngredients = await storage.getExpiringIngredients(7);
    const openAlerts = await storage.getOpenFoodSafetyAlerts();
    
    const prompt = `Analyze food safety status for a frozen yogurt shop:
    
EXPIRING INGREDIENTS (next 7 days):
${expiringIngredients.map(i => `- ${i.ingredientName}: expires ${i.expiryDate}, quantity: ${i.quantity}${i.unit}`).join("\n")}

OPEN ALERTS:
${openAlerts.map(a => `- ${a.severity}: ${a.title} - ${a.message}`).join("\n")}

Provide:
1. Critical actions needed immediately
2. Items to dispose of today
3. Stock to monitor closely
4. Recommendations for staff`;

    const analysis = await operationsChat(prompt);
    res.json({ analysis, expiringCount: expiringIngredients.length, openAlertCount: openAlerts.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// FINANCIAL TRANSACTIONS & REPORTS
// ============================================
router.get("/financial/transactions", async (req, res) => {
  try {
    const { countryCode } = req.query;
    const transactions = await storage.getFinancialTransactions(countryCode as string);
    res.json(transactions);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/financial/transactions", async (req, res) => {
  try {
    const parsed = insertFinancialTransactionSchema.parse(req.body);
    const transaction = await storage.createFinancialTransaction(parsed);
    res.status(201).json(transaction);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/financial/reports", async (req, res) => {
  try {
    const { countryCode } = req.query;
    const reports = await storage.getFinancialReports(countryCode as string);
    res.json(reports);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/financial/reports", async (req, res) => {
  try {
    const parsed = insertFinancialReportSchema.parse(req.body);
    const report = await storage.createFinancialReport(parsed);
    res.status(201).json(report);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// AI Financial Analysis
router.post("/financial/ai-report", async (req, res) => {
  try {
    const { countryCode, period } = req.body;
    const transactions = await storage.getFinancialTransactions(countryCode);
    const country = countryCode ? await storage.getCountryByCode(countryCode) : null;
    
    const prompt = `Generate financial analysis for Essence Yogurt operations${country ? ` in ${country.countryName}` : ''}:

RECENT TRANSACTIONS:
${transactions.slice(0, 50).map(t => `- ${t.transactionType}: ${t.amount} ${t.currency} - ${t.description}`).join("\n")}

TAX REQUIREMENTS:
${country ? `VAT Rate: ${country.vatRate}%, Currency: ${country.currency}` : 'Multiple countries'}

Provide:
1. Revenue summary
2. Expense breakdown
3. Tax liability estimate
4. Compliance recommendations
5. Financial health assessment`;

    const analysis = await operationsChat(prompt);
    res.json({ analysis, transactionCount: transactions.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// HR & WORKFORCE MANAGEMENT
// ============================================
router.get("/hr/profiles/:essenceUnitId", async (req, res) => {
  try {
    const profiles = await storage.getEmployeeProfilesByUnit(req.params.essenceUnitId);
    res.json(profiles);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/hr/profile/:employeeId", async (req, res) => {
  try {
    const profile = await storage.getEmployeeProfileByEmployeeId(req.params.employeeId);
    if (!profile) return res.status(404).json({ error: "Profile not found" });
    res.json(profile);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/hr/profiles", async (req, res) => {
  try {
    const parsed = insertEmployeeProfileSchema.parse(req.body);
    const profile = await storage.createEmployeeProfile(parsed);
    res.status(201).json(profile);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.patch("/hr/profiles/:id", async (req, res) => {
  try {
    const profile = await storage.updateEmployeeProfile(req.params.id, req.body);
    if (!profile) return res.status(404).json({ error: "Profile not found" });
    res.json(profile);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Shift Schedules
router.get("/hr/shifts/:essenceUnitId", async (req, res) => {
  try {
    const shifts = await storage.getShiftSchedulesByUnit(req.params.essenceUnitId);
    res.json(shifts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/hr/shifts", async (req, res) => {
  try {
    const parsed = insertShiftScheduleSchema.parse(req.body);
    const shift = await storage.createShiftSchedule(parsed);
    res.status(201).json(shift);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Absence Requests (sick leave with cascade)
router.get("/hr/absences/:employeeId", async (req, res) => {
  try {
    const absences = await storage.getAbsenceRequestsByEmployee(req.params.employeeId);
    res.json(absences);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/hr/absences/pending/:essenceUnitId", async (req, res) => {
  try {
    const absences = await storage.getPendingAbsenceRequests(req.params.essenceUnitId);
    res.json(absences);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/hr/absences", async (req, res) => {
  try {
    const parsed = insertAbsenceRequestSchema.parse(req.body);
    const absence = await storage.createAbsenceRequest(parsed);
    
    if (absence.urgencyLevel === "immediate" || absence.isEmergency) {
      const profiles = await storage.getEmployeeProfilesByUnit(absence.essenceUnitId);
      const eligibleStaff = profiles.filter(p => 
        p.employeeId !== absence.employeeId && 
        p.isEligibleForShiftCover
      );
      
      for (let i = 0; i < Math.min(eligibleStaff.length, 5); i++) {
        const deadline = new Date();
        deadline.setMinutes(deadline.getMinutes() + 30);
        
        await storage.createShiftCoverRequest({
          absenceRequestId: absence.id,
          targetEmployeeId: eligibleStaff[i].employeeId,
          shiftDate: absence.startDate,
          notificationChannel: eligibleStaff[i].notificationPreference || "whatsapp",
          responseDeadline: deadline,
          orderInCascade: i + 1
        });
      }
    }
    
    res.status(201).json(absence);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.patch("/hr/absences/:id", async (req, res) => {
  try {
    const absence = await storage.updateAbsenceRequest(req.params.id, req.body);
    if (!absence) return res.status(404).json({ error: "Absence request not found" });
    res.json(absence);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Shift Cover Requests
router.get("/hr/cover-requests/:employeeId", async (req, res) => {
  try {
    const requests = await storage.getPendingShiftCoverRequests(req.params.employeeId);
    res.json(requests);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/hr/cover-requests/:id/respond", async (req, res) => {
  try {
    const { response } = req.body;
    const request = await storage.updateShiftCoverRequest(req.params.id, {
      response,
      respondedAt: new Date()
    });
    if (!request) return res.status(404).json({ error: "Request not found" });
    
    if (response === "accepted") {
      await storage.updateAbsenceRequest(request.absenceRequestId, {
        status: "covered",
        replacementEmployeeId: request.targetEmployeeId,
        replacementConfirmedAt: new Date()
      });
    }
    
    res.json(request);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// ============================================
// VIP LOYALTY SYSTEM
// ============================================
router.get("/vip/inbox/:customerId", async (req, res) => {
  try {
    const { unreadOnly } = req.query;
    let messages;
    if (unreadOnly === "true") {
      messages = await storage.getUnreadVipMessages(req.params.customerId);
    } else {
      messages = await storage.getVipInboxMessages(req.params.customerId);
    }
    res.json(messages);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/vip/inbox", async (req, res) => {
  try {
    const parsed = insertVipInboxMessageSchema.parse(req.body);
    const message = await storage.createVipInboxMessage(parsed);
    res.status(201).json(message);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.patch("/vip/inbox/:id/read", async (req, res) => {
  try {
    const message = await storage.markVipMessageAsRead(req.params.id);
    if (!message) return res.status(404).json({ error: "Message not found" });
    res.json(message);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Notification Consents
router.get("/vip/consents/:customerId", async (req, res) => {
  try {
    const consents = await storage.getNotificationConsents(req.params.customerId);
    res.json(consents);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/vip/consents", async (req, res) => {
  try {
    const parsed = insertNotificationConsentSchema.parse(req.body);
    const consent = await storage.createNotificationConsent(parsed);
    res.status(201).json(consent);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.patch("/vip/consents/:id", async (req, res) => {
  try {
    const consent = await storage.updateNotificationConsent(req.params.id, req.body);
    if (!consent) return res.status(404).json({ error: "Consent not found" });
    res.json(consent);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// ============================================
// E-GIFT PACKAGES
// ============================================
router.get("/gifts/packages", async (req, res) => {
  try {
    const packages = await storage.getActiveEGiftPackages();
    res.json(packages);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/gifts/packages", async (req, res) => {
  try {
    const parsed = insertEGiftPackageSchema.parse(req.body);
    const pkg = await storage.createEGiftPackage(parsed);
    res.status(201).json(pkg);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/gifts/purchases/:customerId", async (req, res) => {
  try {
    const purchases = await storage.getEGiftPurchasesByCustomer(req.params.customerId);
    res.json(purchases);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/gifts/redeem/:code", async (req, res) => {
  try {
    const purchase = await storage.getEGiftPurchaseByCode(req.params.code);
    if (!purchase) return res.status(404).json({ error: "Gift code not found" });
    if (purchase.status === "redeemed") return res.status(400).json({ error: "Gift already redeemed" });
    if (purchase.status === "expired") return res.status(400).json({ error: "Gift has expired" });
    if (new Date() > new Date(purchase.expiryDate)) return res.status(400).json({ error: "Gift has expired" });
    res.json(purchase);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/gifts/purchases", async (req, res) => {
  try {
    const parsed = insertEGiftPurchaseSchema.parse(req.body);
    const giftCode = `ESS-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    const purchase = await storage.createEGiftPurchase({
      ...parsed,
      giftCode,
      status: "purchased"
    });
    res.status(201).json(purchase);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/gifts/redeem/:code", async (req, res) => {
  try {
    const purchase = await storage.getEGiftPurchaseByCode(req.params.code);
    if (!purchase) return res.status(404).json({ error: "Gift code not found" });
    if (purchase.status === "redeemed") return res.status(400).json({ error: "Gift already redeemed (one-time use only)" });
    if (purchase.isTransferAttempted) return res.status(400).json({ error: "Transfer attempted - gift is locked" });
    
    const { redeemedByCustomerId, redemptionEssenceUnitId } = req.body;
    
    if (redeemedByCustomerId !== purchase.purchaserCustomerId) {
      await storage.updateEGiftPurchase(purchase.id, {
        isTransferAttempted: true,
        transferBlockedAt: new Date()
      });
      return res.status(400).json({ error: "E-gift is non-transferable. Only the purchaser can redeem." });
    }
    
    const updated = await storage.updateEGiftPurchase(purchase.id, {
      status: "redeemed",
      redeemedAt: new Date(),
      redeemedByCustomerId,
      redemptionEssenceUnitId
    });
    
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// ============================================
// POS SCALE DEVICES & THEFT PREVENTION
// ============================================
router.get("/scales/:essenceUnitId", async (req, res) => {
  try {
    const devices = await storage.getPosScaleDevicesByUnit(req.params.essenceUnitId);
    res.json(devices);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/scales", async (req, res) => {
  try {
    const parsed = insertPosScaleDeviceSchema.parse(req.body);
    const device = await storage.createPosScaleDevice(parsed);
    res.status(201).json(device);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Theft Alerts
router.get("/theft/alerts", async (req, res) => {
  try {
    const { essenceUnitId, openOnly } = req.query;
    let alerts;
    if (openOnly === "true") {
      alerts = await storage.getOpenTheftAlerts();
    } else {
      alerts = await storage.getTheftAlerts(essenceUnitId as string);
    }
    res.json(alerts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/theft/alerts", async (req, res) => {
  try {
    const parsed = insertTheftAlertSchema.parse(req.body);
    const alert = await storage.createTheftAlert(parsed);
    res.status(201).json(alert);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.patch("/theft/alerts/:id", async (req, res) => {
  try {
    const alert = await storage.updateTheftAlert(req.params.id, req.body);
    if (!alert) return res.status(404).json({ error: "Alert not found" });
    res.json(alert);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// AI Theft Analysis
router.post("/theft/ai-analysis", async (req, res) => {
  try {
    const { essenceUnitId, period } = req.body;
    const alerts = await storage.getTheftAlerts(essenceUnitId);
    
    const prompt = `Analyze potential theft patterns for frozen yogurt self-serve operation:

RECENT ALERTS:
${alerts.slice(0, 20).map(a => `- ${a.alertType}: ${a.description}, Variance: ${a.variance}, Risk Score: ${a.aiRiskScore}`).join("\n")}

Analyze for:
1. Pattern identification (time of day, employee involvement, transaction types)
2. Risk assessment and priority ranking
3. Recommended investigation actions
4. Prevention measures
5. Staff training recommendations`;

    const analysis = await operationsChat(prompt);
    res.json({ analysis, alertCount: alerts.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// COMPREHENSIVE OPERATIONS DASHBOARD
// ============================================
router.get("/dashboard/summary", async (req, res) => {
  try {
    const [
      countries,
      expiringPermits,
      openFoodAlerts,
      openTheftAlerts,
      expiringIngredients
    ] = await Promise.all([
      storage.getAllCountryConfigurations(),
      storage.getExpiringPermits(30),
      storage.getOpenFoodSafetyAlerts(),
      storage.getOpenTheftAlerts(),
      storage.getExpiringIngredients(7)
    ]);
    
    res.json({
      activeCountries: countries.length,
      expiringPermitsCount: expiringPermits.length,
      openFoodAlertsCount: openFoodAlerts.length,
      openTheftAlertsCount: openTheftAlerts.length,
      expiringIngredientsCount: expiringIngredients.length,
      criticalAlerts: [
        ...openFoodAlerts.filter(a => a.severity === "critical"),
        ...openTheftAlerts.filter(a => a.severity === "critical")
      ].length
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// MULTI-METHOD AUTHENTICATION
// ============================================
import { authService } from "../services/auth-service";

// Initiate OTP (SMS or WhatsApp)
router.post("/auth/otp/send", async (req, res) => {
  try {
    const { phone, channel = "whatsapp" } = req.body;
    if (!phone) return res.status(400).json({ error: "Phone number required" });
    
    const result = await authService.initiateOTP({ phone, channel });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Verify OTP
router.post("/auth/otp/verify", async (req, res) => {
  try {
    const { verificationId, code } = req.body;
    if (!verificationId || !code) {
      return res.status(400).json({ error: "Verification ID and code required" });
    }
    
    const result = await authService.verifyOTP(verificationId, code);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Email/Password Login
router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }
    
    const result = await authService.authenticateWithEmailPassword(email, password);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Google OAuth
router.post("/auth/google", async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: "Google token required" });
    
    const result = await authService.processGoogleOAuth(token);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Apple OAuth
router.post("/auth/apple", async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: "Apple token required" });
    
    const result = await authService.processAppleOAuth(token);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Passkey Registration
router.post("/auth/passkey/register/begin", async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "User ID required" });
    
    const challenge = await authService.initiatePasskeyRegistration(userId);
    res.json(challenge);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/auth/passkey/register/complete", async (req, res) => {
  try {
    const { challengeId, credentialId, publicKey, attestation } = req.body;
    const result = await authService.completePasskeyRegistration(
      challengeId, credentialId, publicKey, attestation
    );
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Passkey Authentication
router.post("/auth/passkey/authenticate/begin", async (req, res) => {
  try {
    const { userId } = req.body;
    const challenge = await authService.initiatePasskeyAuthentication(userId);
    res.json(challenge);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/auth/passkey/authenticate/complete", async (req, res) => {
  try {
    const { challengeId, credentialId, authenticatorData, signature } = req.body;
    const result = await authService.verifyPasskey(
      challengeId, credentialId, authenticatorData, signature
    );
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Biometric Authentication
router.post("/auth/biometric/begin", async (req, res) => {
  try {
    const { deviceId, userId } = req.body;
    if (!deviceId || !userId) {
      return res.status(400).json({ error: "Device ID and user ID required" });
    }
    
    const challenge = await authService.initiateBiometricAuth(deviceId, userId);
    res.json(challenge);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/auth/biometric/verify", async (req, res) => {
  try {
    const { challengeId, biometricSignature } = req.body;
    const result = await authService.verifyBiometric(challengeId, biometricSignature);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Employee Authentication (for POS)
router.post("/auth/employee", async (req, res) => {
  try {
    const { employeeId, essenceUnitId, pin } = req.body;
    if (!employeeId || !essenceUnitId || !pin) {
      return res.status(400).json({ error: "Employee ID, unit ID, and PIN required" });
    }
    
    const result = await authService.authenticateEmployee(employeeId, essenceUnitId, pin);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Token Validation
router.post("/auth/validate", async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: "Token required" });
    
    const result = authService.validateToken(token);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
