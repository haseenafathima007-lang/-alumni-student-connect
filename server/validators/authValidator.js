/**
 * Institutional Email & Password Validator for Easwari Engineering College
 */
const getInstitutionalDomain = () => {
  return (process.env.INSTITUTIONAL_EMAIL_DOMAIN || "eec.srmrmp.edu.in").trim().toLowerCase();
};

/**
 * Validates password strength:
 * - Minimum 8 characters
 * - At least 1 letter
 * - At least 1 number
 * - At least 1 special character
 */
const validatePassword = (password) => {
  if (!password || typeof password !== "string") {
    return {
      isValid: false,
      error: "Password is required",
    };
  }

  const minLength = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);

  if (!minLength || !hasLetter || !hasNumber || !hasSpecial) {
    return {
      isValid: false,
      error:
        "Password must be at least 8 characters and contain at least 1 letter, 1 number, and 1 special character.",
      details: {
        minLength,
        hasLetter,
        hasNumber,
        hasSpecial,
      },
    };
  }

  return {
    isValid: true,
    details: {
      minLength: true,
      hasLetter: true,
      hasNumber: true,
      hasSpecial: true,
    },
  };
};

/**
 * Validates registration payload based on role-specific requirements:
 * - Student: Must end with @eec.srmrmp.edu.in
 * - Faculty: Must end with @eec.srmrmp.edu.in
 * - Alumni: Must end with @gmail.com
 * - Admin: Public registration forbidden
 */
const validateRegistrationPayload = ({ name, email, password, role, department }) => {
  if (!name || !name.trim() || !email || !password) {
    return {
      isValid: false,
      error: "Please provide name, email, and password",
    };
  }

  const normalizedEmail = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(normalizedEmail)) {
    return {
      isValid: false,
      error: "Please provide a valid email address",
    };
  }

  // Password validation
  const pwdValidation = validatePassword(password);
  if (!pwdValidation.isValid) {
    return {
      isValid: false,
      error: pwdValidation.error,
    };
  }

  const rawRole = (role || "Student").trim();
  const normalizedRole = rawRole.charAt(0).toUpperCase() + rawRole.slice(1).toLowerCase();

  // Admin registration forbidden via public signup
  if (normalizedRole.toLowerCase() === "admin") {
    return {
      isValid: false,
      error: "Admin accounts cannot be created via public registration.",
    };
  }

  const allowedRoles = ["Student", "Alumni", "Faculty"];
  if (!allowedRoles.includes(normalizedRole)) {
    return {
      isValid: false,
      error: "Invalid role. Allowed roles: Student, Alumni, Faculty.",
    };
  }

  const institutionalDomain = getInstitutionalDomain();
  const expectedCollegeSuffix = `@${institutionalDomain}`;
  const expectedAlumniSuffix = "@gmail.com";

  // Role-specific email domain validation
  if (normalizedRole === "Student") {
    if (!normalizedEmail.endsWith(expectedCollegeSuffix)) {
      return {
        isValid: false,
        error: "Please use your official college email ending with @eec.srmrmp.edu.in.",
      };
    }
  } else if (normalizedRole === "Faculty") {
    if (!normalizedEmail.endsWith(expectedCollegeSuffix)) {
      return {
        isValid: false,
        error: "Please use your official college email ending with @eec.srmrmp.edu.in.",
      };
    }
  } else if (normalizedRole === "Alumni") {
    if (!normalizedEmail.endsWith(expectedAlumniSuffix)) {
      return {
        isValid: false,
        error: "Please use a Gmail address ending with @gmail.com.",
      };
    }
  }

  return {
    isValid: true,
    normalizedEmail,
    normalizedRole,
    normalizedName: name.trim(),
    department: department || "Artificial Intelligence and Data Science",
  };
};

module.exports = {
  getInstitutionalDomain,
  validatePassword,
  validateRegistrationPayload,
};
