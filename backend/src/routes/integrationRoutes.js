const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const { saveIntegrations, getGithub, getLeetcode } = require("../controllers/integrationController");

const router = express.Router();

// All integration routes require authentication
router.use(verifyToken);

router.put("/", saveIntegrations);
router.get("/github", getGithub);
router.get("/leetcode", getLeetcode);

module.exports = router;
