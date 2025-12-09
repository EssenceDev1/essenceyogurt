import { Router } from "express";
import { z } from "zod";
import { db } from "../../db";
import { loyaltyRegistrations, pushNotificationConsents, insertLoyaltyRegistrationSchema, insertPushConsentSchema } from "@shared/schema";
import { eq } from "drizzle-orm";
import { sendLuxuryWelcomeEmail } from "../services/email-service";

const router = Router();

// Generate unique referral code with collision check
async function generateUniqueReferralCode(): Promise<string> {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const maxAttempts = 10;
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    let code = "ESS";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // Check for collision
    const existing = await db.select({ id: loyaltyRegistrations.id })
      .from(loyaltyRegistrations)
      .where(eq(loyaltyRegistrations.referralCode, code));
    
    if (existing.length === 0) {
      return code;
    }
  }
  
  // If all attempts fail, append timestamp for uniqueness
  return "ESS" + Date.now().toString(36).toUpperCase().slice(-6);
}

// Generate email verification token
function generateVerificationToken(): string {
  return Array.from({ length: 64 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join("");
}

// =======================================================================
// LOYALTY REGISTRATION API
// =======================================================================

// Register new loyalty member
router.post("/register", async (req, res) => {
  try {
    const validation = insertLoyaltyRegistrationSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        error: "Validation failed", 
        details: validation.error.flatten().fieldErrors 
      });
    }

    // Check if email already exists
    const existingMember = await db.select().from(loyaltyRegistrations)
      .where(eq(loyaltyRegistrations.email, validation.data.email));
    
    if (existingMember.length > 0) {
      return res.status(409).json({ 
        error: "Email already registered",
        message: "This email address is already associated with an Essence Yogurt account. Please sign in or use a different email."
      });
    }

    // Generate referral code and verification token
    const referralCode = await generateUniqueReferralCode();
    const emailVerificationToken = generateVerificationToken();

    // Create registration
    const [registration] = await db.insert(loyaltyRegistrations).values({
      ...validation.data,
      referralCode,
      emailVerificationToken,
      membershipTier: "PEARL",
      pointsBalance: 100, // Welcome bonus points
      lifetimePoints: 100,
    }).returning();

    // Send luxury welcome email
    try {
      await sendLuxuryWelcomeEmail({
        to: registration.email,
        firstName: registration.firstName,
        lastName: registration.lastName,
        membershipTier: "PEARL",
        referralCode: registration.referralCode!,
        welcomePoints: 100,
        verificationLink: `${process.env.VITE_PUBLIC_SITE_URL || "https://www.essenceyogurt.com"}/verify-email?token=${emailVerificationToken}`,
      });

      // Update welcome email sent timestamp
      await db.update(loyaltyRegistrations)
        .set({ welcomeEmailSentAt: new Date() })
        .where(eq(loyaltyRegistrations.id, registration.id));

    } catch (emailError: any) {
      console.error("Failed to send welcome email:", emailError.message);
      // Don't fail registration if email fails
    }

    res.status(201).json({
      success: true,
      message: "Welcome to Essence Yogurt! Check your email for exclusive benefits.",
      member: {
        id: registration.id,
        email: registration.email,
        firstName: registration.firstName,
        lastName: registration.lastName,
        membershipTier: registration.membershipTier,
        pointsBalance: registration.pointsBalance,
        referralCode: registration.referralCode,
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Verify email
router.get("/verify-email/:token", async (req, res) => {
  try {
    const token = req.params.token;
    
    // Validate token format (should be 64 hex characters)
    if (!token || token.length !== 64 || !/^[a-f0-9]+$/i.test(token)) {
      return res.status(400).json({ error: "Invalid token format" });
    }

    const [member] = await db.select().from(loyaltyRegistrations)
      .where(eq(loyaltyRegistrations.emailVerificationToken, token));
    
    if (!member) {
      return res.status(404).json({ 
        error: "Invalid or expired verification token",
        message: "This verification link is invalid or has already been used. Please request a new verification email."
      });
    }

    if (member.emailVerified) {
      return res.json({ 
        success: true, 
        message: "Email already verified",
        alreadyVerified: true
      });
    }

    // Check token expiry (24 hours from creation)
    const tokenAge = Date.now() - new Date(member.createdAt).getTime();
    const maxTokenAge = 24 * 60 * 60 * 1000; // 24 hours
    if (tokenAge > maxTokenAge) {
      return res.status(410).json({
        error: "Verification token expired",
        message: "This verification link has expired. Please request a new verification email."
      });
    }

    // Update verification status, clear token (single-use), and award bonus points
    await db.update(loyaltyRegistrations)
      .set({ 
        emailVerified: true,
        emailVerificationToken: null, // Clear token to prevent re-use
        pointsBalance: (member.pointsBalance || 0) + 50, // Verification bonus
        lifetimePoints: (member.lifetimePoints || 0) + 50,
        updatedAt: new Date(),
      })
      .where(eq(loyaltyRegistrations.id, member.id));

    res.json({ 
      success: true, 
      message: "Email verified successfully! 50 bonus points added to your account.",
      bonusPoints: 50
    });
  } catch (error: any) {
    console.error("Email verification error:", error);
    res.status(500).json({ error: "Verification failed. Please try again later." });
  }
});

// Resend verification email
router.post("/resend-verification", async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: "Email address required" });
    }

    const [member] = await db.select().from(loyaltyRegistrations)
      .where(eq(loyaltyRegistrations.email, email));
    
    if (!member) {
      return res.status(404).json({ 
        error: "Account not found",
        message: "No account found with this email address."
      });
    }

    if (member.emailVerified) {
      return res.json({ 
        success: true, 
        message: "Email already verified",
        alreadyVerified: true
      });
    }

    // Generate new verification token
    const newToken = generateVerificationToken();
    
    await db.update(loyaltyRegistrations)
      .set({ 
        emailVerificationToken: newToken,
        updatedAt: new Date(),
      })
      .where(eq(loyaltyRegistrations.id, member.id));

    // Send verification email
    try {
      await sendLuxuryWelcomeEmail({
        to: member.email,
        firstName: member.firstName,
        lastName: member.lastName,
        membershipTier: member.membershipTier || "PEARL",
        referralCode: member.referralCode || "ESSXXXXX",
        welcomePoints: member.pointsBalance || 100,
        verificationLink: `${process.env.VITE_PUBLIC_SITE_URL || "https://www.essenceyogurt.com"}/verify-email?token=${newToken}`,
      });
    } catch (emailError: any) {
      console.error("Failed to resend verification email:", emailError.message);
    }

    res.json({ 
      success: true, 
      message: "Verification email sent. Please check your inbox."
    });
  } catch (error: any) {
    console.error("Resend verification error:", error);
    res.status(500).json({ error: "Failed to resend verification email. Please try again later." });
  }
});

