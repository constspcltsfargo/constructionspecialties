
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
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string);

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
