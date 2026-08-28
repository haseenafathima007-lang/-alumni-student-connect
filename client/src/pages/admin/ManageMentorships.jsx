import React, { useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";

function ManageMentorships() {
  const [mentorships] = useState([
    {
      _id: "m-1",
      studentName: "Rohan Varma",
      alumniName: "Arun Kumar (TCS)",
      topic: "Full Stack Career Roadmap & Mock Placement Interview",
      status: "accepted",
      createdAt: "2026-08-22",
    },
    {
      _id: "m-2",
      studentName: "Divya Krishnan",
      alumniName: "Priya Sharma (Zoho)",
      topic: "Artificial Intelligence & Data Analytics Transition",
      status: "pending",
      createdAt: "2026-08-25",
    },
    {
      _id: "m-3",
      studentName: "Karthik Nair",
      alumniName: "Rahul Raj (Infosys)",
      topic: "Cloud Architecture & AWS Certification Mastery",
      status: "accepted",
      createdAt: "2026-08-18",
    },
  ]);

  return (
    <AdminLayout>
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.header}>
            <h1 style={styles.title}>🤝 Mentorship Pairing & Session Audits</h1>
            <p style={styles.subtitle}>
              Monitor active 1-on-1 Easwari mentorship pairings, guidance topics, session statuses, and meeting links.
            </p>
          </div>

          <div style={styles.tableCard}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.thRow}>
                  <th style={styles.th}>Student Mentee</th>
                  <th style={styles.th}>Alumni Mentor</th>
                  <th style={styles.th}>Guidance Topic</th>
                  <th style={styles.th}>Requested Date</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {mentorships.map((m) => (
                  <tr key={m._id} style={styles.tr}>
                    <td style={styles.td}>
                      <strong>{m.studentName}</strong>
                    </td>
                    <td style={styles.td}>{m.alumniName}</td>
                    <td style={styles.td}>{m.topic}</td>
                    <td style={styles.td}>{m.createdAt}</td>
                    <td style={styles.td}>
                      <span
                        style={{
                          backgroundColor: m.status === "accepted" ? "#E8F5E9" : "#FFF8E1",
                          color: m.status === "accepted" ? "#2E7D32" : "#F57F17",
                          padding: "3px 8px",
                          borderRadius: "8px",
                          fontSize: "11px",
                          fontWeight: "700",
                        }}
                      >
                        {m.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
};

export default ManageMentorships;
