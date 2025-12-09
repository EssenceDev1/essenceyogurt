import { Router } from "express";
import { db } from "../../db";
import { 
  broadcastNotifications, 
  notificationDeliveryLogs,
  loyaltyRegistrations,
  employees,
  pushNotificationConsents,
  insertBroadcastNotificationSchema 
} from "@shared/schema";
import { eq, and, desc, sql, gte, lte, isNull, or } from "drizzle-orm";
import { z } from "zod";
import { sendLoyaltyNotification } from "../services/email-service";

interface Recipient {
  recipientId: string;
  recipientType: "member" | "staff";
  recipientEmail: string;
  recipientName?: string;
}

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { status, limit = 20, offset = 0 } = req.query;
    
    let query = db.select().from(broadcastNotifications);
    
    if (status && typeof status === "string") {
      query = query.where(eq(broadcastNotifications.status, status)) as any;
    }
    
    const notifications = await query
      .orderBy(desc(broadcastNotifications.createdAt))
      .limit(Number(limit))
      .offset(Number(offset));
    
    const [countResult] = await db.select({ count: sql<number>`count(*)` })
      .from(broadcastNotifications);
    
    res.json({ 
      notifications, 
      total: countResult?.count || 0,
      limit: Number(limit),
      offset: Number(offset)
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const [notification] = await db.select()
      .from(broadcastNotifications)
      .where(eq(broadcastNotifications.id, req.params.id));
    
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }
    
    const deliveryLogs = await db.select()
      .from(notificationDeliveryLogs)
      .where(eq(notificationDeliveryLogs.broadcastId, req.params.id))
      .orderBy(desc(notificationDeliveryLogs.createdAt))
      .limit(100);
    
    res.json({ notification, deliveryLogs });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const validation = insertBroadcastNotificationSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({ 
        error: "Validation failed", 
        details: validation.error.flatten().fieldErrors 
      });
    }
    
    const [notification] = await db.insert(broadcastNotifications)
      .values(validation.data)
      .returning();
    
    res.status(201).json({ success: true, notification });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updateSchema = insertBroadcastNotificationSchema.partial();
    const validation = updateSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({ 
        error: "Validation failed", 
        details: validation.error.flatten().fieldErrors 
      });
    }
    
    const [notification] = await db.update(broadcastNotifications)
      .set({ ...validation.data, updatedAt: new Date() })
      .where(eq(broadcastNotifications.id, req.params.id))
      .returning();
    
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }
    
    res.json({ success: true, notification });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/:id/send", async (req, res) => {
  try {
    const { channels = ["in_app"], targetRole } = req.body;
    
    const [notification] = await db.select()
      .from(broadcastNotifications)
      .where(eq(broadcastNotifications.id, req.params.id));
    
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }
    
    if (notification.status === "sent") {
      return res.status(400).json({ error: "Notification already sent" });
    }
    
    await db.update(broadcastNotifications)
      .set({ status: "sending", updatedAt: new Date() })
      .where(eq(broadcastNotifications.id, req.params.id));
    
    const recipients: Recipient[] = [];
    const seenEmails = new Set<string>(); // Deduplication by email
    
    // Get loyalty members
    if (notification.targetAudience === "all" || notification.targetAudience === "members") {
      const memberConditions = [eq(loyaltyRegistrations.isActive, true)];
      
      if (notification.targetTier) {
        memberConditions.push(eq(loyaltyRegistrations.membershipTier, notification.targetTier));
      }
      
      if (notification.targetCountry) {
        memberConditions.push(eq(loyaltyRegistrations.country, notification.targetCountry));
      }
      
      const members = await db.select().from(loyaltyRegistrations)
        .where(and(...memberConditions));
        
      for (const m of members) {
        const emailLower = m.email.toLowerCase();
        if (!seenEmails.has(emailLower)) {
          seenEmails.add(emailLower);
          recipients.push({
            recipientId: m.id,
            recipientType: "member",
            recipientEmail: m.email,
            recipientName: `${m.firstName} ${m.lastName}`,
          });
        }
      }
    }
    
    // Get staff employees
    if (notification.targetAudience === "all" || notification.targetAudience === "staff") {
      const staffConditions = [eq(employees.isActive, true)];
      
      if (notification.targetCountry) {
        staffConditions.push(eq(employees.country, notification.targetCountry));
      }
      
      // Role-based filtering for staff
      if (targetRole && typeof targetRole === "string") {
        staffConditions.push(eq(employees.role, targetRole));
      }
      
      const staff = await db.select().from(employees)
        .where(and(...staffConditions));
        
      for (const s of staff) {
        const emailLower = s.email.toLowerCase();
        // Deduplicate: skip if email already seen from members
        if (!seenEmails.has(emailLower)) {
          seenEmails.add(emailLower);
          recipients.push({
            recipientId: s.id,
            recipientType: "staff",
            recipientEmail: s.email,
            recipientName: s.fullName,
          });
        }
      }
    }
    
    let successCount = 0;
    let failureCount = 0;
    const deliveryChannels = Array.isArray(channels) ? channels : [channels];
    
    for (const recipient of recipients) {
      for (const channel of deliveryChannels) {
        try {
          // In-app notification (always logged)
          if (channel === "in_app") {
            await db.insert(notificationDeliveryLogs).values({
              broadcastId: notification.id,
              recipientId: recipient.recipientId,
              recipientType: recipient.recipientType,
              recipientEmail: recipient.recipientEmail,
              channel: "in_app",
              status: "sent",
              sentAt: new Date(),
            });
            successCount++;
          }
          
          // Email delivery
          if (channel === "email" && recipient.recipientEmail) {
            const firstName = recipient.recipientName?.split(" ")[0] || "Valued Member";
            const emailResult = await sendLoyaltyNotification({
              to: recipient.recipientEmail,
              firstName,
              subject: notification.title,
              message: notification.message,
            });
            
            await db.insert(notificationDeliveryLogs).values({
              broadcastId: notification.id,
              recipientId: recipient.recipientId,
              recipientType: recipient.recipientType,
              recipientEmail: recipient.recipientEmail,
              channel: "email",
              status: emailResult.ok ? "sent" : "failed",
              sentAt: new Date(),
              errorMessage: emailResult.error,
            });
            
            if (emailResult.ok) {
              successCount++;
            } else {
              failureCount++;
            }
          }
        } catch (error) {
          await db.insert(notificationDeliveryLogs).values({
            broadcastId: notification.id,
            recipientId: recipient.recipientId,
            recipientType: recipient.recipientType,
            recipientEmail: recipient.recipientEmail,
            channel,
            status: "failed",
            errorMessage: (error as Error).message,
          });
          failureCount++;
        }
      }
    }
    
    const [updatedNotification] = await db.update(broadcastNotifications)
      .set({ 
        status: "sent",
        sentAt: new Date(),
        recipientCount: recipients.length,
        successCount,
        failureCount,
        updatedAt: new Date(),
      })
      .where(eq(broadcastNotifications.id, req.params.id))
      .returning();
    
    res.json({ 
      success: true, 
      notification: updatedNotification,
      stats: {
        total: recipients.length,
        success: successCount,
        failed: failureCount,
        channels: deliveryChannels,
        audienceBreakdown: {
          members: recipients.filter(r => r.recipientType === "member").length,
          staff: recipients.filter(r => r.recipientType === "staff").length,
        }
      }
    });
  } catch (error: any) {
    await db.update(broadcastNotifications)
      .set({ status: "failed", updatedAt: new Date() })
      .where(eq(broadcastNotifications.id, req.params.id));
    
    res.status(500).json({ error: error.message });
  }
});

