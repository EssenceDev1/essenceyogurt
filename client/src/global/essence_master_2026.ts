/* 
====================================================================
ESSENCE YOGURT™ 2026 — GLOBAL MASTER FILE
ONE FILE FOR: BACKEND + FRONTEND + POS + APP + AI + MENU + UI
Prepared for: EssenceYogurt.com
====================================================================
*/

export type FlavorTier = "Core Signature" | "Premium Limited" | "Ultra Premium" | "Zero Sugar" | "Seasonal Festival" | "Kids Line";

export interface Flavor2026 {
  internal_code: string;
  tier: FlavorTier;
  marketing_name: string;
  description: string;
  accent_color: string;
  image_prompt: string;
  priority: number;
}

export interface NavigationItem {
  id: string;
  label: string;
  link: string;
}

export const ESSENCE_2026 = {

  /* ---------------------------------------------------------------
     BRAND IDENTITY
  --------------------------------------------------------------- */
  brand: {
    name: "Essence Yogurt",
    tagline: "Luxury Self Serve Yogurt",
    rules: {
      background: "#FFFFFF",
      gold: "#C9A227",
      goldLight: "#E8D48A",
      goldDark: "#9A7B0A",
      goldGradient: "linear-gradient(135deg, #E8D48A 0%, #C9A227 25%, #9A7B0A 50%, #C9A227 75%, #E8D48A 100%)",
      text: "#000000",
      font: "SF Pro Display",
      notes: "Everything minimal, white, gold and luxurious. Cartier-style 2025 shimmer gold. No clutter."
    }
  },

  /* ---------------------------------------------------------------
     HAMBURGER MENU
  --------------------------------------------------------------- */
  navigation: {
    hamburger: {
      style: "right_slide_panel" as const,
      background: "#FFFFFF",
      icon_color: "#C9A227",
      items: [
        { id: "home", label: "Home", link: "/" },
        { id: "menu", label: "Flavors Menu", link: "/flavours" },
        { id: "toppings", label: "Toppings", link: "/flavours#toppings" },
        { id: "egift", label: "E-Gift Cards", link: "/egift" },
        { id: "loyalty", label: "Loyalty Program", link: "/loyalty" },
        { id: "locations", label: "Locations", link: "/locations" },
        { id: "franchise", label: "Franchise & Partners", link: "/franchise" },
        { id: "app", label: "Mobile App", link: "/app" },
        { id: "contact", label: "Contact", link: "/contact" }
      ] as NavigationItem[]
    }
  },

  /* ---------------------------------------------------------------
     OFFICIAL SIGNATURE FLAVOUR DATABASE (46 FLAVOURS)
     Core Signature + Premium Limited + Ultra Premium + Zero Sugar + Seasonal + Kids
  --------------------------------------------------------------- */
  flavors: [

    /* ===============================================================
       CORE SIGNATURE FLAVOURS (6)
       The main flavours - Essence Yogurt identity
    =============================================================== */

    {
      internal_code: "FLV_CORE_001",
      tier: "Core Signature" as FlavorTier,
      marketing_name: "Coconut Cloud",
      description: "Light, airy coconut swirl with tropical elegance.",
      accent_color: "#F5F5F5",
      image_prompt: "pure white coconut swirl floating cloud-like on white background with gold accent",
      priority: 1
    },
    {
      internal_code: "FLV_CORE_002",
      tier: "Core Signature" as FlavorTier,
      marketing_name: "Pure Mango",
      description: "Sun-ripened mango, vibrant and naturally sweet.",
      accent_color: "#FFB347",
      image_prompt: "golden mango swirl tropical sunshine on pure white luxury background",
      priority: 1
    },
    {
      internal_code: "FLV_CORE_003",
      tier: "Core Signature" as FlavorTier,
      marketing_name: "Açai Dream",
      description: "Deep Amazonian açai with antioxidant richness.",
      accent_color: "#4B0082",
      image_prompt: "deep purple acai swirl glossy dreamy on white background gold rim",
      priority: 1
    },
    {
      internal_code: "FLV_CORE_004",
      tier: "Core Signature" as FlavorTier,
      marketing_name: "Vanilla Silk",
      description: "Smooth Madagascar vanilla, silky and timeless.",
      accent_color: "#F3E5AB",
      image_prompt: "creamy vanilla swirl silk texture on pure white luxury aesthetic",
      priority: 1
    },
    {
      internal_code: "FLV_CORE_005",
      tier: "Core Signature" as FlavorTier,
      marketing_name: "Berry Velvet",
      description: "Mixed berries with velvety smooth finish.",
      accent_color: "#8E4585",
      image_prompt: "berry blend swirl velvet texture purple pink on white background",
      priority: 1
    },
    {
      internal_code: "FLV_CORE_006",
      tier: "Core Signature" as FlavorTier,
      marketing_name: "Chocolate Luxe",
      description: "Premium Belgian chocolate, rich and indulgent.",
      accent_color: "#3C1414",
      image_prompt: "dark chocolate swirl luxurious glossy on white with gold dust",
      priority: 1
    },

    /* ===============================================================
       PREMIUM LIMITED EDITIONS / ROTATING (19)
       Seasonal, airport, mall, VIP and high-traffic releases
    =============================================================== */

    {
      internal_code: "FLV_PREM_007",
      tier: "Premium Limited" as FlavorTier,
      marketing_name: "Pistachio Gold",
      description: "Premium Sicilian pistachio with golden finish.",
      accent_color: "#93C572",
      image_prompt: "pistachio swirl green gold accent on pure white luxury",
      priority: 2
    },
    {
      internal_code: "FLV_PREM_008",
      tier: "Premium Limited" as FlavorTier,
      marketing_name: "Salted Caramel Silk",
      description: "Buttery caramel with Himalayan salt finish.",
      accent_color: "#C68E17",
      image_prompt: "salted caramel swirl golden silk on white background",
      priority: 2
    },
    {
      internal_code: "FLV_PREM_009",
      tier: "Premium Limited" as FlavorTier,
      marketing_name: "White Chocolate Bliss",
      description: "Creamy white chocolate pure bliss.",
      accent_color: "#FFFDD0",
      image_prompt: "white chocolate swirl creamy blissful on pure white",
      priority: 2
    },
    {
      internal_code: "FLV_PREM_010",
      tier: "Premium Limited" as FlavorTier,
      marketing_name: "Espresso Cream",
      description: "Italian espresso with smooth cream finish.",
      accent_color: "#6F4E37",
      image_prompt: "espresso swirl coffee cream on white luxury",
      priority: 2
    },
    {
      internal_code: "FLV_PREM_011",
      tier: "Premium Limited" as FlavorTier,
      marketing_name: "Matcha Royale",
      description: "Ceremonial grade Japanese matcha, earthy and refined.",
      accent_color: "#88B04B",
      image_prompt: "matcha swirl green royal on pure white background",
      priority: 2
    },
    {
      internal_code: "FLV_PREM_012",
      tier: "Premium Limited" as FlavorTier,
      marketing_name: "Honey Velvet",
      description: "Wild honey with velvety smooth texture.",
      accent_color: "#EB9605",
      image_prompt: "honey swirl golden velvet on white luxury aesthetic",
      priority: 2
    },
    {
      internal_code: "FLV_PREM_013",
      tier: "Premium Limited" as FlavorTier,
      marketing_name: "Summer Peach",
      description: "Fresh summer peach, juicy and sweet.",
      accent_color: "#FFCBA4",
      image_prompt: "peach swirl summer fresh on pure white background",
      priority: 2
    },
    {
      internal_code: "FLV_PREM_014",
      tier: "Premium Limited" as FlavorTier,
      marketing_name: "Tropical Pineapple",
      description: "Golden pineapple with tropical sweetness.",
      accent_color: "#FFD700",
      image_prompt: "pineapple swirl tropical golden on white luxury",
      priority: 2
    },
    {
      internal_code: "FLV_PREM_015",
      tier: "Premium Limited" as FlavorTier,
      marketing_name: "Raspberry Glow",
      description: "Vibrant raspberry with radiant glow.",
      accent_color: "#E30B5C",
      image_prompt: "raspberry swirl glowing pink on white background",
      priority: 2
    },
    {
      internal_code: "FLV_PREM_016",
      tier: "Premium Limited" as FlavorTier,
      marketing_name: "Blueberry Radiance",
      description: "Fresh blueberries with radiant finish.",
      accent_color: "#4F86F7",
      image_prompt: "blueberry swirl radiant blue on pure white",
      priority: 2
    },
    {
      internal_code: "FLV_PREM_017",
      tier: "Premium Limited" as FlavorTier,
      marketing_name: "Strawberry Cloud",
      description: "Light strawberry floating on clouds.",
      accent_color: "#FC5A8D",
      image_prompt: "strawberry swirl cloud-like pink on white luxury",
      priority: 2
    },
    {
      internal_code: "FLV_PREM_018",
      tier: "Premium Limited" as FlavorTier,
      marketing_name: "Lemon Zest",
      description: "Bright citrus lemon with zesty finish.",
      accent_color: "#FFF44F",
      image_prompt: "lemon swirl zesty bright on pure white background",
      priority: 2
    },
    {
      internal_code: "FLV_PREM_019",
      tier: "Premium Limited" as FlavorTier,
      marketing_name: "Passionfruit Kiss",
      description: "Exotic passionfruit with tropical kiss.",
      accent_color: "#FF6B6B",
      image_prompt: "passionfruit swirl exotic tropical on white luxury",
      priority: 2
    },
    {
      internal_code: "FLV_PREM_020",
      tier: "Premium Limited" as FlavorTier,
      marketing_name: "Banana Crème",
      description: "Smooth banana with crème finish.",
      accent_color: "#FFE135",
      image_prompt: "banana swirl creamy smooth on pure white",
      priority: 2
    },
    {
      internal_code: "FLV_PREM_021",
      tier: "Premium Limited" as FlavorTier,
      marketing_name: "Cookies & Cream Essence",
      description: "Classic cookies with cream essence.",
      accent_color: "#36454F",
      image_prompt: "cookies cream swirl black white on luxury background",
      priority: 2
    },
    {
      internal_code: "FLV_PREM_022",
      tier: "Premium Limited" as FlavorTier,
      marketing_name: "Chocolate Hazelnut Dream",
      description: "Rich chocolate with roasted hazelnut.",
      accent_color: "#5C4033",
      image_prompt: "chocolate hazelnut swirl dreamy on white background",
      priority: 2
    },
    {
      internal_code: "FLV_PREM_023",
      tier: "Premium Limited" as FlavorTier,
      marketing_name: "Almond Silk",
      description: "Smooth almond with silky texture.",
      accent_color: "#EADDCA",
      image_prompt: "almond swirl silk smooth on pure white luxury",
      priority: 2
    },
    {
      internal_code: "FLV_PREM_024",
      tier: "Premium Limited" as FlavorTier,
      marketing_name: "Dulce Essence",
      description: "Dulce de leche caramel essence.",
      accent_color: "#D2691E",
      image_prompt: "dulce caramel swirl essence on white background",
      priority: 2
    },
    {
      internal_code: "FLV_PREM_025",
      tier: "Premium Limited" as FlavorTier,
      marketing_name: "Caramel Gold Edition",
      description: "Limited edition golden caramel.",
      accent_color: "#B8860B",
      image_prompt: "caramel swirl gold edition luxury on white background gold dust",
      priority: 2
    },

    /* ===============================================================
       ULTRA PREMIUM / AIRPORT SPECIALS (9)
       Luxury flavours for premium locations and VIP lounges
    =============================================================== */

    {
      internal_code: "FLV_ULTRA_026",
      tier: "Ultra Premium" as FlavorTier,
      marketing_name: "Gold Dust Vanilla",
      description: "Premium vanilla with edible gold dust.",
      accent_color: "#FFD700",
      image_prompt: "vanilla swirl with real gold dust particles on pure white luxury",
      priority: 3
    },
    {
      internal_code: "FLV_ULTRA_027",
      tier: "Ultra Premium" as FlavorTier,
      marketing_name: "Midnight Chocolate",
      description: "Dark chocolate for the midnight hour.",
      accent_color: "#2C1810",
      image_prompt: "midnight dark chocolate swirl deep rich on white luxury",
      priority: 3
    },
    {
      internal_code: "FLV_ULTRA_028",
      tier: "Ultra Premium" as FlavorTier,
      marketing_name: "Truffle Cream",
      description: "Black truffle with cream specialty.",
      accent_color: "#3D2B1F",
      image_prompt: "truffle cream swirl specialty luxurious on white",
      priority: 3
    },
    {
      internal_code: "FLV_ULTRA_029",
      tier: "Ultra Premium" as FlavorTier,
      marketing_name: "Berry & Rose Fusion",
      description: "Mixed berries with Persian rose fusion.",
      accent_color: "#E75480",
      image_prompt: "berry rose swirl fusion elegant on pure white",
      priority: 3
    },
    {
      internal_code: "FLV_ULTRA_030",
      tier: "Ultra Premium" as FlavorTier,
      marketing_name: "Saffron Silk",
      description: "Premium Persian saffron silk.",
      accent_color: "#F4C430",
      image_prompt: "saffron swirl silk golden on white luxury background",
      priority: 3
    },
    {
      internal_code: "FLV_ULTRA_031",
      tier: "Ultra Premium" as FlavorTier,
      marketing_name: "Mandarin Essence",
      description: "Fresh mandarin citrus essence.",
      accent_color: "#FF9966",
      image_prompt: "mandarin swirl essence citrus on pure white",
      priority: 3
    },
    {
      internal_code: "FLV_ULTRA_032",
      tier: "Ultra Premium" as FlavorTier,
      marketing_name: "Pomegranate Pearl",
      description: "Ruby pomegranate with pearl finish.",
      accent_color: "#C41E3A",
      image_prompt: "pomegranate swirl pearl ruby on white luxury",
      priority: 3
    },
    {
      internal_code: "FLV_ULTRA_033",
      tier: "Ultra Premium" as FlavorTier,
      marketing_name: "Date Silk",
      description: "Medjool date with silk smooth finish.",
      accent_color: "#8B4513",
      image_prompt: "date swirl silk smooth middle eastern luxury on white",
      priority: 3
    },
    {
      internal_code: "FLV_ULTRA_034",
      tier: "Ultra Premium" as FlavorTier,
      marketing_name: "Pure Honey Essence",
      description: "Raw honey essence pure and natural.",
      accent_color: "#DAA520",
      image_prompt: "honey swirl essence pure golden on white background",
      priority: 3
    },

    /* ===============================================================
       ZERO SUGAR / HEALTH LINE (4)
       Healthier options
    =============================================================== */

    {
      internal_code: "FLV_ZERO_035",
      tier: "Zero Sugar" as FlavorTier,
      marketing_name: "Zero Sugar Vanilla",
      description: "Classic vanilla, zero sugar guilt.",
      accent_color: "#F5DEB3",
      image_prompt: "vanilla swirl clean healthy on pure white",
      priority: 4
    },
    {
      internal_code: "FLV_ZERO_036",
      tier: "Zero Sugar" as FlavorTier,
      marketing_name: "Zero Sugar Chocolate",
      description: "Rich chocolate, zero sugar indulgence.",
      accent_color: "#4A3728",
      image_prompt: "chocolate swirl healthy guilt-free on white background",
      priority: 4
    },
    {
      internal_code: "FLV_ZERO_037",
      tier: "Zero Sugar" as FlavorTier,
      marketing_name: "Zero Sugar Coconut",
      description: "Pure coconut, naturally sweetened.",
      accent_color: "#FFFAFA",
      image_prompt: "coconut swirl pure natural on white luxury",
      priority: 4
    },
    {
      internal_code: "FLV_ZERO_038",
      tier: "Zero Sugar" as FlavorTier,
      marketing_name: "Zero Sugar Berry",
      description: "Mixed berries, no added sugar.",
      accent_color: "#8B008B",
      image_prompt: "berry swirl natural healthy on pure white",
      priority: 4
    },

    /* ===============================================================
       SEASONAL FESTIVAL EDITIONS (5)
       For events, malls, airports during holidays
    =============================================================== */

    {
      internal_code: "FLV_SEASON_039",
      tier: "Seasonal Festival" as FlavorTier,
      marketing_name: "Winter Cinnamon Cream",
      description: "Warm cinnamon cream for winter.",
      accent_color: "#D2691E",
      image_prompt: "cinnamon swirl warm winter cream on white holiday",
      priority: 5
    },
    {
      internal_code: "FLV_SEASON_040",
      tier: "Seasonal Festival" as FlavorTier,
      marketing_name: "Snowflake Mint",
      description: "Cool mint with snowflake freshness.",
      accent_color: "#98FF98",
      image_prompt: "mint swirl snowflake fresh on pure white winter",
      priority: 5
    },
    {
      internal_code: "FLV_SEASON_041",
      tier: "Seasonal Festival" as FlavorTier,
      marketing_name: "Ginger Gold",
      description: "Spiced ginger with golden warmth.",
      accent_color: "#B06500",
      image_prompt: "ginger swirl gold spiced warm on white luxury",
      priority: 5
    },
    {
      internal_code: "FLV_SEASON_042",
      tier: "Seasonal Festival" as FlavorTier,
      marketing_name: "Summer Melon Essence",
      description: "Refreshing melon for summer days.",
      accent_color: "#7FFF00",
      image_prompt: "melon swirl summer fresh on pure white",
      priority: 5
    },
    {
      internal_code: "FLV_SEASON_043",
      tier: "Seasonal Festival" as FlavorTier,
      marketing_name: "Apple Silk",
      description: "Crisp apple with silk smooth finish.",
      accent_color: "#8DB600",
      image_prompt: "apple swirl silk crisp on white autumn luxury",
      priority: 5
    },

    /* ===============================================================
       KIDS LINE (3)
       Fun flavours for children with DIY toppings
    =============================================================== */

    {
      internal_code: "FLV_KIDS_044",
      tier: "Kids Line" as FlavorTier,
      marketing_name: "Rainbow Swirl",
      description: "Fun rainbow colours in every bite.",
      accent_color: "#FF69B4",
      image_prompt: "rainbow swirl colorful fun kids on white background",
      priority: 6
    },
    {
      internal_code: "FLV_KIDS_045",
      tier: "Kids Line" as FlavorTier,
      marketing_name: "Choco Crunch Blast",
      description: "Chocolate with crunchy blast fun.",
      accent_color: "#8B4513",
      image_prompt: "chocolate crunch swirl fun kids blast on white",
      priority: 6
    },
    {
      internal_code: "FLV_KIDS_046",
      tier: "Kids Line" as FlavorTier,
      marketing_name: "Strawberry Pop",
      description: "Strawberry with popping candy fun.",
      accent_color: "#FF6B81",
      image_prompt: "strawberry swirl pop fun kids on pure white",
      priority: 6
    }

  ] as Flavor2026[]

};

export default ESSENCE_2026;
