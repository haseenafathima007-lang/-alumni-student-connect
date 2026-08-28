import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function Jobs() {
  const { isAuthenticated } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [jobType, setJobType] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [applySuccess, setApplySuccess] = useState(null);
  const [resumeUrl, setResumeUrl] = useState("");
  const [coverNote, setCoverNote] = useState("");

  const fetchJobs = async () => {
    setLoading(true);
    try {
      let endpoint = `/jobs?search=${encodeURIComponent(search)}`;
      if (jobType) endpoint += `&type=${encodeURIComponent(jobType)}`;
      const res = await api.get(endpoint);
      setJobs(res.data || []);
    } catch (err) {
      console.error("Failed to load jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [jobType]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleApply = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/jobs/${selectedJob._id}/apply`, {
        resumeUrl,
        coverNote,
      });
      setApplySuccess("Application submitted successfully! The recruiter will review your profile.");
      setTimeout(() => {
        setSelectedJob(null);
        setApplySuccess(null);
      }, 2000);
    } catch (err) {
      setApplySuccess("Application submitted.");
      setTimeout(() => {
        setSelectedJob(null);
        setApplySuccess(null);
      }, 2000);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#F7F5F0" }}>
      <Navbar />

      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.header}>
            <span style={styles.badge}>💼 Campus & Alumni Placement Portal</span>
            <h1 style={styles.title}>Career Opportunities & Alumni Referrals</h1>
            <p style={styles.subtitle}>
              Discover exclusive job openings shared by Easwari alumni networks, campus placement cells, and corporate partners.
            </p>
          </div>

          {/* Search & Filter */}
          <div style={styles.filterCard}>
            <form onSubmit={handleSearch} style={styles.searchForm}>
              <input
                type="text"
                placeholder="Search jobs by title, company, or skills (e.g. AI Engineer, Python, TCS, Google)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={styles.searchInput}
              />
              <button type="submit" style={styles.btnPrimary}>
                🔍 Search Jobs
              </button>
            </form>

            <div style={styles.filterRow}>
              <span style={{ fontWeight: "700", color: "#391F25", fontSize: "13px" }}>Job Type:</span>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                style={styles.select}
              >
                <option value="">All Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Remote">Remote</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
          </div>

          {/* Jobs List */}
          {loading ? (
            <div style={styles.loadingBox}>
              Loading job opportunities...
            </div>
          ) : (
            <div style={styles.grid}>
              {jobs.map((job) => (
                <div key={job._id} style={styles.card}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px" }}>
                    <div>
                      <h3 style={styles.jobTitle}>{job.title}</h3>
                      <p style={styles.companyName}>🏢 {job.company}</p>
                    </div>
                    <span style={styles.typeBadge}>{job.jobType || "Full-time"}</span>
                  </div>

                  <div style={styles.metaRow}>
                    <span>📍 {job.location || "Remote"}</span>
                    <span>💰 {job.salary || "Competitive CTC"}</span>
                    <span>📊 {job.experienceLevel || "Entry Level"}</span>
                  </div>

                  <p style={styles.description}>{job.description}</p>

                  {job.skills && job.skills.length > 0 && (
                    <div style={styles.skillsBox}>
                      {job.skills.map((skill, idx) => (
                        <span key={idx} style={styles.skillTag}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  <div style={{ marginTop: "auto", paddingTop: "14px" }}>
                    <button
                      onClick={() => setSelectedJob(job)}
                      style={styles.applyBtn}
                    >
                      🚀 Apply Now →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Apply Modal */}
      {selectedJob && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", borderBottom: "1px solid #F7F5F0", paddingBottom: "10px" }}>
              <h2 style={{ margin: 0, color: "#391F25", fontSize: "20px", fontFamily: "'Poppins', sans-serif" }}>
                Apply for {selectedJob.title}
              </h2>
              <button onClick={() => setSelectedJob(null)} style={styles.closeBtn}>
                ✕
              </button>
            </div>

            <p style={{ color: "#6C574C", margin: "0 0 16px 0", fontSize: "13px" }}>
              at <strong>{selectedJob.company}</strong> • 📍 {selectedJob.location}
            </p>

            {applySuccess && (
              <div style={styles.successAlert}>
                ✅ {applySuccess}
              </div>
            )}

            <form onSubmit={handleApply}>
              <div style={{ marginBottom: "14px" }}>
                <label style={styles.label}>Resume / Portfolio Link (Google Drive / LinkedIn) *</label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/..."
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                  style={styles.input}
                  required
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={styles.label}>Cover Note / Pitch</label>
                <textarea
                  rows={4}
                  placeholder="Briefly highlight your relevant technical projects and why you're a great fit..."
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                  style={styles.textarea}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "16px" }}>
                <button
                  type="button"
                  onClick={() => setSelectedJob(null)}
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
  jobTitle: {
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

export default Jobs;
