/* ============================
   ESSENCE YOGURT GLOBAL OS 2026
   CORE TYPES AND CONFIG
   ============================ */

export type CountryCode = "SA" | "AE" | "GR" | "IL" | "AU" | "US" | "OTHER";
export type LanguageCode =
  | "en"
  | "ar"
  | "fr"
  | "es"
  | "nl"
  | "de"
  | "ja"
  | "zh"
  | "th";

export type CurrencyCode = "SAR" | "AED" | "EUR" | "ILS" | "AUD" | "USD";

export type UserRole =
  | "CUSTOMER"
  | "STAFF"
  | "SHIFT_LEAD"
  | "STORE_MANAGER"
  | "FRANCHISE_OWNER"
  | "HQ_ADMIN"
  | "AIRPORT_SUPERVISOR";

export type LoyaltyTier = "STANDARD" | "GOLD" | "PLATINUM" | "DIAMOND";

export type PaymentProvider = "CHECKOUT_COM" | "STRIPE" | "ADYEN";

export type StoreType = "MALL" | "AIRPORT" | "KIOSK" | "STREET" | "HOTEL";

export type FlavorTier = "CORE" | "AUSSIE_NATIVE" | "DESSERT_REMIX" | "SPECIAL";

export type ComplianceProfileCode =
  | "SAUDI_ARABIA"
  | "UAE"
  | "GREECE"
  | "ISRAEL"
  | "AUSTRALIA"
  | "USA"
  | "GENERIC";

export type TaxTerminology = "VAT" | "GST" | "MA'AM" | "ΦΠΑ" | "TAX";

export interface TaxProfile {
  rate: number;
  terminology: TaxTerminology;
  terminologyLocal: string;
  isInclusive: boolean;
  registrationLabel: string;
  registrationNumber: string;
  freeZoneRate: number;
  freeZoneAvailable: boolean;
  freeZoneNote: string;
}

export interface RegionProfile {
  id: string;
  country: CountryCode;
  currency: CurrencyCode;
  currencySymbol: string;
  defaultLanguage: LanguageCode;
  complianceProfile: ComplianceProfileCode;
  vatRate: number;
  tax: TaxProfile;
  pricePerKg: number;
  eftSurchargeRate: number;
  allowMada: boolean;
  allowTapToPay: boolean;
  allowOfflinePos: boolean;
}

export interface EssenceUser {
  id: string;
  createdAt: string;
  updatedAt: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  appleId?: string;
  googleId?: string;
  passkeyId?: string;
  role: UserRole;
  country: CountryCode;
  preferredLanguage: LanguageCode;
  loyaltyTier?: LoyaltyTier;
  isVip: boolean;
  isActive: boolean;
  lastLoginAt?: string;
}

export interface StaffProfile {
  id: string;
  userId: string;
  storeIds: string[];
  franchiseId?: string;
  role: UserRole;
  reliabilityScore: number;
  skills: string[];
  languages: LanguageCode[];
  shiftPreferences: {
    morning: boolean;
    afternoon: boolean;
    night: boolean;
  };
  sickToday: boolean;
  nextShiftAt?: string;
}

export interface Store {
  id: string;
  name: string;
  storeCode: string;
  type: StoreType;
  country: CountryCode;
  regionProfileId: string;
  franchiseId?: string;
  airportCode?: string;
  is24h: boolean;
  isActive: boolean;
  paymentProvider: PaymentProvider;
}

export interface Franchise {
  id: string;
  name: string;
  legalEntity: string;
  country: CountryCode;
  contactEmail: string;
  contactPhone?: string;
  royaltyPercent: number;
  marketingPercent: number;
  technologyFeePercent?: number;
  contractStart: string;
  contractEnd?: string;
  isSuspended: boolean;
}

export interface Territory {
  id: string;
  franchiseId: string;
  name: string;
  country: CountryCode;
  polygonGeoJson?: unknown;
  postalCodes?: string[];
  cityNames?: string[];
  isExclusive: boolean;
}

export interface Flavor {
  internalCode: string;
  marketingName: string;
  description: string;
  tier: FlavorTier;
  category: "YOGURT" | "TOPPING" | "SAUCE" | "CRUNCH" | "FRUIT";
  allergens: ("MILK" | "NUTS" | "GLUTEN" | "SOY" | "EGG" | "NONE")[];
  isVegan: boolean;
  isHalal: boolean;
  isKosherOptional: boolean;
  regionAvailability: CountryCode[];
  activeFrom?: string;
  activeTo?: string;
  imageKey?: string;
  inventorySku: string;
  costPerUnitGram: number;
  pricePerUnitGram: number;
  loyaltyBoostFactor?: number;
  vipOnly?: boolean;
  minTierRequired?: LoyaltyTier;
}

export interface LoyaltyAccount {
  userId: string;
  pointsBalance: number;
  tier: LoyaltyTier;
  lastUpdated: string;
}

export interface EGift {
  id: string;
  userId: string;
  packageCode: "GOLD_TREAT" | "PLATINUM_DELIGHT" | "DIAMOND_EXPERIENCE";
  valueCurrency: CurrencyCode;
  valueAmount: number;
  remainingAmount: number;
  oneTimeRedeem: boolean;
  isRedeemed: boolean;
  expiresAt: string;
  createdAt: string;
  regionAllowed: CountryCode[];
}

export type PaymentMethodType =
  | "CARD"
  | "APPLE_PAY"
  | "GOOGLE_PAY"
  | "SAMSUNG_PAY"
  | "MADA"
  | "CASH";

export interface PaymentRecord {
  id: string;
  storeId: string;
  franchiseId?: string;
  provider: PaymentProvider;
  providerRef: string;
  amountCurrency: CurrencyCode;
  amountValue: number;
  vatRate: number;
  createdAt: string;
  paymentMethod: PaymentMethodType;
  status: "PENDING" | "APPROVED" | "DECLINED" | "REFUNDED";
  userId?: string;
  loyaltyPointsEarned?: number;
  eGiftIdUsed?: string;
}

export interface PosDevice {
  id: string;
  storeId: string;
  franchiseId?: string;
  deviceType: "IPAD" | "ANDROID_TABLET" | "KIOSK_SCREEN";
  pairedScaleId?: string;
  pairedPaymentTerminalId?: string;
  isOnline: boolean;
  lastHeartbeatAt: string;
}

