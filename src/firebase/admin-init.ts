
import * as admin from 'firebase-admin';

// This function initializes Firebase Admin on the server-side.
// It's designed to be called within Server Actions or Route Handlers.
export function initializeFirebaseAdmin(): admin.app.App {
    if (admin.apps.length > 0 && admin.apps[0]) {
        return admin.apps[0];
    }

    // In a managed environment like App Hosting, the SDK is automatically
    // initialized with the project's default service account credentials.
    // We will attempt that first.
    try {
        const app = admin.initializeApp();
        return app;
    } catch (e) {
        console.warn("Automatic Firebase Admin initialization failed, attempting manual init with service account key.", e);
    }
    
    // If auto-init fails, fall back to the service account key from the environment variable.
    const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (!serviceAccountString) {
        throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set and auto-init failed.');
    }

    try {
        // The service account key is expected to be a Base64 encoded string.
        const serviceAccount = JSON.parse(
            Buffer.from(serviceAccountString, 'base64').toString('utf-8')
        );
        const app = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
        return app;
    } catch (e: any) {
        console.error("Failed to parse or use FIREBASE_SERVICE_ACCOUNT_KEY. Ensure it's a valid Base64-encoded JSON.", e);
        // Throw a more specific error to aid debugging.
        throw new Error(`The Firebase service account key could not be processed: ${e.message}`);
    }
}
