import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AlumniLayout from "../../layouts/AlumniLayout";
import { api } from "../../services/api";

function MyMentees() {
  const [mentees, setMentees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMentees = async () => {
      setLoading(true);
      try {
        const res = await api.get("/mentorship/my-mentees");
        setMentees(res.data || []);
      } catch (err) {
        console.error("Failed to load mentees:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMentees();
  }, []);

  return (
    <AlumniLayout>
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.header}>
            <h1 style={styles.title}>🤝 Active Student Mentees</h1>
            <p style={styles.subtitle}>
              Track students you are actively mentoring and manage their coaching topics.
            </p>
          </div>

          {loading ? (
            <div style={styles.loadingBox}>Loading your student mentees...</div>
          ) : mentees.length === 0 ? (
            <div style={styles.emptyBox}>
              <span style={{ fontSize: "40px" }}>🤝</span>
              <h3 style={{ color: "#391F25", margin: "10px 0 6px 0" }}>No active mentees yet</h3>
              <p style={{ color: "#6C574C", margin: "0 0 16px 0" }}>
                Accepted mentorship sessions will connect students directly with your profile.
              </p>
              <Link to="/alumni/mentorship-requests" style={styles.primaryBtn}>
                View Incoming Requests →
              </Link>
            </div>
          ) : (
            <div style={styles.grid}>
              {mentees.map((mentee) => (
                <div key={mentee._id} style={styles.card}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px" }}>
                    <div>
                      <h3 style={styles.name}>{mentee.student?.name || mentee.name || "Student Mentee"}</h3>
                      <p style={styles.dept}>
                        🎓 {mentee.student?.department || mentee.department || "Artificial Intelligence and Data Science"} (Batch {mentee.student?.batch || mentee.batch || "2024"})
                      </p>
                    </div>
                    <span style={styles.badge}>Active Guidance</span>
                  </div>

                  <div style={styles.topicBox}>
                    <strong>Mentorship Focus:</strong> {mentee.topic || "Placement & Technical Guidance"}
                  </div>

                  <div style={styles.metaRow}>
                    <span>📧 {mentee.student?.email || mentee.email || "student@eec.srmrmp.edu.in"}</span>
                    {mentee.meetingLink && (
                      <a href={mentee.meetingLink} target="_blank" rel="noreferrer" style={styles.meetLink}>
                        🎥 Join Session Meeting Link ➔
                      </a>
                    )}
                  </div>

                  <div style={{ marginTop: "14px", display: "flex", justifyContent: "flex-end" }}>
                    <Link
                      to={`/alumni/chat?user=${mentee.student?._id || mentee.student || ""}`}
                      style={styles.chatBtn}
                    >
                      💬 Message Mentee
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
    maxWidth: "1050px",
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
  name: {
    margin: "0 0 3px 0",
    fontSize: "18px",
    color: "#391F25",
    fontFamily: "'Poppins', sans-serif",
  },
  dept: {
    margin: 0,
    fontSize: "13px",
    color: "#6C574C",
  },
  badge: {
    backgroundColor: "#E8F5E9",
    color: "#2E7D32",
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "11px",
    fontWeight: "700",
  },
  topicBox: {
    backgroundColor: "#F7F5F0",
    padding: "10px 14px",
    borderRadius: "6px",
    fontSize: "13px",
    color: "#391F25",
    margin: "12px 0",
    border: "1px solid #DAD0BB",
  },
  metaRow: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    fontSize: "12px",
    color: "#6C574C",
  },
  meetLink: {
    color: "#57142B",
    fontWeight: "700",
    textDecoration: "none",
  },
  chatBtn: {
    backgroundColor: "#57142B",
    color: "#FFFFFF",
    padding: "8px 14px",
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
    padding: "10px 18px",
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

export default MyMentees;
