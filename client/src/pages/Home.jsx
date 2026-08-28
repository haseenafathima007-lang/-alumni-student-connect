import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { useAuth } from "../context/AuthContext";
import THEME from "../constants/theme";

function Home() {
  const { user } = useAuth();

  const getDashboardPath = () => {
    if (!user) return "/register";
    const role = (user.role || "").toLowerCase();
    if (role === "student") return "/student/dashboard";
    if (role === "alumni") return "/alumni/dashboard";
    if (role === "faculty") return "/faculty/dashboard";
    if (role === "admin") return "/admin/dashboard";
    return "/student/dashboard";
  };

  return (
    <div style={{ backgroundColor: "#F7F5F0", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      {/* Hero Section with Official EEC College Branding */}
      <section style={styles.hero}>
        <div style={styles.heroContainer}>
          <div style={styles.heroContent}>
            <div style={styles.logoBadgeContainer}>
              <img
                src="/assets/eec-logo.png"
                alt="Easwari Engineering College"
                style={styles.heroLogoImg}
              />
            </div>

            <span style={styles.heroBadge}>🏛️ Easwari Engineering College (Autonomous) • Chennai</span>

            <h1 style={styles.heroTitle}>
              Alumni Student <span style={{ color: "#C4A78D" }}>Connect</span>
            </h1>

            <p style={styles.heroSubtitle}>
              Connecting Students, Alumni &amp; Faculty for Careers, Mentorship and Opportunities
            </p>

            <div style={styles.heroButtons}>
              {user ? (
                <Link to={getDashboardPath()} style={styles.primaryBtn}>
                  Go to Your Portal Dashboard →
                </Link>
              ) : (
                <>
                  <Link to="/register" style={styles.primaryBtn}>
                    Register Now
                  </Link>
                  <Link to="/login" style={styles.loginHeroBtn}>
                    Portal Login
                  </Link>
                  <Link to="/student/alumni" style={styles.secondaryBtn}>
                    Explore Alumni
                  </Link>
                </>
              )}
            </div>

            <div style={styles.statsRow}>
              <div style={styles.statItem}>
                <strong style={styles.statNum}>10,000+</strong>
                <span style={styles.statLabel}>Graduated Alumni</span>
              </div>
              <div style={styles.statDivider} />
              <div style={styles.statItem}>
                <strong style={styles.statNum}>3,500+</strong>
                <span style={styles.statLabel}>Active Students</span>
              </div>
              <div style={styles.statDivider} />
              <div style={styles.statItem}>
                <strong style={styles.statNum}>250+</strong>
                <span style={styles.statLabel}>Faculty Mentors</span>
              </div>
              <div style={styles.statDivider} />
              <div style={styles.statItem}>
                <strong style={styles.statNum}>100+</strong>
                <span style={styles.statLabel}>Industry Partners</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Structured Portals & Community Sections */}
      <section style={styles.features}>
        <div style={styles.container}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Institutional Platform Pillars</h2>
            <p style={styles.sectionSubtitle}>
              Connecting Students, Alumni &amp; Faculty for Careers, Mentorship and Opportunities across Easwari Engineering College.
            </p>
          </div>

          <div style={styles.featureGrid}>
            {/* 1. Students Pillar */}
            <div style={styles.featureCard}>
              <div style={styles.iconCircle}>🎓</div>
              <h3 style={styles.featureHeading}>Students Portal</h3>
              <p style={styles.featureText}>
                Access verified alumni mentors, apply for jobs &amp; internships with priority referrals, track applications, and receive faculty recommendations.
              </p>
              <Link to={user ? "/student/dashboard" : "/register"} style={styles.featureLink}>
                Student Portal →
              </Link>
            </div>

            {/* 2. Alumni Pillar */}
            <div style={styles.featureCard}>
              <div style={styles.iconCircle}>💼</div>
              <h3 style={styles.featureHeading}>Alumni Network</h3>
              <p style={styles.featureText}>
                Faculty-verified alumni post career openings, review student candidates, offer 1-on-1 mentorship, and give back to their alma mater.
              </p>
              <Link to={user ? "/alumni/dashboard" : "/register"} style={styles.featureLink}>
                Alumni Network →
              </Link>
            </div>

            {/* 3. Faculty Pillar */}
            <div style={styles.featureCard}>
              <div style={styles.iconCircle}>👩‍🏫</div>
              <h3 style={styles.featureHeading}>Faculty Governance</h3>
              <p style={styles.featureText}>
                Faculty approve alumni registrations, recommend mentors for department students, publish campus announcements, and coordinate academic events.
              </p>
              <Link to={user ? "/faculty/dashboard" : "/login"} style={styles.featureLink}>
                Faculty Portal →
              </Link>
            </div>

            {/* 4. Career Opportunities Pillar */}
            <div style={styles.featureCard}>
              <div style={styles.iconCircle}>🚀</div>
              <h3 style={styles.featureHeading}>Career Opportunities</h3>
              <p style={styles.featureText}>
                Discover full-time jobs, summer internships, and direct referral postings in Artificial Intelligence, Software Engineering, Core domains, and Data Science.
              </p>
              <Link to="/jobs" style={styles.featureLink}>
                Browse Opportunities →
              </Link>
            </div>

            {/* 5. Mentorship Pillar */}
            <div style={styles.featureCard}>
              <div style={styles.iconCircle}>🤝</div>
              <h3 style={styles.featureHeading}>1-on-1 Mentorship</h3>
              <p style={styles.featureText}>
                Connect directly with industry leaders for placement interview coaching, technical guidance, resume reviews, and career pathing.
              </p>
              <Link to="/student/find-mentors" style={styles.featureLink}>
                Find a Mentor →
              </Link>
            </div>

            {/* 6. Events Pillar */}
            <div style={styles.featureCard}>
              <div style={styles.iconCircle}>📅</div>
              <h3 style={styles.featureHeading}>Events &amp; Workshops</h3>
              <p style={styles.featureText}>
                Register for masterclasses, alumni guest lectures, tech symposia, department webinars, and campus reunion programs.
              </p>
              <Link to="/events" style={styles.featureLink}>
                View Event Schedule →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section style={styles.cta}>
        <div style={styles.container}>
          <div style={styles.ctaBox}>
            <h2 style={styles.ctaTitle}>Ready to Join the Easwari Alumni Network?</h2>
            <p style={styles.ctaText}>
              Whether you are an ambitious student preparing for placements or an alumnus eager to guide the next generation, get connected today.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "14px", flexWrap: "wrap" }}>
              <Link to="/register" style={styles.ctaBtn}>
                Register Your Account
              </Link>
              <Link to="/login" style={styles.ctaOutlineBtn}>
                Sign In to Portal
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

const styles = {
  hero: {
    backgroundColor: "#57142B",
    color: "#FFFFFF",
    padding: "60px 20px 50px 20px",
    borderBottom: "3px solid #C4A78D",
  },
  heroContainer: {
    maxWidth: "1150px",
    margin: "0 auto",
    textAlign: "center",
  },
  heroContent: {
    maxWidth: "850px",
    margin: "0 auto",
  },
  logoBadgeContainer: {
    backgroundColor: "#FFFFFF",
    padding: "8px 18px",
    borderRadius: "8px",
    display: "inline-block",
    marginBottom: "20px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
  },
  heroLogoImg: {
    height: "52px",
    width: "auto",
    display: "block",
  },
  heroBadge: {
    backgroundColor: "rgba(218, 208, 187, 0.15)",
    color: "#DAD0BB",
    padding: "6px 14px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    display: "block",
    marginBottom: "16px",
    letterSpacing: "0.04em",
  },
  heroTitle: {
    fontSize: "44px",
    fontWeight: "800",
    fontFamily: "'Poppins', sans-serif",
    lineHeight: "1.2",
    margin: "0 0 16px 0",
    color: "#FFFFFF",
  },
  heroSubtitle: {
    fontSize: "16px",
    color: "#DAD0BB",
    lineHeight: "1.6",
    margin: "0 0 30px 0",
  },
  heroButtons: {
    display: "flex",
    gap: "14px",
    justifyContent: "center",
    marginBottom: "40px",
    flexWrap: "wrap",
  },
  primaryBtn: {
    backgroundColor: "#C4A78D",
    color: "#391F25",
    padding: "13px 28px",
    borderRadius: "8px",
    fontWeight: "700",
    textDecoration: "none",
    fontSize: "15px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  },
  loginHeroBtn: {
    backgroundColor: "#57142B",
    color: "#FFFFFF",
    border: "2px solid #C4A78D",
    padding: "11px 26px",
    borderRadius: "8px",
    fontWeight: "700",
    textDecoration: "none",
    fontSize: "15px",
  },
  secondaryBtn: {
    backgroundColor: "transparent",
    color: "#FFFFFF",
    border: "2px solid #DAD0BB",
    padding: "11px 26px",
    borderRadius: "8px",
    fontWeight: "700",
    textDecoration: "none",
    fontSize: "15px",
  },
  statsRow: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "24px",
    borderTop: "1px solid rgba(218, 208, 187, 0.2)",
    paddingTop: "28px",
    flexWrap: "wrap",
  },
  statItem: {
    textAlign: "center",
  },
  statNum: {
    fontSize: "24px",
    display: "block",
    color: "#FFFFFF",
    fontWeight: "800",
    fontFamily: "'Poppins', sans-serif",
  },
  statLabel: {
    fontSize: "12px",
    color: "#DAD0BB",
  },
  statDivider: {
    width: "1px",
    height: "35px",
    backgroundColor: "rgba(218, 208, 187, 0.25)",
  },
  features: {
    padding: "60px 20px",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  sectionHeader: {
    textAlign: "center",
    marginBottom: "45px",
  },
  sectionTitle: {
    fontSize: "30px",
    color: "#391F25",
    margin: "0 0 10px 0",
    fontFamily: "'Poppins', sans-serif",
  },
  sectionSubtitle: {
    fontSize: "15px",
    color: "#6C574C",
    maxWidth: "650px",
    margin: "0 auto",
  },
  featureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "24px",
  },
  featureCard: {
    backgroundColor: "#FFFFFF",
    padding: "28px",
    borderRadius: "12px",
    boxShadow: "0 4px 16px rgba(57, 31, 37, 0.07)",
    border: "1px solid #DAD0BB",
    display: "flex",
    flexDirection: "column",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
  iconCircle: {
    fontSize: "26px",
    backgroundColor: "#F7F5F0",
    border: "1px solid #DAD0BB",
    width: "52px",
    height: "52px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "16px",
  },
  featureHeading: {
    fontSize: "18px",
    color: "#391F25",
    margin: "0 0 8px 0",
    fontFamily: "'Poppins', sans-serif",
  },
  featureText: {
    fontSize: "14px",
    color: "#6C574C",
    lineHeight: "1.5",
    margin: "0 0 16px 0",
    flex: 1,
  },
  featureLink: {
    color: "#57142B",
    fontWeight: "700",
    fontSize: "13px",
    textDecoration: "none",
  },
  cta: {
    padding: "0 20px 60px 20px",
  },
  ctaBox: {
    backgroundColor: "#57142B",
    color: "#FFFFFF",
    borderRadius: "14px",
    padding: "45px 30px",
    textAlign: "center",
    border: "2px solid #C4A78D",
    boxShadow: "0 6px 20px rgba(57, 31, 37, 0.15)",
  },
  ctaTitle: {
    fontSize: "28px",
    color: "#FFFFFF",
    margin: "0 0 10px 0",
    fontFamily: "'Poppins', sans-serif",
  },
  ctaText: {
    fontSize: "15px",
    color: "#DAD0BB",
    maxWidth: "600px",
    margin: "0 auto 24px auto",
  },
  ctaBtn: {
    backgroundColor: "#C4A78D",
    color: "#391F25",
    padding: "12px 26px",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "700",
    fontSize: "14px",
  },
  ctaOutlineBtn: {
    backgroundColor: "transparent",
    color: "#FFFFFF",
    border: "1.5px solid #DAD0BB",
    padding: "11px 24px",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "700",
    fontSize: "14px",
  },
};

export default Home;
