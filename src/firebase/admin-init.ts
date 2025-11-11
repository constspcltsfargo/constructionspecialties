'use server';
// Load environment variables from .env.local
import { config } from 'dotenv';
config();

import { initializeApp, getApps, getApp, App, cert } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getStorage, Storage } from 'firebase-admin/storage';
import { ServiceAccount } from 'firebase-admin';

let app: App;
let auth: Auth;
let firestore: Firestore;
let storage: Storage;

// This function initializes the Firebase Admin SDK.
// It's designed to be a singleton, so it only initializes the app once.
export function initializeFirebaseAdmin() {
  if (getApps().length > 0) {
    app = getApp();
  } else {
      // Check if the required environment variables are present.
    if (
      !process.env.FIREBASE_PROJECT_ID ||
      !process.env.FIREBASE_CLIENT_EMAIL ||
      !process.env.FIREBASE_PRIVATE_KEY
    ) {
      throw new Error(
        'Missing Firebase Admin SDK credentials. Please check your .env file.'
      );
    }

    const serviceAccount: ServiceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Replace \\n with \n to correctly parse the private key from .env
      privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    };

    app = initializeApp({
      credential: cert(serviceAccount),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
  }

  auth = getAuth(app);
  firestore = getFirestore(app);
  storage = getStorage(app);

  return { firebaseApp: app, auth, firestore, storage };
}
