const axios = require("axios");

const BASE_URL = "http://localhost:5000/api";

async function runAuthTests() {
  console.log("\n==================================================");
  console.log("PHASE 1: AUTHENTICATION & ROLE ACCESS TESTS");
  console.log("==================================================");

  let passed = 0;
  let failed = 0;

  // 1. Student Registration
  try {
    const res = await axios.post(`${BASE_URL}/auth/register`, {
      name: "Test Student " + Date.now(),
      email: `student_${Date.now()}@eec.srmrmp.edu.in`,
      password: "Test@123",
      role: "Student",
    });
    console.log("✅ 1. Student Registration: Passed", res.data.message);
    passed++;
  } catch (e) {
    console.error("❌ 1. Student Registration Failed:", e.response?.data?.message || e.message);
    failed++;
  }

  // 2. Alumni Registration
  try {
    const res = await axios.post(`${BASE_URL}/auth/register`, {
      name: "Test Alumni " + Date.now(),
      email: `alumni_${Date.now()}@gmail.com`,
      password: "Test@123",
      role: "Alumni",
    });
    console.log("✅ 2. Alumni Registration: Passed", res.data.message);
    passed++;
  } catch (e) {
    console.error("❌ 2. Alumni Registration Failed:", e.response?.data?.message || e.message);
    failed++;
  }

  // 3. Faculty Registration
  try {
    const res = await axios.post(`${BASE_URL}/auth/register`, {
      name: "Test Faculty " + Date.now(),
      email: `faculty_${Date.now()}@eec.srmrmp.edu.in`,
      password: "Test@123",
      role: "Faculty",
    });
    console.log("✅ 3. Faculty Registration: Passed", res.data.message);
    passed++;
  } catch (e) {
    console.error("❌ 3. Faculty Registration Failed:", e.response?.data?.message || e.message);
    failed++;
  }

  // 4. Student Login
  let studentToken = null;
  try {
    const res = await axios.post(`${BASE_URL}/auth/login`, {
      email: "rohan.v@student.edu",
      password: "student123",
    });
    studentToken = res.data.data.token;
    console.log("✅ 4. Student Login: Passed (Role:", res.data.data.role + ")");
    passed++;
  } catch (e) {
    console.error("❌ 4. Student Login Failed:", e.response?.data?.message || e.message);
    failed++;
  }

  // 5. Alumni Login
  let alumniToken = null;
  try {
    const res = await axios.post(`${BASE_URL}/auth/login`, {
      email: "arun.kumar@tcs.example.com",
      password: "alumni123",
    });
    alumniToken = res.data.data.token;
    console.log("✅ 5. Alumni Login: Passed (Role:", res.data.data.role + ")");
    passed++;
  } catch (e) {
    console.error("❌ 5. Alumni Login Failed:", e.response?.data?.message || e.message);
    failed++;
  }

  // 6. Faculty Login
  let facultyToken = null;
  try {
    const res = await axios.post(`${BASE_URL}/auth/login`, {
      email: "meenakshi.s@college.edu",
      password: "faculty123",
    });
    facultyToken = res.data.data.token;
    console.log("✅ 6. Faculty Login: Passed (Role:", res.data.data.role + ")");
    passed++;
  } catch (e) {
    console.error("❌ 6. Faculty Login Failed:", e.response?.data?.message || e.message);
    failed++;
  }

  // 7. Admin Login
  let adminToken = null;
  try {
    const res = await axios.post(`${BASE_URL}/auth/login`, {
      email: "admin@college.edu",
      password: "admin123",
    });
    adminToken = res.data.data.token;
    console.log("✅ 7. Admin Login: Passed (Role:", res.data.data.role + ")");
    passed++;
  } catch (e) {
    console.error("❌ 7. Admin Login Failed:", e.response?.data?.message || e.message);
    failed++;
  }

  // 8. Invalid Login (Wrong Password)
  try {
    await axios.post(`${BASE_URL}/auth/login`, {
      email: "rohan.v@student.edu",
      password: "WRONG_PASSWORD_XYZ",
    });
    console.error("❌ 8. Invalid Login check failed (Should have thrown 401)");
    failed++;
  } catch (e) {
    if (e.response?.status === 401) {
      console.log("✅ 8. Invalid Login: Passed (Properly rejected with 401 Unauthorized)");
      passed++;
    } else {
      console.error("❌ 8. Unexpected response:", e.message);
      failed++;
    }
  }

  // 9. /api/auth/me with Token
  try {
    const res = await axios.get(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    console.log("✅ 9. /api/auth/me: Passed (User:", res.data.data.user?.name + ")");
    passed++;
  } catch (e) {
    console.error("❌ 9. /api/auth/me Failed:", e.response?.data?.message || e.message);
    failed++;
  }

  // 10. Unauthorized API Access without Token
  try {
    await axios.get(`${BASE_URL}/student/profile`);
    console.error("❌ 10. Unauthorized access check failed (Should have blocked without token)");
    failed++;
  } catch (e) {
    if (e.response?.status === 401) {
      console.log("✅ 10. Unauthorized API access blocked: Passed (HTTP 401)");
      passed++;
    } else {
      console.error("❌ 10. Unexpected status:", e.message);
      failed++;
    }
  }

  console.log(`\nPhase 1 Results: ${passed} Passed, ${failed} Failed`);
}

runAuthTests();
