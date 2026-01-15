
// src/firebase/client/index.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { useUser } from '../auth/use-user';

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
export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = isSupported().then(yes => (yes ? getAnalytics(app) : null));

export { useUser };
export * from './provider';
export * from './useCollection';
export * from './useDoc';
export * from './auth';
