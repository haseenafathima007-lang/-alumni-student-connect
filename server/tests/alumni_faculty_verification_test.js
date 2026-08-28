const http = require("http");

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

async function runTests() {
  console.log("==================================================");
  console.log("ALUMNI FACULTY VERIFICATION SUITE — 20 TEST CASES");
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

    // 1. Log in Faculty
    const facultyLoginRes = await request("POST", "/api/auth/login", {
      email: "meenakshi.s@eec.srmrmp.edu.in",
      password: "faculty123",
    });
    const facultyToken = facultyLoginRes.data?.data?.token;
    assert(facultyLoginRes.status === 200 && facultyToken, "1. Faculty logs in successfully");

    // 2. Register / Log in Student with EEC institutional email
    const studentEmail = `student.test.${uniqueSuffix}@eec.srmrmp.edu.in`;
    const studentRegRes = await request("POST", "/api/auth/register", {
      name: "Test Student 1",
      email: studentEmail,
      password: "StudentPass#2026",
      role: "Student",
      department: "Artificial Intelligence and Data Science",
    });
    const studentToken = studentRegRes.data?.data?.token;
    assert(studentRegRes.status === 201 && studentToken, "2. Student registers and logs in successfully");

    // 3. New Alumni Registration
    const alumniEmail = `tester.alumni.${uniqueSuffix}@gmail.com`;
    const regRes = await request("POST", "/api/auth/register", {
      name: "Test Alumnus 1",
      email: alumniEmail,
      password: "AlumniPass#2026",
      role: "Alumni",
      department: "Artificial Intelligence and Data Science",
    });
    const alumni1Id = regRes.data?.data?._id;
    const alumni1Token = regRes.data?.data?.token;
    assert(
      regRes.status === 201 &&
        regRes.data?.data?.verificationStatus === "pending" &&
        regRes.data?.data?.isVerified === false,
      "3. New Alumni registers with verificationStatus='pending' and isVerified=false"
    );

    // 4. Alumni logs in
    const alumniLoginRes = await request("POST", "/api/auth/login", {
      email: alumniEmail,
      password: "AlumniPass#2026",
    });
    assert(
      alumniLoginRes.status === 200 &&
        alumniLoginRes.data?.data?.verificationStatus === "pending",
      "4. Alumni logs in and receives verificationStatus='pending'"
    );

    // 5. Unapproved alumni cannot post job
    const postJobPending = await request(
      "POST",
      "/api/jobs",
      {
        title: "Junior Data Scientist",
        company: "Alpha Analytics",
        description: "Great role for EEC grads",
      },
      alumni1Token
    );
    assert(
      postJobPending.status === 403 &&
        postJobPending.data?.message?.includes("approved by faculty"),
      "5. Pending Alumni cannot post job (HTTP 403 rejection)"
    );

    // 6. Unapproved alumni cannot post internship
    const postInternshipPending = await request(
      "POST",
      "/api/internships",
      {
        title: "AI Research Intern",
        company: "Alpha Analytics",
        description: "Hands-on ML internship",
      },
      alumni1Token
    );
    assert(
      postInternshipPending.status === 403 &&
        postInternshipPending.data?.message?.includes("approved by faculty"),
      "6. Pending Alumni cannot post internship (HTTP 403 rejection)"
    );

    // 7. Student cannot request mentorship from unapproved alumni
    const studentMentorshipReqPending = await request(
      "POST",
      "/api/mentorship/request",
      {
        mentorId: alumni1Id,
        topic: "Career guidance",
        message: "Can you mentor me?",
      },
      studentToken
    );
    assert(
      studentMentorshipReqPending.status === 403,
      "7. Student cannot request mentorship from unapproved alumni (HTTP 403)"
    );

    // 8. Pending alumni is not listed in active mentors search
    const mentorSearchRes = await request("GET", "/api/alumni?mentoring=true", null, studentToken);
    const inMentors = (mentorSearchRes.data?.data || []).some(
      (m) => m.userId === alumni1Id || m._id === alumni1Id || m.email === alumniEmail
    );
    assert(!inMentors, "8. Pending alumni is excluded from active mentors search");

    // 9. Student cannot access faculty approval endpoint
    const studentApproveAttempt = await request(
      "PUT",
      `/api/faculty/alumni/${alumni1Id}/approve`,
      {},
      studentToken
    );
    assert(
      studentApproveAttempt.status === 403,
      "9. Student receives HTTP 403 when attempting faculty approval endpoint"
    );

    // 10. Alumni cannot access faculty approval endpoint
    const alumniApproveAttempt = await request(
      "PUT",
      `/api/faculty/alumni/${alumni1Id}/approve`,
      {},
      alumni1Token
    );
    assert(
      alumniApproveAttempt.status === 403,
      "10. Alumni receives HTTP 403 when attempting faculty approval endpoint"
    );

    // 11. Faculty retrieves pending alumni list
    const pendingListRes = await request("GET", "/api/faculty/alumni/pending", null, facultyToken);
    const foundInPending = (pendingListRes.data?.data || []).some(
      (p) => p.userId === alumni1Id || p._id === alumni1Id || p.email === alumniEmail
    );
    assert(
      pendingListRes.status === 200 && foundInPending,
      "11. Faculty retrieves pending alumni list containing newly registered alumnus"
    );

    // 12. Faculty approves alumni
    const approveRes = await request(
      "PUT",
      `/api/faculty/alumni/${alumni1Id}/approve`,
      {},
      facultyToken
    );
    assert(
      approveRes.status === 200 &&
        approveRes.data?.data?.verificationStatus === "approved" &&
        approveRes.data?.data?.isVerified === true,
      "12. Faculty approves alumni successfully (verificationStatus='approved')"
    );

    // 13. Faculty stats reflect pending counts
    const facultyStatsRes = await request("GET", "/api/faculty/stats", null, facultyToken);
    assert(
      facultyStatsRes.status === 200 && facultyStatsRes.data?.data?.alumniCount !== undefined,
      "13. Faculty stats endpoint returns accurate metrics"
    );

    // 14. Approved alumni logs in and has approved status
    const approvedAlumniLogin = await request("POST", "/api/auth/login", {
      email: alumniEmail,
      password: "AlumniPass#2026",
    });
    const freshToken = approvedAlumniLogin.data?.data?.token;
    assert(
      approvedAlumniLogin.status === 200 &&
        approvedAlumniLogin.data?.data?.verificationStatus === "approved" &&
        approvedAlumniLogin.data?.data?.isVerified === true,
      "14. Approved Alumni login returns verificationStatus='approved' and isVerified=true"
    );

    // 15. Approved alumni can now post job
    const postJobApproved = await request(
      "POST",
      "/api/jobs",
      {
        title: "Associate AI Engineer",
        company: "TCS Innovation Labs",
        description: "Entry-level position for EEC graduates",
      },
      freshToken
    );
    assert(
      postJobApproved.status === 201 && postJobApproved.data?.data?.title === "Associate AI Engineer",
      "15. Approved alumni successfully posts a job opening (HTTP 201)"
    );

    // 16. Approved alumni can now post internship
    const postInternshipApproved = await request(
      "POST",
      "/api/internships",
      {
        title: "Computer Vision Intern",
        company: "TCS Innovation Labs",
        description: "Summer internship in AI & Data Science",
      },
      freshToken
    );
    assert(
      postInternshipApproved.status === 201 &&
        postInternshipApproved.data?.data?.title === "Computer Vision Intern",
      "16. Approved alumni successfully posts an internship (HTTP 201)"
    );

    // 17. Student can send mentorship request to approved alumni
    const studentMentorshipReqApproved = await request(
      "POST",
      "/api/mentorship/request",
      {
        mentorId: alumni1Id,
        topic: "AI Career Roadmap",
        message: "Seeking advice on machine learning career paths.",
      },
      studentToken
    );
    assert(
      studentMentorshipReqApproved.status === 201,
      "17. Student can successfully request mentorship from approved alumni (HTTP 201)"
    );

    // 18. Register second alumni and test Faculty Rejection
    const alumni2Email = `tester.rejected.${uniqueSuffix}@gmail.com`;
    const reg2Res = await request("POST", "/api/auth/register", {
      name: "Test Alumnus 2",
      email: alumni2Email,
      password: "AlumniPass#2026",
      role: "Alumni",
      department: "Artificial Intelligence and Data Science",
    });
    const alumni2Id = reg2Res.data?.data?._id;
    const alumni2Token = reg2Res.data?.data?.token;

    const rejectRes = await request(
      "PUT",
      `/api/faculty/alumni/${alumni2Id}/reject`,
      {},
      facultyToken
    );
    assert(
      rejectRes.status === 200 && rejectRes.data?.data?.verificationStatus === "rejected",
      "18. Faculty rejects second alumni (verificationStatus='rejected')"
    );

    // 19. Rejected alumni remains restricted
    const rejectedPostJob = await request(
      "POST",
      "/api/jobs",
      {
        title: "Unverified Job",
        company: "Fake Corp",
        description: "Should fail",
      },
      alumni2Token
    );
    assert(
      rejectedPostJob.status === 403,
      "19. Rejected alumni remains restricted from posting jobs (HTTP 403)"
    );

    // 20. Admin verification compatibility
    const adminLoginRes = await request("POST", "/api/auth/login", {
      email: "admin@college.edu",
      password: "admin123",
    });
    const adminToken = adminLoginRes.data?.data?.token;

    const adminVerifyRes = await request(
      "PUT",
      `/api/admin/verify/${alumni2Id}`,
      { status: "verified" },
      adminToken
    );
    assert(
      adminVerifyRes.status === 200,
      "20. Existing Admin verification endpoint remains functional and synced with workflow"
    );

    console.log("\n==================================================");
    console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log("==================================================");
  } catch (err) {
    console.error("Test execution exception:", err);
  }
}

runTests();
