import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, integer, numeric, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Contact Inquiries
export const contactInquiries = pgTable("contact_inquiries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  isRead: boolean("is_read").default(false).notNull(),
});

export const insertContactInquirySchema = createInsertSchema(contactInquiries).omit({
  id: true,
  createdAt: true,
  isRead: true,
});

export type InsertContactInquiry = z.infer<typeof insertContactInquirySchema>;
export type ContactInquiry = typeof contactInquiries.$inferSelect;

// Job Postings (Advertised positions)
export const jobPostings = pgTable("job_postings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  department: text("department").notNull(),
  location: text("location").notNull(),
  type: text("type").notNull(),
  salary: text("salary"),
  hours: text("hours"),
  description: text("description").notNull(),
  requirements: text("requirements").array(),
  idealCandidate: text("ideal_candidate"),
  isActive: boolean("is_active").default(true).notNull(),
  priority: integer("priority").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: varchar("created_by"),
});

export const insertJobPostingSchema = createInsertSchema(jobPostings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertJobPosting = z.infer<typeof insertJobPostingSchema>;
export type JobPosting = typeof jobPostings.$inferSelect;

// Job Applications
export const jobApplications = pgTable("job_applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  positionTitle: text("position_title").notNull(),
  department: text("department"),
  location: text("location"),
  resumeUrl: text("resume_url"),
  resumeText: text("resume_text"),
  resumeAiAnalysis: text("resume_ai_analysis"),
  coverLetter: text("cover_letter"),
  linkedInUrl: text("linkedin_url"),
  portfolioUrl: text("portfolio_url"),
  yearsExperience: text("years_experience"),
  whyChooseYou: text("why_choose_you"),
  customerServiceExample: text("customer_service_example"),
  teamworkExample: text("teamwork_example"),
  availability: text("availability"),
  expectedSalary: text("expected_salary"),
  startDate: text("start_date"),
  aiScore: integer("ai_score"),
  aiAnalysis: text("ai_analysis"),
  aiShortlisted: boolean("ai_shortlisted").default(false),
  status: text("status").default("pending").notNull(),
  notes: text("notes"),
  idDocumentUrl: text("id_document_url"),
  photoUrl: text("photo_url"),
  documentsSubmittedAt: timestamp("documents_submitted_at"),
  identityVerificationStatus: text("identity_verification_status").default("pending"),
  identityVerifiedAt: timestamp("identity_verified_at"),
  identityVerifiedBy: varchar("identity_verified_by"),
  verificationNotes: text("verification_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  reviewedAt: timestamp("reviewed_at"),
  reviewedBy: varchar("reviewed_by"),
});

export const insertJobApplicationSchema = createInsertSchema(jobApplications).omit({
  id: true,
  createdAt: true,
  status: true,
  reviewedAt: true,
  reviewedBy: true,
  aiScore: true,
  aiAnalysis: true,
  aiShortlisted: true,
  resumeAiAnalysis: true,
  idDocumentUrl: true,
  photoUrl: true,
  documentsSubmittedAt: true,
  identityVerificationStatus: true,
  identityVerifiedAt: true,
  identityVerifiedBy: true,
  verificationNotes: true,
});

export const documentAccessLogs = pgTable("document_access_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicationId: varchar("application_id").notNull(),
  documentType: text("document_type").notNull(),
  accessedBy: varchar("accessed_by").notNull(),
  accessedByName: text("accessed_by_name"),
  accessedByRole: text("accessed_by_role"),
  accessedAt: timestamp("accessed_at").defaultNow().notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  purpose: text("purpose"),
});

export type DocumentAccessLog = typeof documentAccessLogs.$inferSelect;

export type InsertJobApplication = z.infer<typeof insertJobApplicationSchema>;
export type JobApplication = typeof jobApplications.$inferSelect;

// Supplier Users (External Portal Access)
export const supplierUsers = pgTable("supplier_users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  supplierId: varchar("supplier_id").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  fullName: text("full_name").notNull(),
  role: text("role").default("viewer").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSupplierUserSchema = createInsertSchema(supplierUsers).omit({
  id: true,
  createdAt: true,
  lastLoginAt: true,
});

export type InsertSupplierUser = z.infer<typeof insertSupplierUserSchema>;
export type SupplierUser = typeof supplierUsers.$inferSelect;

// Fraud Alerts
export const fraudAlerts = pgTable("fraud_alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  entityType: text("entity_type").notNull(),
  entityId: varchar("entity_id").notNull(),
  severity: text("severity").default("medium").notNull(),
  alertType: text("alert_type").notNull(),
  description: text("description").notNull(),
  metadata: jsonb("metadata"),
  isResolved: boolean("is_resolved").default(false).notNull(),
  resolvedAt: timestamp("resolved_at"),
  resolvedBy: varchar("resolved_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertFraudAlertSchema = createInsertSchema(fraudAlerts).omit({
  id: true,
  createdAt: true,
  isResolved: true,
  resolvedAt: true,
  resolvedBy: true,
});

export type InsertFraudAlert = z.infer<typeof insertFraudAlertSchema>;
export type FraudAlert = typeof fraudAlerts.$inferSelect;

// Flavors (2026 Edition)
export const flavors = pgTable("flavors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  internalCode: text("internal_code"),
  name: text("name").notNull(),
  marketingName: text("marketing_name"),
  description: text("description").notNull(),
  type: text("type").notNull(),
  tier: text("tier"),
  accentColor: text("accent_color"),
  imagePrompt: text("image_prompt"),
  priority: integer("priority").default(1),
  isActive: boolean("is_active").default(true).notNull(),
  displayOrder: integer("display_order").default(0).notNull(),
});

export const insertFlavorSchema = createInsertSchema(flavors).omit({ id: true });
export type InsertFlavor = z.infer<typeof insertFlavorSchema>;
export type Flavor = typeof flavors.$inferSelect;

// Toppings
export const toppings = pgTable("toppings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  displayOrder: integer("display_order").default(0).notNull(),
});

export const insertToppingSchema = createInsertSchema(toppings).omit({ id: true });
export type InsertTopping = z.infer<typeof insertToppingSchema>;
export type Topping = typeof toppings.$inferSelect;

// Locations
export const locations = pgTable("locations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  city: text("city").notNull(),
  country: text("country").notNull(),
  venue: text("venue").notNull(),
  detail: text("detail").notNull(),
  address: text("address"),
  latitude: numeric("latitude", { precision: 10, scale: 7 }),
  longitude: numeric("longitude", { precision: 10, scale: 7 }),
  phone: text("phone"),
  hours: text("hours"),
  status: text("status").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  displayOrder: integer("display_order").default(0).notNull(),
});

export const insertLocationSchema = createInsertSchema(locations).omit({ id: true });
export type InsertLocation = z.infer<typeof insertLocationSchema>;
export type Location = typeof locations.$inferSelect;

// Revenue Share Models
export const revenueShareModels = pgTable("revenue_share_models", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  shareToEssencePercent: numeric("share_to_essence_percent", { precision: 5, scale: 2 }).notNull(),
  shareToPartnerPercent: numeric("share_to_partner_percent", { precision: 5, scale: 2 }).notNull(),
  partnerName: text("partner_name").notNull(),
  contractStart: timestamp("contract_start").notNull(),
  contractEnd: timestamp("contract_end"),
  autoRenew: boolean("auto_renew").default(false).notNull(),
});

export const insertRevenueShareModelSchema = createInsertSchema(revenueShareModels).omit({ id: true });
export type InsertRevenueShareModel = z.infer<typeof insertRevenueShareModelSchema>;
export type RevenueShareModel = typeof revenueShareModels.$inferSelect;

// Essence Units (shops, bars, kiosks)
export const essenceUnits = pgTable("essence_units", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  country: text("country").notNull(),
  city: text("city").notNull(),
  locationType: text("location_type").notNull(),
  conceptType: text("concept_type").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  openingDate: timestamp("opening_date"),
  revenueShareModelId: varchar("revenue_share_model_id"),
  maxCupsPerHour: integer("max_cups_per_hour").notNull(),
  typicalFootTrafficPerDay: integer("typical_foot_traffic_per_day"),
});

export const insertEssenceUnitSchema = createInsertSchema(essenceUnits).omit({ id: true });
export type InsertEssenceUnit = z.infer<typeof insertEssenceUnitSchema>;
export type EssenceUnit = typeof essenceUnits.$inferSelect;

// Pricing Rules
export const pricingRules = pgTable("pricing_rules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  essenceUnitId: varchar("essence_unit_id").notNull(),
  mode: text("mode").notNull(),
  currency: text("currency").notNull(),
  pricePer100g: numeric("price_per_100g", { precision: 8, scale: 2 }),
  smallCupPrice: numeric("small_cup_price", { precision: 8, scale: 2 }),
  mediumCupPrice: numeric("medium_cup_price", { precision: 8, scale: 2 }),
  largeCupPrice: numeric("large_cup_price", { precision: 8, scale: 2 }),
  toppingsIncluded: boolean("toppings_included").default(false),
  toppingsPricePer100g: numeric("toppings_price_per_100g", { precision: 8, scale: 2 }),
  validFrom: timestamp("valid_from"),
  validTo: timestamp("valid_to"),
  startHourLocal: integer("start_hour_local"),
  endHourLocal: integer("end_hour_local"),
});

export const insertPricingRuleSchema = createInsertSchema(pricingRules).omit({ id: true });
export type InsertPricingRule = z.infer<typeof insertPricingRuleSchema>;
export type PricingRule = typeof pricingRules.$inferSelect;

// Essence Events (pop-up bars)
export const essenceEvents = pgTable("essence_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  hostPartnerName: text("host_partner_name").notNull(),
  country: text("country").notNull(),
  city: text("city").notNull(),
  venueName: text("venue_name").notNull(),
  startDateTime: timestamp("start_date_time").notNull(),
  endDateTime: timestamp("end_date_time").notNull(),
  expectedGuests: integer("expected_guests").notNull(),
  isExclusiveUnlimitedRefills: boolean("is_exclusive_unlimited_refills").default(false),
  flatFeeCurrency: text("flat_fee_currency").notNull(),
  flatFeeAmount: numeric("flat_fee_amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull(),
  associatedUnitId: varchar("associated_unit_id"),
});

export const insertEssenceEventSchema = createInsertSchema(essenceEvents).omit({ id: true });
export type InsertEssenceEvent = z.infer<typeof insertEssenceEventSchema>;
export type EssenceEvent = typeof essenceEvents.$inferSelect;

// Credit Packages (multi-cup packs, gifts)
export const creditPackages = pgTable("credit_packages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  country: text("country").notNull(),
  currency: text("currency").notNull(),
  numberOfCups: integer("number_of_cups").notNull(),
  basePrice: numeric("base_price", { precision: 10, scale: 2 }).notNull(),
  discountPercent: numeric("discount_percent", { precision: 5, scale: 2 }).notNull(),
  isGiftable: boolean("is_giftable").default(true),
  isECardOnly: boolean("is_ecard_only").default(false),
  isPhysicalCardAvailable: boolean("is_physical_card_available").default(false),
  maxPerUser: integer("max_per_user"),
  expiresAfterDays: integer("expires_after_days"),
  canBeUsedAtEvents: boolean("can_be_used_at_events").default(true),
  canBeUsedAtAirport: boolean("can_be_used_at_airport").default(true),
  canBeUsedAtMall: boolean("can_be_used_at_mall").default(true),
});

export const insertCreditPackageSchema = createInsertSchema(creditPackages).omit({ id: true });
export type InsertCreditPackage = z.infer<typeof insertCreditPackageSchema>;
export type CreditPackage = typeof creditPackages.$inferSelect;

// Loyalty Tiers (Block 3: Gold 1.1x, Platinum 1.25x, Diamond 1.5x multipliers)
export const loyaltyTiers = pgTable("loyalty_tiers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  tierCode: text("tier_code").notNull().default("standard"), // standard, gold, platinum, diamond
  requiredPoints: integer("required_points").notNull(),
  pointsMultiplier: numeric("points_multiplier", { precision: 4, scale: 2 }).notNull().default("1.0"), // 1.1, 1.25, 1.5
  perksDescription: text("perks_description").notNull(),
  freeCupsPerYear: integer("free_cups_per_year"),
  freeToppingUpgrades: integer("free_topping_upgrades"),
  birthdayGiftValue: numeric("birthday_gift_value", { precision: 8, scale: 2 }),
  hasVipInboxAccess: boolean("has_vip_inbox_access").default(false),
  hasEarlyFlavorAccess: boolean("has_early_flavor_access").default(false),
  hasAirportPerks: boolean("has_airport_perks").default(false),
  displayOrder: integer("display_order").default(0),
  accentColor: text("accent_color"), // gold, platinum, diamond styling
});

export const insertLoyaltyTierSchema = createInsertSchema(loyaltyTiers).omit({ id: true });
export type InsertLoyaltyTier = z.infer<typeof insertLoyaltyTierSchema>;
export type LoyaltyTier = typeof loyaltyTiers.$inferSelect;

