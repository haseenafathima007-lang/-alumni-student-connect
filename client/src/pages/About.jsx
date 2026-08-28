import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

function About() {
  return (
    <div style={{ backgroundColor: "#F7F5F0", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <div style={styles.page}>
        <div style={styles.container}>
          {/* Header Banner */}
          <div style={styles.header}>
            <span style={styles.badge}>🏛️ Institutional Heritage & Vision</span>
            <h1 style={styles.title}>About Alumni Student Connect</h1>
            <p style={styles.subtitle}>
              The official centralized alumni networking and career platform for <strong>Easwari Engineering College, Ramapuram, Chennai</strong>.
            </p>
          </div>

          {/* Pillars */}
          <div style={styles.card}>
            <h2 style={styles.sectionHeading}>Our Institutional Mission</h2>
            <p style={styles.bodyText}>
              Established to nurture lifelong synergy between Easwari Engineering College and its global alumni community, Alumni Student Connect empowers undergraduate and postgraduate students across all disciplines — from Computer Science, AI & Data Science, and IT to Electronics and Mechanical Engineering — to gain direct industry mentorship, placement referrals, and academic insights.
            </p>
          </div>

          {/* Stakeholders Grid */}
          <h2 style={{ ...styles.sectionHeading, margin: "40px 0 20px 0", textAlign: "center" }}>
            Serving Every Stakeholder in the College Ecosystem
          </h2>

          <div style={styles.grid}>
            <div style={styles.roleCard}>
              <div style={styles.avatar}>🎓</div>
              <h3 style={styles.roleTitle}>For Students</h3>
              <p style={styles.roleDesc}>
                Access verified alumni directories, schedule 1-on-1 mock interviews, receive resume reviews, and apply for exclusive alumni-referred jobs and internships.
              </p>
            </div>

            <div style={styles.roleCard}>
              <div style={styles.avatar}>💼</div>
              <h3 style={styles.roleTitle}>For Alumni</h3>
              <p style={styles.roleDesc}>
                Give back to your alma mater, mentor passionate juniors, hire pre-vetted campus talent, and network with fellow alumni across diverse graduating classes.
              </p>
            </div>

            <div style={styles.roleCard}>
              <div style={styles.avatar}>👩‍🏫</div>
              <h3 style={styles.roleTitle}>For Faculty</h3>
              <p style={styles.roleDesc}>
                Invite alumni guest speakers for technical masterclasses, recommend distinguished alumni mentors for high-potential students, and align curriculum with industry demands.
              </p>
            </div>

            <div style={styles.roleCard}>
              <div style={styles.avatar}>🛡️</div>
              <h3 style={styles.roleTitle}>For Administration</h3>
              <p style={styles.roleDesc}>
                Verify alumni credentials, track department placement statistics, ensure verified student records, and organize college-wide alumni homecomings.
              </p>
            </div>
          </div>

          {/* Bottom Action */}
          <div style={styles.actionBox}>
            <h3 style={{ margin: "0 0 10px 0", color: "#391F25", fontSize: "22px", fontFamily: "'Poppins', sans-serif" }}>
              Ready to Connect with Your College Community?
            </h3>
            <p style={{ margin: "0 0 20px 0", color: "#6C574C", fontSize: "14px" }}>
              Create an account with your official college credentials or verified alumni email.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link to="/register" style={styles.primaryBtn}>
                Register Now
              </Link>
              <Link to="/login" style={styles.secondaryBtn}>
                Login to Portal
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

const styles = {
  page: {
    padding: "50px 20px 70px 20px",
    flex: 1,
  },
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
  },
  header: {
    textAlign: "center",
    marginBottom: "40px",
  },
  badge: {
    backgroundColor: "#57142B",
    color: "#FFFFFF",
    padding: "5px 14px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
    display: "inline-block",
    marginBottom: "12px",
  },
  title: {
    color: "#391F25",
    fontSize: "34px",
    margin: "0 0 12px 0",
    fontFamily: "'Poppins', sans-serif",
  },
  subtitle: {
    color: "#6C574C",
    fontSize: "15px",
    maxWidth: "750px",
    margin: "0 auto",
    lineHeight: "1.6",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    padding: "32px",
    boxShadow: "0 4px 16px rgba(57, 31, 37, 0.07)",
    border: "1px solid #DAD0BB",
  },
  sectionHeading: {
    color: "#391F25",
    fontSize: "22px",
    margin: "0 0 14px 0",
    fontFamily: "'Poppins', sans-serif",
  },
  bodyText: {
    color: "#391F25",
    lineHeight: "1.7",
    fontSize: "14px",
    margin: 0,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "20px",
    marginBottom: "45px",
  },
  roleCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    padding: "26px",
    boxShadow: "0 4px 16px rgba(57, 31, 37, 0.07)",
    border: "1px solid #DAD0BB",
    textAlign: "center",
  },
  avatar: {
    fontSize: "30px",
    marginBottom: "12px",
  },
  roleTitle: {
    color: "#391F25",
    fontSize: "17px",
    margin: "0 0 8px 0",
    fontFamily: "'Poppins', sans-serif",
  },
  roleDesc: {
    color: "#6C574C",
    fontSize: "13px",
    lineHeight: "1.5",
    margin: 0,
  },
  actionBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    padding: "36px",
    textAlign: "center",
    boxShadow: "0 4px 16px rgba(57, 31, 37, 0.07)",
    border: "1px solid #DAD0BB",
  },
  primaryBtn: {
    backgroundColor: "#57142B",
    color: "#FFFFFF",
    padding: "12px 26px",
    borderRadius: "6px",
    textDecoration: "none",
    fontWeight: "700",
    fontSize: "14px",
  },
  secondaryBtn: {
    backgroundColor: "#6C574C",
    color: "#FFFFFF",
    padding: "12px 26px",
    borderRadius: "6px",
    textDecoration: "none",
    fontWeight: "700",
    fontSize: "14px",
  },
};

export default About;
