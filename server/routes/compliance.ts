import { Router } from "express";
import { storage } from "../storage";
import {
  insertUtilityBillSchema,
  insertRiskEventSchema,
  insertWasteLogSchema,
  insertIncidentRecordSchema,
  insertInsuranceRecordSchema,
} from "@shared/schema";
import {
  refreshPermitStatuses,
  refreshInsuranceStatuses,
  checkTemperatureBreaches,
  runFraudHeuristics,
  runAIComplianceSweep,
  reportIncident,
  runDailyComplianceSweepAllUnits,
  type IncidentCategory,
} from "../services/compliance-operations";

const router = Router();

// ============================================
// RISK EVENTS
// ============================================
router.get("/risk-events", async (req, res) => {
  try {
    const { essenceUnitId, openOnly } = req.query;
    let events;
    if (openOnly === "true") {
      events = await storage.getOpenRiskEvents(essenceUnitId as string);
    } else if (essenceUnitId) {
      events = await storage.getRiskEventsByUnit(essenceUnitId as string, 90);
    } else {
      events = await storage.getOpenRiskEvents();
    }
    res.json(events);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/risk-events", async (req, res) => {
  try {
    const parsed = insertRiskEventSchema.parse(req.body);
    const event = await storage.createRiskEvent(parsed);
    res.status(201).json(event);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.patch("/risk-events/:id/resolve", async (req, res) => {
  try {
    const { resolvedByUserId, notes } = req.body;
    const event = await storage.resolveRiskEvent(req.params.id, resolvedByUserId, notes);
    if (!event) return res.status(404).json({ error: "Risk event not found" });
    res.json(event);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// ============================================
// INSURANCE RECORDS
// ============================================
router.get("/insurance-records", async (req, res) => {
  try {
    const { essenceUnitId, expiringDays } = req.query;
    let records;
    if (expiringDays) {
      records = await storage.getExpiringInsuranceRecords(Number(expiringDays));
    } else if (essenceUnitId) {
      records = await storage.getInsuranceRecordsByUnit(essenceUnitId as string);
    } else {
      records = await storage.getExpiringInsuranceRecords(365);
    }
    res.json(records);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/insurance-records", async (req, res) => {
  try {
    const parsed = insertInsuranceRecordSchema.parse(req.body);
    const record = await storage.createInsuranceRecord(parsed);
    res.status(201).json(record);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.patch("/insurance-records/:id", async (req, res) => {
  try {
    const record = await storage.updateInsuranceRecord(req.params.id, req.body);
    if (!record) return res.status(404).json({ error: "Insurance record not found" });
    res.json(record);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// ============================================
// UTILITY BILLS
// ============================================
router.get("/utility-bills", async (req, res) => {
  try {
    const { essenceUnitId, overdueOnly } = req.query;
    let bills;
    if (overdueOnly === "true") {
      bills = await storage.getOverdueUtilityBills();
    } else if (essenceUnitId) {
      bills = await storage.getUtilityBillsByUnit(essenceUnitId as string, 90);
    } else {
      bills = await storage.getOverdueUtilityBills();
    }
    res.json(bills);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/utility-bills", async (req, res) => {
  try {
    const parsed = insertUtilityBillSchema.parse(req.body);
    const bill = await storage.createUtilityBill(parsed);
    res.status(201).json(bill);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.patch("/utility-bills/:id", async (req, res) => {
  try {
    const bill = await storage.updateUtilityBill(req.params.id, req.body);
    if (!bill) return res.status(404).json({ error: "Utility bill not found" });
    res.json(bill);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// ============================================
// WASTE LOGS
// ============================================
router.get("/waste-logs", async (req, res) => {
  try {
    const { essenceUnitId, pendingOnly } = req.query;
    let logs;
    if (pendingOnly === "true") {
      logs = await storage.getPendingWasteLogs(essenceUnitId as string);
    } else if (essenceUnitId) {
      logs = await storage.getWasteLogsByUnit(essenceUnitId as string, 90);
    } else {
      logs = await storage.getPendingWasteLogs();
    }
    res.json(logs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/waste-logs", async (req, res) => {
  try {
    const parsed = insertWasteLogSchema.parse(req.body);
    const log = await storage.createWasteLog(parsed);
    res.status(201).json(log);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.patch("/waste-logs/:id/approve", async (req, res) => {
  try {
    const { supervisorId } = req.body;
    const log = await storage.approveWasteLog(req.params.id, supervisorId);
    if (!log) return res.status(404).json({ error: "Waste log not found" });
    res.json(log);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// ============================================
// COMPLIANCE AUDITS
// ============================================
router.get("/audits", async (req, res) => {
  try {
    const { essenceUnitId } = req.query;
    if (!essenceUnitId) {
      return res.status(400).json({ error: "essenceUnitId required" });
    }
    const audits = await storage.getComplianceAuditLogs(essenceUnitId as string, 90);
    res.json(audits);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/audits/:essenceUnitId/latest", async (req, res) => {
  try {
    const audit = await storage.getLatestComplianceAudit(req.params.essenceUnitId);
    if (!audit) return res.status(404).json({ error: "No audit found" });
    res.json(audit);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/audits/:essenceUnitId/trigger", async (req, res) => {
  try {
    const result = await runAIComplianceSweep(req.params.essenceUnitId);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// COMPLIANCE STATUS (COMBINED VIEW)
// ============================================
router.get("/status/:essenceUnitId", async (req, res) => {
  try {
    const essenceUnitId = req.params.essenceUnitId;
    const [permits, insurances, utilities, wasteLogs, temperatures, riskEvents, latestAudit, unit] = await Promise.all([
      storage.getRegulatoryPermitsByUnit(essenceUnitId),
      storage.getInsuranceRecordsByUnit(essenceUnitId),
      storage.getUtilityBillsByUnit(essenceUnitId, 90),
      storage.getWasteLogsByUnit(essenceUnitId, 30),
      storage.getTemperatureReadingsByEssenceUnit(essenceUnitId, 7),
      storage.getRiskEventsByUnit(essenceUnitId, 30),
      storage.getLatestComplianceAudit(essenceUnitId),
      storage.getEssenceUnitById(essenceUnitId),
    ]);

    res.json({
      unit,
      permits,
      insurances,
      utilities,
      wasteLogs,
      temperatures,
      riskEvents,
      latestAudit,
      summary: {
        totalPermits: permits.length,
        expiredPermits: permits.filter(p => p.status === 'expired').length,
        totalInsurances: insurances.length,
        expiredInsurances: insurances.filter(i => i.status === 'EXPIRED').length,
        overdueUtilities: utilities.filter(u => u.status === 'OVERDUE').length,
        openRiskEvents: riskEvents.filter(r => !r.resolvedAt).length,
        complianceStatus: latestAudit?.overallStatus || 'UNKNOWN',
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// COMPLIANCE ACTIONS
// ============================================
router.post("/refresh-permits/:essenceUnitId", async (req, res) => {
  try {
    await refreshPermitStatuses(req.params.essenceUnitId);
    res.json({ ok: true, message: "Permit statuses refreshed" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/refresh-insurance/:essenceUnitId", async (req, res) => {
  try {
    await refreshInsuranceStatuses(req.params.essenceUnitId);
    res.json({ ok: true, message: "Insurance statuses refreshed" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/check-temperatures/:essenceUnitId", async (req, res) => {
  try {
    await checkTemperatureBreaches(req.params.essenceUnitId);
    res.json({ ok: true, message: "Temperature breaches checked" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/fraud-check/:essenceUnitId", async (req, res) => {
  try {
    const { salesCount, refundCount, voidCount, wasteKg, avgWasteKg } = req.body;
    await runFraudHeuristics({
      essenceUnitId: req.params.essenceUnitId,
      last30DaySalesCount: salesCount || 0,
      last30DayRefundCount: refundCount || 0,
      last30DayVoidCount: voidCount || 0,
      wasteKgLast30Days: wasteKg || 0,
      avgWasteKgBaseline: avgWasteKg || 1,
    });
    res.json({ ok: true, message: "Fraud heuristics checked" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/daily-sweep", async (req, res) => {
  try {
    const result = await runDailyComplianceSweepAllUnits();
    res.json({ ok: true, ...result });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// INCIDENTS
// ============================================
router.get("/incidents", async (req, res) => {
  try {
    const { essenceUnitId, openOnly } = req.query;
    let incidents;
    if (openOnly === "true") {
      incidents = await storage.getOpenIncidents(essenceUnitId as string);
    } else if (essenceUnitId) {
      incidents = await storage.getIncidentsByUnit(essenceUnitId as string, 90);
    } else {
      incidents = await storage.getOpenIncidents();
    }
    res.json(incidents);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/incidents/report", async (req, res) => {
  try {
    const { essenceUnitId, reportedByUserId, category, title, description, incidentTime, locationInShop, peopleInvolved, attachments } = req.body;
    
    const result = await reportIncident({
      essenceUnitId,
      reportedByUserId,
      category: category as IncidentCategory,
      title,
      description,
      incidentTime: incidentTime ? new Date(incidentTime) : undefined,
      locationInShop,
      peopleInvolved,
      attachments,
    });
    
    res.status(201).json({ ok: true, incident: result });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.patch("/incidents/:id", async (req, res) => {
  try {
    const incident = await storage.updateIncidentRecord(req.params.id, req.body);
    if (!incident) return res.status(404).json({ error: "Incident not found" });
    res.json(incident);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.patch("/incidents/:id/resolve", async (req, res) => {
  try {
    const { resolvedByUserId, notes } = req.body;
    const incident = await storage.resolveIncident(req.params.id, resolvedByUserId, notes);
    if (!incident) return res.status(404).json({ error: "Incident not found" });
    res.json(incident);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
