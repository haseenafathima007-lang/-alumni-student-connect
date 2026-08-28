import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import { DEPARTMENTS } from "../../constants/departments";

function Register() {
  const navigate = useNavigate();
  const { register, loading } = useAuth();

  const [role, setRole] = useState("Student");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "Artificial Intelligence and Data Science",
    rollNumber: "",
    batchStart: "2020",
    batchEnd: "2024",
    password: "",
    confirmPassword: "",
  });

  const START_YEARS = Array.from({ length: 2026 - 1990 + 1 }, (_, i) => String(1990 + i));
  const selectedStartNum = parseInt(formData.batchStart, 10) || 1990;
  const END_YEARS = Array.from({ length: 2030 - selectedStartNum + 1 }, (_, i) => String(selectedStartNum + i));

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError("");
  };

  const handleBatchStartChange = (e) => {
    const newStart = e.target.value;
    const startNum = parseInt(newStart, 10);
    let newEnd = formData.batchEnd;
    if (!newEnd || parseInt(newEnd, 10) < startNum) {
      newEnd = String(Math.min(startNum + 4, 2030));
    }
    setFormData({
      ...formData,
      batchStart: newStart,
      batchEnd: newEnd,
    });
    if (error) setError("");
  };

  // Password rules validation helper
  const pwd = formData.password;
  const isMinLength = pwd.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(pwd);
  const hasNumber = /[0-9]/.test(pwd);
  const hasSpecial = /[^a-zA-Z0-9]/.test(pwd);
  const isPasswordValid = isMinLength && hasLetter && hasNumber && hasSpecial;
  const isPasswordMatch = formData.confirmPassword.length > 0 && formData.password === formData.confirmPassword;

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!role) {
      setError("Please select your role");
      return;
    }

    if (!formData.name.trim() || !formData.email.trim() || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all required fields");
      return;
    }

    const trimmedEmail = formData.email.trim().toLowerCase();
    const collegeDomain = "@eec.srmrmp.edu.in";
    const alumniDomain = "@gmail.com";

    // Role-specific email validation
    if (role === "Student") {
      if (!trimmedEmail.endsWith(collegeDomain)) {
        setError("Please use your official college email ending with @eec.srmrmp.edu.in.");
        return;
      }
    } else if (role === "Faculty") {
      if (!trimmedEmail.endsWith(collegeDomain)) {
        setError("Please use your official college email ending with @eec.srmrmp.edu.in.");
        return;
      }
    } else if (role === "Alumni") {
      if (!trimmedEmail.endsWith(alumniDomain)) {
        setError("Please use a Gmail address ending with @gmail.com.");
        return;
      }
      if (!formData.batchStart || !formData.batchEnd) {
        setError("Please select your starting year and ending year for the batch.");
        return;
      }
      if (parseInt(formData.batchEnd, 10) < parseInt(formData.batchStart, 10)) {
        setError("Ending year cannot be earlier than starting year.");
        return;
      }
    }

    // Password validation
    if (!isPasswordValid) {
      setError(
        "Password must be at least 8 characters and contain at least 1 letter, 1 number, and 1 special character."
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const res = await register(
      formData.name.trim(),
      trimmedEmail,
      formData.password,
      role,
      formData.department,
      {
        batchStart: role === "Alumni" ? formData.batchStart : undefined,
        batchEnd: role === "Alumni" ? formData.batchEnd : undefined,
        rollNumber: role === "Student" ? formData.rollNumber : undefined,
      }
    );

    if (res.success) {
      if (role === "Student") {
        navigate("/student/dashboard");
      } else if (role === "Alumni") {
        navigate("/alumni/dashboard");
      } else if (role === "Faculty") {
        navigate("/faculty/dashboard");
      } else {
        navigate("/");
      }
    } else {
      setError(res.error || "Registration failed. Please try again.");
    }
  };

  // Helper text and placeholder getters
  const getEmailPlaceholder = () => {
    if (role === "Student") return "Enter your college email address";
    if (role === "Faculty") return "Enter your official college email address";
    if (role === "Alumni") return "Enter your Gmail address";
    return "Enter your email address";
  };

  const getEmailHelperText = () => {
    if (role === "Student") return "Use your official college email ending with @eec.srmrmp.edu.in";
    if (role === "Faculty") return "Use your official college email ending with @eec.srmrmp.edu.in";
    if (role === "Alumni") return "Use your personal Gmail address ending with @gmail.com";
    return "";
  };

  return (
    <div style={{ backgroundColor: "#F7F5F0", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.header}>
            <div style={styles.logoWrap}>
              <img
                src="/assets/eec-emblem.png"
                alt="Easwari Engineering College"
                style={styles.logoImg}
              />
            </div>
            <h1 style={styles.title}>Join Alumni Student Connect</h1>
            <p style={styles.subtitle}>
              Easwari Engineering College • Academic & Professional Network
            </p>
          </div>

          {error && (
            <div style={styles.errorAlert}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleRegister}>
            <label style={styles.label}>Select Your Institutional Role</label>
            <div style={styles.roles}>
              {["Student", "Alumni", "Faculty"].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setRole(r);
                    setError("");
                  }}
                  style={{
                    ...styles.roleButton,
                    ...(role === r ? styles.selectedRole : {}),
                  }}
                >
                  <span style={{ fontSize: "20px" }}>
                    {r === "Student" ? "🎓" : r === "Alumni" ? "💼" : "👩‍🏫"}
                  </span>
                  <span>{r}</span>
                </button>
              ))}
            </div>

            {/* Full Name */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>

            {/* Role-Specific Email Address */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder={getEmailPlaceholder()}
                value={formData.email}
                onChange={handleChange}
                style={styles.input}
                required
              />
              <p style={styles.emailHelper}>
                {getEmailHelperText()}
              </p>
            </div>

            {/* Academic Department */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Academic Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                style={styles.select}
                required
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Batch Selection (Only for Alumni) */}
            {role === "Alumni" && (
              <div style={styles.formGroup}>
                <label style={styles.label}>Batch *</label>
                <div style={styles.batchRow}>
                  <div style={{ flex: 1 }}>
                    <select
                      name="batchStart"
                      value={formData.batchStart}
                      onChange={handleBatchStartChange}
                      style={styles.select}
                      required
                    >
                      <option value="" disabled>Starting Year ▼</option>
                      {START_YEARS.map((yr) => (
                        <option key={yr} value={yr}>
                          {yr}
                        </option>
                      ))}
                    </select>
                  </div>

                  <span style={styles.batchToText}>to</span>

                  <div style={{ flex: 1 }}>
                    <select
                      name="batchEnd"
                      value={formData.batchEnd}
                      onChange={handleChange}
                      style={styles.select}
                      required
                    >
                      <option value="" disabled>Ending Year ▼</option>
                      {END_YEARS.map((yr) => (
                        <option key={yr} value={yr}>
                          {yr}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <p style={styles.emailHelper}>
                  Select your college batch range (e.g. 2020 to 2024)
                </p>
              </div>
            )}

            {/* Student Registration Number (Only for Students) */}
            {role === "Student" && (
              <div style={styles.formGroup}>
                <label style={styles.label}>Registration / Roll Number</label>
                <input
                  type="text"
                  name="rollNumber"
                  placeholder="Enter your registration number"
                  value={formData.rollNumber}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
            )}

            {/* Password & Confirm Password with Show/Hide Controls */}
            <div style={styles.grid2}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Password</label>
                <div style={styles.passwordWrap}>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
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

              <div style={styles.formGroup}>
                <label style={styles.label}>Confirm Password</label>
                <div style={styles.passwordWrap}>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    style={styles.passwordInput}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.showHideBtn}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
            </div>

            {/* Live Password Requirements Indicator */}
            {formData.password.length > 0 && (
              <div style={styles.pwdRequirementsBox}>
                <p style={styles.pwdReqTitle}>Password Requirements:</p>
                <div style={styles.pwdReqGrid}>
                  <div style={{ ...styles.pwdReqItem, color: isMinLength ? "#2E7D32" : "#6C574C" }}>
                    <span>{isMinLength ? "✓" : "○"}</span> Minimum 8 characters
                  </div>
                  <div style={{ ...styles.pwdReqItem, color: hasLetter ? "#2E7D32" : "#6C574C" }}>
                    <span>{hasLetter ? "✓" : "○"}</span> At least 1 letter (a-z, A-Z)
                  </div>
                  <div style={{ ...styles.pwdReqItem, color: hasNumber ? "#2E7D32" : "#6C574C" }}>
                    <span>{hasNumber ? "✓" : "○"}</span> At least 1 number (0-9)
                  </div>
                  <div style={{ ...styles.pwdReqItem, color: hasSpecial ? "#2E7D32" : "#6C574C" }}>
                    <span>{hasSpecial ? "✓" : "○"}</span> At least 1 special char (!@#$%)
                  </div>
                </div>
                {formData.confirmPassword.length > 0 && (
                  <div
                    style={{
                      ...styles.pwdReqItem,
                      marginTop: "6px",
                      fontWeight: "600",
                      color: isPasswordMatch ? "#2E7D32" : "#C62828",
                    }}
                  >
                    <span>{isPasswordMatch ? "✓" : "✕"}</span>{" "}
                    {isPasswordMatch ? "Passwords match" : "Passwords do not match"}
                  </div>
                )}
              </div>
            )}

            <button type="submit" disabled={loading} style={styles.button}>
              {loading ? "Creating Account..." : `Register as ${role} →`}
            </button>
          </form>

          <p style={styles.loginText}>
            Already registered on AlumniConnect?{" "}
            <Link to="/login" style={styles.link}>
              Log in here
            </Link>
          </p>
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
    maxWidth: "560px",
    backgroundColor: "#FFFFFF",
    padding: "36px",
    borderRadius: "14px",
    boxShadow: "0 8px 30px rgba(57, 31, 37, 0.1)",
    border: "1px solid #DAD0BB",
  },
  header: {
    textAlign: "center",
    marginBottom: "20px",
  },
  logoWrap: {
    marginBottom: "10px",
  },
  logoImg: {
    height: "56px",
    width: "auto",
  },
  title: {
    color: "#391F25",
    margin: "0 0 6px 0",
    fontSize: "24px",
    fontFamily: "'Poppins', sans-serif",
    fontWeight: "700",
  },
  subtitle: {
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
    lineHeight: "1.4",
  },
  label: {
    display: "block",
    color: "#391F25",
    fontWeight: "600",
    marginBottom: "6px",
    fontSize: "13px",
  },
  formGroup: {
    marginBottom: "14px",
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "14px",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "11px 14px",
    border: "1.5px solid #DAD0BB",
    borderRadius: "6px",
    fontSize: "14px",
    outline: "none",
    color: "#391F25",
    backgroundColor: "#FFFFFF",
    transition: "border-color 0.2s",
  },
  emailHelper: {
    fontSize: "12px",
    color: "#6C574C",
    marginTop: "5px",
    marginBottom: "0px",
    fontWeight: "500",
  },
  batchRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  batchToText: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#6C574C",
  },
  select: {
    width: "100%",
    boxSizing: "border-box",
    padding: "11px 14px",
    border: "1.5px solid #DAD0BB",
    borderRadius: "6px",
    fontSize: "14px",
    outline: "none",
    backgroundColor: "#FFFFFF",
    color: "#391F25",
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
  pwdRequirementsBox: {
    backgroundColor: "#F7F5F0",
    border: "1px solid #DAD0BB",
    borderRadius: "6px",
    padding: "10px 14px",
    marginBottom: "14px",
  },
  pwdReqTitle: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#391F25",
    margin: "0 0 6px 0",
  },
  pwdReqGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "4px 10px",
  },
  pwdReqItem: {
    fontSize: "11.5px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    transition: "color 0.2s",
  },
  roles: {
    display: "flex",
    gap: "10px",
    marginBottom: "16px",
  },
  roleButton: {
    flex: 1,
    padding: "10px 6px",
    backgroundColor: "#F7F5F0",
    border: "1.5px solid #DAD0BB",
    borderRadius: "8px",
    color: "#391F25",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
    transition: "all 0.2s",
  },
  selectedRole: {
    backgroundColor: "#57142B",
    borderColor: "#57142B",
    color: "#FFFFFF",
    boxShadow: "0 2px 8px rgba(87, 20, 43, 0.2)",
  },
  button: {
    width: "100%",
    padding: "12px",
    marginTop: "8px",
    backgroundColor: "#57142B",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "6px",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(87, 20, 43, 0.25)",
    transition: "background 0.2s",
  },
  loginText: {
    textAlign: "center",
    marginTop: "18px",
    color: "#6C574C",
    fontSize: "13px",
  },
  link: {
    color: "#57142B",
    fontWeight: "700",
    textDecoration: "none",
  },
};

export default Register;
