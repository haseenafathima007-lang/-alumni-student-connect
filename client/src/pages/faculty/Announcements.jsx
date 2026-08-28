import React, { useState, useEffect } from "react";
import FacultyLayout from "../../layouts/FacultyLayout";
import { api } from "../../services/api";

function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [targetRole, setTargetRole] = useState("all");
  const [feedback, setFeedback] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await api.get("/announcements");
      setAnnouncements(res.data || []);
    } catch (err) {
      console.error("Failed to load announcements:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!title || !content) return;

    setSubmitting(true);
    try {
      await api.post("/announcements", { title, content, targetRole });
      setFeedback("Announcement published successfully across portal!");
      setTitle("");
      setContent("");
      fetchAnnouncements();
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      setFeedback(err.message || "Failed to publish announcement.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FacultyLayout>
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.header}>
            <h1 style={styles.title}>📢 Department Announcements & Broadcasts</h1>
            <p style={styles.subtitle}>
              Publish official academic notices, guest lecture alerts, hackathons, and placement drives to students and alumni.
            </p>
          </div>

          {feedback && (
            <div style={styles.successAlert}>
              ✅ {feedback}
            </div>
          )}

          {/* Create Announcement */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Publish New Announcement</h3>
            <form onSubmit={handlePost}>
              <div style={{ marginBottom: "14px" }}>
                <label style={styles.label}>Announcement Title *</label>
                <input
                  type="text"
                  placeholder="e.g. AI & DS Placement Masterclass with Alumni Mentors"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={styles.input}
                  required
                />
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label style={styles.label}>Target Audience</label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  style={styles.select}
                >
                  <option value="all">Everyone (Students, Alumni & Faculty)</option>
                  <option value="student">Students Only</option>
                  <option value="alumni">Alumni Only</option>
                </select>
              </div>

              <div style={{ marginBottom: "18px" }}>
                <label style={styles.label}>Detailed Notice / Broadcast Message *</label>
                <textarea
                  rows={4}
                  placeholder="Write the announcement details, dates, Google Meet links, or prerequisites..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  style={styles.textarea}
                  required
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button type="submit" disabled={submitting} style={styles.submitBtn}>
                  {submitting ? "Publishing..." : "Publish Announcement →"}
                </button>
              </div>
            </form>
          </div>

          {/* List */}
          <h2 style={{ ...styles.title, fontSize: "20px", marginTop: "32px", marginBottom: "14px" }}>
            Active Announcements Feed
          </h2>
          {loading ? (
            <div style={styles.loadingBox}>
              Loading announcements...
            </div>
          ) : announcements.length === 0 ? (
            <div style={styles.emptyBox}>No announcements published yet.</div>
          ) : (
            <div style={styles.list}>
              {announcements.map((ann) => (
                <div key={ann._id} style={styles.itemCard}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px" }}>
                    <h3 style={{ margin: "0 0 4px 0", color: "#391F25", fontSize: "17px", fontFamily: "'Poppins', sans-serif" }}>
                      {ann.title}
                    </h3>
                    <span style={styles.badge}>Audience: {ann.targetRole?.toUpperCase() || "ALL"}</span>
                  </div>
                  <p style={{ margin: "0 0 10px 0", fontSize: "12px", color: "#6C574C" }}>
                    📅 Published: {ann.date || ann.createdAt?.split("T")[0] || "Today"}
                  </p>
                  <p style={{ margin: 0, color: "#391F25", fontSize: "13px", lineHeight: "1.5" }}>
                    {ann.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </FacultyLayout>
  );
}

const styles = {
  page: {
    padding: "30px 20px 60px 20px",
  },
  container: {
    maxWidth: "1000px",
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
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    padding: "28px",
    boxShadow: "0 2px 12px rgba(57, 31, 37, 0.06)",
    border: "1px solid #DAD0BB",
  },
  cardTitle: {
    margin: "0 0 16px 0",
    color: "#391F25",
    fontSize: "18px",
    fontFamily: "'Poppins', sans-serif",
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
  select: {
    width: "100%",
    boxSizing: "border-box",
    padding: "10px 12px",
    border: "1.5px solid #DAD0BB",
    borderRadius: "6px",
    fontSize: "13px",
    outline: "none",
    backgroundColor: "#FFFFFF",
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
  submitBtn: {
    backgroundColor: "#57142B",
    color: "#FFFFFF",
    border: "none",
    padding: "10px 22px",
    borderRadius: "6px",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "13px",
    boxShadow: "0 4px 12px rgba(87, 20, 43, 0.25)",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  itemCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 2px 10px rgba(57, 31, 37, 0.05)",
    border: "1px solid #DAD0BB",
  },
  badge: {
    backgroundColor: "#F7F5F0",
    color: "#57142B",
    border: "1px solid #DAD0BB",
    padding: "3px 9px",
    borderRadius: "8px",
    fontSize: "11px",
    fontWeight: "700",
  },
  emptyBox: {
    backgroundColor: "#FFFFFF",
    padding: "40px",
    borderRadius: "10px",
    textAlign: "center",
    color: "#6C574C",
    border: "1px solid #DAD0BB",
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
    padding: "40px",
    textAlign: "center",
    color: "#6C574C",
  },
};

export default Announcements;
