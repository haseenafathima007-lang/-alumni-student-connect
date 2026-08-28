const getAllowedOrigins = () => {
  const allowed = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
  ];

  if (process.env.CLIENT_URL) {
    const urls = process.env.CLIENT_URL.split(",").map((u) => u.trim().replace(/\/$/, ""));
    allowed.push(...urls);
  }

  return allowed;
};

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like server-to-server, health checks)
    if (!origin) return callback(null, true);

    const allowed = getAllowedOrigins();
    if (allowed.includes("*") || allowed.includes(origin) || process.env.NODE_ENV !== "production") {
      return callback(null, true);
    }

    // Allow vercel preview and production subdomains
    if (origin.endsWith(".vercel.app")) {
      return callback(null, true);
    }

    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

module.exports = { corsOptions, getAllowedOrigins };
