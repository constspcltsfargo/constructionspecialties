
'use server';

import { initializeFirebaseAdmin } from '@/firebase/admin-init';
import { revalidatePath } from 'next/cache';

export async function deleteEstimateRequest(requestId: string) {
    if (!requestId) {
        return { error: 'Request ID is required.' };
    }

    const { firestore } = await initializeFirebaseAdmin();
    const requestRef = firestore.collection('estimateRequests').doc(requestId);

    try {
        await requestRef.delete();
        revalidatePath('/admin/estimates');
        return { success: true };
    } catch (error: any) {
        console.error('Error deleting estimate request:', error);
        return { error: error.message || 'Failed to delete estimate request.' };
    }
}