// Rotating QR Tokens (Block 3: 60-second rotating anti-fraud QR codes)
export const loyaltyQrTokens = pgTable("loyalty_qr_tokens", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: varchar("customer_id").notNull(),
  token: text("token").notNull().unique(),
  signature: text("signature").notNull(),
  sessionId: text("session_id").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  isUsed: boolean("is_used").default(false),
  usedAt: timestamp("used_at"),
  usedAtUnitId: varchar("used_at_unit_id"),
  deviceFingerprint: text("device_fingerprint"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertLoyaltyQrTokenSchema = createInsertSchema(loyaltyQrTokens).omit({
  id: true,
  createdAt: true,
});
export type InsertLoyaltyQrToken = z.infer<typeof insertLoyaltyQrTokenSchema>;
export type LoyaltyQrToken = typeof loyaltyQrTokens.$inferSelect;

// Loyalty Points Transactions (Block 3: 1g = 1pt weight-based earning)
export const loyaltyPointsTransactions = pgTable("loyalty_points_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: varchar("customer_id").notNull(),
  transactionType: text("transaction_type").notNull(), // earn, redeem, bonus, adjust, expire
  pointsAmount: integer("points_amount").notNull(),
  weightGrams: integer("weight_grams"), // grams purchased (1g = 1pt before multiplier)
  multiplierApplied: numeric("multiplier_applied", { precision: 4, scale: 2 }),
  basePoints: integer("base_points"), // points before multiplier
  posTransactionId: varchar("pos_transaction_id"),
  essenceUnitId: varchar("essence_unit_id"),
  description: text("description"),
  balanceAfter: integer("balance_after").notNull(),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertLoyaltyPointsTransactionSchema = createInsertSchema(loyaltyPointsTransactions).omit({
  id: true,
  createdAt: true,
});
export type InsertLoyaltyPointsTransaction = z.infer<typeof insertLoyaltyPointsTransactionSchema>;
export type LoyaltyPointsTransaction = typeof loyaltyPointsTransactions.$inferSelect;

// Customers
export const customers = pgTable("customers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  phoneCountryCode: text("phone_country_code"),
  phoneNumber: text("phone_number"),
  country: text("country"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  loyaltyTierId: varchar("loyalty_tier_id"),
  loyaltyPoints: integer("loyalty_points").default(0),
});

export const insertCustomerSchema = createInsertSchema(customers).omit({
  id: true,
  createdAt: true,
  loyaltyPoints: true,
});
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Customer = typeof customers.$inferSelect;

// E-Gift Cards
export const eGiftCards = pgTable("egift_cards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  code: text("code").notNull().unique(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("USD"),
  recipientEmail: text("recipient_email").notNull(),
  recipientName: text("recipient_name").notNull(),
  senderEmail: text("sender_email"),
  senderName: text("sender_name"),
  message: text("message"),
  isRedeemed: boolean("is_redeemed").default(false).notNull(),
  redeemedAt: timestamp("redeemed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at"),
});

export const insertEGiftCardSchema = createInsertSchema(eGiftCards).omit({
  id: true,
  code: true,
  isRedeemed: true,
  redeemedAt: true,
  createdAt: true,
});
export type InsertEGiftCard = z.infer<typeof insertEGiftCardSchema>;
export type EGiftCard = typeof eGiftCards.$inferSelect;

// E-Gift Card Audit Log - Security & Anti-Fraud Tracking
export const eGiftAuditLog = pgTable("egift_audit_log", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  giftCardId: varchar("gift_card_id").notNull(),
  action: text("action").notNull(), // created, viewed, redeemed, blocked, transferred_attempt, fraud_flagged
  actorType: text("actor_type").notNull(), // customer, staff, system, admin
  actorId: varchar("actor_id"),
  staffEmployeeId: varchar("staff_employee_id"),
  locationId: varchar("location_id"),
  deviceFingerprint: text("device_fingerprint"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  metadata: jsonb("metadata"),
  riskScore: integer("risk_score").default(0),
  isSuspicious: boolean("is_suspicious").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertEGiftAuditLogSchema = createInsertSchema(eGiftAuditLog).omit({
  id: true,
  createdAt: true,
});
export type InsertEGiftAuditLog = z.infer<typeof insertEGiftAuditLogSchema>;
export type EGiftAuditLog = typeof eGiftAuditLog.$inferSelect;

// E-Gift Redemption Restrictions - Staff Misuse Prevention
export const eGiftRedemptionRules = pgTable("egift_redemption_rules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ruleName: text("rule_name").notNull(),
  ruleType: text("rule_type").notNull(), // max_per_day, staff_blocked, device_limit, location_limit
  ruleValue: text("rule_value").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertEGiftRedemptionRuleSchema = createInsertSchema(eGiftRedemptionRules).omit({
  id: true,
  createdAt: true,
});
export type InsertEGiftRedemptionRule = z.infer<typeof insertEGiftRedemptionRuleSchema>;
export type EGiftRedemptionRule = typeof eGiftRedemptionRules.$inferSelect;

// Staff E-Gift Usage Tracking - Prevent Employee Abuse
export const staffEGiftUsage = pgTable("staff_egift_usage", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  employeeId: varchar("employee_id").notNull(),
  giftCardId: varchar("gift_card_id").notNull(),
  action: text("action").notNull(), // processed, attempted_use, flagged
  transactionId: varchar("transaction_id"),
  locationId: varchar("location_id"),
  shiftId: varchar("shift_id"),
  amountRedeemed: numeric("amount_redeemed", { precision: 10, scale: 2 }),
  wasBlocked: boolean("was_blocked").default(false),
  blockReason: text("block_reason"),
  supervisorApprovalId: varchar("supervisor_approval_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertStaffEGiftUsageSchema = createInsertSchema(staffEGiftUsage).omit({
  id: true,
  createdAt: true,
});
export type InsertStaffEGiftUsage = z.infer<typeof insertStaffEGiftUsageSchema>;
export type StaffEGiftUsage = typeof staffEGiftUsage.$inferSelect;

// Franchise Applications
export const franchiseApplications = pgTable("franchise_applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  country: text("country").notNull(),
  city: text("city"),
  capital: text("capital"),
  notes: text("notes"),
  status: text("status").notNull().default("new"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertFranchiseApplicationSchema = createInsertSchema(franchiseApplications).omit({
  id: true,
  status: true,
  createdAt: true,
});
export type InsertFranchiseApplication = z.infer<typeof insertFranchiseApplicationSchema>;
export type FranchiseApplication = typeof franchiseApplications.$inferSelect;

// =====================================================
// PHASE 1: SUPPLIER MANAGEMENT
// =====================================================

// Suppliers (fruit, candy, chocolate, açaí, cups, cleaning)
export const suppliers = pgTable("suppliers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(), // fruit, candy, chocolate, acai, cups, cleaning, equipment
  tier: text("tier").notNull().default("standard"), // standard, preferred, premium
  contactName: text("contact_name").notNull(),
  contactEmail: text("contact_email").notNull(),
  contactPhone: text("contact_phone"),
  country: text("country").notNull(),
  city: text("city"),
  address: text("address"),
  paymentTermsDays: integer("payment_terms_days").default(30),
  currency: text("currency").notNull().default("USD"),
  contractStartDate: timestamp("contract_start_date"),
  contractEndDate: timestamp("contract_end_date"),
  autoRenew: boolean("auto_renew").default(false),
  isActive: boolean("is_active").default(true).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSupplierSchema = createInsertSchema(suppliers).omit({
  id: true,
  createdAt: true,
});
export type InsertSupplier = z.infer<typeof insertSupplierSchema>;
export type Supplier = typeof suppliers.$inferSelect;

// Supply Items (catalog of items from suppliers)
export const supplyItems = pgTable("supply_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  supplierId: varchar("supplier_id").notNull(),
  name: text("name").notNull(),
  sku: text("sku"),
  category: text("category").notNull(), // ingredient, packaging, cleaning, equipment
  unit: text("unit").notNull(), // kg, liters, pieces, boxes
  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("USD"),
  minOrderQuantity: integer("min_order_quantity").default(1),
  leadTimeDays: integer("lead_time_days").default(7),
  isActive: boolean("is_active").default(true).notNull(),
  description: text("description"),
});

export const insertSupplyItemSchema = createInsertSchema(supplyItems).omit({ id: true });
export type InsertSupplyItem = z.infer<typeof insertSupplyItemSchema>;
export type SupplyItem = typeof supplyItems.$inferSelect;

// Purchase Orders
export const purchaseOrders = pgTable("purchase_orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderNumber: text("order_number").notNull().unique(),
  supplierId: varchar("supplier_id").notNull(),
  essenceUnitId: varchar("essence_unit_id"), // destination unit
  status: text("status").notNull().default("draft"), // draft, submitted, confirmed, shipped, delivered, cancelled
  totalAmount: numeric("total_amount", { precision: 12, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("USD"),
  orderedAt: timestamp("ordered_at"),
  expectedDelivery: timestamp("expected_delivery"),
  deliveredAt: timestamp("delivered_at"),
  notes: text("notes"),
  createdBy: varchar("created_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPurchaseOrderSchema = createInsertSchema(purchaseOrders).omit({
  id: true,
  orderNumber: true,
  createdAt: true,
});
export type InsertPurchaseOrder = z.infer<typeof insertPurchaseOrderSchema>;
export type PurchaseOrder = typeof purchaseOrders.$inferSelect;

// Purchase Order Items
export const purchaseOrderItems = pgTable("purchase_order_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  purchaseOrderId: varchar("purchase_order_id").notNull(),
  supplyItemId: varchar("supply_item_id").notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
  totalPrice: numeric("total_price", { precision: 12, scale: 2 }).notNull(),
});

export const insertPurchaseOrderItemSchema = createInsertSchema(purchaseOrderItems).omit({ id: true });
export type InsertPurchaseOrderItem = z.infer<typeof insertPurchaseOrderItemSchema>;
export type PurchaseOrderItem = typeof purchaseOrderItems.$inferSelect;

// Inventory Batches
export const inventoryBatches = pgTable("inventory_batches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  essenceUnitId: varchar("essence_unit_id").notNull(),
  supplyItemId: varchar("supply_item_id").notNull(),
  purchaseOrderId: varchar("purchase_order_id"),
  batchNumber: text("batch_number"),
  quantityReceived: integer("quantity_received").notNull(),
  quantityRemaining: integer("quantity_remaining").notNull(),
  expiryDate: timestamp("expiry_date"),
  receivedAt: timestamp("received_at").defaultNow().notNull(),
  notes: text("notes"),
});

export const insertInventoryBatchSchema = createInsertSchema(inventoryBatches).omit({
  id: true,
  receivedAt: true,
});
export type InsertInventoryBatch = z.infer<typeof insertInventoryBatchSchema>;
export type InventoryBatch = typeof inventoryBatches.$inferSelect;

// Supplier Performance Tracking
export const supplierPerformance = pgTable("supplier_performance", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  supplierId: varchar("supplier_id").notNull(),
  purchaseOrderId: varchar("purchase_order_id"),
  ratingQuality: integer("rating_quality"), // 1-5
  ratingDelivery: integer("rating_delivery"), // 1-5
  ratingPrice: integer("rating_price"), // 1-5
  wasOnTime: boolean("was_on_time"),
  issueDescription: text("issue_description"),
  reviewedAt: timestamp("reviewed_at").defaultNow().notNull(),
  reviewedBy: varchar("reviewed_by"),
});

export const insertSupplierPerformanceSchema = createInsertSchema(supplierPerformance).omit({
  id: true,
  reviewedAt: true,
});
export type InsertSupplierPerformance = z.infer<typeof insertSupplierPerformanceSchema>;
export type SupplierPerformance = typeof supplierPerformance.$inferSelect;

// =====================================================
// PHASE 2: EMPLOYEE OPERATIONS
// =====================================================

// Employees
export const employees = pgTable("employees", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  employeeCode: text("employee_code").notNull().unique(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  country: text("country").notNull(),
  city: text("city"),
  role: text("role").notNull(), // barista, supervisor, manager, regional_manager, admin
  essenceUnitId: varchar("essence_unit_id"), // primary assignment
  hourlyRate: numeric("hourly_rate", { precision: 8, scale: 2 }),
  currency: text("currency").notNull().default("USD"),
  employmentType: text("employment_type").notNull().default("full_time"), // full_time, part_time, contract
  hireDate: timestamp("hire_date").notNull(),
  terminationDate: timestamp("termination_date"),
  isActive: boolean("is_active").default(true).notNull(),
  emergencyContactName: text("emergency_contact_name"),
  emergencyContactPhone: text("emergency_contact_phone"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertEmployeeSchema = createInsertSchema(employees).omit({
  id: true,
  createdAt: true,
});
export type InsertEmployee = z.infer<typeof insertEmployeeSchema>;
export type Employee = typeof employees.$inferSelect;

// Shift Templates
export const shiftTemplates = pgTable("shift_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  essenceUnitId: varchar("essence_unit_id").notNull(),
  startTime: text("start_time").notNull(), // HH:MM format
  endTime: text("end_time").notNull(),
  breakMinutes: integer("break_minutes").default(30),
  requiredRole: text("required_role"),
  minStaff: integer("min_staff").notNull().default(1),
  isActive: boolean("is_active").default(true).notNull(),
});

export const insertShiftTemplateSchema = createInsertSchema(shiftTemplates).omit({ id: true });
export type InsertShiftTemplate = z.infer<typeof insertShiftTemplateSchema>;
export type ShiftTemplate = typeof shiftTemplates.$inferSelect;

// Shift Assignments
export const shiftAssignments = pgTable("shift_assignments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  employeeId: varchar("employee_id").notNull(),
  essenceUnitId: varchar("essence_unit_id").notNull(),
  shiftTemplateId: varchar("shift_template_id"),
  shiftDate: timestamp("shift_date").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  status: text("status").notNull().default("scheduled"), // scheduled, confirmed, in_progress, completed, no_show, cancelled
  actualStartTime: timestamp("actual_start_time"),
  actualEndTime: timestamp("actual_end_time"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertShiftAssignmentSchema = createInsertSchema(shiftAssignments).omit({
  id: true,
  createdAt: true,
});
export type InsertShiftAssignment = z.infer<typeof insertShiftAssignmentSchema>;
export type ShiftAssignment = typeof shiftAssignments.$inferSelect;

// Leave Requests
export const leaveRequests = pgTable("leave_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  employeeId: varchar("employee_id").notNull(),
  leaveType: text("leave_type").notNull(), // sick, vacation, personal, emergency, unpaid
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  reason: text("reason"),
  status: text("status").notNull().default("pending"), // pending, approved, rejected, cancelled
  approvedBy: varchar("approved_by"),
  approvedAt: timestamp("approved_at"),
  coverageEmployeeId: varchar("coverage_employee_id"), // who covers the shift
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertLeaveRequestSchema = createInsertSchema(leaveRequests).omit({
  id: true,
  status: true,
  approvedAt: true,
  createdAt: true,
});
export type InsertLeaveRequest = z.infer<typeof insertLeaveRequestSchema>;
export type LeaveRequest = typeof leaveRequests.$inferSelect;

// Payroll Cycles
export const payrollCycles = pgTable("payroll_cycles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),
  status: text("status").notNull().default("open"), // open, processing, approved, paid
  totalAmount: numeric("total_amount", { precision: 14, scale: 2 }),
  currency: text("currency").notNull().default("USD"),
  processedAt: timestamp("processed_at"),
  approvedBy: varchar("approved_by"),
  paidAt: timestamp("paid_at"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPayrollCycleSchema = createInsertSchema(payrollCycles).omit({
  id: true,
  status: true,
  createdAt: true,
});
export type InsertPayrollCycle = z.infer<typeof insertPayrollCycleSchema>;
export type PayrollCycle = typeof payrollCycles.$inferSelect;

// Payroll Entries (per employee per cycle)
export const payrollEntries = pgTable("payroll_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  payrollCycleId: varchar("payroll_cycle_id").notNull(),
  employeeId: varchar("employee_id").notNull(),
  regularHours: numeric("regular_hours", { precision: 6, scale: 2 }).notNull(),
  overtimeHours: numeric("overtime_hours", { precision: 6, scale: 2 }).default("0"),
  grossPay: numeric("gross_pay", { precision: 10, scale: 2 }).notNull(),
  deductions: numeric("deductions", { precision: 10, scale: 2 }).default("0"),
  netPay: numeric("net_pay", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("USD"),
  notes: text("notes"),
});

export const insertPayrollEntrySchema = createInsertSchema(payrollEntries).omit({ id: true });
export type InsertPayrollEntry = z.infer<typeof insertPayrollEntrySchema>;
export type PayrollEntry = typeof payrollEntries.$inferSelect;

// =====================================================
// PHASE 3: COMPLIANCE & LEGAL
// =====================================================

// Insurance Policies
export const insurancePolicies = pgTable("insurance_policies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  policyNumber: text("policy_number").notNull(),
  type: text("type").notNull(), // liability, property, workers_comp, product, vehicle
  provider: text("provider").notNull(),
  essenceUnitId: varchar("essence_unit_id"), // null = corporate level
  coverageAmount: numeric("coverage_amount", { precision: 14, scale: 2 }),
  premium: numeric("premium", { precision: 10, scale: 2 }),
  currency: text("currency").notNull().default("USD"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  renewalReminderDays: integer("renewal_reminder_days").default(60),
  status: text("status").notNull().default("active"), // active, expired, cancelled, pending_renewal
  documentUrl: text("document_url"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertInsurancePolicySchema = createInsertSchema(insurancePolicies).omit({
  id: true,
  createdAt: true,
});
export type InsertInsurancePolicy = z.infer<typeof insertInsurancePolicySchema>;
export type InsurancePolicy = typeof insurancePolicies.$inferSelect;

// Business Licenses
export const businessLicenses = pgTable("business_licenses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  licenseNumber: text("license_number").notNull(),
  type: text("type").notNull(), // food_service, health, business_operation, liquor, music
  issuingAuthority: text("issuing_authority").notNull(),
  essenceUnitId: varchar("essence_unit_id"),
  country: text("country").notNull(),
  city: text("city"),
  issueDate: timestamp("issue_date").notNull(),
  expiryDate: timestamp("expiry_date"),
  renewalReminderDays: integer("renewal_reminder_days").default(60),
  status: text("status").notNull().default("active"), // active, expired, pending_renewal, suspended
  cost: numeric("cost", { precision: 10, scale: 2 }),
  currency: text("currency").default("USD"),
  documentUrl: text("document_url"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertBusinessLicenseSchema = createInsertSchema(businessLicenses).omit({
  id: true,
  createdAt: true,
});
export type InsertBusinessLicense = z.infer<typeof insertBusinessLicenseSchema>;
export type BusinessLicense = typeof businessLicenses.$inferSelect;

// Tax Filings
export const taxFilings = pgTable("tax_filings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(), // sales_tax, vat, corporate, payroll, withholding
  jurisdiction: text("jurisdiction").notNull(), // country/state/city
  essenceUnitId: varchar("essence_unit_id"),
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),
  dueDate: timestamp("due_date").notNull(),
  filedDate: timestamp("filed_date"),
  amountDue: numeric("amount_due", { precision: 12, scale: 2 }),
  amountPaid: numeric("amount_paid", { precision: 12, scale: 2 }),
  currency: text("currency").notNull().default("USD"),
  status: text("status").notNull().default("pending"), // pending, filed, paid, overdue, under_review
  referenceNumber: text("reference_number"),
  documentUrl: text("document_url"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTaxFilingSchema = createInsertSchema(taxFilings).omit({
  id: true,
  createdAt: true,
});
export type InsertTaxFiling = z.infer<typeof insertTaxFilingSchema>;
export type TaxFiling = typeof taxFilings.$inferSelect;

// Compliance Tasks (general regulatory tasks)
export const complianceTasks = pgTable("compliance_tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(), // health_safety, food_safety, employment, environmental, financial
  essenceUnitId: varchar("essence_unit_id"),
  dueDate: timestamp("due_date").notNull(),
  completedDate: timestamp("completed_date"),
  status: text("status").notNull().default("pending"), // pending, in_progress, completed, overdue
  priority: text("priority").notNull().default("medium"), // low, medium, high, critical
  assignedTo: varchar("assigned_to"),
  recurrencePattern: text("recurrence_pattern"), // daily, weekly, monthly, quarterly, yearly
  parentTaskId: varchar("parent_task_id"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertComplianceTaskSchema = createInsertSchema(complianceTasks).omit({
  id: true,
  createdAt: true,
});
export type InsertComplianceTask = z.infer<typeof insertComplianceTaskSchema>;
export type ComplianceTask = typeof complianceTasks.$inferSelect;

// Documents Storage
export const documents = pgTable("documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  category: text("category").notNull(), // contract, license, insurance, tax, policy, certificate
  entityType: text("entity_type"), // supplier, employee, unit, corporate
  entityId: varchar("entity_id"),
  fileUrl: text("file_url").notNull(),
  fileType: text("file_type"),
  fileSize: integer("file_size"),
  expiryDate: timestamp("expiry_date"),
  uploadedBy: varchar("uploaded_by"),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
  notes: text("notes"),
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  uploadedAt: true,
});
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;

// =====================================================
// PHASE 4: VIP LOYALTY ENHANCEMENT
// =====================================================

// VIP Benefits (exclusive perks for top tier members)
export const vipBenefits = pgTable("vip_benefits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  loyaltyTierId: varchar("loyalty_tier_id").notNull(),
  benefitType: text("benefit_type").notNull(), // discount, free_item, early_access, exclusive_event, concierge
  value: numeric("value", { precision: 10, scale: 2 }),
  valueType: text("value_type"), // percentage, fixed_amount, free
  usageLimit: integer("usage_limit"), // per month/year
  isActive: boolean("is_active").default(true).notNull(),
  validFrom: timestamp("valid_from"),
  validTo: timestamp("valid_to"),
});

export const insertVipBenefitSchema = createInsertSchema(vipBenefits).omit({ id: true });
export type InsertVipBenefit = z.infer<typeof insertVipBenefitSchema>;
export type VipBenefit = typeof vipBenefits.$inferSelect;

// VIP Events (exclusive events for top members)
export const vipEvents = pgTable("vip_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  eventType: text("event_type").notNull(), // tasting, launch_party, private_experience, meet_greet
  essenceUnitId: varchar("essence_unit_id"),
  eventDate: timestamp("event_date").notNull(),
  startTime: text("start_time"),
  endTime: text("end_time"),
  maxGuests: integer("max_guests"),
  currentRsvps: integer("current_rsvps").default(0),
  minimumTier: varchar("minimum_tier_id"), // minimum loyalty tier required
  dresscode: text("dresscode"),
  isInviteOnly: boolean("is_invite_only").default(true),
  status: text("status").notNull().default("upcoming"), // upcoming, ongoing, completed, cancelled
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertVipEventSchema = createInsertSchema(vipEvents).omit({
  id: true,
  currentRsvps: true,
  createdAt: true,
});
export type InsertVipEvent = z.infer<typeof insertVipEventSchema>;
export type VipEvent = typeof vipEvents.$inferSelect;

// VIP Event RSVPs
export const vipEventRsvps = pgTable("vip_event_rsvps", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  vipEventId: varchar("vip_event_id").notNull(),
  customerId: varchar("customer_id").notNull(),
  status: text("status").notNull().default("pending"), // pending, confirmed, declined, attended, no_show
  guestCount: integer("guest_count").default(1),
  specialRequests: text("special_requests"),
  respondedAt: timestamp("responded_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertVipEventRsvpSchema = createInsertSchema(vipEventRsvps).omit({
  id: true,
  createdAt: true,
});
export type InsertVipEventRsvp = z.infer<typeof insertVipEventRsvpSchema>;
export type VipEventRsvp = typeof vipEventRsvps.$inferSelect;

// Member Activity Log (for analytics and engagement tracking)
export const memberActivityLogs = pgTable("member_activity_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: varchar("customer_id").notNull(),
  activityType: text("activity_type").notNull(), // purchase, redemption, tier_change, benefit_used, event_attended
  essenceUnitId: varchar("essence_unit_id"),
  description: text("description"),
  pointsEarned: integer("points_earned"),
  pointsRedeemed: integer("points_redeemed"),
  transactionValue: numeric("transaction_value", { precision: 10, scale: 2 }),
  currency: text("currency"),
  metadata: text("metadata"), // JSON string for additional data
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMemberActivityLogSchema = createInsertSchema(memberActivityLogs).omit({
  id: true,
  createdAt: true,
});
export type InsertMemberActivityLog = z.infer<typeof insertMemberActivityLogSchema>;
export type MemberActivityLog = typeof memberActivityLogs.$inferSelect;

// =====================================================
// PHASE 5: POS SYSTEM (DIGITAL SCALE INTEGRATION)
// =====================================================

// POS Sessions (terminal sessions)
export const posSessions = pgTable("pos_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  essenceUnitId: varchar("essence_unit_id").notNull(),
  terminalId: text("terminal_id").notNull(),
  employeeId: varchar("employee_id").notNull(),
  sessionNumber: text("session_number").notNull(),
  openedAt: timestamp("opened_at").defaultNow().notNull(),
  closedAt: timestamp("closed_at"),
  openingCash: numeric("opening_cash", { precision: 10, scale: 2 }).default("0"),
  closingCash: numeric("closing_cash", { precision: 10, scale: 2 }),
  expectedCash: numeric("expected_cash", { precision: 10, scale: 2 }),
  cashVariance: numeric("cash_variance", { precision: 10, scale: 2 }),
  totalTransactions: integer("total_transactions").default(0),
  totalSales: numeric("total_sales", { precision: 12, scale: 2 }).default("0"),
  currency: text("currency").notNull().default("USD"),
  status: text("status").notNull().default("open"), // open, closed, reconciled
  notes: text("notes"),
});

export const insertPosSessionSchema = createInsertSchema(posSessions).omit({
  id: true,
  openedAt: true,
  totalTransactions: true,
  totalSales: true,
});
export type InsertPosSession = z.infer<typeof insertPosSessionSchema>;
export type PosSession = typeof posSessions.$inferSelect;

// POS Transactions
export const posTransactions = pgTable("pos_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  posSessionId: varchar("pos_session_id").notNull(),
  essenceUnitId: varchar("essence_unit_id").notNull(),
  transactionNumber: text("transaction_number").notNull(),
  customerId: varchar("customer_id"),
  employeeId: varchar("employee_id").notNull(),
  totalWeight: numeric("total_weight", { precision: 8, scale: 2 }), // grams
  subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
  discountAmount: numeric("discount_amount", { precision: 10, scale: 2 }).default("0"),
  discountReason: text("discount_reason"),
  loyaltyPointsUsed: integer("loyalty_points_used").default(0),
  loyaltyDiscountAmount: numeric("loyalty_discount_amount", { precision: 10, scale: 2 }).default("0"),
  tipAmount: numeric("tip_amount", { precision: 10, scale: 2 }).default("0"),
  taxAmount: numeric("tax_amount", { precision: 10, scale: 2 }).default("0"),
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("USD"),
  status: text("status").notNull().default("pending"), // pending, completed, voided, refunded
  voidedBy: varchar("voided_by"),
  voidReason: text("void_reason"),
  loyaltyPointsEarned: integer("loyalty_points_earned").default(0),
  receiptNumber: text("receipt_number"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

export const insertPosTransactionSchema = createInsertSchema(posTransactions).omit({
  id: true,
  createdAt: true,
  loyaltyPointsEarned: true,
});
export type InsertPosTransaction = z.infer<typeof insertPosTransactionSchema>;
export type PosTransaction = typeof posTransactions.$inferSelect;

// POS Transaction Items
export const posTransactionItems = pgTable("pos_transaction_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  posTransactionId: varchar("pos_transaction_id").notNull(),
  itemType: text("item_type").notNull(), // yogurt, topping, cup, merchandise
  itemId: varchar("item_id"), // flavor id, topping id, etc
  itemName: text("item_name").notNull(),
  quantity: numeric("quantity", { precision: 8, scale: 2 }).notNull(),
  unit: text("unit").notNull(), // grams, pieces
  unitPrice: numeric("unit_price", { precision: 10, scale: 4 }).notNull(),
  totalPrice: numeric("total_price", { precision: 10, scale: 2 }).notNull(),
  weight: numeric("weight", { precision: 8, scale: 2 }), // weight in grams for weight-based items
});

export const insertPosTransactionItemSchema = createInsertSchema(posTransactionItems).omit({ id: true });
export type InsertPosTransactionItem = z.infer<typeof insertPosTransactionItemSchema>;
export type PosTransactionItem = typeof posTransactionItems.$inferSelect;

// POS Payments
export const posPayments = pgTable("pos_payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  posTransactionId: varchar("pos_transaction_id").notNull(),
  paymentMethod: text("payment_method").notNull(), // cash, card, mobile, gift_card, loyalty_credit
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("USD"),
  referenceNumber: text("reference_number"), // card auth code, gift card code, etc
  cardLastFour: text("card_last_four"),
  cardBrand: text("card_brand"),
  giftCardId: varchar("gift_card_id"),
  status: text("status").notNull().default("pending"), // pending, approved, declined, refunded
  processedAt: timestamp("processed_at"),
  notes: text("notes"),
});

export const insertPosPaymentSchema = createInsertSchema(posPayments).omit({ id: true });
export type InsertPosPayment = z.infer<typeof insertPosPaymentSchema>;
export type PosPayment = typeof posPayments.$inferSelect;

// Scale Readings (for weight-based pricing audit trail)
export const scaleReadings = pgTable("scale_readings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  posTransactionId: varchar("pos_transaction_id"),
  posSessionId: varchar("pos_session_id").notNull(),
  essenceUnitId: varchar("essence_unit_id").notNull(),
  terminalId: text("terminal_id").notNull(),
  weight: numeric("weight", { precision: 8, scale: 2 }).notNull(), // grams
  isStable: boolean("is_stable").default(true),
  isTared: boolean("is_tared").default(false),
  tareWeight: numeric("tare_weight", { precision: 8, scale: 2 }).default("0"),
  cupSize: text("cup_size"), // small, medium, large
  readingAt: timestamp("reading_at").defaultNow().notNull(),
});

export const insertScaleReadingSchema = createInsertSchema(scaleReadings).omit({
  id: true,
  readingAt: true,
});
export type InsertScaleReading = z.infer<typeof insertScaleReadingSchema>;
export type ScaleReading = typeof scaleReadings.$inferSelect;

// =====================================================
// PHASE 6: TIMESHEET SYSTEM (MILITARY GRADE)
// =====================================================

// Timesheet Entries (clock in/out with verification)
export const timesheetEntries = pgTable("timesheet_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  employeeId: varchar("employee_id").notNull(),
  essenceUnitId: varchar("essence_unit_id").notNull(),
  shiftAssignmentId: varchar("shift_assignment_id"),
  clockInTime: timestamp("clock_in_time").notNull(),
  clockOutTime: timestamp("clock_out_time"),
  scheduledStart: timestamp("scheduled_start"),
  scheduledEnd: timestamp("scheduled_end"),
  clockInLatitude: numeric("clock_in_latitude", { precision: 10, scale: 7 }),
  clockInLongitude: numeric("clock_in_longitude", { precision: 10, scale: 7 }),
  clockOutLatitude: numeric("clock_out_latitude", { precision: 10, scale: 7 }),
  clockOutLongitude: numeric("clock_out_longitude", { precision: 10, scale: 7 }),
  clockInPhotoUrl: text("clock_in_photo_url"),
  clockOutPhotoUrl: text("clock_out_photo_url"),
  clockInDeviceId: text("clock_in_device_id"),
  clockOutDeviceId: text("clock_out_device_id"),
  clockInIpAddress: text("clock_in_ip_address"),
  clockOutIpAddress: text("clock_out_ip_address"),
  isLateArrival: boolean("is_late_arrival").default(false),
  lateMinutes: integer("late_minutes").default(0),
  isEarlyDeparture: boolean("is_early_departure").default(false),
  earlyMinutes: integer("early_minutes").default(0),
  overtimeMinutes: integer("overtime_minutes").default(0),
  totalWorkMinutes: integer("total_work_minutes"),
  totalBreakMinutes: integer("total_break_minutes").default(0),
  status: text("status").notNull().default("clocked_in"), // clocked_in, clocked_out, pending_approval, approved, rejected, disputed
  approvedBy: varchar("approved_by"),
  approvedAt: timestamp("approved_at"),
  rejectionReason: text("rejection_reason"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTimesheetEntrySchema = createInsertSchema(timesheetEntries).omit({
  id: true,
  createdAt: true,
  isLateArrival: true,
  lateMinutes: true,
  isEarlyDeparture: true,
  earlyMinutes: true,
  totalWorkMinutes: true,
});
export type InsertTimesheetEntry = z.infer<typeof insertTimesheetEntrySchema>;
export type TimesheetEntry = typeof timesheetEntries.$inferSelect;

// Timesheet Breaks
export const timesheetBreaks = pgTable("timesheet_breaks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  timesheetEntryId: varchar("timesheet_entry_id").notNull(),
  breakType: text("break_type").notNull(), // meal, rest, bathroom, other
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  durationMinutes: integer("duration_minutes"),
  startLatitude: numeric("start_latitude", { precision: 10, scale: 7 }),
  startLongitude: numeric("start_longitude", { precision: 10, scale: 7 }),
  endLatitude: numeric("end_latitude", { precision: 10, scale: 7 }),
  endLongitude: numeric("end_longitude", { precision: 10, scale: 7 }),
  isExceededAllowance: boolean("is_exceeded_allowance").default(false),
  notes: text("notes"),
});

export const insertTimesheetBreakSchema = createInsertSchema(timesheetBreaks).omit({
  id: true,
  durationMinutes: true,
  isExceededAllowance: true,
});
export type InsertTimesheetBreak = z.infer<typeof insertTimesheetBreakSchema>;
export type TimesheetBreak = typeof timesheetBreaks.$inferSelect;

// Location Verifications (periodic GPS checks during shift)
export const locationVerifications = pgTable("location_verifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  timesheetEntryId: varchar("timesheet_entry_id").notNull(),
  employeeId: varchar("employee_id").notNull(),
  essenceUnitId: varchar("essence_unit_id").notNull(),
  latitude: numeric("latitude", { precision: 10, scale: 7 }).notNull(),
  longitude: numeric("longitude", { precision: 10, scale: 7 }).notNull(),
  accuracy: numeric("accuracy", { precision: 10, scale: 2 }), // meters
  distanceFromUnit: numeric("distance_from_unit", { precision: 10, scale: 2 }), // meters
  isWithinGeofence: boolean("is_within_geofence").default(true),
  verificationType: text("verification_type").notNull(), // clock_in, clock_out, periodic, random, break_start, break_end
  verifiedAt: timestamp("verified_at").defaultNow().notNull(),
  photoUrl: text("photo_url"),
  deviceId: text("device_id"),
  ipAddress: text("ip_address"),
  flagged: boolean("flagged").default(false),
  flagReason: text("flag_reason"),
});

export const insertLocationVerificationSchema = createInsertSchema(locationVerifications).omit({
  id: true,
  verifiedAt: true,
});
export type InsertLocationVerification = z.infer<typeof insertLocationVerificationSchema>;
export type LocationVerification = typeof locationVerifications.$inferSelect;

// =====================================================
// OCTOPUS SHIFT & ATTENDANCE ENGINE 2025 (ENHANCED)
// =====================================================

// Staff Shift States (attendance per staff per shift)
export const staffShiftStates = pgTable("staff_shift_states", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  shiftAssignmentId: varchar("shift_assignment_id").notNull(),
  staffId: varchar("staff_id").notNull(),
  status: text("status").notNull().default("SCHEDULED"), // SCHEDULED, CHECKED_IN, CHECKED_OUT, SICK, DAY_OFF, NO_SHOW
  checkInTime: timestamp("check_in_time"),
  checkOutTime: timestamp("check_out_time"),
  lastEventAt: timestamp("last_event_at").defaultNow(),
  notes: text("notes"),
});

export const insertStaffShiftStateSchema = createInsertSchema(staffShiftStates).omit({ id: true });
export type InsertStaffShiftState = z.infer<typeof insertStaffShiftStateSchema>;
export type StaffShiftState = typeof staffShiftStates.$inferSelect;

// Shift Checklists (opening, closing, cleaning)
export const shiftChecklistItems = pgTable("shift_checklist_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  shiftAssignmentId: varchar("shift_assignment_id").notNull(),
  essenceUnitId: varchar("essence_unit_id").notNull(),
  checklistType: text("checklist_type").notNull(), // OPENING, CLOSING, CLEANING
  label: text("label").notNull(),
  status: text("status").notNull().default("PENDING"), // PENDING, DONE
  completedAt: timestamp("completed_at"),
  completedByStaffId: varchar("completed_by_staff_id"),
  photoEvidenceUrl: text("photo_evidence_url"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertShiftChecklistItemSchema = createInsertSchema(shiftChecklistItems).omit({ id: true, createdAt: true });
export type InsertShiftChecklistItem = z.infer<typeof insertShiftChecklistItemSchema>;
export type ShiftChecklistItem = typeof shiftChecklistItems.$inferSelect;

// Octopus Events (system events for brain integration)
export const octopusEvents = pgTable("octopus_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: varchar("tenant_id").notNull(),
  locationId: varchar("location_id").notNull(),
  shiftAssignmentId: varchar("shift_assignment_id"),
  eventType: text("event_type").notNull(), // SHIFT_OPENING_BLOCKED, SHIFT_OPENED, SHIFT_CLOSING_BLOCKED, etc.
  severity: text("severity").default("INFO"), // INFO, WARNING, CRITICAL, ESCALATION
  payload: jsonb("payload"),
  isProcessed: boolean("is_processed").default(false),
  processedAt: timestamp("processed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertOctopusEventSchema = createInsertSchema(octopusEvents).omit({ id: true, createdAt: true });
export type InsertOctopusEvent = z.infer<typeof insertOctopusEventSchema>;
export type OctopusEvent = typeof octopusEvents.$inferSelect;

// =====================================================
// PHASE 7: STOCK CONTROL SYSTEM (ZERO TOLERANCE)
// =====================================================

// Inventory Items (what's in stock at each unit)
export const inventoryItems = pgTable("inventory_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  essenceUnitId: varchar("essence_unit_id").notNull(),
  supplyItemId: varchar("supply_item_id"),
  itemName: text("item_name").notNull(),
  category: text("category").notNull(), // yogurt_base, topping, cup, cleaning, equipment
  unit: text("unit").notNull(), // kg, liters, pieces, boxes
  currentQuantity: numeric("current_quantity", { precision: 12, scale: 3 }).notNull().default("0"),
  minQuantity: numeric("min_quantity", { precision: 12, scale: 3 }).default("0"), // reorder point
  maxQuantity: numeric("max_quantity", { precision: 12, scale: 3 }), // max storage
  unitCost: numeric("unit_cost", { precision: 10, scale: 4 }),
  currency: text("currency").default("USD"),
  lastCountDate: timestamp("last_count_date"),
  lastCountQuantity: numeric("last_count_quantity", { precision: 12, scale: 3 }),
  isActive: boolean("is_active").default(true).notNull(),
  notes: text("notes"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertInventoryItemSchema = createInsertSchema(inventoryItems).omit({
  id: true,
  updatedAt: true,
});
export type InsertInventoryItem = z.infer<typeof insertInventoryItemSchema>;
export type InventoryItem = typeof inventoryItems.$inferSelect;

// Inventory Movements (every stock change logged)
export const inventoryMovements = pgTable("inventory_movements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  inventoryItemId: varchar("inventory_item_id").notNull(),
  essenceUnitId: varchar("essence_unit_id").notNull(),
  movementType: text("movement_type").notNull(), // received, sold, wasted, transferred, adjusted, returned, counted
  quantity: numeric("quantity", { precision: 12, scale: 3 }).notNull(), // positive = in, negative = out
  quantityBefore: numeric("quantity_before", { precision: 12, scale: 3 }).notNull(),
  quantityAfter: numeric("quantity_after", { precision: 12, scale: 3 }).notNull(),
  referenceType: text("reference_type"), // purchase_order, pos_transaction, waste_report, transfer, count
  referenceId: varchar("reference_id"),
  reasonCode: text("reason_code"), // for adjustments: expired, damaged, spillage, theft_suspected, count_variance
  employeeId: varchar("employee_id").notNull(),
  supervisorApproval: varchar("supervisor_approval"),
  approvedAt: timestamp("approved_at"),
  photoUrl: text("photo_url"), // evidence photo for waste/damage
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertInventoryMovementSchema = createInsertSchema(inventoryMovements).omit({
  id: true,
  createdAt: true,
});
export type InsertInventoryMovement = z.infer<typeof insertInventoryMovementSchema>;
export type InventoryMovement = typeof inventoryMovements.$inferSelect;

// Waste Reports (detailed waste tracking)
export const wasteReports = pgTable("waste_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  essenceUnitId: varchar("essence_unit_id").notNull(),
  inventoryItemId: varchar("inventory_item_id").notNull(),
  quantity: numeric("quantity", { precision: 12, scale: 3 }).notNull(),
  unit: text("unit").notNull(),
  estimatedCost: numeric("estimated_cost", { precision: 10, scale: 2 }),
  currency: text("currency").default("USD"),
  wasteReason: text("waste_reason").notNull(), // expired, dropped, contaminated, equipment_failure, customer_return, spillage, other
  wasteCategory: text("waste_category").notNull(), // avoidable, unavoidable, suspicious
  description: text("description").notNull(),
  photoUrl: text("photo_url"), // REQUIRED for suspicious waste
  photoUrl2: text("photo_url_2"),
  videoUrl: text("video_url"),
  reportedBy: varchar("reported_by").notNull(),
  witnessEmployeeId: varchar("witness_employee_id"), // required for high-value items
  supervisorId: varchar("supervisor_id"),
  supervisorApproval: text("supervisor_approval"), // pending, approved, rejected, escalated
  approvedAt: timestamp("approved_at"),
  rejectionReason: text("rejection_reason"),
  investigationRequired: boolean("investigation_required").default(false),
  investigationNotes: text("investigation_notes"),
  reportedAt: timestamp("reported_at").defaultNow().notNull(),
});

export const insertWasteReportSchema = createInsertSchema(wasteReports).omit({
  id: true,
  reportedAt: true,
  supervisorApproval: true,
});
export type InsertWasteReport = z.infer<typeof insertWasteReportSchema>;
export type WasteReport = typeof wasteReports.$inferSelect;

// Stock Counts (scheduled physical inventory counts)
export const stockCounts = pgTable("stock_counts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  essenceUnitId: varchar("essence_unit_id").notNull(),
  countType: text("count_type").notNull(), // daily_spot, weekly_full, monthly_full, audit, random
  scheduledDate: timestamp("scheduled_date").notNull(),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  countedBy: varchar("counted_by"),
  verifiedBy: varchar("verified_by"),
  status: text("status").notNull().default("scheduled"), // scheduled, in_progress, completed, verified, discrepancy_found
  totalItemsCounted: integer("total_items_counted").default(0),
  variancesFound: integer("variances_found").default(0),
  totalVarianceValue: numeric("total_variance_value", { precision: 12, scale: 2 }),
  currency: text("currency").default("USD"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertStockCountSchema = createInsertSchema(stockCounts).omit({
  id: true,
  createdAt: true,
  totalItemsCounted: true,
  variancesFound: true,
});
export type InsertStockCount = z.infer<typeof insertStockCountSchema>;
export type StockCount = typeof stockCounts.$inferSelect;

// Stock Count Items (individual item counts)
export const stockCountItems = pgTable("stock_count_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  stockCountId: varchar("stock_count_id").notNull(),
  inventoryItemId: varchar("inventory_item_id").notNull(),
  expectedQuantity: numeric("expected_quantity", { precision: 12, scale: 3 }).notNull(),
  countedQuantity: numeric("counted_quantity", { precision: 12, scale: 3 }).notNull(),
  variance: numeric("variance", { precision: 12, scale: 3 }).notNull(),
  variancePercent: numeric("variance_percent", { precision: 8, scale: 2 }),
  varianceValue: numeric("variance_value", { precision: 10, scale: 2 }),
  currency: text("currency").default("USD"),
  varianceReason: text("variance_reason"),
  photoUrl: text("photo_url"),
  requiresInvestigation: boolean("requires_investigation").default(false),
  countedAt: timestamp("counted_at").defaultNow().notNull(),
});

export const insertStockCountItemSchema = createInsertSchema(stockCountItems).omit({
  id: true,
  countedAt: true,
});
export type InsertStockCountItem = z.infer<typeof insertStockCountItemSchema>;
export type StockCountItem = typeof stockCountItems.$inferSelect;

// =====================================================
// PHASE 8: OPERATIONAL ALERTS
// =====================================================

// Operational Alerts (real-time monitoring)
export const operationalAlerts = pgTable("operational_alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  alertType: text("alert_type").notNull(), // timesheet, inventory, pos, compliance, security
  severity: text("severity").notNull(), // info, warning, critical, emergency
  category: text("category").notNull(), // late_arrival, early_departure, geofence_violation, inventory_variance, void_transaction, suspicious_activity
  title: text("title").notNull(),
  description: text("description").notNull(),
  essenceUnitId: varchar("essence_unit_id"),
  employeeId: varchar("employee_id"),
  referenceType: text("reference_type"), // timesheet_entry, inventory_movement, pos_transaction, waste_report
  referenceId: varchar("reference_id"),
  isRead: boolean("is_read").default(false),
  isAcknowledged: boolean("is_acknowledged").default(false),
  acknowledgedBy: varchar("acknowledged_by"),
  acknowledgedAt: timestamp("acknowledged_at"),
  isResolved: boolean("is_resolved").default(false),
  resolvedBy: varchar("resolved_by"),
  resolvedAt: timestamp("resolved_at"),
  resolutionNotes: text("resolution_notes"),
  metadata: text("metadata"), // JSON for additional context
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at"),
});

export const insertOperationalAlertSchema = createInsertSchema(operationalAlerts).omit({
  id: true,
  createdAt: true,
  isRead: true,
  isAcknowledged: true,
  isResolved: true,
});
export type InsertOperationalAlert = z.infer<typeof insertOperationalAlertSchema>;
export type OperationalAlert = typeof operationalAlerts.$inferSelect;

// =====================================================
// PHASE 9: AI MONITORING & ANALYTICS (GEMINI INTEGRATION)
// =====================================================

// System Logs (comprehensive logging for all operations)
export const systemLogs = pgTable("system_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  logLevel: text("log_level").notNull(), // debug, info, warning, error, critical
  category: text("category").notNull(), // api, auth, pos, inventory, timesheet, translation, payment, system
  source: text("source").notNull(), // endpoint path, component name, service name
  message: text("message").notNull(),
  details: text("details"), // JSON stringified additional data
  userId: varchar("user_id"),
  employeeId: varchar("employee_id"),
  essenceUnitId: varchar("essence_unit_id"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  requestMethod: text("request_method"),
  requestPath: text("request_path"),
  responseStatus: integer("response_status"),
  responseTime: integer("response_time"), // milliseconds
  sessionId: varchar("session_id"),
  traceId: varchar("trace_id"), // for distributed tracing
  language: text("language"), // en, ar, fr, etc.
  region: text("region"), // AUS, UAE, EUR, etc.
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSystemLogSchema = createInsertSchema(systemLogs).omit({
  id: true,
  createdAt: true,
});
export type InsertSystemLog = z.infer<typeof insertSystemLogSchema>;
export type SystemLog = typeof systemLogs.$inferSelect;

// AI Analysis Reports (Gemini-generated insights)
export const aiAnalysisReports = pgTable("ai_analysis_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  reportType: text("report_type").notNull(), // transaction_pattern, inventory_anomaly, user_behavior, translation_quality, sales_forecast, risk_assessment, performance_summary
  scope: text("scope").notNull(), // global, region, unit, employee
  scopeId: varchar("scope_id"), // region code, unit id, or employee id
  title: text("title").notNull(),
  summary: text("summary").notNull(), // AI-generated summary
  findings: text("findings").notNull(), // JSON array of key findings
  recommendations: text("recommendations"), // JSON array of recommendations
  riskLevel: text("risk_level"), // low, medium, high, critical
  confidenceScore: numeric("confidence_score", { precision: 5, scale: 2 }), // 0-100
  dataPointsAnalyzed: integer("data_points_analyzed"),
  timeRangeStart: timestamp("time_range_start"),
  timeRangeEnd: timestamp("time_range_end"),
  modelUsed: text("model_used").default("gemini-2.5-flash"),
  processingTime: integer("processing_time"), // milliseconds
  status: text("status").notNull().default("completed"), // pending, processing, completed, failed
  isActionRequired: boolean("is_action_required").default(false),
  actionTakenBy: varchar("action_taken_by"),
  actionTakenAt: timestamp("action_taken_at"),
  actionNotes: text("action_notes"),
  metadata: text("metadata"), // JSON for additional context
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at"),
});

export const insertAiAnalysisReportSchema = createInsertSchema(aiAnalysisReports).omit({
  id: true,
  createdAt: true,
  status: true,
});
export type InsertAiAnalysisReport = z.infer<typeof insertAiAnalysisReportSchema>;
export type AiAnalysisReport = typeof aiAnalysisReports.$inferSelect;

// Translation Logs (multi-language quality tracking)
export const translationLogs = pgTable("translation_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sourceLanguage: text("source_language").notNull().default("en"),
  targetLanguage: text("target_language").notNull(),
  translationKey: text("translation_key").notNull(), // the i18n key
  sourceText: text("source_text").notNull(),
  translatedText: text("translated_text").notNull(),
  translationType: text("translation_type").notNull(), // static, dynamic, ai_generated
  context: text("context"), // where translation was used
  qualityScore: numeric("quality_score", { precision: 5, scale: 2 }), // AI-assessed quality 0-100
  isReviewed: boolean("is_reviewed").default(false),
  reviewedBy: varchar("reviewed_by"),
  reviewedAt: timestamp("reviewed_at"),
  reviewNotes: text("review_notes"),
  usageCount: integer("usage_count").default(1),
  lastUsedAt: timestamp("last_used_at"),
  essenceUnitId: varchar("essence_unit_id"),
  region: text("region"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTranslationLogSchema = createInsertSchema(translationLogs).omit({
  id: true,
  createdAt: true,
  usageCount: true,
  isReviewed: true,
});
export type InsertTranslationLog = z.infer<typeof insertTranslationLogSchema>;
export type TranslationLog = typeof translationLogs.$inferSelect;

// Transaction Monitoring (AI-powered fraud detection and pattern analysis)
export const transactionMonitoring = pgTable("transaction_monitoring", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  transactionId: varchar("transaction_id").notNull(),
  posSessionId: varchar("pos_session_id"),
  essenceUnitId: varchar("essence_unit_id").notNull(),
  employeeId: varchar("employee_id"),
  customerId: varchar("customer_id"),
  transactionType: text("transaction_type").notNull(), // sale, refund, void, discount, comp
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("USD"),
  paymentMethod: text("payment_method"),
  riskScore: numeric("risk_score", { precision: 5, scale: 2 }), // 0-100 AI-calculated
  riskFactors: text("risk_factors"), // JSON array of detected risk factors
  isAnomaly: boolean("is_anomaly").default(false),
  anomalyType: text("anomaly_type"), // unusual_amount, unusual_time, unusual_pattern, frequent_void, etc.
  anomalyDetails: text("anomaly_details"),
  aiAnalysis: text("ai_analysis"), // Gemini's detailed analysis
  requiresReview: boolean("requires_review").default(false),
  reviewedBy: varchar("reviewed_by"),
  reviewedAt: timestamp("reviewed_at"),
  reviewOutcome: text("review_outcome"), // approved, flagged, escalated, false_positive
  reviewNotes: text("review_notes"),
  relatedTransactions: text("related_transactions"), // JSON array of related transaction IDs
  metadata: text("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTransactionMonitoringSchema = createInsertSchema(transactionMonitoring).omit({
  id: true,
  createdAt: true,
  isAnomaly: true,
  requiresReview: true,
});
export type InsertTransactionMonitoring = z.infer<typeof insertTransactionMonitoringSchema>;
export type TransactionMonitoring = typeof transactionMonitoring.$inferSelect;

// User Error Tracking (customer and employee issue monitoring)
export const userErrorTracking = pgTable("user_error_tracking", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  errorType: text("error_type").notNull(), // ui_error, api_error, validation_error, auth_error, payment_error, timeout
  errorCode: text("error_code"),
  errorMessage: text("error_message").notNull(),
  stackTrace: text("stack_trace"),
  userId: varchar("user_id"),
  userType: text("user_type"), // customer, employee, admin
  sessionId: varchar("session_id"),
  page: text("page"), // current page/route
  component: text("component"), // UI component that triggered error
  action: text("action"), // what user was trying to do
  inputData: text("input_data"), // sanitized input that caused error
  browserInfo: text("browser_info"),
  deviceType: text("device_type"), // mobile, tablet, desktop
  osInfo: text("os_info"),
  language: text("language"),
  essenceUnitId: varchar("essence_unit_id"),
  region: text("region"),
  severity: text("severity").notNull().default("medium"), // low, medium, high, critical
  isResolved: boolean("is_resolved").default(false),
  resolvedBy: varchar("resolved_by"),
  resolvedAt: timestamp("resolved_at"),
  resolutionType: text("resolution_type"), // auto_recovered, user_retry, support_resolved, code_fix
  occurrenceCount: integer("occurrence_count").default(1),
  firstOccurrence: timestamp("first_occurrence").defaultNow().notNull(),
  lastOccurrence: timestamp("last_occurrence").defaultNow().notNull(),
  aiAnalysis: text("ai_analysis"), // Gemini's root cause analysis
  suggestedFix: text("suggested_fix"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserErrorTrackingSchema = createInsertSchema(userErrorTracking).omit({
  id: true,
  createdAt: true,
  isResolved: true,
  occurrenceCount: true,
  firstOccurrence: true,
  lastOccurrence: true,
});
export type InsertUserErrorTracking = z.infer<typeof insertUserErrorTrackingSchema>;
export type UserErrorTracking = typeof userErrorTracking.$inferSelect;

// Ecosystem Health Metrics (aggregated system health data)
export const ecosystemHealthMetrics = pgTable("ecosystem_health_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  metricType: text("metric_type").notNull(), // api_latency, error_rate, transaction_volume, active_users, pos_uptime, sync_status
  scope: text("scope").notNull(), // global, region, unit
  scopeId: varchar("scope_id"),
  metricName: text("metric_name").notNull(),
  metricValue: numeric("metric_value", { precision: 15, scale: 4 }).notNull(),
  metricUnit: text("metric_unit"), // ms, percent, count, currency
  threshold: numeric("threshold", { precision: 15, scale: 4 }),
  thresholdType: text("threshold_type"), // min, max, range
  status: text("status").notNull(), // healthy, degraded, critical
  trend: text("trend"), // improving, stable, degrading
  comparedToPrevious: numeric("compared_to_previous", { precision: 10, scale: 2 }), // percentage change
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),
  periodType: text("period_type").notNull(), // hourly, daily, weekly, monthly
  aiInsight: text("ai_insight"), // Gemini's interpretation
  metadata: text("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertEcosystemHealthMetricSchema = createInsertSchema(ecosystemHealthMetrics).omit({
  id: true,
  createdAt: true,
});
export type InsertEcosystemHealthMetric = z.infer<typeof insertEcosystemHealthMetricSchema>;
export type EcosystemHealthMetric = typeof ecosystemHealthMetrics.$inferSelect;

// AI Monitoring Tasks (scheduled AI analysis jobs)
export const aiMonitoringTasks = pgTable("ai_monitoring_tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  taskType: text("task_type").notNull(), // transaction_analysis, inventory_audit, translation_review, error_analysis, health_check, sales_forecast
  taskName: text("task_name").notNull(),
  description: text("description"),
  schedule: text("schedule"), // cron expression
  isActive: boolean("is_active").default(true),
  lastRunAt: timestamp("last_run_at"),
  lastRunStatus: text("last_run_status"), // success, failed, partial
  lastRunDuration: integer("last_run_duration"), // milliseconds
  nextRunAt: timestamp("next_run_at"),
  targetScope: text("target_scope"), // global, region, unit
  targetScopeId: varchar("target_scope_id"),
  configuration: text("configuration"), // JSON task-specific settings
  notifyOnComplete: boolean("notify_on_complete").default(false),
  notifyRecipients: text("notify_recipients"), // JSON array of email/user IDs
  createdBy: varchar("created_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertAiMonitoringTaskSchema = createInsertSchema(aiMonitoringTasks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastRunAt: true,
  lastRunStatus: true,
  lastRunDuration: true,
});
export type InsertAiMonitoringTask = z.infer<typeof insertAiMonitoringTaskSchema>;
export type AiMonitoringTask = typeof aiMonitoringTasks.$inferSelect;

// Real-time Monitoring Dashboard Data (cached aggregated data for fast dashboard loading)
export const monitoringDashboardCache = pgTable("monitoring_dashboard_cache", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  dashboardType: text("dashboard_type").notNull(), // overview, transactions, errors, translations, health
  scope: text("scope").notNull(), // global, region, unit
  scopeId: varchar("scope_id"),
  cacheKey: text("cache_key").notNull(),
  data: text("data").notNull(), // JSON cached data
  generatedAt: timestamp("generated_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  isStale: boolean("is_stale").default(false),
});

// ============================================
// MULTI-COUNTRY COMPLIANCE SYSTEM
// ============================================

// Country Compliance Configurations
export const countryConfigurations = pgTable("country_configurations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  countryCode: text("country_code").notNull().unique(), // SA, IL, GR, AE
  countryName: text("country_name").notNull(),
  region: text("region").notNull(), // middle_east, europe, gcc
  timezone: text("timezone").notNull(),
  currency: text("currency").notNull(),
  currencySymbol: text("currency_symbol").notNull(),
  primaryLanguage: text("primary_language").notNull(),
  secondaryLanguages: text("secondary_languages"), // JSON array
  rtlSupport: boolean("rtl_support").default(false),
  vatRate: numeric("vat_rate", { precision: 5, scale: 2 }),
  taxRegistrationRequired: boolean("tax_registration_required").default(true),
  foodSafetyAuthority: text("food_safety_authority").notNull(),
  dataPrivacyLaw: text("data_privacy_law").notNull(),
  dataResidencyRequired: boolean("data_residency_required").default(false),
  halalCertificationRequired: boolean("halal_certification_required").default(false),
  kosherCertificationAvailable: boolean("kosher_certification_available").default(false),
  minimumWage: numeric("minimum_wage", { precision: 10, scale: 2 }),
  minimumWageCurrency: text("minimum_wage_currency"),
  workingHoursPerWeek: integer("working_hours_per_week"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCountryConfigurationSchema = createInsertSchema(countryConfigurations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertCountryConfiguration = z.infer<typeof insertCountryConfigurationSchema>;
export type CountryConfiguration = typeof countryConfigurations.$inferSelect;

// Regulatory Permits & Licenses
export const regulatoryPermits = pgTable("regulatory_permits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  countryCode: text("country_code").notNull(),
  essenceUnitId: varchar("essence_unit_id"),
  permitType: text("permit_type").notNull(), // food_trade, health_certificate, halal, business_license, import_permit
  permitName: text("permit_name").notNull(),
  issuingAuthority: text("issuing_authority").notNull(),
  permitNumber: text("permit_number"),
  applicationDate: timestamp("application_date"),
  issueDate: timestamp("issue_date"),
  expiryDate: timestamp("expiry_date"),
  renewalLeadDays: integer("renewal_lead_days").default(30),
  status: text("status").notNull(), // pending, approved, expired, rejected, renewal_due
  documentUrl: text("document_url"),
  notes: text("notes"),
  cost: numeric("cost", { precision: 10, scale: 2 }),
  costCurrency: text("cost_currency"),
  reminderSent: boolean("reminder_sent").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertRegulatoryPermitSchema = createInsertSchema(regulatoryPermits).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertRegulatoryPermit = z.infer<typeof insertRegulatoryPermitSchema>;
export type RegulatoryPermit = typeof regulatoryPermits.$inferSelect;

// Tax Configuration per Country
export const taxConfigurations = pgTable("tax_configurations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  countryCode: text("country_code").notNull(),
  taxType: text("tax_type").notNull(), // vat, sales_tax, service_tax, withholding
  taxName: text("tax_name").notNull(),
  taxRate: numeric("tax_rate", { precision: 5, scale: 2 }).notNull(),
  appliesToFood: boolean("applies_to_food").default(true),
  appliesToTakeaway: boolean("applies_to_takeaway").default(true),
  appliesToDineIn: boolean("applies_to_dine_in").default(true),
  minimumThreshold: numeric("minimum_threshold", { precision: 10, scale: 2 }),
  filingFrequency: text("filing_frequency").notNull(), // monthly, quarterly, annually
  filingDeadlineDays: integer("filing_deadline_days"),
  taxRegistrationNumber: text("tax_registration_number"),
  effectiveFrom: timestamp("effective_from").notNull(),
  effectiveTo: timestamp("effective_to"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTaxConfigurationSchema = createInsertSchema(taxConfigurations).omit({
  id: true,
  createdAt: true,
});
export type InsertTaxConfiguration = z.infer<typeof insertTaxConfigurationSchema>;
export type TaxConfiguration = typeof taxConfigurations.$inferSelect;

// ============================================
// FOOD SAFETY & FRIDGE MONITORING SYSTEM
// ============================================

// Fridge/Freezer Equipment Registry
export const refrigerationUnits = pgTable("refrigeration_units", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  essenceUnitId: varchar("essence_unit_id").notNull(),
  equipmentCode: text("equipment_code").notNull(),
  equipmentType: text("equipment_type").notNull(), // freezer, fridge, blast_chiller, display_case
  manufacturer: text("manufacturer"),
  model: text("model"),
  serialNumber: text("serial_number"),
  capacity: text("capacity"),
  targetTemperature: numeric("target_temperature", { precision: 4, scale: 1 }).notNull(),
  minTemperature: numeric("min_temperature", { precision: 4, scale: 1 }).notNull(),
  maxTemperature: numeric("max_temperature", { precision: 4, scale: 1 }).notNull(),
  location: text("location").notNull(),
  installationDate: timestamp("installation_date"),
  lastMaintenanceDate: timestamp("last_maintenance_date"),
  nextMaintenanceDate: timestamp("next_maintenance_date"),
  warrantyExpiry: timestamp("warranty_expiry"),
  isActive: boolean("is_active").default(true),
  hasAlarmSystem: boolean("has_alarm_system").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertRefrigerationUnitSchema = createInsertSchema(refrigerationUnits).omit({
  id: true,
  createdAt: true,
});
export type InsertRefrigerationUnit = z.infer<typeof insertRefrigerationUnitSchema>;
export type RefrigerationUnit = typeof refrigerationUnits.$inferSelect;

// Temperature Readings (HACCP compliance)
export const temperatureReadings = pgTable("temperature_readings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  refrigerationUnitId: varchar("refrigeration_unit_id").notNull(),
  temperature: numeric("temperature", { precision: 4, scale: 1 }).notNull(),
  humidity: numeric("humidity", { precision: 4, scale: 1 }),
  readingType: text("reading_type").notNull(), // automatic, manual, calibration
  recordedBy: varchar("recorded_by"),
  isWithinRange: boolean("is_within_range").notNull(),
  alertTriggered: boolean("alert_triggered").default(false),
  alertAcknowledgedBy: varchar("alert_acknowledged_by"),
  alertAcknowledgedAt: timestamp("alert_acknowledged_at"),
  notes: text("notes"),
  recordedAt: timestamp("recorded_at").defaultNow().notNull(),
});

export const insertTemperatureReadingSchema = createInsertSchema(temperatureReadings).omit({
  id: true,
  recordedAt: true,
});
export type InsertTemperatureReading = z.infer<typeof insertTemperatureReadingSchema>;
export type TemperatureReading = typeof temperatureReadings.$inferSelect;

// Food Ingredient Inventory with Expiry Tracking
export const foodIngredients = pgTable("food_ingredients", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  essenceUnitId: varchar("essence_unit_id").notNull(),
  refrigerationUnitId: varchar("refrigeration_unit_id"),
  ingredientName: text("ingredient_name").notNull(),
  ingredientCategory: text("ingredient_category").notNull(), // frozen_fruit, powder, topping, sauce, waffle, dairy
  sku: text("sku"),
  batchNumber: text("batch_number"),
  supplier: text("supplier"),
  quantity: numeric("quantity", { precision: 10, scale: 2 }).notNull(),
  unit: text("unit").notNull(), // kg, g, pieces, liters
  purchaseDate: timestamp("purchase_date"),
  productionDate: timestamp("production_date"),
  expiryDate: timestamp("expiry_date").notNull(),
  openedDate: timestamp("opened_date"),
  useByDaysAfterOpening: integer("use_by_days_after_opening"),
  storageTemperature: numeric("storage_temperature", { precision: 4, scale: 1 }),
  isAllergen: boolean("is_allergen").default(false),
  allergenInfo: text("allergen_info"),
  isOrganic: boolean("is_organic").default(false),
  isHalal: boolean("is_halal").default(false),
  isKosher: boolean("is_kosher").default(false),
  status: text("status").notNull(), // in_stock, low_stock, expired, disposed, quarantine
  aiExpiryAlertSent: boolean("ai_expiry_alert_sent").default(false),
  disposedAt: timestamp("disposed_at"),
  disposedBy: varchar("disposed_by"),
  disposalReason: text("disposal_reason"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertFoodIngredientSchema = createInsertSchema(foodIngredients).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertFoodIngredient = z.infer<typeof insertFoodIngredientSchema>;
export type FoodIngredient = typeof foodIngredients.$inferSelect;

// AI Food Safety Alerts
export const foodSafetyAlerts = pgTable("food_safety_alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  essenceUnitId: varchar("essence_unit_id").notNull(),
  alertType: text("alert_type").notNull(), // expiry_warning, expiry_critical, temperature_breach, opened_item_expiring, low_stock
  severity: text("severity").notNull(), // low, medium, high, critical
  ingredientId: varchar("ingredient_id"),
  refrigerationUnitId: varchar("refrigeration_unit_id"),
  title: text("title").notNull(),
  message: text("message").notNull(),
  aiRecommendation: text("ai_recommendation"),
  actionRequired: text("action_required"),
  dueBy: timestamp("due_by"),
  status: text("status").notNull(), // open, acknowledged, resolved, dismissed
  acknowledgedBy: varchar("acknowledged_by"),
  acknowledgedAt: timestamp("acknowledged_at"),
  resolvedBy: varchar("resolved_by"),
  resolvedAt: timestamp("resolved_at"),
  resolutionNotes: text("resolution_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertFoodSafetyAlertSchema = createInsertSchema(foodSafetyAlerts).omit({
  id: true,
  createdAt: true,
});
export type InsertFoodSafetyAlert = z.infer<typeof insertFoodSafetyAlertSchema>;
export type FoodSafetyAlert = typeof foodSafetyAlerts.$inferSelect;

// ============================================
// FINANCIAL REPORTING & AI BOOKKEEPING
// ============================================

// Financial Transactions (ledger entries)
export const financialTransactions = pgTable("financial_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  essenceUnitId: varchar("essence_unit_id"),
  countryCode: text("country_code").notNull(),
  transactionType: text("transaction_type").notNull(), // sale, refund, expense, payroll, tax_payment, supplier_payment
  category: text("category").notNull(), // revenue, cogs, operating_expense, payroll_expense, tax_liability
  subcategory: text("subcategory"),
  description: text("description").notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  currency: text("currency").notNull(),
  exchangeRate: numeric("exchange_rate", { precision: 10, scale: 6 }),
  amountInBaseCurrency: numeric("amount_in_base_currency", { precision: 12, scale: 2 }),
  baseCurrency: text("base_currency").default("USD"),
  taxAmount: numeric("tax_amount", { precision: 10, scale: 2 }),
  taxRate: numeric("tax_rate", { precision: 5, scale: 2 }),
  referenceType: text("reference_type"), // pos_transaction, invoice, payroll_run, expense_claim
  referenceId: varchar("reference_id"),
  vendorSupplier: text("vendor_supplier"),
  paymentMethod: text("payment_method"),
  paymentReference: text("payment_reference"),
  isReconciled: boolean("is_reconciled").default(false),
  reconciledBy: varchar("reconciled_by"),
  reconciledAt: timestamp("reconciled_at"),
  aiCategorized: boolean("ai_categorized").default(false),
  aiConfidence: numeric("ai_confidence", { precision: 3, scale: 2 }),
  fiscalYear: text("fiscal_year"),
  fiscalPeriod: text("fiscal_period"),
  transactionDate: timestamp("transaction_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertFinancialTransactionSchema = createInsertSchema(financialTransactions).omit({
  id: true,
  createdAt: true,
});
export type InsertFinancialTransaction = z.infer<typeof insertFinancialTransactionSchema>;
export type FinancialTransaction = typeof financialTransactions.$inferSelect;

// Financial Reports (AI-generated)
export const financialReports = pgTable("financial_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  reportType: text("report_type").notNull(), // daily_summary, weekly_summary, monthly_pnl, tax_filing, cash_flow, variance_analysis
  countryCode: text("country_code"),
  essenceUnitId: varchar("essence_unit_id"),
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),
  currency: text("currency").notNull(),
  totalRevenue: numeric("total_revenue", { precision: 12, scale: 2 }),
  totalExpenses: numeric("total_expenses", { precision: 12, scale: 2 }),
  netProfit: numeric("net_profit", { precision: 12, scale: 2 }),
  taxLiability: numeric("tax_liability", { precision: 10, scale: 2 }),
  reportData: text("report_data"), // JSON detailed breakdown
  aiInsights: text("ai_insights"),
  aiRecommendations: text("ai_recommendations"),
  status: text("status").notNull(), // draft, generated, reviewed, approved, submitted
  approvedBy: varchar("approved_by"),
  approvedAt: timestamp("approved_at"),
  submittedAt: timestamp("submitted_at"),
  recipientEmails: text("recipient_emails"), // JSON array
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertFinancialReportSchema = createInsertSchema(financialReports).omit({
  id: true,
  createdAt: true,
});
export type InsertFinancialReport = z.infer<typeof insertFinancialReportSchema>;
export type FinancialReport = typeof financialReports.$inferSelect;

// ============================================
// HR & WORKFORCE AUTOMATION
// ============================================

// Employee Extended Profile
export const employeeProfiles = pgTable("employee_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  employeeId: varchar("employee_id").notNull().unique(),
  employmentType: text("employment_type").notNull(), // full_time, part_time, casual, student, subcontractor
  contractType: text("contract_type").notNull(), // permanent, fixed_term, zero_hours, freelance
  countryCode: text("country_code").notNull(),
  essenceUnitId: varchar("essence_unit_id"),
  dateOfBirth: timestamp("date_of_birth"),
  nationalId: text("national_id"),
  workPermitNumber: text("work_permit_number"),
  workPermitExpiry: timestamp("work_permit_expiry"),
  emergencyContactName: text("emergency_contact_name"),
  emergencyContactPhone: text("emergency_contact_phone"),
  bankAccountNumber: text("bank_account_number"),
  bankName: text("bank_name"),
  taxId: text("tax_id"),
  hourlyRate: numeric("hourly_rate", { precision: 8, scale: 2 }),
  monthlySalary: numeric("monthly_salary", { precision: 10, scale: 2 }),
  currency: text("currency"),
  maxHoursPerWeek: integer("max_hours_per_week"),
  preferredShifts: text("preferred_shifts"), // JSON array [morning, afternoon, night]
  availableDays: text("available_days"), // JSON array [mon, tue, wed, thu, fri, sat, sun]
  canWorkOvertime: boolean("can_work_overtime").default(true),
  certifications: text("certifications"), // JSON array [food_safety, first_aid, etc]
  whatsappNumber: text("whatsapp_number"),
  notificationPreference: text("notification_preference").default("whatsapp"), // whatsapp, email, sms, push
  isEligibleForShiftCover: boolean("is_eligible_for_shift_cover").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertEmployeeProfileSchema = createInsertSchema(employeeProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertEmployeeProfile = z.infer<typeof insertEmployeeProfileSchema>;
export type EmployeeProfile = typeof employeeProfiles.$inferSelect;

// Shift Schedules (24/7 operations)
export const shiftSchedules = pgTable("shift_schedules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  essenceUnitId: varchar("essence_unit_id").notNull(),
  shiftName: text("shift_name").notNull(), // morning, afternoon, night
  shiftNumber: integer("shift_number").notNull(), // 1, 2, 3 for 24/7
  startTime: text("start_time").notNull(), // 06:00
  endTime: text("end_time").notNull(), // 14:00
  breakDurationMinutes: integer("break_duration_minutes").default(30),
  minimumStaff: integer("minimum_staff").notNull(),
  maximumStaff: integer("maximum_staff"),
  isSupervisorRequired: boolean("is_supervisor_required").default(true),
  dayOfWeek: integer("day_of_week"), // 0-6 (Sunday-Saturday), null for all days
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertShiftScheduleSchema = createInsertSchema(shiftSchedules).omit({
  id: true,
  createdAt: true,
});
export type InsertShiftSchedule = z.infer<typeof insertShiftScheduleSchema>;
export type ShiftSchedule = typeof shiftSchedules.$inferSelect;

// Sick Leave / Absence Requests with Cascade Replacement
export const absenceRequests = pgTable("absence_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  employeeId: varchar("employee_id").notNull(),
  essenceUnitId: varchar("essence_unit_id").notNull(),
  absenceType: text("absence_type").notNull(), // sick, annual_leave, emergency, personal, unpaid
  reason: text("reason"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  affectedShiftIds: text("affected_shift_ids"), // JSON array of shift IDs
  status: text("status").notNull(), // pending, approved, rejected, covered, partially_covered
  replacementEmployeeId: varchar("replacement_employee_id"),
  replacementConfirmedAt: timestamp("replacement_confirmed_at"),
  cascadeAttempts: integer("cascade_attempts").default(0),
  cascadeHistory: text("cascade_history"), // JSON array of contacted employees
  urgencyLevel: text("urgency_level").notNull(), // immediate (within 2 hours), same_day, advance_notice
  isEmergency: boolean("is_emergency").default(false),
  medicalCertificateRequired: boolean("medical_certificate_required").default(false),
  medicalCertificateUrl: text("medical_certificate_url"),
  approvedBy: varchar("approved_by"),
  approvedAt: timestamp("approved_at"),
  aiReplacementSuggestions: text("ai_replacement_suggestions"), // JSON array
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertAbsenceRequestSchema = createInsertSchema(absenceRequests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertAbsenceRequest = z.infer<typeof insertAbsenceRequestSchema>;
export type AbsenceRequest = typeof absenceRequests.$inferSelect;

// Shift Cover Requests (automated cascade notifications)
export const shiftCoverRequests = pgTable("shift_cover_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  absenceRequestId: varchar("absence_request_id").notNull(),
  targetEmployeeId: varchar("target_employee_id").notNull(),
  shiftDate: timestamp("shift_date").notNull(),
  shiftScheduleId: varchar("shift_schedule_id"),
  notificationChannel: text("notification_channel").notNull(), // whatsapp, email, sms, push
  notificationSentAt: timestamp("notification_sent_at"),
  responseDeadline: timestamp("response_deadline").notNull(),
  response: text("response"), // accepted, declined, no_response
  respondedAt: timestamp("responded_at"),
  orderInCascade: integer("order_in_cascade").notNull(),
  bonusOffered: numeric("bonus_offered", { precision: 8, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertShiftCoverRequestSchema = createInsertSchema(shiftCoverRequests).omit({
  id: true,
  createdAt: true,
});
export type InsertShiftCoverRequest = z.infer<typeof insertShiftCoverRequestSchema>;
export type ShiftCoverRequest = typeof shiftCoverRequests.$inferSelect;

// ============================================
// AUTHENTICATION SYSTEM (Multi-method)
// ============================================

// User Authentication Methods
export const userAuthMethods = pgTable("user_auth_methods", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  userType: text("user_type").notNull(), // customer, employee, admin
  authMethod: text("auth_method").notNull(), // google, whatsapp, passkey, biometric, email_magic_link
  authIdentifier: text("auth_identifier").notNull(), // google_id, phone_number, credential_id
  isVerified: boolean("is_verified").default(false),
  isPrimary: boolean("is_primary").default(false),
  lastUsedAt: timestamp("last_used_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at"),
  metadata: text("metadata"), // JSON additional auth data
});

export const insertUserAuthMethodSchema = createInsertSchema(userAuthMethods).omit({
  id: true,
  createdAt: true,
});
export type InsertUserAuthMethod = z.infer<typeof insertUserAuthMethodSchema>;
export type UserAuthMethod = typeof userAuthMethods.$inferSelect;

// WebAuthn Passkey Credentials
export const passkeyCredentials = pgTable("passkey_credentials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  credentialId: text("credential_id").notNull().unique(),
  publicKey: text("public_key").notNull(),
  counter: integer("counter").default(0),
  deviceType: text("device_type"), // platform, cross-platform
  transports: text("transports"), // JSON array [usb, ble, nfc, internal]
  backupEligible: boolean("backup_eligible").default(false),
  backupState: boolean("backup_state").default(false),
  deviceName: text("device_name"),
  lastUsedAt: timestamp("last_used_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPasskeyCredentialSchema = createInsertSchema(passkeyCredentials).omit({
  id: true,
  createdAt: true,
});
export type InsertPasskeyCredential = z.infer<typeof insertPasskeyCredentialSchema>;
export type PasskeyCredential = typeof passkeyCredentials.$inferSelect;

// OTP Verification Codes (WhatsApp/SMS)
export const otpVerifications = pgTable("otp_verifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  phoneNumber: text("phone_number").notNull(),
  countryCode: text("country_code").notNull(),
  otpCode: text("otp_code").notNull(),
  channel: text("channel").notNull(), // whatsapp, sms
  purpose: text("purpose").notNull(), // login, registration, verification
  expiresAt: timestamp("expires_at").notNull(),
  attempts: integer("attempts").default(0),
  isUsed: boolean("is_used").default(false),
  usedAt: timestamp("used_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertOtpVerificationSchema = createInsertSchema(otpVerifications).omit({
  id: true,
  createdAt: true,
});
export type InsertOtpVerification = z.infer<typeof insertOtpVerificationSchema>;
export type OtpVerification = typeof otpVerifications.$inferSelect;

// ============================================
// ENHANCED LOYALTY & VIP SYSTEM
// ============================================

// VIP Member Inbox
export const vipInboxMessages = pgTable("vip_inbox_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: varchar("customer_id").notNull(),
  messageType: text("message_type").notNull(), // welcome, promotion, reward, birthday, exclusive_offer, system
  subject: text("subject").notNull(),
  body: text("body").notNull(),
  actionUrl: text("action_url"),
  actionLabel: text("action_label"),
  isRead: boolean("is_read").default(false),
  readAt: timestamp("read_at"),
  isPinned: boolean("is_pinned").default(false),
  expiresAt: timestamp("expires_at"),
  priority: text("priority").default("normal"), // low, normal, high, urgent
  metadata: text("metadata"), // JSON for additional data
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertVipInboxMessageSchema = createInsertSchema(vipInboxMessages).omit({
  id: true,
  createdAt: true,
});
export type InsertVipInboxMessage = z.infer<typeof insertVipInboxMessageSchema>;
export type VipInboxMessage = typeof vipInboxMessages.$inferSelect;

// Push Notification Consents
export const notificationConsents = pgTable("notification_consents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: varchar("customer_id").notNull(),
  channel: text("channel").notNull(), // push, email, sms, whatsapp
  category: text("category").notNull(), // marketing, transactional, rewards, system
  isEnabled: boolean("is_enabled").default(false),
  consentGivenAt: timestamp("consent_given_at"),
  consentWithdrawnAt: timestamp("consent_withdrawn_at"),
  deviceToken: text("device_token"),
  deviceType: text("device_type"), // ios, android, web
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertNotificationConsentSchema = createInsertSchema(notificationConsents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertNotificationConsent = z.infer<typeof insertNotificationConsentSchema>;
export type NotificationConsent = typeof notificationConsents.$inferSelect;

// E-Gift Package Definitions
export const eGiftPackages = pgTable("egift_packages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  packageName: text("package_name").notNull(),
  packageTier: text("package_tier").notNull(), // standard, premium, luxury
  description: text("description").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull(),
  bonusPercentage: numeric("bonus_percentage", { precision: 5, scale: 2 }).default("0"),
  validityDays: integer("validity_days").notNull(),
  isTransferable: boolean("is_transferable").default(false),
  maxRedemptions: integer("max_redemptions").default(1),
  imageUrl: text("image_url"),
  themeColor: text("theme_color"),
  isActive: boolean("is_active").default(true),
  countryAvailability: text("country_availability"), // JSON array of country codes, null = all
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertEGiftPackageSchema = createInsertSchema(eGiftPackages).omit({
  id: true,
  createdAt: true,
});
export type InsertEGiftPackage = z.infer<typeof insertEGiftPackageSchema>;
export type EGiftPackage = typeof eGiftPackages.$inferSelect;

// E-Gift Purchases (non-transferable, one-time use tracking)
export const eGiftPurchases = pgTable("egift_purchases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  packageId: varchar("package_id").notNull(),
  purchaserCustomerId: varchar("purchaser_customer_id").notNull(),
  recipientEmail: text("recipient_email").notNull(),
  recipientName: text("recipient_name").notNull(),
  recipientPhone: text("recipient_phone"),
  giftCode: text("gift_code").notNull().unique(),
  personalMessage: text("personal_message"),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  bonusAmount: numeric("bonus_amount", { precision: 10, scale: 2 }).default("0"),
  totalValue: numeric("total_value", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull(),
  purchaseDate: timestamp("purchase_date").defaultNow().notNull(),
  expiryDate: timestamp("expiry_date").notNull(),
  status: text("status").notNull(), // purchased, delivered, redeemed, expired, refunded
  deliveredAt: timestamp("delivered_at"),
  redeemedAt: timestamp("redeemed_at"),
  redeemedByCustomerId: varchar("redeemed_by_customer_id"),
  redemptionEssenceUnitId: varchar("redemption_essence_unit_id"),
  isTransferAttempted: boolean("is_transfer_attempted").default(false),
  transferBlockedAt: timestamp("transfer_blocked_at"),
  paymentReference: text("payment_reference"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertEGiftPurchaseSchema = createInsertSchema(eGiftPurchases).omit({
  id: true,
  createdAt: true,
  purchaseDate: true,
});
export type InsertEGiftPurchase = z.infer<typeof insertEGiftPurchaseSchema>;
export type EGiftPurchase = typeof eGiftPurchases.$inferSelect;

// ============================================
// POS SCALE INTEGRATION & THEFT PREVENTION
// ============================================

// POS Scale Devices
export const posScaleDevices = pgTable("pos_scale_devices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  essenceUnitId: varchar("essence_unit_id").notNull(),
  deviceCode: text("device_code").notNull().unique(),
  manufacturer: text("manufacturer").notNull(),
  model: text("model").notNull(),
  serialNumber: text("serial_number"),
  connectionType: text("connection_type").notNull(), // usb, serial, ethernet, bluetooth
  ipAddress: text("ip_address"),
  portNumber: integer("port_number"),
  calibrationDate: timestamp("calibration_date"),
  nextCalibrationDue: timestamp("next_calibration_due"),
  certificationNumber: text("certification_number"), // NTEP or equivalent
  maxCapacity: numeric("max_capacity", { precision: 8, scale: 2 }),
  capacityUnit: text("capacity_unit").default("kg"),
  precision: numeric("precision", { precision: 4, scale: 3 }),
  isActive: boolean("is_active").default(true),
  lastReadingAt: timestamp("last_reading_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPosScaleDeviceSchema = createInsertSchema(posScaleDevices).omit({
  id: true,
  createdAt: true,
});
export type InsertPosScaleDevice = z.infer<typeof insertPosScaleDeviceSchema>;
export type PosScaleDevice = typeof posScaleDevices.$inferSelect;

// Theft Prevention Monitoring
export const theftAlerts = pgTable("theft_alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  essenceUnitId: varchar("essence_unit_id").notNull(),
  alertType: text("alert_type").notNull(), // weight_discrepancy, no_payment, void_pattern, free_product, inventory_mismatch
  severity: text("severity").notNull(), // low, medium, high, critical
  employeeId: varchar("employee_id"),
  customerId: varchar("customer_id"),
  posTransactionId: varchar("pos_transaction_id"),
  description: text("description").notNull(),
  evidenceData: text("evidence_data"), // JSON with weights, timestamps, amounts
  expectedValue: numeric("expected_value", { precision: 10, scale: 2 }),
  actualValue: numeric("actual_value", { precision: 10, scale: 2 }),
  variance: numeric("variance", { precision: 10, scale: 2 }),
  aiRiskScore: numeric("ai_risk_score", { precision: 3, scale: 2 }),
  aiAnalysis: text("ai_analysis"),
  status: text("status").notNull(), // open, investigating, confirmed, false_positive, resolved
  investigatedBy: varchar("investigated_by"),
  investigationNotes: text("investigation_notes"),
  resolvedBy: varchar("resolved_by"),
  resolvedAt: timestamp("resolved_at"),
  resolution: text("resolution"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTheftAlertSchema = createInsertSchema(theftAlerts).omit({
  id: true,
  createdAt: true,
});
export type InsertTheftAlert = z.infer<typeof insertTheftAlertSchema>;
export type TheftAlert = typeof theftAlerts.$inferSelect;

// =====================================================
// OCTOPUS BRAIN - AUTONOMOUS OPERATIONS SYSTEM
// =====================================================

// Cleaning Checklists - Master list of cleaning tasks per kiosk
export const cleaningChecklists = pgTable("cleaning_checklists", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  essenceUnitId: varchar("essence_unit_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  frequency: text("frequency").notNull(), // hourly, per_shift, daily, weekly, monthly
  shiftType: text("shift_type"), // morning, afternoon, night, all
  priority: text("priority").notNull().default("medium"), // low, medium, high, critical
  estimatedMinutes: integer("estimated_minutes").default(15),
  requiredPhotoEvidence: boolean("required_photo_evidence").default(true),
  requiredGpsVerification: boolean("required_gps_verification").default(true),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCleaningChecklistSchema = createInsertSchema(cleaningChecklists).omit({
  id: true,
  createdAt: true,
});
export type InsertCleaningChecklist = z.infer<typeof insertCleaningChecklistSchema>;
export type CleaningChecklist = typeof cleaningChecklists.$inferSelect;

// Cleaning Task Items - Individual tasks within a checklist
export const cleaningTaskItems = pgTable("cleaning_task_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  checklistId: varchar("checklist_id").notNull(),
  taskOrder: integer("task_order").notNull().default(1),
  taskName: text("task_name").notNull(),
  instructions: text("instructions"),
  area: text("area").notNull(), // yogurt_dispenser, topping_bar, floor, counter, fridge, bathroom, exterior
  requiredChemical: text("required_chemical"), // sanitizer, degreaser, glass_cleaner
  safetyNotes: text("safety_notes"),
  isActive: boolean("is_active").default(true).notNull(),
});

export const insertCleaningTaskItemSchema = createInsertSchema(cleaningTaskItems).omit({ id: true });
export type InsertCleaningTaskItem = z.infer<typeof insertCleaningTaskItemSchema>;
export type CleaningTaskItem = typeof cleaningTaskItems.$inferSelect;

// Cleaning Task Completions - Employee completion records with evidence
export const cleaningTaskCompletions = pgTable("cleaning_task_completions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  taskItemId: varchar("task_item_id").notNull(),
  checklistId: varchar("checklist_id").notNull(),
  essenceUnitId: varchar("essence_unit_id").notNull(),
  employeeId: varchar("employee_id").notNull(),
  shiftId: varchar("shift_id"),
  completedAt: timestamp("completed_at").defaultNow().notNull(),
  photoEvidenceUrl: text("photo_evidence_url"),
  gpsLatitude: numeric("gps_latitude", { precision: 10, scale: 7 }),
  gpsLongitude: numeric("gps_longitude", { precision: 10, scale: 7 }),
  gpsAccuracyMeters: numeric("gps_accuracy_meters", { precision: 6, scale: 2 }),
  notes: text("notes"),
  aiVerificationStatus: text("ai_verification_status"), // pending, passed, failed, manual_review
  aiVerificationNotes: text("ai_verification_notes"),
  supervisorApproved: boolean("supervisor_approved").default(false),
  supervisorId: varchar("supervisor_id"),
  supervisorApprovedAt: timestamp("supervisor_approved_at"),
});

export const insertCleaningTaskCompletionSchema = createInsertSchema(cleaningTaskCompletions).omit({
  id: true,
  completedAt: true,
});
export type InsertCleaningTaskCompletion = z.infer<typeof insertCleaningTaskCompletionSchema>;
export type CleaningTaskCompletion = typeof cleaningTaskCompletions.$inferSelect;

// Kiosk Inspections - Daily/Shift inspection checklists
export const kioskInspections = pgTable("kiosk_inspections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  essenceUnitId: varchar("essence_unit_id").notNull(),
  inspectionType: text("inspection_type").notNull(), // opening, closing, mid_shift, random, health_dept
  employeeId: varchar("employee_id").notNull(),
  shiftId: varchar("shift_id"),
  scheduledAt: timestamp("scheduled_at"),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  status: text("status").notNull().default("pending"), // pending, in_progress, completed, failed, expired
  overallScore: integer("overall_score"), // 0-100
  passedAllCritical: boolean("passed_all_critical"),
  photoUrls: text("photo_urls"), // JSON array of photo URLs
  gpsLatitude: numeric("gps_latitude", { precision: 10, scale: 7 }),
  gpsLongitude: numeric("gps_longitude", { precision: 10, scale: 7 }),
  supervisorReviewRequired: boolean("supervisor_review_required").default(false),
  supervisorId: varchar("supervisor_id"),
  supervisorNotes: text("supervisor_notes"),
  supervisorApprovedAt: timestamp("supervisor_approved_at"),
  aiAnalysis: text("ai_analysis"), // Gemini analysis of inspection
  aiRiskFlags: text("ai_risk_flags"), // JSON array of flagged issues
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertKioskInspectionSchema = createInsertSchema(kioskInspections).omit({
  id: true,
  createdAt: true,
});
export type InsertKioskInspection = z.infer<typeof insertKioskInspectionSchema>;
export type KioskInspection = typeof kioskInspections.$inferSelect;

// Inspection Checklist Items - Items within an inspection
export const inspectionChecklistItems = pgTable("inspection_checklist_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  inspectionId: varchar("inspection_id").notNull(),
  category: text("category").notNull(), // cleanliness, equipment, safety, inventory, staff
  itemName: text("item_name").notNull(),
  description: text("description"),
  isCritical: boolean("is_critical").default(false), // Fails entire inspection if not passed
  status: text("status").notNull().default("pending"), // pending, passed, failed, na
  score: integer("score"), // 0-10
  notes: text("notes"),
  photoUrl: text("photo_url"),
  completedAt: timestamp("completed_at"),
});

export const insertInspectionChecklistItemSchema = createInsertSchema(inspectionChecklistItems).omit({ id: true });
export type InsertInspectionChecklistItem = z.infer<typeof insertInspectionChecklistItemSchema>;
export type InspectionChecklistItem = typeof inspectionChecklistItems.$inferSelect;

// Equipment Maintenance - Machine maintenance tracking
export const equipmentMaintenance = pgTable("equipment_maintenance", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  essenceUnitId: varchar("essence_unit_id").notNull(),
  equipmentType: text("equipment_type").notNull(), // yogurt_machine, fridge, freezer, topping_dispenser, scale, pos
  equipmentId: text("equipment_id"), // Internal equipment tracking ID
  maintenanceType: text("maintenance_type").notNull(), // preventive, repair, calibration, deep_clean, inspection
  priority: text("priority").notNull().default("medium"), // low, medium, high, critical
  status: text("status").notNull().default("scheduled"), // scheduled, in_progress, completed, cancelled, overdue
  scheduledDate: timestamp("scheduled_date"),
  completedDate: timestamp("completed_date"),
  assignedTo: varchar("assigned_to"), // Employee or vendor
  vendorId: varchar("vendor_id"),
  description: text("description").notNull(),
  workPerformed: text("work_performed"),
  partsUsed: text("parts_used"), // JSON array
  cost: numeric("cost", { precision: 10, scale: 2 }),
  photoBeforeUrl: text("photo_before_url"),
  photoAfterUrl: text("photo_after_url"),
  nextMaintenanceDue: timestamp("next_maintenance_due"),
  aiPrediction: text("ai_prediction"), // Gemini predictive maintenance
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertEquipmentMaintenanceSchema = createInsertSchema(equipmentMaintenance).omit({
  id: true,
  createdAt: true,
});
export type InsertEquipmentMaintenance = z.infer<typeof insertEquipmentMaintenanceSchema>;
export type EquipmentMaintenance = typeof equipmentMaintenance.$inferSelect;

// AI Autonomous Tasks - Gemini-powered autonomous decision queue
export const aiAutonomousTasks = pgTable("ai_autonomous_tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  essenceUnitId: varchar("essence_unit_id"),
  taskType: text("task_type").notNull(), // reorder_stock, schedule_maintenance, assign_shift, send_alert, escalate_issue, generate_report
  triggerSource: text("trigger_source").notNull(), // sensor, schedule, threshold, pattern_detection, manual
  priority: text("priority").notNull().default("medium"), // low, medium, high, critical, emergency
  status: text("status").notNull().default("pending"), // pending, processing, awaiting_approval, approved, executed, rejected, failed
  inputData: text("input_data").notNull(), // JSON - data that triggered the task
  aiAnalysis: text("ai_analysis"), // Gemini analysis result
  proposedAction: text("proposed_action"), // JSON - what AI proposes to do
  confidenceScore: numeric("confidence_score", { precision: 3, scale: 2 }), // 0.00 - 1.00
  requiresHumanApproval: boolean("requires_human_approval").default(false),
  approvedBy: varchar("approved_by"),
  approvedAt: timestamp("approved_at"),
  executedAt: timestamp("executed_at"),
  executionResult: text("execution_result"), // JSON - outcome of execution
  errorMessage: text("error_message"),
  relatedEntityType: text("related_entity_type"), // inventory, employee, order, maintenance
  relatedEntityId: varchar("related_entity_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertAiAutonomousTaskSchema = createInsertSchema(aiAutonomousTasks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertAiAutonomousTask = z.infer<typeof insertAiAutonomousTaskSchema>;
export type AiAutonomousTask = typeof aiAutonomousTasks.$inferSelect;

// Supplier Order Automation - AI-powered reordering
export const autoReorderRules = pgTable("auto_reorder_rules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  essenceUnitId: varchar("essence_unit_id").notNull(),
  supplyItemId: varchar("supply_item_id").notNull(),
  supplierId: varchar("supplier_id").notNull(),
  reorderPoint: integer("reorder_point").notNull(), // When to trigger reorder
  reorderQuantity: integer("reorder_quantity").notNull(), // How much to order
  maxQuantity: integer("max_quantity"), // Don't exceed this
  minQuantity: integer("min_quantity"), // Minimum order
  leadTimeDays: integer("lead_time_days").default(3),
  aiAdjustEnabled: boolean("ai_adjust_enabled").default(true), // Allow AI to adjust based on patterns
  lastAiAdjustment: timestamp("last_ai_adjustment"),
  aiAdjustmentNotes: text("ai_adjustment_notes"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAutoReorderRuleSchema = createInsertSchema(autoReorderRules).omit({
  id: true,
  createdAt: true,
});
export type InsertAutoReorderRule = z.infer<typeof insertAutoReorderRuleSchema>;
export type AutoReorderRule = typeof autoReorderRules.$inferSelect;

// Order Receiving - Track when supplies arrive
export const orderReceiving = pgTable("order_receiving", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  purchaseOrderId: varchar("purchase_order_id").notNull(),
  essenceUnitId: varchar("essence_unit_id").notNull(),
  receivedBy: varchar("received_by").notNull(), // Employee ID
  receivedAt: timestamp("received_at").defaultNow().notNull(),
  deliveryVehicle: text("delivery_vehicle"), // Truck number, etc.
  deliveryDriver: text("delivery_driver"),
  totalItemsExpected: integer("total_items_expected"),
  totalItemsReceived: integer("total_items_received"),
  conditionOnArrival: text("condition_on_arrival").notNull(), // good, damaged, partial, rejected
  temperatureOnArrival: numeric("temperature_on_arrival", { precision: 5, scale: 2 }), // For cold items
  photoEvidenceUrl: text("photo_evidence_url"),
  signatureUrl: text("signature_url"),
  notes: text("notes"),
  discrepancyNotes: text("discrepancy_notes"),
  aiQualityCheck: text("ai_quality_check"), // Gemini analysis of received goods
  requiresFollowUp: boolean("requires_follow_up").default(false),
});

export const insertOrderReceivingSchema = createInsertSchema(orderReceiving).omit({ id: true });
export type InsertOrderReceiving = z.infer<typeof insertOrderReceivingSchema>;
export type OrderReceiving = typeof orderReceiving.$inferSelect;

// Order Receiving Items - Individual items in a delivery
export const orderReceivingItems = pgTable("order_receiving_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderReceivingId: varchar("order_receiving_id").notNull(),
  purchaseOrderItemId: varchar("purchase_order_item_id"),
  supplyItemId: varchar("supply_item_id").notNull(),
  quantityExpected: integer("quantity_expected").notNull(),
  quantityReceived: integer("quantity_received").notNull(),
  quantityDamaged: integer("quantity_damaged").default(0),
  quantityRejected: integer("quantity_rejected").default(0),
  expiryDate: timestamp("expiry_date"),
  batchNumber: text("batch_number"),
  condition: text("condition").notNull(), // good, damaged, expired, wrong_item
  photoUrl: text("photo_url"),
  notes: text("notes"),
});

export const insertOrderReceivingItemSchema = createInsertSchema(orderReceivingItems).omit({ id: true });
export type InsertOrderReceivingItem = z.infer<typeof insertOrderReceivingItemSchema>;
export type OrderReceivingItem = typeof orderReceivingItems.$inferSelect;

// Smart Inventory Predictions - AI-powered demand forecasting
export const inventoryPredictions = pgTable("inventory_predictions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  essenceUnitId: varchar("essence_unit_id").notNull(),
  supplyItemId: varchar("supply_item_id").notNull(),
  predictionDate: timestamp("prediction_date").notNull(),
  predictedDemand: integer("predicted_demand").notNull(),
  confidenceLevel: numeric("confidence_level", { precision: 3, scale: 2 }),
  factors: text("factors"), // JSON - what factors influenced prediction
  actualDemand: integer("actual_demand"), // Filled in later for accuracy tracking
  accuracyScore: numeric("accuracy_score", { precision: 5, scale: 2 }),
  weatherFactor: text("weather_factor"), // hot, cold, rainy
  eventFactor: text("event_factor"), // holiday, local_event, normal
  dayOfWeekFactor: integer("day_of_week_factor"), // 0-6
  seasonalFactor: text("seasonal_factor"), // summer, winter, spring, fall
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertInventoryPredictionSchema = createInsertSchema(inventoryPredictions).omit({
  id: true,
  createdAt: true,
});
export type InsertInventoryPrediction = z.infer<typeof insertInventoryPredictionSchema>;
export type InventoryPrediction = typeof inventoryPredictions.$inferSelect;

// Waste Prevention Protocol - Enhanced waste tracking with strict accountability
export const wastePreventionLogs = pgTable("waste_prevention_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  essenceUnitId: varchar("essence_unit_id").notNull(),
  wasteType: text("waste_type").notNull(), // expired, spillage, equipment_failure, contamination, overproduction, customer_return
  category: text("category").notNull(), // yogurt, topping, packaging, chemical, other
  itemId: varchar("item_id"),
  itemName: text("item_name").notNull(),
  quantity: numeric("quantity", { precision: 10, scale: 3 }).notNull(),
  unit: text("unit").notNull(), // kg, liters, pieces
  estimatedValue: numeric("estimated_value", { precision: 10, scale: 2 }),
  currency: text("currency").default("USD"),
  reportedBy: varchar("reported_by").notNull(),
  reportedAt: timestamp("reported_at").defaultNow().notNull(),
  witnessId: varchar("witness_id"), // Second employee verification
  photoEvidenceUrl: text("photo_evidence_url").notNull(), // Mandatory photo
  gpsLatitude: numeric("gps_latitude", { precision: 10, scale: 7 }),
  gpsLongitude: numeric("gps_longitude", { precision: 10, scale: 7 }),
  rootCause: text("root_cause"),
  preventionMeasures: text("prevention_measures"),
  supervisorReviewed: boolean("supervisor_reviewed").default(false),
  supervisorId: varchar("supervisor_id"),
  supervisorNotes: text("supervisor_notes"),
  supervisorReviewedAt: timestamp("supervisor_reviewed_at"),
  aiAnalysis: text("ai_analysis"), // Gemini waste pattern analysis
  aiRecommendations: text("ai_recommendations"),
  isRecurring: boolean("is_recurring").default(false),
  linkedPreviousWasteId: varchar("linked_previous_waste_id"),
});

export const insertWastePreventionLogSchema = createInsertSchema(wastePreventionLogs).omit({
  id: true,
  reportedAt: true,
});
export type InsertWastePreventionLog = z.infer<typeof insertWastePreventionLogSchema>;
export type WastePreventionLog = typeof wastePreventionLogs.$inferSelect;

// Shift Task Assignments - Tasks assigned to employees during shifts
export const shiftTaskAssignments = pgTable("shift_task_assignments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  essenceUnitId: varchar("essence_unit_id").notNull(),
  shiftId: varchar("shift_id"),
  employeeId: varchar("employee_id").notNull(),
  taskType: text("task_type").notNull(), // cleaning, restocking, customer_service, maintenance, inspection
  taskName: text("task_name").notNull(),
  description: text("description"),
  priority: text("priority").notNull().default("medium"), // low, medium, high, urgent
  dueAt: timestamp("due_at"),
  reminderSent: boolean("reminder_sent").default(false),
  status: text("status").notNull().default("pending"), // pending, in_progress, completed, overdue, cancelled
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  photoEvidenceUrl: text("photo_evidence_url"),
  notes: text("notes"),
  aiAssigned: boolean("ai_assigned").default(false), // Was this auto-assigned by AI?
  assignedBy: varchar("assigned_by"), // Manager or 'system'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertShiftTaskAssignmentSchema = createInsertSchema(shiftTaskAssignments).omit({
  id: true,
  createdAt: true,
});
export type InsertShiftTaskAssignment = z.infer<typeof insertShiftTaskAssignmentSchema>;
export type ShiftTaskAssignment = typeof shiftTaskAssignments.$inferSelect;

// Alert Escalation Rules - Automated escalation protocols
export const alertEscalationRules = pgTable("alert_escalation_rules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  essenceUnitId: varchar("essence_unit_id"),
  alertType: text("alert_type").notNull(), // temperature, inventory, theft, cleaning, maintenance, safety
  severity: text("severity").notNull(), // low, medium, high, critical
  escalationLevel: integer("escalation_level").notNull().default(1), // 1, 2, 3, 4
  escalateAfterMinutes: integer("escalate_after_minutes").notNull(),
  notifyRole: text("notify_role").notNull(), // shift_lead, manager, regional_manager, operations_director, ceo
  notifyMethod: text("notify_method").notNull(), // email, sms, push, whatsapp, call
  additionalRecipients: text("additional_recipients"), // JSON array of emails/phones
  autoResolveEnabled: boolean("auto_resolve_enabled").default(false),
  aiCanAutoResolve: boolean("ai_can_auto_resolve").default(false),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAlertEscalationRuleSchema = createInsertSchema(alertEscalationRules).omit({
  id: true,
  createdAt: true,
});
export type InsertAlertEscalationRule = z.infer<typeof insertAlertEscalationRuleSchema>;
export type AlertEscalationRule = typeof alertEscalationRules.$inferSelect;

// Daily Operations Summary - AI-generated daily digest
export const dailyOperationsSummaries = pgTable("daily_operations_summaries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  essenceUnitId: varchar("essence_unit_id").notNull(),
  summaryDate: timestamp("summary_date").notNull(),
  totalRevenue: numeric("total_revenue", { precision: 12, scale: 2 }),
  totalTransactions: integer("total_transactions"),
  averageTransactionValue: numeric("average_transaction_value", { precision: 10, scale: 2 }),
  totalCustomers: integer("total_customers"),
  newCustomers: integer("new_customers"),
  loyaltyRedemptions: integer("loyalty_redemptions"),
  wasteValue: numeric("waste_value", { precision: 10, scale: 2 }),
  wasteIncidents: integer("waste_incidents"),
  cleaningTasksCompleted: integer("cleaning_tasks_completed"),
  cleaningTasksTotal: integer("cleaning_tasks_total"),
  inspectionScore: integer("inspection_score"),
  temperatureAlerts: integer("temperature_alerts"),
  theftAlerts: integer("theft_alerts"),
  staffHoursWorked: numeric("staff_hours_worked", { precision: 8, scale: 2 }),
  staffAbsences: integer("staff_absences"),
  topSellingFlavors: text("top_selling_flavors"), // JSON array
  inventoryAlerts: integer("inventory_alerts"),
  maintenanceIssues: integer("maintenance_issues"),
  customerComplaints: integer("customer_complaints"),
  aiSummary: text("ai_summary"), // Gemini-generated narrative summary
  aiRecommendations: text("ai_recommendations"), // JSON array of recommendations
  aiRiskScore: numeric("ai_risk_score", { precision: 3, scale: 2 }), // Overall risk score 0-1
  generatedAt: timestamp("generated_at").defaultNow().notNull(),
});

export const insertDailyOperationsSummarySchema = createInsertSchema(dailyOperationsSummaries).omit({
  id: true,
  generatedAt: true,
});
export type InsertDailyOperationsSummary = z.infer<typeof insertDailyOperationsSummarySchema>;
export type DailyOperationsSummary = typeof dailyOperationsSummaries.$inferSelect;

// Octopus Brain Configuration - Central AI brain settings
export const octopusBrainConfig = pgTable("octopus_brain_config", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  essenceUnitId: varchar("essence_unit_id"), // null for global config
  configKey: text("config_key").notNull(),
  configValue: text("config_value").notNull(), // JSON
  description: text("description"),
  category: text("category").notNull(), // automation, thresholds, alerts, ai_behavior, escalation
  isEnabled: boolean("is_enabled").default(true).notNull(),
  lastModifiedBy: varchar("last_modified_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertOctopusBrainConfigSchema = createInsertSchema(octopusBrainConfig).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertOctopusBrainConfig = z.infer<typeof insertOctopusBrainConfigSchema>;
export type OctopusBrainConfig = typeof octopusBrainConfig.$inferSelect;

// Programmatic Advertising Leads - For franchise/investor lead capture
export const programmaticLeads = pgTable("programmatic_leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  country: text("country").notNull(),
  city: text("city"),
  companyName: text("company_name"),
  companyType: text("company_type"), // mall_operator, airport_authority, investor, franchise_buyer, other
  interestLevel: text("interest_level").notNull().default("medium"), // low, medium, high
  sourceCampaign: text("source_campaign").notNull(), // dv360, linkedin, meta, premium_network, organic
  sourceNetwork: text("source_network"), // specific network name
  leadScore: integer("lead_score"), // AI-generated 1-100
  status: text("status").notNull().default("new"), // new, contacted, qualified, proposal, closed, lost
  notes: text("notes"),
  assignedTo: text("assigned_to"), // operations team assignment
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  pageUrl: text("page_url"),
  utmSource: text("utm_source"),
  utmMedium: text("utm_medium"),
  utmCampaign: text("utm_campaign"),
  timeOnPage: integer("time_on_page"), // seconds
  createdAt: timestamp("created_at").defaultNow().notNull(),
  contactedAt: timestamp("contacted_at"),
  qualifiedAt: timestamp("qualified_at"),
  closedAt: timestamp("closed_at"),
});

export const insertProgrammaticLeadSchema = createInsertSchema(programmaticLeads).omit({
  id: true,
  leadScore: true,
  status: true,
  assignedTo: true,
  createdAt: true,
  contactedAt: true,
  qualifiedAt: true,
  closedAt: true,
});
export type InsertProgrammaticLead = z.infer<typeof insertProgrammaticLeadSchema>;
export type ProgrammaticLead = typeof programmaticLeads.$inferSelect;

// ============================================================================
// ZATCA E-INVOICING SYSTEM (Saudi Arabia Compliance)
// ============================================================================

// ZATCA Invoice Types
export type ZatcaInvoiceType = "SIMPLIFIED" | "STANDARD" | "DEBIT_NOTE" | "CREDIT_NOTE";
export type ZatcaInvoiceStatus = "PENDING" | "CLEARED" | "REPORTED" | "REJECTED" | "CANCELLED";

// ZATCA E-Invoices - Compliant with FATOORA Phase 2
export const zatcaInvoices = pgTable("zatca_invoices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  essenceUnitId: varchar("essence_unit_id").notNull(),
  posTransactionId: varchar("pos_transaction_id"), // Link to POS transaction
  invoiceNumber: text("invoice_number").notNull().unique(), // Sequential counter
  invoiceType: text("invoice_type").notNull(), // SIMPLIFIED (B2C) or STANDARD (B2B)
  invoiceSubType: text("invoice_sub_type"), // 01=Tax, 02=Simplified, 03=Debit, 04=Credit
  
  // Seller Information (Essence Yogurt)
  sellerName: text("seller_name").notNull(),
  sellerVatNumber: text("seller_vat_number").notNull(), // TRN in Saudi
  sellerAddress: text("seller_address").notNull(),
  sellerBuildingNumber: text("seller_building_number"),
  sellerStreet: text("seller_street"),
  sellerCity: text("seller_city").notNull(),
  sellerPostalCode: text("seller_postal_code"),
  sellerCountry: text("seller_country").notNull().default("SA"),
  
  // Buyer Information (for B2B Standard Invoices)
  buyerName: text("buyer_name"),
  buyerVatNumber: text("buyer_vat_number"),
  buyerAddress: text("buyer_address"),
  buyerCity: text("buyer_city"),
  buyerCountry: text("buyer_country"),
  
  // Invoice Amounts
  subtotal: numeric("subtotal", { precision: 12, scale: 2 }).notNull(),
  discountAmount: numeric("discount_amount", { precision: 12, scale: 2 }).default("0"),
  taxableAmount: numeric("taxable_amount", { precision: 12, scale: 2 }).notNull(),
  vatAmount: numeric("vat_amount", { precision: 12, scale: 2 }).notNull(),
  vatRate: numeric("vat_rate", { precision: 5, scale: 2 }).notNull().default("15.00"), // 15% standard, 0% for Free Zone
  totalAmount: numeric("total_amount", { precision: 12, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("SAR"),
  
  // ZATCA Cryptographic Fields
  uuid: text("uuid").notNull(), // Universally Unique Identifier
  invoiceHash: text("invoice_hash"), // SHA-256 hash of invoice
  previousInvoiceHash: text("previous_invoice_hash"), // PIH - Chain integrity
  invoiceCounterValue: integer("invoice_counter_value").notNull(), // ICV - Sequential counter
  cryptographicStamp: text("cryptographic_stamp"), // PCSID for POS
  digitalSignature: text("digital_signature"),
  
  // QR Code Data (Required for B2C)
  qrCodeData: text("qr_code_data"), // Base64 encoded TLV
  qrCodeImageUrl: text("qr_code_image_url"),
  
  // XML Invoice
  xmlContent: text("xml_content"), // Full UBL 2.1 XML
  pdfUrl: text("pdf_url"), // PDF/A-3 with embedded XML
  
  // ZATCA Submission
  status: text("status").notNull().default("PENDING"), // PENDING, CLEARED, REPORTED, REJECTED
  submittedAt: timestamp("submitted_at"),
  zatcaResponseCode: text("zatca_response_code"),
  zatcaResponseMessage: text("zatca_response_message"),
  zatcaClearanceId: text("zatca_clearance_id"), // From ZATCA for cleared invoices
  zatcaReportingId: text("zatca_reporting_id"), // For B2C reported invoices
  
  // Offline Support (24-hour window for B2C)
  isOffline: boolean("is_offline").default(false),
  offlineGeneratedAt: timestamp("offline_generated_at"),
  offlineDeviceId: text("offline_device_id"),
  mustReportBy: timestamp("must_report_by"), // 24 hours from generation
  
  // Timestamps
  invoiceDate: timestamp("invoice_date").notNull(),
  invoiceTime: text("invoice_time").notNull(), // HH:MM:SS format
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertZatcaInvoiceSchema = createInsertSchema(zatcaInvoices).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertZatcaInvoice = z.infer<typeof insertZatcaInvoiceSchema>;
export type ZatcaInvoice = typeof zatcaInvoices.$inferSelect;

// ZATCA Invoice Line Items
export const zatcaInvoiceItems = pgTable("zatca_invoice_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  zatcaInvoiceId: varchar("zatca_invoice_id").notNull(),
  lineNumber: integer("line_number").notNull(),
  itemName: text("item_name").notNull(),
  itemDescription: text("item_description"),
  itemCode: text("item_code"), // SKU
  quantity: numeric("quantity", { precision: 12, scale: 3 }).notNull(),
  unitCode: text("unit_code").notNull().default("GRM"), // UN/CEFACT codes: GRM (grams), KGM (kg), EA (each)
  unitPrice: numeric("unit_price", { precision: 12, scale: 4 }).notNull(),
  discountAmount: numeric("discount_amount", { precision: 12, scale: 2 }).default("0"),
  taxableAmount: numeric("taxable_amount", { precision: 12, scale: 2 }).notNull(),
  vatRate: numeric("vat_rate", { precision: 5, scale: 2 }).notNull(),
  vatAmount: numeric("vat_amount", { precision: 12, scale: 2 }).notNull(),
  lineTotal: numeric("line_total", { precision: 12, scale: 2 }).notNull(),
});

export const insertZatcaInvoiceItemSchema = createInsertSchema(zatcaInvoiceItems).omit({ id: true });
export type InsertZatcaInvoiceItem = z.infer<typeof insertZatcaInvoiceItemSchema>;
export type ZatcaInvoiceItem = typeof zatcaInvoiceItems.$inferSelect;

// ZATCA Device Registration (POS/Kiosk devices) - Enhanced Compliance
export const zatcaDevices = pgTable("zatca_devices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  essenceUnitId: varchar("essence_unit_id").notNull(),
  deviceName: text("device_name").notNull(),
  deviceType: text("device_type").notNull(), // POS, KIOSK, MOBILE
  serialNumber: text("serial_number").notNull().unique(),
  
  // Certificate Signing Request (CSR) Fields
  csrCommonName: text("csr_common_name"),
  csrOrganization: text("csr_organization"),
  csrOrganizationUnit: text("csr_organization_unit"),
  csrCountry: text("csr_country").default("SA"),
  csrInvoiceType: text("csr_invoice_type"), // 0100000 (B2B) or 0200000 (B2C)
  csrLocation: text("csr_location"), // Branch address
  csrIndustry: text("csr_industry"), // NAICS code
  csrPrivateKeyReference: text("csr_private_key_reference"), // HSM reference (never store actual key)
  csrGeneratedAt: timestamp("csr_generated_at"),
  
  // CSID (Cryptographic Stamp Identifier) Fields
  complianceCsid: text("compliance_csid"),
  complianceCsidSecret: text("compliance_csid_secret"), // Encrypted storage
  complianceCsidExpiresAt: timestamp("compliance_csid_expires_at"),
  productionCsid: text("production_csid"),
  productionCsidSecret: text("production_csid_secret"), // Encrypted storage
  productionCsidExpiresAt: timestamp("production_csid_expires_at"),
  
  // Device Onboarding Status
  onboardingStatus: text("onboarding_status").default("pending"), // pending, csr_generated, compliance_testing, production_ready, active
  onboardingRequestId: text("onboarding_request_id"),
  onboardingResponseCode: text("onboarding_response_code"),
  onboardingResponseMessage: text("onboarding_response_message"),
  complianceChecksPassed: boolean("compliance_checks_passed").default(false),
  
  // Invoice Counter (per-device sequential)
  lastInvoiceCounter: integer("last_invoice_counter").default(0).notNull(),
  lastInvoiceHash: text("last_invoice_hash"),
  lastInvoiceAt: timestamp("last_invoice_at"),
  
  // Offline Queue
  offlineQueueCount: integer("offline_queue_count").default(0),
  oldestOfflineInvoiceAt: timestamp("oldest_offline_invoice_at"),
  lastSyncAt: timestamp("last_sync_at"),
  
  // Status
  isProduction: boolean("is_production").default(false),
  isActive: boolean("is_active").default(true),
  registeredAt: timestamp("registered_at"),
  deactivatedAt: timestamp("deactivated_at"),
  deactivationReason: text("deactivation_reason"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertZatcaDeviceSchema = createInsertSchema(zatcaDevices).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertZatcaDevice = z.infer<typeof insertZatcaDeviceSchema>;
export type ZatcaDevice = typeof zatcaDevices.$inferSelect;

// ZATCA Compliance Logs - Audit Trail for Device Onboarding and Invoice Reporting
export const zatcaComplianceLogs = pgTable("zatca_compliance_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  deviceId: varchar("device_id"),
  invoiceId: varchar("invoice_id"),
  
  // Log Type
  logType: text("log_type").notNull(), // onboarding, clearance, reporting, sync, error
  action: text("action").notNull(), // csr_generated, csid_requested, invoice_submitted, etc.
  
  // Request/Response
  requestPayload: text("request_payload"), // JSON (sanitized - no sensitive data)
  responseCode: text("response_code"),
  responseMessage: text("response_message"),
  
  // Status
  success: boolean("success").default(false),
  errorCode: text("error_code"),
  errorDetails: text("error_details"),
  
  // Metadata
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  performedBy: varchar("performed_by"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertZatcaComplianceLogSchema = createInsertSchema(zatcaComplianceLogs).omit({
  id: true,
  createdAt: true,
});
export type InsertZatcaComplianceLog = z.infer<typeof insertZatcaComplianceLogSchema>;
export type ZatcaComplianceLog = typeof zatcaComplianceLogs.$inferSelect;

// ZATCA Offline Queue - Track invoices pending sync
export const zatcaOfflineQueue = pgTable("zatca_offline_queue", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  deviceId: varchar("device_id").notNull(),
  invoiceId: varchar("invoice_id").notNull(),
  
  // Invoice Data (for retry)
  invoiceXml: text("invoice_xml").notNull(),
  invoiceHash: text("invoice_hash").notNull(),
  qrCodeData: text("qr_code_data"),
  
  // Timing
  generatedAt: timestamp("generated_at").notNull(),
  mustReportBy: timestamp("must_report_by").notNull(), // 24 hours from generation
  
  // Sync Status
  syncAttempts: integer("sync_attempts").default(0),
  lastAttemptAt: timestamp("last_attempt_at"),
  lastError: text("last_error"),
  
  // Resolution
  status: text("status").notNull().default("pending"), // pending, synced, failed, expired
  syncedAt: timestamp("synced_at"),
  zatcaReportingId: text("zatca_reporting_id"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============================================================================
// HALAL CERTIFICATION TRACKING
// ============================================================================

// Supplier Halal Certificates
export const halalCertificates = pgTable("halal_certificates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  supplierId: varchar("supplier_id").notNull(),
  supplierName: text("supplier_name").notNull(),
  
  // Certificate Details
  certificateNumber: text("certificate_number").notNull(),
  issuingBody: text("issuing_body").notNull(), // e.g., "ESMA", "JAKIM", "IFANCA"
  issuingCountry: text("issuing_country").notNull(),
  accreditationNumber: text("accreditation_number"),
  
  // Product Coverage
  productCategories: text("product_categories").notNull(), // JSON array
  specificProducts: text("specific_products"), // JSON array of covered products
  
  // Validity
  issueDate: timestamp("issue_date").notNull(),
  expiryDate: timestamp("expiry_date").notNull(),
  isActive: boolean("is_active").default(true),
  
  // Verification
  certificateUrl: text("certificate_url"), // PDF copy
  verificationUrl: text("verification_url"), // Link to verify on issuing body website
  lastVerifiedAt: timestamp("last_verified_at"),
  verifiedBy: varchar("verified_by"),
  verificationStatus: text("verification_status").default("pending"), // pending, verified, expired, revoked
  
  // Slaughter Method (for meat products)
  slaughterMethod: text("slaughter_method"), // hand_slaughter, machine_with_tasmiyah
  stunningAllowed: boolean("stunning_allowed"),
  slaughterCountry: text("slaughter_country"),
  
  // Country Acceptance
  acceptedInSaudiArabia: boolean("accepted_in_saudi_arabia").default(false),
  acceptedInUAE: boolean("accepted_in_uae").default(false),
  acceptedInIsrael: boolean("accepted_in_israel").default(false), // Kosher equivalent tracking
  acceptedInGreece: boolean("accepted_in_greece").default(false),
  acceptedInAustralia: boolean("accepted_in_australia").default(false),
  
  // Alerts
  expiryAlertSent: boolean("expiry_alert_sent").default(false),
  expiryAlertSentAt: timestamp("expiry_alert_sent_at"),
  renewalReminderDays: integer("renewal_reminder_days").default(60),
  
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertHalalCertificateSchema = createInsertSchema(halalCertificates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertHalalCertificate = z.infer<typeof insertHalalCertificateSchema>;
export type HalalCertificate = typeof halalCertificates.$inferSelect;

// Halal Certificate Audit Log
export const halalCertificateAudits = pgTable("halal_certificate_audits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  certificateId: varchar("certificate_id").notNull(),
  action: text("action").notNull(), // created, updated, verified, expired, renewed, revoked
  performedBy: varchar("performed_by"),
  previousStatus: text("previous_status"),
  newStatus: text("new_status"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertHalalCertificateAuditSchema = createInsertSchema(halalCertificateAudits).omit({
  id: true,
  createdAt: true,
});
export type InsertHalalCertificateAudit = z.infer<typeof insertHalalCertificateAuditSchema>;
export type HalalCertificateAudit = typeof halalCertificateAudits.$inferSelect;

// ============================================================================
// DIGITAL SCALE HARDWARE CONFIGURATION
// ============================================================================

// Digital Scale Devices
export const digitalScales = pgTable("digital_scales", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  essenceUnitId: varchar("essence_unit_id").notNull(),
  
  // Hardware Details
  deviceName: text("device_name").notNull(),
  manufacturer: text("manufacturer").notNull(), // AVERY_BERKEL, CAS, STAR, RICE_LAKE, BRECKNELL
  model: text("model").notNull(), // e.g., "6712", "S2000 Jr", "mG-S8200"
  serialNumber: text("serial_number").notNull().unique(),
  
  // NTEP Certification
  ntepCertified: boolean("ntep_certified").default(true).notNull(),
  ntepCertificateNumber: text("ntep_certificate_number"),
  accuracyClass: text("accuracy_class").default("III"), // Class III for trade
  
  // Capacity
  maxCapacity: numeric("max_capacity", { precision: 10, scale: 2 }).notNull(), // in grams
  minCapacity: numeric("min_capacity", { precision: 10, scale: 2 }), // in grams
  division: numeric("division", { precision: 6, scale: 3 }).notNull(), // readability in grams
  
  // Connection
  connectionType: text("connection_type").notNull(), // USB, SERIAL, BLUETOOTH, ETHERNET
  connectionPort: text("connection_port"), // COM1, /dev/ttyUSB0, IP address
  baudRate: integer("baud_rate").default(9600),
  dataFormat: text("data_format").default("8N1"),
  
  // Tare Configuration
  defaultTareWeight: numeric("default_tare_weight", { precision: 8, scale: 2 }), // Default cup weight in grams
  smallCupTare: numeric("small_cup_tare", { precision: 8, scale: 2 }),
  mediumCupTare: numeric("medium_cup_tare", { precision: 8, scale: 2 }),
  largeCupTare: numeric("large_cup_tare", { precision: 8, scale: 2 }),
  
  // Calibration
  lastCalibrationDate: timestamp("last_calibration_date"),
  nextCalibrationDue: timestamp("next_calibration_due"),
  calibrationIntervalDays: integer("calibration_interval_days").default(180), // 6 months
  calibratedBy: text("calibrated_by"),
  calibrationCertificateUrl: text("calibration_certificate_url"),
  
  // Status
  isActive: boolean("is_active").default(true).notNull(),
  lastReadingAt: timestamp("last_reading_at"),
  lastWeight: numeric("last_weight", { precision: 10, scale: 2 }),
  isOnline: boolean("is_online").default(false),
  
  // Maintenance
  purchaseDate: timestamp("purchase_date"),
  warrantyExpiresAt: timestamp("warranty_expires_at"),
  maintenanceNotes: text("maintenance_notes"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertDigitalScaleSchema = createInsertSchema(digitalScales).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertDigitalScale = z.infer<typeof insertDigitalScaleSchema>;
export type DigitalScale = typeof digitalScales.$inferSelect;

// ============================================================================
// MOBILE LOYALTY APP - User Preferences & App State
// ============================================================================

// Mobile App User Preferences
export const mobileAppUsers = pgTable("mobile_app_users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().unique(), // Link to main users table
  
  // App Settings
  preferredLanguage: text("preferred_language").default("en"),
  pushNotificationsEnabled: boolean("push_notifications_enabled").default(true),
  emailNotificationsEnabled: boolean("email_notifications_enabled").default(true),
  smsNotificationsEnabled: boolean("sms_notifications_enabled").default(false),
  
  // Device Info
  deviceType: text("device_type"), // iOS, Android
  deviceModel: text("device_model"),
  appVersion: text("app_version"),
  osVersion: text("os_version"),
  pushToken: text("push_token"),
  
  // Location Preferences
  preferredStoreId: varchar("preferred_store_id"),
  allowLocationTracking: boolean("allow_location_tracking").default(false),
  
  // Loyalty Wallet
  loyaltyAccountId: varchar("loyalty_account_id"),
  digitalWalletEnabled: boolean("digital_wallet_enabled").default(true),
  autoRedeemEnabled: boolean("auto_redeem_enabled").default(false),
  autoRedeemThreshold: integer("auto_redeem_threshold"), // Points threshold for auto-redeem
  
  // Personalization
  favoriteFlavors: text("favorite_flavors"), // JSON array
  allergyPreferences: text("allergy_preferences"), // JSON array
  dietaryRestrictions: text("dietary_restrictions"), // JSON array
  
  // Engagement
  lastAppOpenAt: timestamp("last_app_open_at"),
  totalAppOpens: integer("total_app_opens").default(0),
  lastOrderAt: timestamp("last_order_at"),
  totalOrders: integer("total_orders").default(0),
  
  // Biometrics
  biometricAuthEnabled: boolean("biometric_auth_enabled").default(false),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertMobileAppUserSchema = createInsertSchema(mobileAppUsers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertMobileAppUser = z.infer<typeof insertMobileAppUserSchema>;
export type MobileAppUser = typeof mobileAppUsers.$inferSelect;

// Mobile App Activity Log
export const mobileAppActivity = pgTable("mobile_app_activity", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  mobileAppUserId: varchar("mobile_app_user_id").notNull(),
  activityType: text("activity_type").notNull(), // app_open, points_check, redeem, order, profile_update, etc.
  activityData: text("activity_data"), // JSON
  screenName: text("screen_name"),
  sessionId: text("session_id"),
  deviceId: text("device_id"),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMobileAppActivitySchema = createInsertSchema(mobileAppActivity).omit({
  id: true,
  createdAt: true,
});
export type InsertMobileAppActivity = z.infer<typeof insertMobileAppActivitySchema>;
export type MobileAppActivity = typeof mobileAppActivity.$inferSelect;

// ============================================================================
// GLOBAL COMPLIANCE, RISK & OPERATIONS BRAIN 2025
// ============================================================================

// Utility Bills for each shop/unit
export const utilityBills = pgTable("utility_bills", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  essenceUnitId: varchar("essence_unit_id").notNull(),
  utilityType: text("utility_type").notNull(), // ELECTRICITY, WATER, GAS, INTERNET
  providerName: text("provider_name").notNull(),
  accountNumber: text("account_number"),
  billingPeriodStart: timestamp("billing_period_start").notNull(),
  billingPeriodEnd: timestamp("billing_period_end").notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  currency: text("currency").notNull(),
  dueDate: timestamp("due_date").notNull(),
  paidDate: timestamp("paid_date"),
  paymentReference: text("payment_reference"),
  status: text("status").notNull().default("DUE"), // PAID, DUE, OVERDUE
  documentUrl: text("document_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUtilityBillSchema = createInsertSchema(utilityBills).omit({
  id: true,
  createdAt: true,
});
export type InsertUtilityBill = z.infer<typeof insertUtilityBillSchema>;
export type UtilityBill = typeof utilityBills.$inferSelect;

// Risk Events for fraud detection, compliance breaches, operational issues
export const riskEvents = pgTable("risk_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  essenceUnitId: varchar("essence_unit_id").notNull(),
  riskType: text("risk_type").notNull(), // POS_VOID_EXCESS, REFUND_EXCESS, AFTER_HOURS_ACCESS, WASTE_EXCESS, INVENTORY_SHRINKAGE, TEMPERATURE_BREACH, UNPAID_UTILITY, PERMIT_EXPIRED, INSURANCE_EXPIRED
  severity: text("severity").notNull().default("LOW"), // LOW, MEDIUM, HIGH, CRITICAL
  message: text("message").notNull(),
  detectedByAi: boolean("detected_by_ai").default(false),
  aiConfidence: numeric("ai_confidence", { precision: 5, scale: 2 }),
  affectedEmployeeId: varchar("affected_employee_id"),
  affectedCustomerId: varchar("affected_customer_id"),
  relatedTransactionId: varchar("related_transaction_id"),
  evidenceData: text("evidence_data"), // JSON with details
  resolvedAt: timestamp("resolved_at"),
  resolvedByUserId: varchar("resolved_by_user_id"),
  resolutionNotes: text("resolution_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertRiskEventSchema = createInsertSchema(riskEvents).omit({
  id: true,
  createdAt: true,
});
export type InsertRiskEvent = z.infer<typeof insertRiskEventSchema>;
export type RiskEvent = typeof riskEvents.$inferSelect;

// Compliance Audit Logs (AI-powered audit results)
export const complianceAuditLogs = pgTable("compliance_audit_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  essenceUnitId: varchar("essence_unit_id").notNull(),
  countryCode: text("country_code").notNull(),
  auditType: text("audit_type").notNull().default("DAILY_SWEEP"), // DAILY_SWEEP, MANUAL_AUDIT, INCIDENT_TRIGGERED
  overallStatus: text("overall_status").notNull(), // GREEN, AMBER, RED
  aiSummary: text("ai_summary"),
  requiredActions: text("required_actions"), // JSON array
  legalReferences: text("legal_references"), // JSON array
  permitsChecked: integer("permits_checked").default(0),
  insurancesChecked: integer("insurances_checked").default(0),
  issuesFound: integer("issues_found").default(0),
  aiModelUsed: text("ai_model_used"),
  processingTimeMs: integer("processing_time_ms"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertComplianceAuditLogSchema = createInsertSchema(complianceAuditLogs).omit({
  id: true,
  createdAt: true,
});
export type InsertComplianceAuditLog = z.infer<typeof insertComplianceAuditLogSchema>;
export type ComplianceAuditLog = typeof complianceAuditLogs.$inferSelect;

// Waste Log Entries (for compliance and fraud detection)
export const wasteLogs = pgTable("waste_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  essenceUnitId: varchar("essence_unit_id").notNull(),
  productCategory: text("product_category").notNull(), // Yogurt, Fruit, Chocolate, Nuts, Toppings, Sauce
  quantityKg: numeric("quantity_kg", { precision: 8, scale: 3 }).notNull(),
  reason: text("reason").notNull(), // EXPIRED, DAMAGED, SPILL, STAFF_MEAL, QUALITY_ISSUE, OTHER
  photoEvidenceUrl: text("photo_evidence_url"),
  recordedByUserId: varchar("recorded_by_user_id").notNull(),
  supervisorApprovedById: varchar("supervisor_approved_by_id"),
  approvalStatus: text("approval_status").default("PENDING"), // PENDING, APPROVED, REJECTED
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertWasteLogSchema = createInsertSchema(wasteLogs).omit({
  id: true,
  createdAt: true,
});
export type InsertWasteLog = z.infer<typeof insertWasteLogSchema>;
export type WasteLog = typeof wasteLogs.$inferSelect;

// Incident Records (for accidents, injuries, safety issues)
export const incidentRecords = pgTable("incident_records", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  essenceUnitId: varchar("essence_unit_id").notNull(),
  reportedByUserId: varchar("reported_by_user_id").notNull(),
  incidentTime: timestamp("incident_time"),
  category: text("category").notNull(), // CUSTOMER_INJURY, STAFF_INJURY, FOOD_SAFETY, EQUIPMENT_FAILURE, UTILITY_ISSUE, HYGIENE_CLEANING, SECURITY, HARASSMENT_OR_CONDUCT, NEAR_MISS, OTHER
  severity: text("severity").notNull().default("LOW"), // LOW, MEDIUM, HIGH, CRITICAL
  title: text("title").notNull(),
  description: text("description").notNull(),
  locationInShop: text("location_in_shop"), // entrance, counter, back of house, restroom
  peopleInvolved: text("people_involved"),
  attachments: text("attachments"), // JSON array of {url, type}
  
  // AI Triage
  aiTriageSummary: text("ai_triage_summary"),
  aiRecommendedActions: text("ai_recommended_actions"), // JSON array
  requiresRegulatorReport: boolean("requires_regulator_report").default(false),
  regulatorDeadlineAt: timestamp("regulator_deadline_at"),
  
  // Resolution
  status: text("status").notNull().default("OPEN"), // OPEN, IN_REVIEW, RESOLVED, CLOSED
  resolvedAt: timestamp("resolved_at"),
  resolvedByUserId: varchar("resolved_by_user_id"),
  resolutionNotes: text("resolution_notes"),
  
  reportedAt: timestamp("reported_at").defaultNow().notNull(),
});

export const insertIncidentRecordSchema = createInsertSchema(incidentRecords).omit({
  id: true,
  reportedAt: true,
});
export type InsertIncidentRecord = z.infer<typeof insertIncidentRecordSchema>;
export type IncidentRecord = typeof incidentRecords.$inferSelect;

// Insurance Policies (extended tracking)
export const insuranceRecords = pgTable("insurance_records", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  essenceUnitId: varchar("essence_unit_id").notNull(),
  insuranceType: text("insurance_type").notNull(), // PUBLIC_LIABILITY, PRODUCT_LIABILITY, WORKERS_COMP, EQUIPMENT_COVER, VEHICLE_COVER, DIRECTORS_OFFICERS
  providerName: text("provider_name").notNull(),
  policyNumber: text("policy_number").notNull(),
  coverageSummary: text("coverage_summary"),
  coverageAmount: numeric("coverage_amount", { precision: 14, scale: 2 }),
  currency: text("currency"),
  premiumAmount: numeric("premium_amount", { precision: 10, scale: 2 }),
  premiumFrequency: text("premium_frequency"), // MONTHLY, QUARTERLY, ANNUAL
  issueDate: timestamp("issue_date").notNull(),
  expiryDate: timestamp("expiry_date").notNull(),
  documentUrl: text("document_url"),
  autoRenew: boolean("auto_renew").default(false),
  status: text("status").notNull().default("VALID"), // VALID, EXPIRES_SOON, EXPIRED
  lastCheckedAt: timestamp("last_checked_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertInsuranceRecordSchema = createInsertSchema(insuranceRecords).omit({
  id: true,
  createdAt: true,
});
export type InsertInsuranceRecord = z.infer<typeof insertInsuranceRecordSchema>;
export type InsuranceRecord = typeof insuranceRecords.$inferSelect;

// ==================================================
// HR PLAYBOOK 2025 - COMPLETE INTEGRATION
// ==================================================

// ==================== POLICY LIBRARY ====================

// Policy Documents (company policies, procedures, guidelines)
export const hrPolicyDocuments = pgTable("hr_policy_documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  policyCode: text("policy_code").notNull().unique(),
  title: text("title").notNull(),
  category: text("category").notNull(), // OPERATIONS, SAFETY, CONDUCT, HYGIENE, SERVICE, SECURITY, HR, TRAINING
  description: text("description"),
  content: text("content").notNull(),
  version: integer("version").notNull().default(1),
  status: text("status").notNull().default("DRAFT"), // DRAFT, ACTIVE, SUPERSEDED, ARCHIVED
  effectiveDate: timestamp("effective_date"),
  expiryDate: timestamp("expiry_date"),
  appliesToRoles: text("applies_to_roles"), // JSON array of role types
  appliesToCountries: text("applies_to_countries"), // JSON array of country codes
  requiresAcknowledgement: boolean("requires_acknowledgement").default(true),
  acknowledgementDeadlineDays: integer("acknowledgement_deadline_days").default(7),
  createdByUserId: varchar("created_by_user_id"),
  approvedByUserId: varchar("approved_by_user_id"),
  approvedAt: timestamp("approved_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertHrPolicyDocumentSchema = createInsertSchema(hrPolicyDocuments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertHrPolicyDocument = z.infer<typeof insertHrPolicyDocumentSchema>;
export type HrPolicyDocument = typeof hrPolicyDocuments.$inferSelect;

// Policy Acknowledgements (staff sign-off on policies)
export const hrPolicyAcknowledgements = pgTable("hr_policy_acknowledgements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  policyId: varchar("policy_id").notNull(),
  employeeId: varchar("employee_id").notNull(),
  acknowledgedAt: timestamp("acknowledged_at").defaultNow().notNull(),
  ipAddress: text("ip_address"),
  deviceInfo: text("device_info"),
  digitalSignature: text("digital_signature"), // Typed name or PIN
  policyVersionAtTime: integer("policy_version_at_time").notNull(),
});

export const insertHrPolicyAcknowledgementSchema = createInsertSchema(hrPolicyAcknowledgements).omit({
  id: true,
  acknowledgedAt: true,
});
export type InsertHrPolicyAcknowledgement = z.infer<typeof insertHrPolicyAcknowledgementSchema>;
export type HrPolicyAcknowledgement = typeof hrPolicyAcknowledgements.$inferSelect;

// Policy Local Overrides (country-specific variations)
export const hrPolicyLocalOverrides = pgTable("hr_policy_local_overrides", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  policyId: varchar("policy_id").notNull(),
  countryCode: text("country_code").notNull(),
  overrideContent: text("override_content").notNull(),
  legalReference: text("legal_reference"),
  effectiveDate: timestamp("effective_date"),
  approvedByUserId: varchar("approved_by_user_id"),
  approvedAt: timestamp("approved_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertHrPolicyLocalOverrideSchema = createInsertSchema(hrPolicyLocalOverrides).omit({
  id: true,
  createdAt: true,
});
export type InsertHrPolicyLocalOverride = z.infer<typeof insertHrPolicyLocalOverrideSchema>;
export type HrPolicyLocalOverride = typeof hrPolicyLocalOverrides.$inferSelect;

// ==================== WORKFORCE STRUCTURE ====================

// Role Profiles (detailed role definitions per playbook section 2)
export const hrRoleProfiles = pgTable("hr_role_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  roleCode: text("role_code").notNull().unique(),
  roleName: text("role_name").notNull(),
  roleLevel: integer("role_level").notNull(), // 1=Crew, 2=Shift Manager, 3=Location Manager, 4=Area Manager, 5=HQ
  description: text("description"),
  keyResponsibilities: text("key_responsibilities"), // JSON array
  requiredCompetencies: text("required_competencies"), // JSON array
  minExperienceMonths: integer("min_experience_months").default(0),
  canOpenShift: boolean("can_open_shift").default(false),
  canCloseShift: boolean("can_close_shift").default(false),
  canApproveLeave: boolean("can_approve_leave").default(false),
  canApproveSchedule: boolean("can_approve_schedule").default(false),
  canHandleDisciplinary: boolean("can_handle_disciplinary").default(false),
  canAccessHrRecords: boolean("can_access_hr_records").default(false),
  canViewWhistleblower: boolean("can_view_whistleblower").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertHrRoleProfileSchema = createInsertSchema(hrRoleProfiles).omit({
  id: true,
  createdAt: true,
});
export type InsertHrRoleProfile = z.infer<typeof insertHrRoleProfileSchema>;
export type HrRoleProfile = typeof hrRoleProfiles.$inferSelect;

// Staffing Rules (minimum staff requirements per playbook section 4.2)
export const hrStaffingRules = pgTable("hr_staffing_rules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  essenceUnitId: varchar("essence_unit_id"),
  ruleType: text("rule_type").notNull(), // OPENING, CLOSING, DEEP_CLEAN, PEAK_HOURS, MINIMUM_COVERAGE
  minStaffCount: integer("min_staff_count").notNull().default(2),
  requiredRoles: text("required_roles"), // JSON array of role codes
  description: text("description"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertHrStaffingRuleSchema = createInsertSchema(hrStaffingRules).omit({
  id: true,
  createdAt: true,
});
export type InsertHrStaffingRule = z.infer<typeof insertHrStaffingRuleSchema>;
export type HrStaffingRule = typeof hrStaffingRules.$inferSelect;

// ==================== ONBOARDING & TRAINING ====================

// Training Modules (mandatory and optional training per playbook section 13)
export const hrTrainingModules = pgTable("hr_training_modules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  moduleCode: text("module_code").notNull().unique(),
  moduleName: text("module_name").notNull(),
  category: text("category").notNull(), // FOOD_SAFETY, HYGIENE, MACHINE_OPERATION, ALLERGEN, CUSTOMER_SERVICE, HEALTH_SAFETY, HARASSMENT, DATA_PRIVACY
  description: text("description"),
  contentUrl: text("content_url"),
  durationMinutes: integer("duration_minutes"),
  isMandatory: boolean("is_mandatory").default(true),
  requiredForRoles: text("required_for_roles"), // JSON array of role codes
  passingScore: integer("passing_score").default(80),
  hasQuiz: boolean("has_quiz").default(true),
  quizQuestions: text("quiz_questions"), // JSON array
  refresherIntervalMonths: integer("refresher_interval_months").default(12),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertHrTrainingModuleSchema = createInsertSchema(hrTrainingModules).omit({
  id: true,
  createdAt: true,
});
export type InsertHrTrainingModule = z.infer<typeof insertHrTrainingModuleSchema>;
export type HrTrainingModule = typeof hrTrainingModules.$inferSelect;

// Training Enrollments (employee training progress)
export const hrTrainingEnrollments = pgTable("hr_training_enrollments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  employeeId: varchar("employee_id").notNull(),
  moduleId: varchar("module_id").notNull(),
  status: text("status").notNull().default("PENDING"), // PENDING, IN_PROGRESS, COMPLETED, FAILED, EXPIRED
  enrolledAt: timestamp("enrolled_at").defaultNow().notNull(),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  quizScore: integer("quiz_score"),
  attempts: integer("attempts").default(0),
  dueDate: timestamp("due_date"),
  certificateId: varchar("certificate_id"),
  completionNotes: text("completion_notes"),
});

export const insertHrTrainingEnrollmentSchema = createInsertSchema(hrTrainingEnrollments).omit({
  id: true,
  enrolledAt: true,
});
export type InsertHrTrainingEnrollment = z.infer<typeof insertHrTrainingEnrollmentSchema>;
export type HrTrainingEnrollment = typeof hrTrainingEnrollments.$inferSelect;

// Certifications (external certificates per playbook section 13.2)
export const hrCertifications = pgTable("hr_certifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  employeeId: varchar("employee_id").notNull(),
  certificationType: text("certification_type").notNull(), // FOOD_SAFETY, FIRST_AID, HACCP, ALLERGEN, HALAL_HANDLER, KOSHER_HANDLER, MACHINE_OPERATOR
  certificateName: text("certificate_name").notNull(),
  issuingAuthority: text("issuing_authority"),
  certificateNumber: text("certificate_number"),
  issueDate: timestamp("issue_date").notNull(),
  expiryDate: timestamp("expiry_date"),
  documentUrl: text("document_url"),
  verifiedByUserId: varchar("verified_by_user_id"),
  verifiedAt: timestamp("verified_at"),
  status: text("status").notNull().default("VALID"), // VALID, EXPIRES_SOON, EXPIRED, REVOKED
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertHrCertificationSchema = createInsertSchema(hrCertifications).omit({
  id: true,
  createdAt: true,
});
export type InsertHrCertification = z.infer<typeof insertHrCertificationSchema>;
export type HrCertification = typeof hrCertifications.$inferSelect;

// Onboarding Tracks (new hire journey per playbook section 3.3)
export const hrOnboardingTracks = pgTable("hr_onboarding_tracks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  trackCode: text("track_code").notNull().unique(),
  trackName: text("track_name").notNull(),
  targetRole: text("target_role").notNull(),
  description: text("description"),
  totalDays: integer("total_days").default(7),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertHrOnboardingTrackSchema = createInsertSchema(hrOnboardingTracks).omit({
  id: true,
  createdAt: true,
});
export type InsertHrOnboardingTrack = z.infer<typeof insertHrOnboardingTrackSchema>;
export type HrOnboardingTrack = typeof hrOnboardingTracks.$inferSelect;

// Onboarding Tasks (steps in onboarding journey)
export const hrOnboardingTasks = pgTable("hr_onboarding_tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  trackId: varchar("track_id").notNull(),
  taskOrder: integer("task_order").notNull(),
  taskName: text("task_name").notNull(),
  taskType: text("task_type").notNull(), // DOCUMENT_SIGN, TRAINING, UNIFORM_ISSUE, ID_CARD, SYSTEM_ACCESS, BUDDY_INTRO, LOCATION_TOUR, CHECKLIST_SHADOW
  description: text("description"),
  responsibleRole: text("responsible_role"), // Who assigns/completes this
  linkedTrainingModuleId: varchar("linked_training_module_id"),
  linkedPolicyId: varchar("linked_policy_id"),
  isRequired: boolean("is_required").default(true),
  targetDayNumber: integer("target_day_number").default(1),
});

export const insertHrOnboardingTaskSchema = createInsertSchema(hrOnboardingTasks).omit({
  id: true,
});
export type InsertHrOnboardingTask = z.infer<typeof insertHrOnboardingTaskSchema>;
export type HrOnboardingTask = typeof hrOnboardingTasks.$inferSelect;

// Onboarding Progress (employee onboarding status)
export const hrOnboardingProgress = pgTable("hr_onboarding_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  employeeId: varchar("employee_id").notNull(),
  trackId: varchar("track_id").notNull(),
  taskId: varchar("task_id").notNull(),
  status: text("status").notNull().default("PENDING"), // PENDING, IN_PROGRESS, COMPLETED, SKIPPED
  completedAt: timestamp("completed_at"),
  completedByUserId: varchar("completed_by_user_id"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertHrOnboardingProgressSchema = createInsertSchema(hrOnboardingProgress).omit({
  id: true,
  createdAt: true,
});
export type InsertHrOnboardingProgress = z.infer<typeof insertHrOnboardingProgressSchema>;
export type HrOnboardingProgress = typeof hrOnboardingProgress.$inferSelect;

// ==================== OPERATIONS PROTOCOLS ====================

// Uniform & Appearance Checks (per playbook section 6)
export const hrUniformChecks = pgTable("hr_uniform_checks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  employeeId: varchar("employee_id").notNull(),
  shiftAssignmentId: varchar("shift_assignment_id"),
  essenceUnitId: varchar("essence_unit_id").notNull(),
  checkedByUserId: varchar("checked_by_user_id").notNull(),
  uniformClean: boolean("uniform_clean").default(true),
  uniformComplete: boolean("uniform_complete").default(true),
  nameBadgeVisible: boolean("name_badge_visible").default(true),
  shoesCorrect: boolean("shoes_correct").default(true),
  hairTied: boolean("hair_tied").default(true),
  noExcessJewelry: boolean("no_excess_jewelry").default(true),
  nailsCleanShort: boolean("nails_clean_short").default(true),
  overallPass: boolean("overall_pass").default(true),
  notes: text("notes"),
  photoUrl: text("photo_url"),
  checkedAt: timestamp("checked_at").defaultNow().notNull(),
});

export const insertHrUniformCheckSchema = createInsertSchema(hrUniformChecks).omit({
  id: true,
  checkedAt: true,
});
export type InsertHrUniformCheck = z.infer<typeof insertHrUniformCheckSchema>;
export type HrUniformCheck = typeof hrUniformChecks.$inferSelect;

// Hygiene Audits (handwashing, cleanliness per playbook section 6.2)
export const hrHygieneAudits = pgTable("hr_hygiene_audits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  essenceUnitId: varchar("essence_unit_id").notNull(),
  shiftAssignmentId: varchar("shift_assignment_id"),
  auditedByUserId: varchar("audited_by_user_id").notNull(),
  handwashingStationsClean: boolean("handwashing_stations_clean").default(true),
  soapAvailable: boolean("soap_available").default(true),
  handTowelsAvailable: boolean("hand_towels_available").default(true),
  sanitizerAvailable: boolean("sanitizer_available").default(true),
  staffObservedWashing: boolean("staff_observed_washing").default(true),
  foodContactSurfacesClean: boolean("food_contact_surfaces_clean").default(true),
  utensilsClean: boolean("utensils_clean").default(true),
  wasteDisposalCorrect: boolean("waste_disposal_correct").default(true),
  overallScore: integer("overall_score"), // 0-100
  overallPass: boolean("overall_pass").default(true),
  correctiveActions: text("corrective_actions"), // JSON array
  notes: text("notes"),
  auditedAt: timestamp("audited_at").defaultNow().notNull(),
});

export const insertHrHygieneAuditSchema = createInsertSchema(hrHygieneAudits).omit({
  id: true,
  auditedAt: true,
});
export type InsertHrHygieneAudit = z.infer<typeof insertHrHygieneAuditSchema>;
export type HrHygieneAudit = typeof hrHygieneAudits.$inferSelect;

// Service Scripts (greeting and DIY support per playbook section 7)
export const hrServiceScripts = pgTable("hr_service_scripts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  scriptCode: text("script_code").notNull().unique(),
  scriptName: text("script_name").notNull(),
  scriptType: text("script_type").notNull(), // GREETING, DIY_HELP, COMPLAINT_HANDLING, UPSELL, FAREWELL
  language: text("language").notNull().default("en"),
  scriptContent: text("script_content").notNull(),
  contextNotes: text("context_notes"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertHrServiceScriptSchema = createInsertSchema(hrServiceScripts).omit({
  id: true,
  createdAt: true,
});
export type InsertHrServiceScript = z.infer<typeof insertHrServiceScriptSchema>;
export type HrServiceScript = typeof hrServiceScripts.$inferSelect;

// ==================== PERFORMANCE MANAGEMENT ====================

// Performance Reviews (per playbook section 14)
export const hrPerformanceReviews = pgTable("hr_performance_reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  employeeId: varchar("employee_id").notNull(),
  reviewerId: varchar("reviewer_id").notNull(),
  reviewType: text("review_type").notNull(), // PROBATION_MID, PROBATION_END, QUARTERLY, ANNUAL, PROMOTION
  reviewPeriodStart: timestamp("review_period_start"),
  reviewPeriodEnd: timestamp("review_period_end"),
  punctualityScore: integer("punctuality_score"), // 1-5
  procedureAdherenceScore: integer("procedure_adherence_score"),
  cleanlinessScore: integer("cleanliness_score"),
  customerServiceScore: integer("customer_service_score"),
  teamworkScore: integer("teamwork_score"),
  overallScore: integer("overall_score"),
  strengths: text("strengths"),
  areasForImprovement: text("areas_for_improvement"),
  developmentPlan: text("development_plan"),
  employeeComments: text("employee_comments"),
  status: text("status").notNull().default("DRAFT"), // DRAFT, SUBMITTED, ACKNOWLEDGED, COMPLETED
  submittedAt: timestamp("submitted_at"),
  acknowledgedAt: timestamp("acknowledged_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertHrPerformanceReviewSchema = createInsertSchema(hrPerformanceReviews).omit({
  id: true,
  createdAt: true,
});
export type InsertHrPerformanceReview = z.infer<typeof insertHrPerformanceReviewSchema>;
export type HrPerformanceReview = typeof hrPerformanceReviews.$inferSelect;

// Coaching Notes (ongoing feedback per playbook section 14.2)
export const hrCoachingNotes = pgTable("hr_coaching_notes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  employeeId: varchar("employee_id").notNull(),
  coachId: varchar("coach_id").notNull(),
  shiftAssignmentId: varchar("shift_assignment_id"),
  noteType: text("note_type").notNull(), // POSITIVE, IMPROVEMENT, TRAINING_NEEDED, FOLLOW_UP
  topic: text("topic").notNull(),
  content: text("content").notNull(),
  actionRequired: text("action_required"),
  followUpDate: timestamp("follow_up_date"),
  followUpCompleted: boolean("follow_up_completed").default(false),
  isPrivate: boolean("is_private").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertHrCoachingNoteSchema = createInsertSchema(hrCoachingNotes).omit({
  id: true,
  createdAt: true,
});
export type InsertHrCoachingNote = z.infer<typeof insertHrCoachingNoteSchema>;
export type HrCoachingNote = typeof hrCoachingNotes.$inferSelect;

// ==================== DISCIPLINARY SYSTEM ====================

// Disciplinary Actions (warnings per playbook section 14.3)
export const hrDisciplinaryActions = pgTable("hr_disciplinary_actions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  employeeId: varchar("employee_id").notNull(),
  issuedByUserId: varchar("issued_by_user_id").notNull(),
  actionType: text("action_type").notNull(), // VERBAL_WARNING, FIRST_WRITTEN, FINAL_WRITTEN, SUSPENSION, TERMINATION
  category: text("category").notNull(), // ATTENDANCE, CONDUCT, PERFORMANCE, SAFETY, FRAUD, HARASSMENT
  incidentDate: timestamp("incident_date"),
  incidentDescription: text("incident_description").notNull(),
  previousWarnings: integer("previous_warnings").default(0),
  evidenceDocuments: text("evidence_documents"), // JSON array of URLs
  employeeStatement: text("employee_statement"),
  witnessStatements: text("witness_statements"), // JSON array
  outcome: text("outcome"), // Description of what happens next
  improvementPlan: text("improvement_plan"),
  appealDeadline: timestamp("appeal_deadline"),
  appealStatus: text("appeal_status"), // NONE, PENDING, UPHELD, OVERTURNED
  appealNotes: text("appeal_notes"),
  acknowledgedByEmployee: boolean("acknowledged_by_employee").default(false),
  acknowledgedAt: timestamp("acknowledged_at"),
  status: text("status").notNull().default("ACTIVE"), // ACTIVE, EXPIRED, APPEALED, RESCINDED
  expiryDate: timestamp("expiry_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertHrDisciplinaryActionSchema = createInsertSchema(hrDisciplinaryActions).omit({
  id: true,
  createdAt: true,
});
export type InsertHrDisciplinaryAction = z.infer<typeof insertHrDisciplinaryActionSchema>;
export type HrDisciplinaryAction = typeof hrDisciplinaryActions.$inferSelect;

// ==================== CONDUCT & EQUAL OPPORTUNITY ====================

// Conduct Cases (harassment, discrimination per playbook section 11)
export const hrConductCases = pgTable("hr_conduct_cases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  caseNumber: text("case_number").notNull().unique(),
  reportedByEmployeeId: varchar("reported_by_employee_id"),
  reportedByAnonymous: boolean("reported_by_anonymous").default(false),
  accusedEmployeeId: varchar("accused_employee_id"),
  accusedIsExternal: boolean("accused_is_external").default(false),
  accusedExternalDescription: text("accused_external_description"),
  caseType: text("case_type").notNull(), // HARASSMENT, DISCRIMINATION, BULLYING, VIOLENCE, SUBSTANCE_ABUSE, SOCIAL_MEDIA_MISCONDUCT, OTHER
  severity: text("severity").notNull().default("MEDIUM"), // LOW, MEDIUM, HIGH, CRITICAL
  incidentDate: timestamp("incident_date"),
  incidentLocation: text("incident_location"),
  description: text("description").notNull(),
  evidenceFiles: text("evidence_files"), // JSON array
  witnesses: text("witnesses"), // JSON array
  investigatorId: varchar("investigator_id"),
  investigationStartedAt: timestamp("investigation_started_at"),
  investigationFindings: text("investigation_findings"),
  outcome: text("outcome"), // UNFOUNDED, SUBSTANTIATED, INCONCLUSIVE
  actionsTaken: text("actions_taken"), // JSON array
  status: text("status").notNull().default("OPEN"), // OPEN, UNDER_INVESTIGATION, PENDING_ACTION, RESOLVED, CLOSED
  resolvedAt: timestamp("resolved_at"),
  isConfidential: boolean("is_confidential").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertHrConductCaseSchema = createInsertSchema(hrConductCases).omit({
  id: true,
  createdAt: true,
});
export type InsertHrConductCase = z.infer<typeof insertHrConductCaseSchema>;
export type HrConductCase = typeof hrConductCases.$inferSelect;

// ==================== WHISTLEBLOWING ====================

// Whistleblower Reports (anonymous reporting per playbook section 15)
export const hrWhistleblowerReports = pgTable("hr_whistleblower_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  trackingCode: text("tracking_code").notNull().unique(), // Anonymous lookup code
  reportType: text("report_type").notNull(), // FRAUD, CORRUPTION, SAFETY_VIOLATION, HARASSMENT, DISCRIMINATION, THEFT, DATA_BREACH, OTHER
  severity: text("severity").notNull().default("MEDIUM"), // LOW, MEDIUM, HIGH, CRITICAL
  essenceUnitId: varchar("essence_unit_id"),
  countryCode: text("country_code"),
  description: text("description").notNull(),
  evidenceFiles: text("evidence_files"), // JSON array (encrypted references)
  reporterContactMethod: text("reporter_contact_method"), // EMAIL, PHONE, NONE
  reporterContactEncrypted: text("reporter_contact_encrypted"),
  assignedToUserId: varchar("assigned_to_user_id"),
  investigationNotes: text("investigation_notes"), // Encrypted
  status: text("status").notNull().default("NEW"), // NEW, ACKNOWLEDGED, UNDER_INVESTIGATION, PENDING_ACTION, RESOLVED, CLOSED
  outcome: text("outcome"),
  actionsTaken: text("actions_taken"), // JSON array
  requiresRegulatorNotification: boolean("requires_regulator_notification").default(false),
  regulatorNotifiedAt: timestamp("regulator_notified_at"),
  acknowledgedAt: timestamp("acknowledged_at"),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertHrWhistleblowerReportSchema = createInsertSchema(hrWhistleblowerReports).omit({
  id: true,
  createdAt: true,
});
export type InsertHrWhistleblowerReport = z.infer<typeof insertHrWhistleblowerReportSchema>;
export type HrWhistleblowerReport = typeof hrWhistleblowerReports.$inferSelect;

// ==================== ATTENDANCE & SICKNESS ====================

// Attendance Records (check-in/out per playbook section 4.3)
export const hrAttendanceRecords = pgTable("hr_attendance_records", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  employeeId: varchar("employee_id").notNull(),
  shiftAssignmentId: varchar("shift_assignment_id"),
  essenceUnitId: varchar("essence_unit_id").notNull(),
  checkInTime: timestamp("check_in_time"),
  checkOutTime: timestamp("check_out_time"),
  checkInMethod: text("check_in_method"), // PIN, BADGE, GPS, MANUAL
  checkInLocation: text("check_in_location"), // GPS coordinates
  isLate: boolean("is_late").default(false),
  lateMinutes: integer("late_minutes").default(0),
  isEarlyDeparture: boolean("is_early_departure").default(false),
  earlyDepartureMinutes: integer("early_departure_minutes").default(0),
  breakStartTime: timestamp("break_start_time"),
  breakEndTime: timestamp("break_end_time"),
  totalWorkedMinutes: integer("total_worked_minutes"),
  manualAdjustment: boolean("manual_adjustment").default(false),
  adjustedByUserId: varchar("adjusted_by_user_id"),
  adjustmentReason: text("adjustment_reason"),
  date: timestamp("date").notNull(),
});

export const insertHrAttendanceRecordSchema = createInsertSchema(hrAttendanceRecords).omit({
  id: true,
});
export type InsertHrAttendanceRecord = z.infer<typeof insertHrAttendanceRecordSchema>;
export type HrAttendanceRecord = typeof hrAttendanceRecords.$inferSelect;

// Sickness & Absence Records (per playbook section 4.4)
export const hrAbsenceRecords = pgTable("hr_absence_records", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  employeeId: varchar("employee_id").notNull(),
  absenceType: text("absence_type").notNull(), // SICK, ANNUAL_LEAVE, UNPAID_LEAVE, EMERGENCY, BEREAVEMENT, MATERNITY, PATERNITY, NO_SHOW
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  totalDays: numeric("total_days", { precision: 4, scale: 1 }),
  reason: text("reason"),
  medicalCertificateRequired: boolean("medical_certificate_required").default(false),
  medicalCertificateUrl: text("medical_certificate_url"),
  isFoodSafetyRelated: boolean("is_food_safety_related").default(false), // Vomiting, diarrhea, etc.
  returnToWorkCleared: boolean("return_to_work_cleared"),
  approvedByUserId: varchar("approved_by_user_id"),
  approvalStatus: text("approval_status").notNull().default("PENDING"), // PENDING, APPROVED, REJECTED
  approvalNotes: text("approval_notes"),
  affectedShiftIds: text("affected_shift_ids"), // JSON array
  coverageArranged: boolean("coverage_arranged").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertHrAbsenceRecordSchema = createInsertSchema(hrAbsenceRecords).omit({
  id: true,
  createdAt: true,
});
export type InsertHrAbsenceRecord = z.infer<typeof insertHrAbsenceRecordSchema>;
export type HrAbsenceRecord = typeof hrAbsenceRecords.$inferSelect;

// ==================== SECURITY & FRAUD PREVENTION ====================

// Security Audit Logs (per playbook section 9)
export const hrSecurityAudits = pgTable("hr_security_audits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  essenceUnitId: varchar("essence_unit_id").notNull(),
  auditDate: timestamp("audit_date").notNull(),
  auditedByUserId: varchar("audited_by_user_id").notNull(),
  cashHandlingCorrect: boolean("cash_handling_correct").default(true),
  allSalesRecorded: boolean("all_sales_recorded").default(true),
  discountsVerified: boolean("discounts_verified").default(true),
  refundsVerified: boolean("refunds_verified").default(true),
  stockCountAccurate: boolean("stock_count_accurate").default(true),
  cctcOperational: boolean("cctv_operational").default(true),
  accessControlsCorrect: boolean("access_controls_correct").default(true),
  suspiciousActivityNoted: text("suspicious_activity_noted"),
  overallPass: boolean("overall_pass").default(true),
  correctiveActions: text("corrective_actions"), // JSON array
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertHrSecurityAuditSchema = createInsertSchema(hrSecurityAudits).omit({
  id: true,
  createdAt: true,
});
export type InsertHrSecurityAudit = z.infer<typeof insertHrSecurityAuditSchema>;
export type HrSecurityAudit = typeof hrSecurityAudits.$inferSelect;

// ==================== HEALTH & SAFETY ====================

// Health & Safety Reports (per playbook section 10)
export const hrHealthSafetyReports = pgTable("hr_health_safety_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  essenceUnitId: varchar("essence_unit_id").notNull(),
  reportType: text("report_type").notNull(), // HAZARD_IDENTIFIED, ACCIDENT, NEAR_MISS, EQUIPMENT_ISSUE, FIRST_AID_USED
  severity: text("severity").notNull().default("LOW"), // LOW, MEDIUM, HIGH, CRITICAL
  reportedByUserId: varchar("reported_by_user_id").notNull(),
  incidentDate: timestamp("incident_date"),
  location: text("location"), // Specific area in shop
  description: text("description").notNull(),
  hazardType: text("hazard_type"), // WET_FLOOR, ELECTRICAL, LIFTING, SHARP_EDGES, CHEMICAL, BURN_RISK
  peopleInjured: integer("people_injured").default(0),
  injuryDetails: text("injury_details"),
  firstAidProvided: boolean("first_aid_provided").default(false),
  emergencyServicesCalledAt: timestamp("emergency_services_called_at"),
  immediateActionsTaken: text("immediate_actions_taken"),
  requiresInvestigation: boolean("requires_investigation").default(false),
  investigatorUserId: varchar("investigator_user_id"),
  investigationFindings: text("investigation_findings"),
  preventiveMeasures: text("preventive_measures"), // JSON array
  status: text("status").notNull().default("OPEN"), // OPEN, UNDER_REVIEW, ACTION_REQUIRED, RESOLVED, CLOSED
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertHrHealthSafetyReportSchema = createInsertSchema(hrHealthSafetyReports).omit({
  id: true,
  createdAt: true,
});
export type InsertHrHealthSafetyReport = z.infer<typeof insertHrHealthSafetyReportSchema>;
export type HrHealthSafetyReport = typeof hrHealthSafetyReports.$inferSelect;

// ==================== BOARD OF DIRECTORS & EXECUTIVE LEADERSHIP ====================

export const boardOfDirectors = pgTable("board_of_directors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  title: text("title").notNull(), // Managing Director, CEO, CFO, COO, CTO, etc.
  role: text("role").notNull(), // FOUNDER, EXECUTIVE, NON_EXECUTIVE, INDEPENDENT, ADVISOR
  email: text("email").notNull(),
  phone: text("phone"),
  bio: text("bio"),
  linkedinUrl: text("linkedin_url"),
  photoUrl: text("photo_url"),
  department: text("department"), // EXECUTIVE, OPERATIONS, FINANCE, TECHNOLOGY, MARKETING, HR, LEGAL
  region: text("region"), // Global, MENA, Europe, APAC
  isPrimary: boolean("is_primary").default(false), // Primary contact for their role
  appointmentDate: timestamp("appointment_date").notNull(),
  termEndDate: timestamp("term_end_date"),
  isActive: boolean("is_active").default(true).notNull(),
  votingRights: boolean("voting_rights").default(true),
  committees: text("committees"), // JSON array: AUDIT, COMPENSATION, NOMINATION, RISK, STRATEGY
  responsibilities: text("responsibilities"), // JSON array of key responsibilities
  displayOrder: integer("display_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertBoardMemberSchema = createInsertSchema(boardOfDirectors).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertBoardMember = z.infer<typeof insertBoardMemberSchema>;
export type BoardMember = typeof boardOfDirectors.$inferSelect;

// Executive Departments
export const executiveDepartments = pgTable("executive_departments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  code: text("code").notNull().unique(), // EXEC, OPS, FIN, TECH, MKT, HR, LEGAL, QA, CS
  description: text("description"),
  headId: varchar("head_id"), // Reference to board member
  parentDepartmentId: varchar("parent_department_id"),
  budget: numeric("budget", { precision: 15, scale: 2 }),
  headcount: integer("headcount").default(0),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertDepartmentSchema = createInsertSchema(executiveDepartments).omit({
  id: true,
  createdAt: true,
});
export type InsertDepartment = z.infer<typeof insertDepartmentSchema>;
export type ExecutiveDepartment = typeof executiveDepartments.$inferSelect;

// ==================== BROADCAST NOTIFICATIONS ====================

export const broadcastNotifications = pgTable("broadcast_notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull().default("general"), // general, loyalty, staff, vip, urgent
  targetAudience: text("target_audience").notNull().default("all"), // all, members, staff, vip, specific_tier
  targetTier: text("target_tier"), // PEARL, GOLD, PLATINUM, DIAMOND - optional
  targetCountry: text("target_country"), // optional country filter
  imageUrl: text("image_url"),
  actionUrl: text("action_url"),
  actionLabel: text("action_label"),
  priority: text("priority").default("normal"), // low, normal, high, urgent
  scheduledAt: timestamp("scheduled_at"),
  sentAt: timestamp("sent_at"),
  expiresAt: timestamp("expires_at"),
  recipientCount: integer("recipient_count").default(0),
  successCount: integer("success_count").default(0),
  failureCount: integer("failure_count").default(0),
  status: text("status").default("draft"), // draft, scheduled, sending, sent, failed, cancelled
  createdBy: varchar("created_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertBroadcastNotificationSchema = createInsertSchema(broadcastNotifications).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  recipientCount: true,
  successCount: true,
  failureCount: true,
  sentAt: true,
});
export type InsertBroadcastNotification = z.infer<typeof insertBroadcastNotificationSchema>;
export type BroadcastNotification = typeof broadcastNotifications.$inferSelect;

// Notification delivery logs
export const notificationDeliveryLogs = pgTable("notification_delivery_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  broadcastId: varchar("broadcast_id").notNull(),
  recipientId: varchar("recipient_id").notNull(),
  recipientType: text("recipient_type").notNull(), // member, staff
  recipientEmail: text("recipient_email"),
  deviceToken: text("device_token"),
  channel: text("channel").notNull(), // push, email, sms, in_app
  status: text("status").notNull().default("pending"), // pending, sent, delivered, read, failed
  errorMessage: text("error_message"),
  sentAt: timestamp("sent_at"),
  deliveredAt: timestamp("delivered_at"),
  readAt: timestamp("read_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertNotificationDeliveryLogSchema = createInsertSchema(notificationDeliveryLogs).omit({
  id: true,
  createdAt: true,
});
export type InsertNotificationDeliveryLog = z.infer<typeof insertNotificationDeliveryLogSchema>;
export type NotificationDeliveryLog = typeof notificationDeliveryLogs.$inferSelect;

// ==================== PUSH NOTIFICATION CONSENT ====================

export const pushNotificationConsents = pgTable("push_notification_consents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  deviceToken: text("device_token").notNull(),
  platform: text("platform").notNull(), // ios, android, web
  deviceType: text("device_type"), // iPhone, Android Phone, Tablet, Desktop
  deviceModel: text("device_model"),
  osVersion: text("os_version"),
  appVersion: text("app_version"),
  consentGiven: boolean("consent_given").default(true).notNull(),
  consentTimestamp: timestamp("consent_timestamp").defaultNow().notNull(),
  consentMethod: text("consent_method").notNull(), // in_app_prompt, settings, registration
  marketingConsent: boolean("marketing_consent").default(false),
  transactionalConsent: boolean("transactional_consent").default(true),
  loyaltyConsent: boolean("loyalty_consent").default(true),
  lastNotificationAt: timestamp("last_notification_at"),
  notificationCount: integer("notification_count").default(0),
  isActive: boolean("is_active").default(true).notNull(),
  revokedAt: timestamp("revoked_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertPushConsentSchema = createInsertSchema(pushNotificationConsents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertPushConsent = z.infer<typeof insertPushConsentSchema>;
export type PushNotificationConsent = typeof pushNotificationConsents.$inferSelect;

// ==================== LOYALTY REGISTRATION WITH EMAIL ====================

export const loyaltyRegistrations = pgTable("loyalty_registrations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  email: text("email").notNull().unique(),
  title: text("title"), // Mr, Mrs, Ms, Miss, Dr, Prof
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone"),
  dateOfBirth: timestamp("date_of_birth"),
  preferredLanguage: text("preferred_language").default("en"),
  country: text("country").notNull(),
  city: text("city"),
  membershipTier: text("membership_tier").default("PEARL"), // PEARL, GOLD, PLATINUM, DIAMOND
  pointsBalance: integer("points_balance").default(0),
  lifetimePoints: integer("lifetime_points").default(0),
  referralCode: text("referral_code").unique(),
  referredByCode: text("referred_by_code"),
  welcomeEmailSentAt: timestamp("welcome_email_sent_at"),
  emailVerified: boolean("email_verified").default(false),
  emailVerificationToken: text("email_verification_token"),
  pushNotificationEnabled: boolean("push_notification_enabled").default(false),
  marketingEmailEnabled: boolean("marketing_email_enabled").default(true),
  smsEnabled: boolean("sms_enabled").default(false),
  termsAcceptedAt: timestamp("terms_accepted_at").notNull(),
  privacyPolicyAcceptedAt: timestamp("privacy_policy_accepted_at").notNull(),
  gdprConsentAt: timestamp("gdpr_consent_at"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertLoyaltyRegistrationSchema = createInsertSchema(loyaltyRegistrations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  pointsBalance: true,
  lifetimePoints: true,
  welcomeEmailSentAt: true,
  emailVerified: true,
  emailVerificationToken: true,
}).extend({
  termsAcceptedAt: z.coerce.date(),
  privacyPolicyAcceptedAt: z.coerce.date(),
  dateOfBirth: z.coerce.date().optional(),
  gdprConsentAt: z.coerce.date().optional(),
});
export type InsertLoyaltyRegistration = z.infer<typeof insertLoyaltyRegistrationSchema>;
export type LoyaltyRegistration = typeof loyaltyRegistrations.$inferSelect;

// ==================== ESSENCE SOCIAL CLOUD ====================

// Social Cloud Member Profiles (extends loyaltyRegistrations)
export const socialProfiles = pgTable("social_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  displayName: text("display_name").notNull(),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  coverImageUrl: text("cover_image_url"),
  isVerified: boolean("is_verified").default(false),
  isInfluencer: boolean("is_influencer").default(false),
  followersCount: integer("followers_count").default(0),
  followingCount: integer("following_count").default(0),
  postsCount: integer("posts_count").default(0),
  totalLikesReceived: integer("total_likes_received").default(0),
  memberSince: timestamp("member_since").defaultNow(),
  lastActiveAt: timestamp("last_active_at").defaultNow(),
  isPrivate: boolean("is_private").default(false),
  allowMessages: boolean("allow_messages").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertSocialProfileSchema = createInsertSchema(socialProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  followersCount: true,
  followingCount: true,
  postsCount: true,
  totalLikesReceived: true,
});
export type InsertSocialProfile = z.infer<typeof insertSocialProfileSchema>;
export type SocialProfile = typeof socialProfiles.$inferSelect;

// Social Cloud Follows (member following relationships)
export const socialFollows = pgTable("social_follows", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  followerId: varchar("follower_id").notNull(),
  followingId: varchar("following_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSocialFollowSchema = createInsertSchema(socialFollows).omit({
  id: true,
  createdAt: true,
});
export type InsertSocialFollow = z.infer<typeof insertSocialFollowSchema>;
export type SocialFollow = typeof socialFollows.$inferSelect;

// Social Cloud Posts (feed content)
export const socialPosts = pgTable("social_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  authorId: varchar("author_id").notNull(),
  content: text("content"),
  postType: text("post_type").notNull().default("post"), // post, event, announcement, contest_entry
  visibility: text("visibility").default("public"), // public, followers, private
  locationName: text("location_name"),
  locationId: varchar("location_id"),
  likesCount: integer("likes_count").default(0),
  commentsCount: integer("comments_count").default(0),
  sharesCount: integer("shares_count").default(0),
  viewsCount: integer("views_count").default(0),
  isPinned: boolean("is_pinned").default(false),
  isOfficial: boolean("is_official").default(false), // Official Essence announcements
  isFeatured: boolean("is_featured").default(false),
  eventDate: timestamp("event_date"),
  eventTitle: text("event_title"),
  eventVenue: text("event_venue"),
  contestId: varchar("contest_id"),
  moderationStatus: text("moderation_status").default("approved"), // pending, approved, rejected
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertSocialPostSchema = createInsertSchema(socialPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  likesCount: true,
  commentsCount: true,
  sharesCount: true,
  viewsCount: true,
});
export type InsertSocialPost = z.infer<typeof insertSocialPostSchema>;
export type SocialPost = typeof socialPosts.$inferSelect;

// Social Cloud Media (photos/videos attached to posts)
export const socialMedia = pgTable("social_media", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  postId: varchar("post_id").notNull(),
  mediaType: text("media_type").notNull(), // image, video
  mediaUrl: text("media_url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  width: integer("width"),
  height: integer("height"),
  duration: integer("duration"), // for videos, in seconds
  altText: text("alt_text"),
  displayOrder: integer("display_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSocialMediaSchema = createInsertSchema(socialMedia).omit({
  id: true,
  createdAt: true,
});
export type InsertSocialMedia = z.infer<typeof insertSocialMediaSchema>;
export type SocialMedia = typeof socialMedia.$inferSelect;

// Social Cloud Hashtags
export const socialHashtags = pgTable("social_hashtags", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tag: text("tag").notNull().unique(),
  usageCount: integer("usage_count").default(0),
  isTrending: boolean("is_trending").default(false),
  isOfficial: boolean("is_official").default(false), // Official Essence hashtags
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSocialHashtagSchema = createInsertSchema(socialHashtags).omit({
  id: true,
  createdAt: true,
  usageCount: true,
});
export type InsertSocialHashtag = z.infer<typeof insertSocialHashtagSchema>;
export type SocialHashtag = typeof socialHashtags.$inferSelect;

// Social Cloud Post-Hashtag relationships
export const socialPostHashtags = pgTable("social_post_hashtags", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  postId: varchar("post_id").notNull(),
  hashtagId: varchar("hashtag_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSocialPostHashtagSchema = createInsertSchema(socialPostHashtags).omit({
  id: true,
  createdAt: true,
});
export type InsertSocialPostHashtag = z.infer<typeof insertSocialPostHashtagSchema>;
export type SocialPostHashtag = typeof socialPostHashtags.$inferSelect;

// Social Cloud Likes
export const socialLikes = pgTable("social_likes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  postId: varchar("post_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSocialLikeSchema = createInsertSchema(socialLikes).omit({
  id: true,
  createdAt: true,
});
export type InsertSocialLike = z.infer<typeof insertSocialLikeSchema>;
export type SocialLike = typeof socialLikes.$inferSelect;

// Social Cloud Comments
export const socialComments = pgTable("social_comments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  postId: varchar("post_id").notNull(),
  authorId: varchar("author_id").notNull(),
  parentCommentId: varchar("parent_comment_id"),
  content: text("content").notNull(),
  likesCount: integer("likes_count").default(0),
  repliesCount: integer("replies_count").default(0),
  moderationStatus: text("moderation_status").default("approved"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertSocialCommentSchema = createInsertSchema(socialComments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  likesCount: true,
  repliesCount: true,
});
export type InsertSocialComment = z.infer<typeof insertSocialCommentSchema>;
export type SocialComment = typeof socialComments.$inferSelect;

// Social Cloud Chat Rooms (DMs and group chats)
export const socialChatRooms = pgTable("social_chat_rooms", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  roomType: text("room_type").notNull().default("direct"), // direct, group
  name: text("name"), // for group chats
  avatarUrl: text("avatar_url"),
  createdById: varchar("created_by_id").notNull(),
  lastMessageAt: timestamp("last_message_at"),
  lastMessagePreview: text("last_message_preview"),
  memberCount: integer("member_count").default(2),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertSocialChatRoomSchema = createInsertSchema(socialChatRooms).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastMessageAt: true,
  lastMessagePreview: true,
});
export type InsertSocialChatRoom = z.infer<typeof insertSocialChatRoomSchema>;
export type SocialChatRoom = typeof socialChatRooms.$inferSelect;

// Social Cloud Chat Room Members
export const socialChatMembers = pgTable("social_chat_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  roomId: varchar("room_id").notNull(),
  userId: varchar("user_id").notNull(),
  role: text("role").default("member"), // admin, moderator, member
  nickname: text("nickname"),
  lastReadAt: timestamp("last_read_at"),
  unreadCount: integer("unread_count").default(0),
  isMuted: boolean("is_muted").default(false),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
  leftAt: timestamp("left_at"),
});

export const insertSocialChatMemberSchema = createInsertSchema(socialChatMembers).omit({
  id: true,
  joinedAt: true,
  unreadCount: true,
});
export type InsertSocialChatMember = z.infer<typeof insertSocialChatMemberSchema>;
export type SocialChatMember = typeof socialChatMembers.$inferSelect;

// Social Cloud Chat Messages
export const socialMessages = pgTable("social_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  roomId: varchar("room_id").notNull(),
  senderId: varchar("sender_id").notNull(),
  content: text("content"),
  messageType: text("message_type").default("text"), // text, image, video, emoji, system
  mediaUrl: text("media_url"),
  thumbnailUrl: text("thumbnail_url"),
  replyToMessageId: varchar("reply_to_message_id"),
  isEdited: boolean("is_edited").default(false),
  isDeleted: boolean("is_deleted").default(false),
  readBy: text("read_by").array(),
  deliveredAt: timestamp("delivered_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertSocialMessageSchema = createInsertSchema(socialMessages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  isEdited: true,
  isDeleted: true,
  deliveredAt: true,
});
export type InsertSocialMessage = z.infer<typeof insertSocialMessageSchema>;
export type SocialMessage = typeof socialMessages.$inferSelect;

// Photo Prize of the Month Contests
export const photoContests = pgTable("photo_contests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  theme: text("theme"),
  hashtag: text("hashtag").notNull(),
  coverImageUrl: text("cover_image_url"),
  prizeDescription: text("prize_description").notNull(),
  prizeValue: numeric("prize_value", { precision: 10, scale: 2 }),
  bonusPoints: integer("bonus_points").default(0),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  votingStartDate: timestamp("voting_start_date"),
  votingEndDate: timestamp("voting_end_date"),
  winnerId: varchar("winner_id"),
  winnerPostId: varchar("winner_post_id"),
  status: text("status").default("upcoming"), // upcoming, active, voting, completed
  entriesCount: integer("entries_count").default(0),
  votesCount: integer("votes_count").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertPhotoContestSchema = createInsertSchema(photoContests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  entriesCount: true,
  votesCount: true,
  winnerId: true,
  winnerPostId: true,
});
export type InsertPhotoContest = z.infer<typeof insertPhotoContestSchema>;
export type PhotoContest = typeof photoContests.$inferSelect;

// Photo Contest Entries
export const photoContestEntries = pgTable("photo_contest_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  contestId: varchar("contest_id").notNull(),
  postId: varchar("post_id").notNull(),
  userId: varchar("user_id").notNull(),
  votesCount: integer("votes_count").default(0),
  rank: integer("rank"),
  isWinner: boolean("is_winner").default(false),
  isFinalist: boolean("is_finalist").default(false),
  moderationStatus: text("moderation_status").default("approved"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPhotoContestEntrySchema = createInsertSchema(photoContestEntries).omit({
  id: true,
  createdAt: true,
  votesCount: true,
  rank: true,
  isWinner: true,
  isFinalist: true,
});
export type InsertPhotoContestEntry = z.infer<typeof insertPhotoContestEntrySchema>;
export type PhotoContestEntry = typeof photoContestEntries.$inferSelect;

// Photo Contest Votes
export const photoContestVotes = pgTable("photo_contest_votes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  contestId: varchar("contest_id").notNull(),
  entryId: varchar("entry_id").notNull(),
  voterId: varchar("voter_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPhotoContestVoteSchema = createInsertSchema(photoContestVotes).omit({
  id: true,
  createdAt: true,
});
export type InsertPhotoContestVote = z.infer<typeof insertPhotoContestVoteSchema>;
export type PhotoContestVote = typeof photoContestVotes.$inferSelect;

// Loyalty Leaderboard Snapshots (for top spenders/members)
export const loyaltyLeaderboard = pgTable("loyalty_leaderboard", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  period: text("period").notNull(), // monthly, quarterly, yearly, all_time
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),
  totalSpend: numeric("total_spend", { precision: 12, scale: 2 }).default("0"),
  totalPoints: integer("total_points").default(0),
  totalVisits: integer("total_visits").default(0),
  totalPosts: integer("total_posts").default(0),
  engagementScore: integer("engagement_score").default(0),
  rank: integer("rank"),
  tier: text("tier"), // bronze, silver, gold, platinum, diamond
  badgesEarned: text("badges_earned").array(),
  perksUnlocked: text("perks_unlocked").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertLoyaltyLeaderboardSchema = createInsertSchema(loyaltyLeaderboard).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  rank: true,
});
export type InsertLoyaltyLeaderboard = z.infer<typeof insertLoyaltyLeaderboardSchema>;
export type LoyaltyLeaderboard = typeof loyaltyLeaderboard.$inferSelect;

// Social Notifications
export const socialNotifications = pgTable("social_notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  type: text("type").notNull(), // like, comment, follow, mention, message, contest_win, perk_unlock
  title: text("title").notNull(),
  body: text("body"),
  actorId: varchar("actor_id"),
  postId: varchar("post_id"),
  commentId: varchar("comment_id"),
  contestId: varchar("contest_id"),
  messageId: varchar("message_id"),
  actionUrl: text("action_url"),
  isRead: boolean("is_read").default(false),
  readAt: timestamp("read_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSocialNotificationSchema = createInsertSchema(socialNotifications).omit({
  id: true,
  createdAt: true,
  isRead: true,
  readAt: true,
});
export type InsertSocialNotification = z.infer<typeof insertSocialNotificationSchema>;
export type SocialNotification = typeof socialNotifications.$inferSelect;

export const socialReports = pgTable("social_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  reporterId: varchar("reporter_id").notNull(),
  reportedUserId: varchar("reported_user_id"),
  postId: varchar("post_id"),
  commentId: varchar("comment_id"),
  messageId: varchar("message_id"),
  reportType: text("report_type").notNull(),
  reason: text("reason").notNull(),
  description: text("description"),
  evidence: text("evidence").array(),
  status: text("status").default("pending"),
  reviewedBy: varchar("reviewed_by"),
  reviewedAt: timestamp("reviewed_at"),
  resolution: text("resolution"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSocialReportSchema = createInsertSchema(socialReports).omit({
  id: true,
  createdAt: true,
  status: true,
  reviewedBy: true,
  reviewedAt: true,
  resolution: true,
});
export type InsertSocialReport = z.infer<typeof insertSocialReportSchema>;
export type SocialReport = typeof socialReports.$inferSelect;

export const memberInbox = pgTable("member_inbox", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  senderId: varchar("sender_id"),
  senderType: text("sender_type").default("system"),
  subject: text("subject").notNull(),
  body: text("body").notNull(),
  category: text("category").default("general"),
  priority: text("priority").default("normal"),
  isRead: boolean("is_read").default(false),
  readAt: timestamp("read_at"),
  isArchived: boolean("is_archived").default(false),
  archivedAt: timestamp("archived_at"),
  attachments: text("attachments").array(),
  actionUrl: text("action_url"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMemberInboxSchema = createInsertSchema(memberInbox).omit({
  id: true,
  createdAt: true,
  isRead: true,
  readAt: true,
  isArchived: true,
  archivedAt: true,
});
export type InsertMemberInbox = z.infer<typeof insertMemberInboxSchema>;
export type MemberInbox = typeof memberInbox.$inferSelect;
