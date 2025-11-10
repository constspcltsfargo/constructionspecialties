
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
      name: userData.displayName, // Match the updated schema
      username: userData.email, // Use email as username for admin-created users for simplicity
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
