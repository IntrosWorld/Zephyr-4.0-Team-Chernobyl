import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAeHAktgUWsBkJDOqNnmXoZdmB_Zd9tgPk",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "habitify-101d7.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "habitify-101d7",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "habitify-101d7.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "754968069029",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:754968069029:web:cd3cafcb9c69bddd9bde4c"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
