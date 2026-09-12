const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const { getMe } = require("../controllers/userController");

const router = express.Router();

// Protect this route with the Firebase token verification middleware
router.get("/me", verifyToken, getMe);

module.exports = router;
