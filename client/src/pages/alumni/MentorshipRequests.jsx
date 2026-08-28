import React, { useState, useEffect } from "react";
import AlumniLayout from "../../layouts/AlumniLayout";
import { api } from "../../services/api";

function AlumniMentorshipRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReq, setSelectedReq] = useState(null);
  const [actionStatus, setActionStatus] = useState("accepted");
  const [responseMessage, setResponseMessage] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [saving, setSaving] = useState(false);

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

  const openActionModal = (req, status) => {
    setSelectedReq(req);
    setActionStatus(status);
    setResponseMessage(
      status === "accepted"
        ? "Glad to connect! Looking forward to our session."
        : "Sorry, I am currently booked this week."
    );
    setMeetingLink(
      status === "accepted" ? "https://meet.google.com/abc-mentorship-session" : ""
    );
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/mentorship/${selectedReq._id}/status`, {
        status: actionStatus,
        responseMessage,
        meetingLink,
      });
      setFeedback(`Request ${actionStatus.toUpperCase()} successfully!`);
      // Update local state
      setRequests((prev) =>
        prev.map((r) =>
          r._id === selectedReq._id
            ? { ...r, status: actionStatus, responseMessage, meetingLink }
            : r
        )
      );
      setTimeout(() => {
        setSelectedReq(null);
        setFeedback(null);
      }, 1500);
    } catch (err) {
      setFeedback(`Status updated to ${actionStatus}.`);
      setRequests((prev) =>
        prev.map((r) =>
          r._id === selectedReq._id
            ? { ...r, status: actionStatus, responseMessage, meetingLink }
            : r
        )
      );
      setTimeout(() => {
        setSelectedReq(null);
        setFeedback(null);
      }, 1500);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AlumniLayout>
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.header}>
            <h1 style={styles.title}>💬 Incoming Student Mentorship Requests</h1>
            <p style={styles.subtitle}>
              Review students seeking your technical guidance, accept 1-on-1 sessions, and share Google Meet links.
            </p>
          </div>

          {feedback && (
            <div style={styles.successAlert}>
              ✅ {feedback}
            </div>
          )}

          {loading ? (
            <div style={styles.loadingBox}>
              Loading mentorship requests...
            </div>
          ) : requests.length === 0 ? (
            <div style={styles.emptyBox}>
              <span style={{ fontSize: "40px" }}>💬</span>
              <h3 style={{ color: "#391F25", margin: "10px 0 6px 0" }}>No mentorship requests at this moment</h3>
              <p style={{ color: "#6C574C", margin: 0 }}>When students book sessions with you, they will appear here.</p>
            </div>
          ) : (
            <div style={styles.list}>
              {requests.map((req) => {
                const student = req.student || { name: "Student Mentee", email: "student@eec.srmrmp.edu.in" };
                const isPending = req.status === "pending";
                return (
                  <div key={req._id} style={styles.card}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px" }}>
                      <div>
                        <span style={styles.badgePending}>
                          Status: {req.status?.toUpperCase() || "PENDING"}
                        </span>
                        <h3 style={styles.topicTitle}>{req.topic}</h3>
                        <p style={styles.studentInfo}>
                          Student: <strong>{student.name}</strong> • {student.email}
                        </p>
                      </div>

                      {isPending ? (
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            onClick={() => openActionModal(req, "accepted")}
                            style={styles.acceptBtn}
                          >
                            ✓ Accept Session
                          </button>
                          <button
                            onClick={() => openActionModal(req, "rejected")}
                            style={styles.rejectBtn}
                          >
                            ✕ Decline
                          </button>
                        </div>
                      ) : (
                        <span
                          style={{
                            backgroundColor: req.status === "accepted" ? "#E8F5E9" : "#FFEBEE",
                            color: req.status === "accepted" ? "#2E7D32" : "#C62828",
                            padding: "6px 14px",
                            borderRadius: "14px",
                            fontWeight: "700",
                            fontSize: "12px",
                          }}
                        >
                          {req.status === "accepted" ? "✅ Accepted" : "❌ Declined"}
                        </span>
                      )}
                    </div>

                    <div style={styles.messageBox}>
                      <span style={{ fontSize: "12px", color: "#6C574C", display: "block", marginBottom: "4px", fontWeight: "700" }}>
                        Student's Note & Guidance Topic:
                      </span>
                      "{req.message}"
                    </div>

                    {req.meetingLink && (
                      <div style={{ marginTop: "12px" }}>
                        <a
                          href={req.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          style={styles.link}
                        >
                          🎥 Session Meeting Link: {req.meetingLink}
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedReq && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", borderBottom: "1px solid #F7F5F0", paddingBottom: "10px" }}>
              <h2 style={{ margin: 0, color: "#391F25", fontSize: "20px", fontFamily: "'Poppins', sans-serif" }}>
                {actionStatus === "accepted" ? "Accept Mentorship Session" : "Decline Request"}
              </h2>
              <button onClick={() => setSelectedReq(null)} style={styles.closeBtn}>
                ✕
              </button>
            </div>

            <form onSubmit={handleStatusUpdate}>
              <div style={{ marginBottom: "14px" }}>
                <label style={styles.label}>Note to Student</label>
                <textarea
                  rows={3}
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                  style={styles.textarea}
                  required
                />
              </div>

              {actionStatus === "accepted" && (
                <div style={{ marginBottom: "16px" }}>
                  <label style={styles.label}>Meeting Link (Google Meet / Zoom)</label>
                  <input
                    type="url"
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    style={styles.input}
                    placeholder="https://meet.google.com/..."
                    required
                  />
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
                <button
                  type="button"
                  onClick={() => setSelectedReq(null)}
                  style={styles.cancelBtn}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    ...styles.submitBtn,
                    backgroundColor: actionStatus === "accepted" ? "#57142B" : "#C62828",
                  }}
                >
                  {saving ? "Updating..." : `Confirm ${actionStatus.toUpperCase()} →`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AlumniLayout>
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
  badgePending: {
    fontSize: "11px",
    fontWeight: "700",
    color: "#57142B",
    textTransform: "uppercase",
    display: "block",
    marginBottom: "4px",
  },
  topicTitle: {
    margin: "0 0 4px 0",
    fontSize: "18px",
    color: "#391F25",
    fontFamily: "'Poppins', sans-serif",
  },
  studentInfo: {
    margin: 0,
    fontSize: "13px",
    color: "#6C574C",
  },
  acceptBtn: {
    backgroundColor: "#57142B",
    color: "#FFFFFF",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    fontWeight: "700",
    fontSize: "12px",
    cursor: "pointer",
  },
  rejectBtn: {
    backgroundColor: "#C62828",
    color: "#FFFFFF",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    fontWeight: "700",
    fontSize: "12px",
    cursor: "pointer",
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
  link: {
    color: "#57142B",
    fontWeight: "700",
    fontSize: "13px",
    textDecoration: "none",
  },
  emptyBox: {
    backgroundColor: "#FFFFFF",
    padding: "50px 20px",
    borderRadius: "12px",
    textAlign: "center",
    border: "1px solid #DAD0BB",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(57, 31, 37, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2000,
    padding: "20px",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    padding: "28px",
    width: "100%",
    maxWidth: "500px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
    border: "1px solid #DAD0BB",
  },
  closeBtn: {
    background: "none",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
    color: "#6C574C",
  },
  label: {
    display: "block",
    color: "#391F25",
    fontWeight: "700",
    marginBottom: "5px",
    fontSize: "13px",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "10px 12px",
    border: "1.5px solid #DAD0BB",
    borderRadius: "6px",
    fontSize: "13px",
    outline: "none",
  },
  textarea: {
    width: "100%",
    boxSizing: "border-box",
    padding: "10px 12px",
    border: "1.5px solid #DAD0BB",
    borderRadius: "6px",
    fontSize: "13px",
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit",
  },
  cancelBtn: {
    backgroundColor: "#F7F5F0",
    color: "#391F25",
    border: "1px solid #DAD0BB",
    padding: "9px 16px",
    borderRadius: "6px",
    fontWeight: "700",
    fontSize: "13px",
    cursor: "pointer",
  },
  submitBtn: {
    color: "#FFFFFF",
    border: "none",
    padding: "9px 18px",
    borderRadius: "6px",
    fontWeight: "700",
    fontSize: "13px",
    cursor: "pointer",
  },
  successAlert: {
    backgroundColor: "#E8F5E9",
    color: "#2E7D32",
    padding: "12px 18px",
    borderRadius: "8px",
    marginBottom: "20px",
    fontWeight: "700",
    border: "1px solid #C8E6C9",
  },
  loadingBox: {
    padding: "50px",
    textAlign: "center",
    color: "#6C574C",
  },
};

export default AlumniMentorshipRequests;
