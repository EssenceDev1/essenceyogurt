import { Router, Request, Response } from "express";
import { authService } from "../services/auth-service";
import { storage } from "../storage";
import crypto from "crypto";

const router = Router();

// In-memory stores for magic links and QR sessions
const magicTokens = new Map<string, { userId: string; email: string; expiresAt: number }>();
const qrSessions = new Map<string, { id: string; createdAt: number; userId?: string; status: "pending" | "approved"; token?: string }>();

// UX event logging endpoint for Gemini monitoring
router.post("/ux/event", async (req: Request, res: Response) => {
  try {
    const { event, userId, device } = req.body;
    console.log(`[UX-LOG] ${event?.path} ${event?.method} ${event?.status} ${event?.durationMs}ms`, {
      userId,
      device: device?.agent?.slice(0, 50),
      extra: event?.extra
    });
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to log UX event" });
  }
});

// Magic Link - Start (send email)
router.post("/magic/start", async (req: Request, res: Response) => {
  try {
    const { email, device } = req.body;
    
    if (!email || typeof email !== "string") {
      return res.status(400).json({ error: "Email is required" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    
    // Find or create customer
    const customers = await storage.getAllCustomers();
    let customer = customers.find((c: any) => c.email === normalizedEmail);
    
    if (!customer) {
      customer = await storage.createCustomer({
        email: normalizedEmail,
        fullName: normalizedEmail.split("@")[0]
      });
    }

    // Generate magic token
    const tokenId = "m-" + crypto.randomBytes(16).toString("hex");
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes

    magicTokens.set(tokenId, {
      userId: customer.id,
      email: normalizedEmail,
      expiresAt
    });

    // In production, send email via Gmail API or SendGrid
    // For now, log the token
    console.log(`[MAGIC-LINK] Send to ${normalizedEmail}: ${tokenId}`);
    console.log(`[MAGIC-LINK] URL: ${process.env.AUTH_WEBAPP_URL || "https://essenceyogurt.com"}/auth/verify?token=${tokenId}`);

    res.json({ ok: true, message: "Magic link sent to your email" });
  } catch (error) {
    console.error("Magic link start error:", error);
    res.status(500).json({ error: "Failed to send magic link" });
  }
});

// Magic Link - Verify
router.post("/magic/verify", async (req: Request, res: Response) => {
  try {
    const { token, device } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: "Token is required" });
    }

    const record = magicTokens.get(token);
    
    if (!record) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }
    
    if (record.expiresAt < Date.now()) {
      magicTokens.delete(token);
      return res.status(400).json({ error: "Token has expired" });
    }

    magicTokens.delete(token);

    // Get user info
    const customers = await storage.getAllCustomers();
    const customer = customers.find((c: any) => c.id === record.userId);

    if (!customer) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate auth token
    const authToken = generateAuthToken(customer.id);

    res.json({
      token: authToken,
      user: {
        id: customer.id,
        email: customer.email,
        tier: customer.loyaltyTierId || "Gold",
        points: customer.loyaltyPoints || 0
      },
      riskScore: 0
    });
  } catch (error) {
    console.error("Magic link verify error:", error);
    res.status(500).json({ error: "Failed to verify magic link" });
  }
});

// Phone/SMS - Start
router.post("/phone/start", async (req: Request, res: Response) => {
  try {
    const { phone, device } = req.body;
    
    if (!phone || typeof phone !== "string") {
      return res.status(400).json({ error: "Phone number is required" });
    }

    const result = await authService.initiateOTP({
      phone: phone.trim(),
      channel: "sms"
    });

    res.json({
      sessionId: result.verificationId,
      message: result.message
    });
  } catch (error) {
    console.error("Phone start error:", error);
    res.status(500).json({ error: "Failed to send SMS code" });
  }
});

// Phone/SMS - Verify
router.post("/phone/verify", async (req: Request, res: Response) => {
  try {
    const { sessionId, code, device } = req.body;
    
    if (!sessionId || !code) {
      return res.status(400).json({ error: "Session ID and code are required" });
    }

    const result = await authService.verifyOTP(sessionId, code);

    if (!result.success) {
      return res.status(400).json({ error: result.message });
    }

    // Get customer info
    const customers = await storage.getAllCustomers();
    const customer = customers.find((c: any) => c.id === result.customerId);

    res.json({
      token: result.token,
      user: {
        id: result.customerId,
        phone: customer?.phoneNumber,
        tier: customer?.loyaltyTierId || "Gold",
        points: customer?.loyaltyPoints || 0
      },
      riskScore: 0
    });
  } catch (error) {
    console.error("Phone verify error:", error);
    res.status(500).json({ error: "Failed to verify SMS code" });
  }
});

