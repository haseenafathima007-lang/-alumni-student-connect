const axios = require("axios");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../.env") });

const BASE_URL = `http://localhost:${process.env.PORT || 5000}/api`;

async function runComprehensiveTests() {
  console.log("==================================================");
  console.log("🧪 RUNNING COMPREHENSIVE REGISTRATION & AUTH VALIDATION TESTS");
  console.log("==================================================\n");

  const results = [];
  const timestamp = Date.now();

  async function testRegistration({ testName, payload, expectedStatus, expectedSuccess, expectedErrorSubstr }) {
    try {
      const res = await axios.post(`${BASE_URL}/auth/register`, payload);
      const isStatusMatch = res.status === expectedStatus;
      const isSuccessMatch = res.data.success === expectedSuccess;

      if (isStatusMatch && isSuccessMatch && expectedSuccess) {
        console.log(`✅ PASS: ${testName} (Status ${res.status})`);
        results.push({ name: testName, pass: true });
      } else {
        console.log(`❌ FAIL: ${testName} - Unexpected response:`, res.data);
        results.push({ name: testName, pass: false, reason: "Unexpected success" });
      }
    } catch (err) {
      const status = err.response?.status;
      const errorMessage = err.response?.data?.message || err.message;
      const isStatusMatch = status === expectedStatus;
      const isErrorMsgMatch = expectedErrorSubstr ? errorMessage.includes(expectedErrorSubstr) : true;

      if (isStatusMatch && !expectedSuccess && isErrorMsgMatch) {
        console.log(`✅ PASS: ${testName} (Status ${status}, Msg: "${errorMessage}")`);
        results.push({ name: testName, pass: true });
      } else {
        console.log(`❌ FAIL: ${testName} (Got ${status}, Expected ${expectedStatus}. Msg: "${errorMessage}")`);
        results.push({ name: testName, pass: false, reason: errorMessage });
      }
    }
  }

  // --- 1. STUDENT REGISTRATION TESTS ---
  console.log("--- 1. STUDENT EMAIL VALIDATION ---");
  await testRegistration({
    testName: "Student Valid (student123@eec.srmrmp.edu.in)",
    payload: {
      name: "Student One",
      email: `student123_${timestamp}@eec.srmrmp.edu.in`,
      password: "Test@123",
      role: "Student",
      department: "Artificial Intelligence and Data Science",
    },
    expectedStatus: 201,
    expectedSuccess: true,
  });

  await testRegistration({
    testName: "Student Invalid (student@gmail.com)",
    payload: {
      name: "Student Bad",
      email: `student_${timestamp}@gmail.com`,
      password: "Test@123",
      role: "Student",
    },
    expectedStatus: 400,
    expectedSuccess: false,
    expectedErrorSubstr: "Please use your official college email ending with @eec.srmrmp.edu.in.",
  });

  await testRegistration({
    testName: "Student Invalid (student@yahoo.com)",
    payload: {
      name: "Student Yahoo",
      email: `student_${timestamp}@yahoo.com`,
      password: "Test@123",
      role: "Student",
    },
    expectedStatus: 400,
    expectedSuccess: false,
    expectedErrorSubstr: "Please use your official college email ending with @eec.srmrmp.edu.in.",
  });

  await testRegistration({
    testName: "Student Invalid (student@outlook.com)",
    payload: {
      name: "Student Outlook",
      email: `student_${timestamp}@outlook.com`,
      password: "Test@123",
      role: "Student",
    },
    expectedStatus: 400,
    expectedSuccess: false,
    expectedErrorSubstr: "Please use your official college email ending with @eec.srmrmp.edu.in.",
  });

  // --- 2. FACULTY REGISTRATION TESTS ---
  console.log("\n--- 2. FACULTY EMAIL VALIDATION ---");
  await testRegistration({
    testName: "Faculty Valid (faculty@eec.srmrmp.edu.in)",
    payload: {
      name: "Faculty One",
      email: `faculty_${timestamp}@eec.srmrmp.edu.in`,
      password: "Test@123",
      role: "Faculty",
      department: "Computer Science and Engineering",
    },
    expectedStatus: 201,
    expectedSuccess: true,
  });

  await testRegistration({
    testName: "Faculty Invalid (faculty@gmail.com)",
    payload: {
      name: "Faculty Gmail",
      email: `faculty_${timestamp}@gmail.com`,
      password: "Test@123",
      role: "Faculty",
    },
    expectedStatus: 400,
    expectedSuccess: false,
    expectedErrorSubstr: "Please use your official college email ending with @eec.srmrmp.edu.in.",
  });

  await testRegistration({
    testName: "Faculty Invalid (faculty@yahoo.com)",
    payload: {
      name: "Faculty Yahoo",
      email: `faculty_${timestamp}@yahoo.com`,
      password: "Test@123",
      role: "Faculty",
    },
    expectedStatus: 400,
    expectedSuccess: false,
    expectedErrorSubstr: "Please use your official college email ending with @eec.srmrmp.edu.in.",
  });

  // --- 3. ALUMNI REGISTRATION TESTS ---
  console.log("\n--- 3. ALUMNI EMAIL VALIDATION ---");
  await testRegistration({
    testName: "Alumni Valid (alumni@gmail.com)",
    payload: {
      name: "Alumni One",
      email: `alumni_${timestamp}@gmail.com`,
      password: "Test@123",
      role: "Alumni",
      department: "Information Technology",
    },
    expectedStatus: 201,
    expectedSuccess: true,
  });

  await testRegistration({
    testName: "Alumni Invalid (alumni@eec.srmrmp.edu.in)",
    payload: {
      name: "Alumni College Email",
      email: `alumni_${timestamp}@eec.srmrmp.edu.in`,
      password: "Test@123",
      role: "Alumni",
    },
    expectedStatus: 400,
    expectedSuccess: false,
    expectedErrorSubstr: "Please use a Gmail address ending with @gmail.com.",
  });

  await testRegistration({
    testName: "Alumni Invalid (alumni@yahoo.com)",
    payload: {
      name: "Alumni Yahoo",
      email: `alumni_${timestamp}@yahoo.com`,
      password: "Test@123",
      role: "Alumni",
    },
    expectedStatus: 400,
    expectedSuccess: false,
    expectedErrorSubstr: "Please use a Gmail address ending with @gmail.com.",
  });

  // --- 4. PASSWORD VALIDATION TESTS ---
  console.log("\n--- 4. PASSWORD VALIDATION TESTS ---");
  await testRegistration({
    testName: "Password Valid (Test@123)",
    payload: {
      name: "Password Valid User",
      email: `pwd_valid_${timestamp}@gmail.com`,
      password: "Test@123",
      role: "Alumni",
    },
    expectedStatus: 201,
    expectedSuccess: true,
  });

  await testRegistration({
    testName: "Password Invalid: test123 (No special char)",
    payload: {
      name: "Bad Pwd",
      email: `pwd_bad1_${timestamp}@gmail.com`,
      password: "test123",
      role: "Alumni",
    },
    expectedStatus: 400,
    expectedSuccess: false,
    expectedErrorSubstr: "Password must be at least 8 characters and contain at least 1 letter, 1 number, and 1 special character.",
  });

  await testRegistration({
    testName: "Password Invalid: TestTest (No number, no special char)",
    payload: {
      name: "Bad Pwd",
      email: `pwd_bad2_${timestamp}@gmail.com`,
      password: "TestTest",
      role: "Alumni",
    },
    expectedStatus: 400,
    expectedSuccess: false,
    expectedErrorSubstr: "Password must be at least 8 characters and contain at least 1 letter, 1 number, and 1 special character.",
  });

  await testRegistration({
    testName: "Password Invalid: 12345678 (No letter, no special char)",
    payload: {
      name: "Bad Pwd",
      email: `pwd_bad3_${timestamp}@gmail.com`,
      password: "12345678",
      role: "Alumni",
    },
    expectedStatus: 400,
    expectedSuccess: false,
    expectedErrorSubstr: "Password must be at least 8 characters and contain at least 1 letter, 1 number, and 1 special character.",
  });

  await testRegistration({
    testName: "Password Invalid: Test@ (shorter than 8 chars, no number)",
    payload: {
      name: "Bad Pwd",
      email: `pwd_bad4_${timestamp}@gmail.com`,
      password: "Test@",
      role: "Alumni",
    },
    expectedStatus: 400,
    expectedSuccess: false,
    expectedErrorSubstr: "Password must be at least 8 characters and contain at least 1 letter, 1 number, and 1 special character.",
  });

  await testRegistration({
    testName: "Password Invalid: College123 (No special char)",
    payload: {
      name: "Bad Pwd",
      email: `pwd_bad5_${timestamp}@gmail.com`,
      password: "College123",
      role: "Alumni",
    },
    expectedStatus: 400,
    expectedSuccess: false,
    expectedErrorSubstr: "Password must be at least 8 characters and contain at least 1 letter, 1 number, and 1 special character.",
  });

  // --- 5. EDGE CASES & GENERAL VALIDATION ---
  console.log("\n--- 5. EDGE CASES & SANITIZATION ---");
  await testRegistration({
    testName: "Spaces before/after email (trimmed successfully)",
    payload: {
      name: "Space User",
      email: `  spaced_${timestamp}@eec.srmrmp.edu.in  `,
      password: "Test@123",
      role: "Student",
    },
    expectedStatus: 201,
    expectedSuccess: true,
  });

  await testRegistration({
    testName: "Uppercase domain email (CASE@EEC.SRMRMP.EDU.IN normalized)",
    payload: {
      name: "Upper User",
      email: `UPPER_${timestamp}@EEC.SRMRMP.EDU.IN`,
      password: "Test@123",
      role: "Student",
    },
    expectedStatus: 201,
    expectedSuccess: true,
  });

  await testRegistration({
    testName: "Duplicate email rejection with friendly message",
    payload: {
      name: "Duplicate User",
      email: `alumni_${timestamp}@gmail.com`,
      password: "Test@123",
      role: "Alumni",
    },
    expectedStatus: 400,
    expectedSuccess: false,
    expectedErrorSubstr: "This email is already registered. Please use another email or login.",
  });

  await testRegistration({
    testName: "Admin public registration blocked",
    payload: {
      name: "Admin Attempt",
      email: `admin_hack_${timestamp}@eec.srmrmp.edu.in`,
      password: "Test@123",
      role: "Admin",
    },
    expectedStatus: 400,
    expectedSuccess: false,
    expectedErrorSubstr: "Admin accounts cannot be created via public registration.",
  });

  console.log("\n==================================================");
  const total = results.length;
  const passed = results.filter((r) => r.pass).length;
  console.log(`📊 TEST SUMMARY: ${passed}/${total} Passed (${Math.round((passed / total) * 100)}%)`);
  console.log("==================================================");

  if (passed === total) {
    console.log("🎉 ALL TESTS PASSED WITH 100% SUCCESS RATE!");
  } else {
    console.error("❌ SOME TESTS FAILED.");
    process.exit(1);
  }
}

runComprehensiveTests();
