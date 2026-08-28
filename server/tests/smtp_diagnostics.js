const dotenv = require("dotenv");
const path = require("path");

// Load .env explicitly
dotenv.config({ path: path.join(__dirname, "../.env") });

const nodemailer = require("nodemailer");
const emailService = require("../services/emailService");

async function runSmtpDiagnostics() {
  console.log("==================================================");
  console.log("🔍 SMTP & GMAIL EMAIL DELIVERY DIAGNOSTICS");
  console.log("==================================================\n");

  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT, 10) || 587;
  const secure = process.env.SMTP_SECURE === "true" || port === 465;
  const user = (process.env.SMTP_USER || process.env.EMAIL_USER || "").trim();
  const rawPass = process.env.SMTP_PASSWORD || process.env.SMTP_PASS || process.env.EMAIL_PASS || "";
  const pass = rawPass.replace(/\s+/g, "");

  console.log("1. ENVIRONMENT CONFIGURATION CHECK:");
  console.log(`   - SMTP_HOST:     ${host}`);
  console.log(`   - SMTP_PORT:     ${port}`);
  console.log(`   - SMTP_SECURE:   ${secure}`);
  console.log(`   - SMTP_USER:     ${user ? user : "❌ (EMPTY / NOT CONFIGURED)"}`);
  console.log(`   - SMTP_PASSWORD: ${pass ? `[CONFIGURED: ${pass.length} chars]` : "❌ (EMPTY / NOT CONFIGURED)"}`);
  console.log(`   - CLIENT_URL:    ${process.env.CLIENT_URL || "http://localhost:5174"}`);
  console.log(`   - EMAIL_FROM:    ${process.env.EMAIL_FROM || "Not explicitly set"}\n`);

  if (!user || !pass) {
    console.log("==================================================");
    console.log("❌ DIAGNOSTIC RESULT: SMTP CREDENTIALS MISSING");
    console.log("==================================================");
    console.log("Real emails cannot be sent because SMTP_USER and SMTP_PASSWORD are empty in server/.env.\n");
    console.log("📌 HOW TO FIX IN 60 SECONDS:");
    console.log("1. Open: c:\\Users\\hasee\\OneDrive\\Desktop\\Alumini Student Connect\\server\\.env");
    console.log("2. Set your sender Gmail address:");
    console.log("   SMTP_USER=your_real_gmail@gmail.com");
    console.log("3. Generate a 16-character Google App Password:");
    console.log("   • Go to: https://myaccount.google.com/security");
    console.log("   • Ensure '2-Step Verification' is turned ON");
    console.log("   • Search 'App passwords' in the top search bar");
    console.log("   • Name it 'AlumniConnect' and copy the 16-character password");
    console.log("   • Paste into server/.env:");
    console.log("     SMTP_PASSWORD=xxxx xxxx xxxx xxxx");
    console.log("4. Save server/.env and re-run this diagnostic: node tests/smtp_diagnostics.js\n");
    return;
  }

  console.log("2. TESTING SMTP CONNECTION & AUTHENTICATION HANDSHAKE...");
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  try {
    await transporter.verify();
    console.log("   ✅ SMTP Server Handshake: SUCCESS (Authenticated with smtp.gmail.com)\n");

    console.log(`3. DISPATCHING REAL TEST EMAIL TO: ${user}...`);
    const fromAddress = `"Easwari Engineering College AlumniConnect" <${user}>`;
    const info = await transporter.sendMail({
      from: fromAddress,
      to: user,
      subject: "Alumni Student Connect — SMTP Diagnostic Test Email",
      text: "This is a real diagnostic verification email sent from your Alumni Student Connect platform.",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 25px; color: #391F25; background: #F7F5F0; border-radius: 8px;">
          <h2 style="color: #57142B; margin-top: 0;">Easwari Engineering College — Alumni Student Connect</h2>
          <p style="font-size: 15px; color: #2E7D32; font-weight: bold;">
            ✅ SMTP Mail Delivery is 100% Functional and Connected to Gmail!
          </p>
          <p style="font-size: 13px; color: #6C574C;">
            If you received this message in your Gmail inbox, password reset emails will be delivered without issues.
          </p>
          <hr style="border: none; border-top: 1px solid #DAD0BB; margin: 15px 0;" />
          <small style="color: #8D7B70;">Timestamp: ${new Date().toISOString()}</small>
        </div>
      `,
    });

    console.log("==================================================");
    console.log("🎉 REAL EMAIL DISPATCHED & ACCEPTED BY GMAIL SMTP!");
    console.log("==================================================");
    console.log(`Message ID:           ${info.messageId}`);
    console.log(`Accepted Recipients:  ${JSON.stringify(info.accepted)}`);
    console.log(`Rejected Recipients:  ${JSON.stringify(info.rejected)}`);
    console.log(`SMTP Response String: ${info.response}`);
    console.log("==================================================\n");
    console.log("📬 CHECK YOUR GMAIL:");
    console.log(`   • Recipient: ${user}`);
    console.log(`   • Search query: from:${user} subject:"SMTP Diagnostic Test Email"`);
    console.log("   • Check Inbox, Updates, Promotions, and Spam folders.\n");
  } catch (err) {
    console.error("==================================================");
    console.error("❌ SMTP HANDSHAKE / DISPATCH FAILED");
    console.error("==================================================");
    console.error(`Error Code:    ${err.code || "N/A"}`);
    console.error(`Error Message: ${err.message}`);
    if (err.response) {
      console.error(`SMTP Response: ${err.response}`);
    }
    console.error("==================================================\n");

    if (err.message.includes("Username and Password not accepted") || err.code === "EAUTH") {
      console.error("💡 DIAGNOSIS: GMAIL AUTHENTICATION REJECTED");
      console.error("   • You MUST use a 16-character Google 'App Password', NOT your standard Gmail account password.");
      console.error("   • Ensure 2-Step Verification is active on your Google account.");
      console.error("   • Generate a new App Password at: https://myaccount.google.com/apppasswords\n");
    }
  }
}

runSmtpDiagnostics();
