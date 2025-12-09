/**
 * ESSENCE YOGURT - GLOBAL ECOSYSTEM 2026
 * Single file mega-architecture for:
 * - HQ Dashboard
 * - Staff App
 * - POS + Digital Scale
 * - AI Fraud Engine
 * - Franchise Admin System
 *
 * Tech assumptions:
 * - TypeScript
 * - React (for frontends)
 * - Node style backend (Express-style handlers)
 * - All UI on pure white background, gold accents only.
 */

/* ============================================================================
   0. SHARED TYPES AND CONSTANTS
   ========================================================================== */

export type CountryCode = "SA" | "AE" | "IL" | "GR" | "AU" | "OTHER";

export type Role =
  | "HQ_ADMIN"
  | "STORE_MANAGER"
  | "STAFF"
  | "TECHNICIAN"
  | "FRANCHISE_PARTNER"
  | "FRANCHISE_APPLICANT";

export interface EssenceUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  storeId?: string;
  country: CountryCode;
  avatarUrl?: string;
}

export interface Store {
  id: string;
  name: string;
  location: string;
  country: CountryCode;
  is24h: boolean;
  franchiseId?: string;
}

export type PaymentMethod =
  | "APPLE_PAY"
  | "GOOGLE_PAY"
  | "VISA"
  | "MASTERCARD"
  | "AMEX"
  | "CASH"
  | "CHECKOUT_COM";

export interface SaleItem {
  sku: string;
  name: string;
  quantityGrams: number;
  pricePerKg: number;
}

export interface SaleTransaction {
  id: string;
  storeId: string;
  staffId?: string;
  timestamp: string;
  items: SaleItem[];
  grossAmount: number;
  surcharge: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  loyaltyCustomerId?: string;
  eGiftCodeUsed?: string;
}

export type MaintenanceStatus = "OPEN" | "ASSIGNED" | "IN_PROGRESS" | "COMPLETED";

export interface MaintenanceTicket {
  id: string;
  storeId: string;
  issueType:
    | "SOFT_SERVE_MACHINE"
    | "FRIDGE"
    | "ELECTRIC"
    | "WATER"
    | "SCALE"
    | "POS"
    | "OTHER";
  description: string;
  createdByUserId: string;
  createdAt: string;
  assignedTechnicianId?: string;
  status: MaintenanceStatus;
  photos?: string[];
  estimatedCost?: number;
  finalCost?: number;
}

export interface FranchiseApplicationType {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: CountryCode | string;
  city: string;
  investmentCapacityUSD: number;
  status:
    | "NEW"
    | "UNDER_REVIEW"
    | "NEEDS_MORE_INFO"
    | "APPROVED"
    | "REJECTED";
  notes?: string;
  leadScore: number;
  createdAt: string;
}

/* ============================================================================
   1. AI FRAUD DETECTION ENGINE
   ========================================================================== */

export interface FraudSignal {
  type:
    | "UNUSUAL_REFUND_RATE"
    | "WEIGHT_PRICE_MISMATCH"
    | "FREE_ITEMS_PATTERN"
    | "ABNORMAL_DISCOUNTS"
    | "MAINTENANCE_COST_SPIKE"
    | "INVENTORY_LEAK";
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  message: string;
  storeId?: string;
  staffId?: string;
  transactionId?: string;
  createdAt: string;
}

export const FraudEngineConfig = {
  WEIGHT_PRICE_TOLERANCE: 0.05, // 5 percent
  MAX_REFUND_RATE_DAILY: 0.15, // 15 percent of sales
  MAX_DISCOUNT_RATIO: 0.3, // 30 percent average
};

