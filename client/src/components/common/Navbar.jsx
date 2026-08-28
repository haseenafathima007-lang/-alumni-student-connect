import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import THEME from "../../constants/theme";

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getDashboardPath = () => {
    if (!user) return "/";
    if (user.role === "Student") return "/student/dashboard";
    if (user.role === "Alumni") return "/alumni/dashboard";
    if (user.role === "Faculty") return "/faculty/dashboard";
    if (user.role === "Admin") return "/admin/dashboard";
    return "/";
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        {/* Brand with Official EEC Logo / Emblem */}
        <Link to="/" style={styles.brand}>
          <img
            src="/assets/eec-emblem.png"
            alt="Easwari Engineering College"
            style={styles.logoImg}
          />
          <div style={styles.brandTextContainer}>
            <span style={styles.collegeName}>EASWARI ENGINEERING COLLEGE</span>
            <span style={styles.portalTitle}>
              Alumni<span style={{ color: THEME.accent }}>Connect</span>
            </span>
          </div>
        </Link>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={styles.mobileToggle}
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>

        {/* Nav Links */}
        <div
          style={{
            ...styles.navLinks,
            ...(mobileMenuOpen ? styles.navLinksMobile : {}),
          }}
        >
          <Link to="/" style={styles.link} onClick={() => setMobileMenuOpen(false)}>
            Home
          </Link>
          <Link to="/about" style={styles.link} onClick={() => setMobileMenuOpen(false)}>
            About
          </Link>
          <Link to="/student/alumni" style={styles.link} onClick={() => setMobileMenuOpen(false)}>
            Alumni Directory
          </Link>
          <Link to="/jobs" style={styles.link} onClick={() => setMobileMenuOpen(false)}>
            Jobs
          </Link>
          <Link to="/internships" style={styles.link} onClick={() => setMobileMenuOpen(false)}>
            Internships
          </Link>
          <Link to="/events" style={styles.link} onClick={() => setMobileMenuOpen(false)}>
            Events
          </Link>

          {isAuthenticated ? (
            <div style={styles.authGroup}>
              <Link
                to={getDashboardPath()}
                style={styles.userBadge}
                onClick={() => setMobileMenuOpen(false)}
              >
                🎓 {user?.name || "Dashboard"} ({user?.role})
              </Link>
              <button onClick={handleLogout} style={styles.logoutBtn}>
                Logout
              </button>
            </div>
          ) : (
            <div style={styles.authGroup}>
              <Link
                to="/login"
                style={styles.loginBtn}
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                style={styles.registerBtn}
                onClick={() => setMobileMenuOpen(false)}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    backgroundColor: "#57142B",
    color: "#FFFFFF",
    boxShadow: "0 2px 14px rgba(57, 31, 37, 0.2)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    borderBottom: "2px solid #C4A78D",
  },
  container: {
    maxWidth: "1250px",
    margin: "0 auto",
    padding: "10px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    textDecoration: "none",
    color: "#FFFFFF",
  },
  logoImg: {
    height: "46px",
    width: "auto",
    objectFit: "contain",
    borderRadius: "4px",
    backgroundColor: "#FFFFFF",
    padding: "2px",
  },
  brandTextContainer: {
    display: "flex",
    flexDirection: "column",
  },
  collegeName: {
    fontSize: "11px",
    letterSpacing: "0.08em",
    fontWeight: "700",
    color: "#DAD0BB",
  },
  portalTitle: {
    fontSize: "18px",
    fontWeight: "800",
    color: "#FFFFFF",
    fontFamily: "'Poppins', sans-serif",
  },
  mobileToggle: {
    display: "none",
    backgroundColor: "transparent",
    border: "none",
    color: "#FFFFFF",
    fontSize: "24px",
    cursor: "pointer",
    "@media (max-width: 900px)": {
      display: "block",
    },
  },
  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  navLinksMobile: {},
  link: {
    color: "#DAD0BB",
    fontSize: "14px",
    fontWeight: "500",
    textDecoration: "none",
    transition: "color 0.2s ease",
  },
  authGroup: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginLeft: "10px",
  },
  userBadge: {
    backgroundColor: "#DAD0BB",
    color: "#391F25",
    padding: "6px 14px",
    borderRadius: "20px",
    fontWeight: "700",
    fontSize: "13px",
    textDecoration: "none",
  },
  logoutBtn: {
    backgroundColor: "#6C574C",
    color: "#FFFFFF",
    border: "none",
    padding: "7px 14px",
    borderRadius: "6px",
    fontWeight: "600",
    fontSize: "13px",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  loginBtn: {
    color: "#FFFFFF",
    border: "1.5px solid #C4A78D",
    padding: "6px 14px",
    borderRadius: "6px",
    fontWeight: "600",
    fontSize: "13px",
    textDecoration: "none",
  },
  registerBtn: {
    backgroundColor: "#C4A78D",
    color: "#391F25",
    padding: "7px 16px",
    borderRadius: "6px",
    fontWeight: "700",
    fontSize: "13px",
    textDecoration: "none",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
  },
};

export default Navbar;