// Passkey - Register Options
router.post("/passkey/register-options", async (req: Request, res: Response) => {
  try {
    const { email, device } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Find or create user
    const customers = await storage.getAllCustomers();
    let customer = customers.find((c: any) => c.email === email.toLowerCase());
    
    if (!customer) {
      customer = await storage.createCustomer({
        email: email.toLowerCase(),
        fullName: email.split("@")[0]
      });
    }

    const challenge = await authService.initiatePasskeyRegistration(customer.id);

    res.json({
      rpName: "Essence Yogurt",
      rpId: "essenceyogurt.com",
      challenge: challenge.challenge,
      challengeId: challenge.challengeId,
      user: {
        id: customer.id,
        name: customer.email,
        displayName: customer.fullName || customer.email
      },
      pubKeyCredParams: [
        { type: "public-key", alg: -7 },  // ES256
        { type: "public-key", alg: -257 } // RS256
      ],
      timeout: 300000,
      authenticatorSelection: {
        authenticatorAttachment: "platform",
        residentKey: "preferred",
        userVerification: "preferred"
      }
    });
  } catch (error) {
    console.error("Passkey register options error:", error);
    res.status(500).json({ error: "Failed to generate passkey options" });
  }
});

// Passkey - Register Verify
router.post("/passkey/register-verify", async (req: Request, res: Response) => {
  try {
    const { email, credential, challengeId, device } = req.body;
    
    if (!email || !credential) {
      return res.status(400).json({ error: "Email and credential are required" });
    }

    // In production, verify the credential with WebAuthn library
    const result = await authService.completePasskeyRegistration(
      challengeId,
      credential.id || "credential-id",
      credential.publicKey || "public-key",
      credential.attestation || "attestation"
    );

    if (!result.success) {
      return res.status(400).json({ error: result.message });
    }

    // Get customer and generate token
    const customers = await storage.getAllCustomers();
    const customer = customers.find((c: any) => c.email === email.toLowerCase());
    const token = generateAuthToken(customer?.id || "unknown");

    res.json({
      token,
      user: {
        id: customer?.id,
        email: customer?.email,
        tier: customer?.loyaltyTierId || "Gold",
        points: customer?.loyaltyPoints || 0
      },
      riskScore: 0
    });
  } catch (error) {
    console.error("Passkey register verify error:", error);
    res.status(500).json({ error: "Failed to verify passkey registration" });
  }
});

// Passkey - Login Options
router.post("/passkey/login-options", async (req: Request, res: Response) => {
  try {
    const { device } = req.body;

    const challenge = await authService.initiatePasskeyAuthentication();

    res.json({
      challenge: challenge.challenge,
      challengeId: challenge.challengeId,
      rpId: "essenceyogurt.com",
      timeout: 300000,
      userVerification: "preferred"
    });
  } catch (error) {
    console.error("Passkey login options error:", error);
    res.status(500).json({ error: "Failed to generate login options" });
  }
});

// Passkey - Login Verify
router.post("/passkey/login-verify", async (req: Request, res: Response) => {
  try {
    const { assertion, challengeId, device } = req.body;

    if (!assertion) {
      return res.status(400).json({ error: "Assertion is required" });
    }

    // In production, verify the assertion with WebAuthn library
    const result = await authService.verifyPasskey(
      challengeId,
      assertion.id || "credential-id",
      assertion.authenticatorData || "auth-data",
      assertion.signature || "signature"
    );

    if (!result.success) {
      return res.status(400).json({ error: result.message });
    }

    // Get customer info
    const customers = await storage.getAllCustomers();
    const customer = customers.find((c: any) => c.id === result.customerId);

    res.json({
      token: result.token,
      user: {
        id: result.customerId,
        email: customer?.email,
        tier: customer?.loyaltyTierId || "Gold",
        points: customer?.loyaltyPoints || 0
      },
      riskScore: 0
    });
  } catch (error) {
    console.error("Passkey login verify error:", error);
    res.status(500).json({ error: "Failed to verify passkey login" });
  }
});

// QR Code - Start Session
router.post("/qr/start", async (req: Request, res: Response) => {
  try {
    const { device } = req.body;

    const sessionId = "qr-" + crypto.randomBytes(16).toString("hex");
    
    qrSessions.set(sessionId, {
      id: sessionId,
      createdAt: Date.now(),
      status: "pending"
    });

    // Clean up old sessions (older than 10 minutes)
    const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
    const sessionsToDelete: string[] = [];
    qrSessions.forEach((session, id) => {
      if (session.createdAt < tenMinutesAgo) {
        sessionsToDelete.push(id);
      }
    });
    sessionsToDelete.forEach(id => qrSessions.delete(id));

    res.json({
      id: sessionId,
      status: "pending",
      qrUrl: `essenceyogurt://auth/qr?session=${sessionId}`
    });
  } catch (error) {
    console.error("QR start error:", error);
    res.status(500).json({ error: "Failed to start QR session" });
  }
});

