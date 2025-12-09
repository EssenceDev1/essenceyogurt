/* 
====================================================================
ESSENCE YOGURT - OCTOPUS BRAIN 2026
Global backend architecture for:
- Finance and AI bookkeeping
- Multi country compliance (food, data, tax)
- POS, digital scales, terminals
- HR and shift automation
- Loyalty, VIP inbox, E-gift
- Stock, expiry, theft detection
- 24-7 kiosk operations

Pure white and gold is a UI rule - enforced on frontend.
====================================================================
*/

// =======================================================================
// OCTOPUS GLOBAL OPERATIONS ENGINE 2025
// Master Monolith Code Blueprint – Retail Fast Food / Airport / Mall
// Covers: HR, Attendance, Scheduling, Emergency, QA, Food Safety, Fraud,
//         Audit, Training Academy, Stock Loss, Supplier Compliance,
//         Travel Retail, Complaints, Insurance, Crisis Command,
//         Global KPIs, Incident Management & Dashboard Integration.
// =======================================================================

export type ID = string;
export type Region = "UAE" | "SA" | "QA" | "KW" | "BH" | "OM" | "TR" | "EU" | "GR" | "IL" | "AU";
export type Currency = "AED" | "SAR" | "QAR" | "EUR" | "GBP" | "USD" | "ILS" | "AUD";

export type CountryCode = "SA" | "AE" | "IL" | "GR" | "AU" | "OTHER";

export type Role =
  | "ADMIN"
  | "HQ_FINANCE"
  | "HQ_HR"
  | "STORE_MANAGER"
  | "CREW"
  | "CONTRACTOR"
  | "SUPPLIER"
  | "PARTNER"
  | "SHIFT_MANAGER"
  | "LOCATION_MANAGER"
  | "AREA_MANAGER"
  | "HQ_ADMIN"
  | "MAINTENANCE"
  | "AIRPORT_SECURITY"
  | "TRAINER"
  | "AUDITOR";

export type ModuleCategory =
  | "HR"
  | "ATTENDANCE"
  | "SHIFT"
  | "EMERGENCY"
  | "FOOD_SAFETY"
  | "TRAINING"
  | "QA"
  | "SUPPLIER"
  | "INVENTORY"
  | "FRAUD"
  | "SAFETY"
  | "INCIDENT"
  | "AIRPORT"
  | "MALL"
  | "DELIVERY"
  | "TRAVEL_RETAIL"
  | "INSURANCE"
  | "AUDIT"
  | "OPERATIONS"
  | "COMPLIANCE"
  | "KPI"
  | "LEGAL";

export type OctopusEventType =
  | "SHIFT_OPEN"
  | "SHIFT_CLOSE"
  | "OPENING_BLOCKED"
  | "CLOSING_BLOCKED"
  | "EMERGENCY_TRIGGERED"
  | "EMERGENCY_RESOLVED"
  | "FOOD_RECALL"
  | "ALLERGY_INCIDENT"
  | "CLEANING_FAILED"
  | "CLEANING_PASSED"
  | "AUDIT_FAIL"
  | "AUDIT_PASS"
  | "FRAUD_SIGNAL"
  | "NO_SHOW"
  | "STOCK_LOSS"
  | "SECURITY_ALERT"
  | "TRAINING_EXPIRED"
  | "AIRPORT_VIOLATION"
  | "MALL_VIOLATION"
  | "INSURANCE_REQUIRED"
  | "KPI_ALERT";

export type ShiftStatus = "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "MISSED";

export type SickStatus = "NOT_REPORTED" | "REPORTED" | "HANDLED";

export type DeviceType = "POS_TABLET" | "DIGITAL_SCALE" | "CARD_TERMINAL" | "KIOSK";

export type AuthMethod =
  | "EMAIL_PASSWORD"
  | "GOOGLE_OAUTH"
  | "APPLE_OAUTH"
  | "PHONE_OTP"
  | "WHATSAPP_OTP"
  | "PASSKEY_WEBAUTHN"
  | "BIOMETRIC_DEVICE";

