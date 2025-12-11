
// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBQSy1kHNRYvp2b-l0jnsUd44P-cXkJZDY",
  authDomain: "studio-8183683078-60ab0.firebaseapp.com",
  projectId: "studio-8183683078-60ab0",
  storageBucket: "studio-8183683078-60ab0.firebasestorage.app",
  messagingSenderId: "20761769952",
  appId: "1:20761769952:web:1a66600ebcca874bc81d85"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

// Initialize Analytics if supported
const analytics = isSupported().then(yes => (yes ? getAnalytics(app) : null));

export { app, auth, db, analytics };
