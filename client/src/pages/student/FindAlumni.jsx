import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import StudentLayout from "../../layouts/StudentLayout";
import { api } from "../../services/api";
import { DEPARTMENTS } from "../../constants/departments";

function FindAlumni() {
  const [alumniList, setAlumniList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");

  // Modals
  const [viewingAlumni, setViewingAlumni] = useState(null);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [requestTopic, setRequestTopic] = useState("");
  const [requestMessage, setRequestMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const fetchAlumni = async () => {
    setLoading(true);
    setError(null);
    try {
      let endpoint = `/alumni?search=${encodeURIComponent(search)}`;
      if (selectedDept) endpoint += `&department=${encodeURIComponent(selectedDept)}`;
      if (selectedBatch) endpoint += `&batch=${encodeURIComponent(selectedBatch)}`;
      const res = await api.get(endpoint);
      let data = res.data || [];
      if (selectedSkill) {
        const skillTerm = selectedSkill.toLowerCase();
        data = data.filter((a) =>
          a.profile?.expertise?.some((s) => s.toLowerCase().includes(skillTerm))
        );
      }
      setAlumniList(data);
    } catch (err) {
      console.error("Failed to load alumni:", err.message);
      setError("Unable to load alumni. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlumni();
  }, [selectedDept, selectedBatch, selectedSkill]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchAlumni();
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
      console.error("Mentorship request failed:", err);
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
            <h1 style={styles.title}>🎓 Easwari Alumni Directory</h1>
            <p style={styles.subtitle}>
              Discover verified graduates from Easwari Engineering College across departments, batches, and top global tech companies.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div style={styles.filterCard}>
            <form onSubmit={handleSearchSubmit} style={styles.searchForm}>
              <input
                type="text"
                placeholder="Search by name, company, designation, or skills (e.g. TCS, Google, Python, AI, React)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={styles.searchInput}
              />
              <button type="submit" style={styles.searchBtn}>
                🔍 Search
              </button>
            </form>

            <div style={styles.filterRow}>
              {/* Department Filter with AI & DS */}
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

              {/* Batch Filter */}
              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>Graduation Batch:</label>
                <select
                  value={selectedBatch}
                  onChange={(e) => setSelectedBatch(e.target.value)}
                  style={styles.select}
                >
                  <option value="">All Batches</option>
                  <option value="2024">Batch 2024</option>
                  <option value="2023">Batch 2023</option>
                  <option value="2022">Batch 2022</option>
                  <option value="2021">Batch 2021</option>
                  <option value="2020">Batch 2020</option>
                  <option value="2019">Batch 2019</option>
                  <option value="2018">Batch 2018</option>
                </select>
              </div>

              {/* Skill Filter */}
              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>Skill Expertise:</label>
                <select
                  value={selectedSkill}
                  onChange={(e) => setSelectedSkill(e.target.value)}
                  style={styles.select}
                >
                  <option value="">All Skills</option>
                  <option value="Java">Java / Spring Boot</option>
                  <option value="Python">Python / AI & ML</option>
                  <option value="React">React.js / Frontend</option>
                  <option value="Cloud">Cloud / AWS / Azure</option>
                  <option value="System Design">System Design</option>
                  <option value="Data Science">Data Science & Analytics</option>
                </select>
              </div>

              {(search || selectedDept || selectedBatch || selectedSkill) && (
                <button
                  onClick={() => {
                    setSearch("");
                    setSelectedDept("");
                    setSelectedBatch("");
                    setSelectedSkill("");
                  }}
                  style={styles.clearBtn}
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Feedback message */}
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

          {/* Alumni Grid */}
          {loading ? (
            <div style={styles.loadingBox}>Loading verified alumni directory...</div>
          ) : error ? (
            <div style={styles.errorBox}>{error}</div>
          ) : alumniList.length === 0 ? (
            <div style={styles.emptyBox}>
              <span style={{ fontSize: "40px" }}>🔍</span>
              <h3 style={{ color: "#391F25", margin: "0 0 8px 0" }}>No alumni found matching your filters</h3>
              <p style={{ color: "#6C574C", margin: 0 }}>Try adjusting your department or keyword search.</p>
            </div>
          ) : (
            <div style={styles.grid}>
              {alumniList.map((person) => {
                const p = person.profile || {};
                const isMentorAvailable = p.isMentoring !== false;

                return (
                  <div key={person._id} style={styles.card}>
                    <div style={styles.cardHeaderRow}>
                      <div style={styles.avatarCircle}>
                        {person.avatar ? (
                          <img
                            src={person.avatar}
                            alt={person.name}
                            style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                          />
                        ) : (
                          person.name ? person.name.charAt(0).toUpperCase() : "A"
                        )}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "6px" }}>
                          <h3 style={styles.cardName}>{person.name}</h3>
                          <span
                            style={{
                              ...styles.badge,
                              backgroundColor: isMentorAvailable ? "#E8F5E9" : "#F7F5F0",
                              color: isMentorAvailable ? "#2E7D32" : "#6C574C",
                            }}
                          >
                            {isMentorAvailable ? "🤝 Mentoring" : "💼 Networking"}
                          </span>
                        </div>
                        <p style={styles.cardRole}>
                          {p.jobTitle || "Software Professional"}
                        </p>
                        <p style={styles.cardCompany}>🏢 {p.company || "Leading Tech Firm"}</p>
                      </div>
                    </div>

                    <div style={styles.metaRow}>
                      <span>🎓 {p.department || "Artificial Intelligence and Data Science"} • Batch: {p.batch || (p.batchStart && p.batchEnd ? `${p.batchStart} – ${p.batchEnd}` : p.graduationYear || "2020 – 2024")}</span>
                    </div>

                    {p.bio && <p style={styles.bio}>"{p.bio}"</p>}

                    {p.expertise && p.expertise.length > 0 && (
                      <div style={styles.skillsBox}>
                        {p.expertise.map((skill, idx) => (
                          <span key={idx} style={styles.skillBadge}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    <div style={styles.cardActions}>
                      <button
                        onClick={() => setViewingAlumni(person)}
                        style={styles.viewProfileBtn}
                      >
                        View Profile
                      </button>

                      <Link
                        to={`/student/chat?user=${person.userId || person._id}`}
                        style={styles.msgBtn}
                      >
                        💬 Message
                      </Link>

                      {isMentorAvailable && (
                        <button
                          onClick={() => setSelectedMentor(person)}
                          style={styles.connectBtn}
                        >
                          🤝 Request
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* View Profile Modal */}
      {viewingAlumni && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h2 style={{ margin: 0, color: "#391F25", fontSize: "20px", fontFamily: "'Poppins', sans-serif" }}>
                Alumni Profile Details
              </h2>
              <button
                onClick={() => setViewingAlumni(null)}
                style={styles.closeBtn}
              >
                ✕
              </button>
            </div>

            <div style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "20px" }}>
              <div style={{ ...styles.avatarCircle, width: "64px", height: "64px", fontSize: "24px" }}>
                {viewingAlumni.name ? viewingAlumni.name.charAt(0).toUpperCase() : "A"}
              </div>
              <div>
                <h3 style={{ margin: "0 0 4px 0", color: "#391F25", fontSize: "20px" }}>{viewingAlumni.name}</h3>
                <p style={{ margin: 0, color: "#57142B", fontWeight: "700", fontSize: "14px" }}>
                  {viewingAlumni.profile?.jobTitle || "Professional"} @ {viewingAlumni.profile?.company || "Tech Corp"}
                </p>
                <span style={{ color: "#6C574C", fontSize: "13px" }}>
                  🎓 {viewingAlumni.profile?.department || "Artificial Intelligence and Data Science"} • Batch: {viewingAlumni.profile?.batch || (viewingAlumni.profile?.batchStart && viewingAlumni.profile?.batchEnd ? `${viewingAlumni.profile.batchStart} – ${viewingAlumni.profile.batchEnd}` : viewingAlumni.profile?.graduationYear || "2020 – 2024")}
                </span>
              </div>
            </div>

            {viewingAlumni.profile?.bio && (
              <div style={styles.modalSection}>
                <h4 style={styles.sectionHeader}>Professional Summary</h4>
                <p style={{ margin: 0, color: "#391F25", lineHeight: "1.6", fontSize: "13px" }}>
                  {viewingAlumni.profile.bio}
                </p>
              </div>
            )}

            {viewingAlumni.profile?.expertise && (
              <div style={styles.modalSection}>
                <h4 style={styles.sectionHeader}>Technical Expertise</h4>
                <div style={styles.skillsBox}>
                  {viewingAlumni.profile.expertise.map((s, idx) => (
                    <span key={idx} style={styles.skillBadge}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "24px" }}>
              <button
                onClick={() => setViewingAlumni(null)}
                style={styles.cancelBtn}
              >
                Close
              </button>
              <Link
                to={`/student/chat?user=${viewingAlumni.userId || viewingAlumni._id}`}
                style={styles.msgBtn}
              >
                💬 Open Chat
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Mentorship Request Modal */}
      {selectedMentor && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h2 style={{ margin: 0, color: "#391F25", fontSize: "20px", fontFamily: "'Poppins', sans-serif" }}>
                Request Mentorship with {selectedMentor.name}
              </h2>
              <button
                onClick={() => setSelectedMentor(null)}
                style={styles.closeBtn}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendRequest}>
              <div style={{ marginBottom: "14px" }}>
                <label style={styles.label}>Guidance Topic *</label>
                <input
                  type="text"
                  placeholder="e.g. AI Placement Prep / Resume Review / System Design"
                  value={requestTopic}
                  onChange={(e) => setRequestTopic(e.target.value)}
                  style={styles.input}
                  required
                />
              </div>

              <div style={{ marginBottom: "18px" }}>
                <label style={styles.label}>Message to Mentor *</label>
                <textarea
                  rows={4}
                  placeholder="Introduce yourself, your academic year, and specific questions for the mentor..."
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
                  style={styles.primaryModalBtn}
                >
                  {submitting ? "Sending..." : "Submit Request →"}
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
    flex: "1 1 200px",
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
    gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
    gap: "20px",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 2px 10px rgba(57, 31, 37, 0.06)",
    border: "1px solid #DAD0BB",
    display: "flex",
    flexDirection: "column",
  },
  cardHeaderRow: {
    display: "flex",
    gap: "12px",
    alignItems: "flex-start",
    marginBottom: "10px",
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
  cardName: {
    margin: "0 0 2px 0",
    fontSize: "16px",
    color: "#391F25",
    fontFamily: "'Poppins', sans-serif",
  },
  cardRole: {
    margin: "0 0 2px 0",
    fontSize: "13px",
    fontWeight: "700",
    color: "#57142B",
  },
  cardCompany: {
    margin: 0,
    fontSize: "12px",
    color: "#6C574C",
  },
  badge: {
    fontSize: "11px",
    padding: "2px 8px",
    borderRadius: "12px",
    fontWeight: "700",
  },
  metaRow: {
    fontSize: "12px",
    color: "#887B75",
    marginBottom: "8px",
  },
  bio: {
    fontSize: "12px",
    color: "#6C574C",
    fontStyle: "italic",
    lineHeight: "1.4",
    margin: "0 0 10px 0",
    flex: 1,
  },
  skillsBox: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
    marginBottom: "14px",
  },
  skillBadge: {
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
    gap: "8px",
    marginTop: "auto",
    paddingTop: "10px",
    borderTop: "1px solid #F7F5F0",
  },
  viewProfileBtn: {
    flex: 1,
    backgroundColor: "#F7F5F0",
    color: "#391F25",
    border: "1px solid #DAD0BB",
    padding: "8px 10px",
    borderRadius: "6px",
    fontWeight: "700",
    fontSize: "12px",
    cursor: "pointer",
  },
  msgBtn: {
    backgroundColor: "#6C574C",
    color: "#FFFFFF",
    padding: "8px 12px",
    borderRadius: "6px",
    textDecoration: "none",
    fontWeight: "700",
    fontSize: "12px",
    display: "inline-flex",
    alignItems: "center",
  },
  connectBtn: {
    backgroundColor: "#57142B",
    color: "#FFFFFF",
    border: "none",
    padding: "8px 12px",
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
    maxHeight: "90vh",
    overflowY: "auto",
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
  modalSection: {
    marginBottom: "14px",
  },
  sectionHeader: {
    fontSize: "13px",
    color: "#57142B",
    margin: "0 0 4px 0",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
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
  primaryModalBtn: {
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

export default FindAlumni;
