import { 
  type ContactInquiry, type InsertContactInquiry,
  type JobPosting, type InsertJobPosting,
  type JobApplication, type InsertJobApplication,
  type DocumentAccessLog,
  type SupplierUser, type InsertSupplierUser,
  type FraudAlert, type InsertFraudAlert,
  type Flavor, type InsertFlavor,
  type Topping, type InsertTopping,
  type Location, type InsertLocation,
  type RevenueShareModel, type InsertRevenueShareModel,
  type EssenceUnit, type InsertEssenceUnit,
  type PricingRule, type InsertPricingRule,
  type EssenceEvent, type InsertEssenceEvent,
  type CreditPackage, type InsertCreditPackage,
  type LoyaltyTier, type InsertLoyaltyTier,
  type Customer, type InsertCustomer,
  type EGiftCard, type InsertEGiftCard,
  type FranchiseApplication, type InsertFranchiseApplication,
  type ProgrammaticLead, type InsertProgrammaticLead,
  type Supplier, type InsertSupplier,
  type SupplyItem, type InsertSupplyItem,
  type PurchaseOrder, type InsertPurchaseOrder,
  type PurchaseOrderItem, type InsertPurchaseOrderItem,
  type InventoryBatch, type InsertInventoryBatch,
  type SupplierPerformance, type InsertSupplierPerformance,
  type Employee, type InsertEmployee,
  type ShiftTemplate, type InsertShiftTemplate,
  type ShiftAssignment, type InsertShiftAssignment,
  type LeaveRequest, type InsertLeaveRequest,
  type PayrollCycle, type InsertPayrollCycle,
  type PayrollEntry, type InsertPayrollEntry,
  type InsurancePolicy, type InsertInsurancePolicy,
  type BusinessLicense, type InsertBusinessLicense,
  type TaxFiling, type InsertTaxFiling,
  type ComplianceTask, type InsertComplianceTask,
  type Document, type InsertDocument,
  type VipBenefit, type InsertVipBenefit,
  type VipEvent, type InsertVipEvent,
  type VipEventRsvp, type InsertVipEventRsvp,
  type MemberActivityLog, type InsertMemberActivityLog,
  type PosSession, type InsertPosSession,
  type PosTransaction, type InsertPosTransaction,
  type PosTransactionItem, type InsertPosTransactionItem,
  type PosPayment, type InsertPosPayment,
  type ScaleReading, type InsertScaleReading,
  type TimesheetEntry, type InsertTimesheetEntry,
  type TimesheetBreak, type InsertTimesheetBreak,
  type LocationVerification, type InsertLocationVerification,
  type InventoryItem, type InsertInventoryItem,
  type InventoryMovement, type InsertInventoryMovement,
  type WasteReport, type InsertWasteReport,
  type StockCount, type InsertStockCount,
  type StockCountItem, type InsertStockCountItem,
  type OperationalAlert, type InsertOperationalAlert,
  type SystemLog, type InsertSystemLog,
  type AiAnalysisReport, type InsertAiAnalysisReport,
  type TranslationLog, type InsertTranslationLog,
  type TransactionMonitoring, type InsertTransactionMonitoring,
  type UserErrorTracking, type InsertUserErrorTracking,
  type EcosystemHealthMetric, type InsertEcosystemHealthMetric,
  type AiMonitoringTask, type InsertAiMonitoringTask,
  type CountryConfiguration, type InsertCountryConfiguration,
  type RegulatoryPermit, type InsertRegulatoryPermit,
  type TaxConfiguration, type InsertTaxConfiguration,
  type RefrigerationUnit, type InsertRefrigerationUnit,
  type TemperatureReading, type InsertTemperatureReading,
  type FoodIngredient, type InsertFoodIngredient,
  type FoodSafetyAlert, type InsertFoodSafetyAlert,
  type FinancialTransaction, type InsertFinancialTransaction,
  type FinancialReport, type InsertFinancialReport,
  type EmployeeProfile, type InsertEmployeeProfile,
  type ShiftSchedule, type InsertShiftSchedule,
  type AbsenceRequest, type InsertAbsenceRequest,
  type ShiftCoverRequest, type InsertShiftCoverRequest,
  type VipInboxMessage, type InsertVipInboxMessage,
  type NotificationConsent, type InsertNotificationConsent,
  type EGiftPackage, type InsertEGiftPackage,
  type EGiftPurchase, type InsertEGiftPurchase,
  type PosScaleDevice, type InsertPosScaleDevice,
  type TheftAlert, type InsertTheftAlert,
  type User, type UpsertUser,
  type UtilityBill, type InsertUtilityBill,
  type RiskEvent, type InsertRiskEvent,
  type ComplianceAuditLog, type InsertComplianceAuditLog,
  type WasteLog, type InsertWasteLog,
  type IncidentRecord, type InsertIncidentRecord,
  type InsuranceRecord, type InsertInsuranceRecord,
  type PasskeyCredential, type InsertPasskeyCredential,
  contactInquiries, jobPostings, jobApplications, supplierUsers, fraudAlerts,
  flavors, toppings, locations,
  revenueShareModels, essenceUnits, pricingRules,
  essenceEvents, creditPackages, loyaltyTiers, customers,
  eGiftCards, franchiseApplications, programmaticLeads,
  suppliers, supplyItems, purchaseOrders, purchaseOrderItems,
  inventoryBatches, supplierPerformance,
  employees, shiftTemplates, shiftAssignments, leaveRequests,
  payrollCycles, payrollEntries,
  insurancePolicies, businessLicenses, taxFilings, complianceTasks, documents,
  vipBenefits, vipEvents, vipEventRsvps, memberActivityLogs,
  posSessions, posTransactions, posTransactionItems, posPayments, scaleReadings,
  timesheetEntries, timesheetBreaks, locationVerifications,
  inventoryItems, inventoryMovements, wasteReports, stockCounts, stockCountItems,
  operationalAlerts,
  systemLogs, aiAnalysisReports, translationLogs, transactionMonitoring,
  userErrorTracking, ecosystemHealthMetrics, aiMonitoringTasks,
  countryConfigurations, regulatoryPermits, taxConfigurations,
  refrigerationUnits, temperatureReadings, foodIngredients, foodSafetyAlerts,
  financialTransactions, financialReports,
  employeeProfiles, shiftSchedules, absenceRequests, shiftCoverRequests,
  vipInboxMessages, notificationConsents, eGiftPackages, eGiftPurchases,
  posScaleDevices, theftAlerts, users,
  utilityBills, riskEvents, complianceAuditLogs, wasteLogs, incidentRecords, insuranceRecords, passkeyCredentials,
  documentAccessLogs
} from "@shared/schema";
import { db } from "../db/index";
import { desc, eq, and, gte, lte, isNull, sql, inArray } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Contact Inquiries
  createContactInquiry(inquiry: InsertContactInquiry): Promise<ContactInquiry>;
  getAllContactInquiries(): Promise<ContactInquiry[]>;
  
  // Flavors
  getAllFlavors(): Promise<Flavor[]>;
  getFlavorByCode(internalCode: string): Promise<Flavor | undefined>;
  getFlavorsByTier(tier: string): Promise<Flavor[]>;
  createFlavor(flavor: InsertFlavor): Promise<Flavor>;
  updateFlavor(id: string, flavor: Partial<InsertFlavor>): Promise<Flavor | undefined>;
  deleteFlavor(id: string): Promise<boolean>;
  deleteAllFlavors(): Promise<void>;
  
  // Toppings
  getAllToppings(): Promise<Topping[]>;
  createTopping(topping: InsertTopping): Promise<Topping>;
  
  // Locations
  getAllLocations(): Promise<Location[]>;
  createLocation(location: InsertLocation): Promise<Location>;
  
  // Revenue Share Models
  getAllRevenueShareModels(): Promise<RevenueShareModel[]>;
  createRevenueShareModel(model: InsertRevenueShareModel): Promise<RevenueShareModel>;
  
  // Essence Units
  getAllEssenceUnits(): Promise<EssenceUnit[]>;
  getEssenceUnitById(id: string): Promise<EssenceUnit | undefined>;
  createEssenceUnit(unit: InsertEssenceUnit): Promise<EssenceUnit>;
  
  // Pricing Rules
  getAllPricingRules(): Promise<PricingRule[]>;
  createPricingRule(rule: InsertPricingRule): Promise<PricingRule>;
  
  // Essence Events
  getAllEssenceEvents(): Promise<EssenceEvent[]>;
  createEssenceEvent(event: InsertEssenceEvent): Promise<EssenceEvent>;
  
  // Credit Packages
  getAllCreditPackages(): Promise<CreditPackage[]>;
  createCreditPackage(pkg: InsertCreditPackage): Promise<CreditPackage>;
  
  // Loyalty Tiers
  getAllLoyaltyTiers(): Promise<LoyaltyTier[]>;
  createLoyaltyTier(tier: InsertLoyaltyTier): Promise<LoyaltyTier>;
  
  // Customers
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  getCustomerByEmail(email: string): Promise<Customer | undefined>;
  getCustomerById(id: string): Promise<Customer | undefined>;
  getAllCustomers(): Promise<Customer[]>;
  
  // E-Gift Cards
  createEGiftCard(card: InsertEGiftCard): Promise<EGiftCard>;
  getEGiftCardByCode(code: string): Promise<EGiftCard | undefined>;
  redeemEGiftCard(code: string): Promise<EGiftCard | undefined>;
  
  // Job Postings (Advertised positions)
  createJobPosting(posting: InsertJobPosting): Promise<JobPosting>;
  getAllJobPostings(activeOnly?: boolean): Promise<JobPosting[]>;
  getJobPostingById(id: string): Promise<JobPosting | undefined>;
  updateJobPosting(id: string, updates: Partial<InsertJobPosting>): Promise<JobPosting | undefined>;
  deleteJobPosting(id: string): Promise<boolean>;
  
  // Job Applications
  createJobApplication(app: InsertJobApplication): Promise<JobApplication>;
  getAllJobApplications(): Promise<JobApplication[]>;
  updateJobApplicationStatus(id: string, status: string, reviewedBy?: string): Promise<JobApplication | undefined>;
  updateJobApplicationResumeAnalysis(id: string, resumeText: string, resumeAiAnalysis: string): Promise<JobApplication | undefined>;
  updateJobApplicationDocuments(id: string, idDocumentUrl: string, photoUrl: string): Promise<JobApplication | undefined>;
  getJobApplicationById(id: string): Promise<JobApplication | undefined>;
  getJobApplicationByEmail(email: string): Promise<JobApplication | undefined>;
  updateIdentityVerification(id: string, status: string, verifiedBy: string, notes?: string): Promise<JobApplication | undefined>;
  getShortlistedApplicationsWithDocuments(): Promise<JobApplication[]>;
  logDocumentAccess(log: { applicationId: string; documentType: string; accessedBy: string; accessedByName?: string; accessedByRole?: string; ipAddress?: string; userAgent?: string; purpose?: string }): Promise<DocumentAccessLog>;
  getDocumentAccessLogs(applicationId: string): Promise<DocumentAccessLog[]>;
  
  // Supplier Users (External Portal)
  createSupplierUser(user: InsertSupplierUser): Promise<SupplierUser>;
  getSupplierUserByEmail(email: string): Promise<SupplierUser | undefined>;
  getSupplierUserById(id: string): Promise<SupplierUser | undefined>;
  updateSupplierUserLogin(id: string): Promise<void>;
  
  // Fraud Alerts
  createFraudAlert(alert: InsertFraudAlert): Promise<FraudAlert>;
  getAllFraudAlerts(resolved?: boolean): Promise<FraudAlert[]>;
  resolveFraudAlert(id: string, resolvedBy: string): Promise<FraudAlert | undefined>;
  
  // Franchise Applications
  createFranchiseApplication(app: InsertFranchiseApplication): Promise<FranchiseApplication>;
  getAllFranchiseApplications(): Promise<FranchiseApplication[]>;
  
  // Programmatic Advertising Leads
  createProgrammaticLead(lead: InsertProgrammaticLead): Promise<ProgrammaticLead>;
  getProgrammaticLead(id: string): Promise<ProgrammaticLead | undefined>;
  getProgrammaticLeads(filters?: { status?: string; country?: string; minScore?: number }): Promise<ProgrammaticLead[]>;
  updateProgrammaticLead(id: string, updates: Partial<ProgrammaticLead>): Promise<ProgrammaticLead | undefined>;
  getProgrammaticLeadStats(): Promise<{ total: number; byStatus: Record<string, number>; byCountry: Record<string, number>; avgScore: number }>;
  
  // =====================================================
  // PHASE 1: SUPPLIER MANAGEMENT
  // =====================================================
  
  // Suppliers
  getAllSuppliers(): Promise<Supplier[]>;
  getSupplierById(id: string): Promise<Supplier | undefined>;
  getSuppliersByType(type: string): Promise<Supplier[]>;
  createSupplier(supplier: InsertSupplier): Promise<Supplier>;
  updateSupplier(id: string, supplier: Partial<InsertSupplier>): Promise<Supplier | undefined>;
  
  // Supply Items
  getAllSupplyItems(): Promise<SupplyItem[]>;
  getSupplyItemById(id: string): Promise<SupplyItem | undefined>;
  getSupplyItemsBySupplierId(supplierId: string): Promise<SupplyItem[]>;
  createSupplyItem(item: InsertSupplyItem): Promise<SupplyItem>;
  updateSupplyItem(id: string, item: Partial<InsertSupplyItem>): Promise<SupplyItem | undefined>;
  
  // Purchase Orders
  getAllPurchaseOrders(): Promise<PurchaseOrder[]>;
  getPurchaseOrderById(id: string): Promise<PurchaseOrder | undefined>;
  getPurchaseOrdersBySupplierId(supplierId: string): Promise<PurchaseOrder[]>;
  createPurchaseOrder(order: InsertPurchaseOrder): Promise<PurchaseOrder>;
  updatePurchaseOrderStatus(id: string, status: string): Promise<PurchaseOrder | undefined>;
  
  // Purchase Order Items
  getPurchaseOrderItems(purchaseOrderId: string): Promise<PurchaseOrderItem[]>;
  createPurchaseOrderItem(item: InsertPurchaseOrderItem): Promise<PurchaseOrderItem>;
  
  // Inventory Batches
  getAllInventoryBatches(): Promise<InventoryBatch[]>;
  getInventoryBatchesByUnitId(essenceUnitId: string): Promise<InventoryBatch[]>;
  createInventoryBatch(batch: InsertInventoryBatch): Promise<InventoryBatch>;
  updateInventoryBatchQuantity(id: string, quantity: number): Promise<InventoryBatch | undefined>;
  
  // Supplier Performance
  getSupplierPerformanceHistory(supplierId: string): Promise<SupplierPerformance[]>;
  createSupplierPerformance(perf: InsertSupplierPerformance): Promise<SupplierPerformance>;
  
  // =====================================================
  // PHASE 2: EMPLOYEE OPERATIONS
  // =====================================================
  
  // Employees
  getAllEmployees(): Promise<Employee[]>;
  getEmployeeById(id: string): Promise<Employee | undefined>;
  getEmployeesByUnitId(essenceUnitId: string): Promise<Employee[]>;
  createEmployee(employee: InsertEmployee): Promise<Employee>;
  updateEmployee(id: string, employee: Partial<InsertEmployee>): Promise<Employee | undefined>;
  
  // Shift Templates
  getAllShiftTemplates(): Promise<ShiftTemplate[]>;
  getShiftTemplatesByUnitId(essenceUnitId: string): Promise<ShiftTemplate[]>;
  createShiftTemplate(template: InsertShiftTemplate): Promise<ShiftTemplate>;
  
  // Shift Assignments
  getAllShiftAssignments(): Promise<ShiftAssignment[]>;
  getShiftAssignmentsByDate(date: Date): Promise<ShiftAssignment[]>;
  getShiftAssignmentsByEmployeeId(employeeId: string): Promise<ShiftAssignment[]>;
  createShiftAssignment(assignment: InsertShiftAssignment): Promise<ShiftAssignment>;
  updateShiftAssignmentStatus(id: string, status: string): Promise<ShiftAssignment | undefined>;
  
  // Leave Requests
  getAllLeaveRequests(): Promise<LeaveRequest[]>;
  getLeaveRequestsByEmployeeId(employeeId: string): Promise<LeaveRequest[]>;
  getPendingLeaveRequests(): Promise<LeaveRequest[]>;
  createLeaveRequest(request: InsertLeaveRequest): Promise<LeaveRequest>;
  updateLeaveRequestStatus(id: string, status: string, approvedBy?: string): Promise<LeaveRequest | undefined>;
  
  // Payroll
  getAllPayrollCycles(): Promise<PayrollCycle[]>;
  getPayrollCycleById(id: string): Promise<PayrollCycle | undefined>;
  createPayrollCycle(cycle: InsertPayrollCycle): Promise<PayrollCycle>;
  updatePayrollCycleStatus(id: string, status: string): Promise<PayrollCycle | undefined>;
  getPayrollEntriesByCycleId(cycleId: string): Promise<PayrollEntry[]>;
  createPayrollEntry(entry: InsertPayrollEntry): Promise<PayrollEntry>;
  
  // =====================================================
  // PHASE 3: COMPLIANCE & LEGAL
  // =====================================================
  
  // Insurance Policies
  getAllInsurancePolicies(): Promise<InsurancePolicy[]>;
  getInsurancePolicyById(id: string): Promise<InsurancePolicy | undefined>;
  createInsurancePolicy(policy: InsertInsurancePolicy): Promise<InsurancePolicy>;
  updateInsurancePolicyStatus(id: string, status: string): Promise<InsurancePolicy | undefined>;
  
  // Business Licenses
  getAllBusinessLicenses(): Promise<BusinessLicense[]>;
  getBusinessLicenseById(id: string): Promise<BusinessLicense | undefined>;
  createBusinessLicense(license: InsertBusinessLicense): Promise<BusinessLicense>;
  updateBusinessLicenseStatus(id: string, status: string): Promise<BusinessLicense | undefined>;
  
  // Tax Filings
  getAllTaxFilings(): Promise<TaxFiling[]>;
  getTaxFilingById(id: string): Promise<TaxFiling | undefined>;
  createTaxFiling(filing: InsertTaxFiling): Promise<TaxFiling>;
  updateTaxFilingStatus(id: string, status: string): Promise<TaxFiling | undefined>;
  
  // Compliance Tasks
  getAllComplianceTasks(): Promise<ComplianceTask[]>;
  getComplianceTaskById(id: string): Promise<ComplianceTask | undefined>;
  getPendingComplianceTasks(): Promise<ComplianceTask[]>;
  getOverdueComplianceTasks(): Promise<ComplianceTask[]>;
  createComplianceTask(task: InsertComplianceTask): Promise<ComplianceTask>;
  updateComplianceTaskStatus(id: string, status: string): Promise<ComplianceTask | undefined>;
  
  // Documents
  getAllDocuments(): Promise<Document[]>;
  getDocumentsByEntity(entityType: string, entityId: string): Promise<Document[]>;
  createDocument(doc: InsertDocument): Promise<Document>;
  
  // =====================================================
  // PHASE 4: VIP LOYALTY
  // =====================================================
  
  // VIP Benefits
  getAllVipBenefits(): Promise<VipBenefit[]>;
  getVipBenefitsByTierId(tierId: string): Promise<VipBenefit[]>;
  createVipBenefit(benefit: InsertVipBenefit): Promise<VipBenefit>;
  
  // VIP Events
  getAllVipEvents(): Promise<VipEvent[]>;
  getUpcomingVipEvents(): Promise<VipEvent[]>;
  getVipEventById(id: string): Promise<VipEvent | undefined>;
  createVipEvent(event: InsertVipEvent): Promise<VipEvent>;
  updateVipEventStatus(id: string, status: string): Promise<VipEvent | undefined>;
  
  // VIP Event RSVPs
  getVipEventRsvps(eventId: string): Promise<VipEventRsvp[]>;
  createVipEventRsvp(rsvp: InsertVipEventRsvp): Promise<VipEventRsvp>;
  updateVipEventRsvpStatus(id: string, status: string): Promise<VipEventRsvp | undefined>;
  
  // Member Activity Logs
  getMemberActivityLogs(customerId: string): Promise<MemberActivityLog[]>;
  createMemberActivityLog(log: InsertMemberActivityLog): Promise<MemberActivityLog>;
  
  // =====================================================
  // PHASE 5: POS SYSTEM
  // =====================================================
  
  // POS Sessions
  getOpenPosSessions(essenceUnitId: string): Promise<PosSession[]>;
  getPosSessionById(id: string): Promise<PosSession | undefined>;
  createPosSession(session: InsertPosSession): Promise<PosSession>;
  closePosSession(id: string, closingData: { closingCash: string; expectedCash: string; cashVariance: string }): Promise<PosSession | undefined>;
  
  // POS Transactions
  getPosTransactionsBySession(sessionId: string): Promise<PosTransaction[]>;
  getPosTransactionById(id: string): Promise<PosTransaction | undefined>;
  getRecentPosTransactions(limit?: number, essenceUnitId?: string): Promise<PosTransaction[]>;
  createPosTransaction(transaction: InsertPosTransaction): Promise<PosTransaction>;
  completePosTransaction(id: string): Promise<PosTransaction | undefined>;
  voidPosTransaction(id: string, voidedBy: string, voidReason: string): Promise<PosTransaction | undefined>;
  
  // POS Transaction Items
  getPosTransactionItems(transactionId: string): Promise<PosTransactionItem[]>;
  createPosTransactionItem(item: InsertPosTransactionItem): Promise<PosTransactionItem>;
  
  // POS Payments
  getPosPayments(transactionId: string): Promise<PosPayment[]>;
  createPosPayment(payment: InsertPosPayment): Promise<PosPayment>;
  
  // Scale Readings
  createScaleReading(reading: InsertScaleReading): Promise<ScaleReading>;
  getScaleReadingsBySession(sessionId: string): Promise<ScaleReading[]>;
  
  // =====================================================
  // PHASE 6: TIMESHEET SYSTEM
  // =====================================================
  
  // Timesheet Entries
  getActiveTimesheetEntry(employeeId: string): Promise<TimesheetEntry | undefined>;
  getTimesheetEntriesByEmployee(employeeId: string, startDate?: Date, endDate?: Date): Promise<TimesheetEntry[]>;
  getTimesheetEntriesByUnit(essenceUnitId: string, date?: Date): Promise<TimesheetEntry[]>;
  getPendingTimesheetApprovals(): Promise<TimesheetEntry[]>;
  createTimesheetEntry(entry: InsertTimesheetEntry): Promise<TimesheetEntry>;
  clockOut(id: string, clockOutData: Partial<InsertTimesheetEntry>): Promise<TimesheetEntry | undefined>;
  approveTimesheet(id: string, approvedBy: string): Promise<TimesheetEntry | undefined>;
  rejectTimesheet(id: string, reason: string): Promise<TimesheetEntry | undefined>;
  
  // Timesheet Breaks
  getTimesheetBreaks(timesheetEntryId: string): Promise<TimesheetBreak[]>;
  startBreak(breakData: InsertTimesheetBreak): Promise<TimesheetBreak>;
  endBreak(id: string, endData: Partial<InsertTimesheetBreak>): Promise<TimesheetBreak | undefined>;
  
  // Location Verifications
  createLocationVerification(verification: InsertLocationVerification): Promise<LocationVerification>;
  getLocationVerifications(timesheetEntryId: string): Promise<LocationVerification[]>;
  getFlaggedVerifications(): Promise<LocationVerification[]>;
  
  // =====================================================
  // PHASE 7: STOCK CONTROL
  // =====================================================
  
  // Inventory Items
  getInventoryItemsByUnit(essenceUnitId: string): Promise<InventoryItem[]>;
  getInventoryItemById(id: string): Promise<InventoryItem | undefined>;
  createInventoryItem(item: InsertInventoryItem): Promise<InventoryItem>;
  updateInventoryQuantity(id: string, quantity: string): Promise<InventoryItem | undefined>;
  
  // Inventory Movements
  getInventoryMovements(inventoryItemId: string): Promise<InventoryMovement[]>;
  getInventoryMovementsByUnit(essenceUnitId: string, startDate?: Date, endDate?: Date): Promise<InventoryMovement[]>;
  createInventoryMovement(movement: InsertInventoryMovement): Promise<InventoryMovement>;
  
  // Waste Reports
  getWasteReports(essenceUnitId?: string): Promise<WasteReport[]>;
  getPendingWasteApprovals(): Promise<WasteReport[]>;
  getSuspiciousWasteReports(): Promise<WasteReport[]>;
  createWasteReport(report: InsertWasteReport): Promise<WasteReport>;
  approveWasteReport(id: string, supervisorId: string): Promise<WasteReport | undefined>;
  rejectWasteReport(id: string, reason: string): Promise<WasteReport | undefined>;
  
  // Stock Counts
  getStockCounts(essenceUnitId?: string): Promise<StockCount[]>;
  getStockCountById(id: string): Promise<StockCount | undefined>;
  createStockCount(count: InsertStockCount): Promise<StockCount>;
  startStockCount(id: string, countedBy: string): Promise<StockCount | undefined>;
  completeStockCount(id: string, verifiedBy?: string): Promise<StockCount | undefined>;
  
  // Stock Count Items
  getStockCountItems(stockCountId: string): Promise<StockCountItem[]>;
  createStockCountItem(item: InsertStockCountItem): Promise<StockCountItem>;
  
  // =====================================================
  // PHASE 8: OPERATIONAL ALERTS
  // =====================================================
  
  getOperationalAlerts(unreadOnly?: boolean): Promise<OperationalAlert[]>;
  getOperationalAlertsByUnit(essenceUnitId: string): Promise<OperationalAlert[]>;
  getCriticalAlerts(): Promise<OperationalAlert[]>;
  createOperationalAlert(alert: InsertOperationalAlert): Promise<OperationalAlert>;
  acknowledgeAlert(id: string, acknowledgedBy: string): Promise<OperationalAlert | undefined>;
  resolveAlert(id: string, resolvedBy: string, notes?: string): Promise<OperationalAlert | undefined>;

  // =====================================================
  // PHASE 9: AI MONITORING & ANALYTICS
  // =====================================================

  // System Logs
  createSystemLog(log: InsertSystemLog): Promise<SystemLog>;
  getSystemLogs(filters?: { level?: string; category?: string; startDate?: Date; endDate?: Date; limit?: number }): Promise<SystemLog[]>;
  getSystemLogsByCategory(category: string): Promise<SystemLog[]>;
  getErrorLogs(startDate?: Date, endDate?: Date): Promise<SystemLog[]>;

  // AI Analysis Reports
  createAiAnalysisReport(report: InsertAiAnalysisReport): Promise<AiAnalysisReport>;
  getAiAnalysisReports(filters?: { type?: string; scope?: string; limit?: number }): Promise<AiAnalysisReport[]>;
  getAiAnalysisReportById(id: string): Promise<AiAnalysisReport | undefined>;
  getPendingActionReports(): Promise<AiAnalysisReport[]>;
  markReportActioned(id: string, actionedBy: string, notes?: string): Promise<AiAnalysisReport | undefined>;

  // Translation Logs
  createTranslationLog(log: InsertTranslationLog): Promise<TranslationLog>;
  getTranslationLogs(targetLanguage?: string): Promise<TranslationLog[]>;
  getUnreviewedTranslations(): Promise<TranslationLog[]>;
  reviewTranslation(id: string, reviewedBy: string, notes?: string): Promise<TranslationLog | undefined>;

  // Transaction Monitoring
  createTransactionMonitoring(record: InsertTransactionMonitoring): Promise<TransactionMonitoring>;
  getTransactionMonitoring(filters?: { anomalyOnly?: boolean; requiresReview?: boolean; limit?: number }): Promise<TransactionMonitoring[]>;
  getAnomalousTransactions(): Promise<TransactionMonitoring[]>;
  reviewTransaction(id: string, reviewedBy: string, outcome: string, notes?: string): Promise<TransactionMonitoring | undefined>;

  // User Error Tracking
  createUserErrorTracking(error: InsertUserErrorTracking): Promise<UserErrorTracking>;
  getUserErrors(filters?: { severity?: string; resolved?: boolean; limit?: number }): Promise<UserErrorTracking[]>;
  getUnresolvedErrors(): Promise<UserErrorTracking[]>;
  resolveUserError(id: string, resolvedBy: string, resolutionType: string): Promise<UserErrorTracking | undefined>;
  incrementErrorCount(errorMessage: string, errorType: string): Promise<UserErrorTracking | undefined>;

  // Ecosystem Health Metrics
  createHealthMetric(metric: InsertEcosystemHealthMetric): Promise<EcosystemHealthMetric>;
  getHealthMetrics(filters?: { type?: string; scope?: string; periodType?: string; limit?: number }): Promise<EcosystemHealthMetric[]>;
  getLatestHealthStatus(): Promise<EcosystemHealthMetric[]>;
  getCriticalHealthMetrics(): Promise<EcosystemHealthMetric[]>;

  // AI Monitoring Tasks
  createAiMonitoringTask(task: InsertAiMonitoringTask): Promise<AiMonitoringTask>;
  getAiMonitoringTasks(activeOnly?: boolean): Promise<AiMonitoringTask[]>;
  getAiMonitoringTaskById(id: string): Promise<AiMonitoringTask | undefined>;
  updateTaskLastRun(id: string, status: string, duration: number): Promise<AiMonitoringTask | undefined>;
  toggleTaskActive(id: string): Promise<AiMonitoringTask | undefined>;

  // Dashboard Stats
  getMonitoringDashboardStats(): Promise<{
    totalLogs: number;
    errorCount: number;
    anomalyCount: number;
    unresolvedErrors: number;
    pendingReviews: number;
    healthStatus: string;
  }>;

  // Country Configurations
  getAllCountryConfigurations(): Promise<CountryConfiguration[]>;
  getCountryByCode(code: string): Promise<CountryConfiguration | undefined>;
  createCountryConfiguration(config: InsertCountryConfiguration): Promise<CountryConfiguration>;
  updateCountryConfiguration(id: string, config: Partial<InsertCountryConfiguration>): Promise<CountryConfiguration | undefined>;

  // Regulatory Permits
  getRegulatoryPermitsByCountry(countryCode: string): Promise<RegulatoryPermit[]>;
  getRegulatoryPermitsByUnit(essenceUnitId: string): Promise<RegulatoryPermit[]>;
  getExpiringPermits(daysAhead: number): Promise<RegulatoryPermit[]>;
  createRegulatoryPermit(permit: InsertRegulatoryPermit): Promise<RegulatoryPermit>;
  updateRegulatoryPermit(id: string, permit: Partial<InsertRegulatoryPermit>): Promise<RegulatoryPermit | undefined>;

  // Tax Configurations
  getTaxConfigurationsByCountry(countryCode: string): Promise<TaxConfiguration[]>;
  createTaxConfiguration(config: InsertTaxConfiguration): Promise<TaxConfiguration>;

  // Refrigeration Units
  getRefrigerationUnitsByEssenceUnit(essenceUnitId: string): Promise<RefrigerationUnit[]>;
  createRefrigerationUnit(unit: InsertRefrigerationUnit): Promise<RefrigerationUnit>;

  // Temperature Readings
  getTemperatureReadingsByUnit(refrigerationUnitId: string, limit?: number): Promise<TemperatureReading[]>;
  createTemperatureReading(reading: InsertTemperatureReading): Promise<TemperatureReading>;
  getOutOfRangeReadings(essenceUnitId: string): Promise<TemperatureReading[]>;

  // Food Ingredients
  getFoodIngredientsByEssenceUnit(essenceUnitId: string): Promise<FoodIngredient[]>;
  getExpiringIngredients(daysAhead: number): Promise<FoodIngredient[]>;
  createFoodIngredient(ingredient: InsertFoodIngredient): Promise<FoodIngredient>;
  updateFoodIngredient(id: string, ingredient: Partial<InsertFoodIngredient>): Promise<FoodIngredient | undefined>;

  // Food Safety Alerts
  getFoodSafetyAlerts(essenceUnitId?: string): Promise<FoodSafetyAlert[]>;
  getOpenFoodSafetyAlerts(): Promise<FoodSafetyAlert[]>;
  createFoodSafetyAlert(alert: InsertFoodSafetyAlert): Promise<FoodSafetyAlert>;
  updateFoodSafetyAlert(id: string, alert: Partial<InsertFoodSafetyAlert>): Promise<FoodSafetyAlert | undefined>;

  // Financial Transactions
  getFinancialTransactions(countryCode?: string, startDate?: Date, endDate?: Date): Promise<FinancialTransaction[]>;
  createFinancialTransaction(transaction: InsertFinancialTransaction): Promise<FinancialTransaction>;

  // Financial Reports
  getFinancialReports(countryCode?: string): Promise<FinancialReport[]>;
  createFinancialReport(report: InsertFinancialReport): Promise<FinancialReport>;

  // Employee Profiles
  getEmployeeProfileByEmployeeId(employeeId: string): Promise<EmployeeProfile | undefined>;
  getEmployeeProfilesByUnit(essenceUnitId: string): Promise<EmployeeProfile[]>;
  createEmployeeProfile(profile: InsertEmployeeProfile): Promise<EmployeeProfile>;
  updateEmployeeProfile(id: string, profile: Partial<InsertEmployeeProfile>): Promise<EmployeeProfile | undefined>;

  // Shift Schedules
  getShiftSchedulesByUnit(essenceUnitId: string): Promise<ShiftSchedule[]>;
  createShiftSchedule(schedule: InsertShiftSchedule): Promise<ShiftSchedule>;

  // Absence Requests
  getAbsenceRequestsByEmployee(employeeId: string): Promise<AbsenceRequest[]>;
  getPendingAbsenceRequests(essenceUnitId: string): Promise<AbsenceRequest[]>;
  createAbsenceRequest(request: InsertAbsenceRequest): Promise<AbsenceRequest>;
  updateAbsenceRequest(id: string, request: Partial<InsertAbsenceRequest>): Promise<AbsenceRequest | undefined>;

  // Shift Cover Requests
  getShiftCoverRequestsByAbsence(absenceRequestId: string): Promise<ShiftCoverRequest[]>;
  getPendingShiftCoverRequests(employeeId: string): Promise<ShiftCoverRequest[]>;
  createShiftCoverRequest(request: InsertShiftCoverRequest): Promise<ShiftCoverRequest>;
  updateShiftCoverRequest(id: string, request: Partial<InsertShiftCoverRequest>): Promise<ShiftCoverRequest | undefined>;

  // VIP Inbox Messages
  getVipInboxMessages(customerId: string): Promise<VipInboxMessage[]>;
  getUnreadVipMessages(customerId: string): Promise<VipInboxMessage[]>;
  createVipInboxMessage(message: InsertVipInboxMessage): Promise<VipInboxMessage>;
  markVipMessageAsRead(id: string): Promise<VipInboxMessage | undefined>;

  // Notification Consents
  getNotificationConsents(customerId: string): Promise<NotificationConsent[]>;
  createNotificationConsent(consent: InsertNotificationConsent): Promise<NotificationConsent>;
  updateNotificationConsent(id: string, consent: Partial<InsertNotificationConsent>): Promise<NotificationConsent | undefined>;

  // E-Gift Packages
  getActiveEGiftPackages(): Promise<EGiftPackage[]>;
  createEGiftPackage(pkg: InsertEGiftPackage): Promise<EGiftPackage>;

  // E-Gift Purchases
  getEGiftPurchasesByCustomer(customerId: string): Promise<EGiftPurchase[]>;
  getEGiftPurchaseByCode(code: string): Promise<EGiftPurchase | undefined>;
  createEGiftPurchase(purchase: InsertEGiftPurchase): Promise<EGiftPurchase>;
  updateEGiftPurchase(id: string, purchase: Partial<InsertEGiftPurchase>): Promise<EGiftPurchase | undefined>;

  // POS Scale Devices
  getPosScaleDevicesByUnit(essenceUnitId: string): Promise<PosScaleDevice[]>;
  createPosScaleDevice(device: InsertPosScaleDevice): Promise<PosScaleDevice>;

  // Theft Alerts
  getTheftAlerts(essenceUnitId?: string): Promise<TheftAlert[]>;
  getOpenTheftAlerts(): Promise<TheftAlert[]>;
  createTheftAlert(alert: InsertTheftAlert): Promise<TheftAlert>;
  updateTheftAlert(id: string, alert: Partial<InsertTheftAlert>): Promise<TheftAlert | undefined>;

  // =====================================================
  // PASSKEY / WEBAUTHN CREDENTIALS
  // =====================================================
  getPasskeysByUserId(userId: string): Promise<PasskeyCredential[]>;
  getPasskeyByCredentialId(credentialId: string): Promise<PasskeyCredential | undefined>;
  createPasskeyCredential(credential: InsertPasskeyCredential): Promise<PasskeyCredential>;
  updatePasskeyCounter(credentialId: string, counter: number): Promise<void>;
  deletePasskey(credentialId: string): Promise<void>;
}

