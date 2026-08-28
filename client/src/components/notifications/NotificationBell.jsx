import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useNotifications } from "../../context/NotificationContext";

function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = async (notif) => {
    if (!notif.isRead) {
      await markAsRead(notif._id);
    }
    setIsOpen(false);
    if (notif.link) {
      navigate(notif.link);
    }
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

  return (
    <div style={styles.container} ref={dropdownRef}>
      <button
        style={styles.bellBtn}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        <span style={styles.bellIcon}>🔔</span>
        {unreadCount > 0 && (
          <span style={styles.badge}>
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div style={styles.dropdown}>
          <div style={styles.dropdownHeader}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <strong style={{ color: "#391F25", fontSize: "14px", fontFamily: "'Poppins', sans-serif" }}>Notifications</strong>
              {unreadCount > 0 && (
                <span style={styles.unreadTag}>{unreadCount} New</span>
              )}
            </div>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} style={styles.markAllBtn}>
                Mark all read
              </button>
            )}
          </div>

          <div style={styles.list}>
            {notifications.length === 0 ? (
              <div style={styles.emptyState}>
                <span style={{ fontSize: "26px" }}>📭</span>
                <p style={{ margin: "8px 0 0 0", color: "#6C574C", fontSize: "13px" }}>
                  No new notifications right now
                </p>
              </div>
            ) : (
              notifications.slice(0, 6).map((notif) => (
                <div
                  key={notif._id}
                  onClick={() => handleNotificationClick(notif)}
                  style={{
                    ...styles.item,
                    backgroundColor: notif.isRead ? "#FFFFFF" : "#F7F5F0",
                    borderLeft: notif.isRead ? "3px solid transparent" : "3px solid #57142B",
                  }}
                >
                  <div style={styles.itemIcon}>{getIcon(notif.type)}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <strong style={styles.itemTitle}>{notif.title}</strong>
                      {!notif.isRead && <span style={styles.dot}>●</span>}
                    </div>
                    <p style={styles.itemMsg}>{notif.message}</p>
                    <span style={styles.itemTime}>
                      {notif.createdAt ? new Date(notif.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Just now"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div style={styles.dropdownFooter}>
            <Link
              to="/notifications"
              onClick={() => setIsOpen(false)}
              style={styles.viewAllLink}
            >
              View All Notifications →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    position: "relative",
    display: "inline-block",
  },
  bellBtn: {
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "8px",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  bellIcon: {
    fontSize: "20px",
  },
  badge: {
    position: "absolute",
    top: "2px",
    right: "2px",
    backgroundColor: "#C4A78D",
    color: "#391F25",
    fontSize: "10px",
    fontWeight: "800",
    borderRadius: "10px",
    minWidth: "16px",
    height: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 4px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    right: 0,
    width: "350px",
    backgroundColor: "#FFFFFF",
    borderRadius: "10px",
    boxShadow: "0 8px 30px rgba(57, 31, 37, 0.18)",
    border: "1px solid #DAD0BB",
    zIndex: 1000,
    marginTop: "8px",
    overflow: "hidden",
  },
  dropdownHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 16px",
    borderBottom: "1px solid #DAD0BB",
    backgroundColor: "#F7F5F0",
  },
  unreadTag: {
    backgroundColor: "#57142B",
    color: "#FFFFFF",
    fontSize: "10px",
    fontWeight: "700",
    padding: "2px 7px",
    borderRadius: "10px",
  },
  markAllBtn: {
    backgroundColor: "transparent",
    border: "none",
    color: "#6C574C",
    fontSize: "12px",
    cursor: "pointer",
    fontWeight: "600",
    textDecoration: "underline",
  },
  list: {
    maxHeight: "360px",
    overflowY: "auto",
  },
  item: {
    display: "flex",
    gap: "12px",
    padding: "12px 16px",
    borderBottom: "1px solid #F7F5F0",
    cursor: "pointer",
    transition: "background 0.2s ease",
  },
  itemIcon: {
    fontSize: "20px",
    paddingTop: "2px",
  },
  itemTitle: {
    fontSize: "13px",
    color: "#391F25",
  },
  itemMsg: {
    margin: "3px 0",
    fontSize: "12px",
    color: "#6C574C",
    lineHeight: "1.4",
  },
  itemTime: {
    fontSize: "10px",
    color: "#887B75",
  },
  dot: {
    color: "#57142B",
    fontSize: "10px",
  },
  emptyState: {
    padding: "30px 16px",
    textAlign: "center",
  },
  dropdownFooter: {
    padding: "10px 16px",
    textAlign: "center",
    backgroundColor: "#F7F5F0",
    borderTop: "1px solid #DAD0BB",
  },
  viewAllLink: {
    fontSize: "12px",
    color: "#57142B",
    fontWeight: "700",
    textDecoration: "none",
  },
};

export default NotificationBell;
