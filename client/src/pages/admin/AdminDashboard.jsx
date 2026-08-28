import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";

function AdminDashboard() {
  const { user } = useAuth();

  const [metrics, setMetrics] = useState({
    totalStudents: 1450,
    totalAlumni: 820,
    totalFaculty: 95,
    pendingVerifications: 3,
    activeMentorships: 112,
    jobsPosted: 45,
    internshipsPosted: 28,
    upcomingEvents: 6,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get("/admin/stats")
      .then((res) => {
        if (res.data) {
          setMetrics(res.data);
        }
      })
      .catch((err) => {
        console.error("Failed to load admin stats:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <div style={styles.page}>
        <div style={styles.container}>
          {/* Header */}
          <div style={styles.welcomeBanner}>
            <div>
              <span style={styles.badge}>🛡️ Institutional Administration Portal</span>
              <h1 style={styles.title}>
                System Administration & Governance
              </h1>
              <p style={styles.subtitle}>
                Easwari Engineering College • User verification, platform compliance, security auditing, and placement reporting.
              </p>
            </div>
            <Link to="/admin/verify-alumni" style={styles.actionBtn}>
              ⚠️ Review Pending Verifications ({metrics.pendingVerifications})
            </Link>
          </div>

          {loading && (
            <p style={{ color: "#6C574C", margin: "0 0 15px 0", fontSize: "13px" }}>
              Refreshing real-time platform statistics...
            </p>
          )}

          {/* Metrics Grid */}
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={{ ...styles.statIcon, backgroundColor: "#F7F5F0" }}>🎓</div>
              <div>
                <h3 style={styles.statValue}>{metrics.totalStudents}</h3>
                <p style={styles.statLabel}>Registered Students</p>
              </div>
            </div>

            <div style={styles.statCard}>
              <div style={{ ...styles.statIcon, backgroundColor: "#F7F5F0" }}>💼</div>
              <div>
                <h3 style={styles.statValue}>{metrics.totalAlumni}</h3>
                <p style={styles.statLabel}>Registered Alumni</p>
              </div>
            </div>

            <div style={styles.statCard}>
              <div style={{ ...styles.statIcon, backgroundColor: "#F7F5F0" }}>👩‍🏫</div>
              <div>
                <h3 style={styles.statValue}>{metrics.totalFaculty}</h3>
                <p style={styles.statLabel}>Faculty Members</p>
              </div>
            </div>

            <div style={styles.statCard}>
              <div style={{ ...styles.statIcon, backgroundColor: "#FFEBEE" }}>⚠️</div>
              <div>
                <h3 style={{ ...styles.statValue, color: "#C62828" }}>{metrics.pendingVerifications}</h3>
                <p style={styles.statLabel}>Pending Verifications</p>
              </div>
            </div>

            <div style={styles.statCard}>
              <div style={{ ...styles.statIcon, backgroundColor: "#E8F5E9" }}>🤝</div>
              <div>
                <h3 style={{ ...styles.statValue, color: "#2E7D32" }}>{metrics.activeMentorships}</h3>
                <p style={styles.statLabel}>Active Mentorships</p>
              </div>
            </div>

            <div style={styles.statCard}>
              <div style={{ ...styles.statIcon, backgroundColor: "#F7F5F0" }}>💼</div>
              <div>
                <h3 style={styles.statValue}>{metrics.jobsPosted}</h3>
                <p style={styles.statLabel}>Jobs Available</p>
              </div>
            </div>

            <div style={styles.statCard}>
              <div style={{ ...styles.statIcon, backgroundColor: "#F7F5F0" }}>🚀</div>
              <div>
                <h3 style={styles.statValue}>{metrics.internshipsPosted}</h3>
                <p style={styles.statLabel}>Internship Openings</p>
              </div>
            </div>

            <div style={styles.statCard}>
              <div style={{ ...styles.statIcon, backgroundColor: "#FFF8E1" }}>📅</div>
              <div>
                <h3 style={{ ...styles.statValue, color: "#F57F17" }}>{metrics.upcomingEvents}</h3>
                <p style={styles.statLabel}>Upcoming Masterclasses</p>
              </div>
            </div>
          </div>

          {/* Quick Management Modules */}
          <h2 style={styles.sectionTitle}>Platform Administration & Moderation Modules</h2>
          <div style={styles.actionsGrid}>
            <div style={styles.actionCard}>
              <span style={styles.cardEmoji}>✅</span>
              <h3 style={styles.cardHeading}>Verify Alumni Accounts</h3>
              <p style={styles.cardText}>
                Validate graduate degree batches, roll numbers, and proof of graduation for official badge.
              </p>
              <Link to="/admin/verify-alumni" style={styles.cardBtn}>
                Verify Alumni →
              </Link>
            </div>

            <div style={styles.actionCard}>
              <span style={styles.cardEmoji}>👥</span>
              <h3 style={styles.cardHeading}>User Directory Management</h3>
              <p style={styles.cardText}>
                Audit user accounts across Student, Alumni, Faculty, and Admin roles.
              </p>
              <Link to="/admin/users" style={styles.cardBtn}>
                Manage Users →
              </Link>
            </div>

            <div style={styles.actionCard}>
              <span style={styles.cardEmoji}>💼</span>
              <h3 style={styles.cardHeading}>Moderate Jobs & Internships</h3>
              <p style={styles.cardText}>
                Ensure posted openings meet college safety and fair compensation standards.
              </p>
              <Link to="/admin/jobs" style={styles.cardBtn}>
                Manage Postings →
              </Link>
            </div>

            <div style={styles.actionCard}>
              <span style={styles.cardEmoji}>📈</span>
              <h3 style={styles.cardHeading}>Platform Analytics & Reports</h3>
              <p style={styles.cardText}>
                Export department placement metrics, mentorship success rates, and engagement reports.
              </p>
              <Link to="/admin/statistics" style={styles.cardBtn}>
                View Analytics →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
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
  welcomeBanner: {
    backgroundColor: "#57142B",
    color: "#FFFFFF",
    padding: "30px 32px",
    borderRadius: "12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "28px",
    border: "2px solid #C4A78D",
    boxShadow: "0 4px 18px rgba(57, 31, 37, 0.12)",
    flexWrap: "wrap",
    gap: "16px",
  },
  badge: {
    fontSize: "12px",
    backgroundColor: "#6C574C",
    color: "#DAD0BB",
    padding: "3px 10px",
    borderRadius: "20px",
    fontWeight: "700",
    display: "inline-block",
    marginBottom: "8px",
  },
  title: {
    color: "#FFFFFF",
    fontSize: "26px",
    margin: "0 0 6px 0",
    fontFamily: "'Poppins', sans-serif",
  },
  subtitle: {
    color: "#DAD0BB",
    fontSize: "13px",
    lineHeight: "1.5",
    margin: 0,
  },
  actionBtn: {
    backgroundColor: "#C4A78D",
    color: "#391F25",
    padding: "10px 18px",
    borderRadius: "6px",
    textDecoration: "none",
    fontWeight: "700",
    fontSize: "13px",
    whiteSpace: "nowrap",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
    marginBottom: "32px",
  },
  statCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: "10px",
    padding: "18px",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    boxShadow: "0 2px 10px rgba(57, 31, 37, 0.06)",
    border: "1px solid #DAD0BB",
  },
  statIcon: {
    fontSize: "22px",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #DAD0BB",
  },
  statValue: {
    fontSize: "20px",
    fontWeight: "800",
    color: "#391F25",
    margin: "0 0 2px 0",
    fontFamily: "'Poppins', sans-serif",
  },
  statLabel: {
    fontSize: "12px",
    color: "#6C574C",
    margin: 0,
    fontWeight: "600",
  },
  sectionTitle: {
    color: "#391F25",
    fontSize: "20px",
    marginBottom: "16px",
    fontFamily: "'Poppins', sans-serif",
  },
  actionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "20px",
  },
  actionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 2px 12px rgba(57, 31, 37, 0.06)",
    border: "1px solid #DAD0BB",
    display: "flex",
    flexDirection: "column",
  },
  cardEmoji: {
    fontSize: "28px",
    marginBottom: "10px",
  },
  cardHeading: {
    fontSize: "17px",
    color: "#391F25",
    margin: "0 0 6px 0",
    fontFamily: "'Poppins', sans-serif",
  },
  cardText: {
    fontSize: "13px",
    color: "#6C574C",
    lineHeight: "1.4",
    flex: 1,
    margin: "0 0 16px 0",
  },
  cardBtn: {
    backgroundColor: "#57142B",
    color: "#FFFFFF",
    padding: "9px 14px",
    borderRadius: "6px",
    textDecoration: "none",
    fontWeight: "700",
    fontSize: "12px",
    textAlign: "center",
  },
};

export default AdminDashboard;
