import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AlumniLayout from "../../layouts/AlumniLayout";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";

function PostInternship() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isApproved =
    user?.verificationStatus === "approved" ||
    (user?.isVerified && user?.verificationStatus !== "rejected");

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "Remote / Virtual",
    duration: "3 Months",
    stipend: "₹15,000 / Month",
    internshipType: "Virtual",
    description: "",
    requirements: "Enrolled in B.E/B.Tech in CSE, AI & DS, IT or related disciplines (2nd, 3rd, or 4th Year)\nFoundational knowledge in modern tech stack\nGood problem solving and analytical thinking",
    skills: "Python, React, Machine Learning, SQL, Git",
    applicationLink: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isApproved) {
      setError("Your alumni account must be approved by faculty before posting internships.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      await api.post("/internships", formData);
      navigate("/alumni/internships");
    } catch (err) {
      setError(err.message || "Failed to post internship.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlumniLayout>
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.header}>
            <h1 style={styles.title}>🚀 Post an Internship Listing</h1>
            <p style={styles.subtitle}>
              Offer summer, winter, or semester internships to train and recruit ambitious Easwari Engineering College juniors.
            </p>
          </div>

          {!isApproved && (
            <div style={styles.warningCard}>
              <span style={{ fontSize: "28px" }}>🔒</span>
              <div>
                <h3 style={{ margin: "0 0 4px 0", color: "#391F25", fontSize: "16px" }}>
                  Verification Required to Post Opportunities
                </h3>
                <p style={{ margin: 0, color: "#6C574C", fontSize: "13px", lineHeight: "1.4" }}>
                  Your alumni account is pending faculty verification. Once approved by department faculty coordinators, you can post internship openings.
                </p>
              </div>
            </div>
          )}

          {error && <div style={styles.errorAlert}>⚠️ {error}</div>}

          <div style={styles.card}>
            <form onSubmit={handleSubmit}>
              <div style={styles.grid}>
                <div>
                  <label style={styles.label}>Internship Title *</label>
                  <input
                    type="text"
                    name="title"
                    placeholder="e.g. AI Research Intern, Full Stack React Intern"
                    value={formData.title}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  />
                </div>

                <div>
                  <label style={styles.label}>Company Name *</label>
                  <input
                    type="text"
                    name="company"
                    placeholder="e.g. TechNova Solutions, Studio Craft"
                    value={formData.company}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  />
                </div>

                <div>
                  <label style={styles.label}>Internship Duration</label>
                  <input
                    type="text"
                    name="duration"
                    placeholder="e.g. 3 Months, 6 Months"
                    value={formData.duration}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>

                <div>
                  <label style={styles.label}>Monthly Stipend Amount</label>
                  <input
                    type="text"
                    name="stipend"
                    placeholder="e.g. ₹15,000 / Month"
                    value={formData.stipend}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>

                <div>
                  <label style={styles.label}>Internship Mode</label>
                  <select
                    name="internshipType"
                    value={formData.internshipType}
                    onChange={handleChange}
                    style={styles.select}
                  >
                    <option value="Virtual">Virtual / Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site Campus</option>
                  </select>
                </div>

                <div>
                  <label style={styles.label}>Work Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label style={styles.label}>Key Technical Skills (Comma separated)</label>
                <input
                  type="text"
                  name="skills"
                  placeholder="Python, PyTorch, React, Node.js, SQL, Git..."
                  value={formData.skills}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label style={styles.label}>Internship Description & Learning Goals *</label>
                <textarea
                  rows={4}
                  name="description"
                  placeholder="Detail project assignments, mentoring support, and skills developed during the internship..."
                  value={formData.description}
                  onChange={handleChange}
                  style={styles.textarea}
                  required
                />
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label style={styles.label}>Requirements & Eligibility</label>
                <textarea
                  rows={3}
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  style={styles.textarea}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "20px" }}>
                <button
                  type="button"
                  onClick={() => navigate("/alumni/dashboard")}
                  style={styles.cancelBtn}
                >
                  Cancel
                </button>
                <button type="submit" disabled={loading} style={styles.submitBtn}>
                  {loading ? "Publishing..." : "Publish Internship →"}
                </button>
              </div>
            </form>
          </div>
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
  warningCard: {
    backgroundColor: "#FFF8E1",
    border: "1.5px solid #FFE082",
    borderRadius: "10px",
    padding: "16px 20px",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    marginBottom: "20px",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    padding: "32px",
    boxShadow: "0 4px 18px rgba(57, 31, 37, 0.07)",
    border: "1px solid #DAD0BB",
  },
  grid: {
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
  cancelBtn: {
    backgroundColor: "#F7F5F0",
    color: "#391F25",
    border: "1px solid #DAD0BB",
    padding: "11px 20px",
    borderRadius: "6px",
    fontWeight: "700",
    fontSize: "13px",
    cursor: "pointer",
  },
  submitBtn: {
    backgroundColor: "#57142B",
    color: "#FFFFFF",
    border: "none",
    padding: "11px 24px",
    borderRadius: "6px",
    fontWeight: "700",
    fontSize: "13px",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(87, 20, 43, 0.25)",
  },
  errorAlert: {
    backgroundColor: "#FFEBEE",
    color: "#C62828",
    padding: "12px 16px",
    borderRadius: "6px",
    marginBottom: "18px",
    fontSize: "13px",
    border: "1px solid #FFCDD2",
  },
};

export default PostInternship;
