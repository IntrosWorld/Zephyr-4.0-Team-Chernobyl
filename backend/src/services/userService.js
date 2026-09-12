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

module.exports = { getOrCreateUser };
