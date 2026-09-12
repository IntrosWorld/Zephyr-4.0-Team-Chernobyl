const { getDb } = require("../config/firebaseAdmin");

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

module.exports = { getOrCreateUser, updateIntegrations };
