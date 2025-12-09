import { Router } from "express";
import { z } from "zod";
import { octopusBrain } from "../services/octopus-brain";
import { storage } from "../storage";
import { requireAuth, requireManager, devBypassAuth, AuthenticatedRequest } from "../middleware/auth";

const router = Router();

// =======================================================================
// ZOD SCHEMAS FOR GLOBAL OPERATIONS ENGINE VALIDATION
// =======================================================================

const GlobalStaffSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.enum(["SHIFT_LEADER", "SHIFT_MANAGER", "TEAM_MEMBER", "AREA_MANAGER", "REGIONAL_DIRECTOR"]),
  locationId: z.string().min(1, "Location ID is required"),
  trainingModules: z.array(z.string()).optional().default([]),
  certifications: z.record(z.string()).optional().default({}),
  status: z.enum(["ACTIVE", "INACTIVE", "ON_LEAVE", "TERMINATED"]).optional().default("ACTIVE")
});

const GlobalLocationSchema = z.object({
  code: z.string().min(1, "Location code is required"),
  name: z.string().min(1, "Location name is required"),
  region: z.enum(["SA", "UAE", "IL", "GR", "AU"]),
  isAirport: z.boolean().optional().default(false),
  isMall: z.boolean().optional().default(false),
  timezone: z.string().min(1, "Timezone is required"),
  riskLevel: z.number().min(0).max(10).optional().default(0)
});

const ShiftSchema = z.object({
  locationId: z.string().min(1, "Location ID is required"),
  staffId: z.string().min(1, "Staff ID is required"),
  date: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  type: z.enum(["OPENING", "MID", "CLOSING"]).optional().default("MID")
});

const EmergencyPlanSchema = z.object({
  locationId: z.string().min(1, "Location ID is required"),
  type: z.enum(["FIRE", "MEDICAL", "SECURITY", "POWER_OUTAGE", "EQUIPMENT_FAILURE"]),
  steps: z.array(z.string()).min(1, "At least one step is required"),
  contactRoles: z.array(z.string()).optional().default([])
});

const FoodSafetyRecordSchema = z.object({
  locationId: z.string().min(1, "Location ID is required"),
  equipment: z.string().min(1, "Equipment is required"),
  temperature: z.number(),
  staffId: z.string().min(1, "Staff ID is required"),
  notes: z.string().optional().default("")
});

const QAInspectionSchema = z.object({
  locationId: z.string().min(1, "Location ID is required"),
  inspectorId: z.string().min(1, "Inspector ID is required"),
  type: z.enum(["ROUTINE", "SURPRISE", "FOLLOW_UP", "EXTERNAL"]),
  scores: z.record(z.number()).optional().default({}),
  notes: z.string().optional().default("")
});

const FraudSignalSchema = z.object({
  locationId: z.string().min(1, "Location ID is required"),
  type: z.enum(["UNUSUAL_REFUND", "EXCESSIVE_VOID", "SUSPICIOUS_WASTE", "INVENTORY_DISCREPANCY", "TIME_ANOMALY"]),
  severity: z.number().min(1).max(10),
  details: z.string().optional().default(""),
  staffId: z.string().optional()
});

const GlobalIncidentSchema = z.object({
  locationId: z.string().min(1, "Location ID is required"),
  category: z.enum(["SAFETY", "SECURITY", "CUSTOMER", "STAFF", "EQUIPMENT", "FOOD_SAFETY"]),
  severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  description: z.string().min(1, "Description is required"),
  staffId: z.string().optional(),
  resolved: z.boolean().optional().default(false)
});

const GlobalSupplierSchema = z.object({
  name: z.string().min(1, "Supplier name is required"),
  type: z.enum(["INGREDIENTS", "PACKAGING", "EQUIPMENT", "CLEANING", "OTHER"]),
  halalCertified: z.boolean().optional().default(false),
  halalCertExpiry: z.string().optional(),
  lastAuditScore: z.number().min(0).max(100).optional(),
  lastAuditDate: z.string().optional(),
  regions: z.array(z.string()).optional().default([])
});

