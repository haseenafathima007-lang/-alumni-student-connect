import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "../components/notifications/NotificationBell";

const StudentLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { label: "Dashboard", path: "/student/dashboard", icon: "📊" },
    { label: "Find Alumni", path: "/student/alumni", icon: "🎓" },
    { label: "Find Mentors", path: "/student/find-mentors", icon: "🤝" },
    { label: "Messages", path: "/student/chat", icon: "💬" },
    { label: "Jobs", path: "/jobs", icon: "💼" },
    { label: "Internships", path: "/internships", icon: "🚀" },
    { label: "Events", path: "/events", icon: "📅" },
    { label: "Mentorship", path: "/student/mentorship-requests", icon: "🤝" },
    { label: "My Applications", path: "/student/applications", icon: "📄" },
    { label: "My Profile", path: "/student/profile", icon: "👤" },
    { label: "Settings", path: "/student/settings", icon: "⚙️" },
  ];

  return (
    <div style={styles.wrapper}>
      {/* Top Navbar with EEC Branding */}
      <header style={styles.topbar}>
        <div style={styles.topbarInner}>
          <Link to="/student/dashboard" style={styles.logo}>
            <img
              src="/assets/eec-emblem.png"
              alt="Easwari Engineering College"
              style={styles.logoImg}
            />
            <div style={styles.titleBox}>
              <span style={styles.collegeSub}>EASWARI ENGINEERING COLLEGE</span>
              <span style={styles.portalHead}>
                AlumniConnect <span style={styles.roleTag}>Student Portal</span>
              </span>
            </div>
          </Link>

          <div style={styles.topNavRight}>
            <NotificationBell />
            <span style={styles.userBadge}>
              🎓 {user?.name || "Student"}
            </span>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              Logout
            </button>
          </div>
        </div>

        {/* Navigation Bar */}
        <nav style={styles.navScroll}>
          <div style={styles.navScrollInner}>
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{
                    ...styles.navTab,
                    ...(active ? styles.activeNavTab : {}),
                  }}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </header>

      {/* Main Content Area */}
      <main style={styles.mainContent}>
        {children}
      </main>
    </div>
  );
};

const styles = {
  wrapper: {
    minHeight: "100vh",
    backgroundColor: "#F7F5F0",
    display: "flex",
    flexDirection: "column",
  },
  topbar: {
    backgroundColor: "#57142B",
    color: "#FFFFFF",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    boxShadow: "0 2px 12px rgba(57, 31, 37, 0.2)",
    borderBottom: "2px solid #C4A78D",
  },
  topbarInner: {
    maxWidth: "1250px",
    margin: "0 auto",
    padding: "10px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    textDecoration: "none",
    color: "#FFFFFF",
  },
  logoImg: {
    height: "40px",
    width: "auto",
    backgroundColor: "#FFFFFF",
    padding: "2px",
    borderRadius: "4px",
  },
  titleBox: {
    display: "flex",
    flexDirection: "column",
  },
  collegeSub: {
    fontSize: "10px",
    letterSpacing: "0.08em",
    fontWeight: "700",
    color: "#DAD0BB",
  },
  portalHead: {
    fontSize: "17px",
    fontWeight: "800",
    fontFamily: "'Poppins', sans-serif",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  roleTag: {
    fontSize: "11px",
    backgroundColor: "#6C574C",
    color: "#DAD0BB",
    padding: "2px 7px",
    borderRadius: "4px",
    fontWeight: "600",
  },
  topNavRight: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  userBadge: {
    fontSize: "13px",
    backgroundColor: "#DAD0BB",
    color: "#391F25",
    padding: "6px 12px",
    borderRadius: "20px",
    fontWeight: "700",
  },
  logoutBtn: {
    backgroundColor: "#391F25",
    color: "#DAD0BB",
    border: "1px solid #6C574C",
    padding: "6px 12px",
    borderRadius: "6px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "12px",
    transition: "all 0.2s",
  },
  navScroll: {
    backgroundColor: "#391F25",
    borderTop: "1px solid rgba(218, 208, 187, 0.15)",
    overflowX: "auto",
    whiteSpace: "nowrap",
  },
  navScrollInner: {
    maxWidth: "1250px",
    margin: "0 auto",
    padding: "0 15px",
    display: "flex",
    gap: "4px",
  },
  navTab: {
    padding: "9px 13px",
    color: "#DAD0BB",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: "500",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    borderBottom: "3px solid transparent",
    transition: "all 0.2s",
  },
  activeNavTab: {
    color: "#FFFFFF",
    borderBottom: "3px solid #C4A78D",
    backgroundColor: "rgba(196, 167, 141, 0.12)",
    fontWeight: "700",
  },
  mainContent: {
    flex: 1,
  },
};

export default StudentLayout;