export interface DigitalScale {
  id: string;
  model: "STAR_MG_T" | "CAS_PD_II" | "ARLYN_API";
  connectionType: "USB" | "SERIAL" | "ETHERNET" | "BLUETOOTH";
  storeId: string;
  lastCalibrationAt?: string;
  isOperational: boolean;
}

export interface InventoryItem {
  id: string;
  sku: string;
  storeId: string;
  category: "FROZEN" | "REFRIGERATED" | "DRY";
  name: string;
  quantityGrams: number;
  safetyStockGrams: number;
  expiryDate: string;
  manufactureDate?: string;
  halalCertified: boolean;
  kosherOptional: boolean;
  supplierId?: string;
}

export interface FridgeSensor {
  id: string;
  storeId: string;
  sensorType: "FREEZER" | "FRIDGE";
  minTempC: number;
  maxTempC: number;
  lastReadingTempC?: number;
  lastReadingAt?: string;
}

export interface ComplianceProfile {
  code: ComplianceProfileCode;
  requiresArabicLabels: boolean;
  requiresHalalCertificates: boolean;
  requiresHaccp: boolean;
  dailyFridgeLogsRequired: boolean;
  privacyLawCode: "PDPL_SA" | "PDPL_UAE" | "GDPR" | "PPL_IL" | "GENERIC";
  requireAirportOfflineMode: boolean;
}

export interface VipMessage {
  id: string;
  userId: string;
  createdAt: string;
  subject: string;
  body: string;
  language: LanguageCode;
  isRead: boolean;
  expiresAt?: string;
  priority: "NORMAL" | "HIGH" | "CRITICAL";
}

export interface StaffShift {
  id: string;
  staffId: string;
  storeId: string;
  startTime: string;
  endTime: string;
  isSickReported: boolean;
  isReplacementFound: boolean;
}

export interface InventoryAlert {
  id: string;
  storeId: string;
  sku: string;
  type:
    | "LOW_STOCK"
    | "EXPIRING_SOON"
    | "EXPIRED"
    | "TEMP_RISK"
    | "FRAUD_PATTERN";
  severity: "INFO" | "WARNING" | "CRITICAL";
  message: string;
  createdAt: string;
}

/* ============================
   MULTI LANGUAGE ENGINE
   ============================ */

export const strings: Record<LanguageCode, Record<string, string>> = {
  en: {
    app_title: "Essence Yogurt",
    welcome: "Welcome to Essence Yogurt",
    choose_flavor: "Choose your flavor",
    halal_confirm: "All Essence products are Halal friendly",
    menu_title: "Our 2026 Collection",
    loyalty_title: "Loyalty and VIP",
    vip_inbox: "VIP Inbox",
    egift_title: "Digital E-Gift",
    franchise_title: "Franchise Opportunities",
    about_title: "About Essence Yogurt",
    airport_banner: "Now expanding across Europe and the Middle East",
  },
  ar: {
    app_title: "ايسنس يوغرت",
    welcome: "مرحبًا بكم في ايسنس يوغرت",
    choose_flavor: "اختر النكهة الخاصة بك",
    halal_confirm: "جميع منتجات ايسنس حلال",
    menu_title: "تشكيلة 2026",
    loyalty_title: "الولاء وكبار الشخصيات",
    vip_inbox: "صندوق كبار الشخصيات",
    egift_title: "بطاقة هدية رقمية",
    franchise_title: "فرص الامتياز",
    about_title: "حول ايسنس يوغرت",
    airport_banner: "نحن نتوسع الآن في أوروبا والشرق الأوسط",
  },
  fr: {
    app_title: "Essence Yogurt",
    welcome: "Bienvenue à Essence Yogurt",
    choose_flavor: "Choisissez votre saveur",
    halal_confirm: "Tous les produits Essence sont Halal",
    menu_title: "Notre collection 2026",
    loyalty_title: "Programme de fidélité et VIP",
    vip_inbox: "Boîte VIP",
    egift_title: "Carte cadeau numérique",
    franchise_title: "Opportunités de franchise",
    about_title: "À propos de Essence Yogurt",
    airport_banner: "Nous nous développons en Europe et au Moyen-Orient",
  },
  es: {
    app_title: "Essence Yogurt",
    welcome: "Bienvenido a Essence Yogurt",
    choose_flavor: "Elige tu sabor",
    halal_confirm: "Todos los productos Essence son Halal",
    menu_title: "Nuestra colección 2026",
    loyalty_title: "Fidelidad y VIP",
    vip_inbox: "Bandeja VIP",
    egift_title: "Tarjeta de regalo digital",
    franchise_title: "Oportunidades de franquicia",
    about_title: "Sobre Essence Yogurt",
    airport_banner: "Ahora expandiéndonos en Europa y Medio Oriente",
  },
  nl: {
    app_title: "Essence Yogurt",
    welcome: "Welkom bij Essence Yogurt",
    choose_flavor: "Kies je smaak",
    halal_confirm: "Alle Essence producten zijn Halal",
    menu_title: "Onze 2026 collectie",
    loyalty_title: "Loyaliteit en VIP",
    vip_inbox: "VIP Inbox",
    egift_title: "Digitale cadeaubon",
    franchise_title: "Franchise mogelijkheden",
    about_title: "Over Essence Yogurt",
    airport_banner: "Nu uitbreidend naar Europa en het Midden-Oosten",
  },
  de: {
    app_title: "Essence Yogurt",
    welcome: "Willkommen bei Essence Yogurt",
    choose_flavor: "Wähle deinen Geschmack",
    halal_confirm: "Alle Essence Produkte sind Halal",
    menu_title: "Unsere Kollektion 2026",
    loyalty_title: "Treueprogramm und VIP",
    vip_inbox: "VIP Postfach",
    egift_title: "Digitale Geschenkkarte",
    franchise_title: "Franchise Möglichkeiten",
    about_title: "Über Essence Yogurt",
    airport_banner: "Wir erweitern jetzt nach Europa und den Nahen Osten",
  },
  ja: {
    app_title: "Essence Yogurt",
    welcome: "Essence Yogurtへようこそ",
    choose_flavor: "フレーバーを選んでください",
    halal_confirm: "Essenceの製品はすべてハラール対応です",
    menu_title: "2026コレクション",
    loyalty_title: "ロイヤルティとVIP",
    vip_inbox: "VIPインボックス",
    egift_title: "デジタルギフトカード",
    franchise_title: "フランチャイズ機会",
    about_title: "Essence Yogurtについて",
    airport_banner: "ヨーロッパと中東へ拡大中",
  },
  zh: {
    app_title: "Essence Yogurt",
    welcome: "欢迎来到Essence Yogurt",
    choose_flavor: "选择你的口味",
    halal_confirm: "所有Essence产品均为清真友好",
    menu_title: "我们的2026系列",
    loyalty_title: "会员与贵宾",
    vip_inbox: "VIP收件箱",
    egift_title: "数字礼品卡",
    franchise_title: "特许经营机会",
    about_title: "关于Essence Yogurt",
    airport_banner: "现已扩展至欧洲和中东",
  },
  th: {
    app_title: "Essence Yogurt",
    welcome: "ยินดีต้อนรับสู่ Essence Yogurt",
    choose_flavor: "เลือก รสชาติ ของคุณ",
    halal_confirm: "ผลิตภัณฑ์ Essence ทั้งหมดเป็นฮาลาล",
    menu_title: "คอลเลกชันปี 2026",
    loyalty_title: "สะสมแต้มและวีไอพี",
    vip_inbox: "กล่องข้อความ VIP",
    egift_title: "บัตรของขวัญดิจิทัล",
    franchise_title: "โอกาสแฟรนไชส์",
    about_title: "เกี่ยวกับ Essence Yogurt",
    airport_banner: "กำลังขยายสู่ยุโรปและตะวันออกกลาง",
  },
};

