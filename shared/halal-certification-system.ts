/**
 * ESSENCE YOGURT - HALAL CERTIFICATION TRACKING SYSTEM
 * Supplier Certificate Management for Multi-Country Operations
 * 
 * Required for: Saudi Arabia, UAE
 * Recommended for: All Muslim-majority customer bases
 */

/* ============================================================================
   HALAL CERTIFICATION BODIES (Recognized)
   ========================================================================== */

export interface CertificationBody {
  code: string;
  name: string;
  country: string;
  website: string;
  recognizedBy: string[];
  notes?: string;
}

export const RecognizedCertificationBodies: CertificationBody[] = [
  // GCC Region
  {
    code: "ESMA",
    name: "Emirates Authority for Standardization & Metrology",
    country: "UAE",
    website: "https://www.esma.gov.ae",
    recognizedBy: ["UAE", "GCC", "Saudi Arabia"],
    notes: "Primary UAE certification body"
  },
  {
    code: "SFDA",
    name: "Saudi Food & Drug Authority",
    country: "Saudi Arabia",
    website: "https://www.sfda.gov.sa",
    recognizedBy: ["Saudi Arabia", "GCC"],
    notes: "Official Saudi authority"
  },
  {
    code: "GSO",
    name: "GCC Standardization Organization",
    country: "GCC",
    website: "https://www.gso.org.sa",
    recognizedBy: ["All GCC countries"],
    notes: "Regional standard"
  },
  
  // International Bodies
  {
    code: "JAKIM",
    name: "Department of Islamic Development Malaysia",
    country: "Malaysia",
    website: "https://www.halal.gov.my",
    recognizedBy: ["UAE", "Saudi Arabia", "Global"],
    notes: "Gold standard internationally"
  },
  {
    code: "MUI",
    name: "Majelis Ulama Indonesia",
    country: "Indonesia",
    website: "https://www.halalmui.org",
    recognizedBy: ["UAE", "Saudi Arabia", "Global"]
  },
  {
    code: "IFANCA",
    name: "Islamic Food and Nutrition Council of America",
    country: "USA",
    website: "https://www.ifanca.org",
    recognizedBy: ["UAE", "Saudi Arabia", "USA", "Global"]
  },
  {
    code: "ISNA",
    name: "Islamic Society of North America",
    country: "USA/Canada",
    website: "https://www.isna.net",
    recognizedBy: ["UAE", "Saudi Arabia", "North America"]
  },
  {
    code: "HFA",
    name: "Halal Food Authority",
    country: "UK",
    website: "https://www.halalfoodauthority.com",
    recognizedBy: ["UAE", "UK", "Europe"]
  },
  {
    code: "ICCV",
    name: "Islamic Coordinating Council of Victoria",
    country: "Australia",
    website: "https://www.iccv.com.au",
    recognizedBy: ["Australia", "UAE", "Saudi Arabia"],
    notes: "Primary Australian certifier"
  }
];

/* ============================================================================
   PRODUCT CATEGORIES REQUIRING HALAL CERTIFICATION
   ========================================================================== */

export const HalalRequiredCategories = {
  MANDATORY: [
    "Yogurt cultures (if animal-derived)",
    "Gelatin (must be bovine/fish, not pork)",
    "Emulsifiers (E-numbers from animal sources)",
    "Flavoring compounds (alcohol-based extraction)",
    "Colorings (carmine/cochineal E120 prohibited)"
  ],
  
  RECOMMENDED: [
    "Fruit purees",
    "Chocolate/cocoa products",
    "Nut butters and pastes",
    "Dairy ingredients",
    "Sweeteners"
  ],
  
  NOT_REQUIRED: [
    "Fresh fruits",
    "Pure water",
    "Pure sugar",
    "Salt",
    "Most spices (pure form)"
  ]
};

/* ============================================================================
   CERTIFICATE VALIDATION RULES
   ========================================================================== */

export const ValidationRules = {
  expiryAlerts: {
    first: 90, // days before expiry
    second: 60,
    third: 30,
    critical: 7
  },
  
  requiredFields: [
    "certificateNumber",
    "issuingBody",
    "issueDate",
    "expiryDate",
    "productCategories",
    "supplierName"
  ],
  
  verificationSteps: [
    "Verify certificate number on issuing body website",
    "Confirm product scope matches supplied items",
    "Check expiry date is valid",
    "Verify supplier name matches documentation",
    "Confirm slaughter method for meat products"
  ],
  
  rejectionReasons: [
    "EXPIRED",
    "REVOKED",
    "SCOPE_MISMATCH",
    "UNRECOGNIZED_BODY",
    "FRAUDULENT",
    "INCOMPLETE"
  ]
};

/* ============================================================================
   COUNTRY-SPECIFIC REQUIREMENTS
   ========================================================================== */

export interface CountryHalalRequirements {
  country: string;
  mandatory: boolean;
  acceptedBodies: string[];
  additionalRequirements: string[];
  importDocumentation: string[];
}

