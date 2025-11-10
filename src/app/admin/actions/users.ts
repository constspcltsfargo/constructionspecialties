
'use server';

import { initializeFirebase } from "@/firebase/server-init";
import { collection, query, where, getDocs, addDoc, doc, updateDoc, deleteDoc, setDoc } from "firebase/firestore";
import * as bcrypt from 'bcryptjs';
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { setRoleClaim } from "../../actions/claims";
import { initializeFirebaseAdmin } from "@/firebase/admin-init";

const UserSchema = z.object({
    name: z.string().min(1, { message: "Name is required." }),
    username: z.string().min(3, { message: "Username must be at least 3 characters." }),
    email: z.string().email({ message: "Please enter a valid email." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
    role: z.enum(['user', 'admin']),
});

const EditUserSchema = UserSchema.partial().extend({
    id: z.string().min(1),
    password: z.string().optional(),
});

// This function needs to get the UID from the newly created user in Auth
// For now, we are creating users in firestore, not in Auth.
// We need to create the user in Auth first, then in firestore
// Let's use the Admin SDK to create the user in Auth
export async function createUser(formData: FormData) {
    const validatedFields = UserSchema.safeParse(Object.fromEntries(formData));

    if (!validatedFields.success) {
        return {
            error: validatedFields.error.issues.map((issue) => issue.message).join(", "),
        };
    }

    const { auth } = initializeFirebaseAdmin();
    const { firestore } = initializeFirebase();
    const usersCollection = collection(firestore, 'users');
    const { name, username, email, password, role } = validatedFields.data;

    // Check if email or username already exists in Firestore
    const emailQuery = query(usersCollection, where('email', '==', email));
    const usernameQuery = query(usersCollection, where('username', '==', username));

    const [emailSnapshot, usernameSnapshot] = await Promise.all([
        getDocs(emailQuery),
        getDocs(usernameQuery),
    ]);

    if (!emailSnapshot.empty) return { error: 'Email already exists in Firestore.' };
    if (!usernameSnapshot.empty) return { error: 'Username already exists in Firestore.' };

    try {
        // Create user in Firebase Auth
        const userRecord = await auth.createUser({
            email,
            password,
            displayName: name,
        });

        // Set custom claim for role
        await setRoleClaim(userRecord.uid, role);
        
        // Hash password for storing in firestore (optional, but good practice if you ever need it)
        const hashedPassword = await bcrypt.hash(password, 10);

        // Add user to Firestore with the Auth UID as the document ID
        const userRef = doc(firestore, 'users', userRecord.uid);
        await setDoc(userRef, { name, username, email, password: hashedPassword, role });
        
        const newUser = { id: userRecord.uid, name, username, email, role };
        revalidatePath('/admin/users');
        return { user: newUser };

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

    const { firestore } = initializeFirebase();
    const { id, password, role, ...userData } = validatedFields.data;
    const userRef = doc(firestore, 'users', id);

    try {
        const updateData: any = { ...userData };
        if (password && password.length >= 6) {
            updateData.password = await bcrypt.hash(password, 10);
            const { auth } = initializeFirebaseAdmin();
            await auth.updateUser(id, { password: password });
        } else if (password) {
            return { error: "Password must be at least 6 characters."}
        }

        if (role) {
            await setRoleClaim(id, role);
            updateData.role = role;
        }
        
        await updateDoc(userRef, updateData);
        
        const updatedDocSnapshot = await getDoc(userRef);
        const user = {id: updatedDocSnapshot.id, ...updatedDocSnapshot.data()}

        revalidatePath('/admin/users');
        return { user };
    } catch (error: any) {
        console.log(error);
        return { error: error.message || 'Failed to update user.' };
    }
}

export async function deleteUser(userId: string) {
    const { auth } = initializeFirebaseAdmin();
    const { firestore } = initializeFirebase();
    const userRef = doc(firestore, 'users', userId);

    try {
        // Delete from Auth first
        await auth.deleteUser(userId);
        // Then delete from Firestore
        await deleteDoc(userRef);
        revalidatePath('/admin/users');
        return { success: true };
    } catch (error: any) {
        console.error("Error deleting user:", error);
        // If user is already deleted from auth, we might get an error, but still want to delete from firestore
        if (error.code === 'auth/user-not-found') {
            try {
                await deleteDoc(userRef);
                revalidatePath('/admin/users');
                return { success: true };
            } catch (fsError: any) {
                 return { error: fsError.message || 'Failed to delete user from Firestore.' };
            }
        }
        return { error: error.message || 'Failed to delete user.' };
    }
}
