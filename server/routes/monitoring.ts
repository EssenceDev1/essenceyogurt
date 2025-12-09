import { Router, Request, Response } from "express";
import { storage } from "../storage";
import geminiMonitor from "../services/gemini-monitor";
import {
  insertSystemLogSchema,
  insertAiAnalysisReportSchema,
  insertTranslationLogSchema,
  insertTransactionMonitoringSchema,
  insertUserErrorTrackingSchema,
  insertEcosystemHealthMetricSchema,
  insertAiMonitoringTaskSchema,
} from "@shared/schema";

const router = Router();

// =====================================================
// SYSTEM LOGS
// =====================================================

router.get("/logs", async (req: Request, res: Response) => {
  try {
    const { level, category, startDate, endDate, limit } = req.query;
    const logs = await storage.getSystemLogs({
      level: level as string,
      category: category as string,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    });
    res.json(logs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/logs", async (req: Request, res: Response) => {
  try {
    const validated = insertSystemLogSchema.parse(req.body);
    const log = await storage.createSystemLog(validated);
    res.status(201).json(log);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/logs/errors", async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    const logs = await storage.getErrorLogs(
      startDate ? new Date(startDate as string) : undefined,
      endDate ? new Date(endDate as string) : undefined
    );
    res.json(logs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/logs/category/:category", async (req: Request, res: Response) => {
  try {
    const logs = await storage.getSystemLogsByCategory(req.params.category);
    res.json(logs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// =====================================================
// AI ANALYSIS REPORTS
// =====================================================

router.get("/reports", async (req: Request, res: Response) => {
  try {
    const { type, scope, limit } = req.query;
    const reports = await storage.getAiAnalysisReports({
      type: type as string,
      scope: scope as string,
      limit: limit ? parseInt(limit as string) : undefined,
    });
    res.json(reports);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/reports/pending", async (req: Request, res: Response) => {
  try {
    const reports = await storage.getPendingActionReports();
    res.json(reports);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/reports/:id", async (req: Request, res: Response) => {
  try {
    const report = await storage.getAiAnalysisReportById(req.params.id);
    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }
    res.json(report);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/reports/:id/action", async (req: Request, res: Response) => {
  try {
    const { actionedBy, notes } = req.body;
    const report = await storage.markReportActioned(req.params.id, actionedBy, notes);
    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }
    res.json(report);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// =====================================================
// TRANSLATION LOGS
// =====================================================

router.get("/translations", async (req: Request, res: Response) => {
  try {
    const { language } = req.query;
    const logs = await storage.getTranslationLogs(language as string);
    res.json(logs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/translations/unreviewed", async (req: Request, res: Response) => {
  try {
    const logs = await storage.getUnreviewedTranslations();
    res.json(logs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/translations", async (req: Request, res: Response) => {
  try {
    const validated = insertTranslationLogSchema.parse(req.body);
    const log = await storage.createTranslationLog(validated);
    res.status(201).json(log);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/translations/:id/review", async (req: Request, res: Response) => {
  try {
    const { reviewedBy, notes } = req.body;
    const log = await storage.reviewTranslation(req.params.id, reviewedBy, notes);
    if (!log) {
      return res.status(404).json({ error: "Translation not found" });
    }
    res.json(log);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// =====================================================
// TRANSACTION MONITORING
// =====================================================

router.get("/transactions", async (req: Request, res: Response) => {
  try {
    const { anomalyOnly, requiresReview, limit } = req.query;
    const records = await storage.getTransactionMonitoring({
      anomalyOnly: anomalyOnly === "true",
      requiresReview: requiresReview === "true",
      limit: limit ? parseInt(limit as string) : undefined,
    });
    res.json(records);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/transactions/anomalies", async (req: Request, res: Response) => {
  try {
    const records = await storage.getAnomalousTransactions();
    res.json(records);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/transactions/:id/review", async (req: Request, res: Response) => {
  try {
    const { reviewedBy, outcome, notes } = req.body;
    const record = await storage.reviewTransaction(req.params.id, reviewedBy, outcome, notes);
    if (!record) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.json(record);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// =====================================================
// USER ERROR TRACKING
// =====================================================

router.get("/errors", async (req: Request, res: Response) => {
  try {
    const { severity, resolved, limit } = req.query;
    const errors = await storage.getUserErrors({
      severity: severity as string,
      resolved: resolved === "true" ? true : resolved === "false" ? false : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    });
    res.json(errors);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/errors/unresolved", async (req: Request, res: Response) => {
  try {
    const errors = await storage.getUnresolvedErrors();
    res.json(errors);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/errors", async (req: Request, res: Response) => {
  try {
    const validated = insertUserErrorTrackingSchema.parse(req.body);
    const error = await storage.createUserErrorTracking(validated);
    res.status(201).json(error);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/errors/:id/resolve", async (req: Request, res: Response) => {
  try {
    const { resolvedBy, resolutionType } = req.body;
    const error = await storage.resolveUserError(req.params.id, resolvedBy, resolutionType);
    if (!error) {
      return res.status(404).json({ error: "Error not found" });
    }
    res.json(error);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// =====================================================
// HEALTH METRICS
// =====================================================

router.get("/health", async (req: Request, res: Response) => {
  try {
    const { type, scope, periodType, limit } = req.query;
    const metrics = await storage.getHealthMetrics({
      type: type as string,
      scope: scope as string,
      periodType: periodType as string,
      limit: limit ? parseInt(limit as string) : undefined,
    });
    res.json(metrics);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/health/latest", async (req: Request, res: Response) => {
  try {
    const metrics = await storage.getLatestHealthStatus();
    res.json(metrics);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/health/critical", async (req: Request, res: Response) => {
  try {
    const metrics = await storage.getCriticalHealthMetrics();
    res.json(metrics);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/health", async (req: Request, res: Response) => {
  try {
    const validated = insertEcosystemHealthMetricSchema.parse(req.body);
    const metric = await storage.createHealthMetric(validated);
    res.status(201).json(metric);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// =====================================================
// AI MONITORING TASKS
// =====================================================

router.get("/tasks", async (req: Request, res: Response) => {
  try {
    const { activeOnly } = req.query;
    const tasks = await storage.getAiMonitoringTasks(activeOnly === "true");
    res.json(tasks);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/tasks/:id", async (req: Request, res: Response) => {
  try {
    const task = await storage.getAiMonitoringTaskById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json(task);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/tasks", async (req: Request, res: Response) => {
  try {
    const validated = insertAiMonitoringTaskSchema.parse(req.body);
    const task = await storage.createAiMonitoringTask(validated);
    res.status(201).json(task);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/tasks/:id/toggle", async (req: Request, res: Response) => {
  try {
    const task = await storage.toggleTaskActive(req.params.id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json(task);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// =====================================================
// DASHBOARD STATS
// =====================================================

router.get("/dashboard", async (req: Request, res: Response) => {
  try {
    const stats = await storage.getMonitoringDashboardStats();
    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// =====================================================
// AI ANALYSIS ENDPOINTS (Gemini-powered)
// =====================================================

router.post("/ai/analyze-transaction", async (req: Request, res: Response) => {
  try {
    const { amount, currency, transactionType, paymentMethod, employeeId, timestamp, locationId, previousTransactions } = req.body;
    
    const analysis = await geminiMonitor.analyzeTransaction({
      amount,
      currency: currency || "USD",
      transactionType,
      paymentMethod,
      employeeId,
      timestamp: new Date(timestamp || Date.now()),
      locationId,
      previousTransactions,
    });

    if (analysis.isAnomaly || analysis.riskScore > 50) {
      await storage.createTransactionMonitoring({
        transactionId: req.body.transactionId || `txn_${Date.now()}`,
        essenceUnitId: locationId || "unknown",
        employeeId,
        transactionType,
        amount: String(amount),
        currency: currency || "USD",
        paymentMethod,
        riskScore: String(analysis.riskScore),
        riskFactors: JSON.stringify(analysis.riskFactors),
        anomalyType: analysis.anomalyType,
        aiAnalysis: analysis.summary,
      });
    }

    res.json(analysis);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/ai/analyze-errors", async (req: Request, res: Response) => {
  try {
    const { errors } = req.body;
    const analysis = await geminiMonitor.analyzeErrors(errors);
    
    await storage.createAiAnalysisReport({
      reportType: "error_analysis",
      scope: "global",
      title: "Error Pattern Analysis",
      summary: analysis.summary,
      findings: JSON.stringify([{ rootCause: analysis.rootCause, suggestedFix: analysis.suggestedFix }]),
      recommendations: JSON.stringify(analysis.preventionSteps),
      riskLevel: analysis.severity,
      isActionRequired: analysis.severity === "high" || analysis.severity === "critical",
    });

    res.json(analysis);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/ai/analyze-translations", async (req: Request, res: Response) => {
  try {
    const { translations } = req.body;
    const quality = await geminiMonitor.assessTranslationQuality(translations);
    
    await storage.createAiAnalysisReport({
      reportType: "translation_quality",
      scope: "global",
      title: "Translation Quality Assessment",
      summary: quality.overallAssessment,
      findings: JSON.stringify(quality.issues),
      recommendations: JSON.stringify(quality.culturalNotes),
      confidenceScore: String(quality.qualityScore),
      isActionRequired: quality.qualityScore < 70,
    });

    res.json(quality);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/ai/analyze-health", async (req: Request, res: Response) => {
  try {
    const metrics = req.body;
    const analysis = await geminiMonitor.analyzeSystemHealth(metrics);
    
    const now = new Date();
    await storage.createHealthMetric({
      metricType: "system_health",
      scope: "global",
      metricName: "Overall System Health",
      metricValue: String(analysis.healthScore),
      metricUnit: "score",
      status: analysis.overallStatus,
      periodStart: new Date(now.getTime() - 3600000),
      periodEnd: now,
      periodType: "hourly",
      aiInsight: analysis.forecast,
    });

    res.json(analysis);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/ai/analyze-sales", async (req: Request, res: Response) => {
  try {
    const { transactions, period, locationId } = req.body;
    const analysis = await geminiMonitor.analyzeSalesPatterns({ transactions, period, locationId });
    
    await storage.createAiAnalysisReport({
      reportType: "sales_forecast",
      scope: locationId ? "unit" : "global",
      scopeId: locationId,
      title: `Sales Analysis - ${period}`,
      summary: analysis.summary,
      findings: JSON.stringify({ patterns: analysis.patterns, peakHours: analysis.peakHours }),
      recommendations: JSON.stringify(analysis.recommendations),
      confidenceScore: String(analysis.forecast.confidence),
    });

    res.json(analysis);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/ai/analyze-inventory", async (req: Request, res: Response) => {
  try {
    const { items, movements, wasteReports } = req.body;
    const analysis = await geminiMonitor.analyzeInventory({ items, movements, wasteReports });
    
    await storage.createAiAnalysisReport({
      reportType: "inventory_anomaly",
      scope: "global",
      title: "Inventory Analysis Report",
      summary: analysis.summary,
      findings: JSON.stringify(analysis.anomalies),
      recommendations: JSON.stringify(analysis.restockRecommendations),
      isActionRequired: analysis.anomalies.some(a => a.severity === "high"),
    });

    res.json(analysis);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/ai/daily-report", async (req: Request, res: Response) => {
  try {
    const { date, transactions, errors, alerts, metrics } = req.body;
    const report = await geminiMonitor.generateDailyReport({ date, transactions, errors, alerts, metrics });
    
    await storage.createAiAnalysisReport({
      reportType: "performance_summary",
      scope: "global",
      title: `Daily Operations Report - ${date}`,
      summary: report.executiveSummary,
      findings: JSON.stringify({
        highlights: report.operationalHighlights,
        kpi: report.kpiSummary,
      }),
      recommendations: JSON.stringify(report.recommendations),
      isActionRequired: report.riskAlerts.length > 0,
    });

    res.json(report);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/ai/chat", async (req: Request, res: Response) => {
  try {
    const { message, context } = req.body;
    const response = await geminiMonitor.operationsChat(message, context);
    res.json({ response });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/device-check", async (req: Request, res: Response) => {
  try {
    const deviceInfo = req.body;
    
    await storage.createSystemLog({
      logLevel: "info",
      category: "device_compatibility",
      message: `Device check: ${deviceInfo.platform} ${deviceInfo.osVersion} - ${deviceInfo.browser} ${deviceInfo.browserVersion}`,
      details: JSON.stringify(deviceInfo),
      source: "auto_update",
    });
    
    const browserCompatibility: Record<string, { minVersion: string; status: string }> = {
      'Chrome': { minVersion: '90', status: 'supported' },
      'Chrome iOS': { minVersion: '90', status: 'supported' },
      'Safari': { minVersion: '14', status: 'supported' },
      'Firefox': { minVersion: '88', status: 'supported' },
      'Firefox iOS': { minVersion: '88', status: 'supported' },
      'Edge': { minVersion: '90', status: 'supported' },
      'Edge iOS': { minVersion: '90', status: 'supported' },
      'Samsung Internet': { minVersion: '14', status: 'supported' },
      'Opera': { minVersion: '76', status: 'supported' },
    };
    
    const browserInfo = browserCompatibility[deviceInfo.browser];
    const currentVersion = parseFloat(deviceInfo.browserVersion) || 0;
    const minVersion = browserInfo ? parseFloat(browserInfo.minVersion) : 0;
    
    const isCompatible = browserInfo ? currentVersion >= minVersion : true;
    const needsUpdate = browserInfo ? currentVersion < minVersion : false;
    
    res.json({
      success: true,
      compatible: isCompatible,
      needsUpdate,
      recommendation: needsUpdate 
        ? `Please update ${deviceInfo.browser} to version ${browserInfo?.minVersion} or higher for the best experience.`
        : null,
      appVersion: '2025.12.02',
      supportedFeatures: {
        serviceWorker: deviceInfo.supportsServiceWorker,
        push: deviceInfo.supportsPush,
        webGL: deviceInfo.supportsWebGL,
        offline: deviceInfo.supportsServiceWorker,
      },
    });
  } catch (error: any) {
    res.status(200).json({ 
      success: true, 
      compatible: true,
      appVersion: '2025.12.02'
    });
  }
});

export default router;
