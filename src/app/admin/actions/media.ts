
'use server';
import { config } from 'dotenv';
config({ path: '.env.local' });

import { initializeFirebaseAdmin } from '@/firebase/admin-init';
import { getStorage } from 'firebase-admin/storage';
import { getFirestore, collection, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';

export async function uploadMedia(formData: FormData) {
    const files = formData.getAll('files') as File[];
    const folderPath = formData.get('folderPath') as string || '';

    if (!files || files.length === 0) {
        return { error: 'No files provided.' };
    }

    const { firebaseApp } = initializeFirebaseAdmin();
    const storage = getStorage(firebaseApp);
    const bucket = storage.bucket();
    const firestore = getFirestore(firebaseApp);

    try {
        const uploadPromises = files.map(async (file) => {
            const path = folderPath ? `uploads/${folderPath}/${Date.now()}_${file.name}` : `uploads/${Date.now()}_${file.name}`;
            
            const buffer = Buffer.from(await file.arrayBuffer());
            
            // Use bucket.file().save() for admin SDK
            await bucket.file(path).save(buffer, {
                contentType: file.type,
            });

            // Get download URL
            const downloadURL = await bucket.file(path).getSignedUrl({
                action: 'read',
                expires: '03-09-2491' // A far-future date
            }).then(urls => urls[0]);


            await addDoc(collection(firestore, 'media'), {
                filename: file.name,
                url: downloadURL,
                mimeType: file.type,
                size: file.size,
                uploadDate: serverTimestamp(),
                folder: folderPath,
            });
        });

        await Promise.all(uploadPromises);
        revalidatePath('/admin/media');
        return { success: true, count: files.length };
    } catch (error: any) {
        console.error('Upload failed:', error);
        return { error: error.message || 'Failed to upload files.' };
    }
}


export async function deleteMedia(mediaId: string, fileUrl: string) {
    const { firebaseApp } = initializeFirebaseAdmin();
    const storage = getStorage(firebaseApp);
    const bucket = storage.bucket();
    const firestore = getFirestore(firebaseApp);

    try {
        // Create a file object from the URL
        const url = new URL(fileUrl);
        // The pathname is /v0/b/{bucket}/o/{path}?...
        // We need to decode and get the path after the /o/
        const filePath = decodeURIComponent(url.pathname.split('/o/')[1].split('?')[0]);
        await bucket.file(filePath).delete();

    } catch (error: any) {
        // If the file doesn't exist in storage, we can still proceed to delete from Firestore
        if (error.code !== 404 && error.code !== 'storage/object-not-found') {
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
