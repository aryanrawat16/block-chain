const mongoose = require("mongoose");

// Connects to MongoDB using the URI from .env
// If this fails, the most common causes are:
//   1. MongoDB is not running locally
//   2. MONGO_URI is wrong in .env
async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1); // stop the server, nothing works without a DB
  }
}

module.exports = connectDB;
