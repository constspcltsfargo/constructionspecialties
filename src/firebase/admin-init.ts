
import { initializeApp, getApps, getApp, App, cert } from 'firebase-admin/app';
import { getFirestore, Firestore, collection, getDocs, limit, query, setDoc, doc } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

interface FirebaseAdminServices {
  firestore: Firestore;
  app: App;
}

async function ensureAdminUser(app: App) {
  const firestore = getFirestore(app);
  const auth = getAuth(app);
  const usersCollection = collection(firestore, 'users');
  const q = query(usersCollection, limit(1));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    console.log('No users found. Creating default admin user...');
    try {
      const userRecord = await auth.createUser({
        email: 'admin@example.com',
        password: 'password',
        displayName: 'Admin User',
        emailVerified: true,
        disabled: false,
      });

      await auth.setCustomUserClaims(userRecord.uid, { role: 'admin' });
      
      const adminRoleRef = doc(firestore, 'roles_admin', userRecord.uid);
      await setDoc(adminRoleRef, { role: 'admin' });

      const userProfileRef = doc(firestore, 'users', userRecord.uid);
      await setDoc(userProfileRef, {
        displayName: 'Admin User',
        email: 'admin@example.com',
        role: 'admin',
        password: 'password', 
      });
      console.log('Default admin user created successfully.');
    } catch (error: any) {
      if (error.code === 'auth/email-already-exists') {
        console.log('Admin email already exists in Auth, skipping creation.');
      } else {
        console.error('Error creating default admin user:', error);
      }
    }
  }
}

// This function initializes Firebase Admin on the server-side.
// It's designed to be called within Server Actions or Route Handlers.
export function initializeFirebaseAdmin(): FirebaseAdminServices {
    if (getApps().length > 0) {
        const app = getApp();
        // We don't need to run ensureAdminUser on every call, just once at startup.
        return {
            app: app,
            firestore: getFirestore(app),
        };
    }

    const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

    if (!serviceAccountString) {
        try {
            const app = initializeApp();
            ensureAdminUser(app).catch(console.error); // Run as fire-and-forget
            return {
                app: app,
                firestore: getFirestore(app),
            };
        } catch (e) {
            console.error("Automatic Firebase Admin initialization failed.", e);
            throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY is not set and automatic initialization failed.');
        }
    }

    try {
        const serviceAccount = JSON.parse(
            Buffer.from(serviceAccountString, 'base64').toString('utf-8')
        );
        const app = initializeApp({
            credential: cert(serviceAccount),
        });
        ensureAdminUser(app).catch(console.error); // Run as fire-and-forget
        return {
            app: app,
            firestore: getFirestore(app),
        };
    } catch (e) {
        console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY. Ensure it's a valid Base64-encoded JSON.", e);
        throw new Error("The Firebase service account key is not a valid JSON object.");
    }
}
