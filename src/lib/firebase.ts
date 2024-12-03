import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  signOut,
  browserLocalPersistence,
  setPersistence
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// Set persistence for all devices
const initializeAuth = async () => {
  try {
    await setPersistence(auth, browserLocalPersistence);
  } catch (error) {
    console.error('Error setting persistence:', error);
  }
};

initializeAuth();

// More reliable mobile detection with tablet support
const isMobileDevice = () => {
  const ua = navigator.userAgent;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua) ||
         (ua.includes('Mac') && 'ontouchend' in document); // Detect iOS devices including iPads
};

export const checkNetworkConnectivity = async () => {
  try {
    const response = await fetch('https://www.google.com/favicon.ico');
    return response.ok;
  } catch (error) {
    console.error('Network connectivity check failed:', error);
    return false;
  }
};

export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    
    // Add scopes
    provider.addScope('email');
    provider.addScope('profile');
    
    // Set custom parameters
    provider.setCustomParameters({
      prompt: 'select_account'
    });

    try {
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error) {
      throw new Error('Failed to sign in. Please try again.');
    }
  } catch (error: any) {
    const errorDetails = {
      code: error.code,
      message: error.message,
      email: error.email,
      credential: error.credential
    };
    throw error;
  }
};

export const handleRedirectResult = async () => {
  if (!auth) {
    console.error('Auth not initialized');
    return null;
  }
  
  try {
    const result = await getRedirectResult(auth);
    
    if (result) {
      return result.user;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error handling redirect result:', error);
    throw error;
  }
};

export const signOutUser = async () => {
  if (!auth) {
    console.error('Auth not initialized');
    return;
  }
  
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export { app, db, analytics, auth };
