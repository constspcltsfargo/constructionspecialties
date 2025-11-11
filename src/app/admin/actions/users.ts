
'use server';
import { config } from 'dotenv';
config();

import { initializeFirebaseAdmin } from "@/firebase/admin-init";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const UserSchema = z.object({
    name: z.string().min(1, { message: "Name is required." }),
    username: z.string().min(3, { message: "Username must be at least 3 characters." }),
    email: z.string().email({ message: "Please enter a valid email." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
    role: z.enum(['user', 'admin']),
});

const EditUserSchema = z.object({
    id: z.string().min(1),
    name: z.string().min(1, 'Name is required'),
    username: z.string().min(3, 'Username must be at least 3 characters'),
    role: z.enum(['user', 'admin']),
    password: z.string().optional(),
});


export async function createUser(formData: FormData) {
    const validatedFields = UserSchema.safeParse(Object.fromEntries(formData));

    if (!validatedFields.success) {
        return {
            error: validatedFields.error.issues.map((issue) => issue.message).join(", "),
        };
    }

    const { auth, firestore } = await initializeFirebaseAdmin();
    const { name, username, email, password, role } = validatedFields.data;

    // Check if username already exists in Firestore
    const usersCollection = firestore.collection('users');
    const usernameQuery = usersCollection.where('username', '==', username);
    const usernameSnapshot = await usernameQuery.get();
    if (!usernameSnapshot.empty) return { error: 'Username already exists in Firestore.' };

    try {
        // Create user in Firebase Auth
        const userRecord = await auth.createUser({
            email,
            password,
            displayName: name,
        });

        // Set custom claim for role
        await auth.setCustomUserClaims(userRecord.uid, { role });
        
        // Add user profile to Firestore with the Auth UID as the document ID
        await firestore.collection('users').doc(userRecord.uid).set({ 
            name, 
            username, 
            email, 
            role,
            photoURL: userRecord.photoURL || null 
        });
        
        revalidatePath('/admin/users');
        return { user: { id: userRecord.uid, name, username, email, role } };

    } catch (error: any) {
        if (error.code === 'auth/email-already-exists') {
            return { error: 'Email already exists in Firebase Authentication.' };
        }
        console.error("Error creating user:", error);
        return { error: error.message || 'Failed to create user.' };
    }
}


export async function updateUser(formData: FormData) {
    const validatedFields = EditUserSchema.safeParse(Object.fromEntries(formData));

     if (!validatedFields.success) {
        return {
            error: validatedFields.error.issues.map((issue) => issue.message).join(", "),
        };
    }

    const { auth, firestore } = await initializeFirebaseAdmin();
    const { id, password, role, ...userData } = validatedFields.data;
    const userRef = firestore.collection('users').doc(id);

    try {
        const authUpdatePayload: any = {};
        const firestoreUpdatePayload: any = { ...userData };

        if (password) {
            if (password.length < 6) return { error: "Password must be at least 6 characters." };
            authUpdatePayload.password = password;
        }

        if (userData.name) {
            authUpdatePayload.displayName = userData.name;
        }

        // Update Auth user
        if (Object.keys(authUpdatePayload).length > 0) {
            await auth.updateUser(id, authUpdatePayload);
        }

        // Update role via custom claims
        if (role) {
            await auth.setCustomUserClaims(id, { role });
            firestoreUpdatePayload.role = role;
        }
        
        // Update Firestore user document
        await userRef.update(firestoreUpdatePayload);
        
        const updatedDocSnapshot = await userRef.get();
        const user = {id: updatedDocSnapshot.id, ...updatedDocSnapshot.data()}

        revalidatePath('/admin/users');
        return { user };
    } catch (error: any) {
        console.error("Error updating user:", error);
        return { error: error.message || 'Failed to update user.' };
    }
}

export async function deleteUser(userId: string) {
    const { auth, firestore } = await initializeFirebaseAdmin();
    const userRef = firestore.collection('users').doc(userId);

    try {
        // Delete from Auth first
        await auth.deleteUser(userId);
        // Then delete from Firestore
        await userRef.delete();
        revalidatePath('/admin/users');
        return { success: true };
    } catch (error: any) {
        console.error("Error deleting user:", error);
        // If user is already deleted from auth, we might get an error, but still want to delete from firestore
        if (error.code === 'auth/user-not-found') {
            try {
                await userRef.delete();
                revalidatePath('/admin/users');
                return { success: true };
            } catch (fsError: any) {
                 return { error: fsError.message || 'Failed to delete user from Firestore.' };
            }
        }
        return { error: error.message || 'Failed to delete user.' };
    }
}
