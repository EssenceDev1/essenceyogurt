import { Router, Request, Response } from "express";
import crypto from "crypto";
import { storage } from "../storage";
import { loyaltyChat } from "../services/ai-services";
import { db } from "../../db/index";
import { customers, loyaltyTiers } from "@shared/schema";
import { eq } from "drizzle-orm";

const router = Router();

type Currency = "USD" | "AED" | "SAR" | "EUR" | "ILS" | "AUD";
type Tier = "Classic" | "Gold" | "Diamond" | "BlackSignature";

const CHECKOUT_SECRET_KEY = process.env.CHECKOUT_SECRET_KEY || "";
const CHECKOUT_WEBHOOK_SECRET = process.env.CHECKOUT_WEBHOOK_SECRET || "";

interface ActivityLog {
  id: string;
  ts: string;
  path: string;
  method: string;
  userId?: string;
  ip?: string;
  info?: any;
}

const activityLogs = new Map<string, ActivityLog>();

function nowISO() {
  return new Date().toISOString();
}

function logActivity(entry: Omit<ActivityLog, "id" | "ts">) {
  const id =
    "act_" +
    Date.now().toString() +
    "_" +
    Math.floor(Math.random() * 999999).toString().padStart(6, "0");
  const act: ActivityLog = {
    id,
    ts: nowISO(),
    ...entry,
  };
  activityLogs.set(id, act);
  return act;
}

function resolveTier(points: number): Tier {
  if (points >= 4000) return "BlackSignature";
  if (points >= 1500) return "Diamond";
  if (points >= 500) return "Gold";
  return "Classic";
}

function addPointsForAmount(amountMinor: number): number {
  const amountFull = amountMinor / 100;
  return Math.floor(amountFull * 10);
}

async function checkoutCreatePayment(params: {
  amountMinor: number;
  currency: Currency;
  reference: string;
  customerEmail?: string;
  metadata?: Record<string, any>;
}) {
  if (!CHECKOUT_SECRET_KEY) {
    return {
      id: "mock_pay_" + params.reference,
      status: "Pending",
      _links: {
        redirect: { href: "/checkout-mock" }
      },
      mock: true,
      message: "CHECKOUT_SECRET_KEY not configured - using mock payment"
    };
  }

  const body = {
    source: { type: "card" },
    amount: params.amountMinor,
    currency: params.currency,
    reference: params.reference,
    capture: true,
    customer: params.customerEmail ? { email: params.customerEmail } : undefined,
    metadata: params.metadata || {},
  };

  const res = await fetch("https://api.checkout.com/payments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: CHECKOUT_SECRET_KEY,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Checkout payment error", text);
    throw new Error("Checkout payment failed");
  }

  return res.json();
}

function verifyCheckoutWebhookSignature(req: Request): boolean {
  if (!CHECKOUT_WEBHOOK_SECRET) return true;
  const sigHeader = req.headers["cko-signature"];
  if (!sigHeader || Array.isArray(sigHeader)) return false;

  const digest = crypto
    .createHmac("sha256", CHECKOUT_WEBHOOK_SECRET)
    .update(JSON.stringify(req.body))
    .digest("hex");

  return sigHeader === digest;
}

router.get("/me", async (req, res) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    
    if (!userId) {
      return res.status(401).json({ error: "user_id_required" });
    }

    const [customer] = await db.select()
      .from(customers)
      .where(eq(customers.id, userId))
      .limit(1);

    if (!customer) {
      return res.status(404).json({ error: "user_not_found" });
    }

    const points = Number(customer.loyaltyPoints) || 0;
    const tier = resolveTier(points);

    logActivity({
      path: "/api/me",
      method: "GET",
      userId,
    });

    return res.json({
      user: {
        id: customer.id,
        email: customer.email,
        displayName: customer.fullName,
        region: customer.country || "GLOBAL",
        points,
        tier,
        walletBalance: 0,
      }
    });
  } catch (error: any) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "failed_to_get_user" });
  }
});

