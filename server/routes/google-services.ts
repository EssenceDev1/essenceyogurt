// Essence Yogurt - Google Services API Routes 2026
// Combined routes for Calendar, Sheets, and Tasks
// Octopus Brain Integration

import { Router } from "express";
import {
  checkCalendarConnection,
  listCalendars,
  getUpcomingEvents,
  createEvent,
  createShiftEvent,
  createMaintenanceEvent,
  createDailyBackupEvent,
  deleteEvent,
  updateEvent
} from "../services/google-calendar";
import {
  checkSheetsConnection,
  createSpreadsheet,
  readSheet,
  writeToSheet,
  appendToSheet,
  createIncidentReportSheet,
  createDailySalesReportSheet,
  exportDataToSheet
} from "../services/google-sheets";
import {
  sendGmailEmail,
  getGmailStatus,
  sendLuxuryWelcomeEmailViaGmail
} from "../services/gmail-service";

const router = Router();

// =======================================================================
// GOOGLE CALENDAR ROUTES
// =======================================================================

router.get("/calendar/status", async (req, res) => {
  try {
    const status = await checkCalendarConnection();
    res.json(status);
  } catch (error: any) {
    res.status(500).json({ connected: false, error: error.message });
  }
});

router.get("/calendar/list", async (req, res) => {
  try {
    const result = await listCalendars();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ calendars: [], error: error.message });
  }
});

router.get("/calendar/events", async (req, res) => {
  try {
    const { calendarId = 'primary', maxResults = 10 } = req.query;
    const result = await getUpcomingEvents(
      calendarId as string, 
      parseInt(maxResults as string) || 10
    );
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ events: [], error: error.message });
  }
});

router.post("/calendar/events", async (req, res) => {
  try {
    const { calendarId = 'primary', ...event } = req.body;
    const result = await createEvent(event, calendarId);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/calendar/shift", async (req, res) => {
  try {
    const shift = {
      ...req.body,
      shiftStart: new Date(req.body.shiftStart),
      shiftEnd: new Date(req.body.shiftEnd)
    };
    const result = await createShiftEvent(shift);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/calendar/maintenance", async (req, res) => {
  try {
    const maintenance = {
      ...req.body,
      scheduledStart: new Date(req.body.scheduledStart),
      scheduledEnd: new Date(req.body.scheduledEnd)
    };
    const result = await createMaintenanceEvent(maintenance);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/calendar/schedule-backup", async (req, res) => {
  try {
    const result = await createDailyBackupEvent();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete("/calendar/events/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;
    const { calendarId = 'primary' } = req.query;
    const result = await deleteEvent(eventId, calendarId as string);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.patch("/calendar/events/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;
    const { calendarId = 'primary', ...updates } = req.body;
    const result = await updateEvent(eventId, updates, calendarId);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// =======================================================================
// GOOGLE SHEETS ROUTES
// =======================================================================

router.get("/sheets/status", async (req, res) => {
  try {
    const status = await checkSheetsConnection();
    res.json(status);
  } catch (error: any) {
    res.status(500).json({ connected: false, error: error.message });
  }
});

router.post("/sheets/create", async (req, res) => {
  try {
    const { title, sheetNames } = req.body;
    const result = await createSpreadsheet(title, sheetNames);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/sheets/:spreadsheetId/read", async (req, res) => {
  try {
    const { spreadsheetId } = req.params;
    const { range = 'Sheet1!A:Z' } = req.query;
    const result = await readSheet(spreadsheetId, range as string);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ values: [], error: error.message });
  }
});

router.post("/sheets/:spreadsheetId/write", async (req, res) => {
  try {
    const { spreadsheetId } = req.params;
    const { range, values } = req.body;
    const result = await writeToSheet(spreadsheetId, range, values);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/sheets/:spreadsheetId/append", async (req, res) => {
  try {
    const { spreadsheetId } = req.params;
    const { range, values } = req.body;
    const result = await appendToSheet(spreadsheetId, range, values);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/sheets/create-incident-report", async (req, res) => {
  try {
    const result = await createIncidentReportSheet();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/sheets/create-sales-report", async (req, res) => {
  try {
    const result = await createDailySalesReportSheet();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/sheets/export", async (req, res) => {
  try {
    const { data, title } = req.body;
    const result = await exportDataToSheet(data, title);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// =======================================================================
// GMAIL ROUTES
// =======================================================================

router.get("/gmail/status", async (req, res) => {
  try {
    const status = await getGmailStatus();
    res.json(status);
  } catch (error: any) {
    res.status(500).json({ connected: false, error: error.message });
  }
});

router.post("/gmail/send", async (req, res) => {
  try {
    const { to, subject, html, from } = req.body;
    
    if (!to || !subject || !html) {
      return res.status(400).json({ 
        ok: false, 
        error: "Missing required fields: to, subject, html" 
      });
    }
    
    const result = await sendGmailEmail({ to, subject, html, from });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

router.post("/gmail/send-welcome", async (req, res) => {
  try {
    const { 
      to, 
      firstName, 
      lastName, 
      membershipTier = 'PEARL', 
      referralCode, 
      welcomePoints = 100,
      verificationLink 
    } = req.body;
    
    if (!to || !firstName || !verificationLink) {
      return res.status(400).json({ 
        ok: false, 
        error: "Missing required fields: to, firstName, verificationLink" 
      });
    }
    
    const result = await sendLuxuryWelcomeEmailViaGmail({
      to,
      firstName,
      lastName: lastName || '',
      membershipTier,
      referralCode: referralCode || `ESN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      welcomePoints,
      verificationLink
    });
    
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

// =======================================================================
// COMBINED STATUS CHECK
// =======================================================================

router.get("/status", async (req, res) => {
  try {
    const [calendarStatus, sheetsStatus, gmailStatus] = await Promise.all([
      checkCalendarConnection(),
      checkSheetsConnection(),
      getGmailStatus()
    ]);
    
    res.json({
      calendar: calendarStatus,
      sheets: sheetsStatus,
      gmail: gmailStatus,
      allConnected: calendarStatus.connected && sheetsStatus.connected && gmailStatus.connected
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
