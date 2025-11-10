
'use server';

import * as admin from 'firebase-admin';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

interface AdminServices {
  app: admin.app.App;
  auth: Auth;
  firestore: Firestore;
}

let adminServices: AdminServices | null = null;

/**
 * Initializes and returns the Firebase Admin app instance, ensuring it's a singleton.
 * This is the corrected, robust version to prevent re-initialization and credential errors.
 *
 * @returns A promise that resolves with the initialized Firebase Admin services.
 */
export async function initializeFirebaseAdmin(): Promise<AdminServices> {
  // If the app is already initialized, return the existing services.
  if (adminServices) {
    return adminServices;
  }

  // Check if an app is already initialized through another means.
  if (admin.apps.length > 0 && admin.apps[0]) {
    const app = admin.apps[0];
    adminServices = { app, auth: getAuth(app), firestore: getFirestore(app) };
    return adminServices;
  }

  // Read environment variables for credentials.
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  // Validate that all required environment variables are present.
  if (!privateKey || !clientEmail || !projectId) {
    console.error('Missing Firebase Admin SDK credentials in .env.local');
    throw new Error('Missing Firebase Admin SDK credentials. Please check your .env.local file.');
  }

  try {
    // The private key from the environment variable needs its escaped newlines
    // replaced with actual newline characters.
    const formattedPrivateKey = privateKey.replace(/\\n/g, '\n');

    // Initialize the Firebase Admin SDK with the credentials.
    const app = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: projectId,
        clientEmail: clientEmail,
        privateKey: formattedPrivateKey,
      }),
    });
    
    // Store the initialized services in the singleton variable.
    adminServices = { app, auth: getAuth(app), firestore: getFirestore(app) };
    return adminServices;

  } catch (error) {
    console.error('Firebase Admin SDK initialization failed:', error);
    throw new Error('Could not initialize Firebase Admin SDK. Please ensure your service account credentials are set up correctly in the environment.');
  }
}
