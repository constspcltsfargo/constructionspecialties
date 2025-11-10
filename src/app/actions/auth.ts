'use server';

import { initializeFirebase } from "@/firebase/server-init";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import * as bcrypt from 'bcryptjs';
import { z } from "zod";

const UserSchema = z.object({
    name: z.string().min(1, { message: "Name is required." }),
    username: z.string().min(3, { message: "Username must be at least 3 characters." }),
    email: z.string().email({ message: "Please enter a valid email." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
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

    const { name, username, email, password } = validatedFields.data;

    // Check if email or username already exists
    const emailQuery = query(usersCollection, where('email', '==', email));
    const usernameQuery = query(usersCollection, where('username', '==', username));

    const [emailSnapshot, usernameSnapshot] = await Promise.all([
        getDocs(emailQuery),
        getDocs(usernameQuery),
    ]);

    if (!emailSnapshot.empty) {
        return { error: 'Email already exists.' };
    }
    if (!usernameSnapshot.empty) {
        return { error: 'Username already exists.' };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Add user to Firestore
    try {
        const docRef = await addDoc(usersCollection, {
            name,
            username,
            email,
            password: hashedPassword,
            role: 'user', // Default role
        });
        return { user: { id: docRef.id, ...validatedFields.data } };
    } catch (error) {
        return { error: 'Failed to create user.' };
    }
}
