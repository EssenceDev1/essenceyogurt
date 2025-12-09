/**
 * ESSENCE YOGURT - MOBILE LOYALTY APP SPECIFICATION
 * 2025 Best Practices Implementation
 * 
 * Based on industry research: 85% of consumers say loyalty programs 
 * make them more likely to continue shopping with brands.
 */

/* ============================================================================
   APP OVERVIEW
   ========================================================================== */

export const AppConfig = {
  name: "Essence Yogurt",
  bundleId: {
    ios: "com.essenceyogurt.app",
    android: "com.essenceyogurt.app"
  },
  version: "1.0.0",
  minOsVersion: {
    ios: "15.0",
    android: 26 // Android 8.0+
  },
  
  supportedLanguages: [
    "en", "ar", "he", "el", "zh", "ru", "ja", "ko", "hi"
  ],
  
  primaryColor: "#B08D57", // Essence Gold
  backgroundColor: "#FFFFFF"
};

/* ============================================================================
   LOYALTY PROGRAM STRUCTURE (2025 Best Practices)
   ========================================================================== */

export const LoyaltyProgram = {
  name: "Essence Rewards",
  
  tiers: {
    ESSENCE: {
      name: "Essence",
      minPoints: 0,
      multiplier: 1.0,
      color: "#B08D57",
      benefits: [
        "Earn 5 points per $1 spent",
        "Birthday reward (free small cup)",
        "Early access to new flavors",
        "Member-only promotions"
      ]
    },
    GOLD: {
      name: "Gold",
      minPoints: 5000,
      multiplier: 1.25,
      color: "#D4AF37",
      benefits: [
        "1.25x points multiplier",
        "Free topping upgrade monthly",
        "Priority service at busy times",
        "Exclusive Gold-only flavors",
        "Store opening invites"
      ]
    },
    DIAMOND: {
      name: "Diamond",
      minPoints: 20000,
      multiplier: 1.5,
      color: "#4A90D9",
      benefits: [
        "1.5x points multiplier",
        "Free medium cup every month",
        "VIP inbox exclusive offers",
        "Private flavor previews",
        "Diamond lounge access (airports)",
        "Concierge support"
      ]
    }
  },
  
  earning: {
    pointsPerDollar: 5,
    bonusCategories: [
      { category: "Double Points Tuesday", multiplier: 2.0, dayOfWeek: 2 },
      { category: "Happy Hour (3-5pm)", multiplier: 1.5, hours: [15, 17] },
      { category: "New Location Bonus", multiplier: 3.0, duration: "first 30 days" }
    ],
    nonPurchaseEarning: [
      { action: "Refer a friend", points: 500 },
      { action: "Write a review", points: 100 },
      { action: "Share on social", points: 50 },
      { action: "Complete profile", points: 200 },
      { action: "Connect Apple/Google Wallet", points: 100 }
    ]
  },
  
  redemption: {
    rate: 100, // 100 points = $1 value
    options: [
      { name: "Free Topping", points: 250, value: 2.50 },
      { name: "Small Cup", points: 500, value: 5.00 },
      { name: "Medium Cup", points: 750, value: 7.50 },
      { name: "Large Cup", points: 1000, value: 10.00 },
      { name: "$5 E-Gift", points: 500, value: 5.00 },
      { name: "VIP Experience", points: 5000, value: "Special event access" }
    ],
    instantRedemption: true, // Apply at checkout automatically
    expirationPolicy: "Points expire after 12 months of inactivity"
  }
};

/* ============================================================================
   APP SCREENS & FEATURES
   ========================================================================== */

export const AppScreens = {
  home: {
    features: [
      "Points balance (prominent display)",
      "Tier status with progress bar",
      "Quick actions: Scan, Pay, Redeem",
      "Nearby stores with wait times",
      "Current offers carousel",
      "Recent activity feed"
    ]
  },
  
  wallet: {
    features: [
      "Digital loyalty card with QR code",
      "Apple Wallet / Google Pay integration",
      "E-Gift cards (owned)",
      "Vouchers and offers",
      "Transaction history",
      "Points breakdown by source"
    ]
  },
  
  rewards: {
    features: [
      "Available rewards catalog",
      "Points needed for each reward",
      "Tier benefits comparison",
      "Exclusive Diamond/Gold offers",
      "VIP Inbox (higher tiers)"
    ]
  },
  
  stores: {
    features: [
      "Store locator with map",
      "Store hours and details",
      "Real-time wait times",
      "Favorite store setting",
      "Directions integration",
      "Current flavor menu per location"
    ]
  },
  
  profile: {
    features: [
      "Personal information",
      "Notification preferences",
      "Language settings",
      "Allergy preferences",
      "Favorite flavors",
      "Payment methods",
      "Biometric login settings"
    ]
  },
  
  scan: {
    features: [
      "QR scanner for earning points",
      "Receipt scanner backup",
      "Camera permission handling",
      "Offline queueing"
    ]
  }
};

