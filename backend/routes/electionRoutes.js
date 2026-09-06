const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const {
  createElection,
  getActiveElection,
  getAllElections,
  updateElectionStatus,
} = require("../controllers/electionController");

router.get("/active", getActiveElection); // public
router.post("/", authMiddleware, adminMiddleware, createElection);
router.get("/", authMiddleware, adminMiddleware, getAllElections);
router.patch("/:id/status", authMiddleware, adminMiddleware, updateElectionStatus);

module.exports = router;
