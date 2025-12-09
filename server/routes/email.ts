import { Router } from "express";
import {
  getEmailService,
  sendDailyDigest,
  getDigestQueue,
  notifyBackupComplete,
  notifyError,
  notifyDeploy,
  notifyQAReport,
  notifyIncidentEscalation,
} from "../services/email-backup";

const router = Router();

// GET /api/email/status - Get email service status
router.get("/status", (req, res) => {
  const service = getEmailService();
  const status = service.getStatus();
  const digestQueue = getDigestQueue();
  
  res.json({
    configured: status.configured,
    recipient: status.recipient,
    digestQueueSize: digestQueue.length,
  });
});

// POST /api/email/test - Send a test email
router.post("/test", async (req, res) => {
  try {
    const service = getEmailService();
    const result = await service.send({
      subject: "Essence Yogurt – Test Email",
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #B08D57, #D6A743); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Essence Yogurt</h1>
            <p style="color: white; margin: 5px 0 0;">Test Email</p>
          </div>
          <div style="padding: 20px; background: white;">
            <h2>Email Service Test</h2>
            <p>This is a test email from Essence Yogurt's Octopus Brain 2026 system.</p>
            <p>If you received this email, the email notification service is working correctly.</p>
            <p style="color: #666; font-size: 12px;">Sent: ${new Date().toISOString()}</p>
          </div>
        </div>
      `,
    });
    
    res.json({ ok: result.ok, message: result.error || "Test email sent" });
  } catch (error: any) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

// POST /api/email/digest/send - Send daily digest now
router.post("/digest/send", async (req, res) => {
  try {
    const result = await sendDailyDigest();
    res.json({ ok: result.ok, messageCount: result.messageCount });
  } catch (error: any) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

// GET /api/email/digest/queue - Get current digest queue
router.get("/digest/queue", (req, res) => {
  const queue = getDigestQueue();
  res.json({ queue, count: queue.length });
});

// POST /api/email/notify/backup - Send backup notification
router.post("/notify/backup", async (req, res) => {
  try {
    const { sizeMB, fileName, createdAt } = req.body;
    
    if (!sizeMB || !fileName || !createdAt) {
      return res.status(400).json({ error: "Missing required fields: sizeMB, fileName, createdAt" });
    }
    
    const result = await notifyBackupComplete({ sizeMB, fileName, createdAt });
    res.json({ ok: result.ok });
  } catch (error: any) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

// POST /api/email/notify/error - Send error notification
router.post("/notify/error", async (req, res) => {
  try {
    const { error, context } = req.body;
    
    if (!error) {
      return res.status(400).json({ error: "Missing required field: error" });
    }
    
    const result = await notifyError(error, context);
    res.json({ ok: result.ok });
  } catch (error: any) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

// POST /api/email/notify/deploy - Send deployment notification
router.post("/notify/deploy", async (req, res) => {
  try {
    const { version, env, url } = req.body;
    
    if (!version || !env || !url) {
      return res.status(400).json({ error: "Missing required fields: version, env, url" });
    }
    
    const result = await notifyDeploy({ version, env, url });
    res.json({ ok: result.ok });
  } catch (error: any) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

// POST /api/email/notify/qa - Send QA report notification
router.post("/notify/qa", async (req, res) => {
  try {
    const { testsPassed, testsFailed, coverage, summary } = req.body;
    
    if (testsPassed === undefined || testsFailed === undefined || !summary) {
      return res.status(400).json({ error: "Missing required fields: testsPassed, testsFailed, summary" });
    }
    
    const result = await notifyQAReport({ testsPassed, testsFailed, coverage, summary });
    res.json({ ok: result.ok });
  } catch (error: any) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

// POST /api/email/notify/incident - Send incident escalation
router.post("/notify/incident", async (req, res) => {
  try {
    const { id, shopId, title, severity, aiSummary } = req.body;
    
    if (!id || !shopId || !title || !severity || !aiSummary) {
      return res.status(400).json({ error: "Missing required fields: id, shopId, title, severity, aiSummary" });
    }
    
    const result = await notifyIncidentEscalation({ id, shopId, title, severity, aiSummary });
    res.json({ ok: result.ok });
  } catch (error: any) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

export default router;
