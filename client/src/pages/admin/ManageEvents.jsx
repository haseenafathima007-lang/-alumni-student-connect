import React, { useState, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { api } from "../../services/api";

function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/events").then((res) => {
      setEvents(res.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleDelete = (id) => {
    setEvents((prev) => prev.filter((e) => e._id !== id));
  };

  return (
    <AdminLayout>
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.header}>
            <h1 style={styles.title}>📅 Campus Events & Masterclass Moderation</h1>
            <p style={styles.subtitle}>
              Monitor, schedule, and moderate Easwari Engineering College alumni events, technical workshops, and guest webinars.
            </p>
          </div>

          {loading ? (
            <div style={styles.loadingBox}>
              Loading scheduled events...
            </div>
          ) : (
            <div style={styles.tableCard}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thRow}>
                    <th style={styles.th}>Event Title</th>
                    <th style={styles.th}>Category</th>
                    <th style={styles.th}>Date & Time</th>
                    <th style={styles.th}>Speaker</th>
                    <th style={styles.th}>Mode</th>
                    <th style={styles.th}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((evt) => (
                    <tr key={evt._id} style={styles.tr}>
                      <td style={styles.td}>
                        <strong>{evt.title}</strong>
                      </td>
                      <td style={styles.td}>{evt.category}</td>
                      <td style={styles.td}>{evt.date} • {evt.time}</td>
                      <td style={styles.td}>{evt.speaker || "Easwari Faculty / Alumni"}</td>
                      <td style={styles.td}>{evt.mode?.toUpperCase()}</td>
                      <td style={styles.td}>
                        <button
                          onClick={() => handleDelete(evt._id)}
                          style={styles.delBtn}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

const styles = {
  page: {
    padding: "30px 20px 60px 20px",
  },
  container: {
    maxWidth: "1150px",
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
  tableCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    boxShadow: "0 2px 12px rgba(57, 31, 37, 0.06)",
    overflowX: "auto",
    border: "1px solid #DAD0BB",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
  },
  thRow: {
    backgroundColor: "#57142B",
    color: "#FFFFFF",
  },
  th: {
    padding: "12px 16px",
    fontSize: "12px",
    fontWeight: "700",
    fontFamily: "'Poppins', sans-serif",
  },
  tr: {
    borderBottom: "1px solid #F7F5F0",
  },
  td: {
    padding: "12px 16px",
    fontSize: "13px",
    color: "#391F25",
  },
  delBtn: {
    backgroundColor: "#FFEBEE",
    color: "#C62828",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    fontWeight: "700",
    fontSize: "11px",
    cursor: "pointer",
  },
  loadingBox: {
    padding: "50px",
    textAlign: "center",
    color: "#6C574C",
  },
};

export default ManageEvents;
