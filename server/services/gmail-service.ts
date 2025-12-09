// Essence Yogurt - Gmail Service 2026 (Replit Integration)
// Uses Gmail API via Replit connectors for better deliverability

import { google } from 'googleapis';

let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=google-mail',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('Gmail not connected');
  }
  return accessToken;
}

async function getUncachableGmailClient() {
  const accessToken = await getAccessToken();

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: accessToken
  });

  return google.gmail({ version: 'v1', auth: oauth2Client });
}

interface EmailParams {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

function createRawEmail(params: EmailParams): string {
  const fromEmail = params.from || 'loyalty@essenceyogurt.com';
  const fromName = 'Essence Yogurt';
  
  const emailLines = [
    `From: "${fromName}" <${fromEmail}>`,
    `To: ${params.to}`,
    `Subject: =?UTF-8?B?${Buffer.from(params.subject).toString('base64')}?=`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    '',
    params.html
  ];
  
  const email = emailLines.join('\r\n');
  return Buffer.from(email).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export async function sendGmailEmail(params: EmailParams): Promise<{ ok: boolean; messageId?: string; error?: string }> {
  try {
    const gmail = await getUncachableGmailClient();
    const raw = createRawEmail(params);
    
    const response = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: raw
      }
    });
    
    console.log('[GmailService] Email sent successfully:', response.data.id);
    return { ok: true, messageId: response.data.id || undefined };
  } catch (err: any) {
    console.error('[GmailService] Error sending email:', err.message);
    return { ok: false, error: err.message };
  }
}

export async function getGmailStatus(): Promise<{ connected: boolean; email?: string; error?: string }> {
  try {
    const gmail = await getUncachableGmailClient();
    const labels = await gmail.users.labels.list({ userId: 'me' });
    const hasLabels = Boolean(labels.data.labels && labels.data.labels.length > 0);
    return { 
      connected: hasLabels, 
      email: 'support@essenceyogurt.com'
    };
  } catch (err: any) {
    return { connected: false, error: err.message };
  }
}

export async function sendLuxuryWelcomeEmailViaGmail(params: {
  to: string;
  firstName: string;
  lastName: string;
  membershipTier: string;
  referralCode: string;
  welcomePoints: number;
  verificationLink: string;
}): Promise<{ ok: boolean; error?: string }> {
  const { to, firstName, membershipTier, referralCode, welcomePoints, verificationLink } = params;
  
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
        
        <div style="background: linear-gradient(135deg, #B08D57 0%, #D4AF37 50%, #F5E6C8 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 32px; text-shadow: 1px 1px 2px rgba(0,0,0,0.1);">Essence Yogurt</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-family: 'Cormorant Garamond', serif; font-size: 16px; letter-spacing: 3px; text-transform: uppercase;">Luxury Frozen Yogurt</p>
        </div>
        
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
        </div>
        
        <div style="background: #1a1a1a; padding: 30px 20px; text-align: center;">
          <p style="color: #B08D57; margin: 0 0 15px; font-family: 'Playfair Display', Georgia, serif; font-size: 18px;">Essence Yogurt</p>
          <p style="color: #666; margin: 0; font-size: 11px; font-family: Arial, sans-serif;">
            © ${new Date().getFullYear()} Essence Yogurt. All rights reserved.
          </p>
        </div>
        
      </div>
    </body>
    </html>
  `;
  
  return sendGmailEmail({
    to,
    subject: `Welcome to Essence Yogurt, ${firstName}!`,
    html
  });
}

export async function sendJobApplicationNotification(params: {
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  positionTitle: string;
  location: string;
  department: string;
  applicationDetails: string;
}): Promise<{ ok: boolean; error?: string }> {
  const { applicantName, applicantEmail, applicantPhone, positionTitle, location, department, applicationDetails } = params;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Job Application - ${positionTitle}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8f8f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
      <div style="max-width: 700px; margin: 0 auto; background: white; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        
        <div style="background: linear-gradient(135deg, #B08D57 0%, #D4AF37 50%, #F5E6C8 100%); padding: 30px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 28px;">Essence Yogurt HR</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 14px; letter-spacing: 2px; text-transform: uppercase;">New Job Application</p>
        </div>
        
        <div style="padding: 30px;">
          <div style="background: #fef3c7; border-left: 4px solid #D4AF37; padding: 15px 20px; margin-bottom: 25px; border-radius: 0 8px 8px 0;">
            <h2 style="color: #92400e; margin: 0; font-size: 20px;">New Application Received</h2>
            <p style="color: #a16207; margin: 5px 0 0; font-size: 14px;">Position: <strong>${positionTitle}</strong> • ${location}</p>
          </div>
          
          <div style="background: #f9f9f9; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
            <h3 style="color: #333; margin: 0 0 15px; font-size: 16px; border-bottom: 1px solid #eee; padding-bottom: 10px;">Applicant Information</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666; font-size: 14px; width: 120px;">Name:</td>
                <td style="padding: 8px 0; color: #333; font-size: 14px; font-weight: 600;">${applicantName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-size: 14px;">Email:</td>
                <td style="padding: 8px 0; color: #333; font-size: 14px;"><a href="mailto:${applicantEmail}" style="color: #D4AF37;">${applicantEmail}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-size: 14px;">Phone:</td>
                <td style="padding: 8px 0; color: #333; font-size: 14px;"><a href="tel:${applicantPhone}" style="color: #D4AF37;">${applicantPhone}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-size: 14px;">Department:</td>
                <td style="padding: 8px 0; color: #333; font-size: 14px;">${department}</td>
              </tr>
            </table>
          </div>
          
          <div style="background: #f9f9f9; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
            <h3 style="color: #333; margin: 0 0 15px; font-size: 16px; border-bottom: 1px solid #eee; padding-bottom: 10px;">Application Details</h3>
            <pre style="color: #444; font-size: 13px; line-height: 1.6; white-space: pre-wrap; word-wrap: break-word; font-family: 'SF Mono', Consolas, monospace; background: white; padding: 15px; border-radius: 8px; border: 1px solid #eee; margin: 0;">${applicationDetails}</pre>
          </div>
          
          <div style="text-align: center; margin-top: 25px;">
            <a href="mailto:${applicantEmail}?subject=Re: Your Application for ${positionTitle} at Essence Yogurt" style="display: inline-block; background: linear-gradient(135deg, #B08D57, #D4AF37); color: white; text-decoration: none; padding: 12px 30px; border-radius: 25px; font-size: 14px; font-weight: 600;">
              Reply to Applicant
            </a>
          </div>
        </div>
        
        <div style="background: #1a1a1a; padding: 20px; text-align: center;">
          <p style="color: #888; margin: 0; font-size: 11px;">
            This is an automated notification from Essence Yogurt Careers Portal<br>
            © ${new Date().getFullYear()} Essence Yogurt. All rights reserved.
          </p>
        </div>
        
      </div>
    </body>
    </html>
  `;
  
  return sendGmailEmail({
    to: "support@essenceyogurt.com",
    subject: `[HR] New Job Application: ${positionTitle} - ${applicantName}`,
    html
  });
}
