import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import api from "../../services/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      setLoading(true);
      setError("");
      const res = await api.post("/auth/forgot-password", { email });
      setSuccessMessage(
        res.message || `A password reset link has been dispatched to ${email}. Please check your inbox and spam folder.`
      );
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Failed to process password reset request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: "#F7F5F0", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.icon}>🔐</div>

          <h1 style={styles.title}>Password Recovery</h1>

          <p style={styles.subtitle}>
            Enter your registered college or alumni email address to receive secure password reset instructions.
          </p>

          {error && (
            <div style={styles.errorBox}>
              ⚠️ {error}
            </div>
          )}

          {submitted ? (
            <div style={styles.successBox}>
              ✅ <strong>{successMessage}</strong>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <label style={styles.label}>Registered Email Address</label>
              <input
                type="email"
                placeholder="e.g. yourname@eec.srmrmp.edu.in or alumni@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                required
                disabled={loading}
              />

              <button type="submit" style={styles.button} disabled={loading}>
                {loading ? "Sending Instructions..." : "Send Reset Link →"}
              </button>
            </form>
          )}

          <Link to="/login" style={styles.back}>
            ← Back to Login
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}

const styles = {
  page: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px 20px",
  },
  card: {
    width: "100%",
    maxWidth: "460px",
    backgroundColor: "#FFFFFF",
    padding: "36px",
    borderRadius: "12px",
    boxShadow: "0 8px 30px rgba(57, 31, 37, 0.1)",
    border: "1px solid #DAD0BB",
  },
  icon: {
    textAlign: "center",
    fontSize: "40px",
    marginBottom: "8px",
  },
  title: {
    textAlign: "center",
    color: "#391F25",
    margin: "0 0 6px 0",
    fontSize: "24px",
    fontFamily: "'Poppins', sans-serif",
  },
  subtitle: {
    textAlign: "center",
    color: "#6C574C",
    lineHeight: "1.5",
    marginBottom: "22px",
    fontSize: "13px",
  },
  label: {
    display: "block",
    color: "#391F25",
    fontWeight: "600",
    marginBottom: "6px",
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
  button: {
    width: "100%",
    padding: "12px",
    marginTop: "18px",
    backgroundColor: "#57142B",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(87, 20, 43, 0.25)",
  },
  back: {
    display: "block",
    textAlign: "center",
    marginTop: "20px",
    color: "#57142B",
    textDecoration: "none",
    fontWeight: "700",
    fontSize: "13px",
  },
  successBox: {
    backgroundColor: "#E8F5E9",
    color: "#2E7D32",
    padding: "16px",
    borderRadius: "8px",
    fontSize: "13px",
    lineHeight: "1.5",
    marginBottom: "15px",
    border: "1px solid #C8E6C9",
  },
  errorBox: {
    backgroundColor: "#FFEBEE",
    color: "#C62828",
    padding: "14px",
    borderRadius: "8px",
    fontSize: "13px",
    lineHeight: "1.5",
    marginBottom: "15px",
    border: "1px solid #FFCDD2",
  },
};

export default ForgotPassword;
