import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  const cwd = process.cwd();
  
  // Try multiple possible locations for static files
  const possiblePaths = [
    path.join(cwd, "server", "public"),  // Primary: server/public (where build copies to)
    path.join(cwd, "dist", "public"),     // Fallback: dist/public
    path.join(cwd, "public"),             // Fallback: public
  ];
  
  console.log("[Static] CWD:", cwd);
  console.log("[Static] Searching for static files...");
  
  let staticPath: string | null = null;
  
  for (const p of possiblePaths) {
    const exists = fs.existsSync(p);
    const hasIndex = exists && fs.existsSync(path.join(p, "index.html"));
    console.log("[Static] Checking:", p, "exists:", exists, "has index.html:", hasIndex);
    
    if (hasIndex && !staticPath) {
      staticPath = p;
    }
  }
  
  if (!staticPath) {
    console.error("[Static] No valid static directory found!");
    console.error("[Static] Directory contents:", fs.readdirSync(cwd));
    throw new Error("Cannot find static files in any expected location");
  }
  
  console.log("[Static] Using:", staticPath);
  
  // List assets
  const assetsDir = path.join(staticPath, "assets");
  if (fs.existsSync(assetsDir)) {
    const files = fs.readdirSync(assetsDir);
    console.log("[Static] Assets count:", files.length);
    const jsFiles = files.filter(f => f.endsWith(".js"));
    const cssFiles = files.filter(f => f.endsWith(".css"));
    console.log("[Static] JS:", jsFiles.join(", "));
    console.log("[Static] CSS:", cssFiles.join(", "));
  }
  
  const indexFile = path.join(staticPath, "index.html");
  
  // Serve static files
  app.use(express.static(staticPath, { 
    index: false,
    maxAge: '1y',
    immutable: true
  }));
  
  // SPA fallback
  app.use("*", (_req, res) => {
    res.sendFile(indexFile);
  });
  
  console.log("[Static] Ready to serve from:", staticPath);
}
