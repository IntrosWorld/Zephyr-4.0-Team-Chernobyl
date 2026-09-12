const { initializeApp, getApps, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth");

let _db = null;
let _auth = null;

function initFirebaseAdmin() {
  if (getApps().length === 0) {
    try {
      // Handle escaped newlines in the private key from env vars
      const privateKey = process.env.FIREBASE_PRIVATE_KEY
        ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
        : undefined;

      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: privateKey,
        }),
      });

      _db = getFirestore();
      _auth = getAuth();
      console.log("✅ Firebase Admin SDK initialized successfully.");
    } catch (error) {
      console.error("❌ Firebase Admin initialization error:", error.message);
      process.exit(1);
    }
  }
}

function getDb() {
  if (!_db) _db = getFirestore();
  return _db;
}

function getAdminAuth() {
  if (!_auth) _auth = getAuth();
  return _auth;
}

module.exports = { initFirebaseAdmin, getDb, getAdminAuth };
