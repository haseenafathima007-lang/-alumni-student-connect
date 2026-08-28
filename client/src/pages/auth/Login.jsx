import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";

function Login() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password");
      return;
    }

    const res = await login(email.trim(), password);
    if (res.success) {
      const userRole = (res.user?.role || "Student").toLowerCase();
      if (userRole === "student") {
        navigate("/student/dashboard");
      } else if (userRole === "alumni") {
        navigate("/alumni/dashboard");
      } else if (userRole === "faculty") {
        navigate("/faculty/dashboard");
      } else if (userRole === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } else {
      setError(res.error || "Login failed. Please check your credentials.");
    }
  };

  return (
    <div style={{ backgroundColor: "#F7F5F0", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <div style={styles.page}>
        <div style={styles.container}>
          {/* Left Branding Panel */}
          <div style={styles.brandPanel}>
            <div style={styles.brandLogoWrap}>
              <img
                src="/assets/eec-logo.png"
                alt="Easwari Engineering College"
                style={styles.panelLogoImg}
              />
            </div>
            <div style={styles.emblemWrap}>
              <img
                src="/assets/eec-emblem.png"
                alt="College Seal"
                style={styles.panelEmblemImg}
              />
            </div>
            <h2 style={styles.panelTitle}>Alumni Student Connect</h2>
            <p style={styles.panelSubtitle}>
              Official portal for Students, Alumni, and Faculty of Easwari Engineering College, Ramapuram, Chennai.
            </p>
            <div style={styles.bulletList}>
              <div style={styles.bulletItem}>✓ Verified Alumni Mentorship</div>
              <div style={styles.bulletItem}>✓ Direct Campus & Corporate Job Referrals</div>
              <div style={styles.bulletItem}>✓ Real-time Messaging & Career Advice</div>
            </div>
          </div>

          {/* Right Form Card */}
          <div style={styles.formCard}>
            <div style={styles.formHeader}>
              <h2 style={styles.formTitle}>Member Sign In</h2>
              <p style={styles.formSub}>Enter your registered institutional credentials</p>
            </div>

            {error && (
              <div style={styles.errorAlert}>
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Password</label>
                <div style={styles.passwordWrap}>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.passwordInput}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={styles.showHideBtn}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div style={styles.forgotRow}>
                <Link to="/forgot-password" style={styles.forgotLink}>
                  Forgot Password?
                </Link>
              </div>

              <button type="submit" disabled={loading} style={styles.button}>
                {loading ? "Authenticating..." : "Sign In to Portal →"}
              </button>
            </form>

            <div style={styles.registerRow}>
              <p style={styles.registerText}>
                New to the network?{" "}
                <Link to="/register" style={styles.registerLink}>
                  Create an account
                </Link>
              </p>
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
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "50px 20px",
  },
  container: {
    width: "100%",
    maxWidth: "920px",
    backgroundColor: "#FFFFFF",
    borderRadius: "14px",
    boxShadow: "0 8px 30px rgba(57, 31, 37, 0.12)",
    display: "flex",
    overflow: "hidden",
    border: "1px solid #DAD0BB",
    flexWrap: "wrap",
  },
  brandPanel: {
    flex: "1 1 360px",
    backgroundColor: "#57142B",
    color: "#FFFFFF",
    padding: "40px 32px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  brandLogoWrap: {
    backgroundColor: "#FFFFFF",
    padding: "6px 12px",
    borderRadius: "6px",
    display: "inline-block",
    marginBottom: "20px",
    width: "fit-content",
  },
  panelLogoImg: {
    height: "36px",
    width: "auto",
    display: "block",
  },
  emblemWrap: {
    marginBottom: "16px",
  },
  panelEmblemImg: {
    height: "64px",
    width: "64px",
    backgroundColor: "#FFFFFF",
    borderRadius: "50%",
    padding: "4px",
  },
  panelTitle: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#FFFFFF",
    margin: "0 0 10px 0",
    fontFamily: "'Poppins', sans-serif",
  },
  panelSubtitle: {
    fontSize: "13px",
    color: "#DAD0BB",
    lineHeight: "1.6",
    margin: "0 0 20px 0",
  },
  bulletList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  bulletItem: {
    fontSize: "12px",
    color: "#C4A78D",
    fontWeight: "600",
  },
  formCard: {
    flex: "1 1 420px",
    padding: "40px 36px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  formHeader: {
    marginBottom: "22px",
  },
  formTitle: {
    color: "#391F25",
    margin: "0 0 6px 0",
    fontSize: "24px",
    fontFamily: "'Poppins', sans-serif",
  },
  formSub: {
    color: "#6C574C",
    fontSize: "13px",
    margin: 0,
  },
  errorAlert: {
    backgroundColor: "#FFEBEE",
    color: "#C62828",
    padding: "10px 14px",
    borderRadius: "6px",
    marginBottom: "18px",
    fontSize: "13px",
    border: "1px solid #FFCDD2",
  },
  formGroup: {
    marginBottom: "16px",
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
  passwordWrap: {
    display: "flex",
    alignItems: "center",
    position: "relative",
    width: "100%",
  },
  passwordInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: "11px 55px 11px 14px",
    border: "1.5px solid #DAD0BB",
    borderRadius: "6px",
    fontSize: "14px",
    outline: "none",
    color: "#391F25",
    backgroundColor: "#FFFFFF",
  },
  showHideBtn: {
    position: "absolute",
    right: "10px",
    background: "transparent",
    border: "none",
    color: "#57142B",
    fontWeight: "700",
    fontSize: "12px",
    cursor: "pointer",
    padding: "4px 6px",
  },
  forgotRow: {
    textAlign: "right",
    marginBottom: "20px",
  },
  forgotLink: {
    color: "#57142B",
    fontSize: "13px",
    fontWeight: "600",
    textDecoration: "none",
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#57142B",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "6px",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(87, 20, 43, 0.25)",
  },
  registerRow: {
    marginTop: "22px",
    textAlign: "center",
  },
  registerText: {
    color: "#6C574C",
    fontSize: "13px",
    margin: 0,
  },
  registerLink: {
    color: "#57142B",
    fontWeight: "700",
    textDecoration: "none",
  },
};

export default Login;