export class DbStorage implements IStorage {
  // =====================================================
  // USER OPERATIONS (Required for Replit Auth)
  // =====================================================

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // =====================================================
  // EXISTING IMPLEMENTATIONS
  // =====================================================
  
  async createContactInquiry(inquiry: InsertContactInquiry): Promise<ContactInquiry> {
    const [result] = await db.insert(contactInquiries).values(inquiry).returning();
    return result;
  }

  async getAllContactInquiries(): Promise<ContactInquiry[]> {
    return db.select().from(contactInquiries).orderBy(desc(contactInquiries.createdAt));
  }

  async getAllFlavors(): Promise<Flavor[]> {
    return db.select().from(flavors).where(eq(flavors.isActive, true)).orderBy(flavors.displayOrder);
  }

  async getFlavorByCode(internalCode: string): Promise<Flavor | undefined> {
    const [result] = await db.select().from(flavors).where(eq(flavors.internalCode, internalCode));
    return result;
  }

  async getFlavorsByTier(tier: string): Promise<Flavor[]> {
    return db.select().from(flavors).where(and(eq(flavors.tier, tier), eq(flavors.isActive, true))).orderBy(flavors.priority, flavors.displayOrder);
  }

  async createFlavor(flavor: InsertFlavor): Promise<Flavor> {
    const [result] = await db.insert(flavors).values(flavor).returning();
    return result;
  }

