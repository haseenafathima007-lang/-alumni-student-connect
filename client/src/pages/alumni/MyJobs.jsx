import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AlumniLayout from "../../layouts/AlumniLayout";
import { api } from "../../services/api";

function MyJobs() {
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

  return (
    <AlumniLayout>
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.header}>
            <div>
              <h1 style={styles.title}>💼 My Posted Job Listings</h1>
              <p style={styles.subtitle}>
                Manage active campus job referrals and track applicant candidate profiles.
              </p>
            </div>
            <Link to="/alumni/post-job" style={styles.postBtn}>
              + Post New Job
            </Link>
          </div>

          {loading ? (
            <div style={styles.loadingBox}>
              Loading your job listings...
            </div>
          ) : jobs.length === 0 ? (
            <div style={styles.emptyBox}>
              <span style={{ fontSize: "40px" }}>💼</span>
              <h3 style={{ color: "#391F25", margin: "10px 0 6px 0" }}>No jobs posted yet</h3>
              <p style={{ color: "#6C574C", margin: "0 0 16px 0" }}>Post a campus job opportunity to connect with talented graduates.</p>
              <Link to="/alumni/post-job" style={styles.primaryBtn}>
                Post Your First Job →
              </Link>
            </div>
          ) : (
            <div style={styles.grid}>
              {jobs.map((job) => (
                <div key={job._id} style={styles.card}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px" }}>
                    <div>
                      <h3 style={styles.jobTitle}>{job.title}</h3>
                      <p style={styles.company}>🏢 {job.company} • 📍 {job.location}</p>
                    </div>
                    <span style={styles.badge}>{job.jobType || "Full-time"}</span>
                  </div>

                  <div style={styles.metaRow}>
                    <span>💰 {job.salary || "Competitive CTC"}</span>
                    <span>📊 {job.experienceLevel || "0-2 Years"}</span>
                    <span>👥 {job.applicantsCount || 0} Total Applicants</span>
                  </div>

                  <p style={styles.description}>{job.description}</p>

                  <div style={styles.actionRow}>
                    <Link to="/alumni/applicants" style={styles.viewApplicantsBtn}>
                      View Applicants ({job.applicantsCount || 0}) →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AlumniLayout>
  );
}

const styles = {
  page: {
    padding: "30px 20px 60px 20px",
  },
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    flexWrap: "wrap",
    gap: "14px",
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
  postBtn: {
    backgroundColor: "#57142B",
    color: "#FFFFFF",
    padding: "10px 18px",
    borderRadius: "6px",
    textDecoration: "none",
    fontWeight: "700",
    fontSize: "13px",
  },
  grid: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 2px 12px rgba(57, 31, 37, 0.06)",
    border: "1px solid #DAD0BB",
  },
  jobTitle: {
    margin: "0 0 4px 0",
    fontSize: "18px",
    color: "#391F25",
    fontFamily: "'Poppins', sans-serif",
  },
  company: {
    margin: 0,
    fontSize: "13px",
    color: "#6C574C",
  },
  badge: {
    backgroundColor: "#F7F5F0",
    color: "#57142B",
    border: "1px solid #DAD0BB",
    padding: "3px 10px",
    borderRadius: "12px",
    fontSize: "11px",
    fontWeight: "700",
  },
  metaRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "16px",
    fontSize: "12px",
    color: "#6C574C",
    margin: "12px 0",
    padding: "8px 0",
    borderTop: "1px solid #F7F5F0",
    borderBottom: "1px solid #F7F5F0",
  },
  description: {
    fontSize: "13px",
    color: "#391F25",
    lineHeight: "1.5",
    margin: "0 0 14px 0",
  },
  actionRow: {
    display: "flex",
    gap: "10px",
  },
  viewApplicantsBtn: {
    backgroundColor: "#6C574C",
    color: "#FFFFFF",
    padding: "8px 16px",
    borderRadius: "6px",
    textDecoration: "none",
    fontWeight: "700",
    fontSize: "12px",
  },
  emptyBox: {
    backgroundColor: "#FFFFFF",
    padding: "50px 20px",
    borderRadius: "12px",
    textAlign: "center",
    border: "1px solid #DAD0BB",
  },
  primaryBtn: {
    display: "inline-block",
    backgroundColor: "#57142B",
    color: "#FFFFFF",
    padding: "10px 20px",
    borderRadius: "6px",
    textDecoration: "none",
    fontWeight: "700",
    fontSize: "13px",
  },
  loadingBox: {
    padding: "50px",
    textAlign: "center",
    color: "#6C574C",
  },
};

export default MyJobs;
