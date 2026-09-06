const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const { getDashboardStats } = require("../controllers/statsController");

router.get("/", authMiddleware, adminMiddleware, getDashboardStats);

module.exports = router;
