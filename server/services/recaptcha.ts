const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY || "";
const RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

export interface RecaptchaVerifyResult {
  success: boolean;
  score?: number;
  action?: string;
  challenge_ts?: string;
  hostname?: string;
  errorCodes?: string[];
}

export async function verifyRecaptcha(token: string): Promise<RecaptchaVerifyResult> {
  if (!RECAPTCHA_SECRET_KEY) {
    console.warn("reCAPTCHA secret key not configured - skipping verification");
    return { success: true };
  }

  if (!token) {
    return { success: false, errorCodes: ["missing-input-response"] };
  }

  try {
    const response = await fetch(RECAPTCHA_VERIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        secret: RECAPTCHA_SECRET_KEY,
        response: token,
      }),
    });

    const data = await response.json();

    if (data.success) {
      if (data.score !== undefined && data.score < 0.5) {
        return {
          success: false,
          score: data.score,
          errorCodes: ["low-score"],
        };
      }
      return {
        success: true,
        score: data.score,
        action: data.action,
        challenge_ts: data.challenge_ts,
        hostname: data.hostname,
      };
    }

    return {
      success: false,
      errorCodes: data["error-codes"] || ["unknown-error"],
    };
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    return {
      success: false,
      errorCodes: ["verification-failed"],
    };
  }
}

export function isHumanLikely(result: RecaptchaVerifyResult, minScore: number = 0.5): boolean {
  if (!result.success) return false;
  if (result.score === undefined) return true;
  return result.score >= minScore;
}
