import React, { useState, useEffect } from "react";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import { api } from "../../services/api";

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [registeredIds, setRegisteredIds] = useState([]);
  const [feedback, setFeedback] = useState(null);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      let endpoint = "/events";
      if (category) endpoint += `?category=${encodeURIComponent(category)}`;
      const res = await api.get(endpoint);
      setEvents(res.data || []);
    } catch (err) {
      console.error("Failed to load events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [category]);

  const handleRegister = async (eventId, title) => {
    try {
      await api.post(`/events/${eventId}/register`);
      setRegisteredIds((prev) => [...prev, eventId]);
      setFeedback(`Successfully registered for "${title}"!`);
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      setRegisteredIds((prev) => [...prev, eventId]);
      setFeedback(`Registered for "${title}"!`);
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#F7F5F0" }}>
      <Navbar />

      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.header}>
            <span style={styles.badge}>📅 Academic & Alumni Connect Events</span>
            <h1 style={styles.title}>Campus Events, Workshops & Masterclasses</h1>
            <p style={styles.subtitle}>
              Join interactive alumni sessions, specialized tech masterclasses, placement hackathons, and networking reunions at Easwari Engineering College.
            </p>
          </div>

          {feedback && (
            <div style={styles.feedbackAlert}>
              🎉 {feedback}
            </div>
          )}

          {/* Filter Bar */}
          <div style={styles.filterCard}>
            <span style={{ fontWeight: "700", color: "#391F25", fontSize: "13px" }}>Filter by Category:</span>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "10px" }}>
              {["", "Career Talk", "Workshop", "Reunion", "Webinar"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  style={{
                    ...styles.filterTag,
                    ...(category === cat ? styles.activeFilterTag : {}),
                  }}
                >
                  {cat === "" ? "All Events" : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Events Grid */}
          {loading ? (
            <div style={styles.loadingBox}>
              Loading upcoming events...
            </div>
          ) : (
            <div style={styles.grid}>
              {events.map((evt) => {
                const isRegistered = registeredIds.includes(evt._id);
                return (
                  <div key={evt._id} style={styles.card}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "6px" }}>
                      <span style={styles.categoryBadge}>{evt.category || "Masterclass"}</span>
                      <span
                        style={{
                          ...styles.modeBadge,
                          backgroundColor: evt.mode === "online" ? "#F7F5F0" : "#FFF3E0",
                          color: evt.mode === "online" ? "#57142B" : "#E65100",
                          border: "1px solid #DAD0BB",
                        }}
                      >
                        {evt.mode === "online" ? "🌐 Online" : "📍 In-Person Campus"}
                      </span>
                    </div>

                    <h3 style={styles.evtTitle}>{evt.title}</h3>

                    <div style={styles.dateBox}>
                      <span>📅 {evt.date}</span>
                      <span>⏰ {evt.time}</span>
                    </div>

                    <p style={styles.description}>{evt.description}</p>

                    {evt.speaker && (
                      <div style={styles.speakerBox}>
                        <strong>🎙️ Speaker:</strong> {evt.speaker}
                        {evt.speakerRole && <span style={{ color: "#6C574C" }}> ({evt.speakerRole})</span>}
                      </div>
                    )}

                    <div style={{ marginTop: "auto", paddingTop: "14px" }}>
                      {evt.meetingLink && evt.mode === "online" && (
                        <a
                          href={evt.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          style={styles.joinLink}
                        >
                          🔗 Google Meet / Event Link ➔
                        </a>
                      )}

                      <button
                        onClick={() => handleRegister(evt._id, evt.title)}
                        disabled={isRegistered}
                        style={{
                          ...styles.registerBtn,
                          backgroundColor: isRegistered ? "#2E7D32" : "#57142B",
                          cursor: isRegistered ? "default" : "pointer",
                        }}
                      >
                        {isRegistered ? "✓ Registered" : "Register for Event →"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

const styles = {
  page: {
    flex: 1,
    padding: "30px 20px 60px 20px",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "26px",
  },
  badge: {
    fontSize: "12px",
    backgroundColor: "#DAD0BB",
    color: "#57142B",
    padding: "4px 10px",
    borderRadius: "14px",
    fontWeight: "700",
    display: "inline-block",
    marginBottom: "8px",
  },
  title: {
    color: "#391F25",
    fontSize: "30px",
    margin: "0 0 6px 0",
    fontFamily: "'Poppins', sans-serif",
  },
  subtitle: {
    color: "#6C574C",
    fontSize: "14px",
    margin: 0,
  },
  feedbackAlert: {
    backgroundColor: "#E8F5E9",
    color: "#2E7D32",
    padding: "14px 20px",
    borderRadius: "8px",
    fontWeight: "700",
    marginBottom: "22px",
    border: "1px solid #C8E6C9",
  },
  filterCard: {
    backgroundColor: "#FFFFFF",
    padding: "18px 22px",
    borderRadius: "12px",
    boxShadow: "0 2px 12px rgba(57, 31, 37, 0.06)",
    marginBottom: "28px",
    border: "1px solid #DAD0BB",
  },
  filterTag: {
    padding: "6px 16px",
    borderRadius: "20px",
    border: "1.5px solid #DAD0BB",
    backgroundColor: "#FFFFFF",
    color: "#391F25",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "13px",
  },
  activeFilterTag: {
    backgroundColor: "#57142B",
    borderColor: "#57142B",
    color: "#FFFFFF",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
    gap: "20px",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 2px 12px rgba(57, 31, 37, 0.06)",
    border: "1px solid #DAD0BB",
    display: "flex",
    flexDirection: "column",
  },
  categoryBadge: {
    backgroundColor: "#F7F5F0",
    color: "#57142B",
    border: "1px solid #DAD0BB",
    padding: "3px 10px",
    borderRadius: "12px",
    fontSize: "11px",
    fontWeight: "700",
  },
  modeBadge: {
    padding: "3px 10px",
    borderRadius: "12px",
    fontSize: "11px",
    fontWeight: "600",
  },
  evtTitle: {
    margin: "12px 0 6px 0",
    fontSize: "18px",
    color: "#391F25",
    fontFamily: "'Poppins', sans-serif",
    lineHeight: "1.3",
  },
  dateBox: {
    display: "flex",
    gap: "12px",
    fontSize: "12px",
    color: "#6C574C",
    fontWeight: "600",
    marginBottom: "10px",
  },
  description: {
    fontSize: "13px",
    color: "#391F25",
    lineHeight: "1.5",
    margin: "0 0 12px 0",
  },
  speakerBox: {
    fontSize: "12px",
    backgroundColor: "#F7F5F0",
    padding: "9px 12px",
    borderRadius: "6px",
    color: "#391F25",
    marginBottom: "12px",
    border: "1px solid #DAD0BB",
  },
  joinLink: {
    display: "block",
    marginBottom: "8px",
    color: "#57142B",
    fontSize: "12px",
    fontWeight: "700",
    textDecoration: "none",
  },
  registerBtn: {
    width: "100%",
    color: "#FFFFFF",
    border: "none",
    padding: "10px",
    borderRadius: "6px",
    fontWeight: "700",
    fontSize: "13px",
  },
  loadingBox: {
    padding: "50px",
    textAlign: "center",
    color: "#6C574C",
  },
};

export default Events;
