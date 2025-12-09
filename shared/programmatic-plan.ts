/*
====================================================================
   ESSENCE YOGURT PROGRAMMATIC ADVERTISING + TECH ECOSYSTEM (2026)
   GLOBAL EXPANSION SYSTEM FOR SAUDI, UAE, ISRAEL, GREECE, AUSTRALIA
   ONE FILE FOR:
   - MARKETING TEAM
   - DEVELOPMENT TEAM
   - FRANCHISE TEAM
   - AI AUTOMATION TEAM
   - OPERATIONS TEAM
====================================================================
*/

export const EssenceProgrammaticPlan = {

  brandPositioning: `
    Essence Yogurt is a luxury white and gold self serve frozen yogurt
    brand offering organic quality ingredients and premium experience.
    Programmatic advertising is used exclusively for:
    - Franchise expansion
    - Airport approval
    - Mall authority interest
    - Investor awareness
    - Luxury brand positioning
  `,

  programmaticPurpose: [
    "Lead generation for franchise partners",
    "Awareness for mall and airport management teams",
    "Premium brand building across GCC, EU, AU",
    "Investor outreach",
    "Store opening announcements"
  ],

  programmaticPlatforms: {
    dv360: `
      Google DV360 is used to run premium display, video, connected TV
      and mobile placements. Multi language, multi device, multi country.
    `,
    linkedinAds: `
      For targeting corporate decision makers, mall owners, airport
      procurement teams, investment groups.
    `,
    metaAds: `
      Not for franchise buyers but for grand openings and awareness.
    `,
    premiumNetworks: [
      "Gulf News",
      "Khaleej Times",
      "Arabian Business",
      "Bloomberg Middle East",
      "Globes Israel",
      "Kathimerini Greece",
      "Australian Financial Review"
    ]
  },

  targetingMatrix: {
    saudiArabia: {
      regions: ["Riyadh", "Jeddah", "Dammam"],
      audiences: [
        "Airport management",
        "Mall leasing teams",
        "Hospitality investors",
        "F&B franchise buyers",
        "High income households"
      ],
      languages: ["English", "Arabic"]
    },

    uae: {
      regions: ["Dubai", "Abu Dhabi"],
      audiences: [
        "Retail developers",
        "Mall leasing managers",
        "Tourism boards",
        "Airport management",
        "Franchise investors"
      ],
      languages: ["English", "Arabic"]
    },

    israel: {
      regions: ["Tel Aviv", "Herzliya", "Ramat Gan", "Haifa"],
      audiences: [
        "Entrepreneurs",
        "F&B investors",
        "Food franchise groups"
      ],
      languages: ["English", "Hebrew"]
    },

    greece: {
      regions: ["Athens", "Mykonos", "Santorini"],
      audiences: [
        "Hospitality groups",
        "Mall operators",
        "Retail franchise owners"
      ],
      languages: ["English", "Greek"]
    },

    australia: {
      regions: ["Sydney", "Melbourne", "Brisbane", "Gold Coast"],
      audiences: [
        "F&B investors",
        "Shopping center developers",
        "Franchise buyers"
      ],
      languages: ["English"]
    }
  },

  creativeRequirements: {
    background: "Pure white only",
    logo: "Gold Essence Yogurt logo centered",
    animationsAllowed: true,
    formats: [
      "1920x1080",
      "1080x1080",
      "1080x1920",
      "300x250",
      "728x90",
      "1200x628"
    ],
    messages: [
      "Essence Yogurt now expanding globally",
      "Luxury self serve frozen yogurt",
      "Premium franchise opportunities available",
      "Now launching in Middle East and Europe"
    ]
  },

  aiAutomation: {
    tasks: [
      "Analyze campaign data",
      "Optimize media spend",
      "Score franchise leads",
      "Recommend landing page improvements",
      "Auto respond to high tier inquiries",
      "Schedule meetings",
      "Route leads by country",
      "Check compliance by region"
    ],

    routingRules: {
      "Saudi Arabia": "Saudi operations team",
      "UAE": "Dubai operations team",
      "Israel": "IL franchise desk",
      "Greece": "EU expansion desk",
      "Australia": "AU franchise desk"
    }
  },

  franchiseFunnelStages: [
    "Stage 1 - Awareness via programmatic",
    "Stage 2 - Visit to franchise landing page",
    "Stage 3 - Lead form submission",
    "Stage 4 - Auto scoring by Gemini",
    "Stage 5 - If score >= 70 -> immediate meeting invite",
    "Stage 6 - If score < 70 -> nurture sequence",
    "Stage 7 - HQ review",
    "Stage 8 - NDA signing",
    "Stage 9 - Business proposal sent",
    "Stage 10 - Partnership negotiation"
  ]
};

export type TargetCountry = keyof typeof EssenceProgrammaticPlan.targetingMatrix;

export interface FranchiseLead {
  id?: number;
  name: string;
  email: string;
  phone: string;
  country: string;
  companyName?: string;
  interestLevel: 'low' | 'medium' | 'high';
  sourceCampaign: string;
  leadScore?: number;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'closed' | 'lost';
  notes?: string;
  createdAt?: Date;
}
