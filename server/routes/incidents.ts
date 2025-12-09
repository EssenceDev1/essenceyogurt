import { Router } from "express";
import { storage } from "../storage";
import {
  reportIncident,
  type IncidentCategory,
} from "../services/compliance-operations";
import { notifyIncidentEscalation, queueDigestMessage } from "../services/email-backup";

const router = Router();

// ============================================
// INCIDENT ROUTES - Compatible with EssenceIncidentUI2025
// ============================================

// POST /api/incidents/report - Staff incident report form
router.post("/report", async (req, res) => {
  try {
    const { 
      shopId, 
      essenceUnitId,
      reportedByUserId, 
      category, 
      title, 
      description, 
      incidentTime, 
      locationInShop, 
      peopleInvolved, 
      attachments 
    } = req.body;
    
    // Support both shopId and essenceUnitId for compatibility
    const unitId = essenceUnitId || shopId;
    
    // Validate required fields as per Octopus Brain 2026 spec
    if (!unitId || !reportedByUserId || !title || !description) {
      return res.status(400).json({ error: "Missing required fields: shopId, reportedByUserId, title, and description are required" });
    }
    
    const result = await reportIncident({
      essenceUnitId: unitId,
      reportedByUserId,
      category: (category as IncidentCategory) || "OTHER",
      title,
      description,
      incidentTime: incidentTime ? new Date(incidentTime) : undefined,
      locationInShop,
      peopleInvolved,
      attachments,
    });
    
    // Auto-escalate HIGH and CRITICAL severity incidents via email
    if (result.severity === "HIGH" || result.severity === "CRITICAL") {
      notifyIncidentEscalation({
        id: result.id,
        shopId: unitId,
        title,
        severity: result.severity,
        aiSummary: result.aiTriageSummary || "Pending AI analysis",
      }).catch((err) => console.error("[Email Escalation Error]", err));
    }
    
    // Queue all incidents for daily digest
    queueDigestMessage(`New incident: ${result.severity} - ${title} at ${unitId}`);
    
    res.status(201).json({ ok: true, incident: result });
  } catch (error: any) {
    console.error("Incident report error:", error);
    res.status(500).json({ error: "Failed to report incident" });
  }
});

// GET /api/incidents/shop/:shopId - Get incidents for a shop
router.get("/shop/:shopId", async (req, res) => {
  try {
    const { shopId } = req.params;
    const { lastNDays } = req.query;
    const days = lastNDays ? parseInt(lastNDays as string, 10) : 90;
    
    const incidents = await storage.getIncidentsByUnit(shopId, days);
    res.json({ shopId, lastNDays: days, incidents });
  } catch (error: any) {
    console.error("Get incidents error:", error);
    res.status(500).json({ error: "Failed to fetch incidents" });
  }
});

// GET /api/incidents - Get all open incidents
router.get("/", async (req, res) => {
  try {
    const { essenceUnitId, shopId, openOnly } = req.query;
    const unitId = (essenceUnitId || shopId) as string | undefined;
    
    let incidents;
    if (openOnly === "true") {
      incidents = await storage.getOpenIncidents(unitId);
    } else if (unitId) {
      incidents = await storage.getIncidentsByUnit(unitId, 90);
    } else {
      incidents = await storage.getOpenIncidents();
    }
    res.json({ incidents });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/incidents/:id - Update incident
router.patch("/:id", async (req, res) => {
  try {
    const incident = await storage.updateIncidentRecord(req.params.id, req.body);
    if (!incident) return res.status(404).json({ error: "Incident not found" });
    res.json({ incident });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// PATCH /api/incidents/:id/resolve - Resolve incident
router.patch("/:id/resolve", async (req, res) => {
  try {
    const { resolvedByUserId, notes } = req.body;
    const incident = await storage.resolveIncident(req.params.id, resolvedByUserId, notes);
    if (!incident) return res.status(404).json({ error: "Incident not found" });
    res.json({ incident });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