export function t(lang: LanguageCode, key: string): string {
  return strings[lang]?.[key] || strings["en"][key] || key;
}

/* ============================
   REGION AND COMPLIANCE PROFILES
   ============================ */

export const REGION_PROFILES: RegionProfile[] = [
  {
    id: "RP_SA",
    country: "SA",
    currency: "SAR",
    currencySymbol: "﷼",
    defaultLanguage: "ar",
    complianceProfile: "SAUDI_ARABIA",
    vatRate: 0.15,
    tax: {
      rate: 0.15,
      terminology: "VAT",
      terminologyLocal: "ضريبة القيمة المضافة",
      isInclusive: true,
      registrationLabel: "VAT No.",
      registrationNumber: "3XXXXXXXXXX0003",
      freeZoneRate: 0,
      freeZoneAvailable: true,
      freeZoneNote: "Zero-rated supply from Free Zone",
    },
    pricePerKg: 185,
    eftSurchargeRate: 0,
    allowMada: true,
    allowTapToPay: true,
    allowOfflinePos: true,
  },
  {
    id: "RP_SA_FZ",
    country: "SA",
    currency: "SAR",
    currencySymbol: "﷼",
    defaultLanguage: "ar",
    complianceProfile: "SAUDI_ARABIA",
    vatRate: 0,
    tax: {
      rate: 0,
      terminology: "VAT",
      terminologyLocal: "ضريبة القيمة المضافة",
      isInclusive: true,
      registrationLabel: "VAT No.",
      registrationNumber: "3XXXXXXXXXX0003",
      freeZoneRate: 0,
      freeZoneAvailable: true,
      freeZoneNote: "Zero-rated - Free Zone Entity",
    },
    pricePerKg: 185,
    eftSurchargeRate: 0,
    allowMada: true,
    allowTapToPay: true,
    allowOfflinePos: true,
  },
  {
    id: "RP_AE",
    country: "AE",
    currency: "AED",
    currencySymbol: "د.إ",
    defaultLanguage: "en",
    complianceProfile: "UAE",
    vatRate: 0.05,
    tax: {
      rate: 0.05,
      terminology: "VAT",
      terminologyLocal: "ضريبة القيمة المضافة",
      isInclusive: true,
      registrationLabel: "TRN",
      registrationNumber: "1XXXXXXXXXXXXXXX5",
      freeZoneRate: 0,
      freeZoneAvailable: true,
      freeZoneNote: "Zero-rated supply - DAFZA/JAFZA Entity",
    },
    pricePerKg: 180,
    eftSurchargeRate: 0,
    allowMada: false,
    allowTapToPay: true,
    allowOfflinePos: true,
  },
  {
    id: "RP_AE_FZ",
    country: "AE",
    currency: "AED",
    currencySymbol: "د.إ",
    defaultLanguage: "en",
    complianceProfile: "UAE",
    vatRate: 0,
    tax: {
      rate: 0,
      terminology: "VAT",
      terminologyLocal: "ضريبة القيمة المضافة",
      isInclusive: true,
      registrationLabel: "TRN",
      registrationNumber: "1XXXXXXXXXXXXXXX5",
      freeZoneRate: 0,
      freeZoneAvailable: true,
      freeZoneNote: "Zero-rated - Free Zone Designated Area",
    },
    pricePerKg: 180,
    eftSurchargeRate: 0,
    allowMada: false,
    allowTapToPay: true,
    allowOfflinePos: true,
  },
  {
    id: "RP_GR",
    country: "GR",
    currency: "EUR",
    currencySymbol: "€",
    defaultLanguage: "en",
    complianceProfile: "GREECE",
    vatRate: 0.24,
    tax: {
      rate: 0.24,
      terminology: "ΦΠΑ",
      terminologyLocal: "Φόρος Προστιθέμενης Αξίας",
      isInclusive: true,
      registrationLabel: "ΑΦΜ",
      registrationNumber: "EL999999999",
      freeZoneRate: 0,
      freeZoneAvailable: false,
      freeZoneNote: "",
    },
    pricePerKg: 45,
    eftSurchargeRate: 0,
    allowMada: false,
    allowTapToPay: true,
    allowOfflinePos: true,
  },
  {
    id: "RP_IL",
    country: "IL",
    currency: "ILS",
    currencySymbol: "₪",
    defaultLanguage: "en",
    complianceProfile: "ISRAEL",
    vatRate: 0.17,
    tax: {
      rate: 0.17,
      terminology: "MA'AM",
      terminologyLocal: "מע\"מ",
      isInclusive: true,
      registrationLabel: "מספר עוסק",
      registrationNumber: "5XXXXXXXX",
      freeZoneRate: 0,
      freeZoneAvailable: false,
      freeZoneNote: "",
    },
    pricePerKg: 160,
    eftSurchargeRate: 0,
    allowMada: false,
    allowTapToPay: true,
    allowOfflinePos: true,
  },
  {
    id: "RP_AU",
    country: "AU",
    currency: "AUD",
    currencySymbol: "$",
    defaultLanguage: "en",
    complianceProfile: "AUSTRALIA",
    vatRate: 0.1,
    tax: {
      rate: 0.1,
      terminology: "GST",
      terminologyLocal: "Goods and Services Tax",
      isInclusive: true,
      registrationLabel: "A.B.N",
      registrationNumber: "XX XXX XXX XXX",
      freeZoneRate: 0,
      freeZoneAvailable: false,
      freeZoneNote: "",
    },
    pricePerKg: 50,
    eftSurchargeRate: 0.011,
    allowMada: false,
    allowTapToPay: true,
    allowOfflinePos: true,
  },
];

