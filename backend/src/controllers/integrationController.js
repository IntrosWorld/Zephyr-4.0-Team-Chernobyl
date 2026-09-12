const { getDb } = require("../config/firebaseAdmin");
const { updateIntegrations } = require("../services/userService");
const { getGithubStats } = require("../services/githubService");
const { getLeetcodeStats } = require("../services/leetcodeService");

// Save the GitHub/LeetCode usernames the user wants tracked
const saveIntegrations = async (req, res, next) => {
  try {
    const { uid } = req.user;
    const { github, leetcode } = req.body;

    const integrations = await updateIntegrations(uid, { github, leetcode });

    res.status(200).json({ integrations });
  } catch (error) {
    next(error);
  }
};

// GitHub stats for the authenticated user's saved username
const getGithub = async (req, res, next) => {
  try {
    const { uid } = req.user;
    const userDoc = await getDb().collection("users").doc(uid).get();
    const username = userDoc.data()?.integrations?.github;

    if (!username) {
      return res.status(400).json({ error: "No GitHub username saved for this user" });
    }

    const stats = await getGithubStats(username);
    res.status(200).json(stats);
  } catch (error) {
    next(error);
  }
};

// LeetCode stats for the authenticated user's saved username
const getLeetcode = async (req, res, next) => {
  try {
    const { uid } = req.user;
    const userDoc = await getDb().collection("users").doc(uid).get();
    const username = userDoc.data()?.integrations?.leetcode;

    if (!username) {
      return res.status(400).json({ error: "No LeetCode username saved for this user" });
    }

    const stats = await getLeetcodeStats(username);
    res.status(200).json(stats);
  } catch (error) {
    next(error);
  }
};

module.exports = { saveIntegrations, getGithub, getLeetcode };
