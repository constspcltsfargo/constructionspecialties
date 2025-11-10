
// Load environment variables from .env.local
import { config } from 'dotenv';
config({ path: '.env.local' });

import { initializeApp, getApps, getApp, App, cert } from 'firebase-admin/app';
import { ServiceAccount } from 'firebase-admin';

let app: App;

// This function initializes the Firebase Admin SDK.
// It's designed to be a singleton, so it only initializes the app once.
export function initializeFirebaseAdmin() {
  if (getApps().length > 0) {
    app = getApp();
    return { firebaseApp: app };
  }

  // Check if the required environment variables are present.
  if (
    !process.env.FIREBASE_PROJECT_ID ||
    !process.env.FIREBASE_CLIENT_EMAIL ||
    !process.env.FIREBASE_PRIVATE_KEY
  ) {
    throw new Error(
      'Missing Firebase Admin SDK credentials. Please check your .env.local file.'
    );
  }

  const serviceAccount: ServiceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    // Replace \\n with \n to correctly parse the private key from .env.local
    privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
  };

  app = initializeApp({
    credential: cert(serviceAccount),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });

  return { firebaseApp: app };
}