export const COMPLIANCE_PROFILES: ComplianceProfile[] = [
  {
    code: "SAUDI_ARABIA",
    requiresArabicLabels: true,
    requiresHalalCertificates: true,
    requiresHaccp: true,
    dailyFridgeLogsRequired: true,
    privacyLawCode: "PDPL_SA",
    requireAirportOfflineMode: true,
  },
  {
    code: "UAE",
    requiresArabicLabels: false,
    requiresHalalCertificates: true,
    requiresHaccp: true,
    dailyFridgeLogsRequired: true,
    privacyLawCode: "PDPL_UAE",
    requireAirportOfflineMode: true,
  },
  {
    code: "GREECE",
    requiresArabicLabels: false,
    requiresHalalCertificates: false,
    requiresHaccp: true,
    dailyFridgeLogsRequired: true,
    privacyLawCode: "GDPR",
    requireAirportOfflineMode: true,
  },
  {
    code: "ISRAEL",
    requiresArabicLabels: false,
    requiresHalalCertificates: false,
    requiresHaccp: true,
    dailyFridgeLogsRequired: true,
    privacyLawCode: "PPL_IL",
    requireAirportOfflineMode: true,
  },
  {
    code: "AUSTRALIA",
    requiresArabicLabels: false,
    requiresHalalCertificates: false,
    requiresHaccp: true,
    dailyFridgeLogsRequired: true,
    privacyLawCode: "GENERIC",
    requireAirportOfflineMode: true,
  },
];

/* ============================
   REGION PROFILE HELPERS
   ============================ */

export function getRegionProfile(regionId: string): RegionProfile | undefined {
  return REGION_PROFILES.find(r => r.id === regionId);
}

export function getRegionProfileByCountry(country: CountryCode, freeZone: boolean = false): RegionProfile | undefined {
  if (freeZone) {
    const fzProfile = REGION_PROFILES.find(r => r.country === country && r.id.endsWith('_FZ'));
    if (fzProfile) return fzProfile;
  }
  return REGION_PROFILES.find(r => r.country === country && !r.id.endsWith('_FZ'));
}

export function getDefaultRegionProfile(): RegionProfile {
  return REGION_PROFILES.find(r => r.id === 'RP_AU')!;
}

export function formatCurrency(amount: number, region: RegionProfile): string {
  return `${region.currencySymbol}${amount.toFixed(2)}`;
}

export function calculateTaxAmount(subtotal: number, region: RegionProfile): number {
  if (region.tax.isInclusive) {
    return subtotal - (subtotal / (1 + region.tax.rate));
  }
  return subtotal * region.tax.rate;
}

export function getTaxLabel(region: RegionProfile, localized: boolean = false): string {
  if (localized && region.tax.terminologyLocal) {
    return region.tax.terminologyLocal;
  }
  return region.tax.terminology;
}

/* ============================
   FLAVOR LIBRARY 2026
   ============================ */

