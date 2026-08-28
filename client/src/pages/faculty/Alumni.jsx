import React, { useState, useEffect } from "react";
import FacultyLayout from "../../layouts/FacultyLayout";
import { api } from "../../services/api";

function FacultyAlumni() {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchAlumni = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/alumni?search=${encodeURIComponent(search)}`);
      setAlumni(res.data || []);
    } catch (err) {
      console.error("Failed to load alumni:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlumni();
  }, []);

  return (
    <FacultyLayout>
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.header}>
            <h1 style={styles.title}>💼 Department Alumni Network</h1>
            <p style={styles.subtitle}>
              Connect with Easwari graduates in leadership tech positions for guest lectures, student mentorship recommendations, and curriculum advisory.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchAlumni();
            }}
            style={styles.searchCard}
          >
            <input
              type="text"
              placeholder="Search alumni by name, company, or tech stack (e.g. Google, AI, Python)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.input}
            />
          </form>

          {loading ? (
            <div style={styles.loadingBox}>
              Loading alumni directory...
            </div>
          ) : (
            <div style={styles.grid}>
              {alumni.map((a) => {
                const p = a.profile || {};
                return (
                  <div key={a._id} style={styles.card}>
                    <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "10px" }}>
                      <div style={styles.avatar}>{a.name?.charAt(0) || "A"}</div>
                      <div>
                        <h3 style={styles.name}>{a.name}</h3>
                        <p style={styles.role}>{p.jobTitle || "Software Engineer"} @ {p.company || "Tech Corp"}</p>
                      </div>
                    </div>

                    <div style={styles.metaRow}>
                      <span>🎓 {p.department || "AI & DS"} (Batch {p.graduationYear || "2022"})</span>
                      <span>📍 {p.location || "Chennai, India"}</span>
                    </div>

                    {p.expertise && (
                      <div style={styles.skillsBox}>
                        {p.expertise.map((s, idx) => (
                          <span key={idx} style={styles.skillTag}>
                            {s}
                          </span>
                        ))}
                      </div>
                    )}

                    <div style={{ marginTop: "auto", borderTop: "1px solid #F7F5F0", paddingTop: "10px" }}>
                      <p style={{ margin: 0, fontSize: "12px", color: "#6C574C" }}>
                        📧 {a.email}
                      </p>
                    </div>
                  </div>
                );
              })}
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
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "18px",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    padding: "22px",
    boxShadow: "0 2px 12px rgba(57, 31, 37, 0.06)",
    border: "1px solid #DAD0BB",
    display: "flex",
    flexDirection: "column",
  },
  avatar: {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    backgroundColor: "#57142B",
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "17px",
    fontWeight: "700",
  },
  name: {
    margin: "0 0 2px 0",
    fontSize: "17px",
    color: "#391F25",
    fontFamily: "'Poppins', sans-serif",
  },
  role: {
    margin: 0,
    fontSize: "13px",
    color: "#57142B",
    fontWeight: "700",
  },
  metaRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "12px",
    color: "#6C574C",
    margin: "8px 0",
  },
  skillsBox: {
    display: "flex",
    flexWrap: "wrap",
    gap: "5px",
    margin: "8px 0 14px 0",
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
  loadingBox: {
    padding: "50px",
    textAlign: "center",
    color: "#6C574C",
  },
};

export default FacultyAlumni;
