import React, { useState } from "react";
import FacultyLayout from "../../layouts/FacultyLayout";
import { api } from "../../services/api";

function RecommendMentor() {
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    studentName: "",
    studentRoll: "",
    alumniMentor: "Arun Kumar (TCS - 2022 Batch)",
    guidanceArea: "Full-Stack System Design & Product Placement",
    facultyNotes: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/faculty/recommend-mentor", formData);
      setFeedback(`Recommendation submitted successfully for ${formData.studentName}!`);
      setTimeout(() => {
        setFeedback(null);
        setFormData({
          studentName: "",
          studentRoll: "",
          alumniMentor: "Arun Kumar (TCS - 2022 Batch)",
          guidanceArea: "Full-Stack System Design & Product Placement",
          facultyNotes: "",
        });
      }, 2500);
    } catch (err) {
      setFeedback(err.message || "Failed to submit recommendation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FacultyLayout>
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.header}>
            <h1 style={styles.title}>⭐ Recommend Alumni Mentors to Students</h1>
            <p style={styles.subtitle}>
              Connect high-potential students directly with distinguished Easwari alumni mentors who specialize in their career interests.
            </p>
          </div>

          {feedback && (
            <div style={styles.successAlert}>
              ✅ {feedback}
            </div>
          )}

          <div style={styles.card}>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "14px" }}>
                <label style={styles.label}>Student Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Divya Krishnan"
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  style={styles.input}
                  required
                />
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label style={styles.label}>Student Roll / Register Number *</label>
                <input
                  type="text"
                  placeholder="Enter student register number"
                  value={formData.studentRoll}
                  onChange={(e) => setFormData({ ...formData, studentRoll: e.target.value })}
                  style={styles.input}
                  required
                />
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label style={styles.label}>Select Distinguished Alumni Mentor *</label>
                <select
                  value={formData.alumniMentor}
                  onChange={(e) => setFormData({ ...formData, alumniMentor: e.target.value })}
                  style={styles.select}
                >
                  <option value="Arun Kumar (TCS - 2022 Batch)">Arun Kumar (Senior Software Engineer, TCS)</option>
                  <option value="Priya Sharma (Zoho - 2021 Batch)">Priya Sharma (Lead Data Analyst, Zoho)</option>
                  <option value="Rahul Raj (Infosys - 2020 Batch)">Rahul Raj (Cloud Solutions Architect, Infosys)</option>
                  <option value="Sneha Patel (Google - 2019 Batch)">Sneha Patel (Product Manager, Google)</option>
                </select>
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label style={styles.label}>Guidance Focus / Career Domain</label>
                <input
                  type="text"
                  value={formData.guidanceArea}
                  onChange={(e) => setFormData({ ...formData, guidanceArea: e.target.value })}
                  style={styles.input}
                />
              </div>

              <div style={{ marginBottom: "18px" }}>
                <label style={styles.label}>Faculty Endorsement & Recommendation Notes</label>
                <textarea
                  rows={4}
                  placeholder="Explain why this student would benefit from 1-on-1 mentoring with this alumnus..."
                  value={formData.facultyNotes}
                  onChange={(e) => setFormData({ ...formData, facultyNotes: e.target.value })}
                  style={styles.textarea}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button type="submit" disabled={loading} style={styles.submitBtn}>
                  {loading ? "Sending..." : "Submit Recommendation →"}
                </button>
              </div>
            </form>
          </div>
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
    maxWidth: "800px",
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
    padding: "30px",
    boxShadow: "0 4px 16px rgba(57, 31, 37, 0.07)",
    border: "1px solid #DAD0BB",
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
  submitBtn: {
    backgroundColor: "#57142B",
    color: "#FFFFFF",
    border: "none",
    padding: "11px 24px",
    borderRadius: "6px",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "14px",
    boxShadow: "0 4px 12px rgba(87, 20, 43, 0.25)",
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
};

export default RecommendMentor;
