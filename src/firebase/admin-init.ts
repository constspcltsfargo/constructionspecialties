
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

  // If no app is initialized, initialize one.
  // On the server, we must use the explicit config from environment variables.
  const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string;
  if (!serviceAccountString) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set.');
  }

  let serviceAccount;
  try {
    // The key might be a JSON string or a base64 encoded string.
    // First, try to parse it as JSON directly.
    serviceAccount = JSON.parse(serviceAccountString);
  } catch (e) {
    // If that fails, assume it might be a malformed string that needs escaping,
    // or it's just not valid JSON. A common issue is unescaped newlines.
    try {
        const correctlyEscapedString = serviceAccountString.replace(/\\n/g, '\\n');
        serviceAccount = JSON.parse(correctlyEscapedString);
    } catch (finalError) {
        console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY. Ensure it's a valid JSON string.", finalError);
        throw new Error("The Firebase service account key is not a valid JSON object.");
    }
  }


  const app = initializeApp({
    credential: cert(serviceAccount),
    // You might need to add databaseURL if it's not automatically picked up
    // databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
  });
  
  return {
    app: app,
    firestore: getFirestore(app),
  };
}