// QR Code - Check Status
router.get("/qr/status", async (req: Request, res: Response) => {
  try {
    const { id } = req.query;

    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Session ID is required" });
    }

    const session = qrSessions.get(id);

    if (!session) {
      return res.status(404).json({ error: "Session not found or expired" });
    }

    // Check if session is too old (10 minutes)
    if (Date.now() - session.createdAt > 10 * 60 * 1000) {
      qrSessions.delete(id);
      return res.status(400).json({ error: "Session expired" });
    }

    // Only return token if session is approved (prevents token leakage)
    if (session.status === "approved" && session.token) {
      res.json({
        id: session.id,
        status: session.status,
        token: session.token
      });
    } else {
      // Don't expose token for pending sessions
      res.json({
        id: session.id,
        status: session.status
      });
    }
  } catch (error) {
    console.error("QR status error:", error);
    res.status(500).json({ error: "Failed to check QR status" });
  }
});

// QR Code - Approve (called from mobile app)
router.post("/qr/approve", async (req: Request, res: Response) => {
  try {
    const { sessionId, userId } = req.body;

    if (!sessionId || !userId) {
      return res.status(400).json({ error: "Session ID and user ID are required" });
    }

    const session = qrSessions.get(sessionId);

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    // Generate token for the approved session
    const token = generateAuthToken(userId);

    session.status = "approved";
    session.userId = userId;
    session.token = token;

    res.json({ ok: true, message: "QR login approved" });
  } catch (error) {
    console.error("QR approve error:", error);
    res.status(500).json({ error: "Failed to approve QR login" });
  }
});

// Social Login - Google Start (for demo/testing, uses mock flow)
router.get("/social/google/start", async (req: Request, res: Response) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  
  if (clientId) {
    // Real OAuth flow
    const redirectUri = `${process.env.AUTH_WEBAPP_URL || ""}/auth/social/google/callback`;
    const scope = encodeURIComponent("openid email profile");
    const state = crypto.randomBytes(16).toString("hex");
    
    const url = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `scope=${scope}&` +
      `state=${state}`;

    return res.redirect(url);
  }
  
  // Demo mode: create mock user and redirect with token
  try {
    const result = await authService.processGoogleOAuth("demo-token");
    if (result.success && result.token) {
      // Redirect to frontend with token in URL
      return res.redirect(`/?auth_token=${result.token}&auth_method=google`);
    }
  } catch (error) {
    console.error("Google demo login error:", error);
  }
  
  res.redirect("/?auth_error=google_login_failed");
});

// Google OAuth callback (GET - for OAuth redirect)
router.get("/social/google/callback", async (req: Request, res: Response) => {
  try {
    const { code, error: oauthError } = req.query;
    
    if (oauthError) {
      return res.redirect(`/?auth_error=${oauthError}`);
    }
    
    if (!code || typeof code !== "string") {
      return res.redirect("/?auth_error=missing_code");
    }

    // In production, exchange code for tokens with Google
    const result = await authService.processGoogleOAuth(code);

    if (!result.success) {
      return res.redirect(`/?auth_error=${encodeURIComponent(result.message)}`);
    }

    // Redirect to frontend with token
    res.redirect(`/?auth_token=${result.token}&auth_method=google`);
  } catch (error) {
    console.error("Google callback error:", error);
    res.redirect("/?auth_error=callback_failed");
  }
});

// Social Login - Google Callback
router.post("/social/google/callback", async (req: Request, res: Response) => {
  try {
    const { code, device } = req.body;

    // In production, exchange code for tokens with Google
    // For now, mock the response
    const result = await authService.processGoogleOAuth(code || "mock-token");

    if (!result.success) {
      return res.status(400).json({ error: result.message });
    }

    const customers = await storage.getAllCustomers();
    const customer = customers.find((c: any) => c.id === result.customerId);

    res.json({
      token: result.token,
      user: {
        id: result.customerId,
        email: customer?.email,
        tier: customer?.loyaltyTierId || "Gold",
        points: customer?.loyaltyPoints || 0
      },
      riskScore: 0
    });
  } catch (error) {
    console.error("Google callback error:", error);
    res.status(500).json({ error: "Failed to complete Google login" });
  }
});

// Validate Token
router.post("/validate", (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ valid: false, error: "Token is required" });
    }

    const result = authService.validateToken(token);
    res.json(result);
  } catch (error) {
    res.status(500).json({ valid: false, error: "Failed to validate token" });
  }
});

// Helper function to generate auth token
function generateAuthToken(userId: string): string {
  const payload = {
    sub: userId,
    type: "customer",
    iat: Date.now(),
    exp: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
  };
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

export default router;