  async updateFlavor(id: string, flavor: Partial<InsertFlavor>): Promise<Flavor | undefined> {
    const [result] = await db.update(flavors).set(flavor).where(eq(flavors.id, id)).returning();
    return result;
  }

  async deleteFlavor(id: string): Promise<boolean> {
    const result = await db.delete(flavors).where(eq(flavors.id, id));
    return true;
  }

  async deleteAllFlavors(): Promise<void> {
    await db.delete(flavors);
  }

  async getAllToppings(): Promise<Topping[]> {
    return db.select().from(toppings).where(eq(toppings.isActive, true)).orderBy(toppings.displayOrder);
  }

  async createTopping(topping: InsertTopping): Promise<Topping> {
    const [result] = await db.insert(toppings).values(topping).returning();
    return result;
  }

  async getAllLocations(): Promise<Location[]> {
    return db.select().from(locations).where(eq(locations.isActive, true)).orderBy(locations.displayOrder);
  }

  async createLocation(location: InsertLocation): Promise<Location> {
    const [result] = await db.insert(locations).values(location).returning();
    return result;
  }

  async getAllRevenueShareModels(): Promise<RevenueShareModel[]> {
    return db.select().from(revenueShareModels).orderBy(revenueShareModels.name);
  }

  async createRevenueShareModel(model: InsertRevenueShareModel): Promise<RevenueShareModel> {
    const [result] = await db.insert(revenueShareModels).values(model).returning();
    return result;
  }

  async getAllEssenceUnits(): Promise<EssenceUnit[]> {
    return db.select().from(essenceUnits).where(eq(essenceUnits.isActive, true));
  }

  async getEssenceUnitById(id: string): Promise<EssenceUnit | undefined> {
    const [result] = await db.select().from(essenceUnits).where(eq(essenceUnits.id, id));
    return result;
  }

  async createEssenceUnit(unit: InsertEssenceUnit): Promise<EssenceUnit> {
    const [result] = await db.insert(essenceUnits).values(unit).returning();
    return result;
  }

  async getAllPricingRules(): Promise<PricingRule[]> {
    return db.select().from(pricingRules);
  }

  async createPricingRule(rule: InsertPricingRule): Promise<PricingRule> {
    const [result] = await db.insert(pricingRules).values(rule).returning();
    return result;
  }

  async getAllEssenceEvents(): Promise<EssenceEvent[]> {
    return db.select().from(essenceEvents).orderBy(desc(essenceEvents.startDateTime));
  }

  async createEssenceEvent(event: InsertEssenceEvent): Promise<EssenceEvent> {
    const [result] = await db.insert(essenceEvents).values(event).returning();
    return result;
  }

  async getAllCreditPackages(): Promise<CreditPackage[]> {
    return db.select().from(creditPackages);
  }

  async createCreditPackage(pkg: InsertCreditPackage): Promise<CreditPackage> {
    const [result] = await db.insert(creditPackages).values(pkg).returning();
    return result;
  }

  async getAllLoyaltyTiers(): Promise<LoyaltyTier[]> {
    return db.select().from(loyaltyTiers).orderBy(loyaltyTiers.requiredPoints);
  }

