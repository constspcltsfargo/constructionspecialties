
'use server';

import { initializeFirebase } from "@/firebase/server-init";
import { collection, query, where, getDocs, setDoc, doc } from "firebase/firestore";
import { z } from "zod";
import { initializeFirebaseAdmin } from "@/firebase/admin-init";

const SignupSchema = z.object({
    name: z.string().min(1, { message: "Name is required." }),
    username: z.string().min(3, { message: "Username must be at least 3 characters." }),
    email: z.string().email({ message: "Please enter a valid email." }),
    uid: z.string().min(1, { message: "User ID is required." }),
});

export async function createUserProfile(formData: FormData) {
    const validatedFields = SignupSchema.safeParse(Object.fromEntries(formData));

    if (!validatedFields.success) {
        return {
            error: validatedFields.error.issues.map((issue) => issue.message).join(", "),
        };
    }

    const { firestore } = initializeFirebase();
    const { auth } = await initializeFirebaseAdmin();

    const { uid, name, username, email } = validatedFields.data;

    // Check if username already exists
    const usersCollection = collection(firestore, 'users');
    const usernameQuery = query(usersCollection, where('username', '==', username));
    const usernameSnapshot = await getDocs(usernameQuery);

    if (!usernameSnapshot.empty) {
        return { error: 'Username already exists.' };
    }

    // Set user profile in Firestore using the UID from Auth as the document ID
    try {
        await setDoc(doc(firestore, "users", uid), {
            name,
            username,
            email,
            role: 'user', // Default role
        });
        
        // Set custom claim
        await auth.setCustomUserClaims(uid, { role: 'user' });

        return { success: true };
    } catch (error: any) {
        console.error("Error creating user profile:", error);
        return { error: 'Failed to create user profile in database.' };
    }
}
