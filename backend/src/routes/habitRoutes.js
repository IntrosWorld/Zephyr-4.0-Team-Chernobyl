const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const { getHabits, createHabit, updateHabit, archiveHabit, deleteHabit } = require("../controllers/habitController");

const router = express.Router();

// All habit routes require authentication
router.use(verifyToken);

router.get("/", getHabits);
router.post("/", createHabit);
router.put("/:id", updateHabit);
router.put("/:id/archive", archiveHabit);
router.delete("/:id", deleteHabit);

module.exports = router;
