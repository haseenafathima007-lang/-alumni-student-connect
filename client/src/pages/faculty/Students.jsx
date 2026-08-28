import React, { useState, useEffect } from "react";
import FacultyLayout from "../../layouts/FacultyLayout";
import { api } from "../../services/api";

function FacultyStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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

  const filtered = students.filter(
    (s) =>
      (s.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (s.rollNumber || "").toLowerCase().includes(search.toLowerCase()) ||
      s.skills?.some((sk) => sk.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <FacultyLayout>
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.header}>
            <h1 style={styles.title}>🎓 Department Students Directory</h1>
            <p style={styles.subtitle}>
              Monitor student academic performance, technical skills, and placement readiness across cohorts.
            </p>
          </div>

          <div style={styles.searchCard}>
            <input
              type="text"
              placeholder="Search students by name, roll number, or technical skills (e.g. Python, AI, React)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.input}
            />
          </div>

          {loading ? (
            <div style={styles.loadingBox}>
              Loading student roster...
            </div>
          ) : (
            <div style={styles.grid}>
              {filtered.map((s) => (
                <div key={s._id} style={styles.card}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px" }}>
                    <div>
                      <h3 style={styles.name}>{s.name}</h3>
                      <p style={styles.meta}>
                        {s.rollNumber ? `Roll No: ${s.rollNumber} • ` : ""}{s.department || "Artificial Intelligence and Data Science"}
                      </p>
                    </div>
                    <span style={styles.cgpaBadge}>CGPA: {s.cgpa || "8.8"}</span>
                  </div>

                  {s.skills && s.skills.length > 0 && (
                    <div style={styles.skillsBox}>
                      {s.skills.map((sk, idx) => (
                        <span key={idx} style={styles.skillTag}>
                          {sk}
                        </span>
                      ))}
                    </div>
                  )}

                  <div style={styles.footerRow}>
                    <span>📧 {s.email}</span>
                    <span style={styles.statusBadge}>{s.placementStatus || "Eligible"}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </FacultyLayout>
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
  searchCard: {
    backgroundColor: "#FFFFFF",
    padding: "16px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(57, 31, 37, 0.06)",
    marginBottom: "22px",
    border: "1px solid #DAD0BB",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "11px 14px",
    border: "1.5px solid #DAD0BB",
    borderRadius: "6px",
    fontSize: "14px",
    outline: "none",
  },
  grid: {
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
    margin: 0,
    fontSize: "13px",
    color: "#6C574C",
  },
  cgpaBadge: {
    backgroundColor: "#F7F5F0",
    color: "#57142B",
    border: "1px solid #DAD0BB",
    padding: "4px 12px",
    borderRadius: "14px",
    fontWeight: "700",
    fontSize: "12px",
  },
  skillsBox: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
    margin: "12px 0",
  },
  skillTag: {
    backgroundColor: "#F7F5F0",
    border: "1px solid #DAD0BB",
    color: "#391F25",
    padding: "3px 8px",
    borderRadius: "4px",
    fontSize: "11px",
    fontWeight: "600",
  },
  footerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderTop: "1px solid #F7F5F0",
    paddingTop: "10px",
    fontSize: "12px",
    color: "#6C574C",
    flexWrap: "wrap",
    gap: "10px",
  },
  statusBadge: {
    backgroundColor: "#E8F5E9",
    color: "#2E7D32",
    padding: "3px 10px",
    borderRadius: "10px",
    fontWeight: "700",
    fontSize: "11px",
  },
  loadingBox: {
    padding: "50px",
    textAlign: "center",
    color: "#6C574C",
  },
};

export default FacultyStudents;
