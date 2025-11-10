
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

export async function ensureAdminUser(): Promise<{ success: boolean; created?: boolean, message?: string }> {
  try {
    const app = initializeFirebaseAdmin();
    const firestore = admin.firestore(app);

    const usersCollection = firestore.collection('users');
    const q = usersCollection.limit(1);
    const querySnapshot = await q.get();

    if (querySnapshot.empty) {
      console.log('No users found. Creating default admin user...');
      
      // Store user profile in Firestore
      // NOTE: In a real app, the password should be securely hashed before storing.
      // We are storing it plain for this prototype's login system.
      await firestore.collection('users').doc('default-admin').set({
        displayName: 'Admin User',
        email: 'admin@example.com',
        role: 'admin',
        password: 'password', 
      });

      console.log('Default admin user created in Firestore successfully.');
      return { success: true, created: true };
    }
    
    return { success: true, created: false };
  } catch (error: any) {
    console.error('Error in ensureAdminUser:', error);
    return { success: false, message: error.message || 'An unknown error occurred.' };
  }
}

export async function createUser(userData: NewUser): Promise<{ success: boolean; error?: string }> {
  try {
    const app = initializeFirebaseAdmin();
    const firestore = admin.firestore(app);

    // Create user profile in Firestore. We will use the email as the document ID for simplicity.
    const userRef = firestore.collection('users').doc(userData.email);

    // Check if user already exists
    const userDoc = await userRef.get();
    if (userDoc.exists) {
        return { success: false, error: "A user with this email already exists." };
    }

    await userRef.set({
      displayName: userData.displayName,
      email: userData.email,
      role: userData.role,
      password: userData.password, // Storing password for Firestore-based login
    });
    
    revalidatePath('/admin/users');

    return { success: true };
  } catch (error: any) {
    console.error('Error creating user:', error);
    return { success: false, error: error.message || 'An unknown error occurred.' };
  }
}
