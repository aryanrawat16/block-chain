const Vote = require("../models/Vote");
const Candidate = require("../models/Candidate");
const BlockModel = require("../models/Block");
const { Blockchain } = require("../blockchain/Blockchain");

function todayDateString() {
  return new Date().toISOString().slice(0, 10);
}

// POST /api/blockchain/create-daily-block (admin only)
// Body: { electionId, date? }  -- date defaults to today, format YYYY-MM-DD
async function createDailyBlock(req, res) {
  try {
    const { electionId } = req.body;
    const date = req.body.date || todayDateString();

    if (!electionId) {
      return res.status(400).json({ message: "electionId is required." });
    }

    // Only aggregate votes for this election/day that haven't already
    // been folded into a block, so re-running this never double-counts.
    const votesToAggregate = await Vote.find({
      electionId,
      voteDate: date,
      includedInBlock: false,
    });

    if (votesToAggregate.length === 0) {
      return res.status(400).json({ message: `No new votes found for ${date} in this election.` });
    }

    // Build candidateId -> count, then translate to candidateName -> count
    // so the block itself reads clearly without needing a join later.
    const countsByCandidateId = {};
    for (const vote of votesToAggregate) {
      const key = vote.candidateId.toString();
      countsByCandidateId[key] = (countsByCandidateId[key] || 0) + 1;
    }

    const candidates = await Candidate.find({
      _id: { $in: Object.keys(countsByCandidateId) },
    });

    const voteCounts = {};
    for (const candidate of candidates) {
      voteCounts[candidate.name] = countsByCandidateId[candidate._id.toString()] || 0;
    }

    // Find the last block for THIS election specifically, since each
    // election has its own independent chain in this design.
    const previousStoredBlock = await BlockModel.findOne({ electionId }).sort({ index: -1 });

    const newBlock = Blockchain.createNextBlock(previousStoredBlock, date, voteCounts);

    const savedBlock = await BlockModel.create({
      index: newBlock.index,
      electionId,
      date: newBlock.date,
      voteCounts: newBlock.voteCounts,
      previousHash: newBlock.previousHash,
      hash: newBlock.hash,
      timestamp: newBlock.timestamp,
    });

    // Mark these votes as accounted for so a second click doesn't recount them.
    await Vote.updateMany(
      { _id: { $in: votesToAggregate.map((v) => v._id) } },
      { $set: { includedInBlock: true } }
    );

    return res.status(201).json({ message: "Daily block created.", block: savedBlock });
  } catch (err) {
    console.error("Create daily block error:", err);
    return res.status(500).json({ message: "Could not create daily block." });
  }
}

// GET /api/blockchain?electionId=... (public - transparency is the whole point)
async function getBlockchain(req, res) {
  try {
    const filter = req.query.electionId ? { electionId: req.query.electionId } : {};
    const blocks = await BlockModel.find(filter).sort({ index: 1 });
    return res.status(200).json({ blocks });
  } catch (err) {
    console.error("Get blockchain error:", err);
    return res.status(500).json({ message: "Could not fetch blockchain." });
  }
}

// GET /api/blockchain/verify?electionId=...
async function verifyBlockchain(req, res) {
  try {
    const filter = req.query.electionId ? { electionId: req.query.electionId } : {};
    const blocks = await BlockModel.find(filter).sort({ index: 1 });

    if (blocks.length === 0) {
      return res.status(200).json({ isValid: true, errors: [], message: "No blocks to verify yet." });
    }

    const result = Blockchain.validateChain(blocks);

    return res.status(200).json({
      isValid: result.isValid,
      errors: result.errors,
      message: result.isValid
        ? "Blockchain is valid. No tampering detected."
        : "Blockchain integrity compromised. See errors for details.",
    });
  } catch (err) {
    console.error("Verify blockchain error:", err);
    return res.status(500).json({ message: "Could not verify blockchain." });
  }
}

// POST /api/blockchain/tamper-demo (admin only)
// THIS IS A DEMO/TESTING FEATURE ONLY.
// It intentionally edits a stored block's vote count directly in the
// database WITHOUT recalculating its hash, to prove that verifyBlockchain
// can detect the resulting inconsistency. A real system would never expose
// an endpoint like this - it exists here purely to demonstrate tamper
// detection for the college presentation.
async function tamperDemo(req, res) {
  try {
    const { blockIndex, electionId, candidateName, fakeCount } = req.body;

    if (blockIndex === undefined || !electionId || !candidateName || fakeCount === undefined) {
      return res.status(400).json({
        message: "blockIndex, electionId, candidateName, and fakeCount are all required.",
      });
    }

    const block = await BlockModel.findOne({ index: blockIndex, electionId });
    if (!block) {
      return res.status(404).json({ message: "Block not found." });
    }

    // Directly mutate the field and save - deliberately skipping hash
    // recalculation, which is exactly what a real tamper attempt would do.
    block.voteCounts.set(candidateName, fakeCount);
    block.markModified("voteCounts");
    await block.save();

    return res.status(200).json({
      message: `DEMO: Block #${blockIndex} vote count for "${candidateName}" changed to ${fakeCount} without updating its hash. Run Verify Blockchain to see it get flagged.`,
      block,
    });
  } catch (err) {
    console.error("Tamper demo error:", err);
    return res.status(500).json({ message: "Could not run tamper demo." });
  }
}

module.exports = { createDailyBlock, getBlockchain, verifyBlockchain, tamperDemo };