export const FLAVOR_LIBRARY_2026: Flavor[] = [
  {
    internalCode: "FLV_CORE_NAT",
    marketingName: "Yogurt Core",
    description:
      "The pure, untamed essence. A pristine canvas of rich, tangy delight.",
    tier: "CORE",
    category: "YOGURT",
    allergens: ["MILK"],
    isVegan: false,
    isHalal: true,
    isKosherOptional: true,
    regionAvailability: ["SA", "AE", "GR", "IL", "AU", "US"],
    inventorySku: "SKU_CORE_NAT",
    costPerUnitGram: 0.01,
    pricePerUnitGram: 0.05,
  },
  {
    internalCode: "FLV_CORE_VAN",
    marketingName: "Halo Cloud",
    description:
      "An ethereal swirl of exquisite vanilla, light as a cloud and deeply satisfying.",
    tier: "CORE",
    category: "YOGURT",
    allergens: ["MILK"],
    isVegan: false,
    isHalal: true,
    isKosherOptional: true,
    regionAvailability: ["SA", "AE", "GR", "IL", "AU", "US"],
    inventorySku: "SKU_CORE_VAN",
    costPerUnitGram: 0.011,
    pricePerUnitGram: 0.055,
  },
  {
    internalCode: "FLV_CORE_DARK",
    marketingName: "Dark Shadow",
    description: "Rich, intense, and profoundly indulgent dark chocolate.",
    tier: "CORE",
    category: "YOGURT",
    allergens: ["MILK", "SOY"],
    isVegan: false,
    isHalal: true,
    isKosherOptional: true,
    regionAvailability: ["SA", "AE", "GR", "IL", "AU", "US"],
    inventorySku: "SKU_CORE_DARK",
    costPerUnitGram: 0.012,
    pricePerUnitGram: 0.06,
  },
  {
    internalCode: "FLV_CORE_WHITE",
    marketingName: "White Glaze",
    description:
      "Luminous white chocolate crafted into a smooth and bright finish.",
    tier: "CORE",
    category: "YOGURT",
    allergens: ["MILK", "SOY"],
    isVegan: false,
    isHalal: true,
    isKosherOptional: true,
    regionAvailability: ["SA", "AE", "GR", "IL", "AU", "US"],
    inventorySku: "SKU_CORE_WHITE",
    costPerUnitGram: 0.011,
    pricePerUnitGram: 0.055,
  },
  {
    internalCode: "FLV_CORE_PIS",
    marketingName: "Pistachio Code",
    description:
      "Unlocking the sophisticated secret of pistachio. Earthy and subtly sweet.",
    tier: "CORE",
    category: "YOGURT",
    allergens: ["MILK", "NUTS"],
    isVegan: false,
    isHalal: true,
    isKosherOptional: true,
    regionAvailability: ["SA", "AE", "GR", "IL", "AU", "US"],
    inventorySku: "SKU_CORE_PIS",
    costPerUnitGram: 0.013,
    pricePerUnitGram: 0.065,
    loyaltyBoostFactor: 1.1,
  },
  {
    internalCode: "FLV_CORE_ACA",
    marketingName: "Açaí Burst",
    description:
      "An invigorating explosion of açaí, vibrant and dynamic, delivering a powerful surge of flavor.",
    tier: "CORE",
    category: "YOGURT",
    allergens: ["NONE"],
    isVegan: true,
    isHalal: true,
    isKosherOptional: true,
    regionAvailability: ["SA", "AE", "GR", "IL", "AU", "US"],
    inventorySku: "SKU_CORE_ACA",
    costPerUnitGram: 0.012,
    pricePerUnitGram: 0.06,
    loyaltyBoostFactor: 1.2,
  },
  {
    internalCode: "FLV_CORE_STRAW",
    marketingName: "Strawberry Prime",
    description:
      "The quintessential strawberry experience. Juicy, sweet, and perfectly balanced.",
    tier: "CORE",
    category: "YOGURT",
    allergens: ["MILK"],
    isVegan: false,
    isHalal: true,
    isKosherOptional: true,
    regionAvailability: ["SA", "AE", "GR", "IL", "AU", "US"],
    inventorySku: "SKU_CORE_STRAW",
    costPerUnitGram: 0.011,
    pricePerUnitGram: 0.055,
  },
  {
    internalCode: "FLV_CORE_MAN",
    marketingName: "Mango Flux",
    description:
      "A dynamic current of tropical mango, intense sweetness and sun drenched flavor.",
    tier: "CORE",
    category: "YOGURT",
    allergens: ["MILK"],
    isVegan: false,
    isHalal: true,
    isKosherOptional: true,
    regionAvailability: ["SA", "AE", "GR", "IL", "AU", "US"],
    inventorySku: "SKU_CORE_MAN",
    costPerUnitGram: 0.011,
    pricePerUnitGram: 0.055,
  },
  {
    internalCode: "FLV_CORE_COC",
    marketingName: "Coconut Zenith",
    description:
      "The ultimate expression of coconut. Clean, crisp, and exquisitely tropical.",
    tier: "CORE",
    category: "YOGURT",
    allergens: ["MILK"],
    isVegan: false,
    isHalal: true,
    isKosherOptional: true,
    regionAvailability: ["SA", "AE", "GR", "IL", "AU", "US"],
    inventorySku: "SKU_CORE_COC",
    costPerUnitGram: 0.011,
    pricePerUnitGram: 0.055,
  },
  {
    internalCode: "FLV_CORE_SCAR",
    marketingName: "Coastal Drift",
    description:
      "A smooth, salty sweet blend capturing the serene movement of caramel with a hint of sea salt.",
    tier: "CORE",
    category: "YOGURT",
    allergens: ["MILK"],
    isVegan: false,
    isHalal: true,
    isKosherOptional: true,
    regionAvailability: ["SA", "AE", "GR", "IL", "AU", "US"],
    inventorySku: "SKU_CORE_SCAR",
    costPerUnitGram: 0.012,
    pricePerUnitGram: 0.06,
  },
  {
    internalCode: "FLV_DXB_CHOC",
    marketingName: "Dubai Midnight Gold",
    description:
      "A deep, velvety chocolate with a luxury Dubai twist, designed for night time indulgence.",
    tier: "SPECIAL",
    category: "YOGURT",
    allergens: ["MILK", "SOY"],
    isVegan: false,
    isHalal: true,
    isKosherOptional: false,
    regionAvailability: ["SA", "AE"],
    inventorySku: "SKU_DXB_CHOC",
    costPerUnitGram: 0.013,
    pricePerUnitGram: 0.07,
    loyaltyBoostFactor: 1.3,
    vipOnly: true,
    minTierRequired: "GOLD",
  },
];

/* ============================
   E-GIFT PACKAGES (Block 3)
   Gold Treat, Platinum Delight, Diamond Experience
   ============================ */

export type EGiftPackageCode = "GOLD_TREAT" | "PLATINUM_DELIGHT" | "DIAMOND_EXPERIENCE";

export interface EGiftPackageDefinition {
  code: EGiftPackageCode;
  name: string;
  description: string;
  valueAmount: number;
  bonusPercentage: number;
  validityDays: number;
  isTransferable: false;
  oneTimeRedeem: boolean;
  themeColor: string;
  minTierToPurchase?: LoyaltyTier;
}

export const EGIFT_PACKAGES: EGiftPackageDefinition[] = [
  {
    code: "GOLD_TREAT",
    name: "Gold Treat",
    description: "A golden gesture of sweetness. Perfect for sharing joy.",
    valueAmount: 15,
    bonusPercentage: 0,
    validityDays: 90,
    isTransferable: false,
    oneTimeRedeem: true,
    themeColor: "#D4AF37",
  },
  {
    code: "PLATINUM_DELIGHT",
    name: "Platinum Delight",
    description: "Elevated indulgence for those who deserve more.",
    valueAmount: 30,
    bonusPercentage: 10,
    validityDays: 180,
    isTransferable: false,
    oneTimeRedeem: true,
    themeColor: "#E5E4E2",
    minTierToPurchase: "GOLD",
  },
  {
    code: "DIAMOND_EXPERIENCE",
    name: "Diamond Experience",
    description: "The ultimate luxury gift. An unforgettable Essence experience.",
    valueAmount: 50,
    bonusPercentage: 20,
    validityDays: 365,
    isTransferable: false,
    oneTimeRedeem: true,
    themeColor: "#B9F2FF",
    minTierToPurchase: "PLATINUM",
  },
];

/* ============================
   LOYALTY TIER MULTIPLIERS (Block 3)
   ============================ */

