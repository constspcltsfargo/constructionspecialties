
'use server';

import { getAuth } from 'firebase-admin/auth';
import { getFirestore, doc, setDoc, collection, getDocs, limit, query } from 'firebase-admin/firestore';
import { initializeFirebaseAdmin } from '@/firebase/admin-init';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const newUserSchema = z.object({
  displayName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['user', 'admin']),
});

type NewUser = z.infer<typeof newUserSchema>;

export async function ensureAdminUser(): Promise<{ success: boolean; created?: boolean, message?: string }> {
  try {
    const { app } = initializeFirebaseAdmin();
    const firestore = getFirestore(app);
    const auth = getAuth(app);

    const usersCollection = collection(firestore, 'users');
    const q = query(usersCollection, limit(1));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log('No users found. Creating default admin user...');
      
      const userRecord = await auth.createUser({
        email: 'admin@example.com',
        password: 'password',
        displayName: 'Admin User',
        emailVerified: true,
        disabled: false,
      });
      
      await auth.setCustomUserClaims(userRecord.uid, { role: 'admin' });

      const userProfileRef = doc(firestore, 'users', userRecord.uid);
      await setDoc(userProfileRef, {
        displayName: 'Admin User',
        email: 'admin@example.com',
        role: 'admin',
        password: 'password', // Storing for Firestore-based login
      });
      
       const adminRoleRef = doc(firestore, 'roles_admin', userRecord.uid);
       await setDoc(adminRoleRef, { role: 'admin' });

      console.log('Default admin user created successfully.');
      return { success: true, created: true };
    }
    
    return { success: true, created: false };
  } catch (error: any) {
    console.error('Error in ensureAdminUser:', error);
    // Don't throw, just report failure
    return { success: false, message: error.message || 'An unknown error occurred.' };
  }
}

export async function createUser(userData: NewUser): Promise<{ success: boolean; error?: string }> {
  try {
    const { app } = initializeFirebaseAdmin();
    const auth = getAuth(app);
    const firestore = getFirestore(app);

    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email: userData.email,
      password: userData.password,
      displayName: userData.displayName,
      emailVerified: true,
      disabled: false,
    });
    
    // Set custom claim if the user is an admin
    if (userData.role === 'admin') {
      await auth.setCustomUserClaims(userRecord.uid, { role: 'admin' });
      const adminRoleRef = doc(firestore, 'roles_admin', userRecord.uid);
      await setDoc(adminRoleRef, { role: 'admin' });
    }

    // Create user profile in Firestore
    const userProfileRef = doc(firestore, 'users', userRecord.uid);
    await setDoc(userProfileRef, {
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
