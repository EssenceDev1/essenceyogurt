/*
====================================================================
   ESSENCE YOGURT GLOBAL GOOGLE BUSINESS PROFILE TEMPLATE (2025)
   One file for developers. Use for every country and every location.
   Includes:
   1. Google Business Profile fields
   2. Global SEO metadata
   3. JSON structured data (schema)
   4. Standard operating templates
   5. Franchise fields
   6. Image requirements
   7. Hours template
   8. Developer instructions
====================================================================
*/

export const ESSENCE_GOOGLE_PROFILE = {

  businessName: "Essence Yogurt",

  tagline: "Luxury Self-Serve Frozen Yogurt",

  primaryCategory: "Frozen Yogurt Shop",

  additionalCategories: [
    "Dessert Shop",
    "Dessert Restaurant",
    "Ice Cream Shop",
    "Health Food Shop",
    "Takeaway Shop"
  ],

  shortDescription:
    "Essence Yogurt is a global luxury self-serve frozen yogurt experience offering premium organic ingredients, pure white and gold design and advanced customer technology. Customers create their own bowl, weigh and pay in a fast and elegant process. Features include digital loyalty, mobile e-gift cards and multi language support. Now expanding across the Middle East, Europe, Australia and more.",

  longDescription:
    "Essence Yogurt is a premium global soft serve brand delivering a luxury self-serve experience. Each location features pure white and gold design, organic quality yogurt bases and a world class fresh fruit and toppings bar. Customers create their own bowl, weigh at checkout and redeem loyalty points via their mobile dashboard. The brand includes AI enhanced operations, QR e-gift cards, multi language support and a modern global franchise model. Essence Yogurt is expanding across the Middle East, Europe, Australia and beyond.",

  hoursTemplate: [
    { day: "Monday", open: "10:00", close: "23:00" },
    { day: "Tuesday", open: "10:00", close: "23:00" },
    { day: "Wednesday", open: "10:00", close: "23:00" },
    { day: "Thursday", open: "10:00", close: "23:00" },
    { day: "Friday", open: "10:00", close: "23:00" },
    { day: "Saturday", open: "10:00", close: "23:00" },
    { day: "Sunday", open: "10:00", close: "23:00" }
  ],

  hours24Template: [
    { day: "Monday", open: "00:00", close: "23:59" },
    { day: "Tuesday", open: "00:00", close: "23:59" },
    { day: "Wednesday", open: "00:00", close: "23:59" },
    { day: "Thursday", open: "00:00", close: "23:59" },
    { day: "Friday", open: "00:00", close: "23:59" },
    { day: "Saturday", open: "00:00", close: "23:59" },
    { day: "Sunday", open: "00:00", close: "23:59" }
  ],

  attributes: [
    "Halal friendly",
    "Healthy options",
    "Family friendly",
    "Wheelchair accessible",
    "Cashless payments",
    "Digital loyalty program",
    "E gift card accepted",
    "Self serve concept",
    "Organic ingredients",
    "Luxury brand",
    "Premium toppings",
    "Modern design",
    "Pure white background at all times"
  ],

  website: "https://essenceyogurt.com",

  contactEmail: "support@essenceyogurt.com",

  appointmentLink: "https://essenceyogurt.com/franchise",

  menuLink: "https://essenceyogurt.com/menu",

  imageRequirements: {
    logo: {
      description: "Gold Essence Yogurt logo on pure white background",
      size: "1000x1000 minimum",
      format: "PNG or SVG"
    },
    coverImages: [
      "White and gold Essence Yogurt render with yogurt cup",
      "Fresh fruit toppings bar",
      "Self serve frozen yogurt machines",
      "Franchise global expansion banner",
      "Premium yogurt swirl photography"
    ]
  },

  franchiseDescription:
    "Essence Yogurt is expanding globally. Franchise and joint venture partnerships available across the Middle East, Europe and Australia. Contact us for premium partnership opportunities.",

  schema: {
    "@context": "https://schema.org",
    "@type": "IceCreamShop",
    "name": "Essence Yogurt",
    "image": "https://essenceyogurt.com/assets/logo.png",
    "logo": "https://essenceyogurt.com/assets/logo.png",
    "url": "https://essenceyogurt.com",
    "servesCuisine": "Frozen Yogurt",
    "paymentAccepted": ["Visa", "Mastercard", "American Express", "Apple Pay", "Google Pay"],
    "priceRange": "$$",
    "description": "Essence Yogurt is a luxury self serve frozen yogurt brand with organic ingredients, fresh toppings, premium gold and white design and advanced customer loyalty.",
  },

  seoMeta: {
    title: "Essence Yogurt - Luxury Self Serve Frozen Yogurt",
    description: "Premium global self serve frozen yogurt brand with organic ingredients and pure white and gold design. Now expanding across Middle East, Europe and Australia.",
    keywords: [
      "frozen yogurt",
      "luxury yogurt",
      "self serve dessert",
      "healthy dessert",
      "organic yogurt",
      "fresh fruit toppings",
      "Dubai yogurt",
      "Saudi yogurt",
      "Israeli yogurt",
      "Greek yogurt shop",
      "franchise frozen yogurt"
    ]
  },

  mapsSettings: {
    showPin: true,
    pinTitle: "Essence Yogurt",
    requiresPureWhiteBackground: true,
    requiredFields: [
      "exact GPS coordinates",
      "storefront photo on white background",
      "logo as profile photo",
      "hours",
      "phone number",
      "website"
    ]
  },

  verificationOptions: [
    "Phone",
    "Email",
    "Video verification",
    "Postcard if required"
  ]
};

export type EssenceGoogleProfile = typeof ESSENCE_GOOGLE_PROFILE;
