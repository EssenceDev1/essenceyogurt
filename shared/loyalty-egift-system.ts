/**
 * ESSENCE YOGURT - LEGAL + COMPLIANCE UI + LUXURY E-GIFT & LOYALTY WALLET
 * 2026 MASTER FILE - FRONTEND + BACKEND LOGIC + SCALING PRINCIPLES
 *
 * This plugs into:
 * - HQ dashboard
 * - Staff app
 * - POS
 * - Franchise admin
 * - Octopus Brain backend
 *
 * Pure white background, gold accents.
 */

/* ============================================================================
   0. SHARED TYPES
   ========================================================================== */

export type CountryCode = "SA" | "AE" | "IL" | "GR" | "AU" | "OTHER";

export type LegalDocSlug =
  | "terms"
  | "privacy"
  | "cookies"
  | "allergy"
  | "food-safety"
  | "refunds"
  | "egift"
  | "franchise"
  | "disclaimer"
  | "data-requests";

export interface LegalDocument {
  slug: LegalDocSlug;
  title: string;
  lastUpdated: string;
  locale: string;
  sections: {
    heading: string;
    body: string;
  }[];
}

export interface ConsentRecord {
  id: string;
  userId?: string;
  deviceId: string;
  country: CountryCode;
  docSlug: LegalDocSlug;
  version: string;
  consentType: "ACCEPT" | "DECLINE";
  timestamp: string;
}

export type TierCode = "ESSENCE" | "GOLD" | "DIAMOND";

export interface LoyaltyAccount {
  id: string;
  userId: string;
  points: number;
  tier: TierCode;
  createdAt: string;
  updatedAt: string;
  country: CountryCode;
}

export interface LoyaltyTransaction {
  id: string;
  accountId: string;
  type: "EARN" | "REDEEM";
  pointsChange: number;
  reason:
    | "PURCHASE"
    | "EGIFT_PURCHASE"
    | "EGIFT_REDEEM"
    | "DISCRETIONARY"
    | "ADJUSTMENT";
  referenceId?: string;
  timestamp: string;
}

export type EGiftStatus = "ACTIVE" | "USED" | "EXPIRED" | "BLOCKED";

export interface EGift {
  id: string;
  code: string;
  buyerUserId?: string;
  recipientEmail?: string;
  currency: string;
  amountInitial: number;
  amountRemaining: number;
  status: EGiftStatus;
  expiresAt?: string;
  createdAt: string;
  redeemedAt?: string;
  redeemedStoreId?: string;
}

/* ============================================================================
   1. LEGAL CONTENT REGISTRY
   ========================================================================== */

export const LegalRegistry: LegalDocument[] = [
  {
    slug: "allergy",
    title: "Allergy Information",
    lastUpdated: "2025-11-30",
    locale: "en",
    sections: [
      {
        heading: "Important notice",
        body: "Products may contain or come into contact with common allergens including dairy, nuts, soy, gluten and seeds. Cross contact is possible in a self serve environment."
      },
      {
        heading: "Customer responsibility",
        body: "Guests with allergies must carefully review ingredient information and may choose not to self serve if unsure. By consuming the product, guests accept responsibility for allergy risk."
      }
    ]
  },
  {
    slug: "terms",
    title: "Customer Terms and Conditions",
    lastUpdated: "2025-11-30",
    locale: "en",
    sections: [
      {
        heading: "Use of the service",
        body: "By using the store, website or app, customers agree to follow local laws, treat staff respectfully and use self serve areas responsibly."
      }
    ]
  },
  {
    slug: "privacy",
    title: "Privacy and Data Protection",
    lastUpdated: "2025-11-30",
    locale: "en",
    sections: [
      {
        heading: "Global privacy model",
        body: "Data is handled under modern privacy laws in each country. Personal data is used for loyalty and service improvement and is not sold."
      }
    ]
  },
  {
    slug: "egift",
    title: "E-Gift Card Terms",
    lastUpdated: "2025-11-30",
    locale: "en",
    sections: [
      {
        heading: "Single use and non transferable",
        body: "Digital gift codes are locked to a single redemption, cannot be split or transferred and are not redeemable for cash except where required by law."
      }
    ]
  }
];

export function getLegalDoc(slug: LegalDocSlug, locale: string): LegalDocument {
  const doc =
    LegalRegistry.find((d) => d.slug === slug && d.locale === locale) ||
    LegalRegistry.find((d) => d.slug === slug && d.locale === "en");
  if (!doc) {
    throw new Error(`Legal document not found for slug ${slug}`);
  }
  return doc;
}

/* ============================================================================
   2. LOYALTY WALLET LOGIC - TIERS, POINTS, BENEFITS
   ========================================================================== */

