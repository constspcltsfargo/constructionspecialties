
'use server';

import * as admin from 'firebase-admin';

/**
 * Initializes and returns the Firebase Admin app instance, ensuring it's a singleton.
 * This function is designed to be called within server-side code (e.g., Server Actions, API Routes).
 * It securely initializes the Admin SDK using environment variables.
 *
 * @returns The initialized Firebase Admin app instance.
 */
export async function initializeFirebaseAdmin(): Promise<admin.app.App> {
  // Check if an app is already initialized
  if (admin.apps.length > 0 && admin.apps[0]) {
    return admin.apps[0];
  }
  
  // This is the critical part. We read the environment variables *inside* the function
  // to ensure they are available when called.
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  // Validate that all required environment variables are present.
  if (!privateKey || !clientEmail || !projectId) {
    throw new Error('Missing Firebase Admin SDK credentials. Please check your .env.local file.');
  }

  try {
    // The private key from the environment variable needs to have its escaped newlines
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
    
    return app;

  } catch (error) {
    console.error('Firebase Admin SDK initialization failed:', error);
    // Throw a more descriptive error to make debugging easier.
    throw new Error('Could not initialize Firebase Admin SDK. Please ensure your service account credentials are set up correctly in the environment.');
  }
}
