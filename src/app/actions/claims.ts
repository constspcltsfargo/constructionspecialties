
'use server';
import { config } from 'dotenv';
config();

import { initializeFirebaseAdmin } from "@/firebase/admin-init";

export async function setRoleClaim(uid: string, role: 'admin' | 'user') {
    const { auth } = initializeFirebaseAdmin();
    try {
        await auth.setCustomUserClaims(uid, { role });
        return { success: true };
    } catch (error: any) {
        console.error('Error setting custom claim:', error);
        return { error: 'Failed to set user role claim.' };
    }
}
