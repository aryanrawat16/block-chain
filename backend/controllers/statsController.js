const Voter = require("../models/Voter");
const Candidate = require("../models/Candidate");
const Vote = require("../models/Vote");
const Election = require("../models/Election");
const BlockModel = require("../models/Block");

// GET /api/stats (admin only) - powers the admin dashboard's summary cards
async function getDashboardStats(req, res) {
  try {
    const [totalVoters, totalCandidates, totalVotes, activeElection, totalBlocks] =
      await Promise.all([
        Voter.countDocuments({ role: "voter" }),
        Candidate.countDocuments(),
        Vote.countDocuments(),
        Election.findOne({ status: "ACTIVE" }),
        BlockModel.countDocuments(),
      ]);

    let candidateResults = [];
    if (activeElection) {
      const candidates = await Candidate.find({ electionId: activeElection._id });
      candidateResults = await Promise.all(
        candidates.map(async (candidate) => ({
          name: candidate.name,
          party: candidate.party,
          votes: await Vote.countDocuments({ candidateId: candidate._id }),
        }))
      );
    }

    return res.status(200).json({
      totalVoters,
      totalCandidates,
      totalVotes,
      totalBlocks,
      electionStatus: activeElection ? activeElection.status : "NO ACTIVE ELECTION",
      activeElectionTitle: activeElection ? activeElection.title : null,
      candidateResults,
    });
  } catch (err) {
    console.error("Get dashboard stats error:", err);
    return res.status(500).json({ message: "Could not fetch dashboard stats." });
  }
}

module.exports = { getDashboardStats };
