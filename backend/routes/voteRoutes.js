const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { castVote, getVoteStatus } = require("../controllers/voteController");

router.post("/", authMiddleware, castVote);
router.get("/status", authMiddleware, getVoteStatus);

module.exports = router;
