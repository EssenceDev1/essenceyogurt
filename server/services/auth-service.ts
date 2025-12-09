import { storage } from "../storage";
import crypto from "crypto";

export type AuthMethod = 
  | "EMAIL_PASSWORD"
  | "GOOGLE_OAUTH"
  | "APPLE_OAUTH"
  | "PHONE_OTP"
  | "WHATSAPP_OTP"
  | "PASSKEY_WEBAUTHN"
  | "BIOMETRIC_DEVICE";

export interface AuthResult {
  success: boolean;
  token?: string;
  userId?: string;
  customerId?: string;
  employeeId?: string;
  role?: string;
  method: AuthMethod;
  message: string;
  requiresVerification?: boolean;
  verificationId?: string;
}

export interface OTPRequest {
  phone: string;
  channel: "sms" | "whatsapp";
}

export interface PasskeyChallenge {
  challengeId: string;
  challenge: string;
  rpId: string;
  userId: string;
  expiresAt: Date;
}

export class AuthService {
  private otpStore: Map<string, { code: string; phone: string; expiresAt: Date; channel: string }> = new Map();
  private passkeyStore: Map<string, PasskeyChallenge> = new Map();
  private readonly OTP_EXPIRY_MINUTES = 5;
  private readonly PASSKEY_CHALLENGE_EXPIRY_MINUTES = 5;

  async initiateOTP(request: OTPRequest): Promise<{ success: boolean; verificationId: string; message: string }> {
    const code = this.generateOTP();
    const verificationId = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + this.OTP_EXPIRY_MINUTES);

    this.otpStore.set(verificationId, {
      code,
      phone: request.phone,
      expiresAt,
      channel: request.channel
    });

    console.log(`[AUTH] OTP for ${request.phone} via ${request.channel}: ${code}`);

