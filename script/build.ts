import { build as esbuild } from "esbuild";
import { build as viteBuild } from "vite";
import { rm, readFile, cp, mkdir } from "fs/promises";
import { existsSync } from "fs";

// Server dependencies to bundle for production
// This reduces cold start times by bundling commonly used packages
const allowlist = [
  // AI & APIs
  "@google/genai",
  "@google/generative-ai",
  "openai",
  
  // Database
  "@neondatabase/serverless",
  "drizzle-orm",
  "drizzle-zod",
  "connect-pg-simple",
  "pg",
  "pg-pool",
  
  // Express & middleware
  "express",
  "express-session",
  "express-rate-limit",
  "cors",
  "multer",
  "passport",
  "passport-local",
  "openid-client",
  
  // Session & storage
  "memorystore",
  "memoizee",
  
  // Utilities
  "axios",
  "date-fns",
  "jsonwebtoken",
  "nanoid",
  "uuid",
  "p-limit",
  "p-retry",
  "zod",
  "zod-validation-error",
  
  // Communication
  "nodemailer",
  "ws",
  
  // Payments
  "stripe",
  "checkout-sdk-node",
  
  // File handling
  "xlsx",
  
  // Crypto (built-in but sometimes bundled)
  "crypto",
  "buffer",
  "stream",
  "util",
  "events",
  "path",
  "fs",
  "http",
  "https",
  "url",
  "querystring",
  "os",
  "net",
  "tls",
];

async function buildAll() {
  await rm("dist", { recursive: true, force: true });
  
  // CRITICAL: Clean old artifacts to prevent stale deployments
  // Must delete index.html AND assets folder - both have hashed references
  // The new build will recreate everything fresh
  console.log("cleaning old build artifacts...");
  
  // Delete old index.html (references old bundle hashes)
  if (existsSync("server/public/index.html")) {
    await rm("server/public/index.html", { force: true });
    console.log("removed old index.html");
  }
  
  // Delete old assets folder (contains old hashed bundles)
  if (existsSync("server/public/assets")) {
    await rm("server/public/assets", { recursive: true, force: true });
    console.log("removed old assets folder");
  }
  
  // Also clean other potentially stale files
  const staleFiles = ["server/public/manifest.json", "server/public/sw.js"];
  for (const file of staleFiles) {
    if (existsSync(file)) {
      await rm(file, { force: true });
    }
  }
  
  // Ensure the directory structure exists
  await mkdir("server/public", { recursive: true });

  console.log("building client...");
  await viteBuild();

  // Copy to server/public for Autoscale deployment
  // The dist folder is hidden in .replit and won't be packaged
  console.log("copying assets to server/public...");
  await cp("dist/public", "server/public", { recursive: true, force: true });
  console.log("assets copied to server/public");

  console.log("building server...");
  const pkg = JSON.parse(await readFile("package.json", "utf-8"));
  const allDeps = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
  ];
  const externals = allDeps.filter((dep) => !allowlist.includes(dep));

  await esbuild({
    entryPoints: ["server/index.ts"],
    platform: "node",
    bundle: true,
    format: "cjs",
    outfile: "dist/index.cjs",
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    minify: true,
    external: externals,
    logLevel: "info",
  });
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
