
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCg1GsAGYfzCyV4BPDp_H93XcTiZTVAygU",
  authDomain: "webcerita-9e656.firebaseapp.com",
  projectId: "webcerita-9e656",
  storageBucket: "webcerita-9e656.firebasestorage.app",
  messagingSenderId: "209361690351",
  appId: "1:209361690351:web:1818f58e96d154f68bc51a",
  measurementId: "G-TKGJB2YRWD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
