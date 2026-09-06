const mongoose = require("mongoose");

// Intentionally NO voterId field here. Duplicate-vote prevention is handled
// by flipping hasVoted on the Voter document, not by looking up past Vote
// records for a given voter. This keeps a vote record from ever being
// traceable back to a specific voter within this system.
const voteSchema = new mongoose.Schema(
  {
    electionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Election",
      required: true,
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
    },
    // Track which day's aggregate this vote belongs to (YYYY-MM-DD, UTC),
    // so daily aggregation queries are cheap and unambiguous.
    voteDate: {
      type: String,
      required: true,
    },
    // Set to true once this vote has been folded into a daily block,
    // so we don't double-count it in a later aggregation.
    includedInBlock: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vote", voteSchema);
