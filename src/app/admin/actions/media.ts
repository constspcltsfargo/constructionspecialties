
'use server';
import { config } from 'dotenv';
config();

import { initializeFirebaseAdmin } from '@/firebase/admin-init';
import { revalidatePath } from 'next/cache';

export async function createFolder(folderName: string) {
    if (!folderName || folderName.trim().length === 0) {
        return { error: 'Folder name cannot be empty.' };
    }

    const { firestore } = initializeFirebaseAdmin();
    const foldersCollection = firestore.collection('folders');

    try {
        // Check if folder already exists
        const q = foldersCollection.where('name', '==', folderName.trim());
        const querySnapshot = await q.get();
        if (!querySnapshot.empty) {
            return { error: 'Folder with this name already exists.' };
        }

        const newFolder = {
            name: folderName.trim(),
            createdAt: firestore.FieldValue.serverTimestamp(),
        };
        const docRef = await foldersCollection.add(newFolder);
        revalidatePath('/admin/media');
        // Return the created folder with its new ID
        return { success: true, folder: { id: docRef.id, name: newFolder.name, createdAt: new Date() } };
    } catch (error: any) {
        console.error('Folder creation failed:', error);
        return { error: error.message || 'Failed to create folder.' };
    }
}


export async function uploadMedia(formData: FormData) {
    const files = formData.getAll('files') as File[];
    const folderPath = formData.get('folderPath') as string || '';

    if (!files || files.length === 0) {
        return { error: 'No files provided.' };
    }

    const { storage, firestore } = initializeFirebaseAdmin();
    const bucket = storage.bucket();

    try {
        const uploadPromises = files.map(async (file) => {
            const fileName = `${Date.now()}_${file.name.replace(/\s/g, '_')}`;
            const path = folderPath && folderPath !== '__uncategorized__' 
                ? `uploads/${folderPath}/${fileName}` 
                : `uploads/${fileName}`;
            
            const buffer = Buffer.from(await file.arrayBuffer());
            
            const fileUpload = bucket.file(path);
            await fileUpload.save(buffer, {
                contentType: file.type,
            });
            
            // Make the file publicly readable
            await fileUpload.makePublic();

            // Use the public URL
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${path}`;

            await firestore.collection('media').add({
                filename: file.name,
                url: publicUrl,
                mimeType: file.type,
                size: file.size,
                uploadDate: firestore.FieldValue.serverTimestamp(),
                folder: folderPath === '__uncategorized__' ? '' : folderPath,
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
    const { storage, firestore } = initializeFirebaseAdmin();
    const bucket = storage.bucket();

    try {
        // Extract the file path from the public URL
        const url = new URL(fileUrl);
        // The path in storage is everything after the bucket name in the URL's pathname.
        const filePath = url.pathname.substring(url.pathname.indexOf('/', 1) + 1);
        
        if (filePath) {
            await bucket.file(filePath).delete();
        }

    } catch (error: any) {
        // It's okay if the file doesn't exist in storage, we still want to delete the DB record.
        // Log other errors but don't block the Firestore deletion.
        if (error.code !== 404 && error.code !== 'storage/object-not-found') {
            console.error('Storage deletion error:', error);
        }
    }
    
    try {
        await firestore.collection('media').doc(mediaId).delete();
        revalidatePath('/admin/media');
        return { success: true };
    } catch (error: any) {
        console.error('Firestore deletion error:', error);
        return { error: 'Failed to delete media record from Firestore.' };
    }
}
