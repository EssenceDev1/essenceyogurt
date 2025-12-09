import { Router } from "express";
import { db } from "../../db/index";
import { 
  loyaltyTiers, loyaltyQrTokens, loyaltyPointsTransactions, customers,
  eGiftPackages, eGiftPurchases, vipInboxMessages,
  insertLoyaltyQrTokenSchema, insertLoyaltyPointsTransactionSchema,
  insertEGiftPurchaseSchema, insertVipInboxMessageSchema
} from "@shared/schema";
import { eq, desc, and, gt, lt, sql } from "drizzle-orm";
import {
  calculateLoyaltyPointsForOrder,
  determineLoyaltyTier,
  generateQrToken,
  validateQrToken,
  LOYALTY_TIER_MULTIPLIERS,
  LOYALTY_TIER_THRESHOLDS,
  EGIFT_PACKAGES,
  canRedeemEGift,
  validateEGiftTransferAttempt,
  type LoyaltyTier as LoyaltyTierType,
  type EGift,
  type Flavor,
  FLAVOR_LIBRARY_2026
} from "@shared/essence-os-2026";

const router = Router();

const QR_SECRET_KEY = process.env.LOYALTY_QR_SECRET || "essence-qr-secret-2026";
const QR_TOKEN_LIFETIME_MS = 60000;

router.get("/tiers", async (req, res) => {
  try {
    const tiers = await db.select().from(loyaltyTiers).orderBy(loyaltyTiers.requiredPoints);
    res.json({ 
      tiers,
      multipliers: LOYALTY_TIER_MULTIPLIERS,
      thresholds: LOYALTY_TIER_THRESHOLDS
    });
  } catch (error) {
    console.error("Error fetching loyalty tiers:", error);
    res.status(500).json({ error: "Failed to fetch loyalty tiers" });
  }
});

router.post("/tiers/seed", async (req, res) => {
  try {
    await db.delete(loyaltyTiers);
    
    const defaultTiers = [
      {
        name: "Standard",
        tierCode: "standard",
        requiredPoints: 0,
        pointsMultiplier: "1.0",
        perksDescription: "Welcome to Essence! Earn 1 point per gram.",
        freeCupsPerYear: 0,
        freeToppingUpgrades: 0,
        birthdayGiftValue: null,
        hasVipInboxAccess: false,
        hasEarlyFlavorAccess: false,
        hasAirportPerks: false,
        displayOrder: 1,
        accentColor: "#9CA3AF"
      },
      {
        name: "Gold",
        tierCode: "gold",
        requiredPoints: 1000,
        pointsMultiplier: "1.1",
        perksDescription: "Gold members earn 1.1x points on every purchase.",
        freeCupsPerYear: 2,
        freeToppingUpgrades: 5,
        birthdayGiftValue: "5.00",
        hasVipInboxAccess: true,
        hasEarlyFlavorAccess: false,
        hasAirportPerks: false,
        displayOrder: 2,
        accentColor: "#D4AF37"
      },
      {
        name: "Platinum",
        tierCode: "platinum",
        requiredPoints: 5000,
        pointsMultiplier: "1.25",
        perksDescription: "Platinum members earn 1.25x points. Early flavor access included.",
        freeCupsPerYear: 6,
        freeToppingUpgrades: 12,
        birthdayGiftValue: "15.00",
        hasVipInboxAccess: true,
        hasEarlyFlavorAccess: true,
        hasAirportPerks: false,
        displayOrder: 3,
        accentColor: "#E5E4E2"
      },
      {
        name: "Diamond",
        tierCode: "diamond",
        requiredPoints: 15000,
        pointsMultiplier: "1.5",
        perksDescription: "Diamond members earn 1.5x points. VIP airport perks and exclusive flavors.",
        freeCupsPerYear: 12,
        freeToppingUpgrades: 24,
        birthdayGiftValue: "30.00",
        hasVipInboxAccess: true,
        hasEarlyFlavorAccess: true,
        hasAirportPerks: true,
        displayOrder: 4,
        accentColor: "#B9F2FF"
      }
    ];
    
    for (const tier of defaultTiers) {
      await db.insert(loyaltyTiers).values(tier);
    }
    
    res.json({ success: true, message: "Loyalty tiers seeded with Block 3 multipliers" });
  } catch (error) {
    console.error("Error seeding loyalty tiers:", error);
    res.status(500).json({ error: "Failed to seed loyalty tiers" });
  }
});

