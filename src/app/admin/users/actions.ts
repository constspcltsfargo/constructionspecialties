
'use server';

import { z } from 'zod';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeFirebaseAdmin } from '@/firebase/admin-init';

const newUserSchema = z.object({
  displayName: z.string().min(1, 'Display name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['user', 'admin']).default('user'),
});

export async function createUser(values: z.infer<typeof newUserSchema>) {
  try {
    const app = await initializeFirebaseAdmin();
    const auth = getAuth(app);
    const firestore = getFirestore(app);

    // Check if username is already taken. The 'username' is not part of the form, 
    // so we'll create a default one from the email.
    const username = values.email.split('@')[0];
    const usernameQuery = await firestore.collection('users').where('username', '==', username).get();
    if (!usernameQuery.empty) {
      // In a real app, you might want to auto-generate a unique username
      return { success: false, error: 'Username derived from email is already taken.' };
    }
    
    // Create user in Firebase Authentication
    const userRecord = await auth.createUser({
      email: values.email,
      password: values.password,
      displayName: values.displayName,
    });

    // Create user profile in Firestore
    await firestore.collection('users').doc(userRecord.uid).set({
      name: values.displayName,
      username: username,
      email: values.email,
      role: values.role,
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error creating user:', error);
    // Provide a more user-friendly error message
    const message = error.code === 'auth/email-already-exists' 
      ? 'This email address is already in use.'
      : error.message || 'An unexpected error occurred.';
    return { success: false, error: message };
  }
}

const editUserSchema = z.object({
  uid: z.string(),
  name: z.string().min(1, 'Display name is required'),
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['user', 'admin']).default('user'),
});


export async function updateUser(values: z.infer<typeof editUserSchema>) {
    try {
        const app = await initializeFirebaseAdmin();
        const auth = getAuth(app);
        const firestore = getFirestore(app);

        // Update Firebase Auth
        await auth.updateUser(values.uid, {
            displayName: values.name,
        });

        // Update Firestore
        await firestore.collection('users').doc(values.uid).update({
            name: values.name,
            username: values.username,
            role: values.role,
        });
        
        return { success: true };

    } catch (error: any) {
        console.error('Error updating user:', error);
        return { success: false, error: error.message || 'An unexpected error occurred.' };
    }
}


export async function deleteUser(uid: string) {
    try {
        const app = await initializeFirebaseAdmin();
        const auth = getAuth(app);
        const firestore = getFirestore(app);

        // Delete from Firebase Auth
        await auth.deleteUser(uid);

        // Delete from Firestore
        await firestore.collection('users').doc(uid).delete();

        return { success: true };
    } catch(error: any) {
        console.error('Error deleting user:', error);
        return { success: false, error: error.message || 'An unexpected error occurred.' };
    }
}
