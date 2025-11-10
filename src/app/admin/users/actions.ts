
'use server';

import { initializeFirebaseAdmin } from '@/firebase/admin-init';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import * as admin from 'firebase-admin';

const newUserSchema = z.object({
  displayName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['user', 'admin']),
});

type NewUser = z.infer<typeof newUserSchema>;

export async function createUser(userData: NewUser): Promise<{ success: boolean; error?: string }> {
  try {
    const app = await initializeFirebaseAdmin();
    const auth = admin.auth(app);
    const firestore = admin.firestore(app);

    // Create user in Firebase Authentication
    const userRecord = await auth.createUser({
        email: userData.email,
        password: userData.password,
        displayName: userData.displayName,
    });

    // Create user profile in Firestore, using the UID from Auth as the document ID
    const userRef = firestore.collection('users').doc(userRecord.uid);
    await userRef.set({
      name: userData.displayName,
      username: userData.email, // Using email as username for simplicity
      email: userData.email,
      role: userData.role,
    });

    // If admin, set custom claim
    if (userData.role === 'admin') {
        await auth.setCustomUserClaims(userRecord.uid, { admin: true });
    }
    
    revalidatePath('/admin/users');

    return { success: true };
  } catch (error: any) {
    console.error('Error creating user:', error);
    return { success: false, error: error.message || 'An unknown error occurred.' };
  }
}
