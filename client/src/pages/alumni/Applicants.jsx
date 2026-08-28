import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AlumniLayout from "../../layouts/AlumniLayout";
import { api } from "../../services/api";

function Applicants() {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const [feedback, setFeedback] = useState(null);

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      const res = await api.get("/applications");
      setApplicants(res.data || []);
    } catch (err) {
      console.error("Failed to load applicants:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/applications/${id}/status`, { status: newStatus });
      setApplicants((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: newStatus } : a))
      );
      setFeedback(`Candidate status updated to ${newStatus.toUpperCase()}`);
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "shortlisted":
        return { text: "⭐ Shortlisted", bg: "#F3E5F5", color: "#6A1B9A" };
      case "accepted":
        return { text: "✅ Selected", bg: "#E8F5E9", color: "#2E7D32" };
      case "rejected":
        return { text: "❌ Rejected", bg: "#FFEBEE", color: "#C62828" };
      default:
        return { text: "🔍 Under Review", bg: "#FFF8E1", color: "#F57F17" };
    }
  };

  const filtered = applicants.filter((a) => {
    if (filterType === "jobs") return a.itemType === "job";
    if (filterType === "internships") return a.itemType === "internship";
    if (filterType === "shortlisted") return a.status === "shortlisted";
    return true;
  });

  return (
    <AlumniLayout>
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.header}>
            <h1 style={styles.title}>📄 Candidate Resumes & Placement Screening</h1>
            <p style={styles.subtitle}>
              Review Easwari students applying for your posted job openings and internship programs.
            </p>
          </div>

          {feedback && (
            <div style={styles.alert}>
              ✅ {feedback}
            </div>
          )}

          {/* Filter Tabs */}
          <div style={styles.tabRow}>
            {[
              { key: "all", label: `All Candidates (${applicants.length})` },
              { key: "jobs", label: "Job Applications" },
              { key: "internships", label: "Internships" },
              { key: "shortlisted", label: "Shortlisted Candidates" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilterType(tab.key)}
                style={{
                  ...styles.tabBtn,
                  ...(filterType === tab.key ? styles.activeTabBtn : {}),
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={styles.loadingBox}>
              Loading candidate applications...
            </div>
          ) : filtered.length === 0 ? (
            <div style={styles.emptyBox}>
              <span style={{ fontSize: "40px" }}>📄</span>
              <h3 style={{ color: "#391F25", margin: "10px 0 6px 0" }}>No applicants matching current filter</h3>
              <p style={{ color: "#6C574C", margin: 0 }}>Applications submitted by students will appear here in real time.</p>
            </div>
          ) : (
            <div style={styles.grid}>
              {filtered.map((app) => {
                const badge = getStatusBadge(app.status);
                return (
                  <div key={app._id} style={styles.card}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px" }}>
                      <div>
                        <h3 style={styles.candidateName}>{app.studentName}</h3>
                        <p style={styles.departmentText}>
                          🎓 {app.department || "Artificial Intelligence and Data Science"} (Batch {app.batch || "2024"}) • CGPA: {app.cgpa || "8.5"}
                        </p>
                        <p style={styles.appliedForText}>
                          Applied For: <strong>{app.appliedFor || app.title}</strong> ({app.itemType === "job" ? "💼 Job" : "🚀 Internship"})
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

                    {app.skills && app.skills.length > 0 && (
                      <div style={styles.skillsBox}>
                        {app.skills.map((s, idx) => (
                          <span key={idx} style={styles.skillTag}>
                            {s}
                          </span>
                        ))}
                      </div>
                    )}

                    {app.coverNote && (
                      <p style={styles.coverNote}>"{app.coverNote}"</p>
                    )}

                    <div style={styles.actionRow}>
                      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                        <a
                          href={app.resumeUrl || "https://drive.google.com"}
                          target="_blank"
                          rel="noreferrer"
                          style={styles.resumeBtn}
                        >
                          📄 View Resume
                        </a>
                        <Link
                          to={`/alumni/chat?user=${app.applicant || ""}`}
                          style={styles.msgBtn}
                        >
                          💬 Message Candidate
                        </Link>
                      </div>

                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        <button
                          onClick={() => handleStatusChange(app._id, "shortlisted")}
                          style={styles.shortlistBtn}
                        >
                          ⭐ Shortlist
                        </button>
                        <button
                          onClick={() => handleStatusChange(app._id, "accepted")}
                          style={styles.selectBtn}
                        >
                          ✓ Select
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AlumniLayout>
  );
}

const styles = {
  page: {
    padding: "30px 20px 60px 20px",
  },
  container: {
    maxWidth: "1100px",
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
  tabRow: {
    display: "flex",
    gap: "10px",
    marginBottom: "22px",
    flexWrap: "wrap",
  },
  tabBtn: {
    padding: "9px 16px",
    borderRadius: "6px",
    border: "1.5px solid #DAD0BB",
    backgroundColor: "#FFFFFF",
    color: "#391F25",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "13px",
  },
  activeTabBtn: {
    backgroundColor: "#57142B",
    color: "#FFFFFF",
    borderColor: "#57142B",
  },
  grid: {
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
  candidateName: {
    margin: "0 0 4px 0",
    fontSize: "18px",
    color: "#391F25",
    fontFamily: "'Poppins', sans-serif",
  },
  departmentText: {
    margin: "0 0 4px 0",
    fontSize: "13px",
    color: "#6C574C",
  },
  appliedForText: {
    margin: 0,
    fontSize: "13px",
    color: "#391F25",
  },
  skillsBox: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
    margin: "12px 0",
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
  coverNote: {
    backgroundColor: "#F7F5F0",
    padding: "10px 14px",
    borderRadius: "6px",
    fontStyle: "italic",
    color: "#391F25",
    fontSize: "13px",
    margin: "10px 0",
    border: "1px solid #DAD0BB",
  },
  actionRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderTop: "1px solid #F7F5F0",
    paddingTop: "14px",
    flexWrap: "wrap",
    gap: "10px",
  },
  resumeBtn: {
    backgroundColor: "#F7F5F0",
    border: "1px solid #DAD0BB",
    color: "#391F25",
    padding: "8px 14px",
    borderRadius: "6px",
    textDecoration: "none",
    fontWeight: "700",
    fontSize: "12px",
    display: "inline-block",
  },
  msgBtn: {
    backgroundColor: "#6C574C",
    color: "#FFFFFF",
    padding: "8px 14px",
    borderRadius: "6px",
    textDecoration: "none",
    fontWeight: "700",
    fontSize: "12px",
    display: "inline-block",
  },
  shortlistBtn: {
    backgroundColor: "#57142B",
    color: "#FFFFFF",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    fontWeight: "700",
    fontSize: "12px",
    cursor: "pointer",
  },
  selectBtn: {
    backgroundColor: "#2E7D32",
    color: "#FFFFFF",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    fontWeight: "700",
    fontSize: "12px",
    cursor: "pointer",
  },
  emptyBox: {
    backgroundColor: "#FFFFFF",
    padding: "50px 20px",
    borderRadius: "12px",
    textAlign: "center",
    border: "1px solid #DAD0BB",
  },
  alert: {
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

export default Applicants;