router.post("/loyalty/scan", async (req, res) => {
  try {
    const { userId, shopId, points, reason } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "invalid_user" });
    }

    const pts = Number(points || 0);
    if (!pts || pts <= 0) {
      return res.status(400).json({ error: "points_required" });
    }

    const [customer] = await db.select()
      .from(customers)
      .where(eq(customers.id, userId))
      .limit(1);

    if (!customer) {
      return res.status(404).json({ error: "customer_not_found" });
    }

    const currentPoints = Number(customer.loyaltyPoints) || 0;
    const newPoints = currentPoints + pts;
    const newTier = resolveTier(newPoints);

    await db.update(customers)
      .set({ loyaltyPoints: newPoints })
      .where(eq(customers.id, userId));

    const ledgerEntry = {
      id: "ledger_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8),
      userId,
      pointsDelta: pts,
      reason: reason || "manual_scan",
      createdAt: nowISO(),
      shopId,
    };

    logActivity({
      path: "/api/loyalty/scan",
      method: "POST",
      userId,
      info: { shopId, pts },
    });

    return res.json({
      user: {
        id: userId,
        points: newPoints,
        tier: newTier,
      },
      ledgerEntry,
    });
  } catch (error: any) {
    console.error("Loyalty scan error:", error);
    res.status(500).json({ error: "failed_to_scan_loyalty" });
  }
});

router.post("/pos/scale-sale", async (req, res) => {
  try {
    const { userId, shopId, weightGrams, pricePer100g, currency, customerEmail } = req.body;

    if (!weightGrams || !pricePer100g || !currency) {
      return res.status(400).json({ error: "missing_scale_data" });
    }

    const weight = Number(weightGrams);
    const price = Number(pricePer100g);
    const amount = (weight / 100) * price;
    const amountMinor = Math.round(amount * 100);

    const reference =
      "EY-POS-" +
      currency +
      "-" +
      Date.now() +
      "-" +
      Math.floor(Math.random() * 999999).toString().padStart(6, "0");

    const payment = await checkoutCreatePayment({
      amountMinor,
      currency: currency as Currency,
      reference,
      customerEmail,
      metadata: {
        userId,
        shopId,
        ecosystem: "ESSENCE_POS",
        weightGrams: weight,
      },
    });

    const recordId = payment.id || "pay_" + reference;

    logActivity({
      path: "/api/pos/scale-sale",
      method: "POST",
      userId,
      info: { shopId, amount, currency, weightGrams: weight },
    });

    return res.json({
      checkoutPaymentId: recordId,
      status: payment.status,
      reference,
      amount,
      amountMinor,
      weightGrams: weight,
      pricePer100g: price,
      links: payment._links || {},
      mock: payment.mock || false,
    });
  } catch (e: any) {
    console.error("pos/scale-sale error", e);
    logActivity({
      path: "/api/pos/scale-sale",
      method: "POST",
      info: { error: e.message },
    });
    return res.status(500).json({ error: "failed_to_create_scale_sale" });
  }
});

router.post("/egift/purchase", async (req, res) => {
  try {
    const { userId, recipientEmail, value, currency, message } = req.body;

    if (!recipientEmail || !value || !currency) {
      return res.status(400).json({ error: "missing_egift_data" });
    }

    const amount = Number(value);
    const amountMinor = Math.round(amount * 100);
    const reference =
      "EY-EGIFT-" +
      currency +
      "-" +
      Date.now() +
      "-" +
      Math.floor(Math.random() * 999999).toString().padStart(6, "0");

    const payment = await checkoutCreatePayment({
      amountMinor,
      currency: currency as Currency,
      reference,
      customerEmail: recipientEmail,
      metadata: {
        userId,
        egift: true,
        recipientEmail,
        giftMessage: message,
      },
    });

    const recordId = payment.id || "pay_" + reference;

    logActivity({
      path: "/api/egift/purchase",
      method: "POST",
      userId,
      info: { recipientEmail, amount, currency },
    });

    return res.json({
      checkoutPaymentId: recordId,
      status: payment.status,
      reference,
      amount,
      amountMinor,
      recipientEmail,
      mock: payment.mock || false,
    });
  } catch (e: any) {
    console.error("egift/purchase error", e);
    logActivity({
      path: "/api/egift/purchase",
      method: "POST",
      info: { error: e.message },
    });
    return res.status(500).json({ error: "failed_to_create_egift_payment" });
  }
});

