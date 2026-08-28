import React, { useState, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { api } from "../../services/api";

function ManageApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get("/applications")
      .then((res) => {
        setApplications(res.data || []);
      })
      .catch((err) => {
        console.error("Failed to load applications:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.header}>
            <h1 style={styles.title}>📄 Placement & Internship Applications Audit</h1>
            <p style={styles.subtitle}>
              College-wide tracking of Easwari student candidate applications for on-campus and alumni-referred job/internship opportunities.
            </p>
          </div>

          {loading ? (
            <div style={styles.loadingBox}>
              Loading applications audit list...
            </div>
          ) : (
            <div style={styles.tableCard}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thRow}>
                    <th style={styles.th}>Applicant Student</th>
                    <th style={styles.th}>Type</th>
                    <th style={styles.th}>Position & Company</th>
                    <th style={styles.th}>Applied Date</th>
                    <th style={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app._id} style={styles.tr}>
                      <td style={styles.td}>
                        <strong>{app.studentName}</strong>
                        {app.rollNumber ? (
                          <div style={{ fontSize: "12px", color: "#6C574C" }}>{app.rollNumber}</div>
                        ) : null}
                      </td>
                      <td style={styles.td}>
                        <span style={styles.typeBadge}>{app.itemType?.toUpperCase()}</span>
                      </td>
                      <td style={styles.td}>
                        <strong>{app.positionTitle || app.title || "Software Trainee"}</strong>
                        <div style={{ fontSize: "12px", color: "#6C574C" }}>🏢 {app.company || "TCS"}</div>
                      </td>
                      <td style={styles.td}>{app.appliedDate || app.appliedAt || "2026-08-25"}</td>
                      <td style={styles.td}>
                        <span style={styles.statusBadge}>{app.status?.replace("_", " ").toUpperCase()}</span>
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
  typeBadge: {
    backgroundColor: "#F7F5F0",
    color: "#57142B",
    border: "1px solid #DAD0BB",
    padding: "3px 8px",
    borderRadius: "4px",
    fontSize: "11px",
    fontWeight: "700",
  },
  statusBadge: {
    backgroundColor: "#E8F5E9",
    color: "#2E7D32",
    padding: "3px 8px",
    borderRadius: "8px",
    fontSize: "11px",
    fontWeight: "700",
  },
  loadingBox: {
    padding: "50px",
    textAlign: "center",
    color: "#6C574C",
  },
};

export default ManageApplications;
