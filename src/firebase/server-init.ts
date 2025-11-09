
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

interface FirebaseServerServices {
  firestore: Firestore;
  firebaseApp: FirebaseApp;
}

// This function initializes Firebase on the server-side.
// It's designed to be called within Server Actions or Route Handlers.
export function initializeFirebase(): FirebaseServerServices {
  if (getApps().length > 0) {
    const app = getApp();
    return {
      firebaseApp: app,
      firestore: getFirestore(app),
    };
  }

  // If no app is initialized, initialize one.
  // On the server, we must use the explicit config.
  const app = initializeApp(firebaseConfig);
  
  return {
    firebaseApp: app,
    firestore: getFirestore(app),
  };
}
