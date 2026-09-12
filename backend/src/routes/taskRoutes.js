const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const { getTasks, createTask, updateTask, deleteTask } = require("../controllers/taskController");

const router = express.Router();

// All task routes require authentication
router.use(verifyToken);

router.get("/", getTasks);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;
