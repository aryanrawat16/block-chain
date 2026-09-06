const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const {
  createDailyBlock,
  getBlockchain,
  verifyBlockchain,
  tamperDemo,
} = require("../controllers/blockchainController");

router.post("/create-daily-block", authMiddleware, adminMiddleware, createDailyBlock);
router.get("/", getBlockchain); // public - transparency
router.get("/verify", verifyBlockchain); // public - anyone can verify integrity
router.post("/tamper-demo", authMiddleware, adminMiddleware, tamperDemo); // demo only

module.exports = router;
