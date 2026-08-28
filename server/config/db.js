const mongoose = require("mongoose");
const seedDatabase = require("../utils/seedData");

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/alumni_portal";
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    // Seed initial data if empty
    await seedDatabase();
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.warn("👉 Tip: If using MongoDB Atlas, make sure your current IP address is whitelisted in Atlas Network Access.");
  }
};

module.exports = connectDB;
