import { Request, Response, NextFunction } from "express";
import { storage } from "../storage";

interface RequestWithTiming extends Request {
  startTime?: number;
}

export async function loggingMiddleware(req: RequestWithTiming, res: Response, next: NextFunction) {
  if (!req.path.startsWith("/api/")) {
    return next();
  }

  req.startTime = Date.now();

  const originalJson = res.json.bind(res);
  res.json = (body: any) => {
    const responseTime = Date.now() - (req.startTime || Date.now());

    const logEntry = {
      logLevel: res.statusCode >= 500 ? "error" : res.statusCode >= 400 ? "warning" : "info",
      category: getCategoryFromPath(req.path),
      source: `${req.method} ${req.path}`,
      message: `${req.method} ${req.path} - ${res.statusCode}`,
      requestMethod: req.method,
      requestPath: req.path,
      responseStatus: res.statusCode,
      responseTime,
      userAgent: req.headers["user-agent"],
      ipAddress: req.ip || req.headers["x-forwarded-for"]?.toString(),
      language: req.headers["accept-language"]?.split(",")[0],
      sessionId: req.headers["x-session-id"]?.toString(),
    };

    storage.createSystemLog(logEntry as any).catch((err) => {
      console.error("Failed to create log entry:", err.message);
    });

    return originalJson(body);
  };

  next();
}

function getCategoryFromPath(path: string): string {
  if (path.includes("/pos")) return "pos";
  if (path.includes("/timesheet")) return "timesheet";
  if (path.includes("/inventory") || path.includes("/stock")) return "inventory";
  if (path.includes("/monitoring")) return "monitoring";
  if (path.includes("/auth")) return "auth";
  if (path.includes("/payment")) return "payment";
  if (path.includes("/flavor")) return "api";
  if (path.includes("/customer")) return "api";
  return "api";
}

export async function errorTrackingMiddleware(err: any, req: Request, res: Response, next: NextFunction) {
  const errorEntry = {
    errorType: "api_error",
    errorCode: err.code || "INTERNAL_ERROR",
    errorMessage: err.message || "Unknown error",
    stackTrace: err.stack,
    page: req.path,
    action: `${req.method} request`,
    browserInfo: req.headers["user-agent"],
    severity: err.status >= 500 ? "critical" : "high",
  };

  try {
    const existing = await storage.incrementErrorCount(errorEntry.errorMessage, errorEntry.errorType);
    if (!existing) {
      await storage.createUserErrorTracking(errorEntry as any);
    }
  } catch (logError) {
    console.error("Failed to track error:", logError);
  }

  next(err);
}

export async function logTransactionEvent(data: {
  transactionId: string;
  essenceUnitId: string;
  employeeId?: string;
  customerId?: string;
  transactionType: string;
  amount: number;
  currency: string;
  paymentMethod?: string;
}) {
  try {
    await storage.createTransactionMonitoring({
      transactionId: data.transactionId,
      essenceUnitId: data.essenceUnitId,
      employeeId: data.employeeId,
      customerId: data.customerId,
      transactionType: data.transactionType,
      amount: String(data.amount),
      currency: data.currency,
      paymentMethod: data.paymentMethod,
    });
  } catch (error) {
    console.error("Failed to log transaction:", error);
  }
}

export async function logTranslationUsage(data: {
  sourceLanguage: string;
  targetLanguage: string;
  translationKey: string;
  sourceText: string;
  translatedText: string;
  context?: string;
  region?: string;
}) {
  try {
    await storage.createTranslationLog({
      sourceLanguage: data.sourceLanguage,
      targetLanguage: data.targetLanguage,
      translationKey: data.translationKey,
      sourceText: data.sourceText,
      translatedText: data.translatedText,
      translationType: "static",
      context: data.context,
      region: data.region,
    });
  } catch (error) {
    console.error("Failed to log translation:", error);
  }
}

export async function recordHealthMetric(data: {
  metricType: string;
  scope: string;
  scopeId?: string;
  metricName: string;
  metricValue: number;
  metricUnit?: string;
  status: string;
  periodType: string;
}) {
  const now = new Date();
  try {
    await storage.createHealthMetric({
      metricType: data.metricType,
      scope: data.scope,
      scopeId: data.scopeId,
      metricName: data.metricName,
      metricValue: String(data.metricValue),
      metricUnit: data.metricUnit,
      status: data.status,
      periodStart: new Date(now.getTime() - 3600000),
      periodEnd: now,
      periodType: data.periodType,
    });
  } catch (error) {
    console.error("Failed to record health metric:", error);
  }
}

export default {
  loggingMiddleware,
  errorTrackingMiddleware,
  logTransactionEvent,
  logTranslationUsage,
  recordHealthMetric,
};
