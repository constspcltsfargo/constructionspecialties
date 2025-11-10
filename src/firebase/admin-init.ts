
'use server';

import * as admin from 'firebase-admin';

// Correctly format the private key by replacing literal \n with actual newlines
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

// Service account credentials from environment variables
const serviceAccount = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: privateKey,
};

/**
 * Initializes the Firebase Admin SDK, ensuring it's a singleton.
 * This function is designed to be called within Server Actions or Route Handlers.
 * @returns The initialized Firebase Admin app instance.
 */
export async function initializeFirebaseAdmin(): Promise<admin.app.App> {
  // Check if an app is already initialized
  if (admin.apps.length > 0 && admin.apps[0]) {
    return admin.apps[0];
  }

  // Ensure all required environment variables are present
  if (!serviceAccount.projectId || !serviceAccount.clientEmail || !serviceAccount.privateKey) {
    throw new Error('Firebase Admin SDK credentials are not set in environment variables.');
  }

  try {
    // Initialize the Admin SDK with the credentials
    const app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    return app;
  } catch (error: any) {
    console.error('Firebase Admin SDK initialization failed:', error);
    throw new Error(`Could not initialize Firebase Admin SDK. Please check your service account credentials. Error: ${error.message}`);
  }
}
