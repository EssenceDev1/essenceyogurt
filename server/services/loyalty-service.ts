import { storage } from "../storage";

export interface LoyaltyTierInfo {
  tier: "STANDARD" | "GOLD" | "DIAMOND";
  displayName: string;
  pointsRequired: number;
  benefits: string[];
  color: string;
}

export const LOYALTY_TIERS: LoyaltyTierInfo[] = [
  {
    tier: "STANDARD",
    displayName: "Essence Circle",
    pointsRequired: 0,
    benefits: [
      "1 point per $1 spent",
      "Birthday treat",
      "Early access to new flavors"
    ],
    color: "#C0C0C0"
  },
  {
    tier: "GOLD",
    displayName: "Essence Gold",
    pointsRequired: 1500,
    benefits: [
      "1.5 points per $1 spent",
      "Free topping on every visit",
      "Priority access to events",
      "Exclusive Gold member offers",
      "Monthly surprise treats"
    ],
    color: "#D4AF37"
  },
  {
    tier: "DIAMOND",
    displayName: "Essence Diamond",
    pointsRequired: 5000,
    benefits: [
      "2 points per $1 spent",
      "Free premium topping every visit",
      "VIP event invitations",
      "Concierge service",
      "Annual diamond gift box",
      "Personal account manager",
      "Exclusive diamond-only flavors"
    ],
    color: "#B9F2FF"
  }
];

export class LoyaltyService {
  async addPoints(
    customerId: string,
    points: number,
    source: string,
    transactionId?: string
  ): Promise<{ newBalance: number; tierChanged: boolean; newTier?: string }> {
    const customer = await storage.getCustomerById(customerId);
    if (!customer) {
      throw new Error("Customer not found");
    }

    const currentPoints = customer.loyaltyPoints || 0;
    const newBalance = currentPoints + points;

    const currentTier = this.getTierForPoints(currentPoints);
    const newTier = this.getTierForPoints(newBalance);
    const tierChanged = currentTier.tier !== newTier.tier;

    await storage.createMemberActivityLog({
      customerId,
      activityType: "points_earned",
      description: `Earned ${points} points from ${source}`,
      pointsEarned: points,
      metadata: JSON.stringify({ source, newBalance })
    });

    if (tierChanged) {
      await this.sendTierUpgradeMessage(customerId, newTier);
    }

    return {
      newBalance,
      tierChanged,
      newTier: tierChanged ? newTier.displayName : undefined
    };
  }

  async redeemPoints(
    customerId: string,
    pointsToRedeem: number,
    rewardDescription: string
  ): Promise<{ success: boolean; newBalance: number; message: string }> {
    const customer = await storage.getCustomerById(customerId);
    if (!customer) {
      return { success: false, newBalance: 0, message: "Customer not found" };
    }

    const currentPoints = customer.loyaltyPoints || 0;
    if (currentPoints < pointsToRedeem) {
      return {
        success: false,
        newBalance: currentPoints,
        message: `Insufficient points. You have ${currentPoints} points.`
      };
    }

    const newBalance = currentPoints - pointsToRedeem;

    await storage.createMemberActivityLog({
      customerId,
      activityType: "points_redeemed",
      description: rewardDescription,
      pointsRedeemed: pointsToRedeem,
      metadata: JSON.stringify({ reward: rewardDescription, newBalance })
    });

    return {
      success: true,
      newBalance,
      message: `Redeemed ${pointsToRedeem} points for ${rewardDescription}`
    };
  }

  async sendVipMessage(
    customerId: string,
    subject: string,
    body: string,
    category: string = "general",
    expiresAt?: Date
  ): Promise<boolean> {
    try {
      await storage.createVipInboxMessage({
        customerId,
        subject,
        body,
        messageType: category as any,
        priority: "normal",
        expiresAt: expiresAt || null,
        isRead: false
      });
      return true;
    } catch {
      return false;
    }
  }

  async getCustomerLoyaltyStatus(customerId: string): Promise<{
    tier: LoyaltyTierInfo;
    points: number;
    pointsToNextTier: number;
    unreadMessages: number;
    recentActivity: any[];
  } | null> {
    const customer = await storage.getCustomerById(customerId);
    if (!customer) return null;

    const points = customer.loyaltyPoints || 0;
    const tier = this.getTierForPoints(points);
    const nextTier = this.getNextTier(tier.tier);
    const pointsToNextTier = nextTier ? nextTier.pointsRequired - points : 0;

    const unreadMessages = await storage.getUnreadVipMessages(customerId);

    return {
      tier,
      points,
      pointsToNextTier,
      unreadMessages: unreadMessages.length,
      recentActivity: []
    };
  }

  private getTierForPoints(points: number): LoyaltyTierInfo {
    if (points >= 5000) return LOYALTY_TIERS[2];
    if (points >= 1500) return LOYALTY_TIERS[1];
    return LOYALTY_TIERS[0];
  }

  private getNextTier(currentTier: string): LoyaltyTierInfo | null {
    if (currentTier === "STANDARD") return LOYALTY_TIERS[1];
    if (currentTier === "GOLD") return LOYALTY_TIERS[2];
    return null;
  }

  private async sendTierUpgradeMessage(customerId: string, newTier: LoyaltyTierInfo): Promise<void> {
    await this.sendVipMessage(
      customerId,
      `Welcome to ${newTier.displayName}!`,
      `Congratulations! You've been upgraded to ${newTier.displayName}. Enjoy your new benefits:\n\n${newTier.benefits.map(b => `• ${b}`).join('\n')}`,
      "promotion"
    );
  }
}

export const loyaltyService = new LoyaltyService();
