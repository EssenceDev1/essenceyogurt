import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import monitoringRouter from "./routes/monitoring";
import operationsRouter from "./routes/operations";
import octopusBrainRouter from "./routes/octopus-brain";
import loyaltyEngineRouter from "./routes/loyalty-engine";
import staffAiRouter from "./routes/staff-ai";
import inventoryAiRouter from "./routes/inventory-ai";
import franchiseOsRouter from "./routes/franchise-os";
import airportKioskOsRouter from "./routes/airport-kiosk-os";
import flavorEngineRouter from "./routes/flavor-engine";
import aiChatRouter from "./routes/ai-chat";
import eInvoiceRouter from "./routes/einvoice";
import posPaymentsRouter from "./routes/pos-payments";
import complianceRouter from "./routes/compliance";
import incidentsRouter from "./routes/incidents";
import emailRouter from "./routes/email";
import backupRouter from "./routes/backup";
import hrPlaybookRouter from "./routes/hr-playbook";
import executiveRouter from "./routes/executive";
import loyaltyRegistrationRouter from "./routes/loyalty-registration";
import googleServicesRouter from "./routes/google-services";
import broadcastRouter from "./routes/broadcast";
import spotifyRouter from "./routes/spotify";
import auth2025Router from "./routes/auth-2025";
import socialCloudRouter from "./routes/social-cloud";
import pushNotificationsRouter from "./routes/push-notifications";
import passkeysRouter from "./routes/passkeys";
import { requireAuth, devBypassAuth } from "./middleware/auth";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { verifyRecaptcha } from "./services/recaptcha";
import { REGION_PROFILES, getRegionProfile } from "@shared/essence-os-2026";
import {
  insertContactInquirySchema, insertFlavorSchema, insertToppingSchema, insertLocationSchema, insertJobPostingSchema,
  insertRevenueShareModelSchema, insertEssenceUnitSchema, insertPricingRuleSchema,
  insertEssenceEventSchema, insertCreditPackageSchema, insertLoyaltyTierSchema, insertCustomerSchema,
  insertEGiftCardSchema, insertFranchiseApplicationSchema, insertProgrammaticLeadSchema,
  insertJobApplicationSchema, insertFraudAlertSchema,
  insertSupplierSchema, insertSupplyItemSchema, insertPurchaseOrderSchema, insertPurchaseOrderItemSchema,
  insertInventoryBatchSchema, insertSupplierPerformanceSchema,
  insertEmployeeSchema, insertShiftTemplateSchema, insertShiftAssignmentSchema, insertLeaveRequestSchema,
  insertPayrollCycleSchema, insertPayrollEntrySchema,
  insertInsurancePolicySchema, insertBusinessLicenseSchema, insertTaxFilingSchema, insertComplianceTaskSchema, insertDocumentSchema,
  insertVipBenefitSchema, insertVipEventSchema, insertVipEventRsvpSchema, insertMemberActivityLogSchema,
  insertPosSessionSchema, insertPosTransactionSchema, insertPosTransactionItemSchema, insertPosPaymentSchema, insertScaleReadingSchema,
  insertTimesheetEntrySchema, insertTimesheetBreakSchema, insertLocationVerificationSchema,
  insertInventoryItemSchema, insertInventoryMovementSchema, insertWasteReportSchema, insertStockCountSchema, insertStockCountItemSchema,
  insertOperationalAlertSchema
} from "@shared/schema";
import { EssenceProgrammaticPlan } from "@shared/programmatic-plan";
import { sendJobApplicationNotification } from "./services/gmail-service";
import { rankCandidates, analyzeIndividualCandidate, analyzeResume } from "./services/candidate-ai";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  // Health check endpoint for autoscale
  app.get("/healthz", (_req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Setup Replit Auth (Google, Apple, GitHub, email/password login)
  await setupAuth(app);

  // Auth routes - get current user
  app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Google Maps configuration endpoint
  app.get("/api/config/maps", (req, res) => {
    let apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Google Maps API key not configured" });
    }
    // Clean up the API key - extract only valid key (starts with AIza, 39 chars)
    const match = apiKey.match(/AIza[A-Za-z0-9_-]{35}/);
    if (match) {
      apiKey = match[0];
    }
    res.json({ apiKey });
  });

  // Register monitoring routes (Gemini AI-powered)
  app.use("/api/monitoring", monitoringRouter);
  
  // Register Octopus Brain routes (AI-powered autonomous operations)
  app.use("/api/octopus-brain", octopusBrainRouter);
  
  // Register operations routes with authentication
  // In development, devBypassAuth provides admin access for testing
  // In production, requireAuth enforces proper JWT validation
  app.use("/api/operations", devBypassAuth, requireAuth, operationsRouter);
  
  // Register Essence OS 2026 routes
  // Public routes - no auth required
  app.use("/api/loyalty", loyaltyEngineRouter);
  app.use("/api/flavors-engine", flavorEngineRouter);
  
  // Protected routes - require authentication
  app.use("/api/staff", devBypassAuth, requireAuth, staffAiRouter);
  app.use("/api/inventory", devBypassAuth, requireAuth, inventoryAiRouter);
  app.use("/api/franchise", devBypassAuth, requireAuth, franchiseOsRouter);
  app.use("/api/kiosk", devBypassAuth, requireAuth, airportKioskOsRouter);
  
  // AI Chat routes - public for customer-facing, protected for admin
  app.use("/api/ai", aiChatRouter);
  
  // Global E-Invoicing Engine 2025 - multi-country tax compliance
  app.use("/api/invoices", eInvoiceRouter);
  
  // Global Backend 2025 - POS, Payments, E-Gift, Concierge
  // Public routes for customer-facing endpoints
  app.use("/api", posPaymentsRouter);
  
  // Global Compliance, Risk & Operations Brain 2025
  // Protected routes for HQ dashboard and managers
  app.use("/api/compliance", devBypassAuth, requireAuth, complianceRouter);
  
  // Incident reporting routes (compatible with EssenceIncidentUI2025)
  // Public for staff to report incidents from POS/tablets
  app.use("/api/incidents", incidentsRouter);
  
  // Email backup and notification service (Octopus Brain 2026)
  // Protected routes for admin/HQ to manage email notifications
  app.use("/api/email", devBypassAuth, requireAuth, emailRouter);
  
  // Backup service with encryption (Octopus Brain 2026)
  // Protected routes for admin to manage encrypted backups
  app.use("/api/backup", devBypassAuth, requireAuth, backupRouter);
  
  // HR Playbook 2025 - Complete HR, People & Operations system
  // Protected routes for HR, managers and HQ staff
  app.use("/api/hr", devBypassAuth, requireAuth, hrPlaybookRouter);
  
  // Executive and Board of Directors management (Octopus Brain 2026)
  // Protected routes for senior leadership and board access
  app.use("/api/executive", devBypassAuth, requireAuth, executiveRouter);
  
  // Loyalty Registration and Welcome Email Service (Octopus Brain 2026)
  // Public routes for customer registration with luxury welcome emails
  app.use("/api/loyalty-registration", loyaltyRegistrationRouter);
  
  // Google Services (Calendar, Sheets) - Octopus Brain 2026
  // Protected routes for scheduling, reporting, and data export
  app.use("/api/google", devBypassAuth, requireAuth, googleServicesRouter);
  
  // Broadcast Notifications - Push to members and staff
  // Protected routes for admin to create and send notifications
  app.use("/api/broadcast", devBypassAuth, requireAuth, broadcastRouter);
  
  // Spotify integration for in-store music
  // Connected via Replit Spotify connector
  app.use("/api/spotify", spotifyRouter);
  
  // AuthExperience2025 - Custom auth routes (magic link, phone, passkey, QR, social)
  app.use("/auth", auth2025Router);

  // Social Cloud (Essence Social Cloud platform)
  app.use("/api/social", socialCloudRouter);
  
  // Push Notifications (for mobile registration alerts)
  app.use("/api/push", pushNotificationsRouter);
  
  // Passkeys / WebAuthn (Face ID, Touch ID, security keys)
  app.use("/api/passkeys", passkeysRouter);
  
  // Firebase Auth Sync - sync Firebase user to backend database
  app.post("/api/auth/firebase-sync", async (req, res) => {
    try {
      const { uid, email, displayName, phoneNumber } = req.body;
      
      if (!uid || !email) {
        return res.status(400).json({ error: "Firebase UID and email are required" });
      }
      
      const normalizedEmail = email.toLowerCase().trim();
      
      // Efficient lookup by email using indexed query
      let customer = await storage.getCustomerByEmail(normalizedEmail);
      let isNewCustomer = false;
      
      if (!customer) {
        // Create new customer from Firebase user
        customer = await storage.createCustomer({
          email: normalizedEmail,
          fullName: displayName || normalizedEmail.split("@")[0],
          phoneNumber: phoneNumber || null,
          loyaltyTierId: "gold",
        });
        isNewCustomer = true;
        
        console.log(`[AUTH] New customer created from Firebase: ${normalizedEmail}`);
        
        // Trigger welcome notification if push is enabled
        try {
          await fetch(`${process.env.BASE_URL || 'http://localhost:5000'}/api/push/send-registration-welcome`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: customer.id, userName: displayName }),
          });
        } catch (e) {
          // Ignore push errors - notifications are optional
        }
      }
      
      res.json({
        success: true,
        isNewCustomer,
        customer: {
          id: customer.id,
          email: customer.email,
          fullName: customer.fullName,
          loyaltyPoints: customer.loyaltyPoints || 0,
          loyaltyTierId: customer.loyaltyTierId || "gold",
        },
      });
    } catch (error) {
      console.error("Firebase sync error:", error);
      res.status(500).json({ error: "Failed to sync Firebase user" });
    }
  });
  
  // reCAPTCHA config endpoint
  app.get("/api/config/recaptcha", (req, res) => {
    const siteKey = process.env.VITE_RECAPTCHA_SITE_KEY;
    res.json({ siteKey: siteKey || null });
  });
  
  // Region profiles for multi-country tax and pricing
  app.get("/api/config/regions", (req, res) => {
    res.json({ regions: REGION_PROFILES });
  });
  
  app.get("/api/config/region/:id", (req, res) => {
    const region = getRegionProfile(req.params.id);
    if (!region) {
      return res.status(404).json({ error: "Region profile not found" });
    }
    res.json({ region });
  });
  
  // Contact with reCAPTCHA protection
  app.post("/api/contact", async (req, res) => {
    try {
      const { recaptchaToken, ...contactData } = req.body;
      
      // Verify reCAPTCHA - require token if secret key is configured
      const hasRecaptchaConfig = !!process.env.RECAPTCHA_SECRET_KEY;
      if (hasRecaptchaConfig) {
        if (!recaptchaToken) {
          return res.status(400).json({ success: false, error: "reCAPTCHA verification required" });
        }
        const recaptchaResult = await verifyRecaptcha(recaptchaToken);
        if (!recaptchaResult.success) {
          return res.status(400).json({ success: false, error: "reCAPTCHA verification failed" });
        }
      }
      
      const data = insertContactInquirySchema.parse(contactData);
      const inquiry = await storage.createContactInquiry(data);
      res.status(201).json({ success: true, inquiry });
    } catch (error) {
      res.status(400).json({ success: false, error: "Invalid request data" });
    }
  });

  app.get("/api/contact", async (req, res) => {
    try {
      const inquiries = await storage.getAllContactInquiries();
      res.json({ inquiries });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch inquiries" });
    }
  });

  // Flavors
  app.get("/api/flavors", async (req, res) => {
    try {
      const tier = req.query.tier as string | undefined;
      let flavorList;
      if (tier) {
        flavorList = await storage.getFlavorsByTier(tier);
      } else {
        flavorList = await storage.getAllFlavors();
      }
      res.json({ flavors: flavorList });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch flavors" });
    }
  });

  app.get("/api/flavor/:code", async (req, res) => {
    try {
      const flavor = await storage.getFlavorByCode(req.params.code);
      if (!flavor) {
        return res.status(404).json({ error: "Flavor not found" });
      }
      res.json({ flavor });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch flavor" });
    }
  });

  app.post("/api/flavors", async (req, res) => {
    try {
      const data = insertFlavorSchema.parse(req.body);
      const flavor = await storage.createFlavor(data);
      res.status(201).json({ success: true, flavor });
    } catch (error) {
      res.status(400).json({ success: false, error: "Invalid request data" });
    }
  });

  app.post("/api/flavors/seed-2026", async (req, res) => {
    try {
      await storage.deleteAllFlavors();
      
      const flavors2026 = [
        { internalCode: "FLV_CORE_NAT", name: "Yogurt Core", marketingName: "Yogurt Core", description: "Pure, clean, rich yogurt base perfected for a luxury palate.", type: "yogurt", tier: "Core", accentColor: "#FFFFFF", imagePrompt: "luxury yogurt swirl white on white background with gold glow", priority: 1, displayOrder: 1 },
        { internalCode: "FLV_CORE_VAN", name: "Halo Cloud", marketingName: "Halo Cloud", description: "Soft glowing vanilla swirl, cloud-light and delicately sweet.", type: "yogurt", tier: "Core", accentColor: "#F5E9C9", imagePrompt: "floating vanilla swirl on white with halo gold lighting", priority: 1, displayOrder: 2 },
        { internalCode: "FLV_CORE_DARK", name: "Dark Shadow", marketingName: "Dark Shadow", description: "Deep, intense cocoa expression. Rich, bold and indulgent.", type: "yogurt", tier: "Core", accentColor: "#4B2E1F", imagePrompt: "dark chocolate swirl on pure white background luxury lighting", priority: 1, displayOrder: 3 },
        { internalCode: "FLV_CORE_WHITE", name: "White Glaze", marketingName: "White Glaze", description: "Smooth white chocolate with a bright, silky finish.", type: "yogurt", tier: "Core", accentColor: "#EDEDED", imagePrompt: "white chocolate swirl glossy on clean white background", priority: 1, displayOrder: 4 },
        { internalCode: "FLV_CORE_COC", name: "Orbit Cream", marketingName: "Orbit Cream", description: "Creamy vanilla with orbiting biscuit fragments. A cosmic treat.", type: "yogurt", tier: "Core", accentColor: "#C4B9A6", imagePrompt: "cream swirl with biscuit orbit on pure white minimal background", priority: 1, displayOrder: 5 },
        { internalCode: "FLV_CORE_PIS", name: "Pistachio Code", marketingName: "Pistachio Code", description: "Earthy, refined pistachio with a luxury smooth profile.", type: "yogurt", tier: "Core", accentColor: "#A8C08D", imagePrompt: "pistachio swirl green subtle gold rim lighting on white", priority: 1, displayOrder: 6 },
        { internalCode: "FLV_CORE_ACA", name: "Açaí Burst", marketingName: "Açaí Burst", description: "Vibrant, energetic açaí with a bold fruity finish.", type: "yogurt", tier: "Core", accentColor: "#7A1F5A", imagePrompt: "acai swirl deep purple glossy on white minimalist style", priority: 1, displayOrder: 7 },
        { internalCode: "FLV_CORE_STRAW", name: "Strawberry Prime", marketingName: "Strawberry Prime", description: "Juicy, sweet, balanced strawberry perfection.", type: "yogurt", tier: "Core", accentColor: "#FF6F81", imagePrompt: "strawberry swirl soft pink on white luxury aesthetic", priority: 1, displayOrder: 8 },
        { internalCode: "FLV_CORE_MAN", name: "Mango Flux", marketingName: "Mango Flux", description: "Tropical mango with rich sun-drenched sweetness.", type: "yogurt", tier: "Core", accentColor: "#FFC34A", imagePrompt: "golden mango swirl on white with tropical warm lighting", priority: 1, displayOrder: 9 },
        { internalCode: "FLV_CORE_COC2", name: "Coconut Zenith", marketingName: "Coconut Zenith", description: "Crisp, clean coconut at its purest form.", type: "yogurt", tier: "Core", accentColor: "#EFEFEF", imagePrompt: "coconut swirl white on white luxury tropical minimalism", priority: 1, displayOrder: 10 },
        { internalCode: "FLV_CORE_SCAR", name: "Coastal Drift", marketingName: "Coastal Drift", description: "Golden caramel with a refined sea salt finish.", type: "yogurt", tier: "Core", accentColor: "#D1A570", imagePrompt: "salted caramel swirl gold tones on ultra white background", priority: 1, displayOrder: 11 },
        { internalCode: "FLV_AUS_LIME", name: "Citrus Pod", marketingName: "Citrus Pod", description: "Native finger lime. Sharp, bright and refreshing.", type: "yogurt", tier: "Aussie Natives", accentColor: "#CDE26F", imagePrompt: "zesty citrus swirl bright green on white", priority: 2, displayOrder: 12 },
        { internalCode: "FLV_AUS_PLUM", name: "Plum Void", marketingName: "Plum Void", description: "Davidson plum. Dark, tart, and complex.", type: "yogurt", tier: "Aussie Natives", accentColor: "#5E2A4A", imagePrompt: "deep plum swirl on pure white luxury lighting", priority: 2, displayOrder: 13 },
        { internalCode: "FLV_AUS_RIB", name: "Riberry Spice", marketingName: "Riberry Spice", description: "Warm spiced Riberry with clove undertones.", type: "yogurt", tier: "Aussie Natives", accentColor: "#A23F3F", imagePrompt: "spiced berry swirl on white background", priority: 2, displayOrder: 14 },
        { internalCode: "FLV_AUS_QUA", name: "Desert Glow", marketingName: "Desert Glow", description: "Quandong apricot-peach brightness.", type: "yogurt", tier: "Aussie Natives", accentColor: "#E99B64", imagePrompt: "peach apricot swirl glowing warm on white", priority: 2, displayOrder: 15 },
        { internalCode: "FLV_AUS_WAT", name: "Wattle Ground", marketingName: "Wattle Ground", description: "Earthy roasted wattle seed with coffee notes.", type: "yogurt", tier: "Aussie Natives", accentColor: "#A4845C", imagePrompt: "earthy wattle swirl on white minimal background", priority: 2, displayOrder: 16 },
        { internalCode: "FLV_AUS_MYR", name: "Lemon Surge", marketingName: "Lemon Surge", description: "Lemon myrtle, clean and aromatic.", type: "yogurt", tier: "Aussie Natives", accentColor: "#F1E785", imagePrompt: "bright lemon swirl fresh aromatics on pure white", priority: 2, displayOrder: 17 },
        { internalCode: "FLV_LTO_BIS", name: "Biscuit Core", marketingName: "Biscuit Core", description: "Chocolate biscuit malt combination.", type: "yogurt", tier: "Dessert Remix", accentColor: "#C2A67A", imagePrompt: "biscuit chocolate swirl on white minimal luxury", priority: 3, displayOrder: 18 },
        { internalCode: "FLV_LTO_LAM", name: "Lamo Remix", marketingName: "Lamo Remix", description: "Lamington flavour with coconut and raspberry.", type: "yogurt", tier: "Dessert Remix", accentColor: "#CB5D6D", imagePrompt: "lamington raspberry swirl on clean white", priority: 3, displayOrder: 19 },
        { internalCode: "FLV_LTO_COF", name: "Flat Black Code", marketingName: "Flat Black Code", description: "Australian espresso, dark, balanced and premium.", type: "yogurt", tier: "Dessert Remix", accentColor: "#8C6849", imagePrompt: "coffee swirl with crema tone on white", priority: 3, displayOrder: 20 },
        { internalCode: "FLV_LTO_MINT", name: "Mint Crisp", marketingName: "Mint Crisp", description: "Cool mint with chocolate shards.", type: "yogurt", tier: "Dessert Remix", accentColor: "#A9E4C8", imagePrompt: "mint swirl refreshing crisp chocolate on white", priority: 3, displayOrder: 21 },
        { internalCode: "FLV_LTO_PAV", name: "Meringue Dream", marketingName: "Meringue Dream", description: "Meringue and tart berry swirl.", type: "yogurt", tier: "Dessert Remix", accentColor: "#F3DDE7", imagePrompt: "white meringue swirl with berry notes on white", priority: 3, displayOrder: 22 },
        { internalCode: "FLV_LTO_BAN", name: "Banana Stream", marketingName: "Banana Stream", description: "Banana with subtle exotic spice.", type: "yogurt", tier: "Dessert Remix", accentColor: "#F7DA63", imagePrompt: "banana swirl soft warm lighting on white", priority: 3, displayOrder: 23 },
        { internalCode: "FLV_LTO_CUS", name: "Custard Glaze", marketingName: "Custard Glaze", description: "Velvety custard golden sweet.", type: "yogurt", tier: "Dessert Remix", accentColor: "#F4E5A6", imagePrompt: "golden custard swirl glossy on pure white", priority: 3, displayOrder: 24 },
        { internalCode: "FLV_SIG_DXB_CHOC", name: "Dubai Cacao Gold", marketingName: "Dubai Cacao Gold", description: "Velvety Dubai-style chocolate with date sweetness and a hint of cardamom.", type: "yogurt", tier: "City Signature", accentColor: "#4B2A1A", imagePrompt: "rich Dubai chocolate swirl with gold dust and date notes on pure white luxury background", priority: 2, displayOrder: 25 },
      ];

      for (const flavor of flavors2026) {
        await storage.createFlavor(flavor);
      }

      const allFlavors = await storage.getAllFlavors();
      res.json({ success: true, message: "2026 flavors seeded successfully", count: allFlavors.length, flavors: allFlavors });
    } catch (error) {
      console.error("Error seeding flavors:", error);
      res.status(500).json({ success: false, error: "Failed to seed flavors" });
    }
  });

  // Toppings
  app.get("/api/toppings", async (req, res) => {
    try {
      const toppingList = await storage.getAllToppings();
      res.json({ toppings: toppingList });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch toppings" });
    }
  });

  app.post("/api/toppings", async (req, res) => {
    try {
      const data = insertToppingSchema.parse(req.body);
      const topping = await storage.createTopping(data);
      res.status(201).json({ success: true, topping });
    } catch (error) {
      res.status(400).json({ success: false, error: "Invalid request data" });
    }
  });

  // Locations
  app.get("/api/locations", async (req, res) => {
    try {
      const locationList = await storage.getAllLocations();
      res.json({ locations: locationList });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch locations" });
    }
  });

  app.post("/api/locations", async (req, res) => {
    try {
      const data = insertLocationSchema.parse(req.body);
      const location = await storage.createLocation(data);
      res.status(201).json({ success: true, location });
    } catch (error) {
      res.status(400).json({ success: false, error: "Invalid request data" });
    }
  });

  // Revenue Share Models
  app.get("/api/revenue-share-models", async (req, res) => {
    try {
      const models = await storage.getAllRevenueShareModels();
      res.json({ models });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch models" });
    }
  });

  app.post("/api/revenue-share-models", async (req, res) => {
    try {
      const data = insertRevenueShareModelSchema.parse(req.body);
      const model = await storage.createRevenueShareModel(data);
      res.status(201).json({ success: true, model });
    } catch (error) {
      res.status(400).json({ success: false, error: "Invalid request data" });
    }
  });

  // Essence Units
  app.get("/api/essence-units", async (req, res) => {
    try {
      const units = await storage.getAllEssenceUnits();
      res.json({ units });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch units" });
    }
  });

  app.post("/api/essence-units", async (req, res) => {
    try {
      const data = insertEssenceUnitSchema.parse(req.body);
      const unit = await storage.createEssenceUnit(data);
      res.status(201).json({ success: true, unit });
    } catch (error) {
      res.status(400).json({ success: false, error: "Invalid request data" });
    }
  });

  // Pricing Rules
  app.get("/api/pricing-rules", async (req, res) => {
    try {
      const rules = await storage.getAllPricingRules();
      res.json({ rules });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch rules" });
    }
  });

  app.post("/api/pricing-rules", async (req, res) => {
    try {
      const data = insertPricingRuleSchema.parse(req.body);
      const rule = await storage.createPricingRule(data);
      res.status(201).json({ success: true, rule });
    } catch (error) {
      res.status(400).json({ success: false, error: "Invalid request data" });
    }
  });

  // Essence Events
  app.get("/api/essence-events", async (req, res) => {
    try {
      const events = await storage.getAllEssenceEvents();
      res.json({ events });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });

  app.post("/api/essence-events", async (req, res) => {
    try {
      const data = insertEssenceEventSchema.parse(req.body);
      const event = await storage.createEssenceEvent(data);
      res.status(201).json({ success: true, event });
    } catch (error) {
      res.status(400).json({ success: false, error: "Invalid request data" });
    }
  });

  // Credit Packages
  app.get("/api/credit-packages", async (req, res) => {
    try {
      const packages = await storage.getAllCreditPackages();
      res.json({ packages });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch packages" });
    }
  });

  app.post("/api/credit-packages", async (req, res) => {
    try {
      const data = insertCreditPackageSchema.parse(req.body);
      const pkg = await storage.createCreditPackage(data);
      res.status(201).json({ success: true, package: pkg });
    } catch (error) {
      res.status(400).json({ success: false, error: "Invalid request data" });
    }
  });

  // Loyalty Tiers
  app.get("/api/loyalty-tiers", async (req, res) => {
    try {
      const tiers = await storage.getAllLoyaltyTiers();
      res.json({ tiers });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tiers" });
    }
  });

  app.post("/api/loyalty-tiers", async (req, res) => {
    try {
      const data = insertLoyaltyTierSchema.parse(req.body);
      const tier = await storage.createLoyaltyTier(data);
      res.status(201).json({ success: true, tier });
    } catch (error) {
      res.status(400).json({ success: false, error: "Invalid request data" });
    }
  });

  // Customers
  app.post("/api/customers", async (req, res) => {
    try {
      const data = insertCustomerSchema.parse(req.body);
      const customer = await storage.createCustomer(data);
      res.status(201).json({ success: true, customer });
    } catch (error) {
      res.status(400).json({ success: false, error: "Invalid request data" });
    }
  });

  app.get("/api/customers/:email", async (req, res) => {
    try {
      const customer = await storage.getCustomerByEmail(req.params.email);
      res.json({ customer: customer || null });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch customer" });
    }
  });

  // E-Gift Cards - Express checkout (no login required)
  app.post("/api/egift/create", async (req, res) => {
    try {
      // Map frontend buyer fields to schema sender fields
      const { buyerName, buyerEmail, ...rest } = req.body;
      const mappedData = {
        ...rest,
        senderName: buyerName || rest.senderName,
        senderEmail: buyerEmail || rest.senderEmail,
      };
      const data = insertEGiftCardSchema.parse(mappedData);
      const card = await storage.createEGiftCard(data);
      res.status(201).json({ success: true, card });
    } catch (error: any) {
      console.error("[E-Gift] Validation error:", error?.message || error);
      res.status(400).json({ success: false, error: "Invalid request data", details: error?.errors || error?.message });
    }
  });

  app.get("/api/egift/:code", async (req, res) => {
    try {
      const card = await storage.getEGiftCardByCode(req.params.code);
      res.json({ card: card || null });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch card" });
    }
  });

  // Generate QR code for e-gift card (for customer mobile display)
  app.get("/api/egift/:code/qr", async (req, res) => {
    try {
      const QRCode = await import('qrcode');
      const card = await storage.getEGiftCardByCode(req.params.code);
      if (!card) {
        return res.status(404).json({ error: "Card not found" });
      }
      // QR content is just the code - cashier can scan and enter into redemption terminal
      // This is more reliable than URL-based QR which may have proxy issues
      const qrContent = card.code;
      const qrDataUrl = await QRCode.toDataURL(qrContent, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      res.json({ qrCode: qrDataUrl, code: card.code });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate QR code" });
    }
  });

  // Cashier lookup - find card by code for quick redemption
  app.get("/api/egift/lookup/:code", async (req, res) => {
    try {
      const card = await storage.getEGiftCardByCode(req.params.code);
      if (!card) {
        return res.status(404).json({ success: false, error: "Invalid gift card code" });
      }
      if (card.isRedeemed) {
        return res.json({ 
          success: false, 
          error: "Card already redeemed", 
          card: { ...card, status: "redeemed" } 
        });
      }
      // Check expiration
      if (card.expiresAt && new Date(card.expiresAt) < new Date()) {
        return res.json({ 
          success: false, 
          error: "Card has expired", 
          card: { ...card, status: "expired" } 
        });
      }
      res.json({ 
        success: true, 
        card: { ...card, status: "valid" } 
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to lookup card" });
    }
  });

  app.post("/api/egift/redeem", async (req, res) => {
    try {
      const { code } = req.body;
      if (!code) {
        return res.status(400).json({ success: false, error: "Code required" });
      }
      // First check if card exists and is valid
      const existingCard = await storage.getEGiftCardByCode(code);
      if (!existingCard) {
        return res.status(404).json({ success: false, error: "Gift card not found" });
      }
      if (existingCard.isRedeemed) {
        return res.status(400).json({ success: false, error: "Gift card already redeemed" });
      }
      if (existingCard.expiresAt && new Date(existingCard.expiresAt) < new Date()) {
        return res.status(400).json({ success: false, error: "Gift card has expired" });
      }
      // Now redeem
      const card = await storage.redeemEGiftCard(code);
      res.json({ success: true, card, message: "Gift card successfully redeemed!" });
    } catch (error) {
      res.status(500).json({ error: "Failed to redeem card" });
    }
  });

  // Comprehensive System Health Check
  app.get("/api/system/health", async (_req, res) => {
    const startTime = Date.now();
    const checks: Record<string, { status: string; latencyMs?: number; details?: any }> = {};
    
    try {
      const dbStart = Date.now();
      await storage.getAllFlavors();
      checks.database = { status: "healthy", latencyMs: Date.now() - dbStart };
    } catch (error) {
      checks.database = { status: "unhealthy", details: "Connection failed" };
    }
    
    checks.googleMaps = { 
      status: process.env.GOOGLE_MAPS_API_KEY ? "configured" : "not_configured" 
    };
    
    const overallHealthy = Object.values(checks).every(c => c.status !== "unhealthy");
    
    res.status(overallHealthy ? 200 : 503).json({
      status: overallHealthy ? "healthy" : "degraded",
      version: "2.0.0",
      environment: process.env.NODE_ENV || "development",
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      responseTimeMs: Date.now() - startTime,
      checks
    });
  });

  // Job Applications
  app.post("/api/careers/apply", async (req, res) => {
    try {
      const data = insertJobApplicationSchema.parse(req.body);
      
      const sanitize = (str: string | null | undefined): string | null => {
        if (!str) return null;
        return str.trim()
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .slice(0, 10000);
      };
      
      const sanitizedData = {
        ...data,
        fullName: sanitize(data.fullName) || "",
        email: data.email?.trim().toLowerCase() || "",
        phone: sanitize(data.phone) || null,
        positionTitle: sanitize(data.positionTitle) || "",
        department: sanitize(data.department) || null,
        location: sanitize(data.location) || null,
        coverLetter: sanitize(data.coverLetter) || null,
        linkedInUrl: sanitize(data.linkedInUrl) || null,
        portfolioUrl: sanitize(data.portfolioUrl) || null,
        resumeUrl: sanitize(data.resumeUrl) || null,
        resumeText: data.resumeText?.slice(0, 50000) || null,
        yearsExperience: sanitize(data.yearsExperience) || null,
      };
      
      const application = await storage.createJobApplication(sanitizedData);
      
      // Analyze resume in background if provided
      if (sanitizedData.resumeText && sanitizedData.resumeText.length >= 100) {
        analyzeResume(sanitizedData.resumeText, sanitizedData.positionTitle)
          .then(analysis => {
            storage.updateJobApplicationResumeAnalysis(
              application.id,
              sanitizedData.resumeText!,
              JSON.stringify(analysis)
            );
          })
          .catch(err => console.error("Resume analysis failed:", err));
      }
      
      sendJobApplicationNotification({
        applicantName: sanitizedData.fullName,
        applicantEmail: sanitizedData.email,
        applicantPhone: sanitizedData.phone || "Not provided",
        positionTitle: sanitizedData.positionTitle,
        location: sanitizedData.location || "Not specified",
        department: sanitizedData.department || "General",
        applicationDetails: sanitizedData.coverLetter || "No additional details provided",
      }).catch(err => {
        console.error("Failed to send HR notification email:", err);
      });
      
      res.status(201).json({ success: true, application, message: "Application submitted successfully!" });
    } catch (error) {
      console.error("Job application error:", error);
      res.status(400).json({ success: false, error: "Invalid application data" });
    }
  });

  app.get("/api/careers/applications", async (req, res) => {
    try {
      const applications = await storage.getAllJobApplications();
      res.json({ applications });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch applications" });
    }
  });

  app.post("/api/careers/applications", async (req, res) => {
    try {
      const data = insertJobApplicationSchema.parse(req.body);
      
      const sanitize = (str: string | null | undefined): string | null => {
        if (!str) return null;
        return str.trim()
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .slice(0, 10000);
      };
      
      const sanitizedData = {
        ...data,
        fullName: sanitize(data.fullName) || "",
        email: data.email?.trim().toLowerCase() || "",
        phone: sanitize(data.phone) || null,
        positionTitle: sanitize(data.positionTitle) || "",
        department: sanitize(data.department) || null,
        location: sanitize(data.location) || null,
        coverLetter: sanitize(data.coverLetter) || null,
        linkedInUrl: sanitize(data.linkedInUrl) || null,
        portfolioUrl: sanitize(data.portfolioUrl) || null,
        resumeUrl: sanitize(data.resumeUrl) || null,
        yearsExperience: sanitize(data.yearsExperience) || null,
      };
      
      const application = await storage.createJobApplication(sanitizedData);
      
      sendJobApplicationNotification({
        applicantName: sanitizedData.fullName,
        applicantEmail: sanitizedData.email,
        applicantPhone: sanitizedData.phone || "Not provided",
        positionTitle: sanitizedData.positionTitle,
        location: sanitizedData.location || "Not specified",
        department: sanitizedData.department || "General",
        applicationDetails: sanitizedData.coverLetter || "No additional details provided",
      }).catch(err => {
        console.error("Failed to send HR notification email:", err);
      });
      
      res.status(201).json({ success: true, application, message: "Application submitted successfully!" });
    } catch (error) {
      console.error("Job application error:", error);
      res.status(400).json({ success: false, error: "Invalid application data" });
    }
  });

  app.put("/api/careers/applications/:id/status", async (req, res) => {
    try {
      const { status, reviewedBy } = req.body;
      const application = await storage.updateJobApplicationStatus(req.params.id, status, reviewedBy);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }
      res.json({ success: true, application });
    } catch (error) {
      res.status(500).json({ error: "Failed to update application" });
    }
  });

  // Job Postings (Admin creates jobs for applicants to apply to)
  app.get("/api/careers/postings", async (req, res) => {
    try {
      const activeOnly = req.query.active !== "false";
      const postings = await storage.getAllJobPostings(activeOnly);
      res.json({ postings });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch job postings" });
    }
  });

  app.post("/api/careers/postings", async (req, res) => {
    try {
      const data = insertJobPostingSchema.parse(req.body);
      const posting = await storage.createJobPosting(data);
      res.status(201).json({ success: true, posting });
    } catch (error) {
      console.error("Job posting creation error:", error);
      res.status(400).json({ success: false, error: "Invalid posting data" });
    }
  });

  app.get("/api/careers/postings/:id", async (req, res) => {
    try {
      const posting = await storage.getJobPostingById(req.params.id);
      if (!posting) {
        return res.status(404).json({ error: "Posting not found" });
      }
      res.json({ posting });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch posting" });
    }
  });

  app.put("/api/careers/postings/:id", async (req, res) => {
    try {
      const posting = await storage.updateJobPosting(req.params.id, req.body);
      if (!posting) {
        return res.status(404).json({ error: "Posting not found" });
      }
      res.json({ success: true, posting });
    } catch (error) {
      res.status(500).json({ error: "Failed to update posting" });
    }
  });

  app.delete("/api/careers/postings/:id", async (req, res) => {
    try {
      await storage.deleteJobPosting(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete posting" });
    }
  });

  // AI Candidate Ranking (Gemini-powered)
  app.post("/api/careers/rank-candidates", async (req, res) => {
    try {
      const applications = await storage.getAllJobApplications();
      const pendingApps = applications.filter(app => app.status === "pending" || app.status === "under_review");
      
      const candidateData = pendingApps.map(app => ({
        id: String(app.id),
        fullName: app.fullName,
        email: app.email,
        positionTitle: app.positionTitle,
        yearsExperience: app.yearsExperience,
        coverLetter: app.coverLetter,
        location: app.location,
      }));

      const rankings = await rankCandidates(candidateData);
      res.json({ success: true, rankings });
    } catch (error) {
      console.error("AI ranking error:", error);
      res.status(500).json({ error: "Failed to rank candidates" });
    }
  });

  app.post("/api/careers/analyze-candidate/:id", async (req, res) => {
    try {
      const applications = await storage.getAllJobApplications();
      const app = applications.find(a => String(a.id) === req.params.id);
      
      if (!app) {
        return res.status(404).json({ error: "Application not found" });
      }

      const analysis = await analyzeIndividualCandidate({
        id: String(app.id),
        fullName: app.fullName,
        email: app.email,
        positionTitle: app.positionTitle,
        yearsExperience: app.yearsExperience,
        coverLetter: app.coverLetter,
        location: app.location,
      });

      res.json({ success: true, analysis });
    } catch (error) {
      console.error("AI analysis error:", error);
      res.status(500).json({ error: "Failed to analyze candidate" });
    }
  });

  // Resume Upload and AI Analysis
  app.post("/api/careers/upload-resume", async (req, res) => {
    try {
      const { resumeText, positionTitle, applicationId } = req.body;
      
      if (!resumeText || typeof resumeText !== "string") {
        return res.status(400).json({ error: "Resume text content required" });
      }
      
      // Analyze resume with Gemini AI
      const analysis = await analyzeResume(resumeText, positionTitle || "Store Team Member");
      
      // If applicationId provided, update the application record
      if (applicationId) {
        await storage.updateJobApplicationResumeAnalysis(
          applicationId,
          resumeText,
          JSON.stringify(analysis)
        );
      }
      
      res.json({ 
        success: true, 
        analysis,
        message: "Resume analyzed successfully by AI"
      });
    } catch (error) {
      console.error("Resume analysis error:", error);
      res.status(500).json({ error: "Failed to analyze resume" });
    }
  });

  // Get application by ID (for shortlist document upload)
  app.get("/api/careers/applications/:id", async (req, res) => {
    try {
      const application = await storage.getJobApplicationById(req.params.id);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }
      res.json({ application });
    } catch (error) {
      console.error("Error fetching application:", error);
      res.status(500).json({ error: "Failed to fetch application" });
    }
  });

  // Check shortlist status by email
  app.post("/api/careers/check-shortlist", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: "Email required" });
      }
      const application = await storage.getJobApplicationByEmail(email);
      if (!application) {
        return res.json({ found: false, shortlisted: false });
      }
      res.json({
        found: true,
        applicationId: application.id,
        fullName: application.fullName,
        positionTitle: application.positionTitle,
        shortlisted: application.aiShortlisted || application.status === "shortlisted",
        documentsSubmitted: !!application.documentsSubmittedAt,
        status: application.status,
      });
    } catch (error) {
      console.error("Error checking shortlist:", error);
      res.status(500).json({ error: "Failed to check shortlist status" });
    }
  });

  // Submit documents (ID and photo) for shortlisted candidates
  app.post("/api/careers/submit-documents", async (req, res) => {
    try {
      const { applicationId, idDocumentUrl, photoUrl } = req.body;
      if (!applicationId || !idDocumentUrl || !photoUrl) {
        return res.status(400).json({ error: "Application ID, ID document, and photo are required" });
      }
      const application = await storage.getJobApplicationById(applicationId);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }
      if (!application.aiShortlisted && application.status !== "shortlisted") {
        return res.status(403).json({ error: "Only shortlisted candidates can submit documents" });
      }
      const updated = await storage.updateJobApplicationDocuments(
        applicationId,
        idDocumentUrl,
        photoUrl
      );
      res.json({ 
        success: true, 
        message: "Documents submitted successfully",
        application: updated
      });
    } catch (error) {
      console.error("Error submitting documents:", error);
      res.status(500).json({ error: "Failed to submit documents" });
    }
  });

  // Get shortlisted candidates with documents (for HR verification panel)
  app.get("/api/careers/verification-queue", async (req, res) => {
    try {
      const applications = await storage.getShortlistedApplicationsWithDocuments();
      res.json({ applications });
    } catch (error) {
      console.error("Error fetching verification queue:", error);
      res.status(500).json({ error: "Failed to fetch verification queue" });
    }
  });

  // Update identity verification status (HR verifies ID matches photo)
  app.put("/api/careers/applications/:id/verify-identity", async (req, res) => {
    try {
      const { status, verifiedBy, notes } = req.body;
      if (!status || !verifiedBy) {
        return res.status(400).json({ error: "Status and verifiedBy are required" });
      }
      
      const validStatuses = ["pending", "verified", "rejected", "needs_review"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid verification status" });
      }
      
      const application = await storage.updateIdentityVerification(
        req.params.id,
        status,
        verifiedBy,
        notes
      );
      
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }
      
      res.json({ success: true, application });
    } catch (error) {
      console.error("Error updating verification status:", error);
      res.status(500).json({ error: "Failed to update verification status" });
    }
  });

  // Secure document viewing with audit logging (HR/Admin only)
  app.get("/api/careers/applications/:id/documents", async (req, res) => {
    try {
      const { viewerName, viewerRole, purpose } = req.query;
      
      const application = await storage.getJobApplicationById(req.params.id);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }
      
      if (!application.idDocumentUrl && !application.photoUrl) {
        return res.status(404).json({ error: "No documents uploaded yet" });
      }
      
      // Log document access for compliance/audit
      const viewerId = (viewerName as string) || "unknown";
      await storage.logDocumentAccess({
        applicationId: req.params.id,
        documentType: "id_and_photo",
        accessedBy: viewerId,
        accessedByName: viewerName as string,
        accessedByRole: viewerRole as string,
        ipAddress: req.ip || req.socket.remoteAddress,
        userAgent: req.headers["user-agent"],
        purpose: (purpose as string) || "identity_verification",
      });
      
      res.json({
        applicationId: application.id,
        fullName: application.fullName,
        positionTitle: application.positionTitle,
        idDocumentUrl: application.idDocumentUrl,
        photoUrl: application.photoUrl,
        documentsSubmittedAt: application.documentsSubmittedAt,
        identityVerificationStatus: application.identityVerificationStatus,
        identityVerifiedAt: application.identityVerifiedAt,
        identityVerifiedBy: application.identityVerifiedBy,
        verificationNotes: application.verificationNotes,
      });
    } catch (error) {
      console.error("Error fetching documents:", error);
      res.status(500).json({ error: "Failed to fetch documents" });
    }
  });

  // Get document access logs (for audit/compliance)
  app.get("/api/careers/applications/:id/access-logs", async (req, res) => {
    try {
      const logs = await storage.getDocumentAccessLogs(req.params.id);
      res.json({ logs });
    } catch (error) {
      console.error("Error fetching access logs:", error);
      res.status(500).json({ error: "Failed to fetch access logs" });
    }
  });

  // Object Storage - Get upload URL for documents
  app.post("/api/objects/upload", async (req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error) {
      console.error("Error getting upload URL:", error);
      res.status(500).json({ error: "Failed to get upload URL" });
    }
  });

  // Serve uploaded objects
  app.get("/objects/:objectPath(*)", async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    try {
      const objectFile = await objectStorageService.getObjectEntityFile(req.path);
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error serving object:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  // Fraud Alerts
  app.post("/api/security/fraud-alert", async (req, res) => {
    try {
      const data = insertFraudAlertSchema.parse(req.body);
      const alert = await storage.createFraudAlert(data);
      res.status(201).json({ success: true, alert });
    } catch (error) {
      res.status(400).json({ error: "Invalid alert data" });
    }
  });

  app.get("/api/security/fraud-alerts", async (req, res) => {
    try {
      const resolved = req.query.resolved === "true" ? true : req.query.resolved === "false" ? false : undefined;
      const alerts = await storage.getAllFraudAlerts(resolved);
      res.json({ alerts });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch alerts" });
    }
  });

  app.put("/api/security/fraud-alerts/:id/resolve", async (req, res) => {
    try {
      const { resolvedBy } = req.body;
      const alert = await storage.resolveFraudAlert(req.params.id, resolvedBy || "system");
      if (!alert) {
        return res.status(404).json({ error: "Alert not found" });
      }
      res.json({ success: true, alert });
    } catch (error) {
      res.status(500).json({ error: "Failed to resolve alert" });
    }
  });

  // Franchise Applications
  app.post("/api/franchise/apply", async (req, res) => {
    try {
      const data = insertFranchiseApplicationSchema.parse(req.body);
      const application = await storage.createFranchiseApplication(data);
      res.status(201).json({ success: true, application });
    } catch (error) {
      res.status(400).json({ success: false, error: "Invalid request data" });
    }
  });

  app.get("/api/franchise/applications", async (req, res) => {
    try {
      const applications = await storage.getAllFranchiseApplications();
      res.json({ applications });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch applications" });
    }
  });

  // Programmatic Advertising Lead Capture API
  // POST /api/programmatic/lead - Capture leads from advertising campaigns
  app.post("/api/programmatic/lead", async (req, res) => {
    try {
      // Extract IP and user agent for tracking
      const ipAddress = req.ip || req.headers['x-forwarded-for'] as string || '';
      const userAgent = req.headers['user-agent'] || '';
      
      // Parse and validate lead data
      const leadData = insertProgrammaticLeadSchema.parse({
        ...req.body,
        ipAddress,
        userAgent
      });
      
      // Create the lead
      const lead = await storage.createProgrammaticLead(leadData);
      
      // Auto-assign based on country routing rules
      const routingRules = EssenceProgrammaticPlan.aiAutomation.routingRules as Record<string, string>;
      const assignedTeam = routingRules[leadData.country] || "Global expansion desk";
      
      // AI Lead Scoring (simplified - can be enhanced with Gemini)
      let leadScore = 50; // base score
      if (leadData.companyType === 'airport_authority') leadScore += 25;
      if (leadData.companyType === 'mall_operator') leadScore += 20;
      if (leadData.companyType === 'investor') leadScore += 15;
      if (leadData.interestLevel === 'high') leadScore += 15;
      if (leadData.interestLevel === 'medium') leadScore += 5;
      if (leadData.companyName) leadScore += 10;
      if (leadData.phone) leadScore += 5;
      
      // Update lead with score and assignment
      const updatedLead = await storage.updateProgrammaticLead(lead.id, {
        leadScore: Math.min(leadScore, 100),
        assignedTo: assignedTeam
      });
      
      res.status(201).json({ 
        success: true, 
        lead: updatedLead,
        message: leadScore >= 70 
          ? "High-priority lead - immediate follow-up scheduled" 
          : "Lead captured - nurture sequence initiated"
      });
    } catch (error) {
      console.error("Programmatic lead error:", error);
      res.status(400).json({ success: false, error: "Invalid lead data" });
    }
  });
  
  // GET /api/programmatic/leads - Get all leads (admin only)
  app.get("/api/programmatic/leads", devBypassAuth, requireAuth, async (req, res) => {
    try {
      const { status, country, minScore } = req.query;
      const leads = await storage.getProgrammaticLeads({
        status: status as string,
        country: country as string,
        minScore: minScore ? parseInt(minScore as string) : undefined
      });
      res.json({ leads, count: leads.length });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch leads" });
    }
  });
  
  // GET /api/programmatic/lead/:id - Get single lead
  app.get("/api/programmatic/lead/:id", devBypassAuth, requireAuth, async (req, res) => {
    try {
      const lead = await storage.getProgrammaticLead(req.params.id);
      if (!lead) {
        return res.status(404).json({ error: "Lead not found" });
      }
      res.json({ lead });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch lead" });
    }
  });
  
  // PATCH /api/programmatic/lead/:id - Update lead status
  app.patch("/api/programmatic/lead/:id", devBypassAuth, requireAuth, async (req, res) => {
    try {
      const { status, notes, assignedTo } = req.body;
      const updates: any = {};
      
      if (status) {
        updates.status = status;
        if (status === 'contacted') updates.contactedAt = new Date();
        if (status === 'qualified') updates.qualifiedAt = new Date();
        if (status === 'closed' || status === 'lost') updates.closedAt = new Date();
      }
      if (notes !== undefined) updates.notes = notes;
      if (assignedTo) updates.assignedTo = assignedTo;
      
      const lead = await storage.updateProgrammaticLead(req.params.id, updates);
      res.json({ success: true, lead });
    } catch (error) {
      res.status(400).json({ error: "Failed to update lead" });
    }
  });
  
  // GET /api/programmatic/stats - Lead funnel statistics
  app.get("/api/programmatic/stats", devBypassAuth, requireAuth, async (req, res) => {
    try {
      const stats = await storage.getProgrammaticLeadStats();
      res.json({ stats });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // AI Chat - Connected to Octopus Brain backend data
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { message } = req.body;
      const lowerMessage = message.toLowerCase();
      
      // Fetch live data for intelligent responses
      let reply = "I'm here to help with anything about Essence Yogurt. Feel free to ask about our locations, flavours, loyalty program, or franchise opportunities.";
      
      if (lowerMessage.includes("location") || lowerMessage.includes("where") || lowerMessage.includes("find")) {
        const locations = await storage.getAllLocations();
        if (locations.length > 0) {
          const openLocations = locations.filter(l => l.status.toLowerCase().includes("open"));
          const locationList = locations.slice(0, 3).map(l => `${l.city}, ${l.country} (${l.venue})`).join("; ");
          reply = `We currently have ${locations.length} locations globally. ${openLocations.length} are now open. Some highlights: ${locationList}. Visit our Locations page for the full list!`;
        } else {
          reply = "We're expanding to premium destinations worldwide including airports, malls, and VIP venues. Stay tuned for new location announcements!";
        }
      } else if (lowerMessage.includes("flavor") || lowerMessage.includes("flavour")) {
        const flavors = await storage.getAllFlavors();
        if (flavors.length > 0) {
          const flavorNames = flavors.slice(0, 5).map(f => f.name).join(", ");
          reply = `We offer ${flavors.length} signature flavours including ${flavorNames}. All made with 98% fat-free yogurt and live cultures. Visit our Flavours page to explore the full collection!`;
        } else {
          reply = "Our signature flavours include Original Greek, Belgian Chocolate, and Mango Passion. We use 98% fat-free yogurt with live cultures. Visit our Flavours page to see all options!";
        }
      } else if (lowerMessage.includes("topping")) {
        const toppings = await storage.getAllToppings();
        if (toppings.length > 0) {
          const toppingNames = toppings.slice(0, 6).map(t => t.name).join(", ");
          reply = `Our topping bar features ${toppings.length} fresh options including ${toppingNames}. Plus warm sauce taps with hazelnut chocolate, pistachio, and caramel - all prepared fresh daily!`;
        } else {
          reply = "Our topping bar features fresh-cut fruits, premium nuts, crunchy cereals, and warm sauce taps including hazelnut chocolate, pistachio, and caramel. All prepared fresh daily!";
        }
      } else if (lowerMessage.includes("loyalty") || lowerMessage.includes("circle") || lowerMessage.includes("points") || lowerMessage.includes("tier")) {
        const tiers = await storage.getAllLoyaltyTiers();
        if (tiers.length > 0) {
          const tierNames = tiers.map(t => t.name).join(" → ");
          reply = `The Essence Circle has ${tiers.length} tiers: ${tierNames}. Earn 1 point per $1 spent, unlock exclusive perks, free cups, and birthday gifts! Join on our Loyalty page.`;
        } else {
          reply = "The Essence Circle is our luxury loyalty program. Earn 1 point per $1 spent, and progress through White, Gold, and Platinum tiers. Each tier unlocks exclusive perks!";
        }
      } else if (lowerMessage.includes("franchise") || lowerMessage.includes("partner") || lowerMessage.includes("invest")) {
        reply = "Interested in partnering with Essence Yogurt? We offer Master Franchise agreements and Revenue Share JV models for airports and malls. Visit our Franchise page to submit an enquiry - our HQ team will contact you directly.";
      } else if (lowerMessage.includes("gift") || lowerMessage.includes("egift")) {
        const packages = await storage.getAllCreditPackages();
        reply = `Send a golden Essence moment with our E-Gift cards! Available from $25-$200, delivered instantly via email and redeemable at all ${packages.length > 0 ? 'participating ' : ''}locations. Perfect for airport welcomes and special occasions!`;
      } else if (lowerMessage.includes("price") || lowerMessage.includes("cost") || lowerMessage.includes("pay") || lowerMessage.includes("weight")) {
        const rules = await storage.getAllPricingRules();
        if (rules.length > 0) {
          const rule = rules[0];
          reply = `We use a self-serve pay-by-weight model. Swirl your yogurt, add toppings, and pay at the counter. Prices start at $${rule.pricePer100g || '4.50'} per 100g depending on location.`;
        } else {
          reply = "We use a self-serve pay-by-weight model. Simply swirl your yogurt, add toppings, and pay at the counter. Prices vary by location, typically around $4.50 per 100g.";
        }
      } else if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
        reply = "Hello! Welcome to Essence Yogurt. I'm your AI concierge, connected to our Octopus Brain system. How can I help you today? Ask me about locations, flavours, loyalty rewards, gift cards, or franchise opportunities!";
      } else if (lowerMessage.includes("how") && lowerMessage.includes("work")) {
        reply = "It's simple! 1) Grab a cup 2) Swirl your own yogurt from our self-serve machines 3) Add fresh toppings and warm sauces 4) Weigh and pay at the counter. Create your perfect treat in under 2 minutes!";
      }
      
      res.json({ reply });
    } catch (error) {
      res.status(500).json({ reply: "I apologize, but I'm having trouble connecting to our system right now. Please try again or speak with our team." });
    }
  });

  // =====================================================
  // PHASE 1: SUPPLIER MANAGEMENT APIs
  // =====================================================

  // Suppliers
  app.get("/api/suppliers", async (req, res) => {
    try {
      const supplierList = await storage.getAllSuppliers();
      res.json({ suppliers: supplierList });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch suppliers" });
    }
  });

  app.get("/api/suppliers/:id", async (req, res) => {
    try {
      const supplier = await storage.getSupplierById(req.params.id);
      res.json({ supplier: supplier || null });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch supplier" });
    }
  });

  app.get("/api/suppliers/type/:type", async (req, res) => {
    try {
      const supplierList = await storage.getSuppliersByType(req.params.type);
      res.json({ suppliers: supplierList });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch suppliers" });
    }
  });

  app.post("/api/suppliers", async (req, res) => {
    try {
      const data = insertSupplierSchema.parse(req.body);
      const supplier = await storage.createSupplier(data);
      res.status(201).json({ success: true, supplier });
    } catch (error) {
      res.status(400).json({ success: false, error: "Invalid request data" });
    }
  });

  app.put("/api/suppliers/:id", async (req, res) => {
    try {
      const supplier = await storage.updateSupplier(req.params.id, req.body);
      res.json({ success: true, supplier });
    } catch (error) {
      res.status(400).json({ success: false, error: "Update failed" });
    }
  });

  // Supply Items
  app.get("/api/supply-items", async (req, res) => {
    try {
      const items = await storage.getAllSupplyItems();
      res.json({ items });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch items" });
    }
  });

  app.get("/api/supply-items/supplier/:supplierId", async (req, res) => {
    try {
      const items = await storage.getSupplyItemsBySupplierId(req.params.supplierId);
      res.json({ items });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch items" });
    }
  });

  app.post("/api/supply-items", async (req, res) => {
    try {
      const data = insertSupplyItemSchema.parse(req.body);
      const item = await storage.createSupplyItem(data);
      res.status(201).json({ success: true, item });
    } catch (error) {
      res.status(400).json({ success: false, error: "Invalid request data" });
    }
  });

  // Purchase Orders
  app.get("/api/purchase-orders", async (req, res) => {
    try {
      const orders = await storage.getAllPurchaseOrders();
      res.json({ orders });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.get("/api/purchase-orders/:id", async (req, res) => {
    try {
      const order = await storage.getPurchaseOrderById(req.params.id);
      const items = order ? await storage.getPurchaseOrderItems(req.params.id) : [];
      res.json({ order, items });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });

  app.post("/api/purchase-orders", async (req, res) => {
    try {
      const data = insertPurchaseOrderSchema.parse(req.body);
      const order = await storage.createPurchaseOrder(data);
      res.status(201).json({ success: true, order });
    } catch (error) {
      res.status(400).json({ success: false, error: "Invalid request data" });
    }
  });

  app.put("/api/purchase-orders/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      const order = await storage.updatePurchaseOrderStatus(req.params.id, status);
      res.json({ success: true, order });
    } catch (error) {
      res.status(400).json({ success: false, error: "Update failed" });
    }
  });

  app.post("/api/purchase-order-items", async (req, res) => {
    try {
      const data = insertPurchaseOrderItemSchema.parse(req.body);
      const item = await storage.createPurchaseOrderItem(data);
      res.status(201).json({ success: true, item });
    } catch (error) {
      res.status(400).json({ success: false, error: "Invalid request data" });
    }
  });

  // Inventory Batches
  app.get("/api/inventory-batches", async (req, res) => {
    try {
      const batches = await storage.getAllInventoryBatches();
      res.json({ batches });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch batches" });
    }
  });

  app.get("/api/inventory-batches/unit/:unitId", async (req, res) => {
    try {
      const batches = await storage.getInventoryBatchesByUnitId(req.params.unitId);
      res.json({ batches });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch batches" });
    }
  });

  app.post("/api/inventory-batches", async (req, res) => {
    try {
      const data = insertInventoryBatchSchema.parse(req.body);
      const batch = await storage.createInventoryBatch(data);
      res.status(201).json({ success: true, batch });
    } catch (error) {
      res.status(400).json({ success: false, error: "Invalid request data" });
    }
  });

  // Supplier Performance
  app.get("/api/supplier-performance/:supplierId", async (req, res) => {
    try {
      const history = await storage.getSupplierPerformanceHistory(req.params.supplierId);
      res.json({ history });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch performance" });
    }
  });

  app.post("/api/supplier-performance", async (req, res) => {
    try {
      const data = insertSupplierPerformanceSchema.parse(req.body);
      const perf = await storage.createSupplierPerformance(data);
      res.status(201).json({ success: true, performance: perf });
    } catch (error) {
      res.status(400).json({ success: false, error: "Invalid request data" });
    }
  });

  // =====================================================
  // PHASE 2: EMPLOYEE OPERATIONS APIs
  // =====================================================

  // Employees
  app.get("/api/employees", async (req, res) => {
    try {
      const employeeList = await storage.getAllEmployees();
      res.json(employeeList);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch employees" });
    }
  });

  app.get("/api/employees/:id", async (req, res) => {
    try {
      const employee = await storage.getEmployeeById(req.params.id);
      res.json({ employee: employee || null });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch employee" });
    }
  });

  app.get("/api/employees/unit/:unitId", async (req, res) => {
    try {
      const employeeList = await storage.getEmployeesByUnitId(req.params.unitId);
      res.json({ employees: employeeList });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch employees" });
    }
  });

  app.post("/api/employees", async (req, res) => {
    try {
      const data = insertEmployeeSchema.parse(req.body);
      const employee = await storage.createEmployee(data);
      res.status(201).json({ success: true, employee });
    } catch (error) {
      res.status(400).json({ success: false, error: "Invalid request data" });
    }
  });

  app.put("/api/employees/:id", async (req, res) => {
    try {
      const employee = await storage.updateEmployee(req.params.id, req.body);
      res.json({ success: true, employee });
    } catch (error) {
      res.status(400).json({ success: false, error: "Update failed" });
    }
  });

  // Shift Templates
  app.get("/api/shift-templates", async (req, res) => {
    try {
      const templates = await storage.getAllShiftTemplates();
      res.json({ templates });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch templates" });
    }
  });

  app.get("/api/shift-templates/unit/:unitId", async (req, res) => {
    try {
      const templates = await storage.getShiftTemplatesByUnitId(req.params.unitId);
      res.json({ templates });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch templates" });
    }
  });

  app.post("/api/shift-templates", async (req, res) => {
    try {
      const data = insertShiftTemplateSchema.parse(req.body);
      const template = await storage.createShiftTemplate(data);
      res.status(201).json({ success: true, template });
    } catch (error) {
      res.status(400).json({ success: false, error: "Invalid request data" });
    }
  });

  // Shift Assignments
  app.get("/api/shift-assignments", async (req, res) => {
    try {
      const assignments = await storage.getAllShiftAssignments();
      res.json(assignments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch assignments" });
    }
  });

  app.get("/api/shift-assignments/employee/:employeeId", async (req, res) => {
    try {
      const assignments = await storage.getShiftAssignmentsByEmployeeId(req.params.employeeId);
      res.json({ assignments });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch assignments" });
    }
  });

  app.post("/api/shift-assignments", async (req, res) => {
    try {
      const data = insertShiftAssignmentSchema.parse(req.body);
      const assignment = await storage.createShiftAssignment(data);
      res.status(201).json({ success: true, assignment });
    } catch (error) {
      res.status(400).json({ success: false, error: "Invalid request data" });
    }
  });

  app.put("/api/shift-assignments/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      const assignment = await storage.updateShiftAssignmentStatus(req.params.id, status);
      res.json({ success: true, assignment });
    } catch (error) {
      res.status(400).json({ success: false, error: "Update failed" });
    }
  });

  // Leave Requests
  app.get("/api/leave-requests", async (req, res) => {
    try {
      const requests = await storage.getAllLeaveRequests();
      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch requests" });
    }
  });

  app.get("/api/leave-requests/pending", async (req, res) => {
    try {
      const requests = await storage.getPendingLeaveRequests();
      res.json({ requests });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch requests" });
    }
  });

  app.get("/api/leave-requests/employee/:employeeId", async (req, res) => {
    try {
      const requests = await storage.getLeaveRequestsByEmployeeId(req.params.employeeId);
      res.json({ requests });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch requests" });
    }
  });

  app.post("/api/leave-requests", async (req, res) => {
    try {
      const data = insertLeaveRequestSchema.parse(req.body);
      const request = await storage.createLeaveRequest(data);
      res.status(201).json({ success: true, request });
    } catch (error) {
      res.status(400).json({ success: false, error: "Invalid request data" });
    }
  });

  app.put("/api/leave-requests/:id/status", async (req, res) => {
    try {
      const { status, approvedBy } = req.body;
      const request = await storage.updateLeaveRequestStatus(req.params.id, status, approvedBy);
      res.json({ success: true, request });
    } catch (error) {
      res.status(400).json({ success: false, error: "Update failed" });
    }
  });

  // Payroll
  app.get("/api/payroll-cycles", async (req, res) => {
    try {
      const cycles = await storage.getAllPayrollCycles();
      res.json({ cycles });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cycles" });
    }
  });

  app.get("/api/payroll-cycles/:id", async (req, res) => {
    try {
      const cycle = await storage.getPayrollCycleById(req.params.id);
      const entries = cycle ? await storage.getPayrollEntriesByCycleId(req.params.id) : [];
      res.json({ cycle, entries });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cycle" });
    }
  });

  app.post("/api/payroll-cycles", async (req, res) => {
    try {
      const data = insertPayrollCycleSchema.parse(req.body);
      const cycle = await storage.createPayrollCycle(data);
      res.status(201).json({ success: true, cycle });
    } catch (error) {
      res.status(400).json({ success: false, error: "Invalid request data" });
    }
  });

  app.put("/api/payroll-cycles/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      const cycle = await storage.updatePayrollCycleStatus(req.params.id, status);
      res.json({ success: true, cycle });
    } catch (error) {
      res.status(400).json({ success: false, error: "Update failed" });
    }
  });

  app.post("/api/payroll-entries", async (req, res) => {
    try {
      const data = insertPayrollEntrySchema.parse(req.body);
      const entry = await storage.createPayrollEntry(data);
      res.status(201).json({ success: true, entry });
    } catch (error) {
      res.status(400).json({ success: false, error: "Invalid request data" });
    }
  });

  // =====================================================
  // PHASE 3: COMPLIANCE & LEGAL APIs
  // =====================================================

  // Insurance Policies
  app.get("/api/insurance-policies", async (req, res) => {
    try {
      const policies = await storage.getAllInsurancePolicies();
      res.json({ policies });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch policies" });
    }
  });

  app.post("/api/insurance-policies", async (req, res) => {
    try {
      const data = insertInsurancePolicySchema.parse(req.body);
      const policy = await storage.createInsurancePolicy(data);
      res.status(201).json({ success: true, policy });
    } catch (error) {
      res.status(400).json({ success: false, error: "Invalid request data" });
    }
  });

  app.put("/api/insurance-policies/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      const policy = await storage.updateInsurancePolicyStatus(req.params.id, status);
      res.json({ success: true, policy });
    } catch (error) {
      res.status(400).json({ success: false, error: "Update failed" });
    }
  });

  // Business Licenses
  app.get("/api/business-licenses", async (req, res) => {
    try {
      const licenses = await storage.getAllBusinessLicenses();
      res.json({ licenses });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch licenses" });
    }
  });

  app.post("/api/business-licenses", async (req, res) => {
    try {
      const data = insertBusinessLicenseSchema.parse(req.body);
      const license = await storage.createBusinessLicense(data);
      res.status(201).json({ success: true, license });
    } catch (error) {
      res.status(400).json({ success: false, error: "Invalid request data" });
    }
  });

  app.put("/api/business-licenses/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      const license = await storage.updateBusinessLicenseStatus(req.params.id, status);
      res.json({ success: true, license });
    } catch (error) {
      res.status(400).json({ success: false, error: "Update failed" });
    }
  });

  // Tax Filings
  app.get("/api/tax-filings", async (req, res) => {
    try {
      const filings = await storage.getAllTaxFilings();
      res.json({ filings });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch filings" });
    }
  });

  app.post("/api/tax-filings", async (req, res) => {
    try {
      const data = insertTaxFilingSchema.parse(req.body);
      const filing = await storage.createTaxFiling(data);
      res.status(201).json({ success: true, filing });
    } catch (error) {
      res.status(400).json({ success: false, error: "Invalid request data" });
    }
  });

  app.put("/api/tax-filings/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      const filing = await storage.updateTaxFilingStatus(req.params.id, status);
      res.json({ success: true, filing });
    } catch (error) {
      res.status(400).json({ success: false, error: "Update failed" });
    }
  });

  // Compliance Tasks
  app.get("/api/compliance-tasks", async (req, res) => {
    try {
      const tasks = await storage.getAllComplianceTasks();
      res.json({ tasks });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  });

  app.get("/api/compliance-tasks/pending", async (req, res) => {
    try {
      const tasks = await storage.getPendingComplianceTasks();
      res.json({ tasks });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  });

  app.get("/api/compliance-tasks/overdue", async (req, res) => {
    try {
      const tasks = await storage.getOverdueComplianceTasks();
      res.json({ tasks });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  });

  app.post("/api/compliance-tasks", async (req, res) => {
    try {
      const data = insertComplianceTaskSchema.parse(req.body);
      const task = await storage.createComplianceTask(data);
      res.status(201).json({ success: true, task });
    } catch (error) {
      res.status(400).json({ success: false, error: "Invalid request data" });
    }
  });

  app.put("/api/compliance-tasks/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      const task = await storage.updateComplianceTaskStatus(req.params.id, status);
      res.json({ success: true, task });
    } catch (error) {
      res.status(400).json({ success: false, error: "Update failed" });
    }
  });

  // Documents
  app.get("/api/documents", async (req, res) => {
    try {
      const docs = await storage.getAllDocuments();
      res.json({ documents: docs });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch documents" });
    }
  });

  app.get("/api/documents/:entityType/:entityId", async (req, res) => {
    try {
      const docs = await storage.getDocumentsByEntity(req.params.entityType, req.params.entityId);
      res.json({ documents: docs });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch documents" });
    }
  });

  app.post("/api/documents", async (req, res) => {
    try {
      const data = insertDocumentSchema.parse(req.body);
      const doc = await storage.createDocument(data);
      res.status(201).json({ success: true, document: doc });
    } catch (error) {
      res.status(400).json({ success: false, error: "Invalid request data" });
    }
  });

  // =====================================================
  // PHASE 4: VIP LOYALTY APIs
  // =====================================================

  // VIP Benefits
  app.get("/api/vip-benefits", async (req, res) => {
    try {
      const benefits = await storage.getAllVipBenefits();
      res.json({ benefits });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch benefits" });
    }
  });

  app.get("/api/vip-benefits/tier/:tierId", async (req, res) => {
    try {
      const benefits = await storage.getVipBenefitsByTierId(req.params.tierId);
      res.json({ benefits });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch benefits" });
    }
  });

  app.post("/api/vip-benefits", async (req, res) => {
    try {
      const data = insertVipBenefitSchema.parse(req.body);
      const benefit = await storage.createVipBenefit(data);
      res.status(201).json({ success: true, benefit });
    } catch (error) {
      res.status(400).json({ success: false, error: "Invalid request data" });
    }
  });

  // VIP Events
  app.get("/api/vip-events", async (req, res) => {
    try {
      const events = await storage.getAllVipEvents();
      res.json({ events });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });

  app.get("/api/vip-events/upcoming", async (req, res) => {
    try {
      const events = await storage.getUpcomingVipEvents();
      res.json({ events });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });

  app.get("/api/vip-events/:id", async (req, res) => {
    try {
      const event = await storage.getVipEventById(req.params.id);
      const rsvps = event ? await storage.getVipEventRsvps(req.params.id) : [];
      res.json({ event, rsvps });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch event" });
    }
  });

  app.post("/api/vip-events", async (req, res) => {
    try {
      const data = insertVipEventSchema.parse(req.body);
      const event = await storage.createVipEvent(data);
      res.status(201).json({ success: true, event });
    } catch (error) {
      res.status(400).json({ success: false, error: "Invalid request data" });
    }
  });

  app.put("/api/vip-events/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      const event = await storage.updateVipEventStatus(req.params.id, status);
      res.json({ success: true, event });
    } catch (error) {
      res.status(400).json({ success: false, error: "Update failed" });
    }
  });

  // VIP Event RSVPs
  app.post("/api/vip-event-rsvps", async (req, res) => {
    try {
      const data = insertVipEventRsvpSchema.parse(req.body);
      const rsvp = await storage.createVipEventRsvp(data);
      res.status(201).json({ success: true, rsvp });
    } catch (error) {
      res.status(400).json({ success: false, error: "Invalid request data" });
    }
  });

  app.put("/api/vip-event-rsvps/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      const rsvp = await storage.updateVipEventRsvpStatus(req.params.id, status);
      res.json({ success: true, rsvp });
    } catch (error) {
      res.status(400).json({ success: false, error: "Update failed" });
    }
  });

  // Member Activity
  app.get("/api/member-activity/:customerId", async (req, res) => {
    try {
      const logs = await storage.getMemberActivityLogs(req.params.customerId);
      res.json({ logs });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch activity" });
    }
  });

  app.post("/api/member-activity", async (req, res) => {
    try {
      const data = insertMemberActivityLogSchema.parse(req.body);
      const log = await storage.createMemberActivityLog(data);
      res.status(201).json({ success: true, log });
    } catch (error) {
      res.status(400).json({ success: false, error: "Invalid request data" });
    }
  });

  // =====================================================
  // ADMIN DASHBOARD AGGREGATION APIs
  // =====================================================

  // Dashboard Overview Stats
  app.get("/api/admin/dashboard-stats", async (req, res) => {
    try {
      const [suppliers, employees, complianceTasks, pendingLeave, customers, vipEvents] = await Promise.all([
        storage.getAllSuppliers(),
        storage.getAllEmployees(),
        storage.getPendingComplianceTasks(),
        storage.getPendingLeaveRequests(),
        storage.getAllCustomers(),
        storage.getUpcomingVipEvents()
      ]);

      res.json({
        stats: {
          totalSuppliers: suppliers.length,
          activeSuppliers: suppliers.filter(s => s.isActive).length,
          totalEmployees: employees.length,
          activeEmployees: employees.filter(e => e.isActive).length,
          pendingCompliance: complianceTasks.length,
          pendingLeaveRequests: pendingLeave.length,
          totalCustomers: customers.length,
          upcomingVipEvents: vipEvents.length
        }
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  });

  // Customers endpoint
  app.get("/api/customers", async (req, res) => {
    try {
      const customerList = await storage.getAllCustomers();
      res.json({ customers: customerList });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch customers" });
    }
  });

  // =====================================================
  // PHASE 5: POS SYSTEM APIs
  // =====================================================

  // POS Sessions
  app.get("/api/pos/sessions/:unitId", async (req, res) => {
    try {
      const sessions = await storage.getOpenPosSessions(req.params.unitId);
      res.json({ sessions });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sessions" });
    }
  });

  app.get("/api/pos/session/:id", async (req, res) => {
    try {
      const session = await storage.getPosSessionById(req.params.id);
      res.json({ session: session || null });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch session" });
    }
  });

  app.post("/api/pos/sessions", async (req, res) => {
    try {
      const data = insertPosSessionSchema.parse(req.body);
      const session = await storage.createPosSession(data);
      res.status(201).json({ success: true, session });
    } catch (error) {
      res.status(400).json({ success: false, error: "Invalid request data" });
    }
  });

  app.put("/api/pos/sessions/:id/close", async (req, res) => {
    try {
      const { closingCash, expectedCash, cashVariance } = req.body;
      const session = await storage.closePosSession(req.params.id, { closingCash, expectedCash, cashVariance });
      res.json({ success: true, session });
    } catch (error) {
      res.status(400).json({ success: false, error: "Failed to close session" });
    }
  });

  // POS Transactions
  app.get("/api/pos/transactions/:sessionId", async (req, res) => {
    try {
      const transactions = await storage.getPosTransactionsBySession(req.params.sessionId);
      res.json({ transactions });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  app.get("/api/pos/transaction/:id", async (req, res) => {
    try {
      const transaction = await storage.getPosTransactionById(req.params.id);
      const items = transaction ? await storage.getPosTransactionItems(req.params.id) : [];
      const payments = transaction ? await storage.getPosPayments(req.params.id) : [];
      res.json({ transaction, items, payments });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transaction" });
    }
  });

  app.post("/api/pos/transactions", async (req, res) => {
    try {
      const data = insertPosTransactionSchema.parse(req.body);
      const transaction = await storage.createPosTransaction(data);
      res.status(201).json({ success: true, transaction });
    } catch (error) {
      res.status(400).json({ success: false, error: "Invalid request data" });
    }
  });

  app.put("/api/pos/transactions/:id/complete", async (req, res) => {
    try {
      const transaction = await storage.completePosTransaction(req.params.id);
      res.json({ success: true, transaction });
    } catch (error) {
      res.status(400).json({ success: false, error: "Failed to complete transaction" });
    }
  });

  app.put("/api/pos/transactions/:id/void", async (req, res) => {
    try {
      const { voidedBy, voidReason } = req.body;
      const transaction = await storage.voidPosTransaction(req.params.id, voidedBy, voidReason);
      res.json({ success: true, transaction });
    } catch (error) {
      res.status(400).json({ success: false, error: "Failed to void transaction" });
    }
  });

  // POS Transaction Items
  app.post("/api/pos/transaction-items", async (req, res) => {
    try {
      const data = insertPosTransactionItemSchema.parse(req.body);
      const item = await storage.createPosTransactionItem(data);
      res.status(201).json({ success: true, item });
    } catch (error) {
      res.status(400).json({ success: false, error: "Invalid request data" });
    }
  });

  // POS Payments
  app.post("/api/pos/payments", async (req, res) => {
    try {
      const data = insertPosPaymentSchema.parse(req.body);
      const payment = await storage.createPosPayment(data);
      res.status(201).json({ success: true, payment });
    } catch (error) {
      res.status(400).json({ success: false, error: "Invalid request data" });
    }
  });

  // Scale Readings
  app.post("/api/pos/scale-readings", async (req, res) => {
    try {
      const data = insertScaleReadingSchema.parse(req.body);
      const reading = await storage.createScaleReading(data);
      res.status(201).json({ success: true, reading });
    } catch (error) {
      res.status(400).json({ success: false, error: "Invalid request data" });
    }
  });

  app.get("/api/pos/scale-readings/:sessionId", async (req, res) => {
    try {
      const readings = await storage.getScaleReadingsBySession(req.params.sessionId);
      res.json({ readings });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch readings" });
    }
  });

  // Customer lookup for POS
  app.get("/api/pos/customer-lookup", async (req, res) => {
    try {
      const { phone, email } = req.query;
      let customer = null;
      if (email && typeof email === 'string') {
        customer = await storage.getCustomerByEmail(email);
      }
      res.json({ customer });
    } catch (error) {
      res.status(500).json({ error: "Failed to lookup customer" });
    }
  });

  // =====================================================
  // PHASE 6: TIMESHEET SYSTEM APIs
  // =====================================================

  // Timesheet Entries
  app.get("/api/timesheet/active/:employeeId", async (req, res) => {
    try {
      const entry = await storage.getActiveTimesheetEntry(req.params.employeeId);
      res.json({ entry: entry || null });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch active timesheet" });
    }
  });

  app.get("/api/timesheet/employee/:employeeId", async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const entries = await storage.getTimesheetEntriesByEmployee(
        req.params.employeeId,
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined
      );
      res.json({ entries });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch timesheets" });
    }
  });

  app.get("/api/timesheet/unit/:unitId", async (req, res) => {
    try {
      const { date } = req.query;
      const entries = await storage.getTimesheetEntriesByUnit(
        req.params.unitId,
        date ? new Date(date as string) : undefined
      );
      res.json({ entries });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch timesheets" });
    }
  });

  app.get("/api/timesheet/pending-approvals", async (req, res) => {
    try {
      const entries = await storage.getPendingTimesheetApprovals();
      res.json({ entries });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch pending approvals" });
    }
  });

  // Clock In
  app.post("/api/timesheet/clock-in", async (req, res) => {
    try {
      const data = insertTimesheetEntrySchema.parse(req.body);
      const entry = await storage.createTimesheetEntry(data);
      
      // Create location verification
      if (data.clockInLatitude && data.clockInLongitude) {
        await storage.createLocationVerification({
          timesheetEntryId: entry.id,
          employeeId: data.employeeId,
          essenceUnitId: data.essenceUnitId,
          latitude: data.clockInLatitude,
          longitude: data.clockInLongitude,
          verificationType: 'clock_in',
          deviceId: data.clockInDeviceId || undefined,
          ipAddress: data.clockInIpAddress || undefined
        });
      }
      
      res.status(201).json({ success: true, entry });
    } catch (error) {
      res.status(400).json({ success: false, error: "Invalid request data" });
    }
  });

  // Clock Out
  app.put("/api/timesheet/:id/clock-out", async (req, res) => {
    try {
      const entry = await storage.clockOut(req.params.id, req.body);
      
      // Create location verification for clock out
      if (req.body.clockOutLatitude && req.body.clockOutLongitude && entry) {
        await storage.createLocationVerification({
          timesheetEntryId: entry.id,
          employeeId: entry.employeeId,
          essenceUnitId: entry.essenceUnitId,
          latitude: req.body.clockOutLatitude,
          longitude: req.body.clockOutLongitude,
          verificationType: 'clock_out',
          deviceId: req.body.clockOutDeviceId,
          ipAddress: req.body.clockOutIpAddress
        });
      }
      
      res.json({ success: true, entry });
    } catch (error) {
      res.status(400).json({ success: false, error: "Failed to clock out" });
    }
  });

  // Approve/Reject Timesheet
  app.put("/api/timesheet/:id/approve", async (req, res) => {
    try {
      const { approvedBy } = req.body;
      const entry = await storage.approveTimesheet(req.params.id, approvedBy);
      res.json({ success: true, entry });
    } catch (error) {
      res.status(400).json({ success: false, error: "Failed to approve" });
    }
  });

  app.put("/api/timesheet/:id/reject", async (req, res) => {
    try {
      const { reason } = req.body;
      const entry = await storage.rejectTimesheet(req.params.id, reason);
      res.json({ success: true, entry });
    } catch (error) {
      res.status(400).json({ success: false, error: "Failed to reject" });
    }
  });

  // Breaks
  app.get("/api/timesheet/:id/breaks", async (req, res) => {
    try {
      const breaks = await storage.getTimesheetBreaks(req.params.id);
      res.json({ breaks });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch breaks" });
    }
  });

  app.post("/api/timesheet/breaks/start", async (req, res) => {
    try {
      const data = insertTimesheetBreakSchema.parse(req.body);
      const breakEntry = await storage.startBreak(data);
      res.status(201).json({ success: true, break: breakEntry });
    } catch (error) {
      res.status(400).json({ success: false, error: "Invalid request data" });
    }
  });

  app.put("/api/timesheet/breaks/:id/end", async (req, res) => {
    try {
      const breakEntry = await storage.endBreak(req.params.id, req.body);
      res.json({ success: true, break: breakEntry });
    } catch (error) {
      res.status(400).json({ success: false, error: "Failed to end break" });
    }
  });

  // Location Verifications
  app.get("/api/timesheet/:id/verifications", async (req, res) => {
    try {
      const verifications = await storage.getLocationVerifications(req.params.id);
      res.json({ verifications });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch verifications" });
    }
  });

  app.get("/api/timesheet/flagged-verifications", async (req, res) => {
    try {
      const verifications = await storage.getFlaggedVerifications();
      res.json({ verifications });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch flagged verifications" });
    }
  });

  app.post("/api/timesheet/verifications", async (req, res) => {
    try {
      const data = insertLocationVerificationSchema.parse(req.body);
      const verification = await storage.createLocationVerification(data);
      res.status(201).json({ success: true, verification });
    } catch (error) {
      res.status(400).json({ success: false, error: "Invalid request data" });
    }
  });

  // =====================================================
  // PHASE 7: STOCK CONTROL APIs
  // =====================================================

  // Inventory Items
  app.get("/api/inventory/:unitId", async (req, res) => {
    try {
      const items = await storage.getInventoryItemsByUnit(req.params.unitId);
      res.json({ items });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch inventory" });
    }
  });

  app.get("/api/inventory/item/:id", async (req, res) => {
    try {
      const item = await storage.getInventoryItemById(req.params.id);
      res.json({ item: item || null });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch item" });
    }
  });

  app.post("/api/inventory", async (req, res) => {
    try {
      const data = insertInventoryItemSchema.parse(req.body);
      const item = await storage.createInventoryItem(data);
      res.status(201).json({ success: true, item });
    } catch (error) {
      res.status(400).json({ success: false, error: "Invalid request data" });
    }
  });

  app.put("/api/inventory/:id/quantity", async (req, res) => {
    try {
      const { quantity } = req.body;
      const item = await storage.updateInventoryQuantity(req.params.id, quantity);
      res.json({ success: true, item });
    } catch (error) {
      res.status(400).json({ success: false, error: "Failed to update quantity" });
    }
  });

  // Inventory Movements
  app.get("/api/inventory/movements/:itemId", async (req, res) => {
    try {
      const movements = await storage.getInventoryMovements(req.params.itemId);
      res.json({ movements });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch movements" });
    }
  });

  app.get("/api/inventory/movements/unit/:unitId", async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const movements = await storage.getInventoryMovementsByUnit(
        req.params.unitId,
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined
      );
      res.json({ movements });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch movements" });
    }
  });

  app.post("/api/inventory/movements", async (req, res) => {
    try {
      const data = insertInventoryMovementSchema.parse(req.body);
      const movement = await storage.createInventoryMovement(data);
      
      // Update inventory quantity
      const item = await storage.getInventoryItemById(data.inventoryItemId);
      if (item) {
        await storage.updateInventoryQuantity(item.id, data.quantityAfter);
      }
      
      res.status(201).json({ success: true, movement });
    } catch (error) {
      res.status(400).json({ success: false, error: "Invalid request data" });
    }
  });

  // Waste Reports
  app.get("/api/waste-reports", async (req, res) => {
    try {
      const { unitId } = req.query;
      const reports = await storage.getWasteReports(unitId as string | undefined);
      res.json({ reports });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch waste reports" });
    }
  });

  app.get("/api/waste-reports/pending", async (req, res) => {
    try {
      const reports = await storage.getPendingWasteApprovals();
      res.json({ reports });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch pending reports" });
    }
  });

  app.get("/api/waste-reports/suspicious", async (req, res) => {
    try {
      const reports = await storage.getSuspiciousWasteReports();
      res.json({ reports });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch suspicious reports" });
    }
  });

  app.post("/api/waste-reports", async (req, res) => {
    try {
      const data = insertWasteReportSchema.parse(req.body);
      const report = await storage.createWasteReport(data);
      
      // Create alert for suspicious waste
      if (data.wasteCategory === 'suspicious') {
        await storage.createOperationalAlert({
          alertType: 'inventory',
          severity: 'critical',
          category: 'suspicious_activity',
          title: 'Suspicious Waste Report',
          description: `Suspicious waste reported: ${data.description}`,
          essenceUnitId: data.essenceUnitId,
          employeeId: data.reportedBy,
          referenceType: 'waste_report',
          referenceId: report.id
        });
      }
      
      res.status(201).json({ success: true, report });
    } catch (error) {
      res.status(400).json({ success: false, error: "Invalid request data" });
    }
  });

  app.put("/api/waste-reports/:id/approve", async (req, res) => {
    try {
      const { supervisorId } = req.body;
      const report = await storage.approveWasteReport(req.params.id, supervisorId);
      res.json({ success: true, report });
    } catch (error) {
      res.status(400).json({ success: false, error: "Failed to approve" });
    }
  });

  app.put("/api/waste-reports/:id/reject", async (req, res) => {
    try {
      const { reason } = req.body;
      const report = await storage.rejectWasteReport(req.params.id, reason);
      res.json({ success: true, report });
    } catch (error) {
      res.status(400).json({ success: false, error: "Failed to reject" });
    }
  });

  // Stock Counts
  app.get("/api/stock-counts", async (req, res) => {
    try {
      const { unitId } = req.query;
      const counts = await storage.getStockCounts(unitId as string | undefined);
      res.json({ counts });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stock counts" });
    }
  });

  app.get("/api/stock-counts/:id", async (req, res) => {
    try {
      const count = await storage.getStockCountById(req.params.id);
      const items = count ? await storage.getStockCountItems(req.params.id) : [];
      res.json({ count, items });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stock count" });
    }
  });

  app.post("/api/stock-counts", async (req, res) => {
    try {
      const data = insertStockCountSchema.parse(req.body);
      const count = await storage.createStockCount(data);
      res.status(201).json({ success: true, count });
    } catch (error) {
      res.status(400).json({ success: false, error: "Invalid request data" });
    }
  });

  app.put("/api/stock-counts/:id/start", async (req, res) => {
    try {
      const { countedBy } = req.body;
      const count = await storage.startStockCount(req.params.id, countedBy);
      res.json({ success: true, count });
    } catch (error) {
      res.status(400).json({ success: false, error: "Failed to start count" });
    }
  });

  app.put("/api/stock-counts/:id/complete", async (req, res) => {
    try {
      const { verifiedBy } = req.body;
      const count = await storage.completeStockCount(req.params.id, verifiedBy);
      res.json({ success: true, count });
    } catch (error) {
      res.status(400).json({ success: false, error: "Failed to complete count" });
    }
  });

  // Stock Count Items
  app.post("/api/stock-count-items", async (req, res) => {
    try {
      const data = insertStockCountItemSchema.parse(req.body);
      const item = await storage.createStockCountItem(data);
      
      // Create alert for significant variance
      if (Math.abs(parseFloat(data.variancePercent || '0')) > 5) {
        await storage.createOperationalAlert({
          alertType: 'inventory',
          severity: 'warning',
          category: 'inventory_variance',
          title: 'Inventory Variance Detected',
          description: `${data.variancePercent}% variance found during stock count`,
          referenceType: 'stock_count_item',
          referenceId: item.id
        });
      }
      
      res.status(201).json({ success: true, item });
    } catch (error) {
      res.status(400).json({ success: false, error: "Invalid request data" });
    }
  });

  // =====================================================
  // PHASE 8: OPERATIONAL ALERTS APIs
  // =====================================================

  app.get("/api/alerts", async (req, res) => {
    try {
      const { unread } = req.query;
      const alerts = await storage.getOperationalAlerts(unread === 'true');
      res.json({ alerts });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch alerts" });
    }
  });

  app.get("/api/alerts/critical", async (req, res) => {
    try {
      const alerts = await storage.getCriticalAlerts();
      res.json({ alerts });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch critical alerts" });
    }
  });

  app.get("/api/alerts/unit/:unitId", async (req, res) => {
    try {
      const alerts = await storage.getOperationalAlertsByUnit(req.params.unitId);
      res.json({ alerts });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch alerts" });
    }
  });

  app.post("/api/alerts", async (req, res) => {
    try {
      const data = insertOperationalAlertSchema.parse(req.body);
      const alert = await storage.createOperationalAlert(data);
      res.status(201).json({ success: true, alert });
    } catch (error) {
      res.status(400).json({ success: false, error: "Invalid request data" });
    }
  });

  app.put("/api/alerts/:id/acknowledge", async (req, res) => {
    try {
      const { acknowledgedBy } = req.body;
      const alert = await storage.acknowledgeAlert(req.params.id, acknowledgedBy);
      res.json({ success: true, alert });
    } catch (error) {
      res.status(400).json({ success: false, error: "Failed to acknowledge" });
    }
  });

  app.put("/api/alerts/:id/resolve", async (req, res) => {
    try {
      const { resolvedBy, notes } = req.body;
      const alert = await storage.resolveAlert(req.params.id, resolvedBy, notes);
      res.json({ success: true, alert });
    } catch (error) {
      res.status(400).json({ success: false, error: "Failed to resolve" });
    }
  });

  // Extended dashboard stats with POS and operations data
  app.get("/api/admin/operations-stats", async (req, res) => {
    try {
      const [
        pendingTimesheets,
        flaggedVerifications,
        pendingWaste,
        suspiciousWaste,
        criticalAlerts
      ] = await Promise.all([
        storage.getPendingTimesheetApprovals(),
        storage.getFlaggedVerifications(),
        storage.getPendingWasteApprovals(),
        storage.getSuspiciousWasteReports(),
        storage.getCriticalAlerts()
      ]);

      res.json({
        stats: {
          pendingTimesheetApprovals: pendingTimesheets.length,
          flaggedLocationVerifications: flaggedVerifications.length,
          pendingWasteApprovals: pendingWaste.length,
          suspiciousWasteReports: suspiciousWaste.length,
          criticalAlerts: criticalAlerts.length
        }
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch operations stats" });
    }
  });

  return httpServer;
}
