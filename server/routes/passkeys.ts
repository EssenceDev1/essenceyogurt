import { Router } from "express";
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
  VerifiedRegistrationResponse,
  VerifiedAuthenticationResponse,
} from "@simplewebauthn/server";
import type {
  AuthenticatorTransportFuture,
  CredentialDeviceType,
} from "@simplewebauthn/types";
import { storage } from "../storage";

const router = Router();

const rpName = "Essence Yogurt";
const rpID = process.env.REPLIT_DEV_DOMAIN || "localhost";
const origin = process.env.REPLIT_DEV_DOMAIN 
  ? `https://${process.env.REPLIT_DEV_DOMAIN}`
  : "http://localhost:5000";

const challengeStore = new Map<string, string>();

router.post("/register/options", async (req, res) => {
  try {
    const { userId, userName, displayName } = req.body;

    if (!userId || !userName) {
      return res.status(400).json({ error: "User ID and username are required" });
    }

    const existingCredentials = await storage.getPasskeysByUserId(userId);

    const options = await generateRegistrationOptions({
      rpName,
      rpID,
      userID: Buffer.from(userId),
      userName,
      userDisplayName: displayName || userName,
      attestationType: "none",
      authenticatorSelection: {
        residentKey: "preferred",
        userVerification: "preferred",
        authenticatorAttachment: "platform",
      },
      excludeCredentials: existingCredentials.map((cred) => ({
        id: cred.credentialId,
        transports: (cred.transports as AuthenticatorTransportFuture[]) || [],
      })),
    });

    challengeStore.set(userId, options.challenge);

    res.json(options);
  } catch (error) {
    console.error("Passkey registration options error:", error);
    res.status(500).json({ error: "Failed to generate registration options" });
  }
});

router.post("/register/verify", async (req, res) => {
  try {
    const { userId, credential } = req.body;

    if (!userId || !credential) {
      return res.status(400).json({ error: "User ID and credential are required" });
    }

    const expectedChallenge = challengeStore.get(userId);
    if (!expectedChallenge) {
      return res.status(400).json({ error: "Challenge expired or not found" });
    }

    let verification: VerifiedRegistrationResponse;
    try {
      verification = await verifyRegistrationResponse({
        response: credential,
        expectedChallenge,
        expectedOrigin: origin,
        expectedRPID: rpID,
      });
    } catch (error: any) {
      console.error("Verification error:", error);
      return res.status(400).json({ error: error.message || "Verification failed" });
    }

    const { verified, registrationInfo } = verification;

    if (!verified || !registrationInfo) {
      return res.status(400).json({ error: "Registration verification failed" });
    }

    const {
      credential: credentialData,
      credentialDeviceType,
      credentialBackedUp,
    } = registrationInfo;

    await storage.createPasskeyCredential({
      userId,
      credentialId: credentialData.id,
      credentialPublicKey: Buffer.from(credentialData.publicKey).toString("base64"),
      counter: credentialData.counter,
      credentialDeviceType,
      credentialBackedUp,
      transports: credential.response.transports || [],
      name: credentialDeviceType === "singleDevice" ? "This Device" : "Passkey",
    });

    challengeStore.delete(userId);

    res.json({
      verified: true,
      credentialId: credentialData.id,
      deviceType: credentialDeviceType,
      credentialName: credentialDeviceType === "singleDevice" ? "This Device" : "Passkey",
    });
  } catch (error) {
    console.error("Passkey registration verify error:", error);
    res.status(500).json({ error: "Failed to verify registration" });
  }
});

router.post("/authenticate/options", async (req, res) => {
  try {
    const { userId } = req.body;

    let allowCredentials: { id: string; transports?: AuthenticatorTransportFuture[] }[] = [];

    if (userId) {
      const credentials = await storage.getPasskeysByUserId(userId);
      allowCredentials = credentials.map((cred) => ({
        id: cred.credentialId,
        transports: (cred.transports as AuthenticatorTransportFuture[]) || [],
      }));
    }

    const options = await generateAuthenticationOptions({
      rpID,
      userVerification: "preferred",
      allowCredentials: allowCredentials.length > 0 ? allowCredentials : undefined,
    });

    const sessionId = userId || `session_${Date.now()}`;
    challengeStore.set(sessionId, options.challenge);

    res.json({ ...options, sessionId });
  } catch (error) {
    console.error("Passkey authentication options error:", error);
    res.status(500).json({ error: "Failed to generate authentication options" });
  }
});

router.post("/authenticate/verify", async (req, res) => {
  try {
    const { credential, sessionId } = req.body;

    if (!credential) {
      return res.status(400).json({ error: "Credential is required" });
    }

    const storedCredential = await storage.getPasskeyByCredentialId(credential.id);
    if (!storedCredential) {
      return res.status(400).json({ error: "Credential not found" });
    }

    const expectedChallenge = challengeStore.get(sessionId || storedCredential.userId);
    if (!expectedChallenge) {
      return res.status(400).json({ error: "Challenge expired or not found" });
    }

    let verification: VerifiedAuthenticationResponse;
    try {
      const publicKeyBuffer = new Uint8Array(Buffer.from(storedCredential.credentialPublicKey, "base64"));
      
      verification = await verifyAuthenticationResponse({
        response: credential,
        expectedChallenge,
        expectedOrigin: origin,
        expectedRPID: rpID,
        credential: {
          id: storedCredential.credentialId,
          publicKey: publicKeyBuffer,
          counter: storedCredential.counter,
          transports: (storedCredential.transports as AuthenticatorTransportFuture[]) || [],
        },
      });
    } catch (error: any) {
      console.error("Authentication verification error:", error);
      return res.status(400).json({ error: error.message || "Verification failed" });
    }

    const { verified, authenticationInfo } = verification;

    if (!verified) {
      return res.status(400).json({ error: "Authentication verification failed" });
    }

    await storage.updatePasskeyCounter(
      storedCredential.credentialId,
      authenticationInfo.newCounter
    );

    challengeStore.delete(sessionId || storedCredential.userId);

    res.json({
      verified: true,
      userId: storedCredential.userId,
    });
  } catch (error) {
    console.error("Passkey authentication verify error:", error);
    res.status(500).json({ error: "Failed to verify authentication" });
  }
});

router.get("/list", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ error: "User ID is required" });
    }

    const credentials = await storage.getPasskeysByUserId(userId);
    
    res.json(
      credentials.map((cred) => ({
        id: cred.id,
        credentialId: cred.credentialId,
        name: cred.name,
        deviceType: cred.credentialDeviceType,
        createdAt: cred.createdAt,
        lastUsed: cred.lastUsedAt,
      }))
    );
  } catch (error) {
    console.error("List passkeys error:", error);
    res.status(500).json({ error: "Failed to list passkeys" });
  }
});

router.delete("/:credentialId", async (req, res) => {
  try {
    const { credentialId } = req.params;
    await storage.deletePasskey(credentialId);
    res.json({ success: true });
  } catch (error) {
    console.error("Delete passkey error:", error);
    res.status(500).json({ error: "Failed to delete passkey" });
  }
});

export default router;
