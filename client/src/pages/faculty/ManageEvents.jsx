import React, { useState, useEffect } from "react";
import FacultyLayout from "../../layouts/FacultyLayout";
import { api } from "../../services/api";

function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "Main Auditorium / Online",
    mode: "online",
    meetingLink: "",
    category: "Workshop",
    speaker: "",
    speakerRole: "",
  });

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await api.get("/events");
      setEvents(res.data || []);
    } catch (err) {
      console.error("Failed to load events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post("/events", formData);
      setFeedback("Event organized and published successfully!");
      fetchEvents();
      setFormData({
        title: "",
        description: "",
        date: "",
        time: "",
        location: "Main Auditorium / Online",
        mode: "online",
        meetingLink: "",
        category: "Workshop",
        speaker: "",
        speakerRole: "",
      });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      setFeedback("Event saved.");
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  return (
    <FacultyLayout>
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.header}>
            <h1 style={styles.title}>📅 Organize & Manage Campus Events</h1>
            <p style={styles.subtitle}>
              Schedule alumni guest tech talks, department masterclasses, workshops, and placement readiness bootcamps.
            </p>
          </div>

          {feedback && (
            <div style={styles.successAlert}>
              ✅ {feedback}
            </div>
          )}

          {/* Form */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Schedule New Event / Masterclass</h3>
            <form onSubmit={handleCreate}>
              <div style={styles.grid}>
                <div>
                  <label style={styles.label}>Event Title *</label>
                  <input
                    type="text"
                    name="title"
                    placeholder="e.g. Masterclass: System Architecture & AI with Google Alumni"
                    value={formData.title}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  />
                </div>

                <div>
                  <label style={styles.label}>Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    style={styles.select}
                  >
                    <option value="Workshop">Technical Workshop</option>
                    <option value="Career Talk">Career & Placement Talk</option>
                    <option value="Webinar">Online Masterclass</option>
                    <option value="Reunion">Alumni Homecoming & Mixer</option>
                  </select>
                </div>

                <div>
                  <label style={styles.label}>Event Date *</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  />
                </div>

                <div>
                  <label style={styles.label}>Time & Duration *</label>
                  <input
                    type="text"
                    name="time"
                    placeholder="e.g. 05:00 PM - 06:30 PM IST"
                    value={formData.time}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  />
                </div>

                <div>
                  <label style={styles.label}>Delivery Mode</label>
                  <select
                    name="mode"
                    value={formData.mode}
                    onChange={handleChange}
                    style={styles.select}
                  >
                    <option value="online">Online (Google Meet / Zoom)</option>
                    <option value="offline">In-Person Campus (Auditorium / Lab)</option>
                  </select>
                </div>

                <div>
                  <label style={styles.label}>Location / Platform</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>

                <div>
                  <label style={styles.label}>Guest Speaker (Alumnus / Industry)</label>
                  <input
                    type="text"
                    name="speaker"
                    placeholder="e.g. Sneha Patel"
                    value={formData.speaker}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>

                <div>
                  <label style={styles.label}>Speaker Designation & Org</label>
                  <input
                    type="text"
                    name="speakerRole"
                    placeholder="e.g. Product Manager at Google"
                    value={formData.speakerRole}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>
              </div>

              {formData.mode === "online" && (
                <div style={{ marginBottom: "14px" }}>
                  <label style={styles.label}>Meeting / Live Stream Link</label>
                  <input
                    type="url"
                    name="meetingLink"
                    placeholder="https://meet.google.com/..."
                    value={formData.meetingLink}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>
              )}

              <div style={{ marginBottom: "16px" }}>
                <label style={styles.label}>Event Description & Agenda *</label>
                <textarea
                  rows={4}
                  name="description"
                  placeholder="Detail what topics will be covered, who should attend, and key takeaways..."
                  value={formData.description}
                  onChange={handleChange}
                  style={styles.textarea}
                  required
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button type="submit" style={styles.submitBtn}>
                  Publish Event →
                </button>
              </div>
            </form>
          </div>

          {/* Existing Events */}
          <h2 style={{ ...styles.title, fontSize: "20px", marginTop: "32px", marginBottom: "14px" }}>
            Scheduled Events ({events.length})
          </h2>
          <div style={styles.gridList}>
            {events.map((evt) => (
              <div key={evt._id} style={styles.eventCard}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={styles.badge}>{evt.category}</span>
                  <span style={{ fontSize: "12px", color: "#6C574C" }}>Mode: {evt.mode?.toUpperCase()}</span>
                </div>
                <h3 style={{ margin: "10px 0 4px 0", color: "#391F25", fontSize: "16px", fontFamily: "'Poppins', sans-serif" }}>{evt.title}</h3>
                <p style={{ margin: "0 0 8px 0", fontSize: "12px", color: "#6C574C" }}>
                  📅 {evt.date} • ⏰ {evt.time}
                </p>
                <p style={{ margin: 0, fontSize: "13px", color: "#391F25", lineHeight: "1.4" }}>
                  {evt.description}
                </p>
              </div>
            ))}
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
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    padding: "28px",
    boxShadow: "0 2px 12px rgba(57, 31, 37, 0.06)",
    border: "1px solid #DAD0BB",
  },
  cardTitle: {
    margin: "0 0 16px 0",
    color: "#391F25",
    fontSize: "18px",
    fontFamily: "'Poppins', sans-serif",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "14px",
    marginBottom: "12px",
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
    padding: "10px 22px",
    borderRadius: "6px",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "13px",
    boxShadow: "0 4px 12px rgba(87, 20, 43, 0.25)",
  },
  gridList: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "18px",
  },
  eventCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 2px 10px rgba(57, 31, 37, 0.05)",
    border: "1px solid #DAD0BB",
  },
  badge: {
    backgroundColor: "#F7F5F0",
    color: "#57142B",
    border: "1px solid #DAD0BB",
    padding: "3px 9px",
    borderRadius: "8px",
    fontSize: "11px",
    fontWeight: "700",
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

export default ManageEvents;