export const LOYALTY_TIER_MULTIPLIERS: Record<LoyaltyTier, number> = {
  STANDARD: 1.0,
  GOLD: 1.1,
  PLATINUM: 1.25,
  DIAMOND: 1.5,
};

export const LOYALTY_TIER_THRESHOLDS: Record<LoyaltyTier, number> = {
  STANDARD: 0,
  GOLD: 1000,
  PLATINUM: 5000,
  DIAMOND: 15000,
};

/* ============================
   LOYALTY ENGINE CORE (Block 3)
   1g = 1pt base, tier multipliers apply
   ============================ */

export function calculateLoyaltyPointsForOrder(params: {
  userTier: LoyaltyTier;
  totalGrams: number;
  flavors: Flavor[];
}): { basePoints: number; multiplier: number; flavorBoost: number; finalPoints: number } {
  const basePoints = params.totalGrams;
  const tierMultiplier = LOYALTY_TIER_MULTIPLIERS[params.userTier] || 1;
  
  const flavorBoost =
    params.flavors.reduce((acc, f) => acc + (f.loyaltyBoostFactor || 1) - 1, 0) /
      Math.max(params.flavors.length, 1) || 0;
  const boostMultiplier = 1 + flavorBoost;
  
  const finalPoints = Math.round(basePoints * tierMultiplier * boostMultiplier);
  
  return {
    basePoints,
    multiplier: tierMultiplier,
    flavorBoost: boostMultiplier,
    finalPoints,
  };
}

export function determineLoyaltyTier(totalPoints: number): LoyaltyTier {
  if (totalPoints >= LOYALTY_TIER_THRESHOLDS.DIAMOND) return "DIAMOND";
  if (totalPoints >= LOYALTY_TIER_THRESHOLDS.PLATINUM) return "PLATINUM";
  if (totalPoints >= LOYALTY_TIER_THRESHOLDS.GOLD) return "GOLD";
  return "STANDARD";
}

/* ============================
   ROTATING QR TOKEN ENGINE (Block 3)
   60-second refresh anti-fraud
   ============================ */

export interface QrTokenPayload {
  customerId: string;
  sessionId: string;
  timestamp: number;
  signature: string;
}

export function generateQrToken(customerId: string, sessionId: string, secretKey: string): QrTokenPayload {
  const timestamp = Date.now();
  const data = `${customerId}:${sessionId}:${timestamp}`;
  const signature = simpleHash(data + secretKey);
  return {
    customerId,
    sessionId,
    timestamp,
    signature,
  };
}

export function validateQrToken(
  token: QrTokenPayload,
  secretKey: string,
  maxAgeMs: number = 60000
): { valid: boolean; reason?: string } {
  const now = Date.now();
  const age = now - token.timestamp;
  
  if (age > maxAgeMs) {
    return { valid: false, reason: "TOKEN_EXPIRED" };
  }
  
  if (age < 0) {
    return { valid: false, reason: "TOKEN_FUTURE_TIMESTAMP" };
  }
  
  const expectedSig = simpleHash(`${token.customerId}:${token.sessionId}:${token.timestamp}${secretKey}`);
  if (token.signature !== expectedSig) {
    return { valid: false, reason: "INVALID_SIGNATURE" };
  }
  
  return { valid: true };
}

function simpleHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

/* ============================
   E-GIFT ENGINE CORE (Block 3)
   Non-transferable, one-time use
   ============================ */

export function canRedeemEGift(params: {
  egift: EGift;
  country: CountryCode;
  now: Date;
}): { canRedeem: boolean; reason?: string } {
  if (params.egift.isRedeemed) {
    return { canRedeem: false, reason: "ALREADY_REDEEMED" };
  }
  
  if (params.egift.regionAllowed.length > 0 &&
    !params.egift.regionAllowed.includes(params.country)) {
    return { canRedeem: false, reason: "REGION_NOT_ALLOWED" };
  }
  
  const expiry = new Date(params.egift.expiresAt);
  if (expiry.getTime() < params.now.getTime()) {
    return { canRedeem: false, reason: "EXPIRED" };
  }
  
  return { canRedeem: true };
}

export function validateEGiftTransferAttempt(egift: EGift): { blocked: true; reason: string } {
  return { blocked: true, reason: "EGIFT_NON_TRANSFERABLE" };
}

/* ============================
   STAFF SICK REPORT AND AUTO REPLACEMENT (Block 4)
   ============================ */

export interface StaffReplacementCandidate {
  staffId: string;
  name: string;
  reliabilityScore: number;
  distanceScore: number;
  wantsMoreHours: boolean;
  hasRequiredSkills: boolean;
  speaksRequiredLanguages: boolean;
  isAvailable: boolean;
}

export function rankStaffReplacementCandidates(
  candidates: StaffReplacementCandidate[]
): StaffReplacementCandidate[] {
  return [...candidates]
    .filter(c => c.isAvailable && c.hasRequiredSkills)
    .sort((a, b) => {
      const scoreA =
        a.reliabilityScore * 2 +
        (a.wantsMoreHours ? 10 : 0) +
        (a.speaksRequiredLanguages ? 5 : 0) -
        a.distanceScore;
      const scoreB =
        b.reliabilityScore * 2 +
        (b.wantsMoreHours ? 10 : 0) +
        (b.speaksRequiredLanguages ? 5 : 0) -
        b.distanceScore;
      return scoreB - scoreA;
    });
}

export interface SickReportRequest {
  staffId: string;
  shiftId: string;
  reason: string;
  expectedReturnDate?: string;
}

export interface AutoSwapResult {
  success: boolean;
  replacementStaffId?: string;
  notificationsSent: string[];
  escalatedToManager: boolean;
}

/* ============================
   INVENTORY AND FRIDGE SAFETY (Block 5)
   ============================ */

export type ExpiryState = "FRESH" | "WARNING" | "CRITICAL" | "EXPIRED";

export function getExpiryState(expiryDate: string, now: Date): ExpiryState {
  const expiry = new Date(expiryDate);
  const msDiff = expiry.getTime() - now.getTime();
  const daysDiff = msDiff / (1000 * 60 * 60 * 24);
  
  if (daysDiff <= 0) return "EXPIRED";
  if (daysDiff <= 1) return "CRITICAL";
  if (daysDiff <= 3) return "WARNING";
  return "FRESH";
}

