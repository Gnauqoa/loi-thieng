import { FirebaseApp, initializeApp } from "firebase/app";
import { Analytics, getAnalytics } from "firebase/analytics";
import {
  Firestore,
  initializeFirestore,
  FirestoreSettings,
} from "firebase/firestore";

// Firebase configuration
const firebaseConfig: Record<string, string> = {
  apiKey: "AIzaSyC-eJXp2x1OovDP6eCgQmVRgUU_gdn3PyY",
  authDomain: "loi-thieng-fd643.firebaseapp.com",
  projectId: "loi-thieng-fd643",
  storageBucket: "loi-thieng-fd643.firebasestorage.app",
  messagingSenderId: "928570948109",
  appId: "1:928570948109:web:5e6293632d05e1adfff344",
  measurementId: "G-N20TWDLFHQ",
};

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);

// Optional: Initialize Analytics (if used in your project)
// Uncomment if you want to use analytics
// const analytics: Analytics = getAnalytics(app);

// Firestore settings for better compatibility
const firestoreSettings: FirestoreSettings = {
  experimentalForceLongPolling: true,
};

// Initialize Firestore
export const db: Firestore = initializeFirestore(app, firestoreSettings);
