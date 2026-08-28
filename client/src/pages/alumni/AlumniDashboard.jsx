import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AlumniLayout from "../../layouts/AlumniLayout";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";

function AlumniDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    activeMentorships: 0,
    jobsPosted: 0,
    internshipsPosted: 0,
    totalApplicants: 0,
  });
  const [loading, setLoading] = useState(true);

  const isApproved =
    user?.verificationStatus === "approved" ||
    (user?.isVerified && user?.verificationStatus !== "rejected");
  const isPending =
    user?.verificationStatus === "pending" ||
    (!user?.isVerified && user?.verificationStatus !== "rejected");
  const isRejected = user?.verificationStatus === "rejected";

  useEffect(() => {
    const loadAlumniStats = async () => {
      try {
        setLoading(true);
        if (isApproved) {
          const [mentorshipRes, jobsRes, internshipsRes, applicantsRes] = await Promise.allSettled([
            api.get("/mentorship/my-mentees"),
            api.get("/jobs/my-jobs"),
            api.get("/internships/my-internships"),
            api.get("/applications/alumni-applicants"),
          ]);

          const mentees = mentorshipRes.status === "fulfilled" ? mentorshipRes.value.data || [] : [];
          const jobs = jobsRes.status === "fulfilled" ? jobsRes.value.data || [] : [];
          const internships = internshipsRes.status === "fulfilled" ? internshipsRes.value.data || [] : [];
          const applicants = applicantsRes.status === "fulfilled" ? applicantsRes.value.data || [] : [];

          setStats({
            activeMentorships: mentees.length,
            jobsPosted: jobs.length,
            internshipsPosted: internships.length,
            totalApplicants: applicants.length,
          });
        }
      } catch (err) {
        console.error("Failed to load alumni stats:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAlumniStats();
  }, [isApproved]);

  return (
    <AlumniLayout>
      <div style={styles.page}>
        <div style={styles.container}>
          {/* Verification Warning Banners for Pending / Rejected */}
          {isPending && (
            <div style={styles.pendingVerificationBanner}>
              <div style={styles.bannerIcon}>⏳</div>
              <div style={{ flex: 1 }}>
                <span style={styles.pendingBadge}>Pending Approval</span>
                <h3 style={styles.bannerHeading}>
                  Your alumni account is pending faculty approval.
                </h3>
                <p style={styles.bannerDesc}>
                  You can explore the network and complete your profile. Once your department faculty coordinator approves your graduation credentials, you will gain full access to mentor students, receive mentorship session requests, and post jobs and internships.
                </p>
              </div>
              <Link to="/alumni/profile" style={styles.bannerBtn}>
                Complete Profile →
              </Link>
            </div>
          )}

          {isRejected && (
            <div style={styles.rejectedVerificationBanner}>
              <div style={styles.bannerIcon}>⚠️</div>
              <div style={{ flex: 1 }}>
                <span style={styles.rejectedBadge}>Verification Rejected</span>
                <h3 style={styles.bannerHeading}>
                  Your alumni account was not approved.
                </h3>
                <p style={styles.bannerDesc}>
                  {user?.rejectionReason
                    ? `Reason: ${user.rejectionReason}. Please contact the college administration for further assistance.`
                    : "Please reach out to the college administration or department faculty coordinator for further information."}
                </p>
              </div>
            </div>
          )}

          {/* Main Welcome Banner */}
          <div style={styles.welcomeBanner}>
            <div>
              <span style={styles.badge}>
                {isApproved
                  ? "💼 Your alumni account has been verified."
                  : "💼 Easwari Alumni Network"}
              </span>
              <h1 style={styles.title}>
                Welcome back, {user?.name || "Distinguished Alumni"}!
              </h1>
              <p style={styles.subtitle}>
                Easwari Engineering College • Empower the next generation of engineers with mentorship, job referrals, and career sessions.
              </p>
            </div>
            <Link to="/alumni/profile" style={styles.profileBtn}>
              Edit Alumni Profile ➔
            </Link>
          </div>

          {/* Quick Metrics */}
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>🤝</div>
              <div>
                <h3 style={styles.statValue}>{stats.activeMentorships}</h3>
                <p style={styles.statLabel}>Active Student Mentees</p>
              </div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statIcon}>💼</div>
              <div>
                <h3 style={styles.statValue}>{stats.jobsPosted}</h3>
                <p style={styles.statLabel}>Jobs Posted</p>
              </div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statIcon}>🚀</div>
              <div>
                <h3 style={styles.statValue}>{stats.internshipsPosted}</h3>
                <p style={styles.statLabel}>Internships Posted</p>
              </div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statIcon}>📄</div>
              <div>
                <h3 style={styles.statValue}>{stats.totalApplicants}</h3>
                <p style={styles.statLabel}>Total Student Applicants</p>
              </div>
            </div>
          </div>

          {/* Actions Grid */}
          <h2 style={styles.sectionTitle}>Alumni Mentorship & Recruitment Actions</h2>
          <div style={styles.actionsGrid}>
            {/* Post Job */}
            <div style={{ ...styles.actionCard, ...(isApproved ? {} : styles.disabledActionCard) }}>
              <span style={styles.cardEmoji}>➕</span>
              <h3 style={styles.cardHeading}>Post a Job Opening</h3>
              <p style={styles.cardText}>
                Share full-time openings from your employer directly with qualified Easwari graduates and final-year students.
              </p>
              {isApproved ? (
                <Link to="/alumni/post-job" style={styles.cardBtn}>
                  Post Job Opening →
                </Link>
              ) : (
                <span style={styles.lockedBtn}>🔒 Requires Faculty Approval</span>
              )}
            </div>

            {/* Post Internship */}
            <div style={{ ...styles.actionCard, ...(isApproved ? {} : styles.disabledActionCard) }}>
              <span style={styles.cardEmoji}>🚀</span>
              <h3 style={styles.cardHeading}>Post an Internship</h3>
              <p style={styles.cardText}>
                Offer summer, winter, or semester internships to recruit high-potential students across departments.
              </p>
              {isApproved ? (
                <Link to="/alumni/post-internship" style={styles.cardBtn}>
                  Post Internship →
                </Link>
              ) : (
                <span style={styles.lockedBtn}>🔒 Requires Faculty Approval</span>
              )}
            </div>

            {/* Mentorship Requests */}
            <div style={{ ...styles.actionCard, ...(isApproved ? {} : styles.disabledActionCard) }}>
              <span style={styles.cardEmoji}>🤝</span>
              <h3 style={styles.cardHeading}>Mentorship Requests</h3>
              <p style={styles.cardText}>
                Review 1-on-1 student session requests, accept mentorship appointments, and share Google Meet links.
              </p>
              {isApproved ? (
                <Link to="/alumni/mentorship-requests" style={styles.cardBtn}>
                  View Requests →
                </Link>
              ) : (
                <span style={styles.lockedBtn}>🔒 Requires Faculty Approval</span>
              )}
            </div>

            {/* Review Applicants */}
            <div style={{ ...styles.actionCard, ...(isApproved ? {} : styles.disabledActionCard) }}>
              <span style={styles.cardEmoji}>📄</span>
              <h3 style={styles.cardHeading}>Review Applicants</h3>
              <p style={styles.cardText}>
                Screen resumes, shortlist promising candidates, and update application statuses in real time.
              </p>
              {isApproved ? (
                <Link to="/alumni/applicants" style={styles.cardBtn}>
                  Manage Applicants →
                </Link>
              ) : (
                <span style={styles.lockedBtn}>🔒 Requires Faculty Approval</span>
              )}
            </div>

            {/* Direct Messages */}
            <div style={styles.actionCard}>
              <span style={styles.cardEmoji}>💬</span>
              <h3 style={styles.cardHeading}>Direct Messages</h3>
              <p style={styles.cardText}>
                Chat directly with student mentees, faculty coordinators, and fellow Easwari alumni.
              </p>
              <Link to="/alumni/chat" style={styles.cardBtn}>
                Open Messaging →
              </Link>
            </div>

            {/* Profile */}
            <div style={styles.actionCard}>
              <span style={styles.cardEmoji}>👤</span>
              <h3 style={styles.cardHeading}>Alumni Mentorship Profile</h3>
              <p style={styles.cardText}>
                Update your current company, job role, mentoring topics, and department details.
              </p>
              <Link to="/alumni/profile" style={styles.cardBtn}>
                Update Profile →
              </Link>
            </div>
          </div>
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
    maxWidth: "1200px",
    margin: "0 auto",
  },
  pendingVerificationBanner: {
    backgroundColor: "#FFF8E1",
    border: "1.5px solid #FFE082",
    borderRadius: "12px",
    padding: "20px 24px",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "24px",
    boxShadow: "0 2px 10px rgba(255, 179, 0, 0.12)",
    flexWrap: "wrap",
  },
  rejectedVerificationBanner: {
    backgroundColor: "#FFEBEE",
    border: "1.5px solid #FFCDD2",
    borderRadius: "12px",
    padding: "20px 24px",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "24px",
    boxShadow: "0 2px 10px rgba(198, 40, 40, 0.12)",
    flexWrap: "wrap",
  },
  bannerIcon: {
    fontSize: "32px",
    flexShrink: 0,
  },
  pendingBadge: {
    backgroundColor: "#FFA000",
    color: "#FFFFFF",
    fontSize: "11px",
    fontWeight: "700",
    padding: "2px 8px",
    borderRadius: "10px",
    display: "inline-block",
    marginBottom: "4px",
  },
  rejectedBadge: {
    backgroundColor: "#C62828",
    color: "#FFFFFF",
    fontSize: "11px",
    fontWeight: "700",
    padding: "2px 8px",
    borderRadius: "10px",
    display: "inline-block",
    marginBottom: "4px",
  },
  bannerHeading: {
    margin: "2px 0 4px 0",
    fontSize: "16px",
    color: "#391F25",
    fontWeight: "700",
  },
  bannerDesc: {
    margin: 0,
    fontSize: "13px",
    color: "#6C574C",
    lineHeight: "1.4",
  },
  bannerBtn: {
    backgroundColor: "#57142B",
    color: "#FFFFFF",
    padding: "9px 16px",
    borderRadius: "6px",
    textDecoration: "none",
    fontWeight: "700",
    fontSize: "13px",
    whiteSpace: "nowrap",
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
  disabledActionCard: {
    backgroundColor: "#FAF8F5",
    opacity: 0.9,
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
  lockedBtn: {
    backgroundColor: "#DAD0BB",
    color: "#6C574C",
    padding: "9px 14px",
    borderRadius: "6px",
    fontWeight: "600",
    fontSize: "12px",
    textAlign: "center",
    cursor: "not-allowed",
  },
};

export default AlumniDashboard;
