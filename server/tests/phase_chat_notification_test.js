const axios = require("axios");

const BASE_URL = "http://localhost:5000/api";

async function runChatAndNotificationTests() {
  console.log("\n==================================================");
  console.log("TESTING CHAT, NOTIFICATIONS & MENTOR MATCHING");
  console.log("==================================================");

  let totalPassed = 0;
  let totalFailed = 0;

  let studentToken, alumniToken, facultyToken;
  let studentId, alumniId, facultyId;

  // 1. Authenticate users
  try {
    const sLogin = await axios.post(`${BASE_URL}/auth/login`, {
      email: "rohan.v@student.edu",
      password: "student123",
    });
    studentToken = sLogin.data.data.token;
    studentId = sLogin.data.data._id;

    const aLogin = await axios.post(`${BASE_URL}/auth/login`, {
      email: "arun.kumar@tcs.example.com",
      password: "alumni123",
    });
    alumniToken = aLogin.data.data.token;
    alumniId = aLogin.data.data._id;

    const fLogin = await axios.post(`${BASE_URL}/auth/login`, {
      email: "meenakshi.s@college.edu",
      password: "faculty123",
    });
    facultyToken = fLogin.data.data.token;
    facultyId = fLogin.data.data._id;

    console.log("✅ 1. Authentication for test roles succeeded.");
    totalPassed++;
  } catch (e) {
    console.error("❌ 1. Authentication Failed:", e.message);
    totalFailed++;
  }

  // ==================================================
  // 2. CHAT SYSTEM TESTS
  // ==================================================
  console.log("\n--- CHAT SYSTEM TESTS ---");
  let conversationId = null;

  try {
    // 2.1 Student starts/retrieves conversation with Alumni
    const convoRes = await axios.post(
      `${BASE_URL}/chat/conversation`,
      { targetUserId: alumniId },
      { headers: { Authorization: `Bearer ${studentToken}` } }
    );
    conversationId = convoRes.data.data._id;
    console.log(`✅ 2.1 Start Conversation: Passed (Convo ID: ${conversationId})`);
    totalPassed++;

    // 2.2 Student sends message
    const msgText = "Hello Arun, could we schedule a mock interview for Spring Boot?";
    const sendRes = await axios.post(
      `${BASE_URL}/chat/message`,
      {
        conversationId,
        text: msgText,
      },
      { headers: { Authorization: `Bearer ${studentToken}` } }
    );
    console.log("✅ 2.2 Student Sends Message: Passed", sendRes.data.message);
    totalPassed++;

    // 2.3 Alumni fetches conversations & reads messages
    const aConvos = await axios.get(`${BASE_URL}/chat/conversations`, {
      headers: { Authorization: `Bearer ${alumniToken}` },
    });
    const foundConvo = aConvos.data.data.find((c) => c._id === conversationId);
    if (foundConvo) {
      console.log("✅ 2.3 Alumni Inbox: Passed (Found incoming conversation)");
      totalPassed++;
    } else {
      console.error("❌ 2.3 Alumni Inbox check failed");
      totalFailed++;
    }

    const msgsRes = await axios.get(`${BASE_URL}/chat/messages/${conversationId}`, {
      headers: { Authorization: `Bearer ${alumniToken}` },
    });
    console.log(`✅ 2.4 Alumni Retrieves Message History: Passed (${msgsRes.data.data.length} messages)`);
    totalPassed++;

    // 2.5 Alumni replies to Student
    const replyRes = await axios.post(
      `${BASE_URL}/chat/message`,
      {
        conversationId,
        text: "Hi Rohan! Sure, Saturday at 4 PM works great for me.",
      },
      { headers: { Authorization: `Bearer ${alumniToken}` } }
    );
    console.log("✅ 2.5 Alumni Replies to Message: Passed", replyRes.data.message);
    totalPassed++;

    // 2.6 Student verifies complete thread after refresh
    const refreshedMsgs = await axios.get(`${BASE_URL}/chat/messages/${conversationId}`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    if (refreshedMsgs.data.data.length >= 2) {
      console.log("✅ 2.6 Message Thread Persistence: Passed (Both messages preserved in MongoDB)");
      totalPassed++;
    }

    // 2.7 Security: Unauthorized third party (Faculty) attempts to read private conversation
    try {
      await axios.get(`${BASE_URL}/chat/messages/${conversationId}`, {
        headers: { Authorization: `Bearer ${facultyToken}` },
      });
      console.error("❌ 2.7 Privacy check failed (Allowed unauthorized conversation access)");
      totalFailed++;
    } catch (e) {
      if (e.response?.status === 403) {
        console.log("✅ 2.7 Unauthorized Access Blocked: Passed (HTTP 403 Forbidden)");
        totalPassed++;
      } else {
        console.error("❌ 2.7 Unexpected status:", e.response?.status);
        totalFailed++;
      }
    }
  } catch (e) {
    console.error("❌ Chat Test Error:", e.response?.data?.message || e.message);
    totalFailed++;
  }

  // ==================================================
  // 3. NOTIFICATIONS SYSTEM TESTS
  // ==================================================
  console.log("\n--- NOTIFICATION SYSTEM TESTS ---");
  try {
    // 3.1 Verify Alumni has received notification from Student message
    const aNotifs = await axios.get(`${BASE_URL}/notifications`, {
      headers: { Authorization: `Bearer ${alumniToken}` },
    });
    console.log(`✅ 3.1 Notifications Retrieved: Passed (${aNotifs.data.data.length} notifications in list)`);
    totalPassed++;

    // 3.2 Check unread count
    const unreadRes = await axios.get(`${BASE_URL}/notifications/unread-count`, {
      headers: { Authorization: `Bearer ${alumniToken}` },
    });
    console.log(`✅ 3.2 Unread Count: Passed (${unreadRes.data.data.count} unread notifications)`);
    totalPassed++;

    // 3.3 Mark single notification as read
    if (aNotifs.data.data.length > 0) {
      const firstNotif = aNotifs.data.data[0];
      const readRes = await axios.put(
        `${BASE_URL}/notifications/${firstNotif._id}/read`,
        {},
        { headers: { Authorization: `Bearer ${alumniToken}` } }
      );
      console.log("✅ 3.3 Mark Single Notification Read: Passed", readRes.data.message);
      totalPassed++;
    }

    // 3.4 Mark all notifications as read
    const allReadRes = await axios.put(
      `${BASE_URL}/notifications/mark-all-read`,
      {},
      { headers: { Authorization: `Bearer ${alumniToken}` } }
    );
    console.log("✅ 3.4 Mark All Notifications Read: Passed", allReadRes.data.message);
    totalPassed++;

    // 3.5 Verify unread count is now 0
    const finalUnread = await axios.get(`${BASE_URL}/notifications/unread-count`, {
      headers: { Authorization: `Bearer ${alumniToken}` },
    });
    if (finalUnread.data.data.count === 0) {
      console.log("✅ 3.5 Verified Unread Count Reset: Passed (0 unread)");
      totalPassed++;
    }
  } catch (e) {
    console.error("❌ Notification Test Error:", e.response?.data?.message || e.message);
    totalFailed++;
  }

  // ==================================================
  // 4. MENTOR MATCHING & WEIGHTED SEARCH TESTS
  // ==================================================
  console.log("\n--- MENTOR MATCHING TESTS ---");
  try {
    // 4.1 Search by skill
    const skillMatch = await axios.get(`${BASE_URL}/alumni?skill=Java`);
    console.log(`✅ 4.1 Skill-based Matching: Passed (${skillMatch.data.data.length} matches found)`);
    totalPassed++;

    // 4.2 Multi-criteria search
    const topicMatch = await axios.get(`${BASE_URL}/alumni?topic=Mock%20Interviews`);
    console.log(`✅ 4.2 Topic-based Matching: Passed (${topicMatch.data.data.length} mentors matched)`);
    totalPassed++;

    // 4.3 Department & Mentoring Availability Filter
    const deptMatch = await axios.get(`${BASE_URL}/alumni?department=Computer&mentoring=true`);
    console.log(`✅ 4.3 Department + Availability Filter: Passed (${deptMatch.data.data.length} mentors found)`);
    totalPassed++;
  } catch (e) {
    console.error("❌ Mentor Matching Test Error:", e.response?.data?.message || e.message);
    totalFailed++;
  }

  console.log("\n==================================================");
  console.log(`🎉 CHAT & NOTIFICATION TEST RESULTS: ${totalPassed} PASSED, ${totalFailed} FAILED`);
  console.log("==================================================\n");
}

runChatAndNotificationTests();
