import React from "react";
import { Link } from "react-router-dom";
import { useNotifications } from "../context/NotificationContext";
import { useAuth } from "../context/AuthContext";
import StudentLayout from "../layouts/StudentLayout";
import AlumniLayout from "../layouts/AlumniLayout";
import FacultyLayout from "../layouts/FacultyLayout";
import AdminLayout from "../layouts/AdminLayout";
import MainLayout from "../layouts/MainLayout";

function Notifications() {
  const { notifications, loading, markAsRead, markAllAsRead } = useNotifications();
  const { user } = useAuth();

  const getLayout = (children) => {
    if (!user) return <MainLayout>{children}</MainLayout>;
    if (user.role === "Student") return <StudentLayout>{children}</StudentLayout>;
    if (user.role === "Alumni") return <AlumniLayout>{children}</AlumniLayout>;
    if (user.role === "Faculty") return <FacultyLayout>{children}</FacultyLayout>;
    if (user.role === "Admin") return <AdminLayout>{children}</AdminLayout>;
    return <MainLayout>{children}</MainLayout>;
  };

  const getIcon = (type) => {
    switch (type) {
      case "mentorship":
        return "🤝";
      case "job":
        return "💼";
      case "internship":
        return "🚀";
      case "event":
        return "📅";
      case "chat":
        return "💬";
      case "announcement":
        return "📢";
      default:
        return "🔔";
    }
  };

  return getLayout(
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>🔔 Activity & Notification Center</h1>
            <p style={styles.subtitle}>
              Real-time alerts for mentorship requests, applications, events, broadcasts, and messages.
            </p>
          </div>
          {notifications.some((n) => !n.isRead) && (
            <button onClick={markAllAsRead} style={styles.markAllBtn}>
              ✓ Mark All as Read
            </button>
          )}
        </div>

        {loading ? (
          <div style={styles.loadingBox}>
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div style={styles.emptyBox}>
            <span style={{ fontSize: "40px" }}>📭</span>
            <h3 style={{ color: "#391F25", marginTop: "12px", fontFamily: "'Poppins', sans-serif" }}>No Notifications Yet</h3>
            <p style={{ color: "#6C574C", margin: 0 }}>
              You will receive real-time alerts when you receive mentorship responses, placement application updates, or new direct messages.
            </p>
          </div>
        ) : (
          <div style={styles.list}>
            {notifications.map((notif) => (
              <div
                key={notif._id}
                style={{
                  ...styles.card,
                  borderLeft: notif.isRead ? "4px solid #DAD0BB" : "4px solid #57142B",
                  backgroundColor: notif.isRead ? "#FFFFFF" : "#F7F5F0",
                }}
              >
                <div style={styles.iconBox}>{getIcon(notif.type)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "6px" }}>
                    <h3 style={styles.notifTitle}>{notif.title}</h3>
                    <span style={styles.timeTag}>
                      {notif.createdAt ? new Date(notif.createdAt).toLocaleString() : "Recently"}
                    </span>
                  </div>
                  <p style={styles.notifMessage}>{notif.message}</p>
                  <div style={styles.actionRow}>
                    {notif.link && (
                      <Link to={notif.link} style={styles.linkBtn}>
                        Open Related Page →
                      </Link>
                    )}
                    {!notif.isRead && (
                      <button
                        onClick={() => markAsRead(notif._id)}
                        style={styles.readBtn}
                      >
                        Mark Read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: "30px 20px 60px 20px",
  },
  container: {
    maxWidth: "950px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    flexWrap: "wrap",
    gap: "12px",
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
  markAllBtn: {
    backgroundColor: "#57142B",
    color: "#FFFFFF",
    border: "none",
    padding: "9px 16px",
    borderRadius: "6px",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "12px",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  card: {
    borderRadius: "10px",
    padding: "18px 22px",
    display: "flex",
    gap: "16px",
    boxShadow: "0 2px 10px rgba(57, 31, 37, 0.06)",
    border: "1px solid #DAD0BB",
  },
  iconBox: {
    fontSize: "26px",
    paddingTop: "2px",
  },
  notifTitle: {
    margin: 0,
    fontSize: "16px",
    color: "#391F25",
    fontFamily: "'Poppins', sans-serif",
  },
  timeTag: {
    fontSize: "11px",
    color: "#6C574C",
  },
  notifMessage: {
    margin: "6px 0 10px 0",
    color: "#391F25",
    fontSize: "13px",
    lineHeight: "1.4",
  },
  actionRow: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
  },
  linkBtn: {
    color: "#57142B",
    fontWeight: "700",
    fontSize: "12px",
    textDecoration: "none",
  },
  readBtn: {
    backgroundColor: "transparent",
    border: "1px solid #DAD0BB",
    color: "#6C574C",
    padding: "4px 10px",
    borderRadius: "4px",
    fontSize: "11px",
    cursor: "pointer",
    fontWeight: "600",
  },
  emptyBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    padding: "50px 20px",
    textAlign: "center",
    border: "1px solid #DAD0BB",
  },
  loadingBox: {
    padding: "50px",
    textAlign: "center",
    color: "#6C574C",
  },
};

export default Notifications;