router.post("/:id/cancel", async (req, res) => {
  try {
    const [notification] = await db.update(broadcastNotifications)
      .set({ status: "cancelled", updatedAt: new Date() })
      .where(eq(broadcastNotifications.id, req.params.id))
      .returning();
    
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }
    
    res.json({ success: true, notification });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id/stats", async (req, res) => {
  try {
    const [notification] = await db.select()
      .from(broadcastNotifications)
      .where(eq(broadcastNotifications.id, req.params.id));
    
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }
    
    const statusCounts = await db
      .select({
        status: notificationDeliveryLogs.status,
        count: sql<number>`count(*)`,
      })
      .from(notificationDeliveryLogs)
      .where(eq(notificationDeliveryLogs.broadcastId, req.params.id))
      .groupBy(notificationDeliveryLogs.status);
    
    const channelCounts = await db
      .select({
        channel: notificationDeliveryLogs.channel,
        count: sql<number>`count(*)`,
      })
      .from(notificationDeliveryLogs)
      .where(eq(notificationDeliveryLogs.broadcastId, req.params.id))
      .groupBy(notificationDeliveryLogs.channel);
    
    res.json({
      notification: {
        id: notification.id,
        title: notification.title,
        status: notification.status,
        recipientCount: notification.recipientCount,
        successCount: notification.successCount,
        failureCount: notification.failureCount,
      },
      statusBreakdown: statusCounts,
      channelBreakdown: channelCounts,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/audience/preview", async (req, res) => {
  try {
    const { targetAudience, targetTier, targetCountry, targetRole } = req.query;
    
    let memberCount = 0;
    let staffCount = 0;
    
    // Count members
    if (targetAudience === "all" || targetAudience === "members") {
      const memberConditions = [eq(loyaltyRegistrations.isActive, true)];
      
      if (targetTier && typeof targetTier === "string") {
        memberConditions.push(eq(loyaltyRegistrations.membershipTier, targetTier));
      }
      
      if (targetCountry && typeof targetCountry === "string") {
        memberConditions.push(eq(loyaltyRegistrations.country, targetCountry));
      }
      
      const [memberResult] = await db.select({ count: sql<number>`count(*)` })
        .from(loyaltyRegistrations)
        .where(and(...memberConditions));
        
      memberCount = Number(memberResult?.count) || 0;
    }
    
    // Count staff
    if (targetAudience === "all" || targetAudience === "staff") {
      const staffConditions = [eq(employees.isActive, true)];
      
      if (targetCountry && typeof targetCountry === "string") {
        staffConditions.push(eq(employees.country, targetCountry));
      }
      
      // Role-based filtering for staff preview
      if (targetRole && typeof targetRole === "string") {
        staffConditions.push(eq(employees.role, targetRole));
      }
      
      const [staffResult] = await db.select({ count: sql<number>`count(*)` })
        .from(employees)
        .where(and(...staffConditions));
        
      staffCount = Number(staffResult?.count) || 0;
    }
    
    res.json({ 
      estimatedRecipients: memberCount + staffCount,
      breakdown: {
        members: memberCount,
        staff: staffCount,
      },
      filters: { targetAudience, targetTier, targetCountry, targetRole }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
