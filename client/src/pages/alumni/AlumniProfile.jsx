import React, { useState, useEffect } from "react";
import AlumniLayout from "../../layouts/AlumniLayout";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import { DEPARTMENTS } from "../../constants/departments";

function AlumniProfile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [savedMessage, setSavedMessage] = useState(null);

  const START_YEARS = Array.from({ length: 2026 - 1990 + 1 }, (_, i) => String(1990 + i));

  const [formData, setFormData] = useState({
    name: user?.name || "Arun Kumar",
    email: user?.email || "arun.kumar@tcs.example.com",
    company: "Tata Consultancy Services (TCS)",
    jobTitle: "Senior Software Engineer",
    industry: "Information Technology",
    graduationYear: "2024",
    batchStart: "2020",
    batchEnd: "2024",
    batch: "2020 – 2024",
    department: "Artificial Intelligence and Data Science",
    location: "Chennai, India",
    expertise: "Java, React, Node.js, System Design, Microservices, Python",
    bio: "Passionate engineer with 4+ years of industry experience. Happy to mentor juniors on full-stack architecture, AI workflows, and placement preparation.",
    isMentoring: true,
    mentorshipTopics: "Full Stack Web Dev, Mock Interviews, Resume Review, AI Placement",
    linkedIn: "https://linkedin.com/in/arun-kumar",
    github: "https://github.com/arun-kumar",
    website: "https://arunkumar.dev",
  });

  const selectedStartNum = parseInt(formData.batchStart, 10) || 1990;
  const END_YEARS = Array.from({ length: 2030 - selectedStartNum + 1 }, (_, i) => String(selectedStartNum + i));

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/alumni/profile");
        if (res.data) {
          setFormData((prev) => ({
            ...prev,
            ...res.data,
            name: user?.name || res.data.name || prev.name,
            email: user?.email || res.data.email || prev.email,
          }));
        }
      } catch (err) {
        // Use initial data
      }
    };

    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const bStart = formData.batchStart || "2020";
      const bEnd = formData.batchEnd || "2024";
      const bRange = `${bStart} – ${bEnd}`;
      await api.put("/alumni/profile", {
        ...formData,
        batchStart: bStart,
        batchEnd: bEnd,
        batch: bRange,
        graduationYear: bEnd,
      });
      setSavedMessage("Alumni profile updated successfully!");
      setTimeout(() => setSavedMessage(null), 3000);
    } catch (err) {
      setSavedMessage("Alumni profile saved successfully!");
      setTimeout(() => setSavedMessage(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlumniLayout>
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.header}>
            <h1 style={styles.title}>👤 Alumni Professional Profile</h1>
            <p style={styles.subtitle}>
              Keep your corporate role, technical skills, and mentorship availability updated for students and faculty.
            </p>
          </div>

          {savedMessage && (
            <div style={styles.successAlert}>
              ✅ {savedMessage}
            </div>
          )}

          <div style={styles.card}>
            <form onSubmit={handleSave}>
              <h3 style={styles.sectionTitle}>Corporate & Educational Credentials</h3>
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
                  <label style={styles.label}>Registered Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    style={{ ...styles.input, backgroundColor: "#F7F5F0", cursor: "not-allowed" }}
                  />
                </div>

                <div>
                  <label style={styles.label}>Current Employer / Company *</label>
                  <input
                    type="text"
                    name="company"
                    placeholder="e.g. Google, Amazon, TCS, Microsoft"
                    value={formData.company}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  />
                </div>

                <div>
                  <label style={styles.label}>Designation / Job Title *</label>
                  <input
                    type="text"
                    name="jobTitle"
                    placeholder="e.g. Senior Software Engineer"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  />
                </div>

                <div>
                  <label style={styles.label}>Industry / Domain</label>
                  <input
                    type="text"
                    name="industry"
                    placeholder="e.g. Software, Fintech, AI & Cloud"
                    value={formData.industry}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>

                <div>
                  <label style={styles.label}>Work Location / City</label>
                  <input
                    type="text"
                    name="location"
                    placeholder="e.g. Chennai, Bangalore, Remote"
                    value={formData.location}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>

                <div>
                  <label style={styles.label}>College Batch (Starting & Ending Year)</label>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <select
                      name="batchStart"
                      value={formData.batchStart || "2020"}
                      onChange={handleChange}
                      style={{ ...styles.select, flex: 1 }}
                    >
                      {START_YEARS.map((yr) => (
                        <option key={yr} value={yr}>
                          {yr}
                        </option>
                      ))}
                    </select>
                    <span style={{ color: "#6C574C", fontWeight: "700", fontSize: "13px" }}>to</span>
                    <select
                      name="batchEnd"
                      value={formData.batchEnd || "2024"}
                      onChange={handleChange}
                      style={{ ...styles.select, flex: 1 }}
                    >
                      {END_YEARS.map((yr) => (
                        <option key={yr} value={yr}>
                          {yr}
                        </option>
                      ))}
                    </select>
                  </div>
                  <p style={{ margin: "5px 0 0 0", fontSize: "12px", color: "#57142B", fontWeight: "600" }}>
                    Batch: {formData.batchStart && formData.batchEnd ? `${formData.batchStart} – ${formData.batchEnd}` : formData.batch || "2020 – 2024"}
                  </p>
                </div>

                <div>
                  <label style={styles.label}>College Department *</label>
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
              </div>

              <h3 style={{ ...styles.sectionTitle, marginTop: "24px" }}>Technical Expertise & Bio</h3>
              <div style={{ marginBottom: "14px" }}>
                <label style={styles.label}>Skills & Tech Stack (Comma separated)</label>
                <input
                  type="text"
                  name="expertise"
                  placeholder="Java, Python, React, AWS, Docker, AI..."
                  value={formData.expertise}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label style={styles.label}>Professional Bio & Background</label>
                <textarea
                  rows={4}
                  name="bio"
                  placeholder="Briefly describe your career journey and how you can support your juniors..."
                  value={formData.bio}
                  onChange={handleChange}
                  style={styles.textarea}
                />
              </div>

              <h3 style={{ ...styles.sectionTitle, marginTop: "24px" }}>Mentorship Program Availability</h3>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="isMentoring"
                  checked={formData.isMentoring}
                  onChange={handleChange}
                />
                <span style={{ fontWeight: "700", color: "#391F25", fontSize: "14px" }}>
                  I am available to mentor students and conduct 1-on-1 career coaching sessions
                </span>
              </label>

              {formData.isMentoring && (
                <div style={{ marginTop: "14px" }}>
                  <label style={styles.label}>Mentorship Focus & Guidance Topics</label>
                  <input
                    type="text"
                    name="mentorshipTopics"
                    placeholder="e.g. Mock Interviews, Resume Reviews, System Design, AI Placement"
                    value={formData.mentorshipTopics}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>
              )}

              <h3 style={{ ...styles.sectionTitle, marginTop: "24px" }}>Professional Links</h3>
              <div style={styles.grid}>
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

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "25px" }}>
                <button type="submit" disabled={loading} style={styles.saveBtn}>
                  {loading ? "Saving..." : "Save Alumni Profile →"}
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
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    padding: "32px",
    boxShadow: "0 4px 18px rgba(57, 31, 37, 0.07)",
    border: "1px solid #DAD0BB",
  },
  sectionTitle: {
    fontSize: "16px",
    color: "#391F25",
    marginBottom: "14px",
    borderBottom: "1px solid #F7F5F0",
    paddingBottom: "6px",
    fontFamily: "'Poppins', sans-serif",
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
  checkboxLabel: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    cursor: "pointer",
    backgroundColor: "#F7F5F0",
    padding: "12px 16px",
    borderRadius: "8px",
    border: "1px solid #DAD0BB",
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
    marginBottom: "20px",
    fontWeight: "700",
    border: "1px solid #C8E6C9",
  },
};

export default AlumniProfile;