router.post("/qr/generate", async (req, res) => {
  try {
    const { customerId, sessionId, deviceFingerprint } = req.body;
    
    if (!customerId || !sessionId) {
      return res.status(400).json({ error: "customerId and sessionId required" });
    }
    
    const tokenPayload = generateQrToken(customerId, sessionId, QR_SECRET_KEY);
    const expiresAt = new Date(Date.now() + QR_TOKEN_LIFETIME_MS);
    
    const [qrToken] = await db.insert(loyaltyQrTokens).values({
      customerId,
      token: `${tokenPayload.signature}_${tokenPayload.timestamp}`,
      signature: tokenPayload.signature,
      sessionId,
      expiresAt,
      deviceFingerprint,
      isUsed: false
    }).returning();
    
    res.json({
      token: qrToken.token,
      expiresAt: qrToken.expiresAt,
      expiresInMs: QR_TOKEN_LIFETIME_MS,
      qrData: JSON.stringify({
        t: qrToken.token,
        c: customerId,
        e: expiresAt.getTime()
      })
    });
  } catch (error) {
    console.error("Error generating QR token:", error);
    res.status(500).json({ error: "Failed to generate QR token" });
  }
});

router.post("/qr/validate", async (req, res) => {
  try {
    const { token, essenceUnitId } = req.body;
    
    if (!token) {
      return res.status(400).json({ valid: false, reason: "TOKEN_REQUIRED" });
    }
    
    const [qrToken] = await db.select()
      .from(loyaltyQrTokens)
      .where(eq(loyaltyQrTokens.token, token))
      .limit(1);
    
    if (!qrToken) {
      return res.json({ valid: false, reason: "TOKEN_NOT_FOUND" });
    }
    
    if (qrToken.isUsed) {
      return res.json({ valid: false, reason: "TOKEN_ALREADY_USED" });
    }
    
    if (new Date(qrToken.expiresAt) < new Date()) {
      return res.json({ valid: false, reason: "TOKEN_EXPIRED" });
    }
    
    await db.update(loyaltyQrTokens)
      .set({ 
        isUsed: true, 
        usedAt: new Date(),
        usedAtUnitId: essenceUnitId
      })
      .where(eq(loyaltyQrTokens.id, qrToken.id));
    
    const [customer] = await db.select()
      .from(customers)
      .where(eq(customers.id, qrToken.customerId))
      .limit(1);
    
    res.json({
      valid: true,
      customerId: qrToken.customerId,
      customerName: customer?.fullName,
      loyaltyPoints: customer?.loyaltyPoints || 0,
      loyaltyTierId: customer?.loyaltyTierId
    });
  } catch (error) {
    console.error("Error validating QR token:", error);
    res.status(500).json({ valid: false, reason: "VALIDATION_ERROR" });
  }
});

