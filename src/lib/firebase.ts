import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAc04JrEQB-4C3r0pLmFaJ86BPcdtR30Wg",
  authDomain: "cloud-test-6d446.firebaseapp.com",
  databaseURL: "https://cloud-test-6d446-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "cloud-test-6d446",
  storageBucket: "cloud-test-6d446.firebasestorage.app",
  messagingSenderId: "152129125724",
  appId: "1:152129125724:web:0edfb53a5b2f30c97ed599"
};

// Only initialize Firebase if no apps exist
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);
export const storage = getStorage(app);

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
  } else if (err.code === 'unimplemented') {
    console.warn('The current browser does not support persistence.');
  }
});