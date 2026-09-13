const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const { getTodayLogs, getRangeLogs, getHeatmap, createLog, deleteLog } = require("../controllers/logController");

const router = express.Router();

// All log routes require authentication
router.use(verifyToken);

router.get("/today", getTodayLogs);
router.get("/range", getRangeLogs);
router.get("/heatmap", getHeatmap);
router.post("/", createLog);
router.delete("/", deleteLog);

module.exports = router;
