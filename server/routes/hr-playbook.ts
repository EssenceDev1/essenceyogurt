import { Router } from "express";
import { db } from "../../db";
import { eq, desc, and, gte, lte, isNull, sql } from "drizzle-orm";
import { z } from "zod";
import {
  hrPolicyDocuments, insertHrPolicyDocumentSchema,
  hrPolicyAcknowledgements, insertHrPolicyAcknowledgementSchema,
  hrPolicyLocalOverrides, insertHrPolicyLocalOverrideSchema,
  hrRoleProfiles, insertHrRoleProfileSchema,
  hrStaffingRules, insertHrStaffingRuleSchema,
  hrTrainingModules, insertHrTrainingModuleSchema,
  hrTrainingEnrollments, insertHrTrainingEnrollmentSchema,
  hrCertifications, insertHrCertificationSchema,
  hrOnboardingTracks, insertHrOnboardingTrackSchema,
  hrOnboardingTasks, insertHrOnboardingTaskSchema,
  hrOnboardingProgress, insertHrOnboardingProgressSchema,
  hrUniformChecks, insertHrUniformCheckSchema,
  hrHygieneAudits, insertHrHygieneAuditSchema,
  hrServiceScripts, insertHrServiceScriptSchema,
  hrPerformanceReviews, insertHrPerformanceReviewSchema,
  hrCoachingNotes, insertHrCoachingNoteSchema,
  hrDisciplinaryActions, insertHrDisciplinaryActionSchema,
  hrConductCases, insertHrConductCaseSchema,
  hrWhistleblowerReports, insertHrWhistleblowerReportSchema,
  hrAttendanceRecords, insertHrAttendanceRecordSchema,
  hrAbsenceRecords, insertHrAbsenceRecordSchema,
  hrSecurityAudits, insertHrSecurityAuditSchema,
  hrHealthSafetyReports, insertHrHealthSafetyReportSchema,
} from "@shared/schema";
import { encryptSensitiveData, decryptSensitiveData, redactSensitiveResponse } from "../utils/encryption";

const router = Router();

const updatePolicySchema = insertHrPolicyDocumentSchema.partial();
const updateRoleSchema = insertHrRoleProfileSchema.partial();
const updateTrainingModuleSchema = insertHrTrainingModuleSchema.partial();
const updatePerformanceReviewSchema = insertHrPerformanceReviewSchema.partial();
const updateConductCaseSchema = insertHrConductCaseSchema.partial();
const updateWhistleblowerSchema = z.object({
  status: z.enum(["NEW", "ACKNOWLEDGED", "UNDER_INVESTIGATION", "ACTION_TAKEN", "RESOLVED", "CLOSED"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
  assignedInvestigator: z.string().optional(),
  internalNotes: z.string().optional(),
  acknowledgedAt: z.date().optional(),
  resolvedAt: z.date().optional(),
  outcome: z.string().optional(),
});

const SENSITIVE_CONDUCT_FIELDS = ['description', 'findings', 'resolution', 'internalNotes'];
const SENSITIVE_WHISTLEBLOWER_FIELDS = ['description', 'allegations', 'evidence', 'internalNotes', 'outcome'];

// ==================== POLICY MANAGEMENT ====================

router.get("/policies", async (req, res) => {
  try {
    const policies = await db.select().from(hrPolicyDocuments).orderBy(desc(hrPolicyDocuments.createdAt));
    res.json(policies);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch policies" });
  }
});

router.get("/policies/:id", async (req, res) => {
  try {
    const [policy] = await db.select().from(hrPolicyDocuments).where(eq(hrPolicyDocuments.id, req.params.id));
    if (!policy) return res.status(404).json({ error: "Policy not found" });
    res.json(policy);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch policy" });
  }
});

router.post("/policies", async (req, res) => {
  try {
    const parsed = insertHrPolicyDocumentSchema.parse(req.body);
    const [policy] = await db.insert(hrPolicyDocuments).values(parsed).returning();
    res.status(201).json(policy);
  } catch (error) {
    res.status(400).json({ error: "Invalid policy data" });
  }
});

router.put("/policies/:id", async (req, res) => {
  try {
    const parsed = updatePolicySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid policy update data", details: parsed.error.flatten() });
    }
    const [policy] = await db.update(hrPolicyDocuments)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(hrPolicyDocuments.id, req.params.id))
      .returning();
    if (!policy) return res.status(404).json({ error: "Policy not found" });
    res.json(policy);
  } catch (error) {
    res.status(500).json({ error: "Failed to update policy" });
  }
});

