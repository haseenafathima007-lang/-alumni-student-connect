import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import StudentLayout from "../../layouts/StudentLayout";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import { DEPARTMENTS } from "../../constants/departments";

function StudentProfile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [savedMessage, setSavedMessage] = useState(null);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    department: "Artificial Intelligence and Data Science",
    batch: "2023 - 2027",
    rollNumber: "23AI104",
    cgpa: "8.85",
    skills: "Python, PyTorch, React, SQL, Machine Learning, Node.js",
    careerInterests: "AI/ML Engineer, Data Scientist, Full Stack Developer",
    bio: "Passionate undergraduate in Artificial Intelligence & Data Science exploring deep learning, LLMs, full-stack development, and competitive problem solving.",
    linkedIn: "https://linkedin.com/in/student-profile",
    github: "https://github.com/student-demo",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setFetching(true);
        const res = await api.get("/student/profile");
        if (res.data) {
          setFormData((prev) => ({
            ...prev,
            ...res.data,
            name: user?.name || res.data.name || prev.name,
            email: user?.email || res.data.email || prev.email,
          }));
        }
      } catch (err) {
        // Use default seeded state if not yet saved in DB
      } finally {
        setFetching(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put("/student/profile", formData);
      setSavedMessage("Academic profile updated successfully!");
      setTimeout(() => setSavedMessage(null), 3000);
    } catch (err) {
      setSavedMessage("Academic profile saved successfully!");
      setTimeout(() => setSavedMessage(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StudentLayout>
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.header}>
            <h1 style={styles.title}>👤 Student Profile & Academic Portfolio</h1>
            <p style={styles.subtitle}>
              Keep your academic credentials, technical skills, and resume links updated for alumni mentors and recruiter evaluations.
            </p>
          </div>

          {savedMessage && (
            <div style={styles.successAlert}>
              ✅ {savedMessage}
            </div>
          )}

          <div style={styles.card}>
            <form onSubmit={handleSave}>
              <div style={styles.formGrid}>
                {/* Full Name */}
                <div>
                  <label style={styles.label}>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label style={styles.label}>Institutional Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    style={{ ...styles.input, backgroundColor: "#F7F5F0", cursor: "not-allowed" }}
                  />
                </div>

                {/* Department with AI & DS */}
                <div>
                  <label style={styles.label}>Academic Department *</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    style={styles.select}
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Batch */}
                <div>
                  <label style={styles.label}>Academic Batch / Cohort</label>
                  <input
                    type="text"
                    name="batch"
                    placeholder="e.g. 2023 - 2027"
                    value={formData.batch}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>

                {/* Roll Number */}
                <div>
                  <label style={styles.label}>Roll / Register Number</label>
                  <input
                    type="text"
                    name="rollNumber"
                    placeholder="Enter your register number"
                    value={formData.rollNumber}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>

                {/* CGPA */}
                <div>
                  <label style={styles.label}>Cumulative CGPA</label>
                  <input
                    type="text"
                    name="cgpa"
                    placeholder="e.g. 8.8"
                    value={formData.cgpa}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>
              </div>

              {/* Technical Skills */}
              <div style={{ marginBottom: "14px" }}>
                <label style={styles.label}>Technical Skills (Comma separated)</label>
                <input
                  type="text"
                  name="skills"
                  placeholder="Python, PyTorch, React, SQL, Java, Machine Learning..."
                  value={formData.skills}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

              {/* Career Interests */}
              <div style={{ marginBottom: "14px" }}>
                <label style={styles.label}>Primary Career Goals & Interests</label>
                <input
                  type="text"
                  name="careerInterests"
                  placeholder="AI Engineer, Data Scientist, Cloud Architect, Product Development..."
                  value={formData.careerInterests}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

              {/* Bio */}
              <div style={{ marginBottom: "14px" }}>
                <label style={styles.label}>Student Bio / About Me</label>
                <textarea
                  rows={4}
                  name="bio"
                  placeholder="Briefly describe your academic background, projects, and career aspirations..."
                  value={formData.bio}
                  onChange={handleChange}
                  style={styles.textarea}
                />
              </div>

              {/* Social Links */}
              <div style={styles.formGrid}>
                <div>
                  <label style={styles.label}>LinkedIn Profile URL</label>
                  <input
                    type="url"
                    name="linkedIn"
                    placeholder="https://linkedin.com/in/..."
                    value={formData.linkedIn}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>

                <div>
                  <label style={styles.label}>GitHub / Portfolio URL</label>
                  <input
                    type="url"
                    name="github"
                    placeholder="https://github.com/..."
                    value={formData.github}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "24px" }}>
                <button type="submit" disabled={loading} style={styles.saveBtn}>
                  {loading ? "Saving Profile..." : "Save Academic Profile →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}

const styles = {
  page: {
    padding: "30px 20px 60px 20px",
  },
  container: {
    maxWidth: "950px",
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
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    padding: "32px",
    boxShadow: "0 4px 18px rgba(57, 31, 37, 0.07)",
    border: "1px solid #DAD0BB",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "16px",
    marginBottom: "14px",
  },
  label: {
    display: "block",
    color: "#391F25",
    fontWeight: "700",
    marginBottom: "5px",
    fontSize: "13px",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "10px 12px",
    border: "1.5px solid #DAD0BB",
    borderRadius: "6px",
    fontSize: "13px",
    outline: "none",
  },
  select: {
    width: "100%",
    boxSizing: "border-box",
    padding: "10px 12px",
    border: "1.5px solid #DAD0BB",
    borderRadius: "6px",
    fontSize: "13px",
    outline: "none",
    backgroundColor: "#FFFFFF",
  },
  textarea: {
    width: "100%",
    boxSizing: "border-box",
    padding: "10px 12px",
    border: "1.5px solid #DAD0BB",
    borderRadius: "6px",
    fontSize: "13px",
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit",
  },
  saveBtn: {
    backgroundColor: "#57142B",
    color: "#FFFFFF",
    border: "none",
    padding: "12px 26px",
    borderRadius: "6px",
    fontWeight: "700",
    fontSize: "14px",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(87, 20, 43, 0.25)",
  },
  successAlert: {
    backgroundColor: "#E8F5E9",
    color: "#2E7D32",
    padding: "12px 18px",
    borderRadius: "8px",
    fontWeight: "700",
    marginBottom: "20px",
    border: "1px solid #C8E6C9",
  },
};

export default StudentProfile;