export const LoyaltyConfig = {
  tiers: {
    ESSENCE: { minPoints: 0, multiplier: 1.0 },
    GOLD: { minPoints: 5000, multiplier: 1.25 },
    DIAMOND: { minPoints: 20000, multiplier: 1.5 }
  },
  
  pointsPerDollar: 5,
  pointsRedemptionRate: 100, // 100 points = 1 AUD
  
  tierBenefits: {
    ESSENCE: [
      "Earn points on every purchase",
      "Access to member only promotions"
    ],
    GOLD: [
      "Bonus points on selected days",
      "Invites to store openings",
      "Special birthday surprise"
    ],
    DIAMOND: [
      "Priority service at busy times",
      "Exclusive flavors previews",
      "Higher earn rate on all purchases",
      "Access to private VIP inbox offers"
    ]
  }
};

export function calculateTier(points: number): TierCode {
  if (points >= LoyaltyConfig.tiers.DIAMOND.minPoints) return "DIAMOND";
  if (points >= LoyaltyConfig.tiers.GOLD.minPoints) return "GOLD";
  return "ESSENCE";
}

export function pointsEarnedForPurchase(amountAUD: number, tier: TierCode = "ESSENCE"): number {
  const base = Math.round(amountAUD * LoyaltyConfig.pointsPerDollar);
  const multiplier = LoyaltyConfig.tiers[tier].multiplier;
  return Math.round(base * multiplier);
}

export function pointsRedeemableValue(points: number): number {
  return points / LoyaltyConfig.pointsRedemptionRate;
}

export function getTierBenefits(tier: TierCode): string[] {
  return LoyaltyConfig.tierBenefits[tier];
}

/* ============================================================================
   3. E-GIFT MODULE LOGIC
   ========================================================================== */

export const EGiftConfig = {
  allowedAmounts: [25, 50, 100, 200],
  codePrefix: "EY",
  currencies: ["AUD", "USD", "SAR", "AED", "ILS", "EUR"],
  expiryDays: 365
};

export function createEGiftCode(): string {
  const random = Math.random().toString(36).slice(2, 10).toUpperCase();
  return `${EGiftConfig.codePrefix}-${random}`;
}

export function validateEGiftAmount(amount: number): boolean {
  return EGiftConfig.allowedAmounts.includes(amount);
}

/* ============================================================================
   4. BACKEND API ROUTES - LOYALTY AND E-GIFT
   ========================================================================== */

export const LoyaltyEGiftApiRoutes = {
  loyalty: {
    getAccount: { method: "GET", path: "/api/loyalty/account/:userId" },
    earnPoints: { method: "POST", path: "/api/loyalty/earn" },
    redeemPoints: { method: "POST", path: "/api/loyalty/redeem" },
    getTransactions: { method: "GET", path: "/api/loyalty/transactions/:accountId" },
    getTierBenefits: { method: "GET", path: "/api/loyalty/benefits/:tier" }
  },
  
  egift: {
    create: { method: "POST", path: "/api/egift/create" },
    getByCode: { method: "GET", path: "/api/egift/:code" },
    redeem: { method: "POST", path: "/api/egift/redeem" },
    checkBalance: { method: "GET", path: "/api/egift/balance/:code" }
  },
  
  consent: {
    save: { method: "POST", path: "/api/consent/save" },
    getHistory: { method: "GET", path: "/api/consent/history/:userId" }
  },
  
  dataRequests: {
    requestAccess: { method: "POST", path: "/api/data-request/access" },
    requestDeletion: { method: "POST", path: "/api/data-request/delete" }
  }
};

/* ============================================================================
   5. SCALING PRINCIPLES - ARCHITECTURE NOTES
   ========================================================================== */

export const ScalingPrinciples = {
  serviceSeparation: [
    "Auth service",
    "Store and inventory service",
    "Payments and POS service",
    "Loyalty and egift service",
    "Legal and compliance service",
    "Reporting and analytics service"
  ],
  
  auditTrails: {
    trackedChanges: [
      "Loyalty points changes",
      "E-gift redemptions",
      "Refunds",
      "Maintenance tickets",
      "Expenses"
    ],
    capturedData: ["userId", "storeId", "IP (if allowed)", "timestamp"]
  },
  
  regionalSharding: {
    GCC: ["SA", "AE"],
    EU: ["GR"],
    APAC: ["AU", "IL"]
  },
  
  roleBasedAccess: {
    HQ: "All data",
    COUNTRY_MANAGER: "Only their region",
    FRANCHISE_PARTNER: "Only their stores",
    STAFF: "Only what they need for their shift"
  },
  
  reliability: {
    offlineMode: "POS and digital scale can work offline and sync later",
    idempotency: "E-gift redemption has idempotent API to prevent double redemption"
  },
  
  security: {
    authentication: "SSO or strong auth for admin and franchise dashboards",
    payments: "All payment operations via PCI compliant gateway",
    encryption: "Personal data encrypted at rest"
  }
};

/* ============================================================================
   6. UI THEME FOR LOYALTY/EGIFT SCREENS
   ========================================================================== */

export const LoyaltyUITheme = {
  colors: {
    background: "#FFFFFF",
    text: "#111111",
    gold: "#B08D57",
    goldLight: "#FFF8F0",
    border: "#F0F0F0",
    borderLight: "#F7F7F7",
    muted: "#777777"
  },
  
  tierColors: {
    ESSENCE: "#B08D57",
    GOLD: "#D4AF37",
    DIAMOND: "#4A90D9"
  }
};