router.get("/policies/:policyId/acknowledgements", async (req, res) => {
  try {
    const acks = await db.select().from(hrPolicyAcknowledgements)
      .where(eq(hrPolicyAcknowledgements.policyId, req.params.policyId))
      .orderBy(desc(hrPolicyAcknowledgements.acknowledgedAt));
    res.json(acks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch acknowledgements" });
  }
});

router.post("/policies/:policyId/acknowledge", async (req, res) => {
  try {
    const parsed = insertHrPolicyAcknowledgementSchema.parse({
      ...req.body,
      policyId: req.params.policyId,
    });
    const [ack] = await db.insert(hrPolicyAcknowledgements).values(parsed).returning();
    res.status(201).json(ack);
  } catch (error) {
    res.status(400).json({ error: "Failed to acknowledge policy" });
  }
});

router.get("/policies/:policyId/overrides", async (req, res) => {
  try {
    const overrides = await db.select().from(hrPolicyLocalOverrides)
      .where(eq(hrPolicyLocalOverrides.policyId, req.params.policyId));
    res.json(overrides);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch policy overrides" });
  }
});

router.post("/policies/:policyId/overrides", async (req, res) => {
  try {
    const parsed = insertHrPolicyLocalOverrideSchema.parse({
      ...req.body,
      policyId: req.params.policyId,
    });
    const [override] = await db.insert(hrPolicyLocalOverrides).values(parsed).returning();
    res.status(201).json(override);
  } catch (error) {
    res.status(400).json({ error: "Failed to create policy override" });
  }
});

// ==================== ROLE PROFILES ====================

router.get("/roles", async (req, res) => {
  try {
    const roles = await db.select().from(hrRoleProfiles).orderBy(hrRoleProfiles.roleLevel);
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch roles" });
  }
});

router.post("/roles", async (req, res) => {
  try {
    const parsed = insertHrRoleProfileSchema.parse(req.body);
    const [role] = await db.insert(hrRoleProfiles).values(parsed).returning();
    res.status(201).json(role);
  } catch (error) {
    res.status(400).json({ error: "Invalid role data" });
  }
});

router.put("/roles/:id", async (req, res) => {
  try {
    const parsed = updateRoleSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid role update data", details: parsed.error.flatten() });
    }
    const [role] = await db.update(hrRoleProfiles)
      .set(parsed.data)
      .where(eq(hrRoleProfiles.id, req.params.id))
      .returning();
    if (!role) return res.status(404).json({ error: "Role not found" });
    res.json(role);
  } catch (error) {
    res.status(500).json({ error: "Failed to update role" });
  }
});

// ==================== STAFFING RULES ====================

router.get("/staffing-rules", async (req, res) => {
  try {
    const rules = await db.select().from(hrStaffingRules).where(eq(hrStaffingRules.isActive, true));
    res.json(rules);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch staffing rules" });
  }
});

router.post("/staffing-rules", async (req, res) => {
  try {
    const parsed = insertHrStaffingRuleSchema.parse(req.body);
    const [rule] = await db.insert(hrStaffingRules).values(parsed).returning();
    res.status(201).json(rule);
  } catch (error) {
    res.status(400).json({ error: "Invalid staffing rule data" });
  }
});

// ==================== TRAINING MODULES ====================

router.get("/training/modules", async (req, res) => {
  try {
    const modules = await db.select().from(hrTrainingModules)
      .where(eq(hrTrainingModules.isActive, true))
      .orderBy(hrTrainingModules.category);
    res.json(modules);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch training modules" });
  }
});

router.get("/training/modules/:id", async (req, res) => {
  try {
    const [module] = await db.select().from(hrTrainingModules)
      .where(eq(hrTrainingModules.id, req.params.id));
    if (!module) return res.status(404).json({ error: "Module not found" });
    res.json(module);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch module" });
  }
});

