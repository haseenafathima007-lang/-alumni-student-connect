import React, { useState, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { api } from "../../services/api";

function ManageAlumni() {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/alumni").then((res) => {
      setAlumni(res.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.header}>
            <h1 style={styles.title}>💼 Alumni Network Administration</h1>
            <p style={styles.subtitle}>
              Monitor verified Easwari alumni distribution, employers, department cohorts, and mentorship active statuses.
            </p>
          </div>

          {loading ? (
            <div style={styles.loadingBox}>
              Loading alumni directory...
            </div>
          ) : (
            <div style={styles.tableCard}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thRow}>
                    <th style={styles.th}>Alumnus Name</th>
                    <th style={styles.th}>Current Employer</th>
                    <th style={styles.th}>Role / Designation</th>
                    <th style={styles.th}>Department & Batch</th>
                    <th style={styles.th}>Mentoring</th>
                  </tr>
                </thead>
                <tbody>
                  {alumni.map((a) => (
                    <tr key={a._id} style={styles.tr}>
                      <td style={styles.td}>
                        <strong>{a.name}</strong>
                        <div style={{ fontSize: "12px", color: "#6C574C" }}>{a.email}</div>
                      </td>
                      <td style={styles.td}>{a.profile?.company || "Leading Tech Corp"}</td>
                      <td style={styles.td}>{a.profile?.jobTitle || "Software Professional"}</td>
                      <td style={styles.td}>{a.profile?.department || "AI & DS"} (Batch {a.profile?.graduationYear || "2021"})</td>
                      <td style={styles.td}>
                        <span
                          style={{
                            backgroundColor: a.profile?.isMentoring !== false ? "#E8F5E9" : "#F7F5F0",
                            color: a.profile?.isMentoring !== false ? "#2E7D32" : "#6C574C",
                            padding: "3px 8px",
                            borderRadius: "10px",
                            fontSize: "11px",
                            fontWeight: "700",
                          }}
                        >
                          {a.profile?.isMentoring !== false ? "✓ Active Mentor" : "Networking"}
                        </span>
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
  loadingBox: {
    padding: "50px",
    textAlign: "center",
    color: "#6C574C",
  },
};

export default ManageAlumni;
