import React, { useState } from "react";
import FacultyLayout from "../../layouts/FacultyLayout";
import { useAuth } from "../../context/AuthContext";
import { DEPARTMENTS } from "../../constants/departments";

function FacultyProfile() {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "Dr. S. Meenakshi",
    email: user?.email || "meenakshi.s@eec.srmrmp.edu.in",
    department: "Artificial Intelligence and Data Science",
    designation: "Associate Professor & Department Alumni Coordinator",
    employeeId: "FAC2021AIDS04",
    researchAreas: "Machine Learning, LLMs, Cloud Computing, Distributed Systems",
    officeHours: "Mon-Thu: 02:00 PM - 04:00 PM",
    bio: "Faculty member with 12+ years of teaching and research experience at Easwari Engineering College. Passionate about student mentorship and fostering industry-academia partnerships.",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <FacultyLayout>
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.header}>
            <h1 style={styles.title}>👤 Faculty Academic Profile</h1>
            <p style={styles.subtitle}>
              Manage your departmental designations, research areas, office consultation hours, and academic credentials.
            </p>
          </div>

          {saved && (
            <div style={styles.successAlert}>
              ✅ Faculty profile updated successfully!
            </div>
          )}

          <div style={styles.card}>
            <form onSubmit={handleSave}>
              <div style={styles.grid}>
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

                <div>
                  <label style={styles.label}>Department *</label>
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

                <div>
                  <label style={styles.label}>Designation / Role *</label>
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  />
                </div>

                <div>
                  <label style={styles.label}>Employee ID</label>
                  <input
                    type="text"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>

                <div>
                  <label style={styles.label}>Office Hours & Availability</label>
                  <input
                    type="text"
                    name="officeHours"
                    value={formData.officeHours}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label style={styles.label}>Research Areas & Technical Expertise (Comma separated)</label>
                <input
                  type="text"
                  name="researchAreas"
                  value={formData.researchAreas}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

              <div style={{ marginBottom: "18px" }}>
                <label style={styles.label}>Academic Bio & Background</label>
                <textarea
                  rows={4}
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  style={styles.textarea}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button type="submit" style={styles.submitBtn}>
                  Save Profile Changes →
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
    maxWidth: "900px",
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

export default FacultyProfile;