router.post("/training/modules", async (req, res) => {
  try {
    const parsed = insertHrTrainingModuleSchema.parse(req.body);
    const [module] = await db.insert(hrTrainingModules).values(parsed).returning();
    res.status(201).json(module);
  } catch (error) {
    res.status(400).json({ error: "Invalid module data" });
  }
});

router.get("/training/enrollments", async (req, res) => {
  try {
    const { employeeId, status } = req.query;
    let query = db.select().from(hrTrainingEnrollments);
    if (employeeId) {
      query = query.where(eq(hrTrainingEnrollments.employeeId, employeeId as string)) as any;
    }
    const enrollments = await query.orderBy(desc(hrTrainingEnrollments.enrolledAt));
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch enrollments" });
  }
});

router.post("/training/enroll", async (req, res) => {
  try {
    const parsed = insertHrTrainingEnrollmentSchema.parse(req.body);
    const [enrollment] = await db.insert(hrTrainingEnrollments).values(parsed).returning();
    res.status(201).json(enrollment);
  } catch (error) {
    res.status(400).json({ error: "Failed to enroll in training" });
  }
});

router.put("/training/enrollments/:id/complete", async (req, res) => {
  try {
    const { quizScore, completionNotes } = req.body;
    const [enrollment] = await db.update(hrTrainingEnrollments)
      .set({
        status: quizScore >= 80 ? "COMPLETED" : "FAILED",
        completedAt: new Date(),
        quizScore,
        completionNotes,
      })
      .where(eq(hrTrainingEnrollments.id, req.params.id))
      .returning();
    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ error: "Failed to complete training" });
  }
});

// ==================== CERTIFICATIONS ====================

router.get("/certifications", async (req, res) => {
  try {
    const { employeeId } = req.query;
    let query = db.select().from(hrCertifications);
    if (employeeId) {
      query = query.where(eq(hrCertifications.employeeId, employeeId as string)) as any;
    }
    const certs = await query.orderBy(desc(hrCertifications.createdAt));
    res.json(certs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch certifications" });
  }
});

router.post("/certifications", async (req, res) => {
  try {
    const parsed = insertHrCertificationSchema.parse(req.body);
    const [cert] = await db.insert(hrCertifications).values(parsed).returning();
    res.status(201).json(cert);
  } catch (error) {
    res.status(400).json({ error: "Invalid certification data" });
  }
});

router.put("/certifications/:id/verify", async (req, res) => {
  try {
    const [cert] = await db.update(hrCertifications)
      .set({
        verifiedByUserId: req.body.verifiedByUserId,
        verifiedAt: new Date(),
      })
      .where(eq(hrCertifications.id, req.params.id))
      .returning();
    res.json(cert);
  } catch (error) {
    res.status(500).json({ error: "Failed to verify certification" });
  }
});

// ==================== ONBOARDING ====================

router.get("/onboarding/tracks", async (req, res) => {
  try {
    const tracks = await db.select().from(hrOnboardingTracks)
      .where(eq(hrOnboardingTracks.isActive, true));
    res.json(tracks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch onboarding tracks" });
  }
});

router.post("/onboarding/tracks", async (req, res) => {
  try {
    const parsed = insertHrOnboardingTrackSchema.parse(req.body);
    const [track] = await db.insert(hrOnboardingTracks).values(parsed).returning();
    res.status(201).json(track);
  } catch (error) {
    res.status(400).json({ error: "Invalid track data" });
  }
});

router.get("/onboarding/tracks/:trackId/tasks", async (req, res) => {
  try {
    const tasks = await db.select().from(hrOnboardingTasks)
      .where(eq(hrOnboardingTasks.trackId, req.params.trackId))
      .orderBy(hrOnboardingTasks.taskOrder);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch onboarding tasks" });
  }
});

router.post("/onboarding/tasks", async (req, res) => {
  try {
    const parsed = insertHrOnboardingTaskSchema.parse(req.body);
    const [task] = await db.insert(hrOnboardingTasks).values(parsed).returning();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: "Invalid task data" });
  }
});

router.get("/onboarding/progress/:employeeId", async (req, res) => {
  try {
    const progress = await db.select().from(hrOnboardingProgress)
      .where(eq(hrOnboardingProgress.employeeId, req.params.employeeId))
      .orderBy(hrOnboardingProgress.createdAt);
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch onboarding progress" });
  }
});

