const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "my_alumni_portal_secret_2026", {
    expiresIn: "7d",
  });
};

module.exports = generateToken;