/* ============================================================================
   PERSONALIZATION ENGINE
   ========================================================================== */

export const PersonalizationFeatures = {
  aiRecommendations: {
    enabled: true,
    model: "Gemini",
    features: [
      "Flavor recommendations based on history",
      "Time-based suggestions (morning vs evening)",
      "Weather-based recommendations",
      "Trending flavors in your area",
      "Pairing suggestions with toppings"
    ]
  },
  
  notifications: {
    types: [
      { type: "POINTS_EARNED", description: "When points are earned" },
      { type: "TIER_UPGRADE", description: "When tier changes" },
      { type: "REWARD_AVAILABLE", description: "When new reward unlocked" },
      { type: "OFFER_EXPIRING", description: "Offer about to expire" },
      { type: "BIRTHDAY", description: "Birthday reward reminder" },
      { type: "NEARBY_STORE", description: "When near a store (opt-in)" },
      { type: "NEW_FLAVOR", description: "New flavor launch" },
      { type: "VIP_EXCLUSIVE", description: "Diamond/Gold exclusive" }
    ],
    
    preferences: {
      push: true,
      email: true,
      sms: false,
      quietHours: { start: 22, end: 8 }
    }
  },
  
  contentPersonalization: [
    "Home screen layout based on usage patterns",
    "Offer prioritization by relevance",
    "Store sorting by visit frequency",
    "Language auto-detection"
  ]
};

/* ============================================================================
   GAMIFICATION FEATURES
   ========================================================================== */

export const GamificationFeatures = {
  challenges: [
    { name: "Weekly Warrior", goal: "Visit 3 times this week", reward: 250, icon: "🏆" },
    { name: "Flavor Explorer", goal: "Try 5 different flavors", reward: 500, icon: "🍦" },
    { name: "Social Butterfly", goal: "Refer 3 friends", reward: 1000, icon: "🦋" },
    { name: "Top Tipper", goal: "Add 10 different toppings", reward: 300, icon: "⭐" }
  ],
  
  achievements: [
    { name: "First Scoop", description: "Make your first purchase", icon: "🎉" },
    { name: "Century Club", description: "Earn 100 points", icon: "💯" },
    { name: "Gold Rush", description: "Reach Gold tier", icon: "🥇" },
    { name: "Diamond Life", description: "Reach Diamond tier", icon: "💎" },
    { name: "Regular", description: "Visit 10 times", icon: "🏠" },
    { name: "Ambassador", description: "Refer 10 friends", icon: "👑" }
  ],
  
  streaks: {
    enabled: true,
    rewards: [
      { days: 3, bonus: 100 },
      { days: 7, bonus: 300 },
      { days: 14, bonus: 700 },
      { days: 30, bonus: 2000 }
    ]
  },
  
  leaderboards: {
    enabled: true,
    categories: ["Weekly Points", "Monthly Visits", "Referrals"],
    rewards: "Top 10 get bonus points each week"
  }
};

/* ============================================================================
   PAYMENT & WALLET INTEGRATION
   ========================================================================== */

export const PaymentIntegration = {
  methods: [
    { type: "APPLE_PAY", enabled: true, regions: ["all"] },
    { type: "GOOGLE_PAY", enabled: true, regions: ["all"] },
    { type: "CHECKOUT_COM", enabled: true, regions: ["SA", "AE", "IL", "GR", "AU"] },
    { type: "POINTS", enabled: true, regions: ["all"] }
  ],
  
  walletFeatures: [
    "Add loyalty card to Apple/Google Wallet",
    "NFC tap to pay and earn",
    "Auto-apply rewards at checkout",
    "Split payment (partial points + card)",
    "E-Gift balance display"
  ],
  
  offlineSupport: {
    enabled: true,
    maxOfflinePoints: 1000,
    syncOnReconnect: true
  }
};

/* ============================================================================
   TECHNICAL SPECIFICATIONS
   ========================================================================== */