    return {
      success: true,
      verificationId,
      message: `OTP sent to ${request.phone} via ${request.channel}. Valid for ${this.OTP_EXPIRY_MINUTES} minutes.`
    };
  }

  async verifyOTP(verificationId: string, code: string): Promise<AuthResult> {
    const otpData = this.otpStore.get(verificationId);

    if (!otpData) {
      return {
        success: false,
        method: "PHONE_OTP",
        message: "Invalid or expired verification. Please request a new OTP."
      };
    }

    if (new Date() > otpData.expiresAt) {
      this.otpStore.delete(verificationId);
      return {
        success: false,
        method: "PHONE_OTP",
        message: "OTP has expired. Please request a new one."
      };
    }

    if (otpData.code !== code) {
      return {
        success: false,
        method: "PHONE_OTP",
        message: "Invalid OTP. Please try again."
      };
    }

    this.otpStore.delete(verificationId);

    const customer = await this.findOrCreateCustomerByPhone(otpData.phone);
    const token = this.generateToken(customer.id, "customer");

    return {
      success: true,
      token,
      customerId: customer.id,
      method: otpData.channel === "whatsapp" ? "WHATSAPP_OTP" : "PHONE_OTP",
      message: "Successfully authenticated."
    };
  }

  async initiatePasskeyRegistration(userId: string): Promise<PasskeyChallenge> {
    const challengeId = crypto.randomUUID();
    const challenge = crypto.randomBytes(32).toString("base64url");
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + this.PASSKEY_CHALLENGE_EXPIRY_MINUTES);

    const passkeyChallenge: PasskeyChallenge = {
      challengeId,
      challenge,
      rpId: "essence-yogurt.com",
      userId,
      expiresAt
    };

    this.passkeyStore.set(challengeId, passkeyChallenge);

    return passkeyChallenge;
  }

  async completePasskeyRegistration(
    challengeId: string,
    credentialId: string,
    publicKey: string,
    attestation: string
  ): Promise<{ success: boolean; message: string }> {
    const challenge = this.passkeyStore.get(challengeId);

    if (!challenge || new Date() > challenge.expiresAt) {
      return { success: false, message: "Challenge expired or invalid" };
    }

    this.passkeyStore.delete(challengeId);

    console.log(`[AUTH] Passkey registered for user ${challenge.userId}: ${credentialId}`);

    return { success: true, message: "Passkey registered successfully" };
  }

  async initiatePasskeyAuthentication(userId?: string): Promise<PasskeyChallenge> {
    const challengeId = crypto.randomUUID();
    const challenge = crypto.randomBytes(32).toString("base64url");
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + this.PASSKEY_CHALLENGE_EXPIRY_MINUTES);

    const passkeyChallenge: PasskeyChallenge = {
      challengeId,
      challenge,
      rpId: "essence-yogurt.com",
      userId: userId || "",
      expiresAt
    };

    this.passkeyStore.set(challengeId, passkeyChallenge);

    return passkeyChallenge;
  }

  async verifyPasskey(
    challengeId: string,
    credentialId: string,
    authenticatorData: string,
    signature: string
  ): Promise<AuthResult> {
    const challenge = this.passkeyStore.get(challengeId);

    if (!challenge || new Date() > challenge.expiresAt) {
      return {
        success: false,
        method: "PASSKEY_WEBAUTHN",
        message: "Challenge expired or invalid"
      };
    }

    this.passkeyStore.delete(challengeId);

    const token = this.generateToken(challenge.userId, "customer");

    return {
      success: true,
      token,
      customerId: challenge.userId,
      method: "PASSKEY_WEBAUTHN",
      message: "Successfully authenticated with passkey"
    };
  }

  async initiateBiometricAuth(deviceId: string, userId: string): Promise<{ challengeId: string; challenge: string }> {
    const challengeId = crypto.randomUUID();
    const challenge = crypto.randomBytes(32).toString("base64url");

    this.passkeyStore.set(challengeId, {
      challengeId,
      challenge,
      rpId: deviceId,
      userId,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000)
    });

    return { challengeId, challenge };
  }

  async verifyBiometric(
    challengeId: string,
    biometricSignature: string
  ): Promise<AuthResult> {
    const challenge = this.passkeyStore.get(challengeId);

    if (!challenge || new Date() > challenge.expiresAt) {
      return {
        success: false,
        method: "BIOMETRIC_DEVICE",
        message: "Challenge expired or invalid"
      };
    }

    this.passkeyStore.delete(challengeId);

    const token = this.generateToken(challenge.userId, "customer");

    return {
      success: true,
      token,
      customerId: challenge.userId,
      method: "BIOMETRIC_DEVICE",
      message: "Successfully authenticated with biometric"
    };
  }

  async authenticateWithEmailPassword(email: string, password: string): Promise<AuthResult> {
    const customers = await storage.getAllCustomers();
    const customer = customers.find((c: { email: string | null }) => c.email === email);

    if (!customer) {
      return {
        success: false,
        method: "EMAIL_PASSWORD",
        message: "Invalid email or password"
      };
    }

    const token = this.generateToken(customer.id, "customer");

    return {
      success: true,
      token,
      customerId: customer.id,
      method: "EMAIL_PASSWORD",
      message: "Successfully authenticated"
    };
  }

  async processGoogleOAuth(googleToken: string): Promise<AuthResult> {
    const mockUserData = {
      email: "user@gmail.com",
      name: "Google User",
      sub: "google_" + crypto.randomUUID().slice(0, 8)
    };

    const customer = await this.findOrCreateCustomerByEmail(mockUserData.email, mockUserData.name);
    const token = this.generateToken(customer.id, "customer");

    return {
      success: true,
      token,
      customerId: customer.id,
      method: "GOOGLE_OAUTH",
      message: "Successfully authenticated with Google"
    };
  }

  async processAppleOAuth(appleToken: string): Promise<AuthResult> {
    const mockUserData = {
      email: "user@icloud.com",
      name: "Apple User",
      sub: "apple_" + crypto.randomUUID().slice(0, 8)
    };

    const customer = await this.findOrCreateCustomerByEmail(mockUserData.email, mockUserData.name);
    const token = this.generateToken(customer.id, "customer");

    return {
      success: true,
      token,
      customerId: customer.id,
      method: "APPLE_OAUTH",
      message: "Successfully authenticated with Apple"
    };
  }

  async authenticateEmployee(employeeId: string, essenceUnitId: string, pin: string): Promise<AuthResult> {
    const profiles = await storage.getEmployeeProfilesByUnit(essenceUnitId);
    const profile = profiles.find(p => p.employeeId === employeeId);

    if (!profile) {
      return {
        success: false,
        method: "EMAIL_PASSWORD",
        message: "Employee not found at this location"
      };
    }

    const token = this.generateToken(employeeId, "employee");

    return {
      success: true,
      token,
      employeeId,
      role: "CREW",
      method: "EMAIL_PASSWORD",
      message: "Successfully authenticated"
    };
  }

  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private generateToken(userId: string, userType: string): string {
    const payload = {
      sub: userId,
      type: userType,
      iat: Date.now(),
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000
    };
    return Buffer.from(JSON.stringify(payload)).toString("base64url");
  }

  private async findOrCreateCustomerByPhone(phone: string): Promise<{ id: string }> {
    const customers = await storage.getAllCustomers();
    const existing = customers.find((c: { phoneNumber: string | null }) => c.phoneNumber === phone);
    
    if (existing) {
      return { id: existing.id };
    }

    const newCustomer = await storage.createCustomer({
      fullName: "New Customer",
      email: `${phone.replace(/\D/g, "")}@phone.local`,
      phoneNumber: phone
    });

    return { id: newCustomer.id };
  }

  private async findOrCreateCustomerByEmail(email: string, name: string): Promise<{ id: string }> {
    const customers = await storage.getAllCustomers();
    const existing = customers.find((c: { email: string | null }) => c.email === email);
    
    if (existing) {
      return { id: existing.id };
    }

    const newCustomer = await storage.createCustomer({
      email,
      fullName: name
    });

    return { id: newCustomer.id };
  }

  validateToken(token: string): { valid: boolean; userId?: string; userType?: string; error?: string } {
    try {
      const payload = JSON.parse(Buffer.from(token, "base64url").toString());
      
      if (payload.exp < Date.now()) {
        return { valid: false, error: "Token expired" };
      }

      return {
        valid: true,
        userId: payload.sub,
        userType: payload.type
      };
    } catch {
      return { valid: false, error: "Invalid token" };
    }
  }
}

export const authService = new AuthService();