export function evaluateInventoryAlertForItem(
  item: InventoryItem,
  now: Date
): InventoryAlert[] {
  const alerts: InventoryAlert[] = [];
  const expiryState = getExpiryState(item.expiryDate, now);
  
  if (expiryState === "EXPIRED") {
    alerts.push({
      id: `ALERT_EXPIRED_${item.id}`,
      storeId: item.storeId,
      sku: item.sku,
      type: "EXPIRED",
      severity: "CRITICAL",
      message: `Item ${item.name} has expired and must be removed immediately`,
      createdAt: now.toISOString(),
    });
  } else if (expiryState === "CRITICAL") {
    alerts.push({
      id: `ALERT_CRITICAL_${item.id}`,
      storeId: item.storeId,
      sku: item.sku,
      type: "EXPIRING_SOON",
      severity: "CRITICAL",
      message: `Item ${item.name} expires within 24 hours - prioritize usage`,
      createdAt: now.toISOString(),
    });
  } else if (expiryState === "WARNING") {
    alerts.push({
      id: `ALERT_EXP_SOON_${item.id}`,
      storeId: item.storeId,
      sku: item.sku,
      type: "EXPIRING_SOON",
      severity: "WARNING",
      message: `Item ${item.name} expiring within 3 days`,
      createdAt: now.toISOString(),
    });
  }
  
  if (item.quantityGrams <= item.safetyStockGrams) {
    alerts.push({
      id: `ALERT_LOW_${item.id}`,
      storeId: item.storeId,
      sku: item.sku,
      type: "LOW_STOCK",
      severity: "WARNING",
      message: `Item ${item.name} is below safety stock level`,
      createdAt: now.toISOString(),
    });
  }
  
  return alerts;
}

export function evaluateFridgeSensor(
  sensor: FridgeSensor,
  readingTempC: number,
  now: Date
): InventoryAlert[] {
  const alerts: InventoryAlert[] = [];
  
  if (readingTempC < sensor.minTempC || readingTempC > sensor.maxTempC) {
    const severity = Math.abs(readingTempC - (sensor.minTempC + sensor.maxTempC) / 2) > 5 
      ? "CRITICAL" 
      : "WARNING";
    
    alerts.push({
      id: `ALERT_TEMP_${sensor.id}_${now.getTime()}`,
      storeId: sensor.storeId,
      sku: "",
      type: "TEMP_RISK",
      severity,
      message: `Temperature ${readingTempC}°C out of range (${sensor.minTempC}-${sensor.maxTempC}°C) for ${sensor.sensorType}`,
      createdAt: now.toISOString(),
    });
  }
  
  return alerts;
}

export interface AutoReorderRecommendation {
  sku: string;
  itemName: string;
  currentQuantity: number;
  safetyStock: number;
  recommendedOrderQuantity: number;
  urgency: "LOW" | "MEDIUM" | "HIGH";
  supplierId?: string;
}

export function calculateAutoReorderRecommendations(
  items: InventoryItem[],
  dailyConsumptionRates: Record<string, number>
): AutoReorderRecommendation[] {
  const recommendations: AutoReorderRecommendation[] = [];
  
  for (const item of items) {
    const dailyRate = dailyConsumptionRates[item.sku] || 100;
    const daysOfStock = item.quantityGrams / dailyRate;
    
    if (daysOfStock <= 7) {
      const reorderQty = Math.ceil(dailyRate * 14);
      recommendations.push({
        sku: item.sku,
        itemName: item.name,
        currentQuantity: item.quantityGrams,
        safetyStock: item.safetyStockGrams,
        recommendedOrderQuantity: reorderQty,
        urgency: daysOfStock <= 2 ? "HIGH" : daysOfStock <= 4 ? "MEDIUM" : "LOW",
        supplierId: item.supplierId,
      });
    }
  }
  
  return recommendations.sort((a, b) => {
    const urgencyOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
    return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
  });
}

/* ============================
   POS WEIGHT AND PRICING ENGINE
   ============================ */

export interface PosOrderLine {
  flavorCode: string;
  grams: number;
}

export interface PosOrderRequest {
  store: Store;
  user?: EssenceUser;
  lines: PosOrderLine[];
  paymentMethod: PaymentMethodType;
  country: CountryCode;
}

export interface PosOrderResult {
  subtotal: number;
  vatAmount: number;
  total: number;
  currency: CurrencyCode;
  loyaltyPointsEarned: number;
  tierMultiplier: number;
  flavorBoost: number;
}

export function calculatePosOrder(req: PosOrderRequest): PosOrderResult {
  const region = REGION_PROFILES.find((r) => r.country === req.country);
  if (!region) {
    throw new Error("Missing region profile");
  }
  
  let subtotal = 0;
  const flavorsUsed: Flavor[] = [];
  
  for (const line of req.lines) {
    const flavor = FLAVOR_LIBRARY_2026.find(
      (f) => f.internalCode === line.flavorCode
    );
    if (!flavor) continue;
    flavorsUsed.push(flavor);
    subtotal += flavor.pricePerUnitGram * line.grams;
  }
  
  const vatAmount = subtotal * region.vatRate;
  const total = subtotal + vatAmount;
  const userTier = req.user?.loyaltyTier || "STANDARD";
  const totalGrams = req.lines.reduce((acc, l) => acc + l.grams, 0);
  
  const loyaltyCalc = calculateLoyaltyPointsForOrder({
    userTier,
    totalGrams,
    flavors: flavorsUsed,
  });
  
  return {
    subtotal,
    vatAmount,
    total,
    currency: region.currency,
    loyaltyPointsEarned: loyaltyCalc.finalPoints,
    tierMultiplier: loyaltyCalc.multiplier,
    flavorBoost: loyaltyCalc.flavorBoost,
  };
}

/* ============================
   FRANCHISE ROYALTY ENGINE (Block 7)
   ============================ */

export interface RoyaltyCalculation {
  franchiseId: string;
  periodStart: string;
  periodEnd: string;
  grossRevenue: number;
  royaltyPercent: number;
  royaltyAmount: number;
  marketingPercent: number;
  marketingFee: number;
  technologyFeePercent: number;
  technologyFee: number;
  totalDue: number;
  currency: CurrencyCode;
}