export function checkWeightPriceIntegrity(sale: SaleTransaction): FraudSignal[] {
  const signals: FraudSignal[] = [];
  const expected = sale.items.reduce(
    (sum, item) => sum + (item.quantityGrams / 1000) * item.pricePerKg,
    0
  );
  const diff = Math.abs(expected - sale.grossAmount);
  const diffRatio = expected > 0 ? diff / expected : 0;

  if (diffRatio > FraudEngineConfig.WEIGHT_PRICE_TOLERANCE) {
    signals.push({
      type: "WEIGHT_PRICE_MISMATCH",
      severity: diffRatio > 0.15 ? "HIGH" : "MEDIUM",
      message:
        "Weight and price calculation does not match POS total. Possible scale override or staff manipulation.",
      storeId: sale.storeId,
      staffId: sale.staffId,
      transactionId: sale.id,
      createdAt: new Date().toISOString()
    });
  }

  return signals;
}

export function checkDailyPatterns(args: {
  storeId: string;
  totalSales: number;
  totalRefunds: number;
  avgDiscountRatio: number;
  maintenanceCostToday: number;
  maintenanceCostAverage: number;
}): FraudSignal[] {
  const signals: FraudSignal[] = [];

  const refundRate = args.totalSales > 0 ? args.totalRefunds / args.totalSales : 0;
  if (refundRate > FraudEngineConfig.MAX_REFUND_RATE_DAILY) {
    signals.push({
      type: "UNUSUAL_REFUND_RATE",
      severity: "HIGH",
      message:
        "High daily refund ratio detected for this store. Possible fraud or operational issue.",
      storeId: args.storeId,
      createdAt: new Date().toISOString()
    });
  }

  if (args.avgDiscountRatio > FraudEngineConfig.MAX_DISCOUNT_RATIO) {
    signals.push({
      type: "ABNORMAL_DISCOUNTS",
      severity: "MEDIUM",
      message:
        "Average discount ratio is unusually high. Staff may be granting unauthorized discounts.",
      storeId: args.storeId,
      createdAt: new Date().toISOString()
    });
  }

  if (args.maintenanceCostToday > args.maintenanceCostAverage * 3 + 100) {
    signals.push({
      type: "MAINTENANCE_COST_SPIKE",
      severity: "MEDIUM",
      message:
        "Maintenance costs are spiking compared to historical baseline. Verify invoices and work logs.",
      storeId: args.storeId,
      createdAt: new Date().toISOString()
    });
  }

  return signals;
}

/* ============================================================================
   2. POS + DIGITAL SCALE INTEGRATION MODULE
   ========================================================================== */

export interface DigitalScaleConfig {
  deviceId: string;
  connectionType: "USB" | "SERIAL" | "NETWORK" | "BLUETOOTH";
  manufacturer: "ARLYN" | "CAS" | "STAR" | "OTHER";
  apiEndpoint?: string;
}

export function calculatePosTotals(args: {
  items: SaleItem[];
  paymentMethod: PaymentMethod;
  surchargeRate: number;
}): Pick<SaleTransaction, "grossAmount" | "surcharge" | "totalAmount"> {
  const grossAmount = args.items.reduce(
    (sum, item) => sum + (item.quantityGrams / 1000) * item.pricePerKg,
    0
  );

  const surcharge = args.paymentMethod === "CASH" ? 0 : grossAmount * args.surchargeRate;
  const totalAmount = grossAmount + surcharge;

  return { grossAmount, surcharge, totalAmount };
}

/* ============================================================================
   3. STAFF APP CONFIGURATION
   ========================================================================== */

export const StaffAppConfig = {
  loginMethods: [
    "FACE_ID",
    "GOOGLE",
    "APPLE",
    "EMAIL_CODE",
    "WHATSAPP_OTP",
    "PASSKEY"
  ],
  
  issueTypes: [
    { value: "SOFT_SERVE_MACHINE", label: "Soft serve machine" },
    { value: "FRIDGE", label: "Fridge or freezer" },
    { value: "ELECTRIC", label: "Electric issue" },
    { value: "WATER", label: "Water or plumbing" },
    { value: "SCALE", label: "Digital scale" },
    { value: "POS", label: "POS or payment" },
    { value: "OTHER", label: "Other" }
  ],
  
  quickActions: [
    { id: "sick", label: "I am not well - request shift replacement", color: "red" },
    { id: "clockIn", label: "Clock In", color: "green" },
    { id: "clockOut", label: "Clock Out", color: "amber" },
    { id: "stockCheck", label: "Stock Check", color: "blue" },
    { id: "cleaningTasks", label: "Cleaning Tasks", color: "purple" }
  ],

  sickReplacementFlow: {
    step1: "Staff presses 'Not Well' button",
    step2: "System finds next available staff",
    step3: "Sends shift request notification",
    step4: "Requires confirmation within 5 minutes",
    step5: "If no response, next staff is notified"
  }
};

