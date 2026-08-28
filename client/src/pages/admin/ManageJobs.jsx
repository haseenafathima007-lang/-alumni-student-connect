import React, { useState, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { api } from "../../services/api";

function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await api.get("/jobs");
      setJobs(res.data || []);
    } catch (err) {
      console.error("Failed to load jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = (id) => {
    setJobs((prev) => prev.filter((j) => j._id !== id));
  };

  return (
    <AdminLayout>
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.header}>
            <h1 style={styles.title}>💼 Career Postings & Job Moderation</h1>
            <p style={styles.subtitle}>
              Review, moderate, or remove posted job openings to ensure Easwari student safety, fair compensation, and placement integrity.
            </p>
          </div>

          {loading ? (
            <div style={styles.loadingBox}>
              Loading job listings...
            </div>
          ) : (
            <div style={styles.tableCard}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thRow}>
                    <th style={styles.th}>Job Title</th>
                    <th style={styles.th}>Company</th>
                    <th style={styles.th}>Type & Location</th>
                    <th style={styles.th}>Package / CTC</th>
                    <th style={styles.th}>Applicants</th>
                    <th style={styles.th}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job._id} style={styles.tr}>
                      <td style={styles.td}>
                        <strong>{job.title}</strong>
                      </td>
                      <td style={styles.td}>{job.company}</td>
                      <td style={styles.td}>{job.jobType || "Full-time"} • {job.location || "Remote"}</td>
                      <td style={styles.td}>{job.salary || "Competitive"}</td>
                      <td style={styles.td}>{job.applicantsCount || 0} Candidates</td>
                      <td style={styles.td}>
                        <button
                          onClick={() => handleDelete(job._id)}
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

export default ManageJobs;
