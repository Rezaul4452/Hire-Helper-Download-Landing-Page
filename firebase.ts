// Fix: Changed to a namespace import to address potential module resolution issues.
import * as firebaseApp from "firebase/app";
import { getFirestore } from "firebase/firestore";

// 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
// PASTE YOUR FIREBASE CONFIGURATION OBJECT HERE
//
// 1. Go to your Firebase project: https://console.firebase.google.com/
// 2. Click the gear icon (Project settings) in the top-left corner.
// 3. In the "General" tab, scroll down to "Your apps".
// 4. Find your web app and copy the `firebaseConfig` object.
// 5. Paste it below, replacing the placeholder object.
// 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
const firebaseConfig = {
  apiKey: "AIzaSyB5mij-dowtolA5NmACQREGvf7VL3CKNiA",
  authDomain: "hire-helper-all-apps.firebaseapp.com",
  databaseURL: "https://hire-helper-all-apps-default-rtdb.firebaseio.com",
  projectId: "hire-helper-all-apps",
  storageBucket: "hire-helper-all-apps.firebasestorage.app",
  messagingSenderId: "168741835293",
  appId: "1:168741835293:web:7b65ff91299cf41be62cf4",
  measurementId: "G-GLTQFZ70L0"
};
// ❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗
// ==> MOST IMPORTANT STEP <==
//
// YOUR APP WILL NOT LOAD DATA UNTIL YOU UPDATE YOUR FIRESTORE RULES!
//
// 1. Go to your Firebase project's console.
// 2. Navigate to "Firestore Database" from the left menu.
// 3. Click on the "Rules" tab.
// 4. Replace the existing rules with the following code for development:
//
// rules_version = '2';
// service cloud.firestore {
//   match /databases/{database}/documents {
//     match /{document=**} {
//       allow read, write: if true; // WARNING: Open for development. SECURE before production.
//     }
//   }
// }
//
// 5. Click "Publish". Your app should now load correctly.
// ❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗

// Initialize Firebase
// Fix: Use the namespace import to initialize the app.
const app = firebaseApp.initializeApp(firebaseConfig);
export const db = getFirestore(app);