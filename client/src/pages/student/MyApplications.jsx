import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import StudentLayout from "../../layouts/StudentLayout";
import { api } from "../../services/api";

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    setLoading(true);
    api
      .get("/applications/my")
      .then((res) => {
        setApplications(res.data || []);
      })
      .catch((err) => {
        console.error("Failed to load applications:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "shortlisted":
        return { text: "⭐ Shortlisted", bg: "#F3E5F5", color: "#6A1B9A" };
      case "under_review":
        return { text: "🔍 Under Review", bg: "#FFF8E1", color: "#F57F17" };
      case "accepted":
        return { text: "✅ Selected", bg: "#E8F5E9", color: "#2E7D32" };
      case "rejected":
        return { text: "❌ Closed", bg: "#FFEBEE", color: "#C62828" };
      default:
        return { text: "📨 Applied", bg: "#F7F5F0", color: "#391F25" };
    }
  };

  const filtered = applications.filter((app) => {
    if (activeTab === "jobs") return app.itemType === "job";
    if (activeTab === "internships") return app.itemType === "internship";
    return true;
  });

  return (
    <StudentLayout>
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.header}>
            <h1 style={styles.title}>📄 My Applications & Placement Tracker</h1>
            <p style={styles.subtitle}>
              Track the live review status of your job applications and internship proposals submitted to Easwari alumni recruiters.
            </p>
          </div>

          {/* Quick Filter Tabs */}
          <div style={styles.tabRow}>
            {[
              { key: "all", label: `All Applications (${applications.length})` },
              { key: "jobs", label: "Jobs" },
              { key: "internships", label: "Internships" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  ...styles.tabBtn,
                  ...(activeTab === tab.key ? styles.activeTabBtn : {}),
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={styles.loadingBox}>
              Loading your submitted applications...
            </div>
          ) : filtered.length === 0 ? (
            <div style={styles.emptyBox}>
              <span style={{ fontSize: "40px" }}>📄</span>
              <h3 style={{ color: "#391F25", margin: "10px 0 6px 0" }}>No applications found</h3>
              <p style={{ color: "#6C574C", margin: "0 0 18px 0" }}>Explore campus referral jobs and internships to apply.</p>
              <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
                <Link to="/jobs" style={styles.primaryBtn}>
                  Browse Jobs
                </Link>
                <Link to="/internships" style={styles.secondaryBtn}>
                  Browse Internships
                </Link>
              </div>
            </div>
          ) : (
            <div style={styles.grid}>
              {filtered.map((app) => {
                const badge = getStatusBadge(app.status);
                return (
                  <div key={app._id} style={styles.card}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px" }}>
                      <div>
                        <span style={styles.typeBadge}>
                          {app.itemType === "job" ? "💼 Job Application" : "🚀 Internship Application"}
                        </span>
                        <h3 style={styles.appTitle}>{app.title || app.appliedFor}</h3>
                        <p style={styles.company}>🏢 {app.company}</p>
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

                    <div style={styles.metaRow}>
                      <span>📍 {app.location || "On-Campus / Hybrid"}</span>
                      <span>💰 {app.salaryOrStipend || "Competitive"}</span>
                      <span>📅 Applied: {app.appliedAt || app.appliedDate}</span>
                    </div>

                    <div style={{ marginTop: "auto", paddingTop: "6px" }}>
                      <p style={{ margin: 0, fontSize: "12px", color: "#6C574C" }}>
                        Application submitted with your student resume profile.
                      </p>
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
    gap: "16px",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    padding: "22px",
    boxShadow: "0 2px 10px rgba(57, 31, 37, 0.06)",
    border: "1px solid #DAD0BB",
  },
  typeBadge: {
    fontSize: "11px",
    fontWeight: "700",
    color: "#57142B",
    textTransform: "uppercase",
    display: "block",
    marginBottom: "4px",
  },
  appTitle: {
    margin: "0 0 4px 0",
    fontSize: "18px",
    color: "#391F25",
    fontFamily: "'Poppins', sans-serif",
  },
  company: {
    margin: 0,
    fontSize: "13px",
    color: "#6C574C",
  },
  metaRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "16px",
    fontSize: "12px",
    color: "#6C574C",
    margin: "12px 0",
    padding: "8px 0",
    borderTop: "1px solid #F7F5F0",
    borderBottom: "1px solid #F7F5F0",
  },
  emptyBox: {
    backgroundColor: "#FFFFFF",
    padding: "50px 20px",
    borderRadius: "12px",
    textAlign: "center",
    border: "1px solid #DAD0BB",
  },
  primaryBtn: {
    backgroundColor: "#57142B",
    color: "#FFFFFF",
    padding: "10px 18px",
    borderRadius: "6px",
    textDecoration: "none",
    fontWeight: "700",
    fontSize: "13px",
  },
  secondaryBtn: {
    backgroundColor: "#6C574C",
    color: "#FFFFFF",
    padding: "10px 18px",
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

export default MyApplications;
