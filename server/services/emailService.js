const nodemailer = require("nodemailer");

/**
 * Creates and returns a Nodemailer transporter using environment variables.
 * Returns null if SMTP_USER or SMTP_PASSWORD/SMTP_PASS is missing.
 */
const getTransporter = () => {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const user = (process.env.SMTP_USER || process.env.EMAIL_USER || "").trim();
  const rawPass = process.env.SMTP_PASSWORD || process.env.SMTP_PASS || process.env.EMAIL_PASS || "";
  const pass = rawPass.replace(/\s+/g, "");

  if (!user || !pass) {
    return null;
  }

  const isGmail = host.includes("gmail") || user.endsWith("@gmail.com");
  const port = parseInt(process.env.SMTP_PORT, 10) || (isGmail ? 465 : 587);
  const secure = process.env.SMTP_SECURE === "true" || port === 465 || isGmail;

  return nodemailer.createTransport({
    host: isGmail ? "smtp.gmail.com" : host,
    port: isGmail ? 465 : port,
    secure: isGmail ? true : secure,
    auth: {
      user,
      pass,
    },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
    tls: {
      rejectUnauthorized: false,
    },
  });
};

/**
 * Verifies SMTP connection configuration on server startup.
 */
const verifySMTPConnection = async () => {
  const transporter = getTransporter();
  if (!transporter) {
    console.log(
      "ℹ️ [SMTP Status] SMTP credentials are not yet configured in server/.env (SMTP_USER/SMTP_PASSWORD). Real password reset emails will not be sent until credentials are provided."
    );
    return { configured: false, verified: false, message: "Credentials missing in .env" };
  }

  try {
    await transporter.verify();
    console.log(
      "✅ [SMTP Status] SMTP connection verified successfully! Mail server is ready to deliver real emails."
    );
    return { configured: true, verified: true };
  } catch (err) {
    console.error("❌ [SMTP Status] SMTP connection verification failed:", err.message);
    return { configured: true, verified: false, error: err.message };
  }
};

/**
 * Sends a styled HTML password reset email to the user.
 *
 * @param {Object} options
 * @param {string} options.to - Recipient email address
 * @param {string} options.name - Recipient user name
 * @param {string} options.resetUrl - Full reset URL with raw token
 * @param {number} options.expiresInMinutes - Expiration duration in minutes
 * @returns {Promise<{success: boolean, messageId?: string, accepted?: Array, rejected?: Array, response?: string, reason?: string, resetUrl?: string}>}
 */
