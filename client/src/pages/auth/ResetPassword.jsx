import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import api from "../../services/api";

function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Live password checklist validation
  const hasMinLength = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);
  const isPasswordValid = hasMinLength && hasLetter && hasNumber && hasSpecial;
  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError("Password reset token is missing from the URL.");
      return;
    }

    if (!isPasswordValid) {
      setError("Please ensure your new password satisfies all security requirements.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await api.post(`/auth/reset-password/${token}`, { password });
      setSuccess(true);
    } catch (err) {
      setError(
        err.message || "Failed to reset password. The link may have expired or is invalid."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: "#F7F5F0", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.icon}>🔑</div>

          <h1 style={styles.title}>Set New Password</h1>

          <p style={styles.subtitle}>
            Enter and confirm your new password for your Easwari Engineering College portal account.
          </p>

          {error && (
            <div style={styles.errorBox}>
              ⚠️ {error}
            </div>
          )}

          {success ? (
            <div>
              <div style={styles.successBox}>
                ✅ <strong>Password reset successfully!</strong> You can now log in with your new credentials.
              </div>
              <Link to="/login" style={styles.primaryBtnLink}>
                Proceed to Login →
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* New Password */}
              <div style={{ marginBottom: "16px" }}>
                <label style={styles.label}>New Password</label>
                <div style={styles.passwordWrapper}>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.input}
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={styles.eyeBtn}
                    tabIndex="-1"
                  >
                    {showPassword ? "🙈 Hide" : "👁️ Show"}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div style={{ marginBottom: "16px" }}>
                <label style={styles.label}>Confirm New Password</label>
                <div style={styles.passwordWrapper}>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={styles.input}
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeBtn}
                    tabIndex="-1"
                  >
                    {showConfirmPassword ? "🙈 Hide" : "👁️ Show"}
                  </button>
                </div>
                {confirmPassword && !passwordsMatch && (
                  <div style={{ color: "#C62828", fontSize: "11.5px", marginTop: "4px" }}>
                    ❌ Passwords do not match
                  </div>
                )}
              </div>

              {/* Password Requirements Checklist */}
              <div style={styles.checklist}>
                <div style={styles.checklistTitle}>Password Requirements:</div>
                <div style={{ ...styles.checkItem, color: hasMinLength ? "#2E7D32" : "#8D7B70" }}>
                  {hasMinLength ? "✓" : "○"} Minimum 8 characters
                </div>
                <div style={{ ...styles.checkItem, color: hasLetter ? "#2E7D32" : "#8D7B70" }}>
                  {hasLetter ? "✓" : "○"} At least 1 letter (a-z, A-Z)
                </div>
                <div style={{ ...styles.checkItem, color: hasNumber ? "#2E7D32" : "#8D7B70" }}>
                  {hasNumber ? "✓" : "○"} At least 1 number (0-9)
                </div>
                <div style={{ ...styles.checkItem, color: hasSpecial ? "#2E7D32" : "#8D7B70" }}>
                  {hasSpecial ? "✓" : "○"} At least 1 special character (!@#$%^&*)
                </div>
              </div>

              <button
                type="submit"
                style={styles.button}
                disabled={loading || !isPasswordValid || !passwordsMatch}
              >
                {loading ? "Updating Password..." : "Reset Password →"}
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
  passwordWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "11px 85px 11px 14px",
    border: "1.5px solid #DAD0BB",
    borderRadius: "6px",
    fontSize: "14px",
    outline: "none",
  },
  eyeBtn: {
    position: "absolute",
    right: "8px",
    background: "none",
    border: "none",
    color: "#57142B",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
    padding: "4px 8px",
  },
  checklist: {
    backgroundColor: "#F7F5F0",
    padding: "12px 14px",
    borderRadius: "6px",
    marginBottom: "18px",
    border: "1px solid #DAD0BB",
  },
  checklistTitle: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#391F25",
    marginBottom: "6px",
  },
  checkItem: {
    fontSize: "11.5px",
    lineHeight: "1.6",
    fontWeight: "500",
  },
  button: {
    width: "100%",
    padding: "12px",
    marginTop: "6px",
    backgroundColor: "#57142B",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(87, 20, 43, 0.25)",
  },
  primaryBtnLink: {
    display: "block",
    textAlign: "center",
    padding: "12px",
    backgroundColor: "#57142B",
    color: "#FFFFFF",
    textDecoration: "none",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "700",
    marginTop: "12px",
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

export default ResetPassword;
