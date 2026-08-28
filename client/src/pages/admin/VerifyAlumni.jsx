import React, { useState, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { api } from "../../services/api";

function VerifyAlumni() {
  const [alumniList, setAlumniList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);

  const fetchVerifications = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/verifications");
      setAlumniList(res.data || []);
    } catch (err) {
      console.error("Failed to load verifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifications();
  }, []);

  const handleAction = async (id, newStatus) => {
    try {
      await api.put(`/admin/verify/${id}`, { status: newStatus });
      setAlumniList((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: newStatus } : a))
      );
      setFeedback(
        `Alumnus ${newStatus === "verified" ? "APPROVED and marked Verified" : "REJECTED"} successfully!`
      );
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      setFeedback(err.message || "Failed to update verification status.");
    }
  };

  const pendingList = alumniList.filter((a) => a.status === "pending");

  return (
    <AdminLayout>
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.header}>
            <h1 style={styles.title}>✅ Alumni Verification Queue</h1>
            <p style={styles.subtitle}>
              Validate Easwari Engineering College graduation records, department cohorts, and company designations to grant verified badges.
            </p>
          </div>

          {feedback && (
            <div style={styles.successAlert}>
              ✅ {feedback}
            </div>
          )}

          {loading ? (
            <div style={styles.loadingBox}>
              Loading verification queue...
            </div>
          ) : pendingList.length === 0 ? (
            <div style={styles.emptyBox}>
              <span style={{ fontSize: "40px" }}>🎉</span>
              <h3 style={{ color: "#391F25", margin: "10px 0 6px 0" }}>All verification requests have been processed!</h3>
              <p style={{ color: "#6C574C", margin: 0 }}>No pending alumni verifications currently in the queue.</p>
            </div>
          ) : (
            <div style={styles.list}>
              {pendingList.map((alumnus) => (
                <div key={alumnus._id} style={styles.card}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px" }}>
                    <div>
                      <h3 style={styles.name}>{alumnus.name}</h3>
                      <p style={styles.meta}>
                        {alumnus.department || "Artificial Intelligence and Data Science"} (Batch {alumnus.graduationYear || "2022"})
                      </p>
                      <p style={styles.workMeta}>
                        🏢 {alumnus.jobTitle || "Software Engineer"} at <strong>{alumnus.company || "TCS"}</strong>
                      </p>
                    </div>

                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                      <a
                        href={alumnus.proofUrl || "https://drive.google.com"}
                        target="_blank"
                        rel="noreferrer"
                        style={styles.proofBtn}
                      >
                        📄 Inspect Degree Proof
                      </a>
                      <button
                        onClick={() => handleAction(alumnus._id, "verified")}
                        style={styles.approveBtn}
                      >
                        ✓ Approve & Verify
                      </button>
                      <button
                        onClick={() => handleAction(alumnus._id, "rejected")}
                        style={styles.rejectBtn}
                      >
                        ✕ Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
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
    maxWidth: "1100px",
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
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    padding: "22px",
    boxShadow: "0 2px 12px rgba(57, 31, 37, 0.06)",
    border: "1px solid #DAD0BB",
  },
  name: {
    margin: "0 0 3px 0",
    fontSize: "18px",
    color: "#391F25",
    fontFamily: "'Poppins', sans-serif",
  },
  meta: {
    margin: "0 0 4px 0",
    fontSize: "13px",
    color: "#6C574C",
  },
  workMeta: {
    margin: 0,
    fontSize: "13px",
    color: "#391F25",
  },
  proofBtn: {
    backgroundColor: "#F7F5F0",
    border: "1px solid #DAD0BB",
    color: "#391F25",
    padding: "8px 14px",
    borderRadius: "6px",
    textDecoration: "none",
    fontWeight: "700",
    fontSize: "12px",
    display: "inline-block",
  },
  approveBtn: {
    backgroundColor: "#2E7D32",
    color: "#FFFFFF",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    fontWeight: "700",
    fontSize: "12px",
    cursor: "pointer",
  },
  rejectBtn: {
    backgroundColor: "#C62828",
    color: "#FFFFFF",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    fontWeight: "700",
    fontSize: "12px",
    cursor: "pointer",
  },
  emptyBox: {
    backgroundColor: "#FFFFFF",
    padding: "50px 20px",
    borderRadius: "12px",
    textAlign: "center",
    border: "1px solid #DAD0BB",
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
  loadingBox: {
    padding: "50px",
    textAlign: "center",
    color: "#6C574C",
  },
};

export default VerifyAlumni;