const sendPasswordResetEmail = async ({ to, name, resetUrl, expiresInMinutes = 30 }) => {
  const transporter = getTransporter();
  const user = (process.env.SMTP_USER || process.env.EMAIL_USER || "").trim();
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const isGmail = host.includes("gmail") || user.endsWith("@gmail.com");
  const port = parseInt(process.env.SMTP_PORT, 10) || (isGmail ? 465 : 587);
  const secure = process.env.SMTP_SECURE === "true" || port === 465 || isGmail;

  const fromAddress = user
    ? `"Easwari Engineering College AlumniConnect" <${user}>`
    : (process.env.EMAIL_FROM || `"Easwari Engineering College AlumniConnect" <noreply@eec.srmrmp.edu.in>`);

  const subject = "Alumni Student Connect — Password Reset";

  console.log("\n==================================================");
  console.log("📧 [EMAIL DISPATCH INITIATED]");
  console.log(`Password reset recipient: ${to}`);
  console.log(`From address: ${fromAddress}`);
  console.log(`SMTP Host: ${host}:${port} (Secure: ${secure})`);
  console.log(`SMTP User: ${user ? user : "(NOT CONFIGURED IN .env)"}`);
  console.log("==================================================");

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Password Reset</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #F7F5F0;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: #391F25;
    }
    .container {
      max-width: 580px;
      margin: 30px auto;
      background: #FFFFFF;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(57, 31, 37, 0.08);
      border: 1px solid #DAD0BB;
    }
    .header {
      background-color: #57142B;
      color: #FFFFFF;
      padding: 26px 30px;
      text-align: center;
      border-bottom: 3px solid #C4A78D;
    }
    .college-sub {
      font-size: 11px;
      letter-spacing: 0.1em;
      font-weight: 700;
      color: #DAD0BB;
      text-transform: uppercase;
      margin-bottom: 4px;
    }
    .portal-title {
      font-size: 22px;
      font-weight: 800;
      margin: 0;
      color: #FFFFFF;
    }
    .content {
      padding: 36px 30px;
      line-height: 1.6;
    }
    .greeting {
      font-size: 17px;
      font-weight: 700;
      color: #391F25;
      margin-bottom: 12px;
    }
    .text {
      font-size: 14px;
      color: #6C574C;
      margin-bottom: 20px;
    }
    .btn-wrap {
      text-align: center;
      margin: 30px 0;
    }
    .reset-btn {
      display: inline-block;
      background-color: #57142B;
      color: #FFFFFF !important;
      padding: 13px 32px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 700;
      text-decoration: none;
      box-shadow: 0 4px 12px rgba(87, 20, 43, 0.25);
    }
    .expiry-box {
      background-color: #F7F5F0;
      border-left: 4px solid #C4A78D;
      padding: 12px 16px;
      border-radius: 4px;
      font-size: 12.5px;
      color: #6C574C;
      margin-bottom: 22px;
    }
    .alt-link {
      font-size: 12px;
      color: #8D7B70;
      word-break: break-all;
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #ECE7DE;
    }
    .footer {
      background-color: #391F25;
      color: #DAD0BB;
      padding: 20px 30px;
      text-align: center;
      font-size: 11.5px;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="college-sub">Easwari Engineering College</div>
      <h1 class="portal-title">Alumni Student Connect</h1>
    </div>
    <div class="content">
      <div class="greeting">Hello ${name || "Member"},</div>
      <p class="text">
        We received a request to reset your password for your <strong>Alumni Student Connect</strong> account at Easwari Engineering College.
      </p>
      <div class="btn-wrap">
        <a href="${resetUrl}" target="_blank" rel="noopener noreferrer" class="reset-btn">Reset Password</a>
      </div>
      <div class="expiry-box">
        ⏳ <strong>Security Notice:</strong> This password reset link will expire in <strong>${expiresInMinutes} minutes</strong>. If you did not request a password reset, you can safely ignore this email — your password will remain unchanged.
      </div>
      <div class="alt-link">
        If the button above does not work, copy and paste this link into your browser:<br />
        <a href="${resetUrl}" style="color: #57142B;">${resetUrl}</a>
      </div>
    </div>
    <div class="footer">
      Easwari Engineering College (Autonomous), Ramapuram, Chennai - 600089<br />
      Official Alumni & Student Engagement Portal • Artificial Intelligence and Data Science
    </div>
  </div>
</body>
</html>
  `;

  const textContent = `
Easwari Engineering College — Alumni Student Connect
Password Reset Request

Hello ${name || "Member"},

We received a request to reset your password for your Alumni Student Connect account.

Click the link below to set a new password:
${resetUrl}

This link is valid for ${expiresInMinutes} minutes. If you did not request this, please ignore this email.

Easwari Engineering College • Alumni & Student Engagement Portal
  `;

  if (!transporter) {
    console.warn(
      `⚠️ [EmailService Warning] SMTP credentials (SMTP_USER/SMTP_PASSWORD) are NOT configured in server/.env.\nReal email could NOT be sent to: ${to}`
    );
    return {
      success: false,
      reason: "SMTP_NOT_CONFIGURED",
      resetUrl,
    };
  }

  try {
    const info = await transporter.sendMail({
      from: fromAddress,
      to,
      subject,
      text: textContent,
      html: htmlContent,
    });

    console.log("\n==================================================");
    console.log("EMAIL SEND RESULT:");
    console.log(`messageId: ${info.messageId}`);
    console.log(`accepted: ${JSON.stringify(info.accepted)}`);
    console.log(`rejected: ${JSON.stringify(info.rejected)}`);
    console.log(`pending: ${JSON.stringify(info.pending || [])}`);
    console.log(`envelope: ${JSON.stringify(info.envelope)}`);
    console.log(`response: ${info.response}`);
    console.log("==================================================\n");

    return {
      success: true,
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
      response: info.response,
      resetUrl,
    };
  } catch (error) {
    console.error("\n==================================================");
    console.error("❌ [EmailService Error] SMTP sendMail failed:");
    console.error(`Error Code: ${error.code || "N/A"}`);
    console.error(`Error Message: ${error.message}`);
    console.error(`Command: ${error.command || "N/A"}`);
    console.error("==================================================\n");
    throw error;
  }
};

/**
 * Sends a test diagnostic email to verify real delivery.
 */
const sendTestEmail = async (toEmail) => {
  const transporter = getTransporter();
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT, 10) || 587;
  const secure = process.env.SMTP_SECURE === "true" || port === 465;
  const user = (process.env.SMTP_USER || process.env.EMAIL_USER || "").trim();

  const fromAddress = user
    ? `"Easwari Engineering College AlumniConnect" <${user}>`
    : (process.env.EMAIL_FROM || `"Easwari Engineering College AlumniConnect" <noreply@eec.srmrmp.edu.in>`);

  console.log("\n==================================================");
  console.log("🧪 [TEST EMAIL DISPATCH INITIATED]");
  console.log(`Recipient: ${toEmail}`);
  console.log(`From address: ${fromAddress}`);
  console.log(`SMTP Host: ${host}:${port} (Secure: ${secure})`);
  console.log(`SMTP User: ${user ? user : "(NOT CONFIGURED IN .env)"}`);
  console.log("==================================================");

  if (!transporter) {
    return {
      success: false,
      reason: "SMTP_NOT_CONFIGURED",
      error: "SMTP_USER or SMTP_PASSWORD is missing from server/.env",
    };
  }

  try {
    const info = await transporter.sendMail({
      from: fromAddress,
      to: toEmail,
      subject: "Alumni Student Connect - Test Email",
      text: "This is a test email from the Alumni Student Connect backend to verify SMTP configuration and inbox delivery.",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #391F25;">
          <h2 style="color: #57142B;">Alumni Student Connect — Test Email</h2>
          <p>This is a test email from the Easwari Engineering College Alumni Student Connect backend.</p>
          <p>If you are seeing this email in your inbox, your SMTP server configuration is <strong>100% verified and working!</strong></p>
          <hr style="border: none; border-top: 1px solid #DAD0BB;" />
          <small style="color: #6C574C;">Timestamp: ${new Date().toISOString()}</small>
        </div>
      `,
    });

    console.log("\n==================================================");
    console.log("TEST EMAIL SEND RESULT:");
    console.log(`messageId: ${info.messageId}`);
    console.log(`accepted: ${JSON.stringify(info.accepted)}`);
    console.log(`rejected: ${JSON.stringify(info.rejected)}`);
    console.log(`response: ${info.response}`);
    console.log("==================================================\n");

    return {
      success: true,
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
      response: info.response,
    };
  } catch (error) {
    console.error("❌ Test email delivery failed:", error.message);
    return {
      success: false,
      error: error.message,
      code: error.code,
    };
  }
};

module.exports = {
  getTransporter,
  verifySMTPConnection,
  sendPasswordResetEmail,
  sendTestEmail,
};
