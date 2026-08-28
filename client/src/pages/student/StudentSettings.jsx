import React, { useState } from "react";
import StudentLayout from "../../layouts/StudentLayout";
import { useAuth } from "../../context/AuthContext";

function StudentSettings() {
  const { user } = useAuth();
  const [feedback, setFeedback] = useState(null);

  const [settings, setSettings] = useState({
    emailAlerts: true,
    mentorshipNotifications: true,
    jobAlerts: true,
    profileVisibility: "public",
  });

  const handleSave = (e) => {
    e.preventDefault();
    setFeedback("Settings and notification preferences updated successfully!");
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <StudentLayout>
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.header}>
            <h1 style={styles.title}>⚙️ Account Settings & Notifications</h1>
            <p style={styles.subtitle}>
              Manage your in-app alert subscriptions, privacy level, and placement communication preferences.
            </p>
          </div>

          {feedback && (
            <div style={styles.successAlert}>
              ✅ {feedback}
            </div>
          )}

          <div style={styles.card}>
            <form onSubmit={handleSave}>
              <h3 style={styles.sectionHeader}>🔔 Real-Time Alert Subscriptions</h3>

              <label style={styles.checkboxRow}>
                <input
                  type="checkbox"
                  checked={settings.mentorshipNotifications}
                  onChange={(e) => setSettings({ ...settings, mentorshipNotifications: e.target.checked })}
                />
                <div>
                  <strong style={{ color: "#391F25", fontSize: "14px" }}>Mentorship Session Updates</strong>
                  <p style={styles.desc}>Receive instant alerts when an alumni mentor accepts, schedules, or attaches a meeting link.</p>
                </div>
              </label>

              <label style={styles.checkboxRow}>
                <input
                  type="checkbox"
                  checked={settings.jobAlerts}
                  onChange={(e) => setSettings({ ...settings, jobAlerts: e.target.checked })}
                />
                <div>
                  <strong style={{ color: "#391F25", fontSize: "14px" }}>Job & Internship Alerts</strong>
                  <p style={styles.desc}>Get notified when alumni publish new opportunities matching your department and skills.</p>
                </div>
              </label>

              <label style={styles.checkboxRow}>
                <input
                  type="checkbox"
                  checked={settings.emailAlerts}
                  onChange={(e) => setSettings({ ...settings, emailAlerts: e.target.checked })}
                />
                <div>
                  <strong style={{ color: "#391F25", fontSize: "14px" }}>Campus Workshop Announcements</strong>
                  <p style={styles.desc}>Receive notices for department masterclasses, guest lectures, and placement orientation sessions.</p>
                </div>
              </label>

              <h3 style={{ ...styles.sectionHeader, marginTop: "24px" }}>🔒 Profile Privacy</h3>

              <div style={{ marginBottom: "20px" }}>
                <label style={styles.label}>Profile Visibility in Directory</label>
                <select
                  value={settings.profileVisibility}
                  onChange={(e) => setSettings({ ...settings, profileVisibility: e.target.value })}
                  style={styles.select}
                >
                  <option value="public">Visible to All Verified EEC Alumni & Faculty</option>
                  <option value="mentors_only">Visible Only to Connected Mentors & Applicants</option>
                </select>
              </div>

              <button type="submit" style={styles.saveBtn}>
                Save Preferences →
              </button>
            </form>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}

const styles = {
  page: {
    padding: "30px 20px 60px 20px",
  },
  container: {
    maxWidth: "800px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "24px",
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
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    padding: "30px",
    boxShadow: "0 4px 16px rgba(57, 31, 37, 0.07)",
    border: "1px solid #DAD0BB",
  },
  sectionHeader: {
    margin: "0 0 16px 0",
    color: "#391F25",
    fontSize: "16px",
    borderBottom: "1px solid #F7F5F0",
    paddingBottom: "8px",
    fontFamily: "'Poppins', sans-serif",
  },
  checkboxRow: {
    display: "flex",
    gap: "12px",
    alignItems: "flex-start",
    marginBottom: "16px",
    cursor: "pointer",
  },
  desc: {
    margin: "2px 0 0 0",
    fontSize: "12px",
    color: "#6C574C",
    lineHeight: "1.4",
  },
  label: {
    display: "block",
    color: "#391F25",
    fontWeight: "700",
    marginBottom: "6px",
    fontSize: "13px",
  },
  select: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "6px",
    border: "1.5px solid #DAD0BB",
    color: "#391F25",
    fontSize: "13px",
    outline: "none",
    backgroundColor: "#FFFFFF",
  },
  saveBtn: {
    backgroundColor: "#57142B",
    color: "#FFFFFF",
    border: "none",
    padding: "12px 24px",
    borderRadius: "6px",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "14px",
    boxShadow: "0 4px 12px rgba(87, 20, 43, 0.25)",
  },
  successAlert: {
    backgroundColor: "#E8F5E9",
    color: "#2E7D32",
    padding: "12px 18px",
    borderRadius: "8px",
    marginBottom: "20px",
    fontWeight: "700",
    border: "1px solid #C8E6C9",
  },
};

export default StudentSettings;
