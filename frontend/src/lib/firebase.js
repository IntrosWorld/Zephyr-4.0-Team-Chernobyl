import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCmCNhhzD1RsS1SAZyoH4C_1C81I5GWx84",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "zephyr-e7310.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "zephyr-e7310",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "zephyr-e7310.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "560541266732",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:560541266732:web:c550e86278c23f48e2b289"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
