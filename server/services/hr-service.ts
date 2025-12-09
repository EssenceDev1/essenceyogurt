import { storage } from "../storage";

export interface ReplacementResult {
  success: boolean;
  replacementEmployeeId?: string;
  replacementEmployeeName?: string;
  notificationsSent: number;
  pendingResponses: number;
  escalated: boolean;
  message: string;
}

export interface ShiftCoverageStatus {
  absenceRequestId: string;
  shiftDate: Date;
  originalEmployeeId: string;
  status: "PENDING" | "COVERED" | "ESCALATED" | "UNCOVERED";
  coverRequests: {
    employeeId: string;
    employeeName: string;
    orderInCascade: number;
    response: "PENDING" | "ACCEPTED" | "DECLINED" | "TIMEOUT";
    respondedAt?: Date;
  }[];
}

export class HRService {
  private readonly CASCADE_TIMEOUT_MINUTES = 30;
  private readonly MAX_CASCADE_ATTEMPTS = 5;

  async reportSickAndTriggerReplacement(
    employeeId: string,
    essenceUnitId: string,
    shiftDate: Date,
    reason: string,
    isEmergency: boolean = false
  ): Promise<ReplacementResult> {
    const absence = await storage.createAbsenceRequest({
      employeeId,
      essenceUnitId,
      absenceType: "sick",
      startDate: shiftDate,
      endDate: shiftDate,
      reason,
      isEmergency,
      urgencyLevel: isEmergency ? "immediate" : "standard",
      status: "pending"
    });

    const profiles = await storage.getEmployeeProfilesByUnit(essenceUnitId);
    const eligibleStaff = profiles.filter(p => 
      p.employeeId !== employeeId && 
      p.isEligibleForShiftCover
    );

    if (eligibleStaff.length === 0) {
      await storage.updateAbsenceRequest(absence.id, { status: "escalated" });
      return {
        success: false,
        notificationsSent: 0,
        pendingResponses: 0,
        escalated: true,
        message: "No eligible staff available. Escalated to management."
      };
    }

    const candidatesToNotify = eligibleStaff.slice(0, this.MAX_CASCADE_ATTEMPTS);
    let notificationsSent = 0;

    for (let i = 0; i < candidatesToNotify.length; i++) {
      const candidate = candidatesToNotify[i];
      const deadline = new Date();
      deadline.setMinutes(deadline.getMinutes() + this.CASCADE_TIMEOUT_MINUTES);

      await storage.createShiftCoverRequest({
        absenceRequestId: absence.id,
        targetEmployeeId: candidate.employeeId,
        shiftDate,
        notificationChannel: candidate.notificationPreference || "whatsapp",
        responseDeadline: deadline,
        orderInCascade: i + 1
      });

      notificationsSent++;
    }

    return {
      success: true,
      notificationsSent,
      pendingResponses: notificationsSent,
      escalated: false,
      message: `Sent ${notificationsSent} shift cover requests. Waiting for responses.`
    };
  }

  async respondToShiftCoverRequest(
    requestId: string,
    response: "accepted" | "declined"
  ): Promise<{ success: boolean; message: string }> {
    const request = await storage.updateShiftCoverRequest(requestId, {
      response,
      respondedAt: new Date()
    });

    if (!request) {
      return { success: false, message: "Request not found" };
    }

    if (response === "accepted") {
      await storage.updateAbsenceRequest(request.absenceRequestId, {
        status: "covered",
        replacementEmployeeId: request.targetEmployeeId,
        replacementConfirmedAt: new Date()
      });

      const otherRequests = await storage.getShiftCoverRequestsByAbsence(request.absenceRequestId);
      for (const other of otherRequests) {
        if (other.id !== requestId && !other.response) {
          await storage.updateShiftCoverRequest(other.id, {
            response: "cancelled"
          });
        }
      }

      return { success: true, message: "Shift cover confirmed. Thank you!" };
    }

    const remainingRequests = await storage.getShiftCoverRequestsByAbsence(request.absenceRequestId);
    const pendingCount = remainingRequests.filter(r => !r.response).length;

    if (pendingCount === 0) {
      await storage.updateAbsenceRequest(request.absenceRequestId, {
        status: "escalated"
      });
      return { success: true, message: "Declined. No more candidates - escalated to management." };
    }

    return { success: true, message: `Declined. ${pendingCount} other candidates being contacted.` };
  }

  async getShiftCoverageStatus(absenceRequestId: string): Promise<ShiftCoverageStatus | null> {
    const requests = await storage.getShiftCoverRequestsByAbsence(absenceRequestId);
    
    if (requests.length === 0) return null;

    const absence = await storage.getAbsenceRequestsByEmployee(requests[0].targetEmployeeId);
    const absenceRecord = absence.find(a => a.id === absenceRequestId);

    if (!absenceRecord) return null;

    let status: ShiftCoverageStatus["status"] = "PENDING";
    if (absenceRecord.status === "covered") status = "COVERED";
    else if (absenceRecord.status === "escalated") status = "ESCALATED";
    else if (requests.every(r => r.response === "declined")) status = "UNCOVERED";

    return {
      absenceRequestId,
      shiftDate: new Date(absenceRecord.startDate),
      originalEmployeeId: absenceRecord.employeeId,
      status,
      coverRequests: requests.map(r => ({
        employeeId: r.targetEmployeeId,
        employeeName: r.targetEmployeeId,
        orderInCascade: r.orderInCascade,
        response: r.response as any || "PENDING",
        respondedAt: r.respondedAt ? new Date(r.respondedAt) : undefined
      }))
    };
  }

  async getAvailableStaffForShift(
    essenceUnitId: string,
    shiftType: "morning" | "afternoon" | "night"
  ): Promise<{ employeeId: string; name: string; eligibility: string[] }[]> {
    const profiles = await storage.getEmployeeProfilesByUnit(essenceUnitId);
    
    return profiles
      .filter(p => p.isEligibleForShiftCover)
      .map(p => ({
        employeeId: p.employeeId,
        name: p.employeeId,
        eligibility: ["morning", "afternoon", "night"]
      }));
  }

  async processTimeoutCascades(): Promise<number> {
    const now = new Date();
    let processed = 0;
    return processed;
  }
}

export const hrService = new HRService();
