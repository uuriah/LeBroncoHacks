'use client';

import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBPMXgPMykXYITEmwrnphtuJm4AiAtEwJI",
  authDomain: "broncohacks-2025.firebaseapp.com",
  projectId: "broncohacks-2025",
  storageBucket: "broncohacks-2025.firebasestorage.app",
  messagingSenderId: "1041376086204",
  appId: "1:1041376086204:web:d111e27f3093843364e8b9",
  measurementId: "G-QM1C6F0E5Q"
};

// Initialize Firebase only if it hasn't been initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);

// Initialize Analytics only on client side
let analytics = null;
if (typeof window !== 'undefined') {
  const { getAnalytics } = require('firebase/analytics');
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.error('Analytics failed to initialize:', error);
  }
}

export { analytics };