import React from "react";
import { Link } from "react-router-dom";
import THEME from "../../constants/theme";

function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.grid}>
          {/* Institution Identity */}
          <div style={styles.col}>
            <div style={styles.brandRow}>
              <img
                src="/assets/eec-logo.png"
                alt="Easwari Engineering College"
                style={styles.logoImg}
              />
            </div>
            <p style={styles.institutionText}>
              <strong>EASWARI ENGINEERING COLLEGE</strong><br />
              An Autonomous Institution | Affiliated to Anna University<br />
              Bharathi Salai, Ramapuram, Chennai – 600089, Tamil Nadu, India.
            </p>
            <p style={styles.brandTagline}>
              Alumni Student Connect bridges graduates, students, faculty, and industry partners for lifelong learning, mentorship, and career growth.
            </p>
          </div>

          {/* Quick Links */}
          <div style={styles.col}>
            <h4 style={styles.sectionTitle}>Portals & Directories</h4>
            <div style={styles.linkList}>
              <Link to="/" style={styles.link}>Portal Home</Link>
              <Link to="/about" style={styles.link}>About Alumni Network</Link>
              <Link to="/student/alumni" style={styles.link}>Alumni Directory</Link>
              <Link to="/student/find-mentors" style={styles.link}>Find a Mentor</Link>
              <Link to="/events" style={styles.link}>Campus Events & Masterclasses</Link>
            </div>
          </div>

          {/* Career Center */}
          <div style={styles.col}>
            <h4 style={styles.sectionTitle}>Career & Internships</h4>
            <div style={styles.linkList}>
              <Link to="/jobs" style={styles.link}>Alumni Job Postings</Link>
              <Link to="/internships" style={styles.link}>Student Internships</Link>
              <Link to="/login" style={styles.link}>Member Login</Link>
              <Link to="/register" style={styles.link}>Register New Account</Link>
            </div>
          </div>

          {/* Contact */}
          <div style={styles.col}>
            <h4 style={styles.sectionTitle}>Alumni Relations Office</h4>
            <p style={styles.contactItem}>📍 Alumni & Career Development Cell</p>
            <p style={styles.contactItem}>📧 alumni@eec.srmrmp.edu.in</p>
            <p style={styles.contactItem}>📞 +91 44 2249 1130 / 2249 0853</p>
            <p style={styles.contactItem}>🌐 eec.srmrmp.edu.in</p>
          </div>
        </div>

        <div style={styles.bottomBar}>
          <p style={{ margin: 0 }}>
            © {new Date().getFullYear()} Easwari Engineering College — Alumni Student Connect. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    backgroundColor: "#391F25",
    color: "#FFFFFF",
    paddingTop: "45px",
    paddingBottom: "25px",
    borderTop: "3px solid #57142B",
  },
  container: {
    maxWidth: "1250px",
    margin: "0 auto",
    padding: "0 20px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "30px",
    marginBottom: "35px",
  },
  col: {
    display: "flex",
    flexDirection: "column",
  },
  brandRow: {
    backgroundColor: "#FFFFFF",
    padding: "6px 10px",
    borderRadius: "6px",
    display: "inline-block",
    marginBottom: "14px",
    width: "fit-content",
  },
  logoImg: {
    height: "44px",
    width: "auto",
    display: "block",
  },
  institutionText: {
    fontSize: "12px",
    color: "#DAD0BB",
    lineHeight: "1.5",
    margin: "0 0 10px 0",
  },
  brandTagline: {
    color: "#C4A78D",
    fontSize: "13px",
    lineHeight: "1.5",
    margin: 0,
  },
  sectionTitle: {
    color: "#C4A78D",
    fontSize: "15px",
    fontFamily: "'Poppins', sans-serif",
    fontWeight: "700",
    margin: "0 0 14px 0",
    letterSpacing: "0.02em",
  },
  linkList: {
    display: "flex",
    flexDirection: "column",
    gap: "9px",
  },
  link: {
    color: "#DAD0BB",
    fontSize: "13px",
    textDecoration: "none",
    transition: "color 0.2s ease",
  },
  contactItem: {
    color: "#DAD0BB",
    fontSize: "13px",
    lineHeight: "1.5",
    margin: "0 0 8px 0",
  },
  bottomBar: {
    borderTop: "1px solid rgba(218, 208, 187, 0.2)",
    paddingTop: "20px",
    textAlign: "center",
    color: "#DAD0BB",
    fontSize: "12px",
  },
};

export default Footer;
