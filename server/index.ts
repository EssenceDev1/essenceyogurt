import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import { loggingMiddleware, errorTrackingMiddleware } from "./middleware/monitoring";

const app = express();
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

// CRITICAL: Immediate health check endpoint for deployment - NO dependencies
// This MUST be before any middleware that could block or fail
app.get("/healthz", (_req, res) => {
  res.status(200).send("OK");
});

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "healthy", timestamp: new Date().toISOString() });
});

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

app.use(loggingMiddleware);

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

// CRITICAL: Start listening IMMEDIATELY for health checks
// This ensures deployment health checks pass while we initialize
const port = parseInt(process.env.PORT || "5000", 10);
httpServer.listen(
  {
    port,
    host: "0.0.0.0",
    reusePort: true,
  },
  () => {
    log(`serving on port ${port}`);
    
    // Initialize routes and middleware AFTER server is listening
    initializeApp().catch((error) => {
      console.error("Failed to initialize app:", error);
    });
  },
);

async function initializeApp() {
  try {
    // Register all routes (includes auth setup, database connections)
    await registerRoutes(httpServer, app);

    app.use(errorTrackingMiddleware);
    
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      console.error(`[Error] ${status}: ${message}`, err.stack || "");
      res.status(status).json({ message });
    });

    // API fallback - catch unmatched /api requests before SPA catch-all
    app.use('/api', (_req: Request, res: Response) => {
      res.status(404).json({ 
        error: 'Not Found',
        message: 'The requested API endpoint does not exist',
        path: _req.path
      });
    });

    // Setup static serving or vite dev server
    if (process.env.NODE_ENV === "production") {
      serveStatic(app);
    } else {
      const { setupVite } = await import("./vite");
      await setupVite(httpServer, app);
    }

    log("App fully initialized");
  } catch (error) {
    console.error("Error during app initialization:", error);
    // Don't exit - health checks should still work
  }
}
