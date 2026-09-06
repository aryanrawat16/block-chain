const mongoose = require("mongoose");

const blockSchema = new mongoose.Schema(
  {
    index: {
      type: Number,
      required: true,
    },
    electionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Election",
      required: true,
    },
    date: {
      type: String, // YYYY-MM-DD, the day this block aggregates
      required: true,
    },
    voteCounts: {
      type: Map,
      of: Number, // candidateName -> vote count
      required: true,
    },
    previousHash: {
      type: String,
      required: true,
    },
    hash: {
      type: String,
      required: true,
    },
    timestamp: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// A block's index (1, 2, 3...) only needs to be unique WITHIN its own
// election's chain, not globally across every election in the database.
// This compound index enforces exactly that.
blockSchema.index({ electionId: 1, index: 1 }, { unique: true });

module.exports = mongoose.model("Block", blockSchema);

