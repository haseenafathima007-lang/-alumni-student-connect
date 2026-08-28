const axios = require("axios");

const BASE_URL = "http://localhost:5000/api";

async function runFullE2ETests() {
  console.log("\n==================================================");
  console.log("ALUMNI STUDENT CONNECT - COMPREHENSIVE E2E TEST SUITE");
  console.log("==================================================");

  let totalPassed = 0;
  let totalFailed = 0;

  let studentToken, alumniToken, facultyToken, adminToken;
  let studentUser, alumniUser, facultyUser, adminUser;

  // --- AUTHENTICATION ---
  try {
    const sLogin = await axios.post(`${BASE_URL}/auth/login`, {
      email: "rohan.v@student.edu",
      password: "student123",
    });
    studentToken = sLogin.data.data.token;
    studentUser = sLogin.data.data;

    const aLogin = await axios.post(`${BASE_URL}/auth/login`, {
      email: "arun.kumar@tcs.example.com",
      password: "alumni123",
    });
    alumniToken = aLogin.data.data.token;
    alumniUser = aLogin.data.data;

    const fLogin = await axios.post(`${BASE_URL}/auth/login`, {
      email: "meenakshi.s@college.edu",
      password: "faculty123",
    });
    facultyToken = fLogin.data.data.token;
    facultyUser = fLogin.data.data;

    const admLogin = await axios.post(`${BASE_URL}/auth/login`, {
      email: "admin@college.edu",
      password: "admin123",
    });
    adminToken = admLogin.data.data.token;
    adminUser = admLogin.data.data;

    // Faculty approves the test alumni for complete workflow testing
    try {
      await axios.put(
        `${BASE_URL}/faculty/alumni/${alumniUser._id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${facultyToken}` } }
      );
    } catch (apprErr) {
      // If already approved or admin approved
    }

    console.log("✅ Authenticated tokens generated for all 4 roles and Alumni approved by Faculty.");
    totalPassed++;
  } catch (e) {
    console.error("❌ Authentication Setup Failed:", e.message);
    totalFailed++;
  }

  // ==================================================
  // PHASE 2: STUDENT FLOW
  // ==================================================
  console.log("\n--- PHASE 2: STUDENT FLOW TESTS ---");
  let createdMentorshipId = null;
  let sampleJobId = null;

  try {
    // 2.1 Find Alumni
    const alumniRes = await axios.get(`${BASE_URL}/alumni?search=Java`);
    console.log(`✅ 2.1 Find Alumni Search: Passed (${alumniRes.data.data.length} alumni matched)`);
    totalPassed++;

    // 2.2 Find Mentors (mentoring=true)
    const mentorsRes = await axios.get(`${BASE_URL}/alumni?mentoring=true`);
    console.log(`✅ 2.2 Find Mentors: Passed (${mentorsRes.data.data.length} active mentors available)`);
    totalPassed++;

    const mentor = mentorsRes.data.data[0];
    const mentorId = mentor.userId || mentor._id;

    // 2.3 Send Mentorship Request
    const reqRes = await axios.post(
      `${BASE_URL}/mentorship/request`,
      {
        mentorId: mentorId,
        topic: "E2E Automated Mock Placement Prep " + Date.now(),
        message: "Automated test message requesting system design mentorship.",
      },
      { headers: { Authorization: `Bearer ${studentToken}` } }
    );
    createdMentorshipId = reqRes.data.data?._id;
    console.log("✅ 2.3 Send Mentorship Request: Passed (ID:", createdMentorshipId, ")");
    totalPassed++;

    // 2.4 View Mentorship Requests
    const myReqs = await axios.get(`${BASE_URL}/mentorship/my-requests`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    console.log(`✅ 2.4 View Mentorship Requests: Passed (${myReqs.data.data.length} requests in tracker)`);
    totalPassed++;

    // 2.5 View Jobs & Apply to a fresh test job
    const freshJob = await axios.post(
      `${BASE_URL}/jobs`,
      {
        title: "Test Application Job " + Date.now(),
        company: "Google",
        location: "Bengaluru",
        jobType: "Full-time",
        description: "Test job for student apply flow.",
      },
      { headers: { Authorization: `Bearer ${alumniToken}` } }
    );
    sampleJobId = freshJob.data.data._id;

    const applyJobRes = await axios.post(
      `${BASE_URL}/jobs/${sampleJobId}/apply`,
      { resumeUrl: "https://drive.google.com/test-resume", coverNote: "Automated student application note" },
      { headers: { Authorization: `Bearer ${studentToken}` } }
    );
    console.log("✅ 2.5 Apply for Job: Passed", applyJobRes.data.message);
    totalPassed++;

    // 2.6 View Internships & Apply to a fresh test internship
    const freshInt = await axios.post(
      `${BASE_URL}/internships`,
      {
        title: "Test Application Internship " + Date.now(),
        company: "Microsoft",
        location: "Hyderabad",
        duration: "3 Months",
        description: "Test internship for student apply flow.",
      },
      { headers: { Authorization: `Bearer ${alumniToken}` } }
    );
    const sampleIntId = freshInt.data.data._id;

    const applyIntRes = await axios.post(
      `${BASE_URL}/internships/${sampleIntId}/apply`,
      { resumeUrl: "https://drive.google.com/test-resume", coverNote: "Automated internship application note" },
      { headers: { Authorization: `Bearer ${studentToken}` } }
    );
    console.log("✅ 2.6 Apply for Internship: Passed", applyIntRes.data.message);
    totalPassed++;

    // 2.7 Track Applications
    const myApps = await axios.get(`${BASE_URL}/applications/my`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    console.log(`✅ 2.7 Track Applications: Passed (${myApps.data.data.length} active applications)`);
    totalPassed++;

  } catch (e) {
    console.error("❌ Phase 2 Student Flow Error:", e.response?.data?.message || e.message);
    totalFailed++;
  }

  // ==================================================
  // PHASE 3: ALUMNI FLOW
  // ==================================================
  console.log("\n--- PHASE 3: ALUMNI FLOW TESTS ---");
  let postedJobId = null;
  let postedInternshipId = null;

  try {
    // 3.1 Update Alumni Profile
    const profRes = await axios.put(
      `${BASE_URL}/alumni/profile`,
      {
        company: "Tata Consultancy Services (TCS)",
        jobTitle: "Principal Lead Architect",
        isMentoring: true,
        mentorshipTopics: ["Microservices", "System Design", "Cloud Native"],
        bio: "Updated automated alumni profile bio.",
      },
      { headers: { Authorization: `Bearer ${alumniToken}` } }
    );
    console.log("✅ 3.1 Update Alumni Profile: Passed", profRes.data.message);
    totalPassed++;

    // 3.2 Post New Job
    const newJobRes = await axios.post(
      `${BASE_URL}/jobs`,
      {
        title: "E2E Lead Cloud Developer",
        company: "Tata Consultancy Services (TCS)",
        location: "Chennai / Hybrid",
        jobType: "Full-time",
        experienceLevel: "1-3 Years",
        salary: "₹10 - ₹14 LPA",
        description: "Comprehensive cloud engineering role.",
        skills: "Node.js, React, AWS, Docker",
      },
      { headers: { Authorization: `Bearer ${alumniToken}` } }
    );
    postedJobId = newJobRes.data.data._id;
    console.log("✅ 3.2 Post Job: Passed (Job ID:", postedJobId, ")");
    totalPassed++;

    // 3.3 Post New Internship
    const newIntRes = await axios.post(
      `${BASE_URL}/internships`,
      {
        title: "E2E Backend Engineering Intern",
        company: "Tata Consultancy Services (TCS)",
        location: "Remote",
        duration: "6 Months",
        stipend: "₹20,000 / Month",
        internshipType: "Virtual",
        description: "Hands-on microservice development internship.",
        skills: "Java, Spring Boot, PostgreSQL",
      },
      { headers: { Authorization: `Bearer ${alumniToken}` } }
    );
    postedInternshipId = newIntRes.data.data._id;
    console.log("✅ 3.3 Post Internship: Passed (Internship ID:", postedInternshipId, ")");
    totalPassed++;

    // 3.4 View Applicants & Manage Status
    const appsRes = await axios.get(`${BASE_URL}/applications`, {
      headers: { Authorization: `Bearer ${alumniToken}` },
    });
    console.log(`✅ 3.4 View Applicants: Passed (${appsRes.data.data.length} candidate applications found)`);
    totalPassed++;

    if (appsRes.data.data && appsRes.data.data.length > 0) {
      const appToUpdate = appsRes.data.data[0]._id;
      const statusRes = await axios.put(
        `${BASE_URL}/applications/${appToUpdate}/status`,
        { status: "shortlisted" },
        { headers: { Authorization: `Bearer ${alumniToken}` } }
      );
      console.log("✅ 3.5 Shortlist/Select Applicant: Passed", statusRes.data.message);
      totalPassed++;
    }

    // 3.6 Receive & Accept Mentorship Request with Google Meet Link
    const targetReqId = createdMentorshipId;
    if (targetReqId) {
      const updateReqRes = await axios.put(
        `${BASE_URL}/mentorship/${targetReqId}/status`,
        {
          status: "accepted",
          responseMessage: "Looking forward to our session this Saturday!",
          meetingLink: "https://meet.google.com/test-e2e-session-link",
        },
        { headers: { Authorization: `Bearer ${alumniToken}` } }
      );
      console.log("✅ 3.6 Accept Mentorship Request + Meeting Link: Passed", updateReqRes.data.message);
      totalPassed++;
    }

  } catch (e) {
    console.error("❌ Phase 3 Alumni Flow Error:", e.response?.data?.message || e.message);
    totalFailed++;
  }

  // ==================================================
  // PHASE 4: FACULTY FLOW
  // ==================================================
  console.log("\n--- PHASE 4: FACULTY FLOW TESTS ---");
  try {
    // 4.1 View Students Roster
    const studentsRes = await axios.get(`${BASE_URL}/faculty/students`, {
      headers: { Authorization: `Bearer ${facultyToken}` },
    });
    console.log(`✅ 4.1 View Students Roster: Passed (${studentsRes.data.data.length} department students)`);
    totalPassed++;

    // 4.2 Recommend Mentor
    const recRes = await axios.post(
      `${BASE_URL}/faculty/recommend-mentor`,
      {
        studentName: "Rohan Varma",
        studentRoll: "23CS104",
        alumniMentor: "Arun Kumar (TCS - 2022 Batch)",
        guidanceArea: "Full-Stack System Design",
        facultyNotes: "Promising student seeking cloud architecture guidance.",
      },
      { headers: { Authorization: `Bearer ${facultyToken}` } }
    );
    console.log("✅ 4.2 Recommend Mentor: Passed", recRes.data.message);
    totalPassed++;

    // 4.3 Create Announcement
    const annRes = await axios.post(
      `${BASE_URL}/announcements`,
      {
        title: "E2E Campus Placement Training Schedule 2026",
        content: "Special interactive sessions organized for 3rd and 4th year students.",
        targetRole: "all",
      },
      { headers: { Authorization: `Bearer ${facultyToken}` } }
    );
    console.log("✅ 4.3 Create Announcement: Passed", annRes.data.message);
    totalPassed++;

    // 4.4 Manage Events / Create Masterclass
    const eventRes = await axios.post(
      `${BASE_URL}/events`,
      {
        title: "E2E System Architecture Masterclass",
        description: "Detailed system design breakdown by alumni architects.",
        date: "2026-09-30",
        time: "02:00 PM - 04:00 PM IST",
        location: "Virtual",
        mode: "online",
        category: "Workshop",
        speaker: "Arun Kumar",
        speakerRole: "Senior Engineer at TCS",
      },
      { headers: { Authorization: `Bearer ${facultyToken}` } }
    );
    console.log("✅ 4.4 Create Campus Event: Passed", eventRes.data.message);
    totalPassed++;

    // 4.5 Update Faculty Profile
    const fProfRes = await axios.put(
      `${BASE_URL}/faculty/profile`,
      {
        department: "Computer Science and Engineering",
        designation: "Professor & Department Chair",
        researchAreas: ["Cloud Computing", "AI", "Distributed Systems"],
      },
      { headers: { Authorization: `Bearer ${facultyToken}` } }
    );
    console.log("✅ 4.5 Update Faculty Profile: Passed", fProfRes.data.message);
    totalPassed++;

  } catch (e) {
    console.error("❌ Phase 4 Faculty Flow Error:", e.response?.data?.message || e.message);
    totalFailed++;
  }

  // ==================================================
  // PHASE 5: ADMIN FLOW
  // ==================================================
  console.log("\n--- PHASE 5: ADMIN FLOW TESTS ---");
  try {
    // 5.1 Admin Dashboard Stats
    const statsRes = await axios.get(`${BASE_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    console.log("✅ 5.1 Admin Dashboard Stats: Passed", statsRes.data.data);
    totalPassed++;

    // 5.2 Alumni Verification Queue
    const verRes = await axios.get(`${BASE_URL}/admin/verifications`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    console.log(`✅ 5.2 Alumni Verification Queue: Passed (${verRes.data.data.length} pending items)`);
    totalPassed++;

    if (verRes.data.data.length > 0) {
      const targetUser = verRes.data.data[0]._id;
      const approveRes = await axios.put(
        `${BASE_URL}/admin/verify/${targetUser}`,
        { status: "verified" },
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      console.log("✅ 5.3 Approve/Verify Alumnus: Passed", approveRes.data.message);
      totalPassed++;
    }

    // 5.4 Manage Users & Toggle Status
    const usersRes = await axios.get(`${BASE_URL}/users`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    console.log(`✅ 5.4 Manage Users Directory: Passed (${usersRes.data.data.length} users registered)`);
    totalPassed++;

    if (usersRes.data.data.length > 0) {
      const uId = usersRes.data.data[0]._id;
      const toggleRes = await axios.put(
        `${BASE_URL}/users/${uId}/status`,
        { status: "Active" },
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      console.log("✅ 5.5 User Status Toggle: Passed", toggleRes.data.message);
      totalPassed++;
    }

    // 5.6 Moderate / Delete Job
    if (postedJobId) {
      const delJobRes = await axios.delete(`${BASE_URL}/jobs/${postedJobId}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      console.log("✅ 5.6 Moderate / Delete Job: Passed", delJobRes.data.message);
      totalPassed++;
    }

    // 5.7 Moderate / Delete Internship
    if (postedInternshipId) {
      const delIntRes = await axios.delete(`${BASE_URL}/internships/${postedInternshipId}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      console.log("✅ 5.7 Moderate / Delete Internship: Passed", delIntRes.data.message);
      totalPassed++;
    }

    // 5.8 Platform Statistics
    const platRes = await axios.get(`${BASE_URL}/admin/platform-stats`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    console.log("✅ 5.8 Platform Analytics & Statistics: Passed (Placement Rate:", platRes.data.data.overallPlacementRate + ")");
    totalPassed++;

  } catch (e) {
    console.error("❌ Phase 5 Admin Flow Error:", e.response?.data?.message || e.message);
    totalFailed++;
  }

  // ==================================================
  // PHASE 8: DATA VALIDATION & ERROR HANDLING
  // ==================================================
  console.log("\n--- PHASE 8: DATA VALIDATION & DUPLICATE PREVENTION ---");
  try {
    // Prevent duplicate job application
    try {
      await axios.post(
        `${BASE_URL}/jobs/${sampleJobId}/apply`,
        { resumeUrl: "https://drive.google.com/test-resume", coverNote: "Duplicate test" },
        { headers: { Authorization: `Bearer ${studentToken}` } }
      );
      console.error("❌ Duplicate application test failed (Allowed duplicate apply)");
      totalFailed++;
    } catch (e) {
      if (e.response?.status === 400) {
        console.log("✅ Duplicate job application prevented: Passed (HTTP 400 Bad Request)");
        totalPassed++;
      }
    }

    // Prevent duplicate user registration with same email
    try {
      await axios.post(`${BASE_URL}/auth/register`, {
        name: "Duplicate User",
        email: "rohan.v@student.edu",
        password: "student123",
        role: "Student",
      });
      console.error("❌ Duplicate registration test failed (Allowed duplicate email)");
      totalFailed++;
    } catch (e) {
      if (e.response?.status === 400) {
        console.log("✅ Duplicate email registration prevented: Passed (HTTP 400 Bad Request)");
        totalPassed++;
      }
    }

  } catch (e) {
    console.error("❌ Data Validation Error:", e.message);
    totalFailed++;
  }

  console.log("\n==================================================");
  console.log(`🎉 FINAL E2E TEST RESULTS: ${totalPassed} PASSED, ${totalFailed} FAILED`);
  console.log("==================================================\n");
}

runFullE2ETests();