const TrainingModuleSchema = z.object({
  name: z.string().min(1, "Module name is required"),
  category: z.enum(["FOOD_SAFETY", "CUSTOMER_SERVICE", "EQUIPMENT", "HYGIENE", "EMERGENCY", "COMPLIANCE"]),
  durationHours: z.number().min(0.5),
  requiredForRoles: z.array(z.string()).optional().default([]),
  validityDays: z.number().optional().default(365),
  mandatory: z.boolean().optional().default(true)
});

const ShiftActionSchema = z.object({
  staffId: z.string().min(1, "Staff ID is required")
});

const EmergencyActionSchema = z.object({
  type: z.enum(["FIRE", "MEDICAL", "SECURITY", "POWER_OUTAGE", "EQUIPMENT_FAILURE"])
});

router.use(devBypassAuth);
router.use(requireAuth);

router.get("/health", async (req, res) => {
  try {
    const healthScore = await octopusBrain.getGlobalHealthScore();
    res.json(healthScore);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/unit/:essenceUnitId/analysis", async (req, res) => {
  try {
    const { essenceUnitId } = req.params;
    
    const [cleaning, foodSafety, theft, waste, inventory] = await Promise.all([
      octopusBrain.analyzeCleaningCompliance(essenceUnitId),
      octopusBrain.analyzeFoodSafety(essenceUnitId),
      octopusBrain.analyzeTheftRisk(essenceUnitId),
      octopusBrain.analyzeWastePatterns(essenceUnitId),
      octopusBrain.predictInventoryNeeds(essenceUnitId),
    ]);

    res.json({
      essenceUnitId,
      timestamp: new Date().toISOString(),
      cleaning,
      foodSafety,
      theft,
      waste,
      inventory,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/unit/:essenceUnitId/daily-summary", async (req, res) => {
  try {
    const { essenceUnitId } = req.params;
    const summary = await octopusBrain.generateDailySummary(essenceUnitId);
    res.json(summary);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/unit/:essenceUnitId/shift-recommendations", async (req, res) => {
  try {
    const { essenceUnitId } = req.params;
    const dateParam = req.query.date as string;
    const date = dateParam ? new Date(dateParam) : new Date();
    
    const recommendations = await octopusBrain.generateShiftRecommendations(essenceUnitId, date);
    res.json(recommendations);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/chat", async (req, res) => {
  try {
    const { message, essenceUnitId, role } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await octopusBrain.chat(message, { essenceUnitId, role });
    res.json({ response });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/verify-cleaning", async (req, res) => {
  try {
    const { photoUrl, taskName, area } = req.body;
    
    if (!taskName || !area) {
      return res.status(400).json({ error: "Task name and area are required" });
    }

    const verification = await octopusBrain.verifyCleaningPhoto(photoUrl || "", taskName, area);
    res.json(verification);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/analyze-waste", async (req, res) => {
  try {
    const { photoUrl, wasteType, quantity } = req.body;
    
    if (!wasteType || !quantity) {
      return res.status(400).json({ error: "Waste type and quantity are required" });
    }

    const analysis = await octopusBrain.analyzeWastePhoto(photoUrl || "", wasteType, quantity);
    res.json(analysis);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/units", async (req, res) => {
  try {
    const units = await storage.getAllEssenceUnits();
    res.json(units);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/alerts/active", async (req, res) => {
  try {
    const [theftAlerts, operationalAlerts] = await Promise.all([
      storage.getOpenTheftAlerts(),
      storage.getOperationalAlerts(true),
    ]);
    
    res.json({
      theft: theftAlerts,
      operational: operationalAlerts,
      total: theftAlerts.length + operationalAlerts.length,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/waste/pending", async (req, res) => {
  try {
    const pendingWaste = await storage.getPendingWasteApprovals();
    res.json(pendingWaste);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/inventory/low-stock", async (req, res) => {
  try {
    const units = await storage.getAllEssenceUnits();
    const allLowStock: any[] = [];
    
    for (const unit of units.slice(0, 10)) {
      const items = await storage.getInventoryItemsByUnit(unit.id);
      const lowItems = items.filter(item => {
        const current = parseFloat(item.currentQuantity);
        const min = parseFloat(item.minQuantity || "0");
        return current <= min;
      });
      allLowStock.push(...lowItems);
    }
    
    res.json(allLowStock);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/staff/absences", async (req, res) => {
  try {
    const units = await storage.getAllEssenceUnits();
    const allAbsences: any[] = [];
    
    for (const unit of units.slice(0, 10)) {
      const absences = await storage.getPendingAbsenceRequests(unit.id);
      allAbsences.push(...absences);
    }
    
    res.json({
      pending: allAbsences,
      total: allAbsences.length,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/dashboard-stats", async (req, res) => {
  try {
    const [
      units,
      theftAlerts,
      operationalAlerts,
      pendingWaste,
      healthScore,
    ] = await Promise.all([
      storage.getAllEssenceUnits(),
      storage.getOpenTheftAlerts(),
      storage.getOperationalAlerts(true),
      storage.getPendingWasteApprovals(),
      octopusBrain.getGlobalHealthScore(),
    ]);

    res.json({
      totalUnits: units.length,
      activeUnits: units.filter((u: any) => u.isActive).length,
      alerts: {
        theft: theftAlerts.length,
        operational: operationalAlerts.length,
        total: theftAlerts.length + operationalAlerts.length,
      },
      pendingWasteApprovals: pendingWaste.length,
      lowStockItems: 0,
      healthScore,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// =======================================================================
// OCTOPUS GLOBAL OPERATIONS ENGINE 2025 API ROUTES
// =======================================================================

// Event Log
router.get("/events", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const events = octopusBrain.getEventLog(limit);
    res.json(events);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ======================================================
// GLOBAL STAFF MANAGEMENT
// ======================================================

router.get("/global-staff", async (req, res) => {
  try {
    const staff = octopusBrain.getAllGlobalStaff();
    res.json(staff);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/global-staff/:staffId", async (req, res) => {
  try {
    const staff = octopusBrain.getGlobalStaff(req.params.staffId);
    if (!staff) {
      return res.status(404).json({ error: "Staff not found" });
    }
    res.json(staff);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/global-staff", async (req, res) => {
  try {
    const validation = GlobalStaffSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        error: "Validation failed", 
        details: validation.error.flatten().fieldErrors 
      });
    }
    const staffData = {
      id: `staff_${Date.now()}`,
      ...validation.data
    };
    octopusBrain.addGlobalStaff(staffData);
    res.status(201).json({ success: true, staff: staffData });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/global-staff/:staffId/training-validation", async (req, res) => {
  try {
    const validation = await octopusBrain.validateTrainingCertifications(req.params.staffId);
    res.json(validation);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ======================================================
// GLOBAL LOCATIONS
// ======================================================

router.get("/global-locations", async (req, res) => {
  try {
    const locations = octopusBrain.getAllGlobalLocations();
    res.json(locations);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/global-locations/:locationId", async (req, res) => {
  try {
    const location = octopusBrain.getGlobalLocation(req.params.locationId);
    if (!location) {
      return res.status(404).json({ error: "Location not found" });
    }
    res.json(location);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/global-locations", async (req, res) => {
  try {
    const validation = GlobalLocationSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        error: "Validation failed", 
        details: validation.error.flatten().fieldErrors 
      });
    }
    const locationData = {
      id: `loc_${Date.now()}`,
      ...validation.data
    };
    octopusBrain.addGlobalLocation(locationData);
    res.status(201).json({ success: true, location: locationData });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/global-locations/:locationId/kpi", async (req, res) => {
  try {
    const kpi = octopusBrain.generateLocationKPI(req.params.locationId);
    res.json(kpi);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ======================================================
// SHIFT MANAGEMENT
// ======================================================

router.get("/global-shifts", async (req, res) => {
  try {
    const shifts = octopusBrain.getAllGlobalShifts();
    res.json(shifts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/global-shifts/:locationId", async (req, res) => {
  try {
    const shifts = octopusBrain.getShiftsByLocation(req.params.locationId);
    res.json(shifts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/shifts", async (req, res) => {
  try {
    const validation = ShiftSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        error: "Validation failed", 
        details: validation.error.flatten().fieldErrors 
      });
    }
    const shiftData = {
      id: `shift_${Date.now()}`,
      ...validation.data,
      openingChecklistCompleted: false,
      closingChecklistCompleted: false,
      cleaningCompleted: false
    };
    octopusBrain.addGlobalShift(shiftData);
    res.status(201).json({ success: true, shift: shiftData });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/shifts/:shiftId/can-open", async (req, res) => {
  try {
    const result = octopusBrain.canOpenShift(req.params.shiftId);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/shifts/:shiftId/open", async (req, res) => {
  try {
    const validation = ShiftActionSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        error: "Validation failed", 
        details: validation.error.flatten().fieldErrors 
      });
    }
    const result = await octopusBrain.openShift(req.params.shiftId, validation.data.staffId);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/shifts/:shiftId/can-close", async (req, res) => {
  try {
    const result = octopusBrain.canCloseShift(req.params.shiftId);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/shifts/:shiftId/close", async (req, res) => {
  try {
    const validation = ShiftActionSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        error: "Validation failed", 
        details: validation.error.flatten().fieldErrors 
      });
    }
    const result = await octopusBrain.closeShift(req.params.shiftId, validation.data.staffId);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ======================================================
// EMERGENCY MANAGEMENT
// ======================================================

router.get("/emergencies/:locationId", async (req, res) => {
  try {
    const plans = octopusBrain.getEmergencyPlans(req.params.locationId);
    res.json(plans);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/emergencies", async (req, res) => {
  try {
    const validation = EmergencyPlanSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        error: "Validation failed", 
        details: validation.error.flatten().fieldErrors 
      });
    }
    const planData = {
      id: `emg_${Date.now()}`,
      ...validation.data
    };
    octopusBrain.addEmergencyPlan(planData);
    res.status(201).json({ success: true, plan: planData });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/emergencies/:locationId/trigger", async (req, res) => {
  try {
    const validation = EmergencyActionSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        error: "Validation failed", 
        details: validation.error.flatten().fieldErrors 
      });
    }
    const result = await octopusBrain.triggerEmergency(req.params.locationId, validation.data.type);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/emergencies/:locationId/resolve", async (req, res) => {
  try {
    const validation = EmergencyActionSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        error: "Validation failed", 
        details: validation.error.flatten().fieldErrors 
      });
    }
    await octopusBrain.resolveEmergency(req.params.locationId, validation.data.type);
    res.json({ success: true, message: "Emergency resolved" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ======================================================
// FOOD SAFETY RECORDS
// ======================================================

router.get("/food-safety/:locationId", async (req, res) => {
  try {
    const records = octopusBrain.getGlobalFoodSafetyRecords(req.params.locationId);
    res.json(records);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/food-safety", async (req, res) => {
  try {
    const validation = FoodSafetyRecordSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        error: "Validation failed", 
        details: validation.error.flatten().fieldErrors 
      });
    }
    const recordData = {
      id: `fs_${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...validation.data
    };
    octopusBrain.addGlobalFoodSafetyRecord(recordData);
    res.status(201).json({ success: true, record: recordData });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ======================================================
// QA INSPECTIONS
// ======================================================

router.get("/qa-inspections", async (req, res) => {
  try {
    const inspections = octopusBrain.getAllQAInspections();
    res.json(inspections);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/qa-inspections/:locationId", async (req, res) => {
  try {
    const inspections = octopusBrain.getQAInspections(req.params.locationId);
    res.json(inspections);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/qa-inspections", async (req, res) => {
  try {
    const validation = QAInspectionSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        error: "Validation failed", 
        details: validation.error.flatten().fieldErrors 
      });
    }
    const inspectionData = {
      id: `qa_${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...validation.data
    };
    octopusBrain.addQAInspection(inspectionData);
    res.status(201).json({ success: true, inspection: inspectionData });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ======================================================
// FRAUD DETECTION
// ======================================================

router.get("/fraud-signals", async (req, res) => {
  try {
    const signals = octopusBrain.getAllFraudSignals();
    res.json(signals);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/fraud/:locationId", async (req, res) => {
  try {
    const signals = octopusBrain.getFraudSignals(req.params.locationId);
    res.json(signals);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/fraud", async (req, res) => {
  try {
    const validation = FraudSignalSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        error: "Validation failed", 
        details: validation.error.flatten().fieldErrors 
      });
    }
    const signalData = {
      id: `fraud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...validation.data
    };
    octopusBrain.addFraudSignal(signalData);
    res.status(201).json({ success: true, signal: signalData });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/fraud/:locationId/analysis", async (req, res) => {
  try {
    const analysis = await octopusBrain.analyzeFraudPatterns(req.params.locationId);
    res.json(analysis);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ======================================================
// INCIDENTS
// ======================================================

router.get("/global-incidents/:locationId", async (req, res) => {
  try {
    const incidents = octopusBrain.getGlobalIncidents(req.params.locationId);
    res.json(incidents);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/global-incidents", async (req, res) => {
  try {
    const validation = GlobalIncidentSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        error: "Validation failed", 
        details: validation.error.flatten().fieldErrors 
      });
    }
    const incidentData = {
      id: `inc_${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...validation.data
    };
    octopusBrain.addGlobalIncident(incidentData);
    res.status(201).json({ success: true, incident: incidentData });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ======================================================
// SUPPLIER COMPLIANCE
// ======================================================

router.get("/global-suppliers", async (req, res) => {
  try {
    const suppliers = octopusBrain.getAllGlobalSuppliers();
    res.json(suppliers);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/global-suppliers/:supplierId", async (req, res) => {
  try {
    const supplier = octopusBrain.getGlobalSupplier(req.params.supplierId);
    if (!supplier) {
      return res.status(404).json({ error: "Supplier not found" });
    }
    res.json(supplier);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/global-suppliers", async (req, res) => {
  try {
    const validation = GlobalSupplierSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        error: "Validation failed", 
        details: validation.error.flatten().fieldErrors 
      });
    }
    const supplierData = {
      id: `sup_${Date.now()}`,
      ...validation.data
    };
    octopusBrain.addGlobalSupplier(supplierData);
    res.status(201).json({ success: true, supplier: supplierData });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/global-suppliers/:supplierId/verify", async (req, res) => {
  try {
    const result = await octopusBrain.verifySupplierCompliance(req.params.supplierId);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ======================================================
// TRAINING MODULES
// ======================================================

router.get("/training-modules", async (req, res) => {
  try {
    const modules = octopusBrain.getAllTrainingModules();
    res.json(modules);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/training-modules/:moduleId", async (req, res) => {
  try {
    const module = octopusBrain.getTrainingModule(req.params.moduleId);
    if (!module) {
      return res.status(404).json({ error: "Training module not found" });
    }
    res.json(module);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/training-modules", async (req, res) => {
  try {
    const validation = TrainingModuleSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        error: "Validation failed", 
        details: validation.error.flatten().fieldErrors 
      });
    }
    const moduleData = {
      id: `train_${Date.now()}`,
      ...validation.data
    };
    octopusBrain.addTrainingModule(moduleData);
    res.status(201).json({ success: true, module: moduleData });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/training-modules/:moduleId/assign/:staffId", async (req, res) => {
  try {
    const success = octopusBrain.assignTraining(req.params.staffId, req.params.moduleId);
    res.json({ success, message: success ? "Training assigned" : "Failed to assign training" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ======================================================
// GLOBAL KPI DASHBOARD
// ======================================================

router.get("/global-kpi", async (req, res) => {
  try {
    const dashboard = await octopusBrain.generateGlobalKPIDashboard();
    res.json(dashboard);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