export function calculateFranchiseRoyalties(
  franchise: Franchise,
  grossRevenue: number,
  currency: CurrencyCode,
  periodStart: string,
  periodEnd: string
): RoyaltyCalculation {
  const royaltyAmount = grossRevenue * (franchise.royaltyPercent / 100);
  const marketingFee = grossRevenue * (franchise.marketingPercent / 100);
  const technologyFee = grossRevenue * ((franchise.technologyFeePercent || 0) / 100);
  
  return {
    franchiseId: franchise.id,
    periodStart,
    periodEnd,
    grossRevenue,
    royaltyPercent: franchise.royaltyPercent,
    royaltyAmount,
    marketingPercent: franchise.marketingPercent,
    marketingFee,
    technologyFeePercent: franchise.technologyFeePercent || 0,
    technologyFee,
    totalDue: royaltyAmount + marketingFee + technologyFee,
    currency,
  };
}

export type FranchiseLifecycleStage = 
  | "LEAD"
  | "APPLICATION"
  | "DUE_DILIGENCE"
  | "NEGOTIATION"
  | "CONTRACT_SIGNING"
  | "SITE_SELECTION"
  | "BUILD_OUT"
  | "TRAINING"
  | "PRE_OPENING"
  | "GRAND_OPENING"
  | "OPERATIONAL"
  | "RENEWAL";

export const FRANCHISE_LIFECYCLE_STAGES: FranchiseLifecycleStage[] = [
  "LEAD",
  "APPLICATION",
  "DUE_DILIGENCE",
  "NEGOTIATION",
  "CONTRACT_SIGNING",
  "SITE_SELECTION",
  "BUILD_OUT",
  "TRAINING",
  "PRE_OPENING",
  "GRAND_OPENING",
  "OPERATIONAL",
  "RENEWAL",
];

/* ============================
   VIP INBOX CORE
   ============================ */

export function getUnreadVipMessages(
  allMessages: VipMessage[],
  userId: string
): VipMessage[] {
  return allMessages
    .filter((m) => m.userId === userId && !m.isRead)
    .sort((a, b) => {
      const priorityOrder = { CRITICAL: 0, HIGH: 1, NORMAL: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
}

/* ============================
   CHECKOUT.COM PAYMENT INTEGRATION
   ============================ */

interface CheckoutPaymentRequest {
  amount: number;
  currency: CurrencyCode;
  reference: string;
  paymentMethod: PaymentMethodType;
  storeId: string;
  userId?: string;
}

interface CheckoutPaymentResponse {
  ok: boolean;
  providerRef: string;
  status: "PENDING" | "APPROVED" | "DECLINED";
}

export async function createCheckoutComPayment(
  req: CheckoutPaymentRequest
): Promise<CheckoutPaymentResponse> {
  const secretKey = process.env.CHECKOUT_COM_SECRET_KEY;
  if (!secretKey) {
    throw new Error("Missing CHECKOUT_COM_SECRET_KEY");
  }
  
  const body = {
    amount: Math.round(req.amount * 100),
    currency: req.currency,
    reference: req.reference,
    capture: true,
  };
  
  const response = await fetch("https://api.checkout.com/payments", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  
  if (!response.ok) {
    return {
      ok: false,
      providerRef: "",
      status: "DECLINED",
    };
  }
  
  const data = await response.json();
  const statusRaw = data.approved === true ? "APPROVED" : "PENDING";
  
  return {
    ok: true,
    providerRef: data.id || "",
    status: statusRaw,
  };
}

/* ============================
   OFFLINE POS MODE (Block 8)
   3-hour transaction buffer
   ============================ */

export interface OfflineTransaction {
  id: string;
  storeId: string;
  deviceId: string;
  transactionData: PosOrderResult;
  paymentMethod: PaymentMethodType;
  capturedAt: string;
  syncStatus: "PENDING" | "SYNCING" | "SYNCED" | "FAILED";
  syncAttempts: number;
  lastSyncAttempt?: string;
}

export const OFFLINE_MODE_MAX_HOURS = 3;
export const OFFLINE_MODE_MAX_TRANSACTIONS = 500;

export function canOperateOffline(
  lastOnlineAt: Date,
  now: Date,
  transactionCount: number
): { allowed: boolean; reason?: string } {
  const hoursSinceOnline = (now.getTime() - lastOnlineAt.getTime()) / (1000 * 60 * 60);
  
  if (hoursSinceOnline > OFFLINE_MODE_MAX_HOURS) {
    return { allowed: false, reason: "EXCEEDED_OFFLINE_TIME_LIMIT" };
  }
  
  if (transactionCount >= OFFLINE_MODE_MAX_TRANSACTIONS) {
    return { allowed: false, reason: "EXCEEDED_TRANSACTION_LIMIT" };
  }
  
  return { allowed: true };
}

/* ============================
   THEFT DETECTION AI (Block 8)
   ============================ */

export interface TheftAnalysisResult {
  riskScore: number;
  patterns: string[];
  recommendation: "CLEAR" | "MONITOR" | "INVESTIGATE" | "ALERT";
}

export function analyzeTheftRisk(
  scaleWeight: number,
  chargedWeight: number,
  voidRate: number,
  freeProductRate: number
): TheftAnalysisResult {
  const patterns: string[] = [];
  let riskScore = 0;
  
  const weightVariance = Math.abs(scaleWeight - chargedWeight) / scaleWeight;
  if (weightVariance > 0.1) {
    patterns.push("WEIGHT_DISCREPANCY");
    riskScore += weightVariance * 30;
  }
  
  if (voidRate > 0.05) {
    patterns.push("HIGH_VOID_RATE");
    riskScore += voidRate * 100;
  }
  
  if (freeProductRate > 0.02) {
    patterns.push("EXCESSIVE_FREE_PRODUCTS");
    riskScore += freeProductRate * 150;
  }
  
  let recommendation: "CLEAR" | "MONITOR" | "INVESTIGATE" | "ALERT" = "CLEAR";
  if (riskScore > 50) recommendation = "ALERT";
  else if (riskScore > 30) recommendation = "INVESTIGATE";
  else if (riskScore > 15) recommendation = "MONITOR";
  
  return { riskScore: Math.min(riskScore, 100), patterns, recommendation };
}