/* ============================================================================
   4. HQ DASHBOARD CONFIGURATION
   ========================================================================== */

export const HqDashboardConfig = {
  regions: ["SA", "AE", "IL", "GR", "AU"] as CountryCode[],
  
  kpiCards: [
    { id: "totalSales", label: "Total sales today", format: "currency" },
    { id: "transactions", label: "Transactions today", format: "number" },
    { id: "storesLive", label: "Stores live", format: "number" },
    { id: "fraudAlerts", label: "Fraud alerts", format: "number", alertColor: true }
  ],
  
  modules: [
    "Finance center",
    "Sales analytics",
    "Store performance",
    "Technician manager",
    "Staff attendance",
    "Inventory health",
    "AI fraud alerts",
    "Franchise applications"
  ]
};

/* ============================================================================
   5. FRANCHISE ADMIN CONFIGURATION
   ========================================================================== */

export const FranchiseAdminConfig = {
  applicationStatuses: [
    { value: "NEW", label: "New" },
    { value: "UNDER_REVIEW", label: "Under review" },
    { value: "NEEDS_MORE_INFO", label: "Needs more info" },
    { value: "APPROVED", label: "Approved" },
    { value: "REJECTED", label: "Rejected" }
  ],
  
  leadScoreThresholds: {
    hot: 70,
    warm: 50,
    cold: 30
  },
  
  targetCountries: ["Saudi Arabia", "UAE", "Israel", "Greece", "Australia"]
};

/* ============================================================================
   6. BACKEND API ROUTES
   ========================================================================== */

export const BackendApiRoutes = {
  sales: {
    recordSale: { method: "POST", path: "/api/sales/new" },
    getSales: { method: "GET", path: "/api/sales/history" },
    getDailySummary: { method: "GET", path: "/api/sales/daily-summary" }
  },
  
  maintenance: {
    createTicket: { method: "POST", path: "/api/maintenance/ticket" },
    assignTechnician: { method: "POST", path: "/api/maintenance/assign" },
    updateStatus: { method: "PATCH", path: "/api/maintenance/status" },
    completeRepair: { method: "POST", path: "/api/maintenance/complete" }
  },
  
  franchise: {
    apply: { method: "POST", path: "/api/franchise/apply" },
    getApplications: { method: "GET", path: "/api/franchise/applications" },
    updateStatus: { method: "PATCH", path: "/api/franchise/applications/:id" }
  },
  
  staff: {
    clockIn: { method: "POST", path: "/api/staff/clock-in" },
    clockOut: { method: "POST", path: "/api/staff/clock-out" },
    reportSick: { method: "POST", path: "/api/staff/sick" },
    assignShift: { method: "POST", path: "/api/staff/assign" }
  },
  
  fraud: {
    getSignals: { method: "GET", path: "/api/fraud/signals" },
    analyzeTransaction: { method: "POST", path: "/api/fraud/analyze" }
  }
};

/* ============================================================================
   7. UI THEME CONSTANTS
   ========================================================================== */

export const EssenceTheme = {
  colors: {
    background: "#FFFFFF",
    text: "#111111",
    gold: "#B08D57",
    goldLight: "#D4AF37",
    border: "#F0F0F0",
    borderLight: "#F5F5F5",
    success: "#00AA66",
    error: "#CC0000",
    warning: "#FF9900"
  },
  
  borderRadius: {
    small: 8,
    medium: 12,
    large: 16,
    pill: 999
  },
  
  fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
};