router.post("/onboarding/progress", async (req, res) => {
  try {
    const parsed = insertHrOnboardingProgressSchema.parse(req.body);
    const [progress] = await db.insert(hrOnboardingProgress).values(parsed).returning();
    res.status(201).json(progress);
  } catch (error) {
    res.status(400).json({ error: "Failed to update onboarding progress" });
  }
});

router.put("/onboarding/progress/:id/complete", async (req, res) => {
  try {
    const [progress] = await db.update(hrOnboardingProgress)
      .set({
        status: "COMPLETED",
        completedAt: new Date(),
        completedByUserId: req.body.completedByUserId,
        notes: req.body.notes,
      })
      .where(eq(hrOnboardingProgress.id, req.params.id))
      .returning();
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: "Failed to complete onboarding task" });
  }
});

// ==================== UNIFORM & HYGIENE PROTOCOLS ====================

router.get("/protocols/uniform-checks", async (req, res) => {
  try {
    const { essenceUnitId, employeeId } = req.query;
    let query = db.select().from(hrUniformChecks);
    const checks = await query.orderBy(desc(hrUniformChecks.checkedAt)).limit(100);
    res.json(checks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch uniform checks" });
  }
});

router.post("/protocols/uniform-checks", async (req, res) => {
  try {
    const parsed = insertHrUniformCheckSchema.parse(req.body);
    const [check] = await db.insert(hrUniformChecks).values(parsed).returning();
    res.status(201).json(check);
  } catch (error) {
    res.status(400).json({ error: "Invalid uniform check data" });
  }
});

router.get("/protocols/hygiene-audits", async (req, res) => {
  try {
    const audits = await db.select().from(hrHygieneAudits)
      .orderBy(desc(hrHygieneAudits.auditedAt)).limit(100);
    res.json(audits);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hygiene audits" });
  }
});

router.post("/protocols/hygiene-audits", async (req, res) => {
  try {
    const parsed = insertHrHygieneAuditSchema.parse(req.body);
    const [audit] = await db.insert(hrHygieneAudits).values(parsed).returning();
    res.status(201).json(audit);
  } catch (error) {
    res.status(400).json({ error: "Invalid hygiene audit data" });
  }
});

router.get("/protocols/service-scripts", async (req, res) => {
  try {
    const { language, scriptType } = req.query;
    let query = db.select().from(hrServiceScripts).where(eq(hrServiceScripts.isActive, true));
    const scripts = await query.orderBy(hrServiceScripts.scriptType);
    res.json(scripts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch service scripts" });
  }
});

router.post("/protocols/service-scripts", async (req, res) => {
  try {
    const parsed = insertHrServiceScriptSchema.parse(req.body);
    const [script] = await db.insert(hrServiceScripts).values(parsed).returning();
    res.status(201).json(script);
  } catch (error) {
    res.status(400).json({ error: "Invalid service script data" });
  }
});

// ==================== PERFORMANCE MANAGEMENT ====================

router.get("/performance/reviews", async (req, res) => {
  try {
    const { employeeId, reviewType } = req.query;
    let query = db.select().from(hrPerformanceReviews);
    if (employeeId) {
      query = query.where(eq(hrPerformanceReviews.employeeId, employeeId as string)) as any;
    }
    const reviews = await query.orderBy(desc(hrPerformanceReviews.createdAt));
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch performance reviews" });
  }
});

router.post("/performance/reviews", async (req, res) => {
  try {
    const parsed = insertHrPerformanceReviewSchema.parse(req.body);
    const [review] = await db.insert(hrPerformanceReviews).values(parsed).returning();
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ error: "Invalid performance review data" });
  }
});

router.put("/performance/reviews/:id", async (req, res) => {
  try {
    const parsed = updatePerformanceReviewSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid review update data", details: parsed.error.flatten() });
    }
    const [review] = await db.update(hrPerformanceReviews)
      .set(parsed.data)
      .where(eq(hrPerformanceReviews.id, req.params.id))
      .returning();
    if (!review) return res.status(404).json({ error: "Review not found" });
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: "Failed to update performance review" });
  }
});

router.get("/performance/coaching", async (req, res) => {
  try {
    const { employeeId } = req.query;
    let query = db.select().from(hrCoachingNotes);
    if (employeeId) {
      query = query.where(eq(hrCoachingNotes.employeeId, employeeId as string)) as any;
    }
    const notes = await query.orderBy(desc(hrCoachingNotes.createdAt)).limit(100);
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch coaching notes" });
  }
});