router.post("/points/earn", async (req, res) => {
  try {
    const { customerId, weightGrams, flavorCodes, posTransactionId, essenceUnitId } = req.body;
    
    if (!customerId || !weightGrams) {
      return res.status(400).json({ error: "customerId and weightGrams required" });
    }
    
    const [customer] = await db.select()
      .from(customers)
      .where(eq(customers.id, customerId))
      .limit(1);
    
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    
    const [tier] = customer.loyaltyTierId 
      ? await db.select().from(loyaltyTiers).where(eq(loyaltyTiers.id, customer.loyaltyTierId)).limit(1)
      : [];
    
    const userTierCode = (tier?.tierCode?.toUpperCase() || "STANDARD") as LoyaltyTierType;
    
    const flavorsUsed: Flavor[] = (flavorCodes || [])
      .map((code: string) => FLAVOR_LIBRARY_2026.find(f => f.internalCode === code))
      .filter(Boolean);
    
    const loyaltyCalc = calculateLoyaltyPointsForOrder({
      userTier: userTierCode,
      totalGrams: weightGrams,
      flavors: flavorsUsed
    });
    
    const newBalance = (customer.loyaltyPoints || 0) + loyaltyCalc.finalPoints;
    
    await db.update(customers)
      .set({ loyaltyPoints: newBalance })
      .where(eq(customers.id, customerId));
    
    const [transaction] = await db.insert(loyaltyPointsTransactions).values({
      customerId,
      transactionType: "earn",
      pointsAmount: loyaltyCalc.finalPoints,
      weightGrams,
      multiplierApplied: String(loyaltyCalc.multiplier),
      basePoints: loyaltyCalc.basePoints,
      posTransactionId,
      essenceUnitId,
      description: `Earned ${loyaltyCalc.finalPoints} points from ${weightGrams}g purchase`,
      balanceAfter: newBalance
    }).returning();
    
    const newTier = determineLoyaltyTier(newBalance);
    let tierUpgraded = false;
    
    if (newTier !== userTierCode) {
      const [newTierRecord] = await db.select()
        .from(loyaltyTiers)
        .where(eq(loyaltyTiers.tierCode, newTier.toLowerCase()))
        .limit(1);
      
      if (newTierRecord) {
        await db.update(customers)
          .set({ loyaltyTierId: newTierRecord.id })
          .where(eq(customers.id, customerId));
        tierUpgraded = true;
      }
    }
    
    res.json({
      success: true,
      transaction: {
        id: transaction.id,
        basePoints: loyaltyCalc.basePoints,
        multiplier: loyaltyCalc.multiplier,
        flavorBoost: loyaltyCalc.flavorBoost,
        finalPoints: loyaltyCalc.finalPoints,
        newBalance
      },
      tierUpgraded,
      newTier: tierUpgraded ? newTier : undefined
    });
  } catch (error) {
    console.error("Error earning points:", error);
    res.status(500).json({ error: "Failed to process points" });
  }
});

router.post("/points/redeem", async (req, res) => {
  try {
    const { customerId, pointsToRedeem, essenceUnitId, description } = req.body;
    
    if (!customerId || !pointsToRedeem || pointsToRedeem <= 0) {
      return res.status(400).json({ error: "Valid customerId and pointsToRedeem required" });
    }
    
    const [customer] = await db.select()
      .from(customers)
      .where(eq(customers.id, customerId))
      .limit(1);
    
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    
    if ((customer.loyaltyPoints || 0) < pointsToRedeem) {
      return res.status(400).json({ 
        error: "Insufficient points",
        available: customer.loyaltyPoints || 0,
        requested: pointsToRedeem
      });
    }
    
    const newBalance = (customer.loyaltyPoints || 0) - pointsToRedeem;
    
    await db.update(customers)
      .set({ loyaltyPoints: newBalance })
      .where(eq(customers.id, customerId));
    
    const [transaction] = await db.insert(loyaltyPointsTransactions).values({
      customerId,
      transactionType: "redeem",
      pointsAmount: -pointsToRedeem,
      essenceUnitId,
      description: description || `Redeemed ${pointsToRedeem} points`,
      balanceAfter: newBalance
    }).returning();
    
    res.json({
      success: true,
      pointsRedeemed: pointsToRedeem,
      newBalance,
      transactionId: transaction.id
    });
  } catch (error) {
    console.error("Error redeeming points:", error);
    res.status(500).json({ error: "Failed to redeem points" });
  }
});

router.get("/points/history/:customerId", async (req, res) => {
  try {
    const { customerId } = req.params;
    const limit = parseInt(req.query.limit as string) || 50;
    
    const transactions = await db.select()
      .from(loyaltyPointsTransactions)
      .where(eq(loyaltyPointsTransactions.customerId, customerId))
      .orderBy(desc(loyaltyPointsTransactions.createdAt))
      .limit(limit);
    
    const [customer] = await db.select()
      .from(customers)
      .where(eq(customers.id, customerId))
      .limit(1);
    
    res.json({
      currentBalance: customer?.loyaltyPoints || 0,
      transactions
    });
  } catch (error) {
    console.error("Error fetching points history:", error);
    res.status(500).json({ error: "Failed to fetch points history" });
  }
});

router.get("/egift/packages", async (req, res) => {
  try {
    const packages = await db.select().from(eGiftPackages).where(eq(eGiftPackages.isActive, true));
    
    if (packages.length === 0) {
      return res.json({ packages: EGIFT_PACKAGES });
    }
    
    res.json({ packages });
  } catch (error) {
    console.error("Error fetching e-gift packages:", error);
    res.status(500).json({ error: "Failed to fetch e-gift packages" });
  }
});