  async createLoyaltyTier(tier: InsertLoyaltyTier): Promise<LoyaltyTier> {
    const [result] = await db.insert(loyaltyTiers).values(tier).returning();
    return result;
  }

  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    const [result] = await db.insert(customers).values(customer).returning();
    return result;
  }

  async getCustomerByEmail(email: string): Promise<Customer | undefined> {
    const [result] = await db.select().from(customers).where(eq(customers.email, email));
    return result;
  }

  async getCustomerById(id: string): Promise<Customer | undefined> {
    const [result] = await db.select().from(customers).where(eq(customers.id, id));
    return result;
  }

  async getAllCustomers(): Promise<Customer[]> {
    return db.select().from(customers).orderBy(desc(customers.createdAt));
  }

  async createEGiftCard(card: InsertEGiftCard): Promise<EGiftCard> {
    const code = `EY-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const [result] = await db.insert(eGiftCards).values({ ...card, code }).returning();
    return result;
  }

  async getEGiftCardByCode(code: string): Promise<EGiftCard | undefined> {
    const [result] = await db.select().from(eGiftCards).where(eq(eGiftCards.code, code));
    return result;
  }

  async redeemEGiftCard(code: string): Promise<EGiftCard | undefined> {
    const [result] = await db
      .update(eGiftCards)
      .set({ isRedeemed: true, redeemedAt: new Date() })
      .where(eq(eGiftCards.code, code))
      .returning();
    return result;
  }

  // Job Postings (Advertised positions)
  async createJobPosting(posting: InsertJobPosting): Promise<JobPosting> {
    const [result] = await db.insert(jobPostings).values(posting).returning();
    return result;
  }

  async getAllJobPostings(activeOnly?: boolean): Promise<JobPosting[]> {
    if (activeOnly) {
      return await db.select().from(jobPostings)
        .where(eq(jobPostings.isActive, true))
        .orderBy(desc(jobPostings.priority), desc(jobPostings.createdAt));
    }
    return await db.select().from(jobPostings).orderBy(desc(jobPostings.priority), desc(jobPostings.createdAt));
  }

  async getJobPostingById(id: string): Promise<JobPosting | undefined> {
    const [result] = await db.select().from(jobPostings).where(eq(jobPostings.id, id));
    return result;
  }

  async updateJobPosting(id: string, updates: Partial<InsertJobPosting>): Promise<JobPosting | undefined> {
    const [result] = await db.update(jobPostings)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(jobPostings.id, id))
      .returning();
    return result;
  }

  async deleteJobPosting(id: string): Promise<boolean> {
    const result = await db.delete(jobPostings).where(eq(jobPostings.id, id));
    return true;
  }

  // Job Applications
  async createJobApplication(app: InsertJobApplication): Promise<JobApplication> {
    const [result] = await db.insert(jobApplications).values(app).returning();
    return result;
  }

  async getAllJobApplications(): Promise<JobApplication[]> {
    return await db.select().from(jobApplications).orderBy(desc(jobApplications.createdAt));
  }

  async updateJobApplicationStatus(id: string, status: string, reviewedBy?: string): Promise<JobApplication | undefined> {
    const [result] = await db
      .update(jobApplications)
      .set({ status, reviewedBy, reviewedAt: new Date() })
      .where(eq(jobApplications.id, id))
      .returning();
    return result;
  }

  async updateJobApplicationResumeAnalysis(id: string, resumeText: string, resumeAiAnalysis: string): Promise<JobApplication | undefined> {
    const [result] = await db
      .update(jobApplications)
      .set({ resumeText, resumeAiAnalysis })
      .where(eq(jobApplications.id, id))
      .returning();
    return result;
  }

  async updateJobApplicationDocuments(id: string, idDocumentUrl: string, photoUrl: string): Promise<JobApplication | undefined> {
    const [result] = await db
      .update(jobApplications)
      .set({ 
        idDocumentUrl, 
        photoUrl, 
        documentsSubmittedAt: new Date() 
      })
      .where(eq(jobApplications.id, id))
      .returning();
    return result;
  }

  async getJobApplicationById(id: string): Promise<JobApplication | undefined> {
    const [result] = await db
      .select()
      .from(jobApplications)
      .where(eq(jobApplications.id, id));
    return result;
  }

  async getJobApplicationByEmail(email: string): Promise<JobApplication | undefined> {
    const [result] = await db
      .select()
      .from(jobApplications)
      .where(eq(jobApplications.email, email.toLowerCase()));
    return result;
  }

  async updateIdentityVerification(id: string, status: string, verifiedBy: string, notes?: string): Promise<JobApplication | undefined> {
    const [result] = await db
      .update(jobApplications)
      .set({
        identityVerificationStatus: status,
        identityVerifiedBy: verifiedBy,
        identityVerifiedAt: new Date(),
        verificationNotes: notes || null,
      })
      .where(eq(jobApplications.id, id))
      .returning();
    return result;
  }

  async getShortlistedApplicationsWithDocuments(): Promise<JobApplication[]> {
    return await db
      .select()
      .from(jobApplications)
      .where(
        and(
          eq(jobApplications.aiShortlisted, true),
          sql`${jobApplications.idDocumentUrl} IS NOT NULL`,
          sql`${jobApplications.photoUrl} IS NOT NULL`
        )
      )
      .orderBy(desc(jobApplications.documentsSubmittedAt));
  }

  async logDocumentAccess(log: { applicationId: string; documentType: string; accessedBy: string; accessedByName?: string; accessedByRole?: string; ipAddress?: string; userAgent?: string; purpose?: string }): Promise<DocumentAccessLog> {
    const [result] = await db
      .insert(documentAccessLogs)
      .values(log)
      .returning();
    return result;
  }

  async getDocumentAccessLogs(applicationId: string): Promise<DocumentAccessLog[]> {
    return await db
      .select()
      .from(documentAccessLogs)
      .where(eq(documentAccessLogs.applicationId, applicationId))
      .orderBy(desc(documentAccessLogs.accessedAt));
  }

  async createSupplierUser(user: InsertSupplierUser): Promise<SupplierUser> {
    const [result] = await db.insert(supplierUsers).values(user).returning();
    return result;
  }

  async getSupplierUserByEmail(email: string): Promise<SupplierUser | undefined> {
    const [result] = await db.select().from(supplierUsers).where(eq(supplierUsers.email, email));
    return result;
  }

  async getSupplierUserById(id: string): Promise<SupplierUser | undefined> {
    const [result] = await db.select().from(supplierUsers).where(eq(supplierUsers.id, id));
    return result;
  }

  async updateSupplierUserLogin(id: string): Promise<void> {
    await db.update(supplierUsers).set({ lastLoginAt: new Date() }).where(eq(supplierUsers.id, id));
  }

  async createFraudAlert(alert: InsertFraudAlert): Promise<FraudAlert> {
    const [result] = await db.insert(fraudAlerts).values(alert).returning();
    return result;
  }

  async getAllFraudAlerts(resolved?: boolean): Promise<FraudAlert[]> {
    if (resolved !== undefined) {
      return await db.select().from(fraudAlerts).where(eq(fraudAlerts.isResolved, resolved)).orderBy(fraudAlerts.createdAt);
    }
    return await db.select().from(fraudAlerts).orderBy(fraudAlerts.createdAt);
  }

  async resolveFraudAlert(id: string, resolvedBy: string): Promise<FraudAlert | undefined> {
    const [result] = await db
      .update(fraudAlerts)
      .set({ isResolved: true, resolvedBy, resolvedAt: new Date() })
      .where(eq(fraudAlerts.id, id))
      .returning();
    return result;
  }

  async createFranchiseApplication(app: InsertFranchiseApplication): Promise<FranchiseApplication> {
    const [result] = await db.insert(franchiseApplications).values(app).returning();
    return result;
  }

  async getAllFranchiseApplications(): Promise<FranchiseApplication[]> {
    return db.select().from(franchiseApplications).orderBy(desc(franchiseApplications.createdAt));
  }

  // Programmatic Advertising Leads
  async createProgrammaticLead(lead: InsertProgrammaticLead): Promise<ProgrammaticLead> {
    const [result] = await db.insert(programmaticLeads).values(lead).returning();
    return result;
  }

  async getProgrammaticLead(id: string): Promise<ProgrammaticLead | undefined> {
    const [result] = await db.select().from(programmaticLeads).where(eq(programmaticLeads.id, id));
    return result;
  }

  async getProgrammaticLeads(filters?: { status?: string; country?: string; minScore?: number }): Promise<ProgrammaticLead[]> {
    let query = db.select().from(programmaticLeads);
    const conditions = [];
    
    if (filters?.status) {
      conditions.push(eq(programmaticLeads.status, filters.status));
    }
    if (filters?.country) {
      conditions.push(eq(programmaticLeads.country, filters.country));
    }
    if (filters?.minScore) {
      conditions.push(gte(programmaticLeads.leadScore, filters.minScore));
    }
    
    if (conditions.length > 0) {
      return db.select().from(programmaticLeads).where(and(...conditions)).orderBy(desc(programmaticLeads.createdAt));
    }
    return db.select().from(programmaticLeads).orderBy(desc(programmaticLeads.createdAt));
  }

  async updateProgrammaticLead(id: string, updates: Partial<ProgrammaticLead>): Promise<ProgrammaticLead | undefined> {
    const [result] = await db.update(programmaticLeads).set(updates).where(eq(programmaticLeads.id, id)).returning();
    return result;
  }

  async getProgrammaticLeadStats(): Promise<{ total: number; byStatus: Record<string, number>; byCountry: Record<string, number>; avgScore: number }> {
    const allLeads = await db.select().from(programmaticLeads);
    
    const byStatus: Record<string, number> = {};
    const byCountry: Record<string, number> = {};
    let totalScore = 0;
    let scoredCount = 0;
    
    allLeads.forEach(lead => {
      byStatus[lead.status] = (byStatus[lead.status] || 0) + 1;
      byCountry[lead.country] = (byCountry[lead.country] || 0) + 1;
      if (lead.leadScore) {
        totalScore += lead.leadScore;
        scoredCount++;
      }
    });
    
    return {
      total: allLeads.length,
      byStatus,
      byCountry,
      avgScore: scoredCount > 0 ? Math.round(totalScore / scoredCount) : 0
    };
  }

  // =====================================================
  // PHASE 1: SUPPLIER MANAGEMENT
  // =====================================================

  async getAllSuppliers(): Promise<Supplier[]> {
    return db.select().from(suppliers).orderBy(suppliers.name);
  }

  async getSupplierById(id: string): Promise<Supplier | undefined> {
    const [result] = await db.select().from(suppliers).where(eq(suppliers.id, id));
    return result;
  }

  async getSuppliersByType(type: string): Promise<Supplier[]> {
    return db.select().from(suppliers).where(and(eq(suppliers.type, type), eq(suppliers.isActive, true)));
  }

  async createSupplier(supplier: InsertSupplier): Promise<Supplier> {
    const [result] = await db.insert(suppliers).values(supplier).returning();
    return result;
  }

  async updateSupplier(id: string, supplier: Partial<InsertSupplier>): Promise<Supplier | undefined> {
    const [result] = await db.update(suppliers).set(supplier).where(eq(suppliers.id, id)).returning();
    return result;
  }

  async getAllSupplyItems(): Promise<SupplyItem[]> {
    return db.select().from(supplyItems).orderBy(supplyItems.name);
  }

  async getSupplyItemById(id: string): Promise<SupplyItem | undefined> {
    const [result] = await db.select().from(supplyItems).where(eq(supplyItems.id, id));
    return result;
  }

  async getSupplyItemsBySupplierId(supplierId: string): Promise<SupplyItem[]> {
    return db.select().from(supplyItems).where(eq(supplyItems.supplierId, supplierId));
  }

  async createSupplyItem(item: InsertSupplyItem): Promise<SupplyItem> {
    const [result] = await db.insert(supplyItems).values(item).returning();
    return result;
  }

  async updateSupplyItem(id: string, item: Partial<InsertSupplyItem>): Promise<SupplyItem | undefined> {
    const [result] = await db.update(supplyItems).set(item).where(eq(supplyItems.id, id)).returning();
    return result;
  }

  async getAllPurchaseOrders(): Promise<PurchaseOrder[]> {
    return db.select().from(purchaseOrders).orderBy(desc(purchaseOrders.createdAt));
  }

  async getPurchaseOrderById(id: string): Promise<PurchaseOrder | undefined> {
    const [result] = await db.select().from(purchaseOrders).where(eq(purchaseOrders.id, id));
    return result;
  }

  async getPurchaseOrdersBySupplierId(supplierId: string): Promise<PurchaseOrder[]> {
    return db.select().from(purchaseOrders).where(eq(purchaseOrders.supplierId, supplierId));
  }

  async createPurchaseOrder(order: InsertPurchaseOrder): Promise<PurchaseOrder> {
    const orderNumber = `PO-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const [result] = await db.insert(purchaseOrders).values({ ...order, orderNumber }).returning();
    return result;
  }

  async updatePurchaseOrderStatus(id: string, status: string): Promise<PurchaseOrder | undefined> {
    const updates: any = { status };
    if (status === 'delivered') updates.deliveredAt = new Date();
    if (status === 'submitted') updates.orderedAt = new Date();
    const [result] = await db.update(purchaseOrders).set(updates).where(eq(purchaseOrders.id, id)).returning();
    return result;
  }

  async getPurchaseOrderItems(purchaseOrderId: string): Promise<PurchaseOrderItem[]> {
    return db.select().from(purchaseOrderItems).where(eq(purchaseOrderItems.purchaseOrderId, purchaseOrderId));
  }

  async createPurchaseOrderItem(item: InsertPurchaseOrderItem): Promise<PurchaseOrderItem> {
    const [result] = await db.insert(purchaseOrderItems).values(item).returning();
    return result;
  }

  async getAllInventoryBatches(): Promise<InventoryBatch[]> {
    return db.select().from(inventoryBatches).orderBy(desc(inventoryBatches.receivedAt));
  }

  async getInventoryBatchesByUnitId(essenceUnitId: string): Promise<InventoryBatch[]> {
    return db.select().from(inventoryBatches).where(eq(inventoryBatches.essenceUnitId, essenceUnitId));
  }

  async createInventoryBatch(batch: InsertInventoryBatch): Promise<InventoryBatch> {
    const [result] = await db.insert(inventoryBatches).values(batch).returning();
    return result;
  }

  async updateInventoryBatchQuantity(id: string, quantity: number): Promise<InventoryBatch | undefined> {
    const [result] = await db.update(inventoryBatches).set({ quantityRemaining: quantity }).where(eq(inventoryBatches.id, id)).returning();
    return result;
  }

  async getSupplierPerformanceHistory(supplierId: string): Promise<SupplierPerformance[]> {
    return db.select().from(supplierPerformance).where(eq(supplierPerformance.supplierId, supplierId)).orderBy(desc(supplierPerformance.reviewedAt));
  }

  async createSupplierPerformance(perf: InsertSupplierPerformance): Promise<SupplierPerformance> {
    const [result] = await db.insert(supplierPerformance).values(perf).returning();
    return result;
  }

  // =====================================================
  // PHASE 2: EMPLOYEE OPERATIONS
  // =====================================================

  async getAllEmployees(): Promise<Employee[]> {
    return db.select().from(employees).orderBy(employees.fullName);
  }

  async getEmployeeById(id: string): Promise<Employee | undefined> {
    const [result] = await db.select().from(employees).where(eq(employees.id, id));
    return result;
  }

  async getEmployeesByUnitId(essenceUnitId: string): Promise<Employee[]> {
    return db.select().from(employees).where(and(eq(employees.essenceUnitId, essenceUnitId), eq(employees.isActive, true)));
  }

  async createEmployee(employee: InsertEmployee): Promise<Employee> {
    const employeeCode = `EMP-${Date.now().toString(36).toUpperCase()}`;
    const [result] = await db.insert(employees).values({ ...employee, employeeCode }).returning();
    return result;
  }

  async updateEmployee(id: string, employee: Partial<InsertEmployee>): Promise<Employee | undefined> {
    const [result] = await db.update(employees).set(employee).where(eq(employees.id, id)).returning();
    return result;
  }

  async getAllShiftTemplates(): Promise<ShiftTemplate[]> {
    return db.select().from(shiftTemplates).where(eq(shiftTemplates.isActive, true));
  }

  async getShiftTemplatesByUnitId(essenceUnitId: string): Promise<ShiftTemplate[]> {
    return db.select().from(shiftTemplates).where(and(eq(shiftTemplates.essenceUnitId, essenceUnitId), eq(shiftTemplates.isActive, true)));
  }

  async createShiftTemplate(template: InsertShiftTemplate): Promise<ShiftTemplate> {
    const [result] = await db.insert(shiftTemplates).values(template).returning();
    return result;
  }

  async getAllShiftAssignments(): Promise<ShiftAssignment[]> {
    return db.select().from(shiftAssignments).orderBy(desc(shiftAssignments.shiftDate));
  }

  async getShiftAssignmentsByDate(date: Date): Promise<ShiftAssignment[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    return db.select().from(shiftAssignments).where(
      and(gte(shiftAssignments.shiftDate, startOfDay), lte(shiftAssignments.shiftDate, endOfDay))
    );
  }

  async getShiftAssignmentsByEmployeeId(employeeId: string): Promise<ShiftAssignment[]> {
    return db.select().from(shiftAssignments).where(eq(shiftAssignments.employeeId, employeeId)).orderBy(desc(shiftAssignments.shiftDate));
  }

  async createShiftAssignment(assignment: InsertShiftAssignment): Promise<ShiftAssignment> {
    const [result] = await db.insert(shiftAssignments).values(assignment).returning();
    return result;
  }

  async updateShiftAssignmentStatus(id: string, status: string): Promise<ShiftAssignment | undefined> {
    const updates: any = { status };
    if (status === 'in_progress') updates.actualStartTime = new Date();
    if (status === 'completed') updates.actualEndTime = new Date();
    const [result] = await db.update(shiftAssignments).set(updates).where(eq(shiftAssignments.id, id)).returning();
    return result;
  }

  async getAllLeaveRequests(): Promise<LeaveRequest[]> {
    return db.select().from(leaveRequests).orderBy(desc(leaveRequests.createdAt));
  }

  async getLeaveRequestsByEmployeeId(employeeId: string): Promise<LeaveRequest[]> {
    return db.select().from(leaveRequests).where(eq(leaveRequests.employeeId, employeeId));
  }

  async getPendingLeaveRequests(): Promise<LeaveRequest[]> {
    return db.select().from(leaveRequests).where(eq(leaveRequests.status, 'pending'));
  }

  async createLeaveRequest(request: InsertLeaveRequest): Promise<LeaveRequest> {
    const [result] = await db.insert(leaveRequests).values(request).returning();
    return result;
  }

  async updateLeaveRequestStatus(id: string, status: string, approvedBy?: string): Promise<LeaveRequest | undefined> {
    const updates: any = { status };
    if (status === 'approved' || status === 'rejected') {
      updates.approvedAt = new Date();
      if (approvedBy) updates.approvedBy = approvedBy;
    }
    const [result] = await db.update(leaveRequests).set(updates).where(eq(leaveRequests.id, id)).returning();
    return result;
  }

  async getAllPayrollCycles(): Promise<PayrollCycle[]> {
    return db.select().from(payrollCycles).orderBy(desc(payrollCycles.periodStart));
  }

  async getPayrollCycleById(id: string): Promise<PayrollCycle | undefined> {
    const [result] = await db.select().from(payrollCycles).where(eq(payrollCycles.id, id));
    return result;
  }

  async createPayrollCycle(cycle: InsertPayrollCycle): Promise<PayrollCycle> {
    const [result] = await db.insert(payrollCycles).values(cycle).returning();
    return result;
  }

  async updatePayrollCycleStatus(id: string, status: string): Promise<PayrollCycle | undefined> {
    const updates: any = { status };
    if (status === 'processing') updates.processedAt = new Date();
    if (status === 'paid') updates.paidAt = new Date();
    const [result] = await db.update(payrollCycles).set(updates).where(eq(payrollCycles.id, id)).returning();
    return result;
  }

  async getPayrollEntriesByCycleId(cycleId: string): Promise<PayrollEntry[]> {
    return db.select().from(payrollEntries).where(eq(payrollEntries.payrollCycleId, cycleId));
  }

  async createPayrollEntry(entry: InsertPayrollEntry): Promise<PayrollEntry> {
    const [result] = await db.insert(payrollEntries).values(entry).returning();
    return result;
  }

  // =====================================================
  // PHASE 3: COMPLIANCE & LEGAL
  // =====================================================

  async getAllInsurancePolicies(): Promise<InsurancePolicy[]> {
    return db.select().from(insurancePolicies).orderBy(insurancePolicies.endDate);
  }

  async getInsurancePolicyById(id: string): Promise<InsurancePolicy | undefined> {
    const [result] = await db.select().from(insurancePolicies).where(eq(insurancePolicies.id, id));
    return result;
  }

  async createInsurancePolicy(policy: InsertInsurancePolicy): Promise<InsurancePolicy> {
    const [result] = await db.insert(insurancePolicies).values(policy).returning();
    return result;
  }

  async updateInsurancePolicyStatus(id: string, status: string): Promise<InsurancePolicy | undefined> {
    const [result] = await db.update(insurancePolicies).set({ status }).where(eq(insurancePolicies.id, id)).returning();
    return result;
  }

  async getAllBusinessLicenses(): Promise<BusinessLicense[]> {
    return db.select().from(businessLicenses).orderBy(businessLicenses.expiryDate);
  }

  async getBusinessLicenseById(id: string): Promise<BusinessLicense | undefined> {
    const [result] = await db.select().from(businessLicenses).where(eq(businessLicenses.id, id));
    return result;
  }

  async createBusinessLicense(license: InsertBusinessLicense): Promise<BusinessLicense> {
    const [result] = await db.insert(businessLicenses).values(license).returning();
    return result;
  }

  async updateBusinessLicenseStatus(id: string, status: string): Promise<BusinessLicense | undefined> {
    const [result] = await db.update(businessLicenses).set({ status }).where(eq(businessLicenses.id, id)).returning();
    return result;
  }

  async getAllTaxFilings(): Promise<TaxFiling[]> {
    return db.select().from(taxFilings).orderBy(desc(taxFilings.dueDate));
  }

  async getTaxFilingById(id: string): Promise<TaxFiling | undefined> {
    const [result] = await db.select().from(taxFilings).where(eq(taxFilings.id, id));
    return result;
  }

  async createTaxFiling(filing: InsertTaxFiling): Promise<TaxFiling> {
    const [result] = await db.insert(taxFilings).values(filing).returning();
    return result;
  }

  async updateTaxFilingStatus(id: string, status: string): Promise<TaxFiling | undefined> {
    const updates: any = { status };
    if (status === 'filed') updates.filedDate = new Date();
    const [result] = await db.update(taxFilings).set(updates).where(eq(taxFilings.id, id)).returning();
    return result;
  }

  async getAllComplianceTasks(): Promise<ComplianceTask[]> {
    return db.select().from(complianceTasks).orderBy(complianceTasks.dueDate);
  }

  async getComplianceTaskById(id: string): Promise<ComplianceTask | undefined> {
    const [result] = await db.select().from(complianceTasks).where(eq(complianceTasks.id, id));
    return result;
  }

  async getPendingComplianceTasks(): Promise<ComplianceTask[]> {
    return db.select().from(complianceTasks).where(eq(complianceTasks.status, 'pending')).orderBy(complianceTasks.dueDate);
  }

  async getOverdueComplianceTasks(): Promise<ComplianceTask[]> {
    return db.select().from(complianceTasks).where(
      and(eq(complianceTasks.status, 'pending'), lte(complianceTasks.dueDate, new Date()))
    );
  }

  async createComplianceTask(task: InsertComplianceTask): Promise<ComplianceTask> {
    const [result] = await db.insert(complianceTasks).values(task).returning();
    return result;
  }

  async updateComplianceTaskStatus(id: string, status: string): Promise<ComplianceTask | undefined> {
    const updates: any = { status };
    if (status === 'completed') updates.completedDate = new Date();
    const [result] = await db.update(complianceTasks).set(updates).where(eq(complianceTasks.id, id)).returning();
    return result;
  }

  async getAllDocuments(): Promise<Document[]> {
    return db.select().from(documents).orderBy(desc(documents.uploadedAt));
  }

  async getDocumentsByEntity(entityType: string, entityId: string): Promise<Document[]> {
    return db.select().from(documents).where(
      and(eq(documents.entityType, entityType), eq(documents.entityId, entityId))
    );
  }

  async createDocument(doc: InsertDocument): Promise<Document> {
    const [result] = await db.insert(documents).values(doc).returning();
    return result;
  }

  // =====================================================
  // PHASE 4: VIP LOYALTY
  // =====================================================

  async getAllVipBenefits(): Promise<VipBenefit[]> {
    return db.select().from(vipBenefits).where(eq(vipBenefits.isActive, true));
  }

  async getVipBenefitsByTierId(tierId: string): Promise<VipBenefit[]> {
    return db.select().from(vipBenefits).where(
      and(eq(vipBenefits.loyaltyTierId, tierId), eq(vipBenefits.isActive, true))
    );
  }

  async createVipBenefit(benefit: InsertVipBenefit): Promise<VipBenefit> {
    const [result] = await db.insert(vipBenefits).values(benefit).returning();
    return result;
  }

  async getAllVipEvents(): Promise<VipEvent[]> {
    return db.select().from(vipEvents).orderBy(desc(vipEvents.eventDate));
  }

  async getUpcomingVipEvents(): Promise<VipEvent[]> {
    return db.select().from(vipEvents).where(
      and(eq(vipEvents.status, 'upcoming'), gte(vipEvents.eventDate, new Date()))
    ).orderBy(vipEvents.eventDate);
  }

  async getVipEventById(id: string): Promise<VipEvent | undefined> {
    const [result] = await db.select().from(vipEvents).where(eq(vipEvents.id, id));
    return result;
  }

  async createVipEvent(event: InsertVipEvent): Promise<VipEvent> {
    const [result] = await db.insert(vipEvents).values(event).returning();
    return result;
  }

  async updateVipEventStatus(id: string, status: string): Promise<VipEvent | undefined> {
    const [result] = await db.update(vipEvents).set({ status }).where(eq(vipEvents.id, id)).returning();
    return result;
  }

  async getVipEventRsvps(eventId: string): Promise<VipEventRsvp[]> {
    return db.select().from(vipEventRsvps).where(eq(vipEventRsvps.vipEventId, eventId));
  }

  async createVipEventRsvp(rsvp: InsertVipEventRsvp): Promise<VipEventRsvp> {
    const [result] = await db.insert(vipEventRsvps).values(rsvp).returning();
    return result;
  }

  async updateVipEventRsvpStatus(id: string, status: string): Promise<VipEventRsvp | undefined> {
    const updates: any = { status };
    if (status !== 'pending') updates.respondedAt = new Date();
    const [result] = await db.update(vipEventRsvps).set(updates).where(eq(vipEventRsvps.id, id)).returning();
    return result;
  }

  async getMemberActivityLogs(customerId: string): Promise<MemberActivityLog[]> {
    return db.select().from(memberActivityLogs).where(eq(memberActivityLogs.customerId, customerId)).orderBy(desc(memberActivityLogs.createdAt));
  }

  async createMemberActivityLog(log: InsertMemberActivityLog): Promise<MemberActivityLog> {
    const [result] = await db.insert(memberActivityLogs).values(log).returning();
    return result;
  }

  // =====================================================
  // PHASE 5: POS SYSTEM
  // =====================================================

  async getOpenPosSessions(essenceUnitId: string): Promise<PosSession[]> {
    return db.select().from(posSessions).where(
      and(eq(posSessions.essenceUnitId, essenceUnitId), eq(posSessions.status, 'open'))
    );
  }

  async getPosSessionById(id: string): Promise<PosSession | undefined> {
    const [result] = await db.select().from(posSessions).where(eq(posSessions.id, id));
    return result;
  }

  async createPosSession(session: InsertPosSession): Promise<PosSession> {
    const sessionNumber = `SES-${Date.now().toString(36).toUpperCase()}`;
    const [result] = await db.insert(posSessions).values({ ...session, sessionNumber }).returning();
    return result;
  }

  async closePosSession(id: string, closingData: { closingCash: string; expectedCash: string; cashVariance: string }): Promise<PosSession | undefined> {
    const [result] = await db.update(posSessions).set({
      ...closingData,
      status: 'closed',
      closedAt: new Date()
    }).where(eq(posSessions.id, id)).returning();
    return result;
  }

  async getPosTransactionsBySession(sessionId: string): Promise<PosTransaction[]> {
    return db.select().from(posTransactions).where(eq(posTransactions.posSessionId, sessionId)).orderBy(desc(posTransactions.createdAt));
  }

  async getPosTransactionById(id: string): Promise<PosTransaction | undefined> {
    const [result] = await db.select().from(posTransactions).where(eq(posTransactions.id, id));
    return result;
  }

  async getRecentPosTransactions(limit: number = 100, essenceUnitId?: string): Promise<PosTransaction[]> {
    if (essenceUnitId) {
      const sessions = await db.select().from(posSessions).where(eq(posSessions.essenceUnitId, essenceUnitId));
      const sessionIds = sessions.map(s => s.id);
      if (sessionIds.length === 0) return [];
      return db.select().from(posTransactions)
        .where(sql`${posTransactions.posSessionId} IN (${sql.join(sessionIds.map(id => sql`${id}`), sql`, `)})`)
        .orderBy(desc(posTransactions.createdAt))
        .limit(limit);
    }
    return db.select().from(posTransactions).orderBy(desc(posTransactions.createdAt)).limit(limit);
  }

  async createPosTransaction(transaction: InsertPosTransaction): Promise<PosTransaction> {
    const transactionNumber = `TXN-${Date.now().toString(36).toUpperCase()}`;
    const receiptNumber = `RCP-${Date.now().toString(36).toUpperCase()}`;
    const [result] = await db.insert(posTransactions).values({ 
      ...transaction, 
      transactionNumber,
      receiptNumber
    }).returning();
    return result;
  }

  async completePosTransaction(id: string): Promise<PosTransaction | undefined> {
    const [result] = await db.update(posTransactions).set({
      status: 'completed',
      completedAt: new Date()
    }).where(eq(posTransactions.id, id)).returning();
    return result;
  }

  async voidPosTransaction(id: string, voidedBy: string, voidReason: string): Promise<PosTransaction | undefined> {
    const [result] = await db.update(posTransactions).set({
      status: 'voided',
      voidedBy,
      voidReason
    }).where(eq(posTransactions.id, id)).returning();
    return result;
  }

  async getPosTransactionItems(transactionId: string): Promise<PosTransactionItem[]> {
    return db.select().from(posTransactionItems).where(eq(posTransactionItems.posTransactionId, transactionId));
  }

  async createPosTransactionItem(item: InsertPosTransactionItem): Promise<PosTransactionItem> {
    const [result] = await db.insert(posTransactionItems).values(item).returning();
    return result;
  }

  async getPosPayments(transactionId: string): Promise<PosPayment[]> {
    return db.select().from(posPayments).where(eq(posPayments.posTransactionId, transactionId));
  }

  async createPosPayment(payment: InsertPosPayment): Promise<PosPayment> {
    const [result] = await db.insert(posPayments).values(payment).returning();
    return result;
  }

  async createScaleReading(reading: InsertScaleReading): Promise<ScaleReading> {
    const [result] = await db.insert(scaleReadings).values(reading).returning();
    return result;
  }

  async getScaleReadingsBySession(sessionId: string): Promise<ScaleReading[]> {
    return db.select().from(scaleReadings).where(eq(scaleReadings.posSessionId, sessionId)).orderBy(desc(scaleReadings.readingAt));
  }

  // =====================================================
  // PHASE 6: TIMESHEET SYSTEM
  // =====================================================

  async getActiveTimesheetEntry(employeeId: string): Promise<TimesheetEntry | undefined> {
    const [result] = await db.select().from(timesheetEntries).where(
      and(eq(timesheetEntries.employeeId, employeeId), eq(timesheetEntries.status, 'clocked_in'))
    );
    return result;
  }

  async getTimesheetEntriesByEmployee(employeeId: string, startDate?: Date, endDate?: Date): Promise<TimesheetEntry[]> {
    const conditions = [eq(timesheetEntries.employeeId, employeeId)];
    if (startDate) conditions.push(gte(timesheetEntries.clockInTime, startDate));
    if (endDate) conditions.push(lte(timesheetEntries.clockInTime, endDate));
    return db.select().from(timesheetEntries).where(and(...conditions)).orderBy(desc(timesheetEntries.clockInTime));
  }

  async getTimesheetEntriesByUnit(essenceUnitId: string, date?: Date): Promise<TimesheetEntry[]> {
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      return db.select().from(timesheetEntries).where(
        and(
          eq(timesheetEntries.essenceUnitId, essenceUnitId),
          gte(timesheetEntries.clockInTime, startOfDay),
          lte(timesheetEntries.clockInTime, endOfDay)
        )
      ).orderBy(desc(timesheetEntries.clockInTime));
    }
    return db.select().from(timesheetEntries).where(eq(timesheetEntries.essenceUnitId, essenceUnitId)).orderBy(desc(timesheetEntries.clockInTime));
  }

  async getPendingTimesheetApprovals(): Promise<TimesheetEntry[]> {
    return db.select().from(timesheetEntries).where(eq(timesheetEntries.status, 'pending_approval')).orderBy(desc(timesheetEntries.clockInTime));
  }

  async createTimesheetEntry(entry: InsertTimesheetEntry): Promise<TimesheetEntry> {
    const [result] = await db.insert(timesheetEntries).values(entry).returning();
    return result;
  }

  async clockOut(id: string, clockOutData: Partial<InsertTimesheetEntry>): Promise<TimesheetEntry | undefined> {
    const [result] = await db.update(timesheetEntries).set({
      ...clockOutData,
      clockOutTime: new Date(),
      status: 'pending_approval'
    }).where(eq(timesheetEntries.id, id)).returning();
    return result;
  }

  async approveTimesheet(id: string, approvedBy: string): Promise<TimesheetEntry | undefined> {
    const [result] = await db.update(timesheetEntries).set({
      status: 'approved',
      approvedBy,
      approvedAt: new Date()
    }).where(eq(timesheetEntries.id, id)).returning();
    return result;
  }

  async rejectTimesheet(id: string, reason: string): Promise<TimesheetEntry | undefined> {
    const [result] = await db.update(timesheetEntries).set({
      status: 'rejected',
      rejectionReason: reason
    }).where(eq(timesheetEntries.id, id)).returning();
    return result;
  }

  async getTimesheetBreaks(timesheetEntryId: string): Promise<TimesheetBreak[]> {
    return db.select().from(timesheetBreaks).where(eq(timesheetBreaks.timesheetEntryId, timesheetEntryId));
  }

  async startBreak(breakData: InsertTimesheetBreak): Promise<TimesheetBreak> {
    const [result] = await db.insert(timesheetBreaks).values(breakData).returning();
    return result;
  }

  async endBreak(id: string, endData: Partial<InsertTimesheetBreak>): Promise<TimesheetBreak | undefined> {
    const [result] = await db.update(timesheetBreaks).set({
      ...endData,
      endTime: new Date()
    }).where(eq(timesheetBreaks.id, id)).returning();
    return result;
  }

  async createLocationVerification(verification: InsertLocationVerification): Promise<LocationVerification> {
    const [result] = await db.insert(locationVerifications).values(verification).returning();
    return result;
  }

  async getLocationVerifications(timesheetEntryId: string): Promise<LocationVerification[]> {
    return db.select().from(locationVerifications).where(eq(locationVerifications.timesheetEntryId, timesheetEntryId)).orderBy(desc(locationVerifications.verifiedAt));
  }

  async getFlaggedVerifications(): Promise<LocationVerification[]> {
    return db.select().from(locationVerifications).where(eq(locationVerifications.flagged, true)).orderBy(desc(locationVerifications.verifiedAt));
  }

  // =====================================================
  // PHASE 7: STOCK CONTROL
  // =====================================================

  async getInventoryItemsByUnit(essenceUnitId: string): Promise<InventoryItem[]> {
    return db.select().from(inventoryItems).where(
      and(eq(inventoryItems.essenceUnitId, essenceUnitId), eq(inventoryItems.isActive, true))
    ).orderBy(inventoryItems.itemName);
  }

  async getInventoryItemById(id: string): Promise<InventoryItem | undefined> {
    const [result] = await db.select().from(inventoryItems).where(eq(inventoryItems.id, id));
    return result;
  }

  async createInventoryItem(item: InsertInventoryItem): Promise<InventoryItem> {
    const [result] = await db.insert(inventoryItems).values(item).returning();
    return result;
  }

  async updateInventoryQuantity(id: string, quantity: string): Promise<InventoryItem | undefined> {
    const [result] = await db.update(inventoryItems).set({
      currentQuantity: quantity,
      updatedAt: new Date()
    }).where(eq(inventoryItems.id, id)).returning();
    return result;
  }

  async getInventoryMovements(inventoryItemId: string): Promise<InventoryMovement[]> {
    return db.select().from(inventoryMovements).where(eq(inventoryMovements.inventoryItemId, inventoryItemId)).orderBy(desc(inventoryMovements.createdAt));
  }

  async getInventoryMovementsByUnit(essenceUnitId: string, startDate?: Date, endDate?: Date): Promise<InventoryMovement[]> {
    let conditions = [eq(inventoryMovements.essenceUnitId, essenceUnitId)];
    if (startDate) conditions.push(gte(inventoryMovements.createdAt, startDate));
    if (endDate) conditions.push(lte(inventoryMovements.createdAt, endDate));
    return db.select().from(inventoryMovements).where(and(...conditions)).orderBy(desc(inventoryMovements.createdAt));
  }

  async createInventoryMovement(movement: InsertInventoryMovement): Promise<InventoryMovement> {
    const [result] = await db.insert(inventoryMovements).values(movement).returning();
    return result;
  }

  async getWasteReports(essenceUnitId?: string): Promise<WasteReport[]> {
    if (essenceUnitId) {
      return db.select().from(wasteReports).where(eq(wasteReports.essenceUnitId, essenceUnitId)).orderBy(desc(wasteReports.reportedAt));
    }
    return db.select().from(wasteReports).orderBy(desc(wasteReports.reportedAt));
  }

  async getPendingWasteApprovals(): Promise<WasteReport[]> {
    return db.select().from(wasteReports).where(eq(wasteReports.supervisorApproval, 'pending')).orderBy(desc(wasteReports.reportedAt));
  }

  async getSuspiciousWasteReports(): Promise<WasteReport[]> {
    return db.select().from(wasteReports).where(eq(wasteReports.wasteCategory, 'suspicious')).orderBy(desc(wasteReports.reportedAt));
  }

  async createWasteReport(report: InsertWasteReport): Promise<WasteReport> {
    const [result] = await db.insert(wasteReports).values({
      ...report,
      supervisorApproval: 'pending'
    }).returning();
    return result;
  }

  async approveWasteReport(id: string, supervisorId: string): Promise<WasteReport | undefined> {
    const [result] = await db.update(wasteReports).set({
      supervisorId,
      supervisorApproval: 'approved',
      approvedAt: new Date()
    }).where(eq(wasteReports.id, id)).returning();
    return result;
  }

  async rejectWasteReport(id: string, reason: string): Promise<WasteReport | undefined> {
    const [result] = await db.update(wasteReports).set({
      supervisorApproval: 'rejected',
      rejectionReason: reason
    }).where(eq(wasteReports.id, id)).returning();
    return result;
  }

  async getStockCounts(essenceUnitId?: string): Promise<StockCount[]> {
    if (essenceUnitId) {
      return db.select().from(stockCounts).where(eq(stockCounts.essenceUnitId, essenceUnitId)).orderBy(desc(stockCounts.scheduledDate));
    }
    return db.select().from(stockCounts).orderBy(desc(stockCounts.scheduledDate));
  }

  async getStockCountById(id: string): Promise<StockCount | undefined> {
    const [result] = await db.select().from(stockCounts).where(eq(stockCounts.id, id));
    return result;
  }

  async createStockCount(count: InsertStockCount): Promise<StockCount> {
    const [result] = await db.insert(stockCounts).values(count).returning();
    return result;
  }

  async startStockCount(id: string, countedBy: string): Promise<StockCount | undefined> {
    const [result] = await db.update(stockCounts).set({
      status: 'in_progress',
      countedBy,
      startedAt: new Date()
    }).where(eq(stockCounts.id, id)).returning();
    return result;
  }

  async completeStockCount(id: string, verifiedBy?: string): Promise<StockCount | undefined> {
    const [result] = await db.update(stockCounts).set({
      status: verifiedBy ? 'verified' : 'completed',
      verifiedBy,
      completedAt: new Date()
    }).where(eq(stockCounts.id, id)).returning();
    return result;
  }

  async getStockCountItems(stockCountId: string): Promise<StockCountItem[]> {
    return db.select().from(stockCountItems).where(eq(stockCountItems.stockCountId, stockCountId));
  }

  async createStockCountItem(item: InsertStockCountItem): Promise<StockCountItem> {
    const [result] = await db.insert(stockCountItems).values(item).returning();
    return result;
  }

  // =====================================================
  // PHASE 8: OPERATIONAL ALERTS
  // =====================================================

  async getOperationalAlerts(unreadOnly?: boolean): Promise<OperationalAlert[]> {
    if (unreadOnly) {
      return db.select().from(operationalAlerts).where(eq(operationalAlerts.isRead, false)).orderBy(desc(operationalAlerts.createdAt));
    }
    return db.select().from(operationalAlerts).orderBy(desc(operationalAlerts.createdAt));
  }

  async getOperationalAlertsByUnit(essenceUnitId: string): Promise<OperationalAlert[]> {
    return db.select().from(operationalAlerts).where(eq(operationalAlerts.essenceUnitId, essenceUnitId)).orderBy(desc(operationalAlerts.createdAt));
  }

  async getCriticalAlerts(): Promise<OperationalAlert[]> {
    return db.select().from(operationalAlerts).where(
      and(
        eq(operationalAlerts.severity, 'critical'),
        eq(operationalAlerts.isResolved, false)
      )
    ).orderBy(desc(operationalAlerts.createdAt));
  }

  async createOperationalAlert(alert: InsertOperationalAlert): Promise<OperationalAlert> {
    const [result] = await db.insert(operationalAlerts).values(alert).returning();
    return result;
  }

  async acknowledgeAlert(id: string, acknowledgedBy: string): Promise<OperationalAlert | undefined> {
    const [result] = await db.update(operationalAlerts).set({
      isRead: true,
      isAcknowledged: true,
      acknowledgedBy,
      acknowledgedAt: new Date()
    }).where(eq(operationalAlerts.id, id)).returning();
    return result;
  }

  async resolveAlert(id: string, resolvedBy: string, notes?: string): Promise<OperationalAlert | undefined> {
    const [result] = await db.update(operationalAlerts).set({
      isResolved: true,
      resolvedBy,
      resolvedAt: new Date(),
      resolutionNotes: notes
    }).where(eq(operationalAlerts.id, id)).returning();
    return result;
  }

  // =====================================================
  // PHASE 9: AI MONITORING & ANALYTICS
  // =====================================================

  // System Logs
  async createSystemLog(log: InsertSystemLog): Promise<SystemLog> {
    const [result] = await db.insert(systemLogs).values(log).returning();
    return result;
  }

  async getSystemLogs(filters?: { level?: string; category?: string; startDate?: Date; endDate?: Date; limit?: number }): Promise<SystemLog[]> {
    const conditions: any[] = [];
    if (filters?.level) conditions.push(eq(systemLogs.logLevel, filters.level));
    if (filters?.category) conditions.push(eq(systemLogs.category, filters.category));
    if (filters?.startDate) conditions.push(gte(systemLogs.createdAt, filters.startDate));
    if (filters?.endDate) conditions.push(lte(systemLogs.createdAt, filters.endDate));
    
    let query = db.select().from(systemLogs);
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }
    return (query as any).orderBy(desc(systemLogs.createdAt)).limit(filters?.limit || 100);
  }

  async getSystemLogsByCategory(category: string): Promise<SystemLog[]> {
    return db.select().from(systemLogs).where(eq(systemLogs.category, category)).orderBy(desc(systemLogs.createdAt)).limit(100);
  }

  async getErrorLogs(startDate?: Date, endDate?: Date): Promise<SystemLog[]> {
    const conditions: any[] = [eq(systemLogs.logLevel, 'error')];
    if (startDate) conditions.push(gte(systemLogs.createdAt, startDate));
    if (endDate) conditions.push(lte(systemLogs.createdAt, endDate));
    return db.select().from(systemLogs).where(and(...conditions)).orderBy(desc(systemLogs.createdAt)).limit(100);
  }

  // AI Analysis Reports
  async createAiAnalysisReport(report: InsertAiAnalysisReport): Promise<AiAnalysisReport> {
    const [result] = await db.insert(aiAnalysisReports).values(report).returning();
    return result;
  }

  async getAiAnalysisReports(filters?: { type?: string; scope?: string; limit?: number }): Promise<AiAnalysisReport[]> {
    const conditions: any[] = [];
    if (filters?.type) conditions.push(eq(aiAnalysisReports.reportType, filters.type));
    if (filters?.scope) conditions.push(eq(aiAnalysisReports.scope, filters.scope));
    
    let query = db.select().from(aiAnalysisReports);
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }
    return (query as any).orderBy(desc(aiAnalysisReports.createdAt)).limit(filters?.limit || 50);
  }

  async getAiAnalysisReportById(id: string): Promise<AiAnalysisReport | undefined> {
    const [result] = await db.select().from(aiAnalysisReports).where(eq(aiAnalysisReports.id, id));
    return result;
  }

  async getPendingActionReports(): Promise<AiAnalysisReport[]> {
    return db.select().from(aiAnalysisReports).where(
      and(eq(aiAnalysisReports.isActionRequired, true), eq(aiAnalysisReports.actionTakenBy, null as any))
    ).orderBy(desc(aiAnalysisReports.createdAt));
  }

  async markReportActioned(id: string, actionedBy: string, notes?: string): Promise<AiAnalysisReport | undefined> {
    const [result] = await db.update(aiAnalysisReports).set({
      actionTakenBy: actionedBy,
      actionTakenAt: new Date(),
      actionNotes: notes
    }).where(eq(aiAnalysisReports.id, id)).returning();
    return result;
  }

  // Translation Logs
  async createTranslationLog(log: InsertTranslationLog): Promise<TranslationLog> {
    const [result] = await db.insert(translationLogs).values(log).returning();
    return result;
  }

  async getTranslationLogs(targetLanguage?: string): Promise<TranslationLog[]> {
    if (targetLanguage) {
      return db.select().from(translationLogs).where(eq(translationLogs.targetLanguage, targetLanguage)).orderBy(desc(translationLogs.createdAt)).limit(100);
    }
    return db.select().from(translationLogs).orderBy(desc(translationLogs.createdAt)).limit(100);
  }

  async getUnreviewedTranslations(): Promise<TranslationLog[]> {
    return db.select().from(translationLogs).where(eq(translationLogs.isReviewed, false)).orderBy(desc(translationLogs.createdAt));
  }

  async reviewTranslation(id: string, reviewedBy: string, notes?: string): Promise<TranslationLog | undefined> {
    const [result] = await db.update(translationLogs).set({
      isReviewed: true,
      reviewedBy,
      reviewedAt: new Date(),
      reviewNotes: notes
    }).where(eq(translationLogs.id, id)).returning();
    return result;
  }

  // Transaction Monitoring
  async createTransactionMonitoring(record: InsertTransactionMonitoring): Promise<TransactionMonitoring> {
    const [result] = await db.insert(transactionMonitoring).values(record).returning();
    return result;
  }

  async getTransactionMonitoring(filters?: { anomalyOnly?: boolean; requiresReview?: boolean; limit?: number }): Promise<TransactionMonitoring[]> {
    const conditions: any[] = [];
    if (filters?.anomalyOnly) conditions.push(eq(transactionMonitoring.isAnomaly, true));
    if (filters?.requiresReview) conditions.push(eq(transactionMonitoring.requiresReview, true));
    
    let query = db.select().from(transactionMonitoring);
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }
    return (query as any).orderBy(desc(transactionMonitoring.createdAt)).limit(filters?.limit || 100);
  }

  async getAnomalousTransactions(): Promise<TransactionMonitoring[]> {
    return db.select().from(transactionMonitoring).where(eq(transactionMonitoring.isAnomaly, true)).orderBy(desc(transactionMonitoring.createdAt)).limit(50);
  }

  async reviewTransaction(id: string, reviewedBy: string, outcome: string, notes?: string): Promise<TransactionMonitoring | undefined> {
    const [result] = await db.update(transactionMonitoring).set({
      reviewedBy,
      reviewedAt: new Date(),
      reviewOutcome: outcome,
      reviewNotes: notes,
      requiresReview: false
    }).where(eq(transactionMonitoring.id, id)).returning();
    return result;
  }

  // User Error Tracking
  async createUserErrorTracking(error: InsertUserErrorTracking): Promise<UserErrorTracking> {
    const [result] = await db.insert(userErrorTracking).values(error).returning();
    return result;
  }

  async getUserErrors(filters?: { severity?: string; resolved?: boolean; limit?: number }): Promise<UserErrorTracking[]> {
    const conditions: any[] = [];
    if (filters?.severity) conditions.push(eq(userErrorTracking.severity, filters.severity));
    if (filters?.resolved !== undefined) conditions.push(eq(userErrorTracking.isResolved, filters.resolved));
    
    let query = db.select().from(userErrorTracking);
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }
    return (query as any).orderBy(desc(userErrorTracking.lastOccurrence)).limit(filters?.limit || 100);
  }

  async getUnresolvedErrors(): Promise<UserErrorTracking[]> {
    return db.select().from(userErrorTracking).where(eq(userErrorTracking.isResolved, false)).orderBy(desc(userErrorTracking.lastOccurrence));
  }

  async resolveUserError(id: string, resolvedBy: string, resolutionType: string): Promise<UserErrorTracking | undefined> {
    const [result] = await db.update(userErrorTracking).set({
      isResolved: true,
      resolvedBy,
      resolvedAt: new Date(),
      resolutionType
    }).where(eq(userErrorTracking.id, id)).returning();
    return result;
  }

  async incrementErrorCount(errorMessage: string, errorType: string): Promise<UserErrorTracking | undefined> {
    const existing = await db.select().from(userErrorTracking).where(
      and(eq(userErrorTracking.errorMessage, errorMessage), eq(userErrorTracking.errorType, errorType))
    );
    if (existing.length > 0) {
      const [result] = await db.update(userErrorTracking).set({
        occurrenceCount: (existing[0].occurrenceCount || 1) + 1,
        lastOccurrence: new Date()
      }).where(eq(userErrorTracking.id, existing[0].id)).returning();
      return result;
    }
    return undefined;
  }

  // Ecosystem Health Metrics
  async createHealthMetric(metric: InsertEcosystemHealthMetric): Promise<EcosystemHealthMetric> {
    const [result] = await db.insert(ecosystemHealthMetrics).values(metric).returning();
    return result;
  }

  async getHealthMetrics(filters?: { type?: string; scope?: string; periodType?: string; limit?: number }): Promise<EcosystemHealthMetric[]> {
    const conditions: any[] = [];
    if (filters?.type) conditions.push(eq(ecosystemHealthMetrics.metricType, filters.type));
    if (filters?.scope) conditions.push(eq(ecosystemHealthMetrics.scope, filters.scope));
    if (filters?.periodType) conditions.push(eq(ecosystemHealthMetrics.periodType, filters.periodType));
    
    let query = db.select().from(ecosystemHealthMetrics);
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }
    return (query as any).orderBy(desc(ecosystemHealthMetrics.createdAt)).limit(filters?.limit || 100);
  }

  async getLatestHealthStatus(): Promise<EcosystemHealthMetric[]> {
    return db.select().from(ecosystemHealthMetrics).where(eq(ecosystemHealthMetrics.scope, 'global')).orderBy(desc(ecosystemHealthMetrics.createdAt)).limit(10);
  }

  async getCriticalHealthMetrics(): Promise<EcosystemHealthMetric[]> {
    return db.select().from(ecosystemHealthMetrics).where(eq(ecosystemHealthMetrics.status, 'critical')).orderBy(desc(ecosystemHealthMetrics.createdAt));
  }

  // AI Monitoring Tasks
  async createAiMonitoringTask(task: InsertAiMonitoringTask): Promise<AiMonitoringTask> {
    const [result] = await db.insert(aiMonitoringTasks).values(task).returning();
    return result;
  }

  async getAiMonitoringTasks(activeOnly?: boolean): Promise<AiMonitoringTask[]> {
    if (activeOnly) {
      return db.select().from(aiMonitoringTasks).where(eq(aiMonitoringTasks.isActive, true)).orderBy(aiMonitoringTasks.taskName);
    }
    return db.select().from(aiMonitoringTasks).orderBy(aiMonitoringTasks.taskName);
  }

  async getAiMonitoringTaskById(id: string): Promise<AiMonitoringTask | undefined> {
    const [result] = await db.select().from(aiMonitoringTasks).where(eq(aiMonitoringTasks.id, id));
    return result;
  }

  async updateTaskLastRun(id: string, status: string, duration: number): Promise<AiMonitoringTask | undefined> {
    const [result] = await db.update(aiMonitoringTasks).set({
      lastRunAt: new Date(),
      lastRunStatus: status,
      lastRunDuration: duration,
      updatedAt: new Date()
    }).where(eq(aiMonitoringTasks.id, id)).returning();
    return result;
  }

  async toggleTaskActive(id: string): Promise<AiMonitoringTask | undefined> {
    const task = await this.getAiMonitoringTaskById(id);
    if (!task) return undefined;
    const [result] = await db.update(aiMonitoringTasks).set({
      isActive: !task.isActive,
      updatedAt: new Date()
    }).where(eq(aiMonitoringTasks.id, id)).returning();
    return result;
  }

  // Dashboard Stats
  async getMonitoringDashboardStats(): Promise<{
    totalLogs: number;
    errorCount: number;
    anomalyCount: number;
    unresolvedErrors: number;
    pendingReviews: number;
    healthStatus: string;
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [logs] = await db.select({ count: systemLogs.id }).from(systemLogs).where(gte(systemLogs.createdAt, today));
    const [errors] = await db.select({ count: systemLogs.id }).from(systemLogs).where(and(eq(systemLogs.logLevel, 'error'), gte(systemLogs.createdAt, today)));
    const anomalies = await this.getAnomalousTransactions();
    const unresolvedErrors = await this.getUnresolvedErrors();
    const pendingReports = await this.getPendingActionReports();
    const healthMetrics = await this.getLatestHealthStatus();

    let healthStatus = 'healthy';
    if (healthMetrics.length > 0) {
      const criticalCount = healthMetrics.filter(m => m.status === 'critical').length;
      const degradedCount = healthMetrics.filter(m => m.status === 'degraded').length;
      if (criticalCount > 0) healthStatus = 'critical';
      else if (degradedCount > 0) healthStatus = 'degraded';
    }

    return {
      totalLogs: logs ? 1 : 0,
      errorCount: errors ? 1 : 0,
      anomalyCount: anomalies.length,
      unresolvedErrors: unresolvedErrors.length,
      pendingReviews: pendingReports.length,
      healthStatus
    };
  }

  // =====================================================
  // COUNTRY CONFIGURATIONS
  // =====================================================
  async getAllCountryConfigurations(): Promise<CountryConfiguration[]> {
    return db.select().from(countryConfigurations).where(eq(countryConfigurations.isActive, true));
  }

  async getCountryByCode(code: string): Promise<CountryConfiguration | undefined> {
    const [result] = await db.select().from(countryConfigurations).where(eq(countryConfigurations.countryCode, code));
    return result;
  }

  async createCountryConfiguration(config: InsertCountryConfiguration): Promise<CountryConfiguration> {
    const [result] = await db.insert(countryConfigurations).values(config).returning();
    return result;
  }

  async updateCountryConfiguration(id: string, config: Partial<InsertCountryConfiguration>): Promise<CountryConfiguration | undefined> {
    const [result] = await db.update(countryConfigurations).set({ ...config, updatedAt: new Date() }).where(eq(countryConfigurations.id, id)).returning();
    return result;
  }

  // =====================================================
  // REGULATORY PERMITS
  // =====================================================
  async getRegulatoryPermitsByCountry(countryCode: string): Promise<RegulatoryPermit[]> {
    return db.select().from(regulatoryPermits).where(eq(regulatoryPermits.countryCode, countryCode));
  }

  async getRegulatoryPermitsByUnit(essenceUnitId: string): Promise<RegulatoryPermit[]> {
    return db.select().from(regulatoryPermits).where(eq(regulatoryPermits.essenceUnitId, essenceUnitId));
  }

  async getExpiringPermits(daysAhead: number): Promise<RegulatoryPermit[]> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);
    return db.select().from(regulatoryPermits).where(and(lte(regulatoryPermits.expiryDate, futureDate), gte(regulatoryPermits.expiryDate, new Date())));
  }

  async createRegulatoryPermit(permit: InsertRegulatoryPermit): Promise<RegulatoryPermit> {
    const [result] = await db.insert(regulatoryPermits).values(permit).returning();
    return result;
  }

  async updateRegulatoryPermit(id: string, permit: Partial<InsertRegulatoryPermit>): Promise<RegulatoryPermit | undefined> {
    const [result] = await db.update(regulatoryPermits).set({ ...permit, updatedAt: new Date() }).where(eq(regulatoryPermits.id, id)).returning();
    return result;
  }

  // =====================================================
  // TAX CONFIGURATIONS
  // =====================================================
  async getTaxConfigurationsByCountry(countryCode: string): Promise<TaxConfiguration[]> {
    return db.select().from(taxConfigurations).where(and(eq(taxConfigurations.countryCode, countryCode), eq(taxConfigurations.isActive, true)));
  }

  async createTaxConfiguration(config: InsertTaxConfiguration): Promise<TaxConfiguration> {
    const [result] = await db.insert(taxConfigurations).values(config).returning();
    return result;
  }

  // =====================================================
  // REFRIGERATION UNITS
  // =====================================================
  async getRefrigerationUnitsByEssenceUnit(essenceUnitId: string): Promise<RefrigerationUnit[]> {
    return db.select().from(refrigerationUnits).where(eq(refrigerationUnits.essenceUnitId, essenceUnitId));
  }

  async createRefrigerationUnit(unit: InsertRefrigerationUnit): Promise<RefrigerationUnit> {
    const [result] = await db.insert(refrigerationUnits).values(unit).returning();
    return result;
  }

  // =====================================================
  // TEMPERATURE READINGS
  // =====================================================
  async getTemperatureReadingsByUnit(refrigerationUnitId: string, limit = 100): Promise<TemperatureReading[]> {
    return db.select().from(temperatureReadings).where(eq(temperatureReadings.refrigerationUnitId, refrigerationUnitId)).orderBy(desc(temperatureReadings.recordedAt)).limit(limit);
  }

  async createTemperatureReading(reading: InsertTemperatureReading): Promise<TemperatureReading> {
    const [result] = await db.insert(temperatureReadings).values(reading).returning();
    return result;
  }

  async getOutOfRangeReadings(essenceUnitId: string): Promise<TemperatureReading[]> {
    const units = await this.getRefrigerationUnitsByEssenceUnit(essenceUnitId);
    const unitIds = units.map(u => u.id);
    if (unitIds.length === 0) return [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return db.select().from(temperatureReadings).where(and(eq(temperatureReadings.isWithinRange, false), gte(temperatureReadings.recordedAt, today)));
  }

  // =====================================================
  // FOOD INGREDIENTS
  // =====================================================
  async getFoodIngredientsByEssenceUnit(essenceUnitId: string): Promise<FoodIngredient[]> {
    return db.select().from(foodIngredients).where(eq(foodIngredients.essenceUnitId, essenceUnitId));
  }

  async getExpiringIngredients(daysAhead: number): Promise<FoodIngredient[]> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);
    return db.select().from(foodIngredients).where(and(lte(foodIngredients.expiryDate, futureDate), gte(foodIngredients.expiryDate, new Date())));
  }

  async createFoodIngredient(ingredient: InsertFoodIngredient): Promise<FoodIngredient> {
    const [result] = await db.insert(foodIngredients).values(ingredient).returning();
    return result;
  }

  async updateFoodIngredient(id: string, ingredient: Partial<InsertFoodIngredient>): Promise<FoodIngredient | undefined> {
    const [result] = await db.update(foodIngredients).set({ ...ingredient, updatedAt: new Date() }).where(eq(foodIngredients.id, id)).returning();
    return result;
  }

  // =====================================================
  // FOOD SAFETY ALERTS
  // =====================================================
  async getFoodSafetyAlerts(essenceUnitId?: string): Promise<FoodSafetyAlert[]> {
    if (essenceUnitId) {
      return db.select().from(foodSafetyAlerts).where(eq(foodSafetyAlerts.essenceUnitId, essenceUnitId)).orderBy(desc(foodSafetyAlerts.createdAt));
    }
    return db.select().from(foodSafetyAlerts).orderBy(desc(foodSafetyAlerts.createdAt));
  }

  async getOpenFoodSafetyAlerts(): Promise<FoodSafetyAlert[]> {
    return db.select().from(foodSafetyAlerts).where(eq(foodSafetyAlerts.status, 'open'));
  }

  async createFoodSafetyAlert(alert: InsertFoodSafetyAlert): Promise<FoodSafetyAlert> {
    const [result] = await db.insert(foodSafetyAlerts).values(alert).returning();
    return result;
  }

  async updateFoodSafetyAlert(id: string, alert: Partial<InsertFoodSafetyAlert>): Promise<FoodSafetyAlert | undefined> {
    const [result] = await db.update(foodSafetyAlerts).set(alert).where(eq(foodSafetyAlerts.id, id)).returning();
    return result;
  }

  // =====================================================
  // FINANCIAL TRANSACTIONS
  // =====================================================
  async getFinancialTransactions(countryCode?: string, startDate?: Date, endDate?: Date): Promise<FinancialTransaction[]> {
    let query = db.select().from(financialTransactions);
    if (countryCode) {
      return db.select().from(financialTransactions).where(eq(financialTransactions.countryCode, countryCode)).orderBy(desc(financialTransactions.transactionDate));
    }
    return db.select().from(financialTransactions).orderBy(desc(financialTransactions.transactionDate));
  }

  async createFinancialTransaction(transaction: InsertFinancialTransaction): Promise<FinancialTransaction> {
    const [result] = await db.insert(financialTransactions).values(transaction).returning();
    return result;
  }

  // =====================================================
  // FINANCIAL REPORTS
  // =====================================================
  async getFinancialReports(countryCode?: string): Promise<FinancialReport[]> {
    if (countryCode) {
      return db.select().from(financialReports).where(eq(financialReports.countryCode, countryCode)).orderBy(desc(financialReports.createdAt));
    }
    return db.select().from(financialReports).orderBy(desc(financialReports.createdAt));
  }

  async createFinancialReport(report: InsertFinancialReport): Promise<FinancialReport> {
    const [result] = await db.insert(financialReports).values(report).returning();
    return result;
  }

  // =====================================================
  // EMPLOYEE PROFILES
  // =====================================================
  async getEmployeeProfileByEmployeeId(employeeId: string): Promise<EmployeeProfile | undefined> {
    const [result] = await db.select().from(employeeProfiles).where(eq(employeeProfiles.employeeId, employeeId));
    return result;
  }

  async getEmployeeProfilesByUnit(essenceUnitId: string): Promise<EmployeeProfile[]> {
    return db.select().from(employeeProfiles).where(eq(employeeProfiles.essenceUnitId, essenceUnitId));
  }

  async createEmployeeProfile(profile: InsertEmployeeProfile): Promise<EmployeeProfile> {
    const [result] = await db.insert(employeeProfiles).values(profile).returning();
    return result;
  }

  async updateEmployeeProfile(id: string, profile: Partial<InsertEmployeeProfile>): Promise<EmployeeProfile | undefined> {
    const [result] = await db.update(employeeProfiles).set({ ...profile, updatedAt: new Date() }).where(eq(employeeProfiles.id, id)).returning();
    return result;
  }

  // =====================================================
  // SHIFT SCHEDULES
  // =====================================================
  async getShiftSchedulesByUnit(essenceUnitId: string): Promise<ShiftSchedule[]> {
    return db.select().from(shiftSchedules).where(eq(shiftSchedules.essenceUnitId, essenceUnitId));
  }

  async createShiftSchedule(schedule: InsertShiftSchedule): Promise<ShiftSchedule> {
    const [result] = await db.insert(shiftSchedules).values(schedule).returning();
    return result;
  }

  // =====================================================
  // ABSENCE REQUESTS
  // =====================================================
  async getAbsenceRequestsByEmployee(employeeId: string): Promise<AbsenceRequest[]> {
    return db.select().from(absenceRequests).where(eq(absenceRequests.employeeId, employeeId)).orderBy(desc(absenceRequests.createdAt));
  }

  async getPendingAbsenceRequests(essenceUnitId: string): Promise<AbsenceRequest[]> {
    return db.select().from(absenceRequests).where(and(eq(absenceRequests.essenceUnitId, essenceUnitId), eq(absenceRequests.status, 'pending')));
  }

  async createAbsenceRequest(request: InsertAbsenceRequest): Promise<AbsenceRequest> {
    const [result] = await db.insert(absenceRequests).values(request).returning();
    return result;
  }

  async updateAbsenceRequest(id: string, request: Partial<InsertAbsenceRequest>): Promise<AbsenceRequest | undefined> {
    const [result] = await db.update(absenceRequests).set({ ...request, updatedAt: new Date() }).where(eq(absenceRequests.id, id)).returning();
    return result;
  }

  // =====================================================
  // SHIFT COVER REQUESTS
  // =====================================================
  async getShiftCoverRequestsByAbsence(absenceRequestId: string): Promise<ShiftCoverRequest[]> {
    return db.select().from(shiftCoverRequests).where(eq(shiftCoverRequests.absenceRequestId, absenceRequestId));
  }

  async getPendingShiftCoverRequests(employeeId: string): Promise<ShiftCoverRequest[]> {
    return db.select().from(shiftCoverRequests).where(and(eq(shiftCoverRequests.targetEmployeeId, employeeId), isNull(shiftCoverRequests.response)));
  }

  async createShiftCoverRequest(request: InsertShiftCoverRequest): Promise<ShiftCoverRequest> {
    const [result] = await db.insert(shiftCoverRequests).values(request).returning();
    return result;
  }

  async updateShiftCoverRequest(id: string, request: Partial<InsertShiftCoverRequest>): Promise<ShiftCoverRequest | undefined> {
    const [result] = await db.update(shiftCoverRequests).set(request).where(eq(shiftCoverRequests.id, id)).returning();
    return result;
  }

  // =====================================================
  // VIP INBOX MESSAGES
  // =====================================================
  async getVipInboxMessages(customerId: string): Promise<VipInboxMessage[]> {
    return db.select().from(vipInboxMessages).where(eq(vipInboxMessages.customerId, customerId)).orderBy(desc(vipInboxMessages.createdAt));
  }

  async getUnreadVipMessages(customerId: string): Promise<VipInboxMessage[]> {
    return db.select().from(vipInboxMessages).where(and(eq(vipInboxMessages.customerId, customerId), eq(vipInboxMessages.isRead, false)));
  }

  async createVipInboxMessage(message: InsertVipInboxMessage): Promise<VipInboxMessage> {
    const [result] = await db.insert(vipInboxMessages).values(message).returning();
    return result;
  }

  async markVipMessageAsRead(id: string): Promise<VipInboxMessage | undefined> {
    const [result] = await db.update(vipInboxMessages).set({ isRead: true, readAt: new Date() }).where(eq(vipInboxMessages.id, id)).returning();
    return result;
  }

  // =====================================================
  // NOTIFICATION CONSENTS
  // =====================================================
  async getNotificationConsents(customerId: string): Promise<NotificationConsent[]> {
    return db.select().from(notificationConsents).where(eq(notificationConsents.customerId, customerId));
  }

  async createNotificationConsent(consent: InsertNotificationConsent): Promise<NotificationConsent> {
    const [result] = await db.insert(notificationConsents).values(consent).returning();
    return result;
  }

  async updateNotificationConsent(id: string, consent: Partial<InsertNotificationConsent>): Promise<NotificationConsent | undefined> {
    const [result] = await db.update(notificationConsents).set({ ...consent, updatedAt: new Date() }).where(eq(notificationConsents.id, id)).returning();
    return result;
  }

  // =====================================================
  // E-GIFT PACKAGES
  // =====================================================
  async getActiveEGiftPackages(): Promise<EGiftPackage[]> {
    return db.select().from(eGiftPackages).where(eq(eGiftPackages.isActive, true));
  }

  async createEGiftPackage(pkg: InsertEGiftPackage): Promise<EGiftPackage> {
    const [result] = await db.insert(eGiftPackages).values(pkg).returning();
    return result;
  }

  // =====================================================
  // E-GIFT PURCHASES
  // =====================================================
  async getEGiftPurchasesByCustomer(customerId: string): Promise<EGiftPurchase[]> {
    return db.select().from(eGiftPurchases).where(eq(eGiftPurchases.purchaserCustomerId, customerId));
  }

  async getEGiftPurchaseByCode(code: string): Promise<EGiftPurchase | undefined> {
    const [result] = await db.select().from(eGiftPurchases).where(eq(eGiftPurchases.giftCode, code));
    return result;
  }

  async createEGiftPurchase(purchase: InsertEGiftPurchase): Promise<EGiftPurchase> {
    const [result] = await db.insert(eGiftPurchases).values(purchase).returning();
    return result;
  }

  async updateEGiftPurchase(id: string, purchase: Partial<InsertEGiftPurchase>): Promise<EGiftPurchase | undefined> {
    const [result] = await db.update(eGiftPurchases).set(purchase).where(eq(eGiftPurchases.id, id)).returning();
    return result;
  }

  // =====================================================
  // POS SCALE DEVICES
  // =====================================================
  async getPosScaleDevicesByUnit(essenceUnitId: string): Promise<PosScaleDevice[]> {
    return db.select().from(posScaleDevices).where(eq(posScaleDevices.essenceUnitId, essenceUnitId));
  }

  async createPosScaleDevice(device: InsertPosScaleDevice): Promise<PosScaleDevice> {
    const [result] = await db.insert(posScaleDevices).values(device).returning();
    return result;
  }

  // =====================================================
  // THEFT ALERTS
  // =====================================================
  async getTheftAlerts(essenceUnitId?: string): Promise<TheftAlert[]> {
    if (essenceUnitId) {
      return db.select().from(theftAlerts).where(eq(theftAlerts.essenceUnitId, essenceUnitId)).orderBy(desc(theftAlerts.createdAt));
    }
    return db.select().from(theftAlerts).orderBy(desc(theftAlerts.createdAt));
  }

  async getOpenTheftAlerts(): Promise<TheftAlert[]> {
    return db.select().from(theftAlerts).where(eq(theftAlerts.status, 'open'));
  }

  async createTheftAlert(alert: InsertTheftAlert): Promise<TheftAlert> {
    const [result] = await db.insert(theftAlerts).values(alert).returning();
    return result;
  }

  async updateTheftAlert(id: string, alert: Partial<InsertTheftAlert>): Promise<TheftAlert | undefined> {
    const [result] = await db.update(theftAlerts).set(alert).where(eq(theftAlerts.id, id)).returning();
    return result;
  }

  // =====================================================
  // COMPLIANCE OPERATIONS BRAIN 2025
  // =====================================================

  // Risk Events
  async createRiskEvent(event: InsertRiskEvent): Promise<RiskEvent> {
    const [result] = await db.insert(riskEvents).values(event).returning();
    return result;
  }

  async getRiskEventsByUnit(essenceUnitId: string, lastNDays: number = 90): Promise<RiskEvent[]> {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - lastNDays);
    return db.select().from(riskEvents)
      .where(and(eq(riskEvents.essenceUnitId, essenceUnitId), gte(riskEvents.createdAt, cutoff)))
      .orderBy(desc(riskEvents.createdAt));
  }

  async getOpenRiskEvents(essenceUnitId?: string): Promise<RiskEvent[]> {
    if (essenceUnitId) {
      return db.select().from(riskEvents)
        .where(and(eq(riskEvents.essenceUnitId, essenceUnitId), isNull(riskEvents.resolvedAt)))
        .orderBy(desc(riskEvents.createdAt));
    }
    return db.select().from(riskEvents)
      .where(isNull(riskEvents.resolvedAt))
      .orderBy(desc(riskEvents.createdAt));
  }

  async resolveRiskEvent(id: string, resolvedByUserId: string, notes: string): Promise<RiskEvent | undefined> {
    const [result] = await db.update(riskEvents)
      .set({ resolvedAt: new Date(), resolvedByUserId, resolutionNotes: notes })
      .where(eq(riskEvents.id, id)).returning();
    return result;
  }

  // Insurance Records
  async createInsuranceRecord(record: InsertInsuranceRecord): Promise<InsuranceRecord> {
    const [result] = await db.insert(insuranceRecords).values(record).returning();
    return result;
  }

  async getInsuranceRecordsByUnit(essenceUnitId: string): Promise<InsuranceRecord[]> {
    return db.select().from(insuranceRecords).where(eq(insuranceRecords.essenceUnitId, essenceUnitId));
  }

  async getExpiringInsuranceRecords(days: number): Promise<InsuranceRecord[]> {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() + days);
    return db.select().from(insuranceRecords).where(lte(insuranceRecords.expiryDate, cutoff));
  }

  async updateInsuranceRecord(id: string, record: Partial<InsertInsuranceRecord>): Promise<InsuranceRecord | undefined> {
    const [result] = await db.update(insuranceRecords).set(record).where(eq(insuranceRecords.id, id)).returning();
    return result;
  }

  // Utility Bills
  async createUtilityBill(bill: InsertUtilityBill): Promise<UtilityBill> {
    const [result] = await db.insert(utilityBills).values(bill).returning();
    return result;
  }

  async getUtilityBillsByUnit(essenceUnitId: string, lastNDays: number = 90): Promise<UtilityBill[]> {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - lastNDays);
    return db.select().from(utilityBills)
      .where(and(eq(utilityBills.essenceUnitId, essenceUnitId), gte(utilityBills.createdAt, cutoff)))
      .orderBy(desc(utilityBills.dueDate));
  }

  async getOverdueUtilityBills(): Promise<UtilityBill[]> {
    return db.select().from(utilityBills)
      .where(and(eq(utilityBills.status, 'OVERDUE'), isNull(utilityBills.paidDate)));
  }

  async updateUtilityBill(id: string, bill: Partial<InsertUtilityBill>): Promise<UtilityBill | undefined> {
    const [result] = await db.update(utilityBills).set(bill).where(eq(utilityBills.id, id)).returning();
    return result;
  }

  // Waste Logs
  async createWasteLog(log: InsertWasteLog): Promise<WasteLog> {
    const [result] = await db.insert(wasteLogs).values(log).returning();
    return result;
  }

  async getWasteLogsByUnit(essenceUnitId: string, lastNDays: number = 90): Promise<WasteLog[]> {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - lastNDays);
    return db.select().from(wasteLogs)
      .where(and(eq(wasteLogs.essenceUnitId, essenceUnitId), gte(wasteLogs.createdAt, cutoff)))
      .orderBy(desc(wasteLogs.createdAt));
  }

  async getPendingWasteLogs(essenceUnitId?: string): Promise<WasteLog[]> {
    if (essenceUnitId) {
      return db.select().from(wasteLogs)
        .where(and(eq(wasteLogs.essenceUnitId, essenceUnitId), eq(wasteLogs.approvalStatus, 'PENDING')));
    }
    return db.select().from(wasteLogs).where(eq(wasteLogs.approvalStatus, 'PENDING'));
  }

  async approveWasteLog(id: string, supervisorId: string): Promise<WasteLog | undefined> {
    const [result] = await db.update(wasteLogs)
      .set({ approvalStatus: 'APPROVED', supervisorApprovedById: supervisorId })
      .where(eq(wasteLogs.id, id)).returning();
    return result;
  }

  // Compliance Audit Logs
  async createComplianceAuditLog(log: InsertComplianceAuditLog): Promise<ComplianceAuditLog> {
    const [result] = await db.insert(complianceAuditLogs).values(log).returning();
    return result;
  }

  async getComplianceAuditLogs(essenceUnitId: string, lastNDays: number = 90): Promise<ComplianceAuditLog[]> {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - lastNDays);
    return db.select().from(complianceAuditLogs)
      .where(and(eq(complianceAuditLogs.essenceUnitId, essenceUnitId), gte(complianceAuditLogs.createdAt, cutoff)))
      .orderBy(desc(complianceAuditLogs.createdAt));
  }

  async getLatestComplianceAudit(essenceUnitId: string): Promise<ComplianceAuditLog | undefined> {
    const [result] = await db.select().from(complianceAuditLogs)
      .where(eq(complianceAuditLogs.essenceUnitId, essenceUnitId))
      .orderBy(desc(complianceAuditLogs.createdAt))
      .limit(1);
    return result;
  }

  // Incident Records
  async createIncidentRecord(incident: InsertIncidentRecord): Promise<IncidentRecord> {
    const [result] = await db.insert(incidentRecords).values(incident).returning();
    return result;
  }

  async getIncidentsByUnit(essenceUnitId: string, lastNDays: number = 90): Promise<IncidentRecord[]> {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - lastNDays);
    return db.select().from(incidentRecords)
      .where(and(eq(incidentRecords.essenceUnitId, essenceUnitId), gte(incidentRecords.reportedAt, cutoff)))
      .orderBy(desc(incidentRecords.reportedAt));
  }

  async getOpenIncidents(essenceUnitId?: string): Promise<IncidentRecord[]> {
    if (essenceUnitId) {
      return db.select().from(incidentRecords)
        .where(and(eq(incidentRecords.essenceUnitId, essenceUnitId), eq(incidentRecords.status, 'OPEN')));
    }
    return db.select().from(incidentRecords).where(eq(incidentRecords.status, 'OPEN'));
  }

  async updateIncidentRecord(id: string, incident: Partial<InsertIncidentRecord>): Promise<IncidentRecord | undefined> {
    const [result] = await db.update(incidentRecords).set(incident).where(eq(incidentRecords.id, id)).returning();
    return result;
  }

  async resolveIncident(id: string, resolvedByUserId: string, notes: string): Promise<IncidentRecord | undefined> {
    const [result] = await db.update(incidentRecords)
      .set({ status: 'RESOLVED', resolvedAt: new Date(), resolvedByUserId, resolutionNotes: notes })
      .where(eq(incidentRecords.id, id)).returning();
    return result;
  }

  // Temperature readings helper for compliance (by essence unit)
  async getTemperatureReadingsByEssenceUnit(essenceUnitId: string, lastNDays: number = 7): Promise<TemperatureReading[]> {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - lastNDays);
    const units = await db.select().from(refrigerationUnits).where(eq(refrigerationUnits.essenceUnitId, essenceUnitId));
    const unitIds = units.map(u => u.id);
    if (unitIds.length === 0) return [];
    
    const readings: TemperatureReading[] = [];
    for (const unitId of unitIds) {
      const unitReadings = await db.select().from(temperatureReadings)
        .where(and(eq(temperatureReadings.refrigerationUnitId, unitId), gte(temperatureReadings.recordedAt, cutoff)))
        .orderBy(desc(temperatureReadings.recordedAt));
      readings.push(...unitReadings);
    }
    return readings;
  }

  // =====================================================
  // PASSKEY / WEBAUTHN CREDENTIALS
  // =====================================================

  async getPasskeysByUserId(userId: string): Promise<PasskeyCredential[]> {
    return db.select().from(passkeyCredentials)
      .where(eq(passkeyCredentials.userId, userId))
      .orderBy(desc(passkeyCredentials.createdAt));
  }

  async getPasskeyByCredentialId(credentialId: string): Promise<PasskeyCredential | undefined> {
    const [result] = await db.select().from(passkeyCredentials)
      .where(eq(passkeyCredentials.credentialId, credentialId));
    return result;
  }

  async createPasskeyCredential(credential: InsertPasskeyCredential): Promise<PasskeyCredential> {
    const [result] = await db.insert(passkeyCredentials).values(credential).returning();
    return result;
  }

  async updatePasskeyCounter(credentialId: string, counter: number): Promise<void> {
    await db.update(passkeyCredentials)
      .set({ counter, lastUsedAt: new Date() })
      .where(eq(passkeyCredentials.credentialId, credentialId));
  }

  async deletePasskey(credentialId: string): Promise<void> {
    await db.delete(passkeyCredentials).where(eq(passkeyCredentials.credentialId, credentialId));
  }
}

export const storage = new DbStorage();
