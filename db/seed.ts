import { db } from "./index";
import { 
  flavors, toppings, locations, revenueShareModels, essenceUnits, creditPackages, loyaltyTiers,
  suppliers, supplyItems, employees, shiftTemplates, insurancePolicies, businessLicenses, 
  complianceTasks, customers, vipBenefits, vipEvents
} from "../shared/schema";

async function seed() {
  console.log("Seeding database...");

  // Seed Flavors
  const flavorData = [
    { name: "Classic Pure White", description: "Our signature tart original. Low fat, high protein.", type: "Signature", isActive: true, displayOrder: 1 },
    { name: "Coconut Dream", description: "Vegan coconut milk base with a hint of vanilla.", type: "Vegan", isActive: true, displayOrder: 2 },
    { name: "Dark Chocolate Noir", description: "70% Belgian cocoa blend. Rich and decadent.", type: "Indulgent", isActive: true, displayOrder: 3 },
    { name: "Alphonso Mango", description: "Made with real Indian Alphonso mango puree.", type: "Fruit", isActive: true, displayOrder: 4 },
    { name: "Sicily Pistachio", description: "Roasted pistachio paste from Bronte, Italy.", type: "Premium", isActive: true, displayOrder: 5 },
    { name: "Salted Caramel Gold", description: "Sea salt and caramel swirl.", type: "Indulgent", isActive: true, displayOrder: 6 },
  ];

  for (const flavor of flavorData) {
    await db.insert(flavors).values(flavor).onConflictDoNothing();
  }
  console.log("✓ Seeded flavors");

  // Seed Toppings
  const toppingData = [
    "Fresh Strawberries", "Blueberries", "Raspberries", "Mango Cubes", "Pomegranate",
    "Dark Chocolate Shavings", "White Chocolate Curls", "Roasted Almonds", "Pistachio Crumb",
    "Caramelized Biscuit Crumble", "Cookies & Cream Crumble", "Gold Leaf (Premium)", "Warm Hazelnut Chocolate", "Warm Pistachio Sauce"
  ];

  for (let i = 0; i < toppingData.length; i++) {
    await db.insert(toppings).values({ name: toppingData[i], isActive: true, displayOrder: i + 1 }).onConflictDoNothing();
  }
  console.log("✓ Seeded toppings");

  // Seed Locations
  const locationData = [
    { city: "Riyadh", country: "Saudi Arabia", venue: "King Khalid International Airport", detail: "Terminal 5, Departures Lounge", status: "Open Now", isActive: true, displayOrder: 1 },
    { city: "Dubai", country: "UAE", venue: "Dubai Mall", detail: "Fashion Avenue, Level 1", status: "Coming Soon (Q3 2025)", isActive: true, displayOrder: 2 },
    { city: "London", country: "UK", venue: "Heathrow Airport", detail: "Terminal 2, The Queen's Terminal", status: "Planning Phase", isActive: true, displayOrder: 3 },
    { city: "Sydney", country: "Australia", venue: "Westfield Bondi Junction", detail: "Luxury Precinct", status: "Franchise Partner Selected", isActive: true, displayOrder: 4 }
  ];

  for (const location of locationData) {
    await db.insert(locations).values(location).onConflictDoNothing();
  }
  console.log("✓ Seeded locations");

  // Seed Revenue Share Models
  const rsModels = [
    {
      name: "Airport Authority JV",
      description: "Joint venture with airport authority - 60/40 split",
      shareToEssencePercent: "60",
      shareToPartnerPercent: "40",
      partnerName: "Saudi Airport Authority",
      contractStart: new Date("2025-01-01"),
      contractEnd: new Date("2027-12-31"),
      autoRenew: true
    }
  ];

  for (const model of rsModels) {
    await db.insert(revenueShareModels).values(model).onConflictDoNothing();
  }
  console.log("✓ Seeded revenue share models");

  // Seed Essence Units
  const units = [
    {
      code: "EY-RIY-APT-T5-01",
      name: "Essence Yogurt - Riyadh T5",
      country: "SA",
      city: "Riyadh",
      locationType: "AIRPORT",
      conceptType: "OPEN_SPACE_BAR",
      isActive: true,
      openingDate: new Date("2025-01-15"),
      maxCupsPerHour: 120,
      typicalFootTrafficPerDay: 800
    }
  ];

  for (const unit of units) {
    await db.insert(essenceUnits).values(unit).onConflictDoNothing();
  }
  console.log("✓ Seeded essence units");

  // Seed Credit Packages
  const packages = [
    {
      name: "3 Cups Pack",
      description: "3 cups of premium frozen yogurt",
      country: "SA",
      currency: "SAR",
      numberOfCups: 3,
      basePrice: "75",
      discountPercent: "10",
      isGiftable: true,
      isECardOnly: false,
      isPhysicalCardAvailable: true,
      canBeUsedAtEvents: true,
      canBeUsedAtAirport: true,
      canBeUsedAtMall: true
    },
    {
      name: "10 Cups Luxury Pass",
      description: "10 cups luxury pass with unlimited toppings",
      country: "SA",
      currency: "SAR",
      numberOfCups: 10,
      basePrice: "200",
      discountPercent: "25",
      isGiftable: true,
      isECardOnly: false,
      isPhysicalCardAvailable: true,
      canBeUsedAtEvents: true,
      canBeUsedAtAirport: true,
      canBeUsedAtMall: true
    }
  ];

  for (const pkg of packages) {
    await db.insert(creditPackages).values(pkg).onConflictDoNothing();
  }
  console.log("✓ Seeded credit packages");

  // Seed Loyalty Tiers
  const tiers = [
    {
      name: "Essence White",
      requiredPoints: 0,
      perksDescription: "Welcome to Essence - enjoy member discounts",
      freeCupsPerYear: 0,
      freeToppingUpgrades: 0
    },
    {
      name: "Essence Gold",
      requiredPoints: 500,
      perksDescription: "Exclusive VIP status - priority service and special offers",
      freeCupsPerYear: 2,
      freeToppingUpgrades: 10
    },
    {
      name: "Essence Platinum",
      requiredPoints: 1500,
      perksDescription: "Legendary status - unlimited perks and concierge service",
      freeCupsPerYear: 12,
      freeToppingUpgrades: 24,
      birthdayGiftValue: "500"
    }
  ];

  for (const tier of tiers) {
    await db.insert(loyaltyTiers).values(tier).onConflictDoNothing();
  }
  console.log("✓ Seeded loyalty tiers");

  // =====================================================
  // BUSINESS OPERATIONS SEED DATA
  // =====================================================

  // Seed Suppliers
  const supplierData = [
    {
      name: "FreshFruit International",
      type: "fruit",
      tier: "premium",
      contactName: "Maria Santos",
      contactEmail: "maria@freshfruit.com",
      contactPhone: "+1 305 555 0101",
      country: "USA",
      city: "Miami",
      paymentTermsDays: 30,
      currency: "USD",
      isActive: true
    },
    {
      name: "Haribo Germany GmbH",
      type: "candy",
      tier: "preferred",
      contactName: "Hans Mueller",
      contactEmail: "hans@haribo.de",
      contactPhone: "+49 228 555 0202",
      country: "Germany",
      city: "Bonn",
      paymentTermsDays: 45,
      currency: "EUR",
      isActive: true
    },
    {
      name: "Belgian Chocolate Masters",
      type: "chocolate",
      tier: "premium",
      contactName: "Pierre Dubois",
      contactEmail: "pierre@belgchoc.be",
      contactPhone: "+32 2 555 0303",
      country: "Belgium",
      city: "Brussels",
      paymentTermsDays: 30,
      currency: "EUR",
      isActive: true
    },
    {
      name: "Açaí Amazon Co",
      type: "acai",
      tier: "premium",
      contactName: "Carlos Silva",
      contactEmail: "carlos@acaiamazon.br",
      contactPhone: "+55 11 555 0404",
      country: "Brazil",
      city: "São Paulo",
      paymentTermsDays: 60,
      currency: "USD",
      isActive: true
    },
    {
      name: "EcoPack Solutions",
      type: "cups",
      tier: "standard",
      contactName: "Sarah Green",
      contactEmail: "sarah@ecopack.com",
      contactPhone: "+1 212 555 0505",
      country: "USA",
      city: "New York",
      paymentTermsDays: 30,
      currency: "USD",
      isActive: true
    },
    {
      name: "CleanPro International",
      type: "cleaning",
      tier: "standard",
      contactName: "James White",
      contactEmail: "james@cleanpro.com",
      contactPhone: "+44 20 555 0606",
      country: "UK",
      city: "London",
      paymentTermsDays: 30,
      currency: "GBP",
      isActive: true
    }
  ];

  for (const supplier of supplierData) {
    await db.insert(suppliers).values(supplier).onConflictDoNothing();
  }
  console.log("✓ Seeded suppliers");

  // Seed Employees
  const employeeData = [
    {
      employeeCode: "EMP-001",
      fullName: "Ahmed Al-Rashid",
      email: "ahmed@essenceyogurt.com",
      phone: "+966 50 555 0101",
      country: "Saudi Arabia",
      city: "Riyadh",
      role: "manager",
      hourlyRate: "75",
      currency: "SAR",
      employmentType: "full_time",
      hireDate: new Date("2024-01-15"),
      isActive: true
    },
    {
      employeeCode: "EMP-002",
      fullName: "Fatima Hassan",
      email: "fatima@essenceyogurt.com",
      phone: "+966 50 555 0102",
      country: "Saudi Arabia",
      city: "Riyadh",
      role: "supervisor",
      hourlyRate: "55",
      currency: "SAR",
      employmentType: "full_time",
      hireDate: new Date("2024-02-01"),
      isActive: true
    },
    {
      employeeCode: "EMP-003",
      fullName: "Omar Khalil",
      email: "omar@essenceyogurt.com",
      phone: "+966 50 555 0103",
      country: "Saudi Arabia",
      city: "Riyadh",
      role: "barista",
      hourlyRate: "40",
      currency: "SAR",
      employmentType: "full_time",
      hireDate: new Date("2024-03-01"),
      isActive: true
    },
    {
      employeeCode: "EMP-004",
      fullName: "Layla Mohammed",
      email: "layla@essenceyogurt.com",
      phone: "+966 50 555 0104",
      country: "Saudi Arabia",
      city: "Riyadh",
      role: "barista",
      hourlyRate: "40",
      currency: "SAR",
      employmentType: "part_time",
      hireDate: new Date("2024-04-15"),
      isActive: true
    },
    {
      employeeCode: "EMP-005",
      fullName: "Yusuf Ahmad",
      email: "yusuf@essenceyogurt.com",
      phone: "+966 50 555 0105",
      country: "Saudi Arabia",
      city: "Riyadh",
      role: "barista",
      hourlyRate: "40",
      currency: "SAR",
      employmentType: "full_time",
      hireDate: new Date("2024-05-01"),
      isActive: true
    }
  ];

  for (const emp of employeeData) {
    await db.insert(employees).values(emp).onConflictDoNothing();
  }
  console.log("✓ Seeded employees");

  // Seed Insurance Policies
  const insuranceData = [
    {
      policyNumber: "INS-2024-001",
      type: "liability",
      provider: "Allianz Insurance",
      coverageAmount: "5000000",
      premium: "15000",
      currency: "USD",
      startDate: new Date("2024-01-01"),
      endDate: new Date("2025-12-31"),
      renewalReminderDays: 60,
      status: "active"
    },
    {
      policyNumber: "INS-2024-002",
      type: "property",
      provider: "AXA Insurance",
      coverageAmount: "2000000",
      premium: "8000",
      currency: "USD",
      startDate: new Date("2024-01-01"),
      endDate: new Date("2025-12-31"),
      renewalReminderDays: 60,
      status: "active"
    },
    {
      policyNumber: "INS-2024-003",
      type: "workers_comp",
      provider: "MetLife",
      coverageAmount: "1000000",
      premium: "5000",
      currency: "USD",
      startDate: new Date("2024-01-01"),
      endDate: new Date("2025-06-30"),
      renewalReminderDays: 90,
      status: "pending_renewal"
    }
  ];

  for (const insurance of insuranceData) {
    await db.insert(insurancePolicies).values(insurance).onConflictDoNothing();
  }
  console.log("✓ Seeded insurance policies");

  // Seed Business Licenses
  const licenseData = [
    {
      licenseNumber: "LIC-SA-2024-001",
      type: "food_service",
      issuingAuthority: "Saudi Food and Drug Authority",
      country: "Saudi Arabia",
      city: "Riyadh",
      issueDate: new Date("2024-01-01"),
      expiryDate: new Date("2026-01-01"),
      renewalReminderDays: 90,
      status: "active",
      cost: "5000",
      currency: "SAR"
    },
    {
      licenseNumber: "LIC-SA-2024-002",
      type: "health",
      issuingAuthority: "Saudi Ministry of Health",
      country: "Saudi Arabia",
      city: "Riyadh",
      issueDate: new Date("2024-02-01"),
      expiryDate: new Date("2025-02-01"),
      renewalReminderDays: 60,
      status: "active",
      cost: "2000",
      currency: "SAR"
    },
    {
      licenseNumber: "LIC-SA-2024-003",
      type: "business_operation",
      issuingAuthority: "Saudi General Authority for Investment",
      country: "Saudi Arabia",
      city: "Riyadh",
      issueDate: new Date("2023-12-01"),
      expiryDate: new Date("2025-12-01"),
      renewalReminderDays: 120,
      status: "active",
      cost: "10000",
      currency: "SAR"
    }
  ];

  for (const license of licenseData) {
    await db.insert(businessLicenses).values(license).onConflictDoNothing();
  }
  console.log("✓ Seeded business licenses");

  // Seed Compliance Tasks
  const complianceData = [
    {
      title: "Monthly Health & Safety Inspection",
      description: "Complete monthly H&S checklist and submit to authorities",
      category: "health_safety",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: "pending",
      priority: "high",
      recurrencePattern: "monthly"
    },
    {
      title: "Quarterly Tax Filing - Q4 2024",
      description: "Prepare and file quarterly tax returns",
      category: "financial",
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: "pending",
      priority: "critical",
      recurrencePattern: "quarterly"
    },
    {
      title: "Annual Food Handler Certification Renewal",
      description: "Renew food handler certifications for all staff",
      category: "food_safety",
      dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      status: "pending",
      priority: "medium",
      recurrencePattern: "yearly"
    },
    {
      title: "Fire Safety Equipment Check",
      description: "Inspect and maintain fire extinguishers and alarms",
      category: "health_safety",
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      status: "pending",
      priority: "high",
      recurrencePattern: "monthly"
    }
  ];

  for (const task of complianceData) {
    await db.insert(complianceTasks).values(task).onConflictDoNothing();
  }
  console.log("✓ Seeded compliance tasks");

  // Seed Sample Customers
  const customerData = [
    {
      fullName: "Alexandra Windsor",
      email: "alexandra@example.com",
      phoneCountryCode: "+44",
      phoneNumber: "7700900123",
      country: "UK",
      loyaltyPoints: 1850
    },
    {
      fullName: "Mohammed Al-Fayed",
      email: "mohammed@example.com",
      phoneCountryCode: "+966",
      phoneNumber: "500123456",
      country: "Saudi Arabia",
      loyaltyPoints: 2500
    },
    {
      fullName: "Sophie Chen",
      email: "sophie@example.com",
      phoneCountryCode: "+1",
      phoneNumber: "4155551234",
      country: "USA",
      loyaltyPoints: 750
    },
    {
      fullName: "Isabella Rossi",
      email: "isabella@example.com",
      phoneCountryCode: "+39",
      phoneNumber: "3331234567",
      country: "Italy",
      loyaltyPoints: 1200
    },
    {
      fullName: "Hiroshi Tanaka",
      email: "hiroshi@example.com",
      phoneCountryCode: "+81",
      phoneNumber: "9012345678",
      country: "Japan",
      loyaltyPoints: 500
    }
  ];

  for (const customer of customerData) {
    await db.insert(customers).values(customer).onConflictDoNothing();
  }
  console.log("✓ Seeded customers");

  // Seed VIP Events
  const vipEventData = [
    {
      name: "Essence Platinum Tasting Evening",
      description: "Exclusive tasting of our new 2025 flavour collection for Platinum members",
      eventType: "tasting",
      eventDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      startTime: "19:00",
      endTime: "22:00",
      maxGuests: 50,
      currentRsvps: 23,
      dresscode: "Smart Casual",
      isInviteOnly: true,
      status: "upcoming"
    },
    {
      name: "Gold Members VIP Launch Party",
      description: "Be the first to experience our new Riyadh location before public opening",
      eventType: "launch_party",
      eventDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      startTime: "18:00",
      endTime: "23:00",
      maxGuests: 100,
      currentRsvps: 67,
      dresscode: "Cocktail Attire",
      isInviteOnly: true,
      status: "upcoming"
    },
    {
      name: "Private Airport Lounge Experience",
      description: "Complimentary yogurt service in the VIP airport lounge",
      eventType: "private_experience",
      eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      startTime: "06:00",
      endTime: "22:00",
      maxGuests: 200,
      currentRsvps: 45,
      isInviteOnly: false,
      status: "upcoming"
    }
  ];

  for (const event of vipEventData) {
    await db.insert(vipEvents).values(event).onConflictDoNothing();
  }
  console.log("✓ Seeded VIP events");

  console.log("Database seeded successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
