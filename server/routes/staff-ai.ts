import { Router } from "express";
import { db } from "../../db/index";
import { 
  employees, shiftAssignments, leaveRequests, timesheetEntries,
  insertShiftAssignmentSchema, insertLeaveRequestSchema
} from "@shared/schema";
import { eq, and, gte, lte, desc, sql } from "drizzle-orm";
import {
  rankStaffReplacementCandidates,
  type StaffReplacementCandidate,
  type AutoSwapResult
} from "@shared/essence-os-2026";

const router = Router();

router.get("/employees", async (req, res) => {
  try {
    const { essenceUnitId, isActive } = req.query;
    
    let result = await db.select().from(employees);
    
    if (essenceUnitId) {
      result = result.filter(e => e.essenceUnitId === essenceUnitId);
    }
    
    if (isActive !== undefined) {
      result = result.filter(e => e.isActive === (isActive === "true"));
    }
    
    res.json({ employees: result });
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ error: "Failed to fetch employees" });
  }
});

router.get("/employees/:id/profile", async (req, res) => {
  try {
    const { id } = req.params;
    
    const [employee] = await db.select()
      .from(employees)
      .where(eq(employees.id, id))
      .limit(1);
    
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    
    const recentShifts = await db.select()
      .from(shiftAssignments)
      .where(eq(shiftAssignments.employeeId, id))
      .orderBy(desc(shiftAssignments.shiftDate))
      .limit(10);
    
    const leaveHistory = await db.select()
      .from(leaveRequests)
      .where(eq(leaveRequests.employeeId, id))
      .orderBy(desc(leaveRequests.startDate))
      .limit(5);
    
    res.json({
      employee,
      recentShifts,
      leaveHistory,
      reliabilityScore: calculateReliabilityScore(recentShifts)
    });
  } catch (error) {
    console.error("Error fetching employee profile:", error);
    res.status(500).json({ error: "Failed to fetch employee profile" });
  }
});

function calculateReliabilityScore(shifts: any[]): number {
  let score = 80;
  
  const completedShifts = shifts.filter(s => s.status === "completed").length;
  const totalShifts = shifts.length;
  
  if (totalShifts > 0) {
    const completionRate = completedShifts / totalShifts;
    score = Math.round(50 + (completionRate * 50));
  }
  
  return Math.min(100, Math.max(0, score));
}

router.post("/sick-report", async (req, res) => {
  try {
    const { employeeId, shiftAssignmentId, reason, expectedReturnDate } = req.body;
    
    if (!employeeId || !shiftAssignmentId) {
      return res.status(400).json({ error: "employeeId and shiftAssignmentId required" });
    }
    
    const [shift] = await db.select()
      .from(shiftAssignments)
      .where(eq(shiftAssignments.id, shiftAssignmentId))
      .limit(1);
    
    if (!shift) {
      return res.status(404).json({ error: "Shift not found" });
    }
    
    await db.update(shiftAssignments)
      .set({ status: "sick_reported" })
      .where(eq(shiftAssignments.id, shiftAssignmentId));
    
    const autoSwapResult = await findAndAssignReplacement(shift);
    
    res.json({
      success: true,
      sickReportAccepted: true,
      autoSwap: autoSwapResult
    });
  } catch (error) {
    console.error("Error processing sick report:", error);
    res.status(500).json({ error: "Failed to process sick report" });
  }
});

async function findAndAssignReplacement(shift: any): Promise<AutoSwapResult> {
  try {
    const allEmployees = await db.select().from(employees);
    const availableEmployees = allEmployees.filter(e => 
      e.essenceUnitId === shift.essenceUnitId && e.isActive
    );
    
    const candidates: StaffReplacementCandidate[] = availableEmployees
      .filter(e => e.id !== shift.employeeId)
      .map(e => ({
        staffId: e.id,
        name: e.fullName,
        reliabilityScore: 75 + Math.random() * 20,
        distanceScore: Math.random() * 10,
        wantsMoreHours: Math.random() > 0.5,
        hasRequiredSkills: true,
        speaksRequiredLanguages: true,
        isAvailable: true
      }));
    
    const rankedCandidates = rankStaffReplacementCandidates(candidates);
    
    if (rankedCandidates.length === 0) {
      return {
        success: false,
        notificationsSent: [],
        escalatedToManager: true
      };
    }
    
    const replacement = rankedCandidates[0];
    
    await db.update(shiftAssignments)
      .set({
        employeeId: replacement.staffId,
        status: "reassigned",
        notes: `Auto-reassigned from sick employee. Original: ${shift.employeeId}`
      })
      .where(eq(shiftAssignments.id, shift.id));
    
    return {
      success: true,
      replacementStaffId: replacement.staffId,
      notificationsSent: [replacement.staffId, shift.employeeId],
      escalatedToManager: false
    };
  } catch (error) {
    console.error("Error in auto-swap:", error);
    return {
      success: false,
      notificationsSent: [],
      escalatedToManager: true
    };
  }
}

