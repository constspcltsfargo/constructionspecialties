
'use server';

import { z } from 'zod';
import { initializeFirebaseAdmin } from '@/firebase/admin-init';
import * as admin from 'firebase-admin';

const signUpSchema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }),
  username: z.string().min(3, { message: 'Username must be at least 3 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

export type FormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
};

export async function handleSignUp(prevState: FormState, formData: FormData): Promise<FormState> {
  const rawData = Object.fromEntries(formData);
  const validatedFields = signUpSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      message: 'Error: Please check the fields.',
      fields: {
        name: rawData.name as string,
        username: rawData.username as string,
        email: rawData.email as string,
      },
      issues: validatedFields.error.issues.map((issue) => issue.message),
    };
  }

  try {
    const app = initializeFirebaseAdmin();
    const firestore = admin.firestore(app);

    // We will use the email as the document ID for simplicity and to enforce uniqueness
    const userRef = firestore.collection('users').doc(validatedFields.data.email);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      return {
        message: 'Error: A user with this email already exists.',
        fields: validatedFields.data,
        issues: ['A user with this email already exists.'],
      };
    }
    
    // Check for username uniqueness
    const usernameQuery = await firestore.collection('users').where('username', '==', validatedFields.data.username).get();
    if (!usernameQuery.empty) {
        return {
            message: 'Error: This username is already taken.',
            fields: validatedFields.data,
            issues: ['This username is already taken. Please choose another one.'],
        };
    }


    await userRef.set({
      name: validatedFields.data.name,
      username: validatedFields.data.username,
      email: validatedFields.data.email,
      password: validatedFields.data.password, // In a real app, this should be hashed.
      role: 'user', // Default role for new sign-ups
    });

    return { message: 'Success! Your account has been created.' };
  } catch (error: any) {
    console.error('Sign up error:', error);
    return {
      message: 'Error: Could not create account.',
      fields: validatedFields.data,
      issues: [error.message || 'An unexpected server error occurred.'],
    };
  }
}
