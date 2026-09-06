const Election = require("../models/Election");

// POST /api/elections (admin only)
async function createElection(req, res) {
  try {
    const { title, startDate, endDate } = req.body;

    if (!title || !startDate || !endDate) {
      return res.status(400).json({ message: "Title, start date, and end date are required." });
    }
    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ message: "Start date must be before end date." });
    }

    const election = await Election.create({ title, startDate, endDate });
    return res.status(201).json({ message: "Election created.", election });
  } catch (err) {
    console.error("Create election error:", err);
    return res.status(500).json({ message: "Could not create election." });
  }
}

// GET /api/elections/active (public - voters need this to see what they can vote in)
async function getActiveElection(req, res) {
  try {
    const election = await Election.findOne({ status: "ACTIVE" }).sort({ createdAt: -1 });
    if (!election) {
      return res.status(404).json({ message: "No active election right now." });
    }
    return res.status(200).json({ election });
  } catch (err) {
    console.error("Get active election error:", err);
    return res.status(500).json({ message: "Could not fetch active election." });
  }
}

// GET /api/elections (admin only - list everything, for the admin dashboard)
async function getAllElections(req, res) {
  try {
    const elections = await Election.find().sort({ createdAt: -1 });
    return res.status(200).json({ elections });
  } catch (err) {
    console.error("Get all elections error:", err);
    return res.status(500).json({ message: "Could not fetch elections." });
  }
}

// PATCH /api/elections/:id/status (admin only)
async function updateElectionStatus(req, res) {
  try {
    const { status } = req.body;
    const validStatuses = ["UPCOMING", "ACTIVE", "ENDED"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${validStatuses.join(", ")}` });
    }

    const election = await Election.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!election) {
      return res.status(404).json({ message: "Election not found." });
    }

    return res.status(200).json({ message: "Election status updated.", election });
  } catch (err) {
    console.error("Update election status error:", err);
    return res.status(500).json({ message: "Could not update election status." });
  }
}

module.exports = { createElection, getActiveElection, getAllElections, updateElectionStatus };
