import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AlumniLayout from "../../layouts/AlumniLayout";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";

function PostJob() {
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
    location: "Chennai / Hybrid",
    jobType: "Full-time",
    experienceLevel: "0-2 Years",
    salary: "₹6 - ₹9 LPA",
    description: "",
    requirements: "B.E/B.Tech in CSE, AI & DS, IT or related branches\nGood problem solving and coding skills\nFamiliarity with modern software development",
    skills: "Java, Python, React, SQL, Problem Solving",
    applicationLink: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isApproved) {
      setError("Your alumni account must be approved by faculty before posting jobs.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      await api.post("/jobs", formData);
      navigate("/alumni/jobs");
    } catch (err) {
      setError(err.message || "Failed to post job.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlumniLayout>
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.header}>
            <h1 style={styles.title}>💼 Post a Job Opening</h1>
            <p style={styles.subtitle}>
              Share campus referral and full-time opportunities from your employer directly with Easwari Engineering College students.
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
                  Your alumni account is pending faculty verification. Once approved by department faculty coordinators, you can post full-time and referral jobs.
                </p>
              </div>
            </div>
          )}

          {error && <div style={styles.errorAlert}>⚠️ {error}</div>}

          <div style={styles.card}>
            <form onSubmit={handleSubmit}>
              <div style={styles.grid}>
                <div>
                  <label style={styles.label}>Job Role Title *</label>
                  <input
                    type="text"
                    name="title"
                    placeholder="e.g. Associate Software Engineer, AI Developer"
                    value={formData.title}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  />
                </div>

                <div>
                  <label style={styles.label}>Hiring Company *</label>
                  <input
                    type="text"
                    name="company"
                    placeholder="e.g. Zoho, TCS, Microsoft, Amazon"
                    value={formData.company}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  />
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

                <div>
                  <label style={styles.label}>Employment Type</label>
                  <select
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleChange}
                    style={styles.select}
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>

                <div>
                  <label style={styles.label}>Salary / CTC Compensation</label>
                  <input
                    type="text"
                    name="salary"
                    placeholder="e.g. ₹6.5 - ₹10 LPA"
                    value={formData.salary}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>

                <div>
                  <label style={styles.label}>Experience Level</label>
                  <input
                    type="text"
                    name="experienceLevel"
                    placeholder="e.g. Freshers / 0-2 Years"
                    value={formData.experienceLevel}
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
                  placeholder="Python, Java, React, SQL, Cloud..."
                  value={formData.skills}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label style={styles.label}>Job Description & Responsibilities *</label>
                <textarea
                  rows={4}
                  name="description"
                  placeholder="Outline core responsibilities, team function, and daily workflows..."
                  value={formData.description}
                  onChange={handleChange}
                  style={styles.textarea}
                  required
                />
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label style={styles.label}>Eligibility Criteria & Requirements</label>
                <textarea
                  rows={3}
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  style={styles.textarea}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={styles.label}>External Application URL (Optional)</label>
                <input
                  type="url"
                  name="applicationLink"
                  placeholder="https://careers.company.com/..."
                  value={formData.applicationLink}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                <button
                  type="button"
                  onClick={() => navigate("/alumni/dashboard")}
                  style={styles.cancelBtn}
                >
                  Cancel
                </button>
                <button type="submit" disabled={loading} style={styles.submitBtn}>
                  {loading ? "Publishing Job..." : "Publish Job Opening →"}
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

export default PostJob;
