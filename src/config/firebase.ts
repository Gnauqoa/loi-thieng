import { FirebaseApp, getApps, initializeApp } from "firebase/app";
import {
  getAuth,
  getReactNativePersistence,
  initializeAuth,
  signInWithCustomToken,
  UserCredential,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Firestore,
  initializeFirestore,
  FirestoreSettings,
} from "firebase/firestore";
import { decode } from "base-64";

const decodeFirebaseConfig = (base64String: string) => {
  const jsonString = decode(base64String); // Decode Base64 to JSON string
  return JSON.parse(jsonString + '"}'); // Parse JSON string back into an object
};

const isValidConfig = !!process.env.EXPO_PUBLIC_FIREBASE_CONFIG;

const firebaseConfig = decodeFirebaseConfig(
  process.env.EXPO_PUBLIC_FIREBASE_CONFIG || ""
);

console.log("firebaseConfig", firebaseConfig);

const app: FirebaseApp | null = isValidConfig
  ? getApps().length === 0
    ? initializeApp(firebaseConfig)
    : getApps()[0]
  : null;

export const auth = app
  ? getAuth() ??
    initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    })
  : null;

export const signInFirebaseWithToken = async (
  token: string
): Promise<UserCredential> => {
  return new Promise<UserCredential>(async (resolve, reject) => {
    if (auth) {
      try {
        const res = await signInWithCustomToken(auth, token);
        resolve(res);
      } catch (error) {
        reject(error);
      }
    } else {
      reject(new Error("Firebase auth is not initialized"));
    }
  });
};

const firestoreSettings: FirestoreSettings = {
  experimentalForceLongPolling: true,
};

export const db: Firestore | null = app
  ? initializeFirestore(app, firestoreSettings)
  : null;
