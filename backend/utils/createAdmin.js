// One-time script to create the first admin account.
// Run it with: node utils/createAdmin.js
// It reads ADMIN_VOTER_ID / ADMIN_PASSWORD / ADMIN_NAME from .env

require("dotenv").config();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Voter = require("../models/Voter");

async function run() {
  await connectDB();

  const voterId = process.env.ADMIN_VOTER_ID;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || "Admin";

  if (!voterId || !password) {
    console.error("Set ADMIN_VOTER_ID and ADMIN_PASSWORD in your .env file first.");
    process.exit(1);
  }

  const existing = await Voter.findOne({ voterId });
  if (existing) {
    console.log(`An account with Voter ID "${voterId}" already exists (role: ${existing.role}).`);
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await Voter.create({
    name,
    voterId,
    passwordHash,
    role: "admin",
  });

  console.log(`Admin account created. Log in at /admin/login with Voter ID "${voterId}".`);
  process.exit(0);
}

run().catch((err) => {
  console.error("Failed to create admin:", err);
  process.exit(1);
});
