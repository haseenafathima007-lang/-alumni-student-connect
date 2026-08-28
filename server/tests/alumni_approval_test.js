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

async function runAlumniApprovalSuite() {
  console.log("==================================================");
  console.log("ALUMNI FACULTY APPROVAL WORKFLOW — COMPREHENSIVE SUITE");
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

    // 1. Register new Student with EEC domain
    const studentEmail = `student.${uniqueSuffix}@eec.srmrmp.edu.in`;
    const studentRegRes = await request("POST", "/api/auth/register", {
      name: "Student Candidate",
      email: studentEmail,
      password: "StudentPass#2026",
      role: "Student",
      department: "Artificial Intelligence and Data Science",
    });
    const studentToken = studentRegRes.data?.data?.token;
    assert(
      studentRegRes.status === 201 && studentToken,
      "1. Student registers successfully with institutional email"
    );

    // 2. Faculty authentication
    const facultyLoginRes = await request("POST", "/api/auth/login", {
      email: "meenakshi.s@eec.srmrmp.edu.in",
      password: "faculty123",
    });
    const facultyToken = facultyLoginRes.data?.data?.token;
    assert(
      facultyLoginRes.status === 200 && facultyToken,
      "2. Faculty authenticates and obtains authorized token"
    );

    // 3. Alumni Registration
    const alumniEmail = `alumnus.primary.${uniqueSuffix}@gmail.com`;
    const alumniRegRes = await request("POST", "/api/auth/register", {
      name: "EEC Alumnus Primary",
      email: alumniEmail,
      password: "AlumniPass#2026",
      role: "Alumni",
      department: "Artificial Intelligence and Data Science",
    });
    const alumni1Id = alumniRegRes.data?.data?._id;
    const alumni1Token = alumniRegRes.data?.data?.token;
    assert(
      alumniRegRes.status === 201 &&
        alumniRegRes.data?.data?.verificationStatus === "pending" &&
        alumniRegRes.data?.data?.isVerified === false,
      "3. Alumni registers with verificationStatus='pending' and isVerified=false"
    );

    // 4. Pending Alumni cannot post job
    const postJobPending = await request(
      "POST",
      "/api/jobs",
      {
        title: "Software Engineer",
        company: "Google",
        description: "Campus recruitment",
      },
      alumni1Token
    );
    assert(
      postJobPending.status === 403 &&
        postJobPending.data?.message?.includes("pending faculty approval"),
      "4. Pending alumni blocked from posting jobs (HTTP 403)"
    );

    // 5. Pending Alumni cannot post internship
    const postInternshipPending = await request(
      "POST",
      "/api/internships",
      {
        title: "AI Engineer Intern",
        company: "Microsoft",
        description: "Summer internship",
      },
      alumni1Token
    );
    assert(
      postInternshipPending.status === 403 &&
        postInternshipPending.data?.message?.includes("pending faculty approval"),
      "5. Pending alumni blocked from posting internships (HTTP 403)"
    );

    // 6. Pending Alumni cannot enable mentoring
    const enableMentoringPending = await request(
      "PUT",
      "/api/alumni/profile",
      {
        isMentoring: true,
      },
      alumni1Token
    );
    assert(
      enableMentoringPending.status === 403 &&
        enableMentoringPending.data?.message?.includes("approved by faculty before enabling mentorship"),
      "6. Pending alumni blocked from enabling mentoring status (HTTP 403)"
    );

    // 7. Pending Alumni is excluded from active mentors search
    const mentorSearchRes = await request("GET", "/api/alumni?mentoring=true", null, studentToken);
    const inMentorsList = (mentorSearchRes.data?.data || []).some(
      (m) => m.userId === alumni1Id || m._id === alumni1Id || m.email === alumniEmail
    );
    assert(!inMentorsList, "7. Pending alumni does NOT appear in active mentor directory");

    // 8. Faculty views pending alumni queue
    const pendingQueueRes = await request("GET", "/api/faculty/alumni/pending", null, facultyToken);
    const inPendingQueue = (pendingQueueRes.data?.data || []).some(
      (p) => p.userId === alumni1Id || p._id === alumni1Id || p.email === alumniEmail
    );
    assert(
      pendingQueueRes.status === 200 && inPendingQueue,
      "8. Pending alumni appears in Faculty verification queue"
    );

    // 9. Unauthorized approval attempts blocked
    const studentApproveAttempt = await request(
      "PUT",
      `/api/faculty/alumni/${alumni1Id}/approve`,
      {},
      studentToken
    );
    const alumniApproveAttempt = await request(
      "PUT",
      `/api/faculty/alumni/${alumni1Id}/approve`,
      {},
      alumni1Token
    );
    assert(
      studentApproveAttempt.status === 403 && alumniApproveAttempt.status === 403,
      "9. Student & Alumni unauthorized approval attempts rejected with HTTP 403"
    );

    // 10. Faculty approves alumni
    const approveRes = await request(
      "PUT",
      `/api/faculty/alumni/${alumni1Id}/approve`,
      {},
      facultyToken
    );
    assert(
      approveRes.status === 200 &&
        approveRes.data?.data?.verificationStatus === "approved" &&
        approveRes.data?.data?.isVerified === true &&
        approveRes.data?.data?.verifiedBy,
      "10. Faculty approves alumni (verificationStatus='approved', isVerified=true, verifiedBy stored)"
    );

    // 11. Approved Alumni logs in and receives verified status
    const approvedLoginRes = await request("POST", "/api/auth/login", {
      email: alumniEmail,
      password: "AlumniPass#2026",
    });
    const approvedToken = approvedLoginRes.data?.data?.token;
    assert(
      approvedLoginRes.status === 200 &&
        approvedLoginRes.data?.data?.verificationStatus === "approved" &&
        approvedLoginRes.data?.data?.isVerified === true,
      "11. Approved alumni logs in with verified status"
    );

    // 12. Approved Alumni posts job successfully
    const postJobApproved = await request(
      "POST",
      "/api/jobs",
      {
        title: "Senior AI Researcher",
        company: "Zoho Corporation",
        description: "Placement opportunity for AI & DS graduates",
      },
      approvedToken
    );
    assert(
      postJobApproved.status === 201 && postJobApproved.data?.data?.title === "Senior AI Researcher",
      "12. Approved alumni successfully posts a job opportunity (HTTP 201)"
    );

    // 13. Approved Alumni posts internship successfully
    const postIntApproved = await request(
      "POST",
      "/api/internships",
      {
        title: "Machine Learning Intern",
        company: "Zoho Corporation",
        description: "6 month internship with pre-placement offer",
      },
      approvedToken
    );
    assert(
      postIntApproved.status === 201 &&
        postIntApproved.data?.data?.title === "Machine Learning Intern",
      "13. Approved alumni successfully posts an internship (HTTP 201)"
    );

    // 14. Approved Alumni enables mentoring & student sends request
    await request("PUT", "/api/alumni/profile", { isMentoring: true }, approvedToken);
    const studentMentorshipRes = await request(
      "POST",
      "/api/mentorship/request",
      {
        mentorId: alumni1Id,
        topic: "Machine Learning Career Preparation",
        message: "Requesting guidance on AI industry applications.",
      },
      studentToken
    );
    assert(
      studentMentorshipRes.status === 201,
      "14. Student can send mentorship requests to approved and verified alumni (HTTP 201)"
    );

    // 15. Faculty rejection workflow with reason
    const alumni2Email = `alumnus.rejected.${uniqueSuffix}@gmail.com`;
    const alumni2Reg = await request("POST", "/api/auth/register", {
      name: "EEC Alumnus Secondary",
      email: alumni2Email,
      password: "AlumniPass#2026",
      role: "Alumni",
      department: "Artificial Intelligence and Data Science",
    });
    const alumni2Id = alumni2Reg.data?.data?._id;
    const alumni2Token = alumni2Reg.data?.data?.token;

    const rejectRes = await request(
      "PUT",
      `/api/faculty/alumni/${alumni2Id}/reject`,
      { rejectionReason: "Degree proof incomplete. Please re-upload verified certificate." },
      facultyToken
    );
    assert(
      rejectRes.status === 200 &&
        rejectRes.data?.data?.verificationStatus === "rejected" &&
        rejectRes.data?.data?.rejectionReason?.includes("Degree proof incomplete"),
      "15. Faculty rejects alumni with custom rejection reason recorded in DB"
    );

    // 16. Rejected Alumni privilege rejection
    const rejectedJobAttempt = await request(
      "POST",
      "/api/jobs",
      { title: "Invalid Job", company: "None", description: "Test" },
      alumni2Token
    );
    assert(
      rejectedJobAttempt.status === 403 &&
        rejectedJobAttempt.data?.message?.includes("rejected"),
      "16. Rejected alumni blocked from posting jobs with rejection message (HTTP 403)"
    );

    console.log("\n============================");
    console.log("ALUMNI APPROVAL TEST RESULTS");
    console.log("============================");
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}\n`);
  } catch (err) {
    console.error("Test execution exception:", err);
  }
}

runAlumniApprovalSuite();