export const TechnicalSpec = {
  platform: "React Native",
  stateManagement: "TanStack Query + Zustand",
  
  authentication: [
    "Face ID / Touch ID",
    "Google Sign-In",
    "Apple Sign-In",
    "Email OTP",
    "WhatsApp OTP",
    "Passkey (2025)"
  ],
  
  apis: {
    loyalty: "/api/loyalty/*",
    user: "/api/users/*",
    stores: "/api/locations/*",
    rewards: "/api/rewards/*",
    notifications: "/api/notifications/*"
  },
  
  security: {
    encryption: "AES-256",
    tokenStorage: "Secure Enclave / Keystore",
    certificatePinning: true,
    biometricRequired: "for payments and redemptions"
  },
  
  analytics: {
    events: [
      "app_open",
      "screen_view",
      "points_earned",
      "points_redeemed",
      "tier_change",
      "store_visit",
      "offer_claimed",
      "referral_sent",
      "payment_completed"
    ],
    provider: "Firebase Analytics + Mixpanel"
  },
  
  performance: {
    targetLaunchTime: "< 2 seconds",
    targetApiLatency: "< 500ms",
    offlineCapability: "full app access",
    cacheStrategy: "stale-while-revalidate"
  }
};

/* ============================================================================
   API ROUTES FOR MOBILE APP
   ========================================================================== */

export const MobileApiRoutes = {
  auth: {
    login: { method: "POST", path: "/api/mobile/auth/login" },
    register: { method: "POST", path: "/api/mobile/auth/register" },
    biometric: { method: "POST", path: "/api/mobile/auth/biometric" },
    otp: { method: "POST", path: "/api/mobile/auth/otp" },
    refresh: { method: "POST", path: "/api/mobile/auth/refresh" }
  },
  
  loyalty: {
    balance: { method: "GET", path: "/api/mobile/loyalty/balance" },
    history: { method: "GET", path: "/api/mobile/loyalty/history" },
    earn: { method: "POST", path: "/api/mobile/loyalty/earn" },
    redeem: { method: "POST", path: "/api/mobile/loyalty/redeem" },
    tier: { method: "GET", path: "/api/mobile/loyalty/tier" }
  },
  
  rewards: {
    catalog: { method: "GET", path: "/api/mobile/rewards/catalog" },
    claim: { method: "POST", path: "/api/mobile/rewards/claim" },
    myRewards: { method: "GET", path: "/api/mobile/rewards/mine" }
  },
  
  profile: {
    get: { method: "GET", path: "/api/mobile/profile" },
    update: { method: "PUT", path: "/api/mobile/profile" },
    preferences: { method: "PUT", path: "/api/mobile/profile/preferences" },
    favorites: { method: "GET", path: "/api/mobile/profile/favorites" }
  },
  
  stores: {
    nearby: { method: "GET", path: "/api/mobile/stores/nearby" },
    details: { method: "GET", path: "/api/mobile/stores/:id" },
    flavors: { method: "GET", path: "/api/mobile/stores/:id/flavors" }
  },
  
  notifications: {
    list: { method: "GET", path: "/api/mobile/notifications" },
    read: { method: "POST", path: "/api/mobile/notifications/:id/read" },
    settings: { method: "PUT", path: "/api/mobile/notifications/settings" },
    registerPush: { method: "POST", path: "/api/mobile/notifications/register" }
  },
  
  gamification: {
    challenges: { method: "GET", path: "/api/mobile/challenges" },
    achievements: { method: "GET", path: "/api/mobile/achievements" },
    leaderboard: { method: "GET", path: "/api/mobile/leaderboard" }
  }
};

/* ============================================================================
   LAUNCH CHECKLIST
   ========================================================================== */

export const LaunchChecklist = {
  prelaunch: [
    "App Store / Play Store accounts setup",
    "Privacy policy and terms published",
    "Customer support channels ready",
    "Push notification infrastructure tested",
    "Payment integration verified in all regions",
    "Localization QA for all 9 languages"
  ],
  
  softLaunch: {
    markets: ["AU"], // Start with Australia
    duration: "4 weeks",
    metrics: ["crash rate < 1%", "API success rate > 99%", "user retention D7 > 30%"]
  },
  
  fullLaunch: {
    markets: ["SA", "AE", "IL", "GR", "AU"],
    marketing: [
      "In-store QR code signage",
      "Receipt promotion",
      "Social media campaign",
      "Email to existing customers",
      "100 bonus points signup offer"
    ]
  }
};