export const CountryRequirements: CountryHalalRequirements[] = [
  {
    country: "SA",
    mandatory: true,
    acceptedBodies: ["SFDA", "JAKIM", "MUI", "IFANCA", "ISNA", "GSO"],
    additionalRequirements: [
      "Certificate must be in Arabic or English",
      "Slaughter certificate required for meat",
      "SFDA product registration"
    ],
    importDocumentation: [
      "Halal slaughter certificate",
      "Health certificate",
      "Certificate of origin",
      "Commercial invoice with halal statement"
    ]
  },
  {
    country: "AE",
    mandatory: true,
    acceptedBodies: ["ESMA", "JAKIM", "MUI", "IFANCA", "HFA", "GSO"],
    additionalRequirements: [
      "ESMA approval for all food products",
      "Dubai Municipality registration",
      "Arabic labeling required"
    ],
    importDocumentation: [
      "Halal certificate",
      "Health certificate",
      "Free sale certificate",
      "Ingredient list with halal status"
    ]
  },
  {
    country: "IL",
    mandatory: false, // Kosher is the requirement
    acceptedBodies: [], // Use Kosher certification instead
    additionalRequirements: [
      "Kosher certification (Badatz, OU, OK) equivalent",
      "Separate Kosher and Halal supply chains if needed"
    ],
    importDocumentation: [
      "Kosher certificate",
      "Health certificate"
    ]
  },
  {
    country: "GR",
    mandatory: false,
    acceptedBodies: ["ESMA", "JAKIM", "HFA"],
    additionalRequirements: [
      "EU food safety compliance primary",
      "Halal certification for Muslim tourist market"
    ],
    importDocumentation: [
      "EU health certificate",
      "Halal certificate (optional)"
    ]
  },
  {
    country: "AU",
    mandatory: false,
    acceptedBodies: ["ICCV", "AFIC", "SICHMA", "JAKIM"],
    additionalRequirements: [
      "AQIS import requirements",
      "FSANZ compliance",
      "Halal for halal-labeled products"
    ],
    importDocumentation: [
      "Import permit",
      "Halal certificate (if claimed)",
      "Health certificate"
    ]
  }
];

/* ============================================================================
   ESSENCE YOGURT INGREDIENT HALAL STATUS
   ========================================================================== */

export const EssenceIngredientHalalStatus = {
  CERTIFIED_HALAL: [
    { ingredient: "Yogurt base", supplier: "Dairy Corp", certBody: "IFANCA", expiry: "2025-06-30" },
    { ingredient: "Vanilla extract", supplier: "FlavorTech", certBody: "JAKIM", expiry: "2025-08-15" },
    { ingredient: "Chocolate chips", supplier: "ChocoWorld", certBody: "MUI", expiry: "2025-09-20" },
    { ingredient: "Strawberry puree", supplier: "FruitCo", certBody: "ESMA", expiry: "2025-07-10" }
  ],
  
  INHERENTLY_HALAL: [
    "Fresh strawberries",
    "Fresh blueberries",
    "Granola (verified no alcohol)",
    "Honey (pure)",
    "Nuts (raw, unflavored)"
  ],
  
  REQUIRES_VERIFICATION: [
    "Cookie crumbles (check for lard)",
    "Caramel sauce (check for gelatin)",
    "Gummy bears (often pork gelatin)",
    "Marshmallows (check gelatin source)"
  ],
  
  NOT_PERMITTED: [
    "Pork gelatin products",
    "Alcohol-containing items",
    "Carmine/cochineal colorings",
    "Non-halal animal-derived emulsifiers"
  ]
};

/* ============================================================================
   API ROUTES
   ========================================================================== */

export const HalalApiRoutes = {
  certificates: {
    create: { method: "POST", path: "/api/halal/certificates" },
    list: { method: "GET", path: "/api/halal/certificates" },
    get: { method: "GET", path: "/api/halal/certificates/:id" },
    update: { method: "PUT", path: "/api/halal/certificates/:id" },
    verify: { method: "POST", path: "/api/halal/certificates/:id/verify" },
    expire: { method: "POST", path: "/api/halal/certificates/:id/expire" }
  },
  
  suppliers: {
    checkCompliance: { method: "GET", path: "/api/halal/suppliers/:id/compliance" },
    listCertificates: { method: "GET", path: "/api/halal/suppliers/:id/certificates" }
  },
  
  alerts: {
    expiring: { method: "GET", path: "/api/halal/alerts/expiring" },
    missing: { method: "GET", path: "/api/halal/alerts/missing" }
  },
  
  reports: {
    compliance: { method: "GET", path: "/api/halal/reports/compliance" },
    byCountry: { method: "GET", path: "/api/halal/reports/by-country/:country" }
  }
};

/* ============================================================================
   COMPLIANCE DASHBOARD METRICS
   ========================================================================== */

export const ComplianceMetrics = {
  kpis: [
    { name: "Total Active Certificates", key: "totalActive" },
    { name: "Expiring in 30 Days", key: "expiringIn30", alert: true },
    { name: "Expired Certificates", key: "expired", critical: true },
    { name: "Verification Pending", key: "pendingVerification" },
    { name: "Coverage by Country", key: "countryCompliance" }
  ],
  
  statusColors: {
    valid: "#00AA66",
    expiringSoon: "#FF9900",
    expired: "#CC0000",
    pending: "#6666AA"
  }
};
