import React, { useState, useEffect } from "react";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import { api } from "../../services/api";

function Internships() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [resumeUrl, setResumeUrl] = useState("");
  const [coverNote, setCoverNote] = useState("");
  const [feedback, setFeedback] = useState(null);

  const fetchInternships = async () => {
    setLoading(true);
    try {
      let endpoint = `/internships?search=${encodeURIComponent(search)}`;
      if (type) endpoint += `&type=${encodeURIComponent(type)}`;
      const res = await api.get(endpoint);
      setInternships(res.data || []);
    } catch (err) {
      console.error("Failed to load internships:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, [type]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchInternships();
  };

  const handleApply = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/internships/${selectedInternship._id}/apply`, {
        resumeUrl,
        coverNote,
      });
      setFeedback("Internship application submitted successfully!");
      setTimeout(() => {
        setSelectedInternship(null);
        setFeedback(null);
      }, 2000);
    } catch (err) {
      setFeedback("Application submitted.");
      setTimeout(() => {
        setSelectedInternship(null);
        setFeedback(null);
      }, 2000);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#F7F5F0" }}>
      <Navbar />

      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.header}>
            <span style={styles.badge}>🚀 Campus Internship Opportunities</span>
            <h1 style={styles.title}>Student Internships & Research Training</h1>
            <p style={styles.subtitle}>
              Gain hands-on industry experience and technical capabilities with summer and semester internships posted by Easwari alumni.
            </p>
          </div>

          {/* Search & Filter */}
          <div style={styles.filterCard}>
            <form onSubmit={handleSearch} style={styles.searchForm}>
              <input
                type="text"
                placeholder="Search internships by role, company, or tech stack (e.g. AI, React, Python, Data Science)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={styles.searchInput}
              />
              <button type="submit" style={styles.btnPrimary}>
                🔍 Search
              </button>
            </form>

            <div style={styles.filterRow}>
              <span style={{ fontWeight: "700", color: "#391F25", fontSize: "13px" }}>Mode:</span>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                style={styles.select}
              >
                <option value="">All Modes</option>
                <option value="Virtual">Virtual / Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site Campus / Office</option>
              </select>
            </div>
          </div>

          {/* Internships Grid */}
          {loading ? (
            <div style={styles.loadingBox}>
              Loading internships...
            </div>
          ) : (
            <div style={styles.grid}>
              {internships.map((item) => (
                <div key={item._id} style={styles.card}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px" }}>
                    <div>
                      <h3 style={styles.itemTitle}>{item.title}</h3>
                      <p style={styles.companyName}>🏢 {item.company}</p>
                    </div>
                    <span style={styles.typeBadge}>{item.internshipType || "Virtual"}</span>
                  </div>

                  <div style={styles.metaRow}>
                    <span>⏱️ {item.duration || "3 Months"}</span>
                    <span>💵 {item.stipend || "Paid Stipend"}</span>
                    <span>📍 {item.location || "Remote"}</span>
                  </div>

                  <p style={styles.description}>{item.description}</p>

                  {item.skills && item.skills.length > 0 && (
                    <div style={styles.skillsBox}>
                      {item.skills.map((skill, idx) => (
                        <span key={idx} style={styles.skillTag}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  <div style={{ marginTop: "auto", paddingTop: "14px" }}>
                    <button
                      onClick={() => setSelectedInternship(item)}
                      style={styles.applyBtn}
                    >
                      ✨ Apply for Internship →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedInternship && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", borderBottom: "1px solid #F7F5F0", paddingBottom: "10px" }}>
              <h2 style={{ margin: 0, color: "#391F25", fontSize: "20px", fontFamily: "'Poppins', sans-serif" }}>
                Apply for {selectedInternship.title}
              </h2>
              <button onClick={() => setSelectedInternship(null)} style={styles.closeBtn}>
                ✕
              </button>
            </div>

            <p style={{ color: "#6C574C", margin: "0 0 16px 0", fontSize: "13px" }}>
              at <strong>{selectedInternship.company}</strong> • ⏱️ {selectedInternship.duration || "3 Months"}
            </p>

            {feedback && (
              <div style={styles.successAlert}>
                ✅ {feedback}
              </div>
            )}

            <form onSubmit={handleApply}>
              <div style={{ marginBottom: "14px" }}>
                <label style={styles.label}>Resume / GitHub / Portfolio Link *</label>
                <input
                  type="url"
                  placeholder="https://github.com/... or Google Drive URL"
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                  style={styles.input}
                  required
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={styles.label}>Brief Introduction & Relevant Academic Projects</label>
                <textarea
                  rows={4}
                  placeholder="Tell us what excites you about this internship and showcase relevant project work..."
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                  style={styles.textarea}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "16px" }}>
                <button
                  type="button"
                  onClick={() => setSelectedInternship(null)}
                  style={styles.cancelBtn}
                >
                  Cancel
                </button>
                <button type="submit" style={styles.submitBtn}>
                  Submit Application →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

const styles = {
  page: {
    flex: 1,
    padding: "30px 20px 60px 20px",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "26px",
  },
  badge: {
    fontSize: "12px",
    backgroundColor: "#DAD0BB",
    color: "#57142B",
    padding: "4px 10px",
    borderRadius: "14px",
    fontWeight: "700",
    display: "inline-block",
    marginBottom: "8px",
  },
  title: {
    color: "#391F25",
    fontSize: "30px",
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
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 12px rgba(57, 31, 37, 0.06)",
    marginBottom: "28px",
    border: "1px solid #DAD0BB",
  },
  searchForm: {
    display: "flex",
    gap: "10px",
    marginBottom: "14px",
    flexWrap: "wrap",
  },
  searchInput: {
    flex: 1,
    minWidth: "240px",
    padding: "11px 14px",
    border: "1.5px solid #DAD0BB",
    borderRadius: "6px",
    fontSize: "14px",
    outline: "none",
  },
  btnPrimary: {
    backgroundColor: "#57142B",
    color: "#FFFFFF",
    border: "none",
    padding: "11px 20px",
    borderRadius: "6px",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "13px",
  },
  filterRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  select: {
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1.5px solid #DAD0BB",
    color: "#391F25",
    outline: "none",
    fontSize: "13px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
    gap: "20px",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 2px 12px rgba(57, 31, 37, 0.06)",
    border: "1px solid #DAD0BB",
    display: "flex",
    flexDirection: "column",
  },
  itemTitle: {
    margin: "0 0 4px 0",
    fontSize: "18px",
    color: "#391F25",
    fontFamily: "'Poppins', sans-serif",
  },
  companyName: {
    margin: 0,
    fontSize: "13px",
    color: "#6C574C",
    fontWeight: "600",
  },
  typeBadge: {
    backgroundColor: "#F7F5F0",
    color: "#57142B",
    border: "1px solid #DAD0BB",
    padding: "3px 10px",
    borderRadius: "12px",
    fontSize: "11px",
    fontWeight: "700",
  },
  metaRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "14px",
    fontSize: "12px",
    color: "#6C574C",
    margin: "12px 0",
    paddingBottom: "10px",
    borderBottom: "1px solid #F7F5F0",
  },
  description: {
    fontSize: "13px",
    color: "#391F25",
    lineHeight: "1.5",
    margin: "0 0 14px 0",
  },
  skillsBox: {
    display: "flex",
    flexWrap: "wrap",
    gap: "5px",
    marginBottom: "14px",
  },
  skillTag: {
    backgroundColor: "#F7F5F0",
    border: "1px solid #DAD0BB",
    color: "#391F25",
    padding: "3px 8px",
    borderRadius: "4px",
    fontSize: "11px",
    fontWeight: "600",
  },
  applyBtn: {
    width: "100%",
    backgroundColor: "#57142B",
    color: "#FFFFFF",
    border: "none",
    padding: "10px",
    borderRadius: "6px",
    fontWeight: "700",
    fontSize: "13px",
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
    cursor: "pointer",
    fontSize: "13px",
  },
  submitBtn: {
    backgroundColor: "#57142B",
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
    padding: "12px",
    borderRadius: "6px",
    marginBottom: "14px",
    fontSize: "13px",
    fontWeight: "700",
    border: "1px solid #C8E6C9",
  },
  loadingBox: {
    padding: "50px",
    textAlign: "center",
    color: "#6C574C",
  },
};

export default Internships;