router.post("/payments/webhook/checkout", async (req, res) => {
  try {
    if (!verifyCheckoutWebhookSignature(req)) {
      console.warn("Invalid Checkout.com webhook signature");
      logActivity({
        path: "/api/payments/webhook/checkout",
        method: "POST",
        info: { error: "invalid_signature" },
      });
      return res.status(401).json({ error: "invalid_signature" });
    }

    const eventType = req.body.type || req.body.eventType;
    const data = req.body.data || req.body;
    const paymentId = data.id || data.payment_id;
    const amountMinor = data.amount;
    const currency = data.currency;
    const metadata = data.metadata || {};
    const userId = metadata.userId as string | undefined;
    const shopId = metadata.shopId as string | undefined;

    console.log("Checkout webhook", eventType, paymentId);

    if (eventType === "payment_approved" || eventType === "payment_captured") {
      if (userId) {
        const [customer] = await db.select()
          .from(customers)
          .where(eq(customers.id, userId))
          .limit(1);

        if (customer) {
          const pts = addPointsForAmount(amountMinor);
          const currentPoints = Number(customer.loyaltyPoints) || 0;
          const newPoints = currentPoints + pts;

          await db.update(customers)
            .set({ loyaltyPoints: newPoints })
            .where(eq(customers.id, userId));

          console.log(`Added ${pts} points to user ${userId}, new total: ${newPoints}`);
        }
      }

      if (metadata.egift && metadata.recipientEmail) {
        const egiftCode = "EY" + Math.floor(100000 + Math.random() * 900000).toString();
        console.log(`E-gift created: ${egiftCode} for ${metadata.recipientEmail}`);
      }
    }

    logActivity({
      path: "/api/payments/webhook/checkout",
      method: "POST",
      userId,
      info: { eventType, paymentId, shopId },
    });

    return res.status(200).json({ received: true });
  } catch (e: any) {
    console.error("Checkout webhook error", e);
    logActivity({
      path: "/api/payments/webhook/checkout",
      method: "POST",
      info: { error: e.message },
    });
    return res.status(200).json({ received: true });
  }
});

router.post("/essence/concierge", async (req, res) => {
  try {
    const { message, tier, userId } = req.body;

    if (!message) {
      return res.status(400).json({ error: "message_required" });
    }

    let userContext: any = { tier: tier || "Classic" };

    if (userId) {
      const [customer] = await db.select()
        .from(customers)
        .where(eq(customers.id, userId))
        .limit(1);

      if (customer) {
        const points = Number(customer.loyaltyPoints) || 0;
        userContext = {
          customerId: customer.id,
          customerName: customer.fullName,
          currentPoints: points,
          tier: resolveTier(points),
          region: customer.country || "GLOBAL",
        };
      }
    }

    const response = await loyaltyChat(message, userContext);

    logActivity({
      path: "/api/essence/concierge",
      method: "POST",
      userId,
      info: { message: message.substring(0, 100) },
    });

    return res.json({
      reply: response.message || "I'm your Essence Concierge. How can I assist you with your VIP experience today?",
      suggestions: response.suggestions || ["Check my points", "View rewards", "Find a store"],
    });
  } catch (e: any) {
    console.error("concierge error", e);
    logActivity({
      path: "/api/essence/concierge",
      method: "POST",
      info: { error: e.message },
    });
    return res.status(500).json({
      reply: "Our AI concierge is not available at the moment. Please try again shortly or ask a staff member.",
    });
  }
});

router.get("/admin/activity/summary", async (req, res) => {
  try {
    const limit = Number(req.query.limit || 50);
    const logs = Array.from(activityLogs.values())
      .sort((a, b) => (a.ts < b.ts ? 1 : -1))
      .slice(0, limit);

    const suspicious = logs.filter(l => 
      (l.path.includes("admin") && l.method === "POST") ||
      (l.info && l.info.error)
    );

    const summary = {
      totalLogs: logs.length,
      suspiciousCount: suspicious.length,
      endpoints: {} as Record<string, number>,
      errors: logs.filter(l => l.info?.error).map(l => ({
        path: l.path,
        error: l.info.error,
        ts: l.ts,
      })),
      recentActivity: logs.slice(0, 10).map(l => ({
        ts: l.ts,
        path: l.path,
        method: l.method,
        userId: l.userId || "anon",
      })),
    };

    for (const log of logs) {
      summary.endpoints[log.path] = (summary.endpoints[log.path] || 0) + 1;
    }

    return res.json({ summary, count: logs.length });
  } catch (e: any) {
    console.error("activity summary error", e);
    return res.status(500).json({ error: "failed_to_summarize_activity" });
  }
});

router.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "Essence Yogurt Global Backend 2025",
    timestamp: nowISO(),
    features: [
      "POS Scale Sale",
      "E-Gift Purchase",
      "Checkout.com Integration",
      "Loyalty Points",
      "AI Concierge",
      "Activity Monitoring",
    ],
  });
});

export default router;
