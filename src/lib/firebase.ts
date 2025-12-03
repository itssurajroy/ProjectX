import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBQSy1kHNRYvp2b-l0jnsUd44P-cXkJZDY",
  authDomain: "studio-8183683078-60ab0.firebaseapp.com",
  projectId: "studio-8183683078-60ab0",
  storageBucket: "studio-8183683078-60ab0.appspot.com",
  messagingSenderId: "20761769952",
  appId: "1:20761769952:web:1a66600ebcca874bc81d85"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
