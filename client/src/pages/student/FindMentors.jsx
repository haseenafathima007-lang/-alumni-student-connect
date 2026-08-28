import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import StudentLayout from "../../layouts/StudentLayout";
import { api } from "../../services/api";
import { DEPARTMENTS } from "../../constants/departments";

function FindMentors() {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");

  // Request Modal
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [requestTopic, setRequestTopic] = useState("");
  const [requestMessage, setRequestMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const fetchMentors = async () => {
    setLoading(true);
    setError(null);
    try {
      let endpoint = `/alumni?mentoring=true&search=${encodeURIComponent(search)}`;
      if (selectedDept) endpoint += `&department=${encodeURIComponent(selectedDept)}`;
      if (selectedTopic) endpoint += `&topic=${encodeURIComponent(selectedTopic)}`;
      const res = await api.get(endpoint);
      setMentors(res.data || []);
    } catch (err) {
      console.error("Failed to load mentors:", err.message);
      setError("Unable to load mentors. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentors();
  }, [selectedDept, selectedTopic]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchMentors();
  };

  const handleSendRequest = async (e) => {
    e.preventDefault();
    if (!requestTopic || !requestMessage) return;

    setSubmitting(true);
    try {
      await api.post("/mentorship/request", {
        mentorId: selectedMentor._id || selectedMentor.userId,
        topic: requestTopic,
        message: requestMessage,
      });
      setFeedback({ type: "success", text: `Mentorship request sent to ${selectedMentor.name}!` });
      setTimeout(() => {
        setFeedback(null);
        setSelectedMentor(null);
        setRequestTopic("");
        setRequestMessage("");
      }, 2500);
    } catch (err) {
      console.error("Failed to request mentorship:", err);
      setFeedback({ type: "error", text: "Failed to send request. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <StudentLayout>
      <div style={styles.page}>
        <div style={styles.container}>
          {/* Header */}
          <div style={styles.header}>
            <span style={styles.badge}>🤝 1-on-1 Guidance Program</span>
            <h1 style={styles.title}>Find a College Alumni Mentor</h1>
            <p style={styles.subtitle}>
              Connect with experienced Easwari graduates who offer personalized career coaching, mock placement interviews, and technical mentorship.
            </p>
          </div>

          {/* Search & Topic Filters */}
          <div style={styles.filterCard}>
            <form onSubmit={handleSearchSubmit} style={styles.searchForm}>
              <input
                type="text"
                placeholder="Search mentors by expertise (e.g. System Design, AI, Python, Microservices, Placements)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={styles.searchInput}
              />
              <button type="submit" style={styles.searchBtn}>
                🔍 Search
              </button>
            </form>

            <div style={styles.filterRow}>
              {/* Department with AI & DS */}
              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>Department:</label>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  style={styles.select}
                >
                  <option value="">All Departments</option>
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              {/* Topic Guidance Area */}
              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>Mentorship Topic Area:</label>
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  style={styles.select}
                >
                  <option value="">All Topics</option>
                  <option value="Mock Interviews">Mock Interviews & Placement Prep</option>
                  <option value="System Design">System Design & Architecture</option>
                  <option value="Career Transition">Career Transition & Higher Studies</option>
                  <option value="Resume Review">Resume & Portfolio Review</option>
                  <option value="AI & ML">AI & Machine Learning Guidance</option>
                  <option value="Cloud Native">Cloud Computing & DevOps</option>
                </select>
              </div>

              {(search || selectedDept || selectedTopic) && (
                <button
                  onClick={() => {
                    setSearch("");
                    setSelectedDept("");
                    setSelectedTopic("");
                  }}
                  style={styles.clearBtn}
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Alert */}
          {feedback && (
            <div
              style={{
                ...styles.alert,
                backgroundColor: feedback.type === "success" ? "#E8F5E9" : "#FFEBEE",
                color: feedback.type === "success" ? "#2E7D32" : "#C62828",
              }}
            >
              {feedback.text}
            </div>
          )}

          {/* Mentor Cards */}
          {loading ? (
            <div style={styles.loadingBox}>Loading active alumni mentors...</div>
          ) : error ? (
            <div style={styles.errorBox}>{error}</div>
          ) : mentors.length === 0 ? (
            <div style={styles.emptyBox}>
              <span style={{ fontSize: "40px" }}>🤝</span>
              <h3 style={{ color: "#391F25", margin: "0 0 8px 0" }}>No mentors found matching your criteria</h3>
              <p style={{ color: "#6C574C", margin: 0 }}>Try expanding your department or guidance topic search.</p>
            </div>
          ) : (
            <div style={styles.grid}>
              {mentors.map((mentor) => {
                const p = mentor.profile || {};
                return (
                  <div key={mentor._id} style={styles.card}>
                    <div style={styles.cardHeaderRow}>
                      <div style={styles.avatarCircle}>
                        {mentor.name ? mentor.name.charAt(0).toUpperCase() : "M"}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <h3 style={styles.mentorName}>{mentor.name}</h3>
                          <span style={styles.availableTag}>✓ Available</span>
                        </div>
                        <p style={styles.mentorTitle}>
                          {p.jobTitle || "Senior Professional"} @ {p.company || "Leading Organization"}
                        </p>
                        <p style={styles.mentorDept}>
                          🎓 {p.department || "Artificial Intelligence and Data Science"} • Batch: {p.batch || (p.batchStart && p.batchEnd ? `${p.batchStart} – ${p.batchEnd}` : p.graduationYear || "2020 – 2024")}
                        </p>
                      </div>
                    </div>

                    {p.bio && <p style={styles.bio}>"{p.bio}"</p>}

                    {p.mentorshipTopics && p.mentorshipTopics.length > 0 && (
                      <div style={styles.topicsBox}>
                        <strong style={{ fontSize: "12px", color: "#391F25", display: "block", marginBottom: "4px" }}>
                          💡 Mentoring Focus:
                        </strong>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                          {p.mentorshipTopics.map((t, idx) => (
                            <span key={idx} style={styles.topicBadge}>
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div style={styles.cardActions}>
                      <Link
                        to={`/student/chat?user=${mentor.userId || mentor._id}`}
                        style={styles.chatBtn}
                      >
                        💬 Chat
                      </Link>
                      <button
                        onClick={() => setSelectedMentor(mentor)}
                        style={styles.bookBtn}
                      >
                        🤝 Book Session
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Book Session Modal */}
      {selectedMentor && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h2 style={{ margin: 0, color: "#391F25", fontSize: "20px", fontFamily: "'Poppins', sans-serif" }}>
                Book Mentorship with {selectedMentor.name}
              </h2>
              <button onClick={() => setSelectedMentor(null)} style={styles.closeBtn}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSendRequest}>
              <div style={{ marginBottom: "14px" }}>
                <label style={styles.label}>Mentorship Topic *</label>
                <input
                  type="text"
                  placeholder="e.g. Placement Guidance / Resume Feedback / Mock Interview"
                  value={requestTopic}
                  onChange={(e) => setRequestTopic(e.target.value)}
                  style={styles.input}
                  required
                />
              </div>

              <div style={{ marginBottom: "18px" }}>
                <label style={styles.label}>Brief Note & Availability *</label>
                <textarea
                  rows={4}
                  placeholder="Share your background, current challenges, and preferred meeting times..."
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  style={styles.textarea}
                  required
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => setSelectedMentor(null)}
                  style={styles.cancelBtn}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={styles.submitModalBtn}
                >
                  {submitting ? "Sending Request..." : "Confirm & Send Request →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </StudentLayout>
  );
}

const styles = {
  page: {
    padding: "30px 20px 60px 20px",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "24px",
  },
  badge: {
    backgroundColor: "#57142B",
    color: "#FFFFFF",
    padding: "4px 12px",
    borderRadius: "14px",
    fontSize: "11px",
    fontWeight: "700",
    display: "inline-block",
    marginBottom: "8px",
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
  filterCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 2px 12px rgba(57, 31, 37, 0.06)",
    border: "1px solid #DAD0BB",
    marginBottom: "26px",
  },
  searchForm: {
    display: "flex",
    gap: "10px",
    marginBottom: "16px",
  },
  searchInput: {
    flex: 1,
    padding: "11px 14px",
    borderRadius: "6px",
    border: "1.5px solid #DAD0BB",
    fontSize: "14px",
    outline: "none",
  },
  searchBtn: {
    backgroundColor: "#57142B",
    color: "#FFFFFF",
    border: "none",
    padding: "0 22px",
    borderRadius: "6px",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "14px",
  },
  filterRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "14px",
    alignItems: "flex-end",
  },
  filterGroup: {
    flex: "1 1 220px",
  },
  filterLabel: {
    display: "block",
    fontSize: "12px",
    fontWeight: "700",
    color: "#391F25",
    marginBottom: "4px",
  },
  select: {
    width: "100%",
    padding: "9px 12px",
    borderRadius: "6px",
    border: "1.5px solid #DAD0BB",
    fontSize: "13px",
    outline: "none",
    backgroundColor: "#FFFFFF",
  },
  clearBtn: {
    backgroundColor: "transparent",
    border: "1px solid #DAD0BB",
    color: "#6C574C",
    padding: "9px 14px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
    gap: "20px",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    padding: "22px",
    boxShadow: "0 2px 10px rgba(57, 31, 37, 0.06)",
    border: "1px solid #DAD0BB",
    display: "flex",
    flexDirection: "column",
  },
  cardHeaderRow: {
    display: "flex",
    gap: "12px",
    alignItems: "flex-start",
    marginBottom: "12px",
  },
  avatarCircle: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    backgroundColor: "#57142B",
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    fontSize: "18px",
    flexShrink: 0,
  },
  mentorName: {
    margin: "0 0 2px 0",
    fontSize: "16px",
    color: "#391F25",
    fontFamily: "'Poppins', sans-serif",
  },
  availableTag: {
    backgroundColor: "#E8F5E9",
    color: "#2E7D32",
    fontSize: "11px",
    fontWeight: "700",
    padding: "2px 8px",
    borderRadius: "10px",
  },
  mentorTitle: {
    margin: "0 0 2px 0",
    fontSize: "13px",
    fontWeight: "700",
    color: "#57142B",
  },
  mentorDept: {
    margin: 0,
    fontSize: "12px",
    color: "#6C574C",
  },
  bio: {
    fontSize: "12px",
    color: "#6C574C",
    fontStyle: "italic",
    lineHeight: "1.4",
    margin: "0 0 12px 0",
  },
  topicsBox: {
    marginBottom: "16px",
  },
  topicBadge: {
    backgroundColor: "#F7F5F0",
    border: "1px solid #DAD0BB",
    color: "#391F25",
    padding: "3px 8px",
    borderRadius: "4px",
    fontSize: "11px",
    fontWeight: "600",
  },
  cardActions: {
    display: "flex",
    gap: "10px",
    marginTop: "auto",
    paddingTop: "12px",
    borderTop: "1px solid #F7F5F0",
  },
  chatBtn: {
    flex: 1,
    backgroundColor: "#6C574C",
    color: "#FFFFFF",
    padding: "9px 12px",
    borderRadius: "6px",
    fontWeight: "700",
    fontSize: "12px",
    textAlign: "center",
    textDecoration: "none",
  },
  bookBtn: {
    flex: 1.5,
    backgroundColor: "#57142B",
    color: "#FFFFFF",
    border: "none",
    padding: "9px 12px",
    borderRadius: "6px",
    fontWeight: "700",
    fontSize: "12px",
    cursor: "pointer",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(57, 31, 37, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2000,
    padding: "20px",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    padding: "28px",
    width: "100%",
    maxWidth: "520px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
    border: "1px solid #DAD0BB",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "18px",
    borderBottom: "1px solid #F7F5F0",
    paddingBottom: "10px",
  },
  closeBtn: {
    backgroundColor: "transparent",
    border: "none",
    fontSize: "18px",
    color: "#887B75",
    cursor: "pointer",
  },
  label: {
    display: "block",
    color: "#391F25",
    fontSize: "13px",
    fontWeight: "700",
    marginBottom: "4px",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "10px 12px",
    borderRadius: "6px",
    border: "1.5px solid #DAD0BB",
    fontSize: "13px",
    outline: "none",
  },
  textarea: {
    width: "100%",
    boxSizing: "border-box",
    padding: "10px 12px",
    borderRadius: "6px",
    border: "1.5px solid #DAD0BB",
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
  submitModalBtn: {
    backgroundColor: "#57142B",
    color: "#FFFFFF",
    border: "none",
    padding: "9px 18px",
    borderRadius: "6px",
    fontWeight: "700",
    fontSize: "13px",
    cursor: "pointer",
  },
  alert: {
    padding: "12px",
    borderRadius: "6px",
    marginBottom: "18px",
    fontWeight: "700",
    fontSize: "13px",
  },
  loadingBox: {
    padding: "40px",
    textAlign: "center",
    color: "#6C574C",
  },
  emptyBox: {
    backgroundColor: "#FFFFFF",
    padding: "50px 20px",
    borderRadius: "12px",
    textAlign: "center",
    border: "1px solid #DAD0BB",
  },
  errorBox: {
    backgroundColor: "#FFEBEE",
    color: "#C62828",
    padding: "14px",
    borderRadius: "8px",
    textAlign: "center",
  },
};

export default FindMentors;
