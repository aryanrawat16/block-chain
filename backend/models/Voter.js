const mongoose = require("mongoose");

// NOTE on privacy design (see project spec section 8):
// This collection stores WHO can vote and WHETHER they voted (hasVoted).
// It never stores WHICH candidate they chose - that lives separately in the
// Vote collection with no link back to a voter. This is how we keep identity
// and ballot choice logically separated in this educational prototype.
const voterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    voterId: {
      type: String,
      required: true,
      unique: true, // MongoDB will create a unique index on this field
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false, // never returned by default in queries
    },
    role: {
      type: String,
      enum: ["voter", "admin"],
      default: "voter",
    },
    hasVoted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true } // adds createdAt / updatedAt automatically
);

module.exports = mongoose.model("Voter", voterSchema);