export type LoyaltyTier = "STANDARD" | "GOLD" | "DIAMOND";

export type EGiftStatus = "ACTIVE" | "REDEEMED" | "EXPIRED";

export type FoodCategory = "FROZEN_FRUIT" | "POWDER" | "TOPPING" | "SAUCE" | "BASE_MIX";

export type StockStatus = "OK" | "LOW" | "EXPIRED" | "AT_RISK";

export type TransactionSource = "POS_IN_STORE" | "MOBILE_APP" | "KIOSK" | "ONLINE_GIFT";

export interface OctopusLocation {
  id: string;
  name: string;
  country: CountryCode;
  city: string;
  type: "AIRPORT" | "MALL" | "KIOSK" | "FLAGSHIP" | "POPUP";
  timezone: string;
  is24h: boolean;
}

export interface OctopusEmployee {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  country: CountryCode;
  locationIds: string[];
  roles: Role[];
  authMethods: AuthMethod[];
  active: boolean;
}

export interface OctopusShift {
  id: string;
  locationId: string;
  employeeId: string;
  startsAt: string;
  endsAt: string;
  status: ShiftStatus;
}

export interface SickReport {
  id: string;
  employeeId: string;
  shiftId: string;
  reportedAt: string;
  reason: string;
  status: SickStatus;
}

export interface OctopusDevice {
  id: string;
  locationId: string;
  type: DeviceType;
  label: string;
  apiEndpoint?: string;
  serialPort?: string;
  active: boolean;
}

export interface FlavorRef {
  internalCode: string;
  marketingName: string;
}

export interface OrderLine {
  id: string;
  flavor: FlavorRef;
  grams: number;
  unitPricePer100g: number;
  total: number;
}

export interface OctopusTransaction {
  id: string;
  locationId: string;
  employeeId?: string;
  source: TransactionSource;
  createdAt: string;
  currency: string;
  subtotal: number;
  taxAmount: number;
  total: number;
  lines: OrderLine[];
  giftCodeUsed?: string;
  loyaltyAccountId?: string;
  paymentProvider: "CHECKOUT" | "STRIPE" | "OTHER";
  paymentReference: string;
  country: CountryCode;
}

export interface OctopusEGift {
  id: string;
  code: string;
  purchaserEmail: string;
  recipientEmail: string;
  packageType: "ESSENCE_50" | "ESSENCE_100" | "ESSENCE_LUX";
  amount: number;
  currency: string;
  status: EGiftStatus;
  createdAt: string;
  redeemedAt?: string;
  locationIdRestriction?: string | null;
}

export interface OctopusLoyaltyAccount {
  id: string;
  userId: string;
  tier: LoyaltyTier;
  points: number;
  vipInboxMessages: VipInboxMessage[];
  pushConsent: boolean;
  pushChannel: "MOBILE_APP" | "WHATSAPP" | "BOTH" | "NONE";
}

export interface VipInboxMessage {
  id: string;
  createdAt: string;
  title: string;
  body: string;
  read: boolean;
  validUntil?: string;
}

export interface OctopusStockItem {
  id: string;
  sku: string;
  name: string;
  category: FoodCategory;
  locationId: string;
  quantityKg: number;
  minThresholdKg: number;
  expiryDate: string;
  frozenStorageRequired: boolean;
  storageTempTargetC: number;
  allergens: string[];
  status: StockStatus;
}

export interface TaxRule {
  id: string;
  country: CountryCode;
  vatRate: number;
  notes: string;
}

export interface ComplianceRule {
  id: string;
  country: CountryCode;
  domain: "FOOD" | "DATA" | "TAX";
  regulator: string;
  description: string;
  referenceUrl: string;
}

