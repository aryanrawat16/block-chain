const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const {
  addCandidate,
  getCandidatesByElection,
  deleteCandidate,
} = require("../controllers/candidateController");

router.post("/", authMiddleware, adminMiddleware, addCandidate);
router.get("/:electionId", getCandidatesByElection); // public
router.delete("/:id", authMiddleware, adminMiddleware, deleteCandidate);

module.exports = router;
