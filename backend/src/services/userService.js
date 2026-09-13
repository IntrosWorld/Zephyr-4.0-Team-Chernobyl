const { getDb } = require("../config/firebaseAdmin");

const XP_PER_LEVEL = 100;

function levelForXp(xp) {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

/**
 * Ensures a user document exists in Firestore.
 * If it doesn't, creates one with default RPG stats.
 */
const getOrCreateUser = async (uid, email, displayName) => {
  const userRef = getDb().collection("users").doc(uid);
  const doc = await userRef.get();

  if (!doc.exists) {
    const newUser = {
      uid,
      email,
      displayName: displayName || "Hero",
      stats: {
        level: 1,
        xp: 0,
        gold: 0,
        maxHp: 50,
        currentHp: 50,
      },
      integrations: {
        github: null,
        leetcode: null,
      },
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    await userRef.set(newUser);
    return newUser;
  }

  // Update last login
  await userRef.update({ lastLogin: new Date().toISOString() });

  return doc.data();
};

/**
 * Saves the usernames a user wants tracked for external integrations
 * (GitHub, LeetCode, ...). Pass null/undefined to leave a field unchanged.
 */
const updateIntegrations = async (uid, { github, leetcode }) => {
  const userRef = getDb().collection("users").doc(uid);

  const updates = {};
  if (github !== undefined) updates["integrations.github"] = github || null;
  if (leetcode !== undefined) updates["integrations.leetcode"] = leetcode || null;

  await userRef.update(updates);

  const doc = await userRef.get();
  return doc.data().integrations;
};

/**
 * Applies an XP/gold delta (positive for a completion, negative to undo one)
 * and recomputes level from the resulting XP. Runs as a transaction since
 * habit completions can happen in quick succession.
 */
const applyHabitReward = async (uid, xpDelta, goldDelta) => {
  const userRef = getDb().collection("users").doc(uid);

  return getDb().runTransaction(async (transaction) => {
    const doc = await transaction.get(userRef);
    const current = doc.data()?.stats || { level: 1, xp: 0, gold: 0 };

    const xp = Math.max(0, current.xp + xpDelta);
    const gold = Math.max(0, current.gold + goldDelta);
    const level = levelForXp(xp);

    const stats = { ...current, xp, gold, level };
    transaction.update(userRef, { stats });

    return stats;
  });
};

module.exports = { getOrCreateUser, updateIntegrations, applyHabitReward, XP_PER_LEVEL };
