'use server';

import { initializeFirebase } from "@/firebase/server-init";
import { collection, query, where, getDocs, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import * as bcrypt from 'bcryptjs';
import { z } from "zod";
import { revalidatePath } from "next/cache";

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

export async function createUser(formData: FormData) {
    const validatedFields = UserSchema.safeParse(Object.fromEntries(formData));

    if (!validatedFields.success) {
        return {
            error: validatedFields.error.issues.map((issue) => issue.message).join(", "),
        };
    }

    const { firestore } = initializeFirebase();
    const usersCollection = collection(firestore, 'users');
    const { name, username, email, password, role } = validatedFields.data;

    const emailQuery = query(usersCollection, where('email', '==', email));
    const usernameQuery = query(usersCollection, where('username', '==', username));

    const [emailSnapshot, usernameSnapshot] = await Promise.all([
        getDocs(emailQuery),
        getDocs(usernameQuery),
    ]);

    if (!emailSnapshot.empty) return { error: 'Email already exists.' };
    if (!usernameSnapshot.empty) return { error: 'Username already exists.' };

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const docRef = await addDoc(usersCollection, { name, username, email, password: hashedPassword, role });
        const newUser = { id: docRef.id, name, username, email, role };
        revalidatePath('/admin/users');
        return { user: newUser };
    } catch (error) {
        return { error: 'Failed to create user in Firestore.' };
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
    const { id, password, ...userData } = validatedFields.data;
    const userRef = doc(firestore, 'users', id);

    try {
        const updateData: any = { ...userData };
        if (password && password.length >= 6) {
            updateData.password = await bcrypt.hash(password, 10);
        } else if (password) {
            return { error: "Password must be at least 6 characters."}
        }
        
        await updateDoc(userRef, updateData);
        
        const updatedDoc = await getDocs(query(collection(firestore, 'users'), where('__name__', '==', id)));
        const user = {id: updatedDoc.docs[0].id, ...updatedDoc.docs[0].data()}

        revalidatePath('/admin/users');
        return { user };
    } catch (error) {
        console.log(error);
        return { error: 'Failed to update user.' };
    }
}

export async function deleteUser(userId: string) {
    const { firestore } = initializeFirebase();
    const userRef = doc(firestore, 'users', userId);

    try {
        await deleteDoc(userRef);
        revalidatePath('/admin/users');
        return { success: true };
    } catch (error) {
        return { error: 'Failed to delete user.' };
    }
}
