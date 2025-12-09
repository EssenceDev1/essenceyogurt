/*
===============================================================================
ESSENCE YOGURT - GLOBAL OPERATIONS, FINANCE, SALES, MAINTENANCE ECOSYSTEM
FULL MASTER FILE FOR DEVELOPMENT TEAM
PURE WHITE BACKGROUND REQUIREMENT THROUGHOUT
===============================================================================
*/

export const EssenceOperationsSystem = {

  financeModule: {
    accountingAutomation: {
      description: "All financial transactions automatically sent to Finance HQ via secure API",
      includes: [
        "Daily sales totals",
        "Payment breakdowns (Apple Pay, Google Pay, Visa)",
        "Discount use",
        "Loyalty use",
        "E-gift redemptions",
        "Refunds (if any)",
        "Staff shift logs",
        "Tax reports for SA, UAE, IL, GR, AU"
      ],
      aiVerification: "Gemini AI verifies all entries for anomalies or fraud"
    },

    taxCompliance: {
      saudiArabia: { name: "ZATCA VAT", rate: 0.15, format: "ZATCA compliant" },
      uae: { name: "VAT", rate: 0.05, format: "FTA compliant" },
      israel: { name: "Ma'am", rate: 0.17, format: "Israel Tax Authority" },
      greece: { name: "EU VAT", rate: 0.24, format: "AADE/ΦΠΑ" },
      australia: { name: "GST", rate: 0.10, format: "ATO compliant" }
    },

    expenseTracking: {
      requiredFields: [
        "Photo of receipt",
        "Store location",
        "Staff ID",
        "Category (repair, supplies, emergency)",
        "Approval chain"
      ],
      aiFlags: "Gemini flags suspicious patterns and prevents fraud"
    },

    fraudDetection: {
      monitors: [
        "Refunds higher than usual",
        "Repeated voids at POS",
        "Unusual topping restock use",
        "Staff giving free yogurt without scale weight",
        "Duplicate supplier invoices",
        "Sudden drops in margins",
        "Repeated maintenance calls"
      ]
    }
  },

  salesMarketingModule: {
    salesTracking: {
      capturedData: [
        "Store location",
        "Date and time",
        "Weight sold",
        "Toppings ratio to base",
        "Payment method",
        "Loyalty points earned",
        "Staff ID at cashier"
      ],
      aiForecasting: "AI creates sales forecasts per region and per hour of day"
    },

    campaignManagement: {
      pushTypes: [
        "Promotions",
        "Announcements",
        "New flavor launches",
        "Loyalty bonuses",
        "Geo-targeted offers for Dubai and Riyadh"
      ],
      channels: ["Push notifications", "Email"]
    },

    customerAnalytics: {
      segments: [
        "Purchase frequency",
        "Favorite flavors",
        "Average spend",
        "Location behavior",
        "Time of purchase"
      ],
      purpose: "Helps expansion and franchise planning"
    }
  },

  maintenanceModule: {
    repairFlow: {
      issueTypes: [
        "Soft serve machine problem",
        "Fridge low temp",
        "Electric issue",
        "Water leak",
        "Scale malfunction",
        "Display or POS issue"
      ],
      autoCapture: [
        "Store ID",
        "Staff ID",
        "Timestamp",
        "Photo or video attachment"
      ]
    },

    technicianRouting: {
      aiChecks: [
        "Which technician is closest",
        "Who is available",
        "Who is certified for the machine type"
      ],
      action: "Routes job automatically"
    },

    subcontractorManagement: {
      profileFields: [
        "License info",
        "Contact details",
        "Service area",
        "Job history",
        "Performance rating",
        "Payment rates"
      ],
      notification: "SMS, WhatsApp or email"
    },

    maintenanceDashboard: {
      hqViews: [
        "Open repair jobs",
        "Technician assigned",
        "Status (pending, active, completed)",
        "Cost of repair",
        "Store downtime",
        "Safety risk level"
      ],
      aiAlerts: "Flags repeated problems with same store or machine"
    },

    expenseControl: {
      requirements: [
        "Photo receipt required",
        "Cross-checked with subcontractor invoice",
        "Staff cannot approve own expense",
        "AI blocks duplicate or forged invoices"
      ]
    }
  },

  staffModule: {
    smartShiftSystem: {
      loginMethods: [
        "Face ID",
        "Google login",
        "Apple login",
        "Email code",
        "WhatsApp OTP",
        "Passkey"
      ],
      sickFlow: {
        trigger: 'Staff presses "Not Well"',
        actions: [
          "Finds next available staff",
          "Sends shift request",
          "Requires confirmation",
          "If no answer in 5 minutes, next staff is notified"
        ]
      }
    },

    attendanceLogs: {
      autoCapture: [
        "Start time",
        "End time",
        "Breaks",
        "Store location",
        "Device used",
        "GPS check for fairness"
      ]
    },

    staffSafety: {
      alerts: [
        "Food safety alerts",
        "Machine health alerts",
        "Expiry warnings for fruit or powders",
        "Hygiene tasks",
        "Cleaning checklists"
      ]
    }
  },

  inventoryModule: {
    foodExpiryAI: {
      monitors: [
        "Frozen fruit expiry dates",
        "Açaí pouch life",
        "Mango and strawberry stock",
        "Nut expiry dates",
        "Yogurt powder life"
      ],
      autoAlert: "Dispose now - expiry reached"
    },

    stockLevels: {
      tracking: [
        "Topping bin scans via mobile",
        "Machine mix level via IoT sensors",
        "Fridge temperatures every 10 minutes"
      ]
    },

    theftMonitoring: {
      aiCompares: [
        "Expected topping use",
        "Weight sold",
        "Cash collected",
        "Employee actions"
      ],
      onMismatch: "System flags possible theft"
    }
  },

  backendAPIs: {
    finance: {
      sendDailyReport: { method: "POST", path: "/api/finance/daily-summary" },
      recordExpense: { method: "POST", path: "/api/finance/expense" },
      getReports: { method: "GET", path: "/api/finance/reports" }
    },
    sales: {
      recordSale: { method: "POST", path: "/api/sales/new" },
      viewSales: { method: "GET", path: "/api/sales/history" }
    },
    maintenance: {
      newTicket: { method: "POST", path: "/api/maintenance/ticket" },
      assignTech: { method: "POST", path: "/api/maintenance/assign" },
      updateStatus: { method: "POST", path: "/api/maintenance/status" },
      completeRepair: { method: "POST", path: "/api/maintenance/complete" }
    },
    inventory: {
      updateStock: { method: "POST", path: "/api/inventory/update" },
      logExpiry: { method: "POST", path: "/api/inventory/expiry" },
      checkLevels: { method: "GET", path: "/api/inventory/status" }
    },
    staff: {
      clockIn: { method: "POST", path: "/api/staff/clock-in" },
      clockOut: { method: "POST", path: "/api/staff/clock-out" },
      sickReport: { method: "POST", path: "/api/staff/sick" },
      shiftAssign: { method: "POST", path: "/api/staff/assign" }
    }
  },

  frontendFlows: {
    staffApp: [
      "Login",
      "Dashboard",
      "Report Issue",
      "Sick Button",
      "Clock In",
      "Clock Out",
      "Stock Check",
      "Cleaning Tasks",
      "Alerts"
    ],
    hqDashboard: [
      "Finance center",
      "Sales analytics",
      "Store performance",
      "Technician manager",
      "Staff attendance",
      "Inventory health",
      "AI fraud alerts"
    ]
  }
};

export type FinanceModule = typeof EssenceOperationsSystem.financeModule;
export type MaintenanceModule = typeof EssenceOperationsSystem.maintenanceModule;
export type StaffModule = typeof EssenceOperationsSystem.staffModule;
export type InventoryModule = typeof EssenceOperationsSystem.inventoryModule;
