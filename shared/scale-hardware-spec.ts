/**
 * ESSENCE YOGURT - DIGITAL SCALE HARDWARE SPECIFICATION
 * NTEP-Certified Scales for Self-Serve Frozen Yogurt POS
 * 
 * Legal Requirements: NTEP certification required for weight-based pricing
 * Tare function mandatory (auto-deduct cup weight)
 */

/* ============================================================================
   APPROVED SCALE MODELS
   ========================================================================== */

export interface ScaleModel {
  manufacturer: string;
  model: string;
  description: string;
  ntepCertified: boolean;
  ntepNumber?: string;
  maxCapacity: number; // grams
  division: number; // readability in grams
  features: string[];
  connectionTypes: string[];
  priceRange: string;
  recommended: boolean;
  notes?: string;
}

export const ApprovedScaleModels: ScaleModel[] = [
  {
    manufacturer: "Avery Berkel",
    model: "6712",
    description: "Industry standard for frozen yogurt shops",
    ntepCertified: true,
    ntepNumber: "02-058",
    maxCapacity: 15000, // 15 kg
    division: 1, // 1 gram
    features: [
      "Dual display (operator + customer)",
      "Built-in tare function",
      "Price computing",
      "Stainless steel platter",
      "IP65 rated (spill-proof)",
      "Quick stabilization"
    ],
    connectionTypes: ["RS-232", "USB", "Ethernet"],
    priceRange: "$500 - $800",
    recommended: true,
    notes: "Most widely used in froyo industry. Excellent reliability."
  },
  {
    manufacturer: "CAS",
    model: "S2000 Jr",
    description: "Budget-friendly price computing scale",
    ntepCertified: true,
    ntepNumber: "10-056",
    maxCapacity: 6800, // 15 lbs / 6.8 kg
    division: 2, // 2 grams
    features: [
      "Dual display",
      "Price per unit computing",
      "Tare function",
      "AC/DC operation",
      "Compact design"
    ],
    connectionTypes: ["RS-232"],
    priceRange: "$199 - $374",
    recommended: true,
    notes: "Great value. Popular for smaller locations."
  },
  {
    manufacturer: "Star Micronics",
    model: "mG-S8200",
    description: "Modern multi-interface scale",
    ntepCertified: true,
    ntepNumber: "15-023",
    maxCapacity: 8200, // 8.2 kg
    division: 1,
    features: [
      "Bluetooth connectivity",
      "USB interface",
      "iOS/Android compatible",
      "Compact form factor",
      "Modern design"
    ],
    connectionTypes: ["Bluetooth", "USB", "Serial"],
    priceRange: "$300 - $450",
    recommended: true,
    notes: "Best for tablet-based POS systems."
  },
  {
    manufacturer: "Rice Lake",
    model: "RS-130",
    description: "Heavy-duty price computing scale",
    ntepCertified: true,
    ntepNumber: "08-091",
    maxCapacity: 15000,
    division: 2,
    features: [
      "Tower display",
      "Large platter",
      "Memory for 99 PLUs",
      "Heavy-duty construction",
      "Battery backup"
    ],
    connectionTypes: ["RS-232", "USB"],
    priceRange: "$400 - $600",
    recommended: false,
    notes: "Good for high-volume locations."
  },
  {
    manufacturer: "Brecknell",
    model: "PC3060",
    description: "Entry-level price computing scale",
    ntepCertified: true,
    ntepNumber: "05-112",
    maxCapacity: 30000, // 30 kg
    division: 5,
    features: [
      "60 lb capacity",
      "Dual display",
      "AC adapter included",
      "Budget friendly"
    ],
    connectionTypes: ["RS-232"],
    priceRange: "$150 - $250",
    recommended: false,
    notes: "Basic functionality. Good for backup."
  }
];

/* ============================================================================
   CUP TARE WEIGHTS (Pre-configured)
   ========================================================================== */

export const CupTareWeights = {
  SMALL_PLASTIC: { weight: 15, unit: "g", description: "8 oz plastic cup" },
  MEDIUM_PLASTIC: { weight: 22, unit: "g", description: "12 oz plastic cup" },
  LARGE_PLASTIC: { weight: 32, unit: "g", description: "16 oz plastic cup" },
  
  SMALL_CARDBOARD: { weight: 18, unit: "g", description: "8 oz cardboard cup" },
  MEDIUM_CARDBOARD: { weight: 26, unit: "g", description: "12 oz cardboard cup" },
  LARGE_CARDBOARD: { weight: 38, unit: "g", description: "16 oz cardboard cup" },
  
  CONE_WAFFLE: { weight: 25, unit: "g", description: "Waffle cone" },
  CONE_SUGAR: { weight: 12, unit: "g", description: "Sugar cone" },
  
  LID_PLASTIC: { weight: 5, unit: "g", description: "Plastic dome lid" },
  SPOON_PLASTIC: { weight: 3, unit: "g", description: "Plastic spoon" }
};

/* ============================================================================
   REGIONAL CONFIGURATIONS
   ========================================================================== */

export interface RegionalScaleConfig {
  country: string;
  currency: string;
  pricePerKg: number;
  displayUnit: "grams" | "ounces";
  requiresCertification: string;
  tareLegallyRequired: boolean;
}

