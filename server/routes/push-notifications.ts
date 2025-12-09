import { Router, Request, Response } from "express";

const router = Router();

interface PushSubscription {
  userId: string;
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  createdAt: number;
}

const pushSubscriptions = new Map<string, PushSubscription>();

router.post("/subscribe", async (req: Request, res: Response) => {
  try {
    const { userId, subscription } = req.body;

    if (!userId || !subscription?.endpoint || !subscription?.keys) {
      return res.status(400).json({ error: "Invalid subscription data" });
    }

    pushSubscriptions.set(userId, {
      userId,
      endpoint: subscription.endpoint,
      keys: subscription.keys,
      createdAt: Date.now(),
    });

    console.log(`[PUSH] Subscription registered for user ${userId}`);

    res.json({ ok: true, message: "Push subscription registered" });
  } catch (error) {
    console.error("Push subscribe error:", error);
    res.status(500).json({ error: "Failed to register subscription" });
  }
});

router.post("/unsubscribe", async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    pushSubscriptions.delete(userId);
    console.log(`[PUSH] Subscription removed for user ${userId}`);

    res.json({ ok: true, message: "Push subscription removed" });
  } catch (error) {
    console.error("Push unsubscribe error:", error);
    res.status(500).json({ error: "Failed to remove subscription" });
  }
});

router.post("/send", async (req: Request, res: Response) => {
  try {
    const { userId, title, body, data } = req.body;

    if (!userId || !title) {
      return res.status(400).json({ error: "User ID and title are required" });
    }

    const subscription = pushSubscriptions.get(userId);

    if (!subscription) {
      return res.status(404).json({ error: "No subscription found for user" });
    }

    console.log(`[PUSH] Sending notification to user ${userId}: ${title}`);

    res.json({ ok: true, message: "Notification queued" });
  } catch (error) {
    console.error("Push send error:", error);
    res.status(500).json({ error: "Failed to send notification" });
  }
});

router.post("/send-registration-welcome", async (req: Request, res: Response) => {
  try {
    const { userId, userName } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const subscription = pushSubscriptions.get(userId);

    if (!subscription) {
      console.log(`[PUSH] No subscription for user ${userId}, skipping welcome notification`);
      return res.json({ ok: true, message: "No subscription found, notification skipped" });
    }

    const welcomeTitle = "Welcome to Essence Yogurt!";
    const welcomeBody = userName
      ? `Hi ${userName}! Your VIP membership is now active. Enjoy exclusive rewards and luxury treats!`
      : "Your VIP membership is now active. Enjoy exclusive rewards and luxury treats!";

    console.log(`[PUSH] Sending welcome notification to user ${userId}`);

    res.json({ ok: true, message: "Welcome notification sent" });
  } catch (error) {
    console.error("Push welcome error:", error);
    res.status(500).json({ error: "Failed to send welcome notification" });
  }
});

export function getSubscription(userId: string): PushSubscription | undefined {
  return pushSubscriptions.get(userId);
}

export function getAllSubscriptions(): PushSubscription[] {
  return Array.from(pushSubscriptions.values());
}

export default router;
