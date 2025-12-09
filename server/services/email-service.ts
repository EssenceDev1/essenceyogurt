// Essence Yogurt - Luxury Email Service 2026
// Sends: Welcome emails, loyalty notifications, verification emails
// Features: Luxury branding, multi-language support, Apple-style design

import nodemailer from "nodemailer";

interface WelcomeEmailParams {
  to: string;
  firstName: string;
  lastName: string;
  membershipTier: string;
  referralCode: string;
  welcomePoints: number;
  verificationLink: string;
}

interface LoyaltyEmailParams {
  to: string;
  firstName: string;
  subject: string;
  message: string;
  pointsBalance?: number;
  tierStatus?: string;
}

class LuxuryEmailService {
  private transporter: nodemailer.Transporter | null = null;
  private sender: string;
  private isConfigured: boolean;

  constructor() {
    this.sender = process.env.ESN_SMTP_EMAIL || "loyalty@essenceyogurt.com";
    
    const smtpEmail = process.env.ESN_SMTP_EMAIL;
    const smtpPass = process.env.ESN_SMTP_PASS;
    
    this.isConfigured = Boolean(smtpEmail && smtpPass);
    
    if (this.isConfigured) {
      this.transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: smtpEmail,
          pass: smtpPass,
        },
      });
    }
  }

  private getHeaderHtml(): string {
    return `
      <div style="background: linear-gradient(135deg, #B08D57 0%, #D4AF37 50%, #F5E6C8 100%); padding: 40px 20px; text-align: center;">
        <img src="https://essenceyogurt.com/logo-light.png" alt="Essence Yogurt" style="height: 60px; margin-bottom: 15px;" onerror="this.style.display='none'">
        <h1 style="color: white; margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 32px; text-shadow: 1px 1px 2px rgba(0,0,0,0.1);">Essence Yogurt</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-family: 'Cormorant Garamond', serif; font-size: 16px; letter-spacing: 3px; text-transform: uppercase;">Luxury Frozen Yogurt</p>
      </div>
    `;
  }

  private getFooterHtml(): string {
    return `
      <div style="background: #1a1a1a; padding: 30px 20px; text-align: center;">
        <p style="color: #B08D57; margin: 0 0 15px; font-family: 'Playfair Display', Georgia, serif; font-size: 18px;">Essence Yogurt</p>
        <div style="margin-bottom: 20px;">
          <a href="https://www.essenceyogurt.com" style="color: #888; text-decoration: none; margin: 0 10px; font-size: 12px;">Website</a>
          <a href="https://www.essenceyogurt.com/locations" style="color: #888; text-decoration: none; margin: 0 10px; font-size: 12px;">Locations</a>
          <a href="https://www.essenceyogurt.com/app" style="color: #888; text-decoration: none; margin: 0 10px; font-size: 12px;">Download App</a>
          <a href="https://www.essenceyogurt.com/contact" style="color: #888; text-decoration: none; margin: 0 10px; font-size: 12px;">Contact</a>
        </div>
        <p style="color: #666; margin: 0; font-size: 11px; font-family: Arial, sans-serif;">
          © ${new Date().getFullYear()} Essence Yogurt. All rights reserved.<br>
          Premium self-serve frozen yogurt experiences worldwide.
        </p>
        <p style="color: #555; margin: 15px 0 0; font-size: 10px; font-family: Arial, sans-serif;">
          This email was sent to you because you registered for our loyalty program.<br>
          <a href="https://www.essenceyogurt.com/unsubscribe" style="color: #B08D57;">Unsubscribe</a> | 
          <a href="https://www.essenceyogurt.com/privacy" style="color: #B08D57;">Privacy Policy</a>
        </p>
      </div>
    `;
  }

  async sendWelcomeEmail(params: WelcomeEmailParams): Promise<{ ok: boolean; error?: string }> {
    const { to, firstName, lastName, membershipTier, referralCode, welcomePoints, verificationLink } = params;

    const tierColors: Record<string, string> = {
      PEARL: "#F5F5F5",
      GOLD: "#D4AF37",
      PLATINUM: "#E5E4E2",
      DIAMOND: "#B9F2FF",
    };

    const tierBadgeColor = tierColors[membershipTier] || tierColors.PEARL;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Essence Yogurt</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8f8f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background: white; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          
          ${this.getHeaderHtml()}
          
          <div style="padding: 40px 30px;">
            <h2 style="color: #1a1a1a; margin: 0 0 20px; font-family: 'Playfair Display', Georgia, serif; font-size: 28px; text-align: center;">
              Welcome, ${firstName}!
            </h2>
            
            <p style="color: #333; font-size: 16px; line-height: 1.6; text-align: center; margin-bottom: 30px;">
              Thank you for joining the Essence Yogurt family. You're now part of an exclusive community that appreciates the finest frozen yogurt experiences.
            </p>
            
            <div style="background: linear-gradient(135deg, ${tierBadgeColor}20, ${tierBadgeColor}40); border-radius: 16px; padding: 25px; text-align: center; margin-bottom: 30px; border: 1px solid ${tierBadgeColor};">
              <p style="color: #666; margin: 0 0 5px; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Your Membership Tier</p>
              <h3 style="color: #B08D57; margin: 0 0 15px; font-family: 'Playfair Display', Georgia, serif; font-size: 24px;">${membershipTier}</h3>
              <div style="display: inline-block; background: #B08D57; color: white; padding: 8px 20px; border-radius: 20px; font-size: 14px;">
                ${welcomePoints} Welcome Points
              </div>
            </div>
            
            <div style="background: #f9f9f9; border-radius: 12px; padding: 20px; margin-bottom: 30px;">
              <p style="color: #666; margin: 0 0 10px; font-size: 14px; text-align: center;">Your Personal Referral Code</p>
              <div style="background: white; border: 2px dashed #B08D57; border-radius: 8px; padding: 15px; text-align: center;">
                <code style="color: #B08D57; font-size: 24px; font-weight: bold; letter-spacing: 3px;">${referralCode}</code>
              </div>
              <p style="color: #888; margin: 10px 0 0; font-size: 12px; text-align: center;">
                Share with friends and earn 200 points for each referral!
              </p>
            </div>
            
            <div style="text-align: center; margin-bottom: 30px;">
              <a href="${verificationLink}" style="display: inline-block; background: linear-gradient(135deg, #B08D57, #D4AF37); color: white; text-decoration: none; padding: 15px 40px; border-radius: 30px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 15px rgba(176, 141, 87, 0.3);">
                Verify Your Email
              </a>
              <p style="color: #888; margin: 15px 0 0; font-size: 12px;">
                Verify your email to earn 50 bonus points!
              </p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <h3 style="color: #1a1a1a; margin: 0 0 20px; font-family: 'Playfair Display', Georgia, serif; font-size: 20px; text-align: center;">
              Your Exclusive Benefits
            </h3>
            
            <div style="display: flex; flex-wrap: wrap; gap: 15px; justify-content: center;">
              <div style="flex: 1; min-width: 150px; background: #fafafa; border-radius: 12px; padding: 20px; text-align: center;">
                <div style="font-size: 28px; margin-bottom: 10px;">🎁</div>
                <p style="color: #333; margin: 0; font-size: 14px; font-weight: 600;">Birthday Reward</p>
                <p style="color: #666; margin: 5px 0 0; font-size: 12px;">Free treat on your special day</p>
              </div>
              <div style="flex: 1; min-width: 150px; background: #fafafa; border-radius: 12px; padding: 20px; text-align: center;">
                <div style="font-size: 28px; margin-bottom: 10px;">⭐</div>
                <p style="color: #333; margin: 0; font-size: 14px; font-weight: 600;">Points on Every Visit</p>
                <p style="color: #666; margin: 5px 0 0; font-size: 12px;">1 point per $1 spent</p>
              </div>
              <div style="flex: 1; min-width: 150px; background: #fafafa; border-radius: 12px; padding: 20px; text-align: center;">
                <div style="font-size: 28px; margin-bottom: 10px;">🎉</div>
                <p style="color: #333; margin: 0; font-size: 14px; font-weight: 600;">Exclusive Offers</p>
                <p style="color: #666; margin: 5px 0 0; font-size: 12px;">Members-only promotions</p>
              </div>
            </div>
          </div>
          
          ${this.getFooterHtml()}
          
        </div>
      </body>
      </html>
    `;

    if (!this.isConfigured || !this.transporter) {
      console.log("[LuxuryEmailService] Email not configured - would send welcome email to:", to);
      return { ok: true, error: "Email service not configured (simulated send)" };
    }

    try {
      await this.transporter.sendMail({
        from: `"Essence Yogurt" <${this.sender}>`,
        to,
        subject: `Welcome to Essence Yogurt, ${firstName}! 🎉`,
        html,
      });
      console.log("[LuxuryEmailService] Welcome email sent to:", to);
      return { ok: true };
    } catch (err: any) {
      console.error("[LuxuryEmailService Error]", err);
      return { ok: false, error: String(err) };
    }
  }

  async sendLoyaltyNotification(params: LoyaltyEmailParams): Promise<{ ok: boolean; error?: string }> {
    const { to, firstName, subject, message, pointsBalance, tierStatus } = params;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8f8f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background: white; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          
          ${this.getHeaderHtml()}
          
          <div style="padding: 40px 30px;">
            <h2 style="color: #1a1a1a; margin: 0 0 20px; font-family: 'Playfair Display', Georgia, serif; font-size: 24px;">
              Hello, ${firstName}!
            </h2>
            
            <div style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
              ${message}
            </div>
            
            ${pointsBalance !== undefined ? `
              <div style="background: linear-gradient(135deg, #B08D5720, #D4AF3740); border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 20px;">
                <p style="color: #666; margin: 0 0 5px; font-size: 12px;">Your Points Balance</p>
                <p style="color: #B08D57; margin: 0; font-size: 32px; font-weight: bold;">${pointsBalance.toLocaleString()}</p>
                ${tierStatus ? `<p style="color: #888; margin: 10px 0 0; font-size: 14px;">${tierStatus}</p>` : ''}
              </div>
            ` : ''}
            
            <div style="text-align: center;">
              <a href="https://www.essenceyogurt.com/app" style="display: inline-block; background: linear-gradient(135deg, #B08D57, #D4AF37); color: white; text-decoration: none; padding: 12px 30px; border-radius: 25px; font-size: 14px; font-weight: 600;">
                View in App
              </a>
            </div>
          </div>
          
          ${this.getFooterHtml()}
          
        </div>
      </body>
      </html>
    `;

    if (!this.isConfigured || !this.transporter) {
      console.log("[LuxuryEmailService] Email not configured - would send notification to:", to);
      return { ok: true, error: "Email service not configured (simulated send)" };
    }

    try {
      await this.transporter.sendMail({
        from: `"Essence Yogurt" <${this.sender}>`,
        to,
        subject,
        html,
      });
      console.log("[LuxuryEmailService] Loyalty notification sent to:", to);
      return { ok: true };
    } catch (err: any) {
      console.error("[LuxuryEmailService Error]", err);
      return { ok: false, error: String(err) };
    }
  }

  getStatus(): { configured: boolean; sender: string } {
    return { configured: this.isConfigured, sender: this.sender };
  }
}

// Singleton instance
let luxuryEmailService: LuxuryEmailService | null = null;

export function getLuxuryEmailService(): LuxuryEmailService {
  if (!luxuryEmailService) {
    luxuryEmailService = new LuxuryEmailService();
  }
  return luxuryEmailService;
}

// Convenience export function
export async function sendLuxuryWelcomeEmail(params: WelcomeEmailParams): Promise<{ ok: boolean; error?: string }> {
  return getLuxuryEmailService().sendWelcomeEmail(params);
}

export async function sendLoyaltyNotification(params: LoyaltyEmailParams): Promise<{ ok: boolean; error?: string }> {
  return getLuxuryEmailService().sendLoyaltyNotification(params);
}