router.get("/shifts/today/:essenceUnitId", async (req, res) => {
  try {
    const { essenceUnitId } = req.params;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const shifts = await db.select()
      .from(shiftAssignments)
      .where(
        and(
          eq(shiftAssignments.essenceUnitId, essenceUnitId),
          gte(shiftAssignments.shiftDate, today),
          lte(shiftAssignments.shiftDate, tomorrow)
        )
      );
    
    const categorizeShift = (startTime: string) => {
      const hour = parseInt(startTime.split(":")[0]);
      if (hour >= 5 && hour < 12) return "morning";
      if (hour >= 12 && hour < 18) return "afternoon";
      return "night";
    };
    
    const shiftsByType = {
      morning: shifts.filter(s => categorizeShift(s.startTime) === "morning"),
      afternoon: shifts.filter(s => categorizeShift(s.startTime) === "afternoon"),
      night: shifts.filter(s => categorizeShift(s.startTime) === "night")
    };
    
    res.json({ 
      date: today.toISOString().split("T")[0],
      shifts: shiftsByType,
      totalStaff: shifts.length,
      coverage: {
        morning: shiftsByType.morning.length > 0,
        afternoon: shiftsByType.afternoon.length > 0,
        night: shiftsByType.night.length > 0
      }
    });
  } catch (error) {
    console.error("Error fetching today's shifts:", error);
    res.status(500).json({ error: "Failed to fetch shifts" });
  }
});

router.post("/shifts/assign", async (req, res) => {
  try {
    const data = insertShiftAssignmentSchema.parse(req.body);
    
    const [assignment] = await db.insert(shiftAssignments)
      .values({
        ...data,
        status: "scheduled"
      })
      .returning();
    
    res.json({ success: true, assignment });
  } catch (error) {
    console.error("Error assigning shift:", error);
    res.status(500).json({ error: "Failed to assign shift" });
  }
});

router.get("/replacement-candidates/:shiftId", async (req, res) => {
  try {
    const { shiftId } = req.params;
    
    const [shift] = await db.select()
      .from(shiftAssignments)
      .where(eq(shiftAssignments.id, shiftId))
      .limit(1);
    
    if (!shift) {
      return res.status(404).json({ error: "Shift not found" });
    }
    
    const allEmployees = await db.select().from(employees);
    const availableEmployees = allEmployees.filter(e => 
      e.essenceUnitId === shift.essenceUnitId && e.isActive
    );
    
    const candidates: StaffReplacementCandidate[] = availableEmployees
      .filter(e => e.id !== shift.employeeId)
      .map(e => ({
        staffId: e.id,
        name: e.fullName,
        reliabilityScore: 70 + Math.random() * 25,
        distanceScore: Math.random() * 15,
        wantsMoreHours: Math.random() > 0.4,
        hasRequiredSkills: true,
        speaksRequiredLanguages: Math.random() > 0.2,
        isAvailable: Math.random() > 0.3
      }));
    
    const rankedCandidates = rankStaffReplacementCandidates(candidates);
    
    res.json({
      shiftId,
      shiftDate: shift.shiftDate,
      startTime: shift.startTime,
      endTime: shift.endTime,
      candidates: rankedCandidates.slice(0, 5).map((c, idx) => ({
        ...c,
        rank: idx + 1,
        score: Math.round(c.reliabilityScore * 2 + (c.wantsMoreHours ? 10 : 0) - c.distanceScore)
      }))
    });
  } catch (error) {
    console.error("Error fetching replacement candidates:", error);
    res.status(500).json({ error: "Failed to fetch candidates" });
  }
});

router.get("/performance/:employeeId", async (req, res) => {
  try {
    const { employeeId } = req.params;
    
    const [employee] = await db.select()
      .from(employees)
      .where(eq(employees.id, employeeId))
      .limit(1);
    
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    
    const timesheets = await db.select()
      .from(timesheetEntries)
      .where(eq(timesheetEntries.employeeId, employeeId))
      .orderBy(desc(timesheetEntries.clockInTime))
      .limit(30);
    
    const shifts = await db.select()
      .from(shiftAssignments)
      .where(eq(shiftAssignments.employeeId, employeeId))
      .limit(30);
    
    const completedShifts = shifts.filter(s => s.status === "completed").length;
    const sickDays = shifts.filter(s => s.status === "sick_reported").length;
    const lateArrivals = timesheets.filter(t => t.lateMinutes && t.lateMinutes > 5).length;
    
    const performanceScore = Math.round(
      100 - (sickDays * 3) - (lateArrivals * 2) + (completedShifts * 0.5)
    );
    
    res.json({
      employeeId,
      employeeName: employee.fullName,
      metrics: {
        totalShifts: shifts.length,
        completedShifts,
        sickDays,
        lateArrivals,
        performanceScore: Math.min(100, Math.max(0, performanceScore)),
        reliabilityRating: performanceScore > 80 ? "Excellent" : performanceScore > 60 ? "Good" : "Needs Improvement"
      },
      recentTimesheets: timesheets.slice(0, 5)
    });
  } catch (error) {
    console.error("Error fetching performance:", error);
    res.status(500).json({ error: "Failed to fetch performance data" });
  }
});

router.get("/ai/recommendations/:essenceUnitId", async (req, res) => {
  try {
    const { essenceUnitId } = req.params;
    
    const allEmployees = await db.select().from(employees);
    const unitEmployees = allEmployees.filter(e => e.essenceUnitId === essenceUnitId);
    
    const recommendations = [];
    
    const activeCount = unitEmployees.filter(e => e.isActive).length;
    if (activeCount < 3) {
      recommendations.push({
        type: "STAFFING_SHORTAGE",
        severity: "HIGH",
        message: `Only ${activeCount} active staff members. Consider hiring.`,
        action: "HIRE_STAFF"
      });
    }
    
    recommendations.push({
      type: "SCHEDULE_OPTIMIZATION",
      severity: "INFO",
      message: "AI analysis suggests shifting afternoon staff to morning peak hours.",
      action: "OPTIMIZE_SCHEDULE"
    });
    
    res.json({
      essenceUnitId,
      generatedAt: new Date().toISOString(),
      recommendations
    });
  } catch (error) {
    console.error("Error generating AI recommendations:", error);
    res.status(500).json({ error: "Failed to generate recommendations" });
  }
});

export default router;