router.post("/egift/packages/seed", async (req, res) => {
  try {
    await db.delete(eGiftPackages);
    
    const packages = EGIFT_PACKAGES.map(pkg => ({
      packageName: pkg.name,
      packageTier: pkg.code.toLowerCase(),
      description: pkg.description,
      amount: String(pkg.valueAmount),
      currency: "USD",
      bonusPercentage: String(pkg.bonusPercentage),
      validityDays: pkg.validityDays,
      isTransferable: false,
      maxRedemptions: 1,
      themeColor: pkg.themeColor,
      isActive: true
    }));
    
    for (const pkg of packages) {
      await db.insert(eGiftPackages).values(pkg);
    }
    
    res.json({ success: true, message: "E-Gift packages seeded: Gold Treat, Platinum Delight, Diamond Experience" });
  } catch (error) {
    console.error("Error seeding e-gift packages:", error);
    res.status(500).json({ error: "Failed to seed e-gift packages" });
  }
});

router.post("/egift/purchase", async (req, res) => {
  try {
    const { 
      packageId, purchaserCustomerId, recipientEmail, recipientName, 
      recipientPhone, personalMessage 
    } = req.body;
    
    if (!packageId || !purchaserCustomerId || !recipientEmail || !recipientName) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    const [pkg] = await db.select()
      .from(eGiftPackages)
      .where(eq(eGiftPackages.id, packageId))
      .limit(1);
    
    if (!pkg) {
      return res.status(404).json({ error: "Package not found" });
    }
    
    const amount = parseFloat(pkg.amount);
    const bonusPercent = parseFloat(pkg.bonusPercentage || "0");
    const bonusAmount = amount * (bonusPercent / 100);
    const totalValue = amount + bonusAmount;
    
    const giftCode = `EG-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + pkg.validityDays);
    
    const [purchase] = await db.insert(eGiftPurchases).values({
      packageId,
      purchaserCustomerId,
      recipientEmail,
      recipientName,
      recipientPhone,
      giftCode,
      personalMessage,
      amount: String(amount),
      bonusAmount: String(bonusAmount),
      totalValue: String(totalValue),
      currency: pkg.currency,
      expiryDate,
      status: "purchased"
    }).returning();
    
    res.json({
      success: true,
      purchase: {
        id: purchase.id,
        giftCode,
        amount,
        bonusAmount,
        totalValue,
        expiryDate,
        recipientName,
        isTransferable: false
      }
    });
  } catch (error) {
    console.error("Error purchasing e-gift:", error);
    res.status(500).json({ error: "Failed to purchase e-gift" });
  }
});

router.post("/egift/redeem", async (req, res) => {
  try {
    const { giftCode, customerId, essenceUnitId } = req.body;
    
    if (!giftCode || !customerId) {
      return res.status(400).json({ error: "giftCode and customerId required" });
    }
    
    const [purchase] = await db.select()
      .from(eGiftPurchases)
      .where(eq(eGiftPurchases.giftCode, giftCode))
      .limit(1);
    
    if (!purchase) {
      return res.status(404).json({ error: "E-Gift not found" });
    }
    
    if (purchase.status === "redeemed") {
      return res.status(400).json({ error: "E-Gift already redeemed", redeemable: false });
    }
    
    if (purchase.status === "expired" || new Date(purchase.expiryDate) < new Date()) {
      return res.status(400).json({ error: "E-Gift has expired", redeemable: false });
    }
    
    await db.update(eGiftPurchases)
      .set({
        status: "redeemed",
        redeemedAt: new Date(),
        redeemedByCustomerId: customerId,
        redemptionEssenceUnitId: essenceUnitId
      })
      .where(eq(eGiftPurchases.id, purchase.id));
    
    res.json({
      success: true,
      redeemed: {
        value: parseFloat(purchase.totalValue),
        currency: purchase.currency,
        packageId: purchase.packageId
      }
    });
  } catch (error) {
    console.error("Error redeeming e-gift:", error);
    res.status(500).json({ error: "Failed to redeem e-gift" });
  }
});

router.post("/egift/transfer-attempt", async (req, res) => {
  const result = validateEGiftTransferAttempt({} as EGift);
  
  try {
    const { giftCode } = req.body;
    
    if (giftCode) {
      await db.update(eGiftPurchases)
        .set({
          isTransferAttempted: true,
          transferBlockedAt: new Date()
        })
        .where(eq(eGiftPurchases.giftCode, giftCode));
    }
    
    res.status(403).json({
      blocked: true,
      reason: result.reason,
      message: "E-Gifts are non-transferable. This attempt has been logged."
    });
  } catch (error) {
    res.status(403).json({
      blocked: true,
      reason: "EGIFT_NON_TRANSFERABLE"
    });
  }
});

router.get("/vip/inbox/:customerId", async (req, res) => {
  try {
    const { customerId } = req.params;
    const unreadOnly = req.query.unread === "true";
    
    let query = db.select()
      .from(vipInboxMessages)
      .where(eq(vipInboxMessages.customerId, customerId))
      .orderBy(desc(vipInboxMessages.createdAt));
    
    const messages = await query.limit(50);
    
    const filtered = unreadOnly 
      ? messages.filter(m => !m.isRead)
      : messages;
    
    res.json({
      messages: filtered,
      unreadCount: messages.filter(m => !m.isRead).length
    });
  } catch (error) {
    console.error("Error fetching VIP inbox:", error);
    res.status(500).json({ error: "Failed to fetch VIP inbox" });
  }
});

router.post("/vip/inbox/send", async (req, res) => {
  try {
    const { customerId, messageType, subject, body, actionUrl, actionLabel, priority } = req.body;
    
    if (!customerId || !subject || !body) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    const [message] = await db.insert(vipInboxMessages).values({
      customerId,
      messageType: messageType || "system",
      subject,
      body,
      actionUrl,
      actionLabel,
      priority: priority || "normal",
      isRead: false,
      isPinned: false
    }).returning();
    
    res.json({ success: true, message });
  } catch (error) {
    console.error("Error sending VIP message:", error);
    res.status(500).json({ error: "Failed to send VIP message" });
  }
});

router.patch("/vip/inbox/:messageId/read", async (req, res) => {
  try {
    const { messageId } = req.params;
    
    await db.update(vipInboxMessages)
      .set({ isRead: true, readAt: new Date() })
      .where(eq(vipInboxMessages.id, messageId));
    
    res.json({ success: true });
  } catch (error) {
    console.error("Error marking message as read:", error);
    res.status(500).json({ error: "Failed to mark message as read" });
  }
});

router.get("/customer/:customerId/status", async (req, res) => {
  try {
    const { customerId } = req.params;
    
    const [customer] = await db.select()
      .from(customers)
      .where(eq(customers.id, customerId))
      .limit(1);
    
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    
    const [tier] = customer.loyaltyTierId
      ? await db.select().from(loyaltyTiers).where(eq(loyaltyTiers.id, customer.loyaltyTierId)).limit(1)
      : [];
    
    const currentTier = determineLoyaltyTier(customer.loyaltyPoints || 0);
    const nextTierThreshold = LOYALTY_TIER_THRESHOLDS[
      currentTier === "DIAMOND" ? "DIAMOND" : 
      currentTier === "PLATINUM" ? "DIAMOND" :
      currentTier === "GOLD" ? "PLATINUM" : "GOLD"
    ];
    
    const pointsToNextTier = Math.max(0, nextTierThreshold - (customer.loyaltyPoints || 0));
    
    res.json({
      customerId,
      name: customer.fullName,
      email: customer.email,
      currentPoints: customer.loyaltyPoints || 0,
      tier: {
        code: tier?.tierCode || "standard",
        name: tier?.name || "Standard",
        multiplier: parseFloat(tier?.pointsMultiplier || "1.0"),
        color: tier?.accentColor
      },
      nextTier: currentTier !== "DIAMOND" ? {
        pointsRequired: nextTierThreshold,
        pointsNeeded: pointsToNextTier
      } : null,
      perks: {
        hasVipInbox: tier?.hasVipInboxAccess || false,
        hasEarlyFlavors: tier?.hasEarlyFlavorAccess || false,
        hasAirportPerks: tier?.hasAirportPerks || false,
        freeCupsRemaining: tier?.freeCupsPerYear || 0,
        freeToppingsRemaining: tier?.freeToppingUpgrades || 0
      }
    });
  } catch (error) {
    console.error("Error fetching customer status:", error);
    res.status(500).json({ error: "Failed to fetch customer status" });
  }
});

export default router;
