
import { initializeApp, getApps, getApp, App, cert } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

interface FirebaseAdminServices {
  firestore: Firestore;
  app: App;
}

// This function initializes Firebase Admin on the server-side.
// It's designed to be called within Server Actions or Route Handlers.
export function initializeFirebaseAdmin(): FirebaseAdminServices {
  if (getApps().length > 0) {
    const app = getApp();
    return {
      app: app,
      firestore: getFirestore(app),
    };
  }

  const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (!serviceAccountString) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set.');
  }

  let serviceAccount;
  try {
    // Attempt to parse the key as a JSON string directly.
    serviceAccount = JSON.parse(serviceAccountString);
  } catch (e1) {
    try {
      // If direct parsing fails, assume it's a Base64 encoded string.
      const decodedString = Buffer.from(serviceAccountString, 'base64').toString('utf-8');
      serviceAccount = JSON.parse(decodedString);
    } catch (e2) {
      console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY as JSON or Base64-encoded JSON.", e1, e2);
      throw new Error("The Firebase service account key is not a valid JSON object.");
    }
  }


  const app = initializeApp({
    credential: cert(serviceAccount),
  });
  
  return {
    app: app,
    firestore: getFirestore(app),
  };
}
