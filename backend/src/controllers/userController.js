const { getOrCreateUser } = require("../services/userService");

const getMe = async (req, res, next) => {
  try {
    // req.user is populated by the authMiddleware from the decoded Firebase token
    const { uid, email, name, picture } = req.user;
    
    // Get or create the user in Firestore to retrieve RPG stats
    const dbUser = await getOrCreateUser(uid, email, name);
    
    res.status(200).json({
      uid,
      email,
      name: dbUser.displayName,
      picture: picture || null,
      stats: dbUser.stats
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMe };
