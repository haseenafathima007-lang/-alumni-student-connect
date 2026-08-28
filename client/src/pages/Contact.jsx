import React, { useState } from "react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 3000);
  };

  return (
    <div style={{ backgroundColor: "#F7F5F0", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.header}>
            <span style={styles.badge}>📞 Help & Institutional Support</span>
            <h1 style={styles.title}>Contact EEC Alumni Relations Cell</h1>
            <p style={styles.subtitle}>
              Reach out for alumni verification assistance, mentorship coordination, campus recruitment partnership, or portal tech support.
            </p>
          </div>

          <div style={styles.grid}>
            {/* Contact Info */}
            <div style={styles.infoCard}>
              <h2 style={styles.cardHeading}>Placement & Alumni Affairs</h2>
              <p style={styles.desc}>
                Easwari Engineering College, Ramapuram, Chennai
              </p>

              <div style={styles.contactItem}>
                <div style={styles.icon}>📍</div>
                <div>
                  <h4 style={styles.itemTitle}>Campus Location</h4>
                  <p style={styles.itemText}>Easwari Engineering College, Bharathi Salai, Ramapuram, Chennai – 600089, Tamil Nadu, India.</p>
                </div>
              </div>

              <div style={styles.contactItem}>
                <div style={styles.icon}>📧</div>
                <div>
                  <h4 style={styles.itemTitle}>Official Email</h4>
                  <p style={styles.itemText}>alumni@eec.srmrmp.edu.in</p>
                </div>
              </div>

              <div style={styles.contactItem}>
                <div style={styles.icon}>📞</div>
                <div>
                  <h4 style={styles.itemTitle}>Direct Phone</h4>
                  <p style={styles.itemText}>+91 44 2249 1130 / 2249 0853</p>
                </div>
              </div>

              <div style={styles.contactItem}>
                <div style={styles.icon}>⏰</div>
                <div>
                  <h4 style={styles.itemTitle}>Working Hours</h4>
                  <p style={styles.itemText}>Monday – Friday: 08:30 AM – 04:30 PM IST</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div style={styles.formCard}>
              <h2 style={styles.cardHeading}>Send an Official Inquiry</h2>
              {submitted ? (
                <div style={styles.successBox}>
                  ✅ Thank you! Your inquiry has been submitted. The Alumni Relations Cell will respond within 24–48 hours.
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <label style={styles.label}>Your Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="e.g. Rohan Varma"
                    value={formData.name}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  />

                  <label style={styles.label}>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="e.g. rohan.v@student.edu"
                    value={formData.email}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  />

                  <label style={styles.label}>Subject / Department *</label>
                  <input
                    type="text"
                    name="subject"
                    placeholder="e.g. Alumni Verification / AI & Data Science Mentorship"
                    value={formData.subject}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  />

                  <label style={styles.label}>Detailed Message *</label>
                  <textarea
                    rows={4}
                    name="message"
                    placeholder="Type your inquiry or message here..."
                    value={formData.message}
                    onChange={handleChange}
                    style={styles.textarea}
                    required
                  />

                  <button type="submit" style={styles.submitBtn}>
                    Submit Inquiry →
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

const styles = {
  page: {
    padding: "50px 20px 70px 20px",
    flex: 1,
  },
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
  },
  header: {
    textAlign: "center",
    marginBottom: "40px",
  },
  badge: {
    backgroundColor: "#57142B",
    color: "#FFFFFF",
    padding: "5px 14px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
    display: "inline-block",
    marginBottom: "12px",
  },
  title: {
    color: "#391F25",
    fontSize: "34px",
    margin: "0 0 12px 0",
    fontFamily: "'Poppins', sans-serif",
  },
  subtitle: {
    color: "#6C574C",
    fontSize: "15px",
    maxWidth: "700px",
    margin: "0 auto",
    lineHeight: "1.6",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
    gap: "30px",
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    padding: "32px",
    boxShadow: "0 4px 16px rgba(57, 31, 37, 0.07)",
    border: "1px solid #DAD0BB",
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    padding: "32px",
    boxShadow: "0 4px 16px rgba(57, 31, 37, 0.07)",
    border: "1px solid #DAD0BB",
  },
  cardHeading: {
    color: "#391F25",
    fontSize: "20px",
    margin: "0 0 8px 0",
    fontFamily: "'Poppins', sans-serif",
  },
  desc: {
    color: "#6C574C",
    fontSize: "13px",
    margin: "0 0 24px 0",
  },
  contactItem: {
    display: "flex",
    gap: "14px",
    marginBottom: "18px",
  },
  icon: {
    fontSize: "22px",
    backgroundColor: "#F7F5F0",
    border: "1px solid #DAD0BB",
    width: "44px",
    height: "44px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  itemTitle: {
    margin: "0 0 2px 0",
    color: "#391F25",
    fontSize: "14px",
    fontWeight: "700",
  },
  itemText: {
    margin: 0,
    color: "#6C574C",
    fontSize: "13px",
    lineHeight: "1.4",
  },
  label: {
    display: "block",
    color: "#391F25",
    fontWeight: "600",
    marginBottom: "6px",
    marginTop: "12px",
    fontSize: "13px",
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
  textarea: {
    width: "100%",
    boxSizing: "border-box",
    padding: "11px 14px",
    border: "1.5px solid #DAD0BB",
    borderRadius: "6px",
    fontSize: "14px",
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit",
    marginBottom: "16px",
  },
  submitBtn: {
    width: "100%",
    backgroundColor: "#57142B",
    color: "#FFFFFF",
    padding: "12px",
    borderRadius: "6px",
    border: "none",
    fontWeight: "700",
    fontSize: "14px",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(87, 20, 43, 0.25)",
  },
  successBox: {
    backgroundColor: "#E8F5E9",
    color: "#2E7D32",
    padding: "18px",
    borderRadius: "8px",
    lineHeight: "1.6",
    fontWeight: "600",
    fontSize: "14px",
    border: "1px solid #C8E6C9",
  },
};

export default Contact;
