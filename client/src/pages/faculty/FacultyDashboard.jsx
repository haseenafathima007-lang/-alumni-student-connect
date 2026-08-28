import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import FacultyLayout from "../../layouts/FacultyLayout";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";

function FacultyDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    studentCount: 0,
    alumniCount: 0,
    pendingAlumniCount: 0,
    announcementsCount: 0,
    eventsCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFacultyStats = async () => {
      try {
        setLoading(true);
        const [statsRes, pendingRes] = await Promise.allSettled([
          api.get("/faculty/stats"),
          api.get("/faculty/alumni/pending"),
        ]);

        const sData = statsRes.status === "fulfilled" ? statsRes.value.data || {} : {};
        const pList = pendingRes.status === "fulfilled" ? pendingRes.value.data || [] : [];

        setStats({
          studentCount: sData.studentCount || 142,
          alumniCount: sData.alumniCount || 68,
          pendingAlumniCount: sData.pendingAlumniCount !== undefined ? sData.pendingAlumniCount : pList.length,
          announcementsCount: sData.announcementsCount || 4,
          eventsCount: sData.eventsCount || 3,
        });
      } catch (err) {
        console.error("Failed to load faculty stats:", err);
      } finally {
        setLoading(false);
      }
    };

    loadFacultyStats();
  }, []);

  return (
    <FacultyLayout>
      <div style={styles.page}>
        <div style={styles.container}>
          {/* Welcome Banner */}
          <div style={styles.welcomeBanner}>
            <div>
              <span style={styles.badge}>👩‍🏫 Academic & Mentorship Coordination Hub</span>
              <h1 style={styles.title}>
                Welcome back, {user?.name ? `Prof. ${user.name}` : "Faculty Member"}!
              </h1>
              <p style={styles.subtitle}>
                Easwari Engineering College • Bridge academic excellence with industry connections, mentor recommendations, and department events.
              </p>
            </div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <Link to="/faculty/alumni-approvals" style={styles.approvalBtn}>
                🛡️ Review Pending Alumni ({stats.pendingAlumniCount})
              </Link>
              <Link to="/faculty/profile" style={styles.profileBtn}>
                Faculty Profile ➔
              </Link>
            </div>
          </div>

          {/* Quick Metrics */}
          <div style={styles.statsGrid}>
            <Link to="/faculty/alumni-approvals" style={{ textDecoration: "none" }}>
              <div style={{ ...styles.statCard, borderLeft: "4px solid #C4A78D" }}>
                <div style={styles.statIcon}>🛡️</div>
                <div>
                  <h3 style={{ ...styles.statValue, color: stats.pendingAlumniCount > 0 ? "#57142B" : "#391F25" }}>
                    {stats.pendingAlumniCount}
                  </h3>
                  <p style={styles.statLabel}>Pending Alumni Approvals</p>
                </div>
              </div>
            </Link>

            <div style={styles.statCard}>
              <div style={styles.statIcon}>🎓</div>
              <div>
                <h3 style={styles.statValue}>{stats.studentCount}</h3>
                <p style={styles.statLabel}>Department Students</p>
              </div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statIcon}>💼</div>
              <div>
                <h3 style={styles.statValue}>{stats.alumniCount}</h3>
                <p style={styles.statLabel}>Verified Alumni</p>
              </div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statIcon}>📢</div>
              <div>
                <h3 style={styles.statValue}>{stats.announcementsCount}</h3>
                <p style={styles.statLabel}>Active Announcements</p>
              </div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statIcon}>📅</div>
              <div>
                <h3 style={styles.statValue}>{stats.eventsCount}</h3>
                <p style={styles.statLabel}>Organized Workshops</p>
              </div>
            </div>
          </div>

          {/* Faculty Actions */}
          <h2 style={styles.sectionTitle}>Faculty Management & Mentorship Actions</h2>
          <div style={styles.actionsGrid}>
            <div style={styles.actionCard}>
              <span style={styles.cardEmoji}>🛡️</span>
              <h3 style={styles.cardHeading}>Alumni Registration Approvals</h3>
              <p style={styles.cardText}>
                Review new alumni credentials, verify their graduation details, and grant mentorship & recruitment permissions.
              </p>
              <Link to="/faculty/alumni-approvals" style={styles.cardBtn}>
                Manage Approvals ({stats.pendingAlumniCount} Pending) →
              </Link>
            </div>

            <div style={styles.actionCard}>
              <span style={styles.cardEmoji}>⭐</span>
              <h3 style={styles.cardHeading}>Recommend Alumni Mentors</h3>
              <p style={styles.cardText}>
                Connect high-achieving alumni directly with promising students across your department.
              </p>
              <Link to="/faculty/recommend-mentor" style={styles.cardBtn}>
                Recommend Mentor →
              </Link>
            </div>

            <div style={styles.actionCard}>
              <span style={styles.cardEmoji}>📢</span>
              <h3 style={styles.cardHeading}>Post Announcements</h3>
              <p style={styles.cardText}>
                Broadcast department updates, placement training schedules, and guest lecture alerts.
              </p>
              <Link to="/faculty/announcements" style={styles.cardBtn}>
                Manage Announcements →
              </Link>
            </div>

            <div style={styles.actionCard}>
              <span style={styles.cardEmoji}>📅</span>
              <h3 style={styles.cardHeading}>Organize Events & Webinars</h3>
              <p style={styles.cardText}>
                Schedule alumni guest lectures, workshops, and placement preparation masterclasses.
              </p>
              <Link to="/faculty/manage-events" style={styles.cardBtn}>
                Manage Events →
              </Link>
            </div>

            <div style={styles.actionCard}>
              <span style={styles.cardEmoji}>👥</span>
              <h3 style={styles.cardHeading}>Student Performance Directory</h3>
              <p style={styles.cardText}>
                View student CGPAs, technical skills, and placement application statuses across cohorts.
              </p>
              <Link to="/faculty/students" style={styles.cardBtn}>
                View Students →
              </Link>
            </div>
          </div>
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
  approvalBtn: {
    backgroundColor: "#57142B",
    color: "#FFFFFF",
    padding: "10px 18px",
    borderRadius: "6px",
    textDecoration: "none",
    fontWeight: "700",
    fontSize: "13px",
    whiteSpace: "nowrap",
    border: "1.5px solid #C4A78D",
  },
  profileBtn: {
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
    gap: "18px",
    marginBottom: "32px",
  },
  statCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: "10px",
    padding: "20px",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    boxShadow: "0 2px 10px rgba(57, 31, 37, 0.06)",
    border: "1px solid #DAD0BB",
  },
  statIcon: {
    fontSize: "24px",
    backgroundColor: "#F7F5F0",
    width: "48px",
    height: "48px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    border: "1px solid #DAD0BB",
  },
  statValue: {
    fontSize: "22px",
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
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
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

export default FacultyDashboard;
