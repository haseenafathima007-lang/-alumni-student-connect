import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import StudentLayout from "../../layouts/StudentLayout";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";

function StudentDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    mentorshipCount: 0,
    applicationCount: 0,
    eventCount: 0,
    alumniCount: 0,
  });
  const [recommendedMentors, setRecommendedMentors] = useState([]);
  const [latestJobs, setLatestJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [mentorshipRes, appsRes, eventsRes, alumniRes, jobsRes] = await Promise.allSettled([
          api.get("/mentorship/my-requests"),
          api.get("/applications/my"),
          api.get("/events"),
          api.get("/alumni?mentoring=true"),
          api.get("/jobs"),
        ]);

        const mentorships = mentorshipRes.status === "fulfilled" ? mentorshipRes.value.data || [] : [];
        const apps = appsRes.status === "fulfilled" ? appsRes.value.data || [] : [];
        const events = eventsRes.status === "fulfilled" ? eventsRes.value.data || [] : [];
        const alumni = alumniRes.status === "fulfilled" ? alumniRes.value.data || [] : [];
        const jobs = jobsRes.status === "fulfilled" ? jobsRes.value.data || [] : [];

        setStats({
          mentorshipCount: mentorships.length,
          applicationCount: apps.length,
          eventCount: events.length,
          alumniCount: alumni.length,
        });

        setRecommendedMentors(alumni.slice(0, 3));
        setLatestJobs(jobs.slice(0, 3));
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  return (
    <StudentLayout>
      <div style={styles.page}>
        <div style={styles.container}>
          {/* Welcome Banner */}
          <div style={styles.welcomeBanner}>
            <div style={styles.welcomeText}>
              <span style={styles.welcomeTag}>🎓 Student Academic & Career Hub</span>
              <h1 style={styles.welcomeTitle}>
                Welcome back, {user?.name || "Student"}!
              </h1>
              <p style={styles.welcomeSubtitle}>
                Easwari Engineering College • Connect with graduates, explore placement referrals, and accelerate your career.
              </p>
            </div>
            <Link to="/student/profile" style={styles.profileBtn}>
              View / Edit Profile ➔
            </Link>
          </div>

          {/* Quick Metrics */}
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>🤝</div>
              <div>
                <span style={styles.statNum}>{stats.mentorshipCount}</span>
                <span style={styles.statLabel}>Mentorship Requests</span>
              </div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statIcon}>📄</div>
              <div>
                <span style={styles.statNum}>{stats.applicationCount}</span>
                <span style={styles.statLabel}>Active Applications</span>
              </div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statIcon}>📅</div>
              <div>
                <span style={styles.statNum}>{stats.eventCount}</span>
                <span style={styles.statLabel}>Campus Events</span>
              </div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statIcon}>💼</div>
              <div>
                <span style={styles.statNum}>{stats.alumniCount}</span>
                <span style={styles.statLabel}>Verified Alumni Mentors</span>
              </div>
            </div>
          </div>

          {/* Recommended Mentors & Latest Opportunities */}
          <div style={styles.twoColGrid}>
            {/* Recommended Mentors */}
            <div style={styles.sectionCard}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>⭐ Recommended Mentors</h3>
                <Link to="/student/find-mentors" style={styles.viewAllLink}>
                  View All Mentors →
                </Link>
              </div>

              {recommendedMentors.length === 0 ? (
                <p style={styles.emptyText}>Loading mentor recommendations...</p>
              ) : (
                <div style={styles.mentorList}>
                  {recommendedMentors.map((m) => {
                    const p = m.profile || {};
                    return (
                      <div key={m._id} style={styles.mentorItem}>
                        <div style={styles.avatar}>
                          {m.name ? m.name.charAt(0).toUpperCase() : "M"}
                        </div>
                        <div style={{ flex: 1 }}>
                          <h4 style={styles.mentorName}>{m.name}</h4>
                          <p style={styles.mentorRole}>
                            {p.jobTitle || "Software Engineer"} @ {p.company || "Leading Tech"}
                          </p>
                          <span style={styles.deptTag}>
                            {p.department || "AI & Data Science"} • Batch {p.graduationYear || "2022"}
                          </span>
                        </div>
                        <Link
                          to={`/student/chat?user=${m.userId || m._id}`}
                          style={styles.chatActionBtn}
                        >
                          💬 Message
                        </Link>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Latest Jobs */}
            <div style={styles.sectionCard}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>💼 Latest Opportunities</h3>
                <Link to="/jobs" style={styles.viewAllLink}>
                  Browse All Jobs →
                </Link>
              </div>

              {latestJobs.length === 0 ? (
                <p style={styles.emptyText}>No active job listings right now.</p>
              ) : (
                <div style={styles.jobList}>
                  {latestJobs.map((j) => (
                    <div key={j._id} style={styles.jobItem}>
                      <div style={{ flex: 1 }}>
                        <h4 style={styles.jobTitle}>{j.title}</h4>
                        <p style={styles.jobCompany}>🏢 {j.company} • 📍 {j.location || "On-Campus"}</p>
                        <span style={styles.jobSalary}>
                          💰 {j.salary || "Competitive Compensation"}
                        </span>
                      </div>
                      <Link to="/jobs" style={styles.applyActionBtn}>
                        Apply Now
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Feature Shortcuts Grid */}
          <h2 style={styles.shortcutsHeading}>Quick Access Directory</h2>
          <div style={styles.featureGrid}>
            <FeatureLinkCard
              icon="🎓"
              title="Find Alumni"
              desc="Search verified graduates from your department, batch, and target company."
              link="/student/alumni"
              btnText="Explore Directory"
            />
            <FeatureLinkCard
              icon="🤝"
              title="Find Mentors"
              desc="Discover mentors weighted by skills, topics, and placement guidance."
              link="/student/find-mentors"
              btnText="Find a Mentor"
            />
            <FeatureLinkCard
              icon="💬"
              title="Direct Messages"
              desc="Real-time chat with alumni mentors and career advisors."
              link="/student/chat"
              btnText="Open Chat"
            />
            <FeatureLinkCard
              icon="📄"
              title="Applications"
              desc="Track job & internship application statuses (Applied, Shortlisted, Selected)."
              link="/student/applications"
              btnText="View Tracker"
            />
            <FeatureLinkCard
              icon="🚀"
              title="Internships"
              desc="Apply for seasonal internships directly posted by alumni employers."
              link="/internships"
              btnText="View Internships"
            />
            <FeatureLinkCard
              icon="📅"
              title="Events"
              desc="Register for campus masterclasses, tech webinars, and placement workshops."
              link="/events"
              btnText="View Schedule"
            />
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}

function FeatureLinkCard({ icon, title, desc, link, btnText }) {
  return (
    <div style={styles.shortcutCard}>
      <div style={styles.shortcutIcon}>{icon}</div>
      <h3 style={styles.shortcutTitle}>{title}</h3>
      <p style={styles.shortcutDesc}>{desc}</p>
      <Link to={link} style={styles.shortcutBtn}>
        {btnText} →
      </Link>
    </div>
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
  welcomeText: {
    maxWidth: "750px",
  },
  welcomeTag: {
    fontSize: "12px",
    backgroundColor: "#6C574C",
    color: "#DAD0BB",
    padding: "3px 10px",
    borderRadius: "20px",
    fontWeight: "700",
    display: "inline-block",
    marginBottom: "8px",
  },
  welcomeTitle: {
    color: "#FFFFFF",
    fontSize: "26px",
    margin: "0 0 6px 0",
    fontFamily: "'Poppins', sans-serif",
  },
  welcomeSubtitle: {
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
    fontWeight: "700",
    textDecoration: "none",
    fontSize: "13px",
    whiteSpace: "nowrap",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px",
    marginBottom: "30px",
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
    fontSize: "26px",
    backgroundColor: "#F7F5F0",
    width: "50px",
    height: "50px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    border: "1px solid #DAD0BB",
  },
  statNum: {
    fontSize: "22px",
    fontWeight: "800",
    color: "#391F25",
    display: "block",
    fontFamily: "'Poppins', sans-serif",
  },
  statLabel: {
    fontSize: "12px",
    color: "#6C574C",
  },
  twoColGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
    gap: "24px",
    marginBottom: "36px",
  },
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 2px 12px rgba(57, 31, 37, 0.06)",
    border: "1px solid #DAD0BB",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "18px",
    borderBottom: "1px solid #F7F5F0",
    paddingBottom: "10px",
  },
  cardTitle: {
    margin: 0,
    color: "#391F25",
    fontSize: "17px",
    fontFamily: "'Poppins', sans-serif",
  },
  viewAllLink: {
    color: "#57142B",
    fontSize: "12px",
    fontWeight: "700",
    textDecoration: "none",
  },
  emptyText: {
    color: "#6C574C",
    fontSize: "13px",
    textAlign: "center",
    padding: "20px",
    margin: 0,
  },
  mentorList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  mentorItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px",
    borderRadius: "8px",
    backgroundColor: "#F7F5F0",
    border: "1px solid #DAD0BB",
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#57142B",
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "16px",
    flexShrink: 0,
  },
  mentorName: {
    margin: 0,
    fontSize: "14px",
    color: "#391F25",
  },
  mentorRole: {
    margin: "2px 0",
    fontSize: "12px",
    color: "#6C574C",
  },
  deptTag: {
    fontSize: "11px",
    color: "#887B75",
  },
  chatActionBtn: {
    backgroundColor: "#57142B",
    color: "#FFFFFF",
    padding: "6px 12px",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: "700",
    textDecoration: "none",
    whiteSpace: "nowrap",
  },
  jobList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  jobItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px",
    borderRadius: "8px",
    backgroundColor: "#F7F5F0",
    border: "1px solid #DAD0BB",
    gap: "10px",
  },
  jobTitle: {
    margin: "0 0 2px 0",
    fontSize: "14px",
    color: "#391F25",
  },
  jobCompany: {
    margin: "0 0 4px 0",
    fontSize: "12px",
    color: "#6C574C",
  },
  jobSalary: {
    fontSize: "11px",
    fontWeight: "700",
    color: "#57142B",
  },
  applyActionBtn: {
    backgroundColor: "#6C574C",
    color: "#FFFFFF",
    padding: "6px 14px",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: "700",
    textDecoration: "none",
    whiteSpace: "nowrap",
  },
  shortcutsHeading: {
    fontSize: "20px",
    color: "#391F25",
    margin: "0 0 16px 0",
    fontFamily: "'Poppins', sans-serif",
  },
  featureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "18px",
  },
  shortcutCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: "10px",
    padding: "22px",
    border: "1px solid #DAD0BB",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 2px 10px rgba(57, 31, 37, 0.05)",
  },
  shortcutIcon: {
    fontSize: "24px",
    marginBottom: "10px",
  },
  shortcutTitle: {
    margin: "0 0 6px 0",
    fontSize: "16px",
    color: "#391F25",
    fontFamily: "'Poppins', sans-serif",
  },
  shortcutDesc: {
    margin: "0 0 14px 0",
    fontSize: "12px",
    color: "#6C574C",
    lineHeight: "1.4",
    flex: 1,
  },
  shortcutBtn: {
    color: "#57142B",
    fontWeight: "700",
    fontSize: "13px",
    textDecoration: "none",
  },
};

export default StudentDashboard;
