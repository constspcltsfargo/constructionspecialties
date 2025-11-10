
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
    // In a deployed environment like App Hosting, the SDK should be able to
    // initialize without explicit credentials. We'll try that first.
     try {
        const app = initializeApp();
        return {
            app: app,
            firestore: getFirestore(app),
        };
     } catch (e) {
        console.error("Automatic Firebase Admin initialization failed.", e);
        throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY is not set and automatic initialization failed.');
     }
  }

  // If the service account key IS provided, use it.
  try {
    const serviceAccount = JSON.parse(
        Buffer.from(serviceAccountString, 'base64').toString('utf-8')
    );
    const app = initializeApp({
        credential: cert(serviceAccount),
    });
    return {
        app: app,
        firestore: getFirestore(app),
    };
  } catch (e) {
      console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY. Ensure it's a valid Base64-encoded JSON.", e);
      throw new Error("The Firebase service account key is not a valid JSON object.");
  }
}