// Get member profile
router.get("/profile/:email", async (req, res) => {
  try {
    const [member] = await db.select({
      id: loyaltyRegistrations.id,
      email: loyaltyRegistrations.email,
      firstName: loyaltyRegistrations.firstName,
      lastName: loyaltyRegistrations.lastName,
      membershipTier: loyaltyRegistrations.membershipTier,
      pointsBalance: loyaltyRegistrations.pointsBalance,
      lifetimePoints: loyaltyRegistrations.lifetimePoints,
      referralCode: loyaltyRegistrations.referralCode,
      emailVerified: loyaltyRegistrations.emailVerified,
      pushNotificationEnabled: loyaltyRegistrations.pushNotificationEnabled,
      createdAt: loyaltyRegistrations.createdAt,
    }).from(loyaltyRegistrations)
      .where(eq(loyaltyRegistrations.email, req.params.email));
    
    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    res.json(member);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// =======================================================================
// PUSH NOTIFICATION CONSENT API
// =======================================================================

// Register push notification consent
router.post("/push-consent", async (req, res) => {
  try {
    const validation = insertPushConsentSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        error: "Validation failed", 
        details: validation.error.flatten().fieldErrors 
      });
    }

    // Check if device already registered
    const existingConsent = await db.select().from(pushNotificationConsents)
      .where(eq(pushNotificationConsents.deviceToken, validation.data.deviceToken));
    
    if (existingConsent.length > 0) {
      // Update existing consent
      const [updated] = await db.update(pushNotificationConsents)
        .set({ 
          ...validation.data,
          consentTimestamp: new Date(),
          isActive: true,
          revokedAt: null,
          updatedAt: new Date(),
        })
        .where(eq(pushNotificationConsents.id, existingConsent[0].id))
        .returning();
      
      return res.json({ success: true, consent: updated, updated: true });
    }

    // Create new consent
    const [consent] = await db.insert(pushNotificationConsents).values(validation.data).returning();

    // Update loyalty registration if user exists
    if (validation.data.userId) {
      await db.update(loyaltyRegistrations)
        .set({ pushNotificationEnabled: true, updatedAt: new Date() })
        .where(eq(loyaltyRegistrations.userId, validation.data.userId));
    }

    res.status(201).json({ success: true, consent });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Revoke push notification consent
router.post("/push-consent/revoke", async (req, res) => {
  try {
    const { deviceToken } = req.body;
    
    if (!deviceToken) {
      return res.status(400).json({ error: "Device token required" });
    }

    const [consent] = await db.update(pushNotificationConsents)
      .set({ 
        consentGiven: false,
        isActive: false,
        revokedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(pushNotificationConsents.deviceToken, deviceToken))
      .returning();
    
    if (!consent) {
      return res.status(404).json({ error: "Device not found" });
    }

    res.json({ success: true, message: "Push notifications disabled" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
