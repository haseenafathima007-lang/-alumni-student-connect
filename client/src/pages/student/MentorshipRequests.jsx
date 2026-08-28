import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import StudentLayout from "../../layouts/StudentLayout";
import { api } from "../../services/api";

function MentorshipRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await api.get("/mentorship/my-requests");
      setRequests(res.data || []);
    } catch (err) {
      console.error("Failed to load mentorship requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "accepted":
        return { text: "✅ Accepted", bg: "#E8F5E9", color: "#2E7D32" };
      case "rejected":
        return { text: "❌ Declined", bg: "#FFEBEE", color: "#C62828" };
      default:
        return { text: "⏳ Pending Review", bg: "#FFF8E1", color: "#F57F17" };
    }
  };

  return (
    <StudentLayout>
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.header}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <h1 style={styles.title}>🤝 Mentorship Sessions & Trackers</h1>
                <p style={styles.subtitle}>
                  Track your 1-on-1 mentorship requests with Easwari alumni mentors and access direct meeting sessions.
                </p>
              </div>
              <Link to="/student/find-mentors" style={styles.newRequestBtn}>
                + Find New Mentors
              </Link>
            </div>
          </div>

          {loading ? (
            <div style={styles.loadingBox}>
              Loading your mentorship requests...
            </div>
          ) : requests.length === 0 ? (
            <div style={styles.emptyBox}>
              <span style={{ fontSize: "40px" }}>🤝</span>
              <h3 style={{ color: "#391F25", margin: "10px 0 6px 0" }}>No mentorship requests yet</h3>
              <p style={{ color: "#6C574C", margin: "0 0 20px 0", fontSize: "14px" }}>
                Connect with experienced alumni for resume reviews, system design coaching, and placement guidance.
              </p>
              <Link to="/student/find-mentors" style={styles.primaryBtn}>
                Explore Mentors Directory →
              </Link>
            </div>
          ) : (
            <div style={styles.list}>
              {requests.map((req) => {
                const badge = getStatusBadge(req.status);
                return (
                  <div key={req._id} style={styles.card}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px" }}>
                      <div>
                        <h3 style={styles.topic}>{req.topic}</h3>
                        <p style={styles.mentorName}>
                          Mentor: <strong>{req.mentor?.name || "Alumni Mentor"}</strong>
                        </p>
                      </div>
                      <span
                        style={{
                          backgroundColor: badge.bg,
                          color: badge.color,
                          padding: "5px 12px",
                          borderRadius: "14px",
                          fontWeight: "700",
                          fontSize: "12px",
                        }}
                      >
                        {badge.text}
                      </span>
                    </div>

                    <div style={styles.messageBox}>
                      <span style={{ fontSize: "12px", color: "#6C574C", display: "block", marginBottom: "4px", fontWeight: "700" }}>
                        Your Message to Mentor:
                      </span>
                      "{req.message}"
                    </div>

                    {req.responseMessage && (
                      <div style={styles.responseBox}>
                        <span style={{ fontSize: "12px", color: "#2E7D32", display: "block", marginBottom: "4px", fontWeight: "700" }}>
                          Mentor Response Note:
                        </span>
                        "{req.responseMessage}"
                      </div>
                    )}

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "14px", flexWrap: "wrap", gap: "10px" }}>
                      {req.meetingLink ? (
                        <a
                          href={req.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          style={styles.meetBtn}
                        >
                          🎥 Join Google Meet Session ➔
                        </a>
                      ) : <span />}

                      <Link
                        to={`/student/chat?user=${req.mentor?._id || req.mentor}`}
                        style={styles.chatActionBtn}
                      >
                        💬 Open Chat
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </StudentLayout>
  );
}

const styles = {
  page: {
    padding: "30px 20px 60px 20px",
  },
  container: {
    maxWidth: "1050px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "24px",
  },
  title: {
    color: "#391F25",
    fontSize: "28px",
    margin: "0 0 6px 0",
    fontFamily: "'Poppins', sans-serif",
  },
  subtitle: {
    color: "#6C574C",
    fontSize: "14px",
    margin: 0,
  },
  newRequestBtn: {
    backgroundColor: "#57142B",
    color: "#FFFFFF",
    padding: "10px 18px",
    borderRadius: "6px",
    textDecoration: "none",
    fontWeight: "700",
    fontSize: "13px",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 2px 12px rgba(57, 31, 37, 0.06)",
    border: "1px solid #DAD0BB",
  },
  topic: {
    margin: "0 0 4px 0",
    fontSize: "18px",
    color: "#391F25",
    fontFamily: "'Poppins', sans-serif",
  },
  mentorName: {
    margin: 0,
    fontSize: "13px",
    color: "#6C574C",
  },
  messageBox: {
    backgroundColor: "#F7F5F0",
    padding: "12px 14px",
    borderRadius: "6px",
    fontSize: "13px",
    color: "#391F25",
    marginTop: "12px",
    lineHeight: "1.5",
    border: "1px solid #DAD0BB",
  },
  responseBox: {
    backgroundColor: "#E8F5E9",
    padding: "12px 14px",
    borderRadius: "6px",
    fontSize: "13px",
    color: "#2E7D32",
    marginTop: "10px",
    lineHeight: "1.5",
    border: "1px solid #C8E6C9",
  },
  meetBtn: {
    display: "inline-block",
    backgroundColor: "#57142B",
    color: "#FFFFFF",
    padding: "9px 16px",
    borderRadius: "6px",
    textDecoration: "none",
    fontWeight: "700",
    fontSize: "13px",
  },
  chatActionBtn: {
    backgroundColor: "#6C574C",
    color: "#FFFFFF",
    padding: "9px 14px",
    borderRadius: "6px",
    textDecoration: "none",
    fontWeight: "700",
    fontSize: "13px",
  },
  emptyBox: {
    backgroundColor: "#FFFFFF",
    padding: "50px 20px",
    borderRadius: "12px",
    textAlign: "center",
    border: "1px solid #DAD0BB",
  },
  primaryBtn: {
    display: "inline-block",
    backgroundColor: "#57142B",
    color: "#FFFFFF",
    padding: "11px 22px",
    borderRadius: "6px",
    textDecoration: "none",
    fontWeight: "700",
    fontSize: "13px",
  },
  loadingBox: {
    padding: "50px",
    textAlign: "center",
    color: "#6C574C",
  },
};

export default MentorshipRequests;
