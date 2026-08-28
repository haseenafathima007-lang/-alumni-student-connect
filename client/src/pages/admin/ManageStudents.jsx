import React, { useState, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { api } from "../../services/api";

function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get("/faculty/students")
      .then((res) => {
        setStudents(res.data || []);
      })
      .catch((err) => {
        console.error("Failed to load students:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.header}>
            <h1 style={styles.title}>🎓 Student Directory Governance</h1>
            <p style={styles.subtitle}>
              Monitor enrolled students, academic departments, CGPA metrics, and career readiness.
            </p>
          </div>

          {loading ? (
            <div style={styles.loadingBox}>
              Loading student directory...
            </div>
          ) : (
            <div style={styles.tableCard}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thRow}>
                    <th style={styles.th}>Student Name & Roll</th>
                    <th style={styles.th}>Department</th>
                    <th style={styles.th}>Batch</th>
                    <th style={styles.th}>CGPA</th>
                    <th style={styles.th}>Placement Status</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s._id} style={styles.tr}>
                      <td style={styles.td}>
                        <strong>{s.name}</strong>
                        <div style={{ fontSize: "12px", color: "#6C574C" }}>{s.rollNumber ? `${s.rollNumber} • ` : ""}{s.email}</div>
                      </td>
                      <td style={styles.td}>{s.department || "Artificial Intelligence and Data Science"}</td>
                      <td style={styles.td}>{s.batch || "2024"}</td>
                      <td style={styles.td}>
                        <span style={styles.cgpaBadge}>{s.cgpa || "8.5"}</span>
                      </td>
                      <td style={styles.td}>
                        <span style={styles.statusBadge}>{s.placementStatus || "Active"}</span>
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
  cgpaBadge: {
    backgroundColor: "#F7F5F0",
    color: "#57142B",
    border: "1px solid #DAD0BB",
    padding: "3px 8px",
    borderRadius: "10px",
    fontWeight: "700",
    fontSize: "11px",
  },
  statusBadge: {
    backgroundColor: "#E8F5E9",
    color: "#2E7D32",
    padding: "3px 8px",
    borderRadius: "10px",
    fontSize: "11px",
    fontWeight: "700",
  },
  loadingBox: {
    padding: "50px",
    textAlign: "center",
    color: "#6C574C",
  },
};

export default ManageStudents;
