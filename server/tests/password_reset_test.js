const http = require("http");
const mongoose = require("mongoose");
const crypto = require("crypto");
const emailService = require("../services/emailService");
const User = require("../models/User");

const BASE_URL = "http://localhost:5000";

function request(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + path);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (token) {
      options.headers["Authorization"] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        let parsed = null;
        try {
          parsed = JSON.parse(data);
        } catch (e) {
          parsed = data;
        }
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: parsed,
        });
      });
    });

    req.on("error", (err) => reject(err));

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runPasswordResetSuite() {
  console.log("==================================================");
  console.log("ALUMNI STUDENT CONNECT — PASSWORD RESET TEST SUITE");
  console.log("==================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    const uniqueSuffix = Date.now();

    // 1. Register test user (Student)
    const studentEmail = `reset.student.${uniqueSuffix}@eec.srmrmp.edu.in`;
    const originalPassword = "OriginalPass#2026";
    const regRes = await request("POST", "/api/auth/register", {
      name: "Reset Test Student",
      email: studentEmail,
      password: originalPassword,
      role: "Student",
      department: "Artificial Intelligence and Data Science",
    });
    assert(regRes.status === 201, "1. Register test user account");

    // 2. Request forgot password for registered user
    const forgotRes = await request("POST", "/api/auth/forgot-password", {
      email: studentEmail,
    });
    assert(
      forgotRes.status === 200 &&
        forgotRes.data?.message?.includes("If an account exists with this email address"),
      "2. Forgot password returns security generic response (account enumeration prevented)"
    );

    // Extract resetUrl from dev response for testing
    let rawToken = null;
    if (forgotRes.data?.data?.resetUrl) {
      const parts = forgotRes.data.data.resetUrl.split("/reset-password/");
      rawToken = parts[1];
    }

    assert(rawToken && rawToken.length === 64, "3. Cryptographically secure 64-char hex token generated");

    // 4. Request forgot password for unregistered email
    const unknownEmailRes = await request("POST", "/api/auth/forgot-password", {
      email: `nonexistent.${uniqueSuffix}@eec.srmrmp.edu.in`,
    });
    assert(
      unknownEmailRes.status === 200 &&
        unknownEmailRes.data?.message?.includes("If an account exists with this email address"),
      "4. Unregistered email receives identical generic response"
    );

    // 5. Attempt reset with invalid/tampered token
    const invalidTokenRes = await request(
      "POST",
      "/api/auth/reset-password/invalidfakefaketoken1234567890abcdef",
      {
        password: "NewValidPassword#2026",
      }
    );
    assert(
      invalidTokenRes.status === 400 &&
        invalidTokenRes.data?.message?.includes("Invalid or expired"),
      "5. Invalid reset token rejected with HTTP 400"
    );

    // 6. Attempt reset with weak password (e.g. no special char)
    const weakPassRes = await request("POST", `/api/auth/reset-password/${rawToken}`, {
      password: "weakpassword123",
    });
    assert(
      weakPassRes.status === 400 &&
        weakPassRes.data?.message?.includes("special character"),
      "6. Weak password rejected according to institutional security policy"
    );

    // 7. Successful password reset with valid token & strong password
    const newPassword = "BrandNewPassword#2026";
    const validResetRes = await request("POST", `/api/auth/reset-password/${rawToken}`, {
      password: newPassword,
    });
    assert(
      validResetRes.status === 200 &&
        validResetRes.data?.message?.includes("Password reset successfully"),
      "7. Password successfully reset with valid token and strong password"
    );

    // 8. Attempt to reuse already-used token (one-time use check)
    const reuseTokenRes = await request("POST", `/api/auth/reset-password/${rawToken}`, {
      password: "AnotherNewPassword#2026",
    });
    assert(
      reuseTokenRes.status === 400 &&
        reuseTokenRes.data?.message?.includes("Invalid or expired"),
      "8. Reusing an already-used reset token is rejected (HTTP 400)"
    );

    // 9. Login with OLD password should fail (HTTP 401)
    const oldLoginRes = await request("POST", "/api/auth/login", {
      email: studentEmail,
      password: originalPassword,
    });
    assert(
      oldLoginRes.status === 401,
      "9. Login with OLD password rejected (HTTP 401 Unauthorized)"
    );

    // 10. Login with NEW password should succeed (HTTP 200)
    const newLoginRes = await request("POST", "/api/auth/login", {
      email: studentEmail,
      password: newPassword,
    });
    assert(
      newLoginRes.status === 200 && newLoginRes.data?.data?.token,
      "10. Login with NEW password succeeds and returns authenticated JWT token"
    );

    // 11. Test Alumni Role Password Reset
    const alumniEmail = `reset.alumni.${uniqueSuffix}@gmail.com`;
    const alumniReg = await request("POST", "/api/auth/register", {
      name: "Reset Test Alumni",
      email: alumniEmail,
      password: "AlumniPass#2026",
      role: "Alumni",
      department: "Artificial Intelligence and Data Science",
    });
    const alumniForgot = await request("POST", "/api/auth/forgot-password", {
      email: alumniEmail,
    });
    const alumniRawToken = alumniForgot.data?.data?.resetUrl?.split("/reset-password/")[1];
    const alumniReset = await request("POST", `/api/auth/reset-password/${alumniRawToken}`, {
      password: "UpdatedAlumniPass#2026",
    });
    const alumniNewLogin = await request("POST", "/api/auth/login", {
      email: alumniEmail,
      password: "UpdatedAlumniPass#2026",
    });
    assert(
      alumniReset.status === 200 && alumniNewLogin.status === 200,
      "11. Password reset flow verified for Alumni role (@gmail.com)"
    );

    // 12. Test Faculty Role Password Reset
    const facultyEmail = `reset.faculty.${uniqueSuffix}@eec.srmrmp.edu.in`;
    const facultyReg = await request("POST", "/api/auth/register", {
      name: "Reset Test Faculty",
      email: facultyEmail,
      password: "FacultyPass#2026",
      role: "Faculty",
      department: "Artificial Intelligence and Data Science",
    });
    const facultyForgot = await request("POST", "/api/auth/forgot-password", {
      email: facultyEmail,
    });
    const facultyRawToken = facultyForgot.data?.data?.resetUrl?.split("/reset-password/")[1];
    const facultyReset = await request("POST", `/api/auth/reset-password/${facultyRawToken}`, {
      password: "UpdatedFacultyPass#2026",
    });
    const facultyNewLogin = await request("POST", "/api/auth/login", {
      email: facultyEmail,
      password: "UpdatedFacultyPass#2026",
    });
    assert(
      facultyReset.status === 200 && facultyNewLogin.status === 200,
      "12. Password reset flow verified for Faculty role (@eec.srmrmp.edu.in)"
    );

    // 13. Email Service Transporter Check
    const transporter = emailService.getTransporter();
    const isSmtpConfigured = Boolean(transporter);

    console.log("\n==================================================");
    console.log("EMAIL DELIVERY ENVIRONMENT STATUS");
    console.log("==================================================");
    if (isSmtpConfigured) {
      console.log("📧 SMTP Configured: YES (Transporter initialized)");
    } else {
      console.log("ℹ️ SMTP Configured: PENDING DEVELOPER CREDENTIALS");
      console.log("   To enable real outbound email dispatch to inbox, add your Gmail App Password:");
      console.log("   SMTP_USER=your_email@gmail.com");
      console.log("   SMTP_PASS=your_16_char_app_password");
    }

    console.log("\n==================================================");
    console.log("PASSWORD RESET TEST SUMMARY");
    console.log("==================================================");
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    console.log("==================================================\n");
  } catch (err) {
    console.error("Test execution exception:", err);
  }
}

runPasswordResetSuite();
