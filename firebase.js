// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC-eJXp2x1OovDP6eCgQmVRgUU_gdn3PyY",
  authDomain: "loi-thieng-fd643.firebaseapp.com",
  projectId: "loi-thieng-fd643",
  storageBucket: "loi-thieng-fd643.firebasestorage.app",
  messagingSenderId: "928570948109",
  appId: "1:928570948109:web:5e6293632d05e1adfff344",
  measurementId: "G-N20TWDLFHQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);