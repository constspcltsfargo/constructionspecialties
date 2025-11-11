
'use server';

import { initializeFirebase } from "@/firebase/server-init";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import * as bcrypt from 'bcryptjs';
import { z } from "zod";
import { setRoleClaim } from "./claims";
import { initializeFirebaseAdmin } from "@/firebase/admin-init";

const UserSchema = z.object({
    name: z.string().min(1, { message: "Name is required." }),
    username: z.string().min(3, { message: "Username must be at least 3 characters." }),
    email: z.string().email({ message: "Please enter a valid email." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

const LoginSchema = z.object({
    identifier: z.string().min(1, { message: "Email or username is required."}),
    password: z.string().min(1, { message: "Password is required."}),
})

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

export async function loginUser(formData: FormData) {
    const validatedFields = LoginSchema.safeParse(Object.fromEntries(formData));

    if (!validatedFields.success) {
        return {
            error: validatedFields.error.issues.map((issue) => issue.message).join(", "),
        };
    }
    
    const { identifier, password } = validatedFields.data;
    
    const isEmail = identifier.includes('@');

    try {
        const { firestore } = initializeFirebase();
        const { auth } = initializeFirebaseAdmin();
        const usersCollection = collection(firestore, 'users');

        const userQuery = isEmail 
            ? query(usersCollection, where('email', '==', identifier))
            : query(usersCollection, where('username', '==', identifier));

        const querySnapshot = await getDocs(userQuery);

        if (querySnapshot.empty) {
            return { error: "Invalid credentials" };
        }

        const userDoc = querySnapshot.docs[0];
        const user = userDoc.data();

        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (!passwordsMatch) {
            return { error: "Invalid credentials" };
        }
        
        // After successful password validation, check for role and set custom claims.
        // This is crucial for security rules.
        const userAuthRecord = await auth.getUserByEmail(user.email);
        if (user.role) {
            const currentClaims = userAuthRecord.customClaims || {};
            // Only set claim if it's different to avoid unnecessary updates
            if (currentClaims.role !== user.role) {
                await setRoleClaim(userAuthRecord.uid, user.role);
            }
        }
        
        const { password: _, ...userWithoutPassword } = user;

        return { user: { id: userDoc.id, ...userWithoutPassword } };

    } catch (error: any) {
        console.error("Login error:", error);
        return { error: error.message || 'An unexpected error occurred during login.' };
    }
}
