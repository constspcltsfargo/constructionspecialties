'use server';

import { initializeFirebaseAdmin } from '@/firebase/admin-init';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase-admin/storage';
import { getFirestore, collection, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';

export async function uploadMedia(formData: FormData) {
    const files = formData.getAll('files') as File[];
    if (!files || files.length === 0) {
        return { error: 'No files provided.' };
    }

    const { firebaseApp } = initializeFirebaseAdmin();
    const storage = getStorage(firebaseApp);
    const bucket = storage.bucket();
    const firestore = getFirestore(firebaseApp);

    try {
        const uploadPromises = files.map(async (file) => {
            const buffer = Buffer.from(await file.arrayBuffer());
            const storageRef = bucket.file(`uploads/${Date.now()}_${file.name}`);
            
            await uploadBytes(storageRef, buffer, {
                contentType: file.type,
            });

            const downloadURL = await getDownloadURL(storageRef);

            await addDoc(collection(firestore, 'media'), {
                filename: file.name,
                url: downloadURL,
                mimeType: file.type,
                size: file.size,
                uploadDate: serverTimestamp(),
            });
        });

        await Promise.all(uploadPromises);
        revalidatePath('/admin/media');
        return { success: true, count: files.length };
    } catch (error: any) {
        console.error('Upload failed:', error);
        return { error: 'Failed to upload files.' };
    }
}


export async function deleteMedia(mediaId: string, fileUrl: string) {
    const { firebaseApp } = initializeFirebaseAdmin();
    const storage = getStorage(firebaseApp);
    const firestore = getFirestore(firebaseApp);

    try {
        // Delete from Storage
        const fileRef = ref(storage, fileUrl);
        await deleteObject(fileRef);
    } catch (error: any) {
        // If the file doesn't exist in storage, we can still proceed to delete from Firestore
        if (error.code !== 'storage/object-not-found') {
            console.error('Storage deletion error:', error);
            return { error: 'Failed to delete file from storage.' };
        }
    }
    
    try {
        // Delete from Firestore
        await deleteDoc(doc(firestore, 'media', mediaId));
        revalidatePath('/admin/media');
        return { success: true };
    } catch (error: any) {
        console.error('Firestore deletion error:', error);
        return { error: 'Failed to delete media record from Firestore.' };
    }
}