router.post("/performance/coaching", async (req, res) => {
  try {
    const parsed = insertHrCoachingNoteSchema.parse(req.body);
    const [note] = await db.insert(hrCoachingNotes).values(parsed).returning();
    res.status(201).json(note);
  } catch (error) {
    res.status(400).json({ error: "Invalid coaching note data" });
  }
});

// ==================== DISCIPLINARY SYSTEM ====================

router.get("/disciplinary", async (req, res) => {
  try {
    const { employeeId, status } = req.query;
    let query = db.select().from(hrDisciplinaryActions);
    if (employeeId) {
      query = query.where(eq(hrDisciplinaryActions.employeeId, employeeId as string)) as any;
    }
    const actions = await query.orderBy(desc(hrDisciplinaryActions.createdAt));
    res.json(actions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch disciplinary actions" });
  }
});

router.post("/disciplinary", async (req, res) => {
  try {
    const parsed = insertHrDisciplinaryActionSchema.parse(req.body);
    const [action] = await db.insert(hrDisciplinaryActions).values(parsed).returning();
    res.status(201).json(action);
  } catch (error) {
    res.status(400).json({ error: "Invalid disciplinary action data" });
  }
});

router.put("/disciplinary/:id/acknowledge", async (req, res) => {
  try {
    const [action] = await db.update(hrDisciplinaryActions)
      .set({
        acknowledgedByEmployee: true,
        acknowledgedAt: new Date(),
      })
      .where(eq(hrDisciplinaryActions.id, req.params.id))
      .returning();
    res.json(action);
  } catch (error) {
    res.status(500).json({ error: "Failed to acknowledge disciplinary action" });
  }
});

router.put("/disciplinary/:id/appeal", async (req, res) => {
  try {
    const [action] = await db.update(hrDisciplinaryActions)
      .set({
        appealStatus: "PENDING",
        appealNotes: req.body.appealNotes,
      })
      .where(eq(hrDisciplinaryActions.id, req.params.id))
      .returning();
    res.json(action);
  } catch (error) {
    res.status(500).json({ error: "Failed to submit appeal" });
  }
});

// ==================== CONDUCT CASES ====================

router.get("/conduct/cases", async (req, res) => {
  try {
    const cases = await db.select().from(hrConductCases)
      .orderBy(desc(hrConductCases.createdAt));
    const sanitizedCases = cases.map(c => redactSensitiveResponse(c, SENSITIVE_CONDUCT_FIELDS));
    res.json(sanitizedCases);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch conduct cases" });
  }
});

router.post("/conduct/cases", async (req, res) => {
  try {
    const caseNumber = `CC-${Date.now().toString(36).toUpperCase()}`;
    const parsed = insertHrConductCaseSchema.parse({ ...req.body, caseNumber });
    const insertData = { ...parsed } as any;
    for (const field of SENSITIVE_CONDUCT_FIELDS) {
      if (insertData[field]) {
        insertData[field] = encryptSensitiveData(insertData[field]);
      }
    }
    const [conductCase] = await db.insert(hrConductCases).values(insertData as typeof hrConductCases.$inferInsert).returning();
    res.status(201).json(redactSensitiveResponse(conductCase, SENSITIVE_CONDUCT_FIELDS));
  } catch (error) {
    res.status(400).json({ error: "Invalid conduct case data" });
  }
});

router.put("/conduct/cases/:id", async (req, res) => {
  try {
    const parsed = updateConductCaseSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid conduct case update data", details: parsed.error.flatten() });
    }
    const updateData: Record<string, any> = { ...parsed.data };
    for (const field of SENSITIVE_CONDUCT_FIELDS) {
      if (updateData[field]) {
        updateData[field] = encryptSensitiveData(updateData[field]);
      }
    }
    const [conductCase] = await db.update(hrConductCases)
      .set(updateData)
      .where(eq(hrConductCases.id, req.params.id))
      .returning();
    if (!conductCase) return res.status(404).json({ error: "Conduct case not found" });
    res.json(redactSensitiveResponse(conductCase, SENSITIVE_CONDUCT_FIELDS));
  } catch (error) {
    res.status(500).json({ error: "Failed to update conduct case" });
  }
});

