const Voter = require("../models/Voter");
const Election = require("../models/Election");
const Candidate = require("../models/Candidate");
const Vote = require("../models/Vote");

function todayDateString() {
  // YYYY-MM-DD in UTC, used consistently for daily aggregation
  return new Date().toISOString().slice(0, 10);
}

// POST /api/votes (voter only, requires auth)
async function castVote(req, res) {
  try {
    const { candidateId } = req.body;
    const voterId = req.voter.id;

    if (!candidateId) {
      return res.status(400).json({ message: "candidateId is required." });
    }

    // 1. Check the election is active
    const election = await Election.findOne({ status: "ACTIVE" });
    if (!election) {
      return res.status(400).json({ message: "There is no active election right now." });
    }

    // 2. Check the candidate actually belongs to this election
    const candidate = await Candidate.findOne({ _id: candidateId, electionId: election._id });
    if (!candidate) {
      return res.status(400).json({ message: "Invalid candidate for the current election." });
    }

    // 3. Atomic check-and-set for hasVoted.
    //    Instead of "read hasVoted, then write hasVoted = true" (two separate
    //    steps, which is vulnerable to two simultaneous requests both passing
    //    the check before either one writes), we do it in ONE atomic database
    //    operation: "only update this document if hasVoted is still false".
    //    If a second request for the same voter arrives a millisecond later,
    //    findOneAndUpdate simply won't find a matching document (because
    //    hasVoted is already true) and updatedVoter will be null.
    const updatedVoter = await Voter.findOneAndUpdate(
      { _id: voterId, hasVoted: false },
      { $set: { hasVoted: true } },
      { new: true }
    );

    if (!updatedVoter) {
      return res.status(409).json({ message: "You have already voted." });
    }

    // 4. Only now create the vote record - deliberately with NO voterId,
    //    so identity and choice stay logically separated (see Vote model).
    const vote = await Vote.create({
      electionId: election._id,
      candidateId: candidate._id,
      voteDate: todayDateString(),
    });

    return res.status(201).json({
      message: "Vote cast successfully. Thank you for voting!",
      voteId: vote._id,
    });
  } catch (err) {
    console.error("Cast vote error:", err);
    return res.status(500).json({ message: "Could not cast vote." });
  }
}

// GET /api/votes/status (voter only, requires auth)
async function getVoteStatus(req, res) {
  try {
    const voter = await Voter.findById(req.voter.id);
    if (!voter) {
      return res.status(404).json({ message: "Voter not found." });
    }
    return res.status(200).json({ hasVoted: voter.hasVoted });
  } catch (err) {
    console.error("Get vote status error:", err);
    return res.status(500).json({ message: "Could not fetch vote status." });
  }
}

module.exports = { castVote, getVoteStatus };
