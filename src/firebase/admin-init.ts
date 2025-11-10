
'use server';

import * as admin from 'firebase-admin';

/**
 * Initializes the Firebase Admin SDK, ensuring it's a singleton.
 * This function is designed to be called within Server Actions or Route Handlers.
 * @returns The initialized Firebase Admin app instance.
 */
export function initializeFirebaseAdmin(): admin.app.App {
  // Check if an app is already initialized
  if (admin.apps.length > 0 && admin.apps[0]) {
    return admin.apps[0];
  }

  // In a managed environment like Firebase App Hosting, the SDK can
  // often be initialized without any parameters. It automatically discovers
  // the service account credentials from the environment.
  try {
    const app = admin.initializeApp();
    return app;
  } catch (error) {
    console.error('Firebase Admin SDK initialization failed:', error);
    // Throw a more descriptive error to make debugging easier.
    throw new Error('Could not initialize Firebase Admin SDK. Please ensure your service account credentials are set up correctly in the environment.');
  }
}
