const Candidate = require("../models/Candidate");

// POST /api/candidates (admin only)
async function addCandidate(req, res) {
  try {
    const { name, party, electionId } = req.body;

    if (!name || !party || !electionId) {
      return res.status(400).json({ message: "Name, party, and electionId are required." });
    }

    const candidate = await Candidate.create({ name, party, electionId });
    return res.status(201).json({ message: "Candidate added.", candidate });
  } catch (err) {
    console.error("Add candidate error:", err);
    return res.status(500).json({ message: "Could not add candidate." });
  }
}

// GET /api/candidates/:electionId (public - voters need to see who they can vote for)
async function getCandidatesByElection(req, res) {
  try {
    const candidates = await Candidate.find({ electionId: req.params.electionId }).sort({ createdAt: 1 });
    return res.status(200).json({ candidates });
  } catch (err) {
    console.error("Get candidates error:", err);
    return res.status(500).json({ message: "Could not fetch candidates." });
  }
}

// DELETE /api/candidates/:id (admin only)
async function deleteCandidate(req, res) {
  try {
    const candidate = await Candidate.findByIdAndDelete(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found." });
    }
    return res.status(200).json({ message: "Candidate removed." });
  } catch (err) {
    console.error("Delete candidate error:", err);
    return res.status(500).json({ message: "Could not delete candidate." });
  }
}

module.exports = { addCandidate, getCandidatesByElection, deleteCandidate };
