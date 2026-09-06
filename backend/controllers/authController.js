const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Voter = require("../models/Voter");

const SALT_ROUNDS = 10;

function signToken(voter) {
  return jwt.sign(
    { id: voter._id, role: voter.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );
}

// POST /api/auth/register
// Public voter self-registration. Admins are created separately via
// utils/createAdmin.js, not through this public endpoint.
async function register(req, res) {
  try {
    const { name, voterId, password } = req.body;

    if (!name || !voterId || !password) {
      return res.status(400).json({ message: "Name, Voter ID, and password are all required." });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    const existing = await Voter.findOne({ voterId: voterId.trim() });
    if (existing) {
      return res.status(409).json({ message: "This Voter ID is already registered." });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const voter = await Voter.create({
      name: name.trim(),
      voterId: voterId.trim(),
      passwordHash,
      role: "voter",
    });

    return res.status(201).json({
      message: "Registration successful. You can now log in.",
      voter: { id: voter._id, name: voter.name, voterId: voter.voterId },
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Something went wrong during registration." });
  }
}

// POST /api/auth/login
// Shared by both voter and admin login pages - the role in the returned
// token is what actually determines admin access, not which page was used.
async function login(req, res) {
  try {
    const { voterId, password } = req.body;

    if (!voterId || !password) {
      return res.status(400).json({ message: "Voter ID and password are required." });
    }

    const voter = await Voter.findOne({ voterId: voterId.trim() }).select("+passwordHash");
    if (!voter) {
      return res.status(401).json({ message: "Invalid Voter ID or password." });
    }

    const passwordMatches = await bcrypt.compare(password, voter.passwordHash);
    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid Voter ID or password." });
    }

    const token = signToken(voter);

    return res.status(200).json({
      message: "Login successful.",
      token,
      voter: {
        id: voter._id,
        name: voter.name,
        voterId: voter.voterId,
        role: voter.role,
        hasVoted: voter.hasVoted,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Something went wrong during login." });
  }
}

module.exports = { register, login };
