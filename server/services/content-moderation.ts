import { GoogleGenAI } from "@google/genai";
import pRetry, { AbortError } from "p-retry";

const ai = new GoogleGenAI({
  apiKey: process.env.AI_INTEGRATIONS_GEMINI_API_KEY || "",
  httpOptions: {
    apiVersion: "",
    baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL || "",
  },
});

export interface ModerationResult {
  isApproved: boolean;
  violations: string[];
  severity: "none" | "low" | "medium" | "high" | "critical";
  flaggedCategories: string[];
  cleanedContent?: string;
}

const MODERATION_PROMPT = `You are a content moderation AI for Essence Yogurt, a luxury frozen yogurt brand. Your task is to analyze user-generated content and ensure it meets our strict community standards.

STRICTLY PROHIBITED CONTENT (reject immediately):
- Violence, weapons, guns, knives, or any threats
- Drugs, controlled substances, or drug references
- Profanity, swear words, vulgar language, or crude expressions
- Hate speech, discrimination, or harassment
- Adult/sexual content or suggestive material
- Spam, scams, or fraudulent content
- Personal attacks or bullying
- Illegal activities

CONTENT GUIDELINES:
- Content must be family-friendly
- Must maintain the luxury, elegant brand tone
- Should be positive and uplifting
- Professional language only

Analyze the following content and respond with a JSON object:
{
  "isApproved": boolean,
  "violations": ["list of specific violations found, empty if approved"],
  "severity": "none" | "low" | "medium" | "high" | "critical",
  "flaggedCategories": ["categories like: violence, drugs, profanity, harassment, adult, spam, hate"],
  "reasoning": "brief explanation of your decision"
}

CONTENT TO ANALYZE:
`;

function isRateLimitError(error: any): boolean {
  const errorMsg = error?.message || String(error);
  return (
    errorMsg.includes("429") ||
    errorMsg.includes("RATELIMIT_EXCEEDED") ||
    errorMsg.toLowerCase().includes("quota") ||
    errorMsg.toLowerCase().includes("rate limit")
  );
}

export async function moderateContent(content: string): Promise<ModerationResult> {
  if (!process.env.AI_INTEGRATIONS_GEMINI_API_KEY || !process.env.AI_INTEGRATIONS_GEMINI_BASE_URL) {
    console.log("Gemini AI not configured, allowing content by default");
    return {
      isApproved: true,
      violations: [],
      severity: "none",
      flaggedCategories: [],
    };
  }

  try {
    const result = await pRetry(
      async () => {
        try {
          const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: MODERATION_PROMPT + content,
            config: {
              responseMimeType: "application/json",
            },
          });
          return response.text || "";
        } catch (error: any) {
          if (isRateLimitError(error)) {
            throw error;
          }
          throw new AbortError(error);
        }
      },
      {
        retries: 3,
        minTimeout: 1000,
        maxTimeout: 10000,
        factor: 2,
      }
    );

    const parsed = JSON.parse(result);
    return {
      isApproved: parsed.isApproved ?? true,
      violations: parsed.violations || [],
      severity: parsed.severity || "none",
      flaggedCategories: parsed.flaggedCategories || [],
    };
  } catch (error) {
    console.error("Content moderation error:", error);
    return {
      isApproved: true,
      violations: [],
      severity: "none",
      flaggedCategories: [],
    };
  }
}

export async function moderateImage(imageUrl: string): Promise<ModerationResult> {
  if (!process.env.AI_INTEGRATIONS_GEMINI_API_KEY || !process.env.AI_INTEGRATIONS_GEMINI_BASE_URL) {
    console.log("Gemini AI not configured, allowing image by default");
    return {
      isApproved: true,
      violations: [],
      severity: "none",
      flaggedCategories: [],
    };
  }

  const IMAGE_MODERATION_PROMPT = `You are a content moderation AI for Essence Yogurt, a luxury frozen yogurt brand. Analyze this image URL and determine if it's appropriate for our family-friendly, luxury brand community.

STRICTLY PROHIBITED:
- Violence, weapons, gore
- Drugs or drug paraphernalia
- Adult/sexual/suggestive content
- Offensive gestures or symbols
- Hate symbols
- Disturbing or graphic content

The image URL is: ${imageUrl}

Respond with JSON:
{
  "isApproved": boolean,
  "violations": ["list violations"],
  "severity": "none" | "low" | "medium" | "high" | "critical",
  "flaggedCategories": ["categories"],
  "reasoning": "explanation"
}`;

  try {
    const result = await pRetry(
      async () => {
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: IMAGE_MODERATION_PROMPT,
          config: {
            responseMimeType: "application/json",
          },
        });
        return response.text || "";
      },
      {
        retries: 3,
        minTimeout: 1000,
        maxTimeout: 10000,
        factor: 2,
      }
    );

    const parsed = JSON.parse(result);
    return {
      isApproved: parsed.isApproved ?? true,
      violations: parsed.violations || [],
      severity: parsed.severity || "none",
      flaggedCategories: parsed.flaggedCategories || [],
    };
  } catch (error) {
    console.error("Image moderation error:", error);
    return {
      isApproved: true,
      violations: [],
      severity: "none",
      flaggedCategories: [],
    };
  }
}