export interface AuditLogEntry {
  id: string;
  createdAt: string;
  actorType: "USER" | "SYSTEM" | "AI";
  actorId?: string;
  action: string;
  details: Record<string, any>;
  country?: CountryCode;
}

export interface FranchiseInvestmentTier {
  id: string;
  name: string;
  minInvestment: number;
  maxInvestment: number;
  currency: string;
  locations: ("AIRPORT" | "MALL" | "KIOSK" | "FLAGSHIP")[];
  royaltyPercentage: number;
  marketingFeePercentage: number;
  exclusiveTerritory: boolean;
  trainingIncluded: boolean;
  equipmentPackage: string;
  estimatedRoi: string;
}

export const FRANCHISE_INVESTMENT_TIERS: FranchiseInvestmentTier[] = [
  {
    id: "tier_kiosk",
    name: "Essence Kiosk",
    minInvestment: 75000,
    maxInvestment: 150000,
    currency: "USD",
    locations: ["KIOSK"],
    royaltyPercentage: 5,
    marketingFeePercentage: 2,
    exclusiveTerritory: false,
    trainingIncluded: true,
    equipmentPackage: "Compact Kiosk Package",
    estimatedRoi: "18-24 months"
  },
  {
    id: "tier_mall",
    name: "Essence Mall Store",
    minInvestment: 200000,
    maxInvestment: 400000,
    currency: "USD",
    locations: ["MALL"],
    royaltyPercentage: 5,
    marketingFeePercentage: 2,
    exclusiveTerritory: false,
    trainingIncluded: true,
    equipmentPackage: "Standard Store Package",
    estimatedRoi: "24-36 months"
  },
  {
    id: "tier_airport",
    name: "Essence Airport Lounge",
    minInvestment: 350000,
    maxInvestment: 600000,
    currency: "USD",
    locations: ["AIRPORT"],
    royaltyPercentage: 6,
    marketingFeePercentage: 2.5,
    exclusiveTerritory: true,
    trainingIncluded: true,
    equipmentPackage: "Premium Airport Package",
    estimatedRoi: "18-30 months"
  },
  {
    id: "tier_flagship",
    name: "Essence Flagship",
    minInvestment: 500000,
    maxInvestment: 1000000,
    currency: "USD",
    locations: ["FLAGSHIP"],
    royaltyPercentage: 4.5,
    marketingFeePercentage: 2,
    exclusiveTerritory: true,
    trainingIncluded: true,
    equipmentPackage: "Flagship Experience Package",
    estimatedRoi: "30-48 months"
  }
];

export interface FranchiseApplicationData {
  fullName: string;
  email: string;
  phone: string;
  country: CountryCode;
  city: string;
  preferredTier: string;
  investmentCapacity: string;
  businessExperience: string;
  foodServiceExperience: boolean;
  currentOccupation: string;
  preferredLocationType: string;
  timeline: string;
  message?: string;
}

export const COMPANY_INFO = {
  name: "Essence Yogurt",
  tagline: "Luxury Soft Serve, Redefined",
  mission: "To deliver the world's finest frozen yogurt experience, combining premium ingredients with innovative flavors in stunning luxury environments.",
  vision: "To become the global leader in luxury frozen desserts, with presence in every major airport, premium mall, and exclusive venue worldwide.",
  values: [
    {
      title: "Luxury Without Compromise",
      description: "Every element of Essence reflects our commitment to excellence - from our handcrafted flavors to our stunning store designs."
    },
    {
      title: "Health-Conscious Indulgence",
      description: "We believe you shouldn't have to choose between delicious and nutritious. Our yogurts are probiotic-rich, lower in sugar, and made with real ingredients."
    },
    {
      title: "Sustainability First",
      description: "From eco-friendly packaging to locally-sourced ingredients where possible, we're committed to minimizing our environmental footprint."
    },
    {
      title: "Innovation Always",
      description: "We continuously push the boundaries of flavor, technology, and customer experience to stay ahead of the curve."
    }
  ],
  founded: 2024,
  headquarters: "Dubai, UAE",
  targetMarkets: ["Saudi Arabia", "United Arab Emirates", "Israel", "Greece", "Australia"],
  storeCount: "10+ locations planned for 2026",
  teamSize: "Growing team of 50+ professionals"
};