export const RegionalConfigs: RegionalScaleConfig[] = [
  {
    country: "SA",
    currency: "SAR",
    pricePerKg: 185,
    displayUnit: "grams",
    requiresCertification: "SASO",
    tareLegallyRequired: true
  },
  {
    country: "AE",
    currency: "AED",
    pricePerKg: 180,
    displayUnit: "grams",
    requiresCertification: "ESMA",
    tareLegallyRequired: true
  },
  {
    country: "GR",
    currency: "EUR",
    pricePerKg: 45,
    displayUnit: "grams",
    requiresCertification: "CE/MID",
    tareLegallyRequired: true
  },
  {
    country: "IL",
    currency: "ILS",
    pricePerKg: 160,
    displayUnit: "grams",
    requiresCertification: "SII",
    tareLegallyRequired: true
  },
  {
    country: "AU",
    currency: "AUD",
    pricePerKg: 50,
    displayUnit: "grams",
    requiresCertification: "NMI",
    tareLegallyRequired: true
  }
];

/* ============================================================================
   CALIBRATION SCHEDULE
   ========================================================================== */

export const CalibrationRequirements = {
  frequency: "Every 6 months minimum",
  legalRequirement: "Weights & Measures inspection required",
  
  diyCalibration: {
    toolCost: "$129 one-time",
    process: [
      "1. Place scale on level surface",
      "2. Power on and let stabilize (2 minutes)",
      "3. Enter calibration mode (varies by model)",
      "4. Apply known test weight",
      "5. Verify readings within tolerance",
      "6. Record calibration date and results"
    ]
  },
  
  professionalCalibration: {
    costPerVisit: "$135 - $150",
    includes: [
      "Certified technician visit",
      "Full calibration test",
      "Calibration certificate",
      "Adjustment if needed"
    ]
  },
  
  testWeights: [
    { weight: 1000, unit: "g", tolerance: 0.5 },
    { weight: 5000, unit: "g", tolerance: 1.0 },
    { weight: 10000, unit: "g", tolerance: 2.0 }
  ]
};

/* ============================================================================
   POS INTEGRATION PROTOCOLS
   ========================================================================== */

export const ScaleProtocols = {
  RS232: {
    baudRate: 9600,
    dataBits: 8,
    stopBits: 1,
    parity: "none",
    flow: "none",
    commandFormat: "ASCII",
    weightCommand: "W",
    responseFormat: "SXXXX.XXkg"
  },
  
  USB: {
    driver: "FTDI or CDC-ACM",
    virtualCom: true,
    plugAndPlay: true
  },
  
  Bluetooth: {
    profile: "SPP (Serial Port Profile)",
    pairing: "PIN code or NFC tap",
    range: "10 meters typical"
  },
  
  Ethernet: {
    protocol: "TCP/IP",
    defaultPort: 5001,
    discovery: "mDNS/Bonjour"
  }
};

/* ============================================================================
   PROCUREMENT GUIDE
   ========================================================================== */

export const ProcurementGuide = {
  recommendedVendors: [
    {
      name: "1800Scales",
      website: "https://www.1800scales.com",
      specialty: "Frozen yogurt scale packages",
      notes: "Pre-configured for froyo industry"
    },
    {
      name: "Sintel Systems",
      website: "https://sintelsystems.com",
      specialty: "Complete POS + Scale turnkey packages",
      notes: "Includes software and support"
    },
    {
      name: "SunrisePOS",
      website: "https://www.sunrisepos.com",
      specialty: "Self-serve frozen yogurt systems",
      notes: "Custom programming included"
    }
  ],
  
  budgetByTier: {
    basic: {
      description: "Single location startup",
      scaleOnly: "$200 - $400",
      withPOS: "$2,500 - $3,500",
      includes: ["Scale", "Basic POS terminal", "Receipt printer", "Cash drawer"]
    },
    standard: {
      description: "Established location",
      scaleOnly: "$500 - $800",
      withPOS: "$4,000 - $5,000",
      includes: ["Avery Berkel scale", "All-in-one POS", "Dual displays", "Card reader", "Printer"]
    },
    enterprise: {
      description: "Multi-location franchise",
      scaleOnly: "$600 - $900",
      withPOS: "$6,000 - $8,000",
      includes: ["Premium scale", "Franpos system", "Cloud management", "Video integration", "Marketing automation"]
    }
  },
  
  leadTime: "1-2 weeks for pre-configured systems",
  warranty: "Typically 3 years on hardware",
  support: "Most vendors offer 24/7 phone support"
};

/* ============================================================================
   MAINTENANCE CHECKLIST
   ========================================================================== */

export const MaintenanceChecklist = {
  daily: [
    "Clean platter surface with food-safe cleaner",
    "Check zero calibration (empty platter should read 0)",
    "Verify tare function works correctly",
    "Test with known weight (cup of water = ~236g per cup)"
  ],
  
  weekly: [
    "Full cleaning including underside of platter",
    "Check all cable connections",
    "Verify dual display sync",
    "Test all cup tare presets"
  ],
  
  monthly: [
    "Calibration verification with certified test weight",
    "Check for firmware updates",
    "Inspect power adapter and cables",
    "Review error logs if available"
  ],
  
  biannual: [
    "Professional calibration and certification",
    "Full hardware inspection",
    "Software/firmware updates",
    "Replace protective covers if worn"
  ]
};