// ==================== WHISTLEBLOWING ====================

router.get("/whistleblower/reports", async (req, res) => {
  try {
    const reports = await db.select().from(hrWhistleblowerReports)
      .orderBy(desc(hrWhistleblowerReports.createdAt));
    const sanitizedReports = reports.map(r => redactSensitiveResponse(r, SENSITIVE_WHISTLEBLOWER_FIELDS));
    res.json(sanitizedReports);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch whistleblower reports" });
  }
});

router.post("/whistleblower/submit", async (req, res) => {
  try {
    const trackingCode = `WB-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const parsed = insertHrWhistleblowerReportSchema.parse({ ...req.body, trackingCode });
    const insertData = { ...parsed } as any;
    for (const field of SENSITIVE_WHISTLEBLOWER_FIELDS) {
      if (insertData[field]) {
        insertData[field] = encryptSensitiveData(insertData[field]);
      }
    }
    const [report] = await db.insert(hrWhistleblowerReports).values(insertData as typeof hrWhistleblowerReports.$inferInsert).returning();
    res.status(201).json({ trackingCode: report.trackingCode, id: report.id });
  } catch (error) {
    res.status(400).json({ error: "Failed to submit whistleblower report" });
  }
});

router.get("/whistleblower/track/:trackingCode", async (req, res) => {
  try {
    const [report] = await db.select({
      id: hrWhistleblowerReports.id,
      trackingCode: hrWhistleblowerReports.trackingCode,
      status: hrWhistleblowerReports.status,
      createdAt: hrWhistleblowerReports.createdAt,
      acknowledgedAt: hrWhistleblowerReports.acknowledgedAt,
      resolvedAt: hrWhistleblowerReports.resolvedAt,
    }).from(hrWhistleblowerReports)
      .where(eq(hrWhistleblowerReports.trackingCode, req.params.trackingCode));
    if (!report) return res.status(404).json({ error: "Report not found" });
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: "Failed to track report" });
  }
});

router.put("/whistleblower/reports/:id", async (req, res) => {
  try {
    const parsed = updateWhistleblowerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid whistleblower update data", details: parsed.error.flatten() });
    }
    const updateData: Record<string, any> = { ...parsed.data };
    for (const field of SENSITIVE_WHISTLEBLOWER_FIELDS) {
      if (updateData[field]) {
        updateData[field] = encryptSensitiveData(updateData[field]);
      }
    }
    const [report] = await db.update(hrWhistleblowerReports)
      .set(updateData)
      .where(eq(hrWhistleblowerReports.id, req.params.id))
      .returning();
    if (!report) return res.status(404).json({ error: "Report not found" });
    res.json(redactSensitiveResponse(report, SENSITIVE_WHISTLEBLOWER_FIELDS));
  } catch (error) {
    res.status(500).json({ error: "Failed to update whistleblower report" });
  }
});

// ==================== ATTENDANCE ====================

router.get("/attendance", async (req, res) => {
  try {
    const { employeeId, essenceUnitId, date } = req.query;
    let query = db.select().from(hrAttendanceRecords);
    const records = await query.orderBy(desc(hrAttendanceRecords.date)).limit(100);
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch attendance records" });
  }
});

router.post("/attendance/check-in", async (req, res) => {
  try {
    const parsed = insertHrAttendanceRecordSchema.parse({
      ...req.body,
      checkInTime: new Date(),
      date: new Date(),
    });
    const [record] = await db.insert(hrAttendanceRecords).values(parsed).returning();
    res.status(201).json(record);
  } catch (error) {
    res.status(400).json({ error: "Failed to check in" });
  }
});

router.put("/attendance/:id/check-out", async (req, res) => {
  try {
    const checkOutTime = new Date();
    const [record] = await db.update(hrAttendanceRecords)
      .set({
        checkOutTime,
      })
      .where(eq(hrAttendanceRecords.id, req.params.id))
      .returning();
    res.json(record);
  } catch (error) {
    res.status(500).json({ error: "Failed to check out" });
  }
});

// ==================== ABSENCES ====================

router.get("/absences", async (req, res) => {
  try {
    const { employeeId, status } = req.query;
    let query = db.select().from(hrAbsenceRecords);
    if (employeeId) {
      query = query.where(eq(hrAbsenceRecords.employeeId, employeeId as string)) as any;
    }
    const absences = await query.orderBy(desc(hrAbsenceRecords.createdAt));
    res.json(absences);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch absence records" });
  }
});

router.post("/absences", async (req, res) => {
  try {
    const parsed = insertHrAbsenceRecordSchema.parse(req.body);
    const [absence] = await db.insert(hrAbsenceRecords).values(parsed).returning();
    res.status(201).json(absence);
  } catch (error) {
    res.status(400).json({ error: "Invalid absence data" });
  }
});

router.put("/absences/:id/approve", async (req, res) => {
  try {
    const [absence] = await db.update(hrAbsenceRecords)
      .set({
        approvalStatus: "APPROVED",
        approvedByUserId: req.body.approvedByUserId,
        approvalNotes: req.body.approvalNotes,
      })
      .where(eq(hrAbsenceRecords.id, req.params.id))
      .returning();
    res.json(absence);
  } catch (error) {
    res.status(500).json({ error: "Failed to approve absence" });
  }
});

// ==================== SECURITY AUDITS ====================

router.get("/security/audits", async (req, res) => {
  try {
    const audits = await db.select().from(hrSecurityAudits)
      .orderBy(desc(hrSecurityAudits.createdAt)).limit(100);
    res.json(audits);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch security audits" });
  }
});

router.post("/security/audits", async (req, res) => {
  try {
    const parsed = insertHrSecurityAuditSchema.parse(req.body);
    const [audit] = await db.insert(hrSecurityAudits).values(parsed).returning();
    res.status(201).json(audit);
  } catch (error) {
    res.status(400).json({ error: "Invalid security audit data" });
  }
});

// ==================== HEALTH & SAFETY ====================

router.get("/safety/reports", async (req, res) => {
  try {
    const { essenceUnitId, status, severity } = req.query;
    let query = db.select().from(hrHealthSafetyReports);
    const reports = await query.orderBy(desc(hrHealthSafetyReports.createdAt)).limit(100);
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch safety reports" });
  }
});

router.post("/safety/reports", async (req, res) => {
  try {
    const parsed = insertHrHealthSafetyReportSchema.parse(req.body);
    const [report] = await db.insert(hrHealthSafetyReports).values(parsed).returning();
    res.status(201).json(report);
  } catch (error) {
    res.status(400).json({ error: "Invalid safety report data" });
  }
});

router.put("/safety/reports/:id", async (req, res) => {
  try {
    const [report] = await db.update(hrHealthSafetyReports)
      .set(req.body)
      .where(eq(hrHealthSafetyReports.id, req.params.id))
      .returning();
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: "Failed to update safety report" });
  }
});

// ==================== DASHBOARD SUMMARY ====================

router.get("/dashboard/summary", async (req, res) => {
  try {
    const [
      policiesCount,
      trainingModulesCount,
      openIncidentsCount,
      pendingAbsencesCount,
      activeWhistleblowerCount,
    ] = await Promise.all([
      db.select({ count: sql`count(*)` }).from(hrPolicyDocuments).where(eq(hrPolicyDocuments.status, "ACTIVE")),
      db.select({ count: sql`count(*)` }).from(hrTrainingModules).where(eq(hrTrainingModules.isActive, true)),
      db.select({ count: sql`count(*)` }).from(hrHealthSafetyReports).where(eq(hrHealthSafetyReports.status, "OPEN")),
      db.select({ count: sql`count(*)` }).from(hrAbsenceRecords).where(eq(hrAbsenceRecords.approvalStatus, "PENDING")),
      db.select({ count: sql`count(*)` }).from(hrWhistleblowerReports).where(eq(hrWhistleblowerReports.status, "NEW")),
    ]);

    res.json({
      activePolicies: Number(policiesCount[0]?.count || 0),
      trainingModules: Number(trainingModulesCount[0]?.count || 0),
      openSafetyIncidents: Number(openIncidentsCount[0]?.count || 0),
      pendingAbsenceRequests: Number(pendingAbsencesCount[0]?.count || 0),
      newWhistleblowerReports: Number(activeWhistleblowerCount[0]?.count || 0),
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch HR dashboard summary" });
  }
});

export default router;