// =======================================================================
// OCTOPUS GLOBAL OPERATIONS ENGINE 2025 - INTERFACES
// =======================================================================

export interface OctopusStaff {
  id: ID;
  name: string;
  role: Role;
  locationId: ID;
  trainingModules: string[];
  certifications: Record<string, string>;
  status: "ACTIVE" | "SUSPENDED" | "TERMINATED";
}

export interface OctopusGlobalLocation {
  id: ID;
  code: string;
  name: string;
  region: Region;
  isAirport: boolean;
  isMall: boolean;
  timezone: string;
  riskLevel: number;
}

export interface OctopusGlobalShift {
  id: ID;
  date: string;
  locationId: ID;
  startTime: string;
  endTime: string;
  requiredCrew: number;
  requiredManagers: number;
  staffAssigned: ID[];
  openingChecklistCompleted: boolean;
  closingChecklistCompleted: boolean;
  cleaningCompleted: boolean;
}

export interface EmergencyPlan {
  id: ID;
  locationId: ID;
  type:
    | "POWER_FAILURE"
    | "FIRE_ALARM"
    | "FLOOD"
    | "SECURITY_THREAT"
    | "EQUIPMENT_FIRE"
    | "WATER_CONTAMINATION"
    | "GAS_SMELL";
  steps: string[];
  responsibleRoles: Role[];
}

export interface GlobalFoodSafetyRecord {
  id: ID;
  locationId: ID;
  staffId: ID;
  type: "TEMP_LOG" | "CLEANING" | "ALLERGEN" | "EXPIRY" | "CALIBRATION";
  data: Record<string, any>;
  timestamp: string;
}

export interface QAInspection {
  id: ID;
  locationId: ID;
  auditorId: ID;
  score: number;
  notes: string[];
  failedItems: string[];
  passedItems: string[];
  timestamp: string;
}

export interface FraudSignal {
  id: ID;
  locationId: ID;
  staffId?: ID;
  type:
    | "DISCOUNT_ABUSE"
    | "REFUND_PATTERN"
    | "VOID_PATTERN"
    | "WEIGHT_MANIPULATION"
    | "BALL_NOT_CHARGED"
    | "MISSING_STOCK"
    | "ZERO_PRICE_ORDER";
  severity: number;
  timestamp: string;
}

export interface GlobalIncident {
  id: ID;
  category:
    | "FOOD"
    | "ALLERGY"
    | "INJURY"
    | "SECURITY"
    | "PROPERTY_DAMAGE"
    | "GUEST_COMPLAINT"
    | "AIRPORT_SECURITY"
    | "MALL_VIOLATION";
  locationId: ID;
  staffId?: ID;
  description: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  timestamp: string;
}

export interface GlobalSupplier {
  id: ID;
  name: string;
  category: "INGREDIENTS" | "PACKAGING" | "CLEANING" | "ORGANIC_CERTIFIED";
  certificationDocuments: string[];
  halalCertified: boolean;
  auditScore: number;
}

export interface GlobalTrainingModule {
  id: ID;
  name: string;
  description: string;
  mandatory: boolean;
  renewalDays: number;
}

export interface OctopusEvent {
  id: ID;
  type: OctopusEventType;
  payload: Record<string, any>;
  timestamp: string;
  locationId?: ID;
  staffId?: ID;
  resolved: boolean;
}

export interface LocationKPI {
  locationId: ID;
  incidents: number;
  avgQAScore: number;
  highRiskIncidents: number;
  fraudAlerts: number;
  trainingCompliance: number;
  cleaningCompliance: number;
  foodSafetyScore: number;
}
