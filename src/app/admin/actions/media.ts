
'use server';
import { config } from 'dotenv';

import { initializeFirebaseAdmin } from '@/firebase/admin-init';
import { getStorage } from 'firebase-admin/storage';
import { getFirestore, collection, addDoc, serverTimestamp, deleteDoc, doc, where, query, getDocs } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';

export async function createFolder(folderName: string) {
    config({ path: '.env.local' }); // Load env vars right before use
    if (!folderName || folderName.trim().length === 0) {
        return { error: 'Folder name cannot be empty.' };
    }

    const { firebaseApp } = initializeFirebaseAdmin();
    const firestore = getFirestore(firebaseApp);
    const foldersCollection = collection(firestore, 'folders');

    try {
        // Check if folder already exists
        const q = query(foldersCollection, where('name', '==', folderName.trim()));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            return { error: 'Folder with this name already exists.' };
        }

        const newFolder = {
            name: folderName.trim(),
            createdAt: serverTimestamp(),
        };
        await addDoc(foldersCollection, newFolder);
        revalidatePath('/admin/media');
        return { success: true, folder: newFolder };
    } catch (error: any) {
        console.error('Folder creation failed:', error);
        return { error: error.message || 'Failed to create folder.' };
    }
}


export async function uploadMedia(formData: FormData) {
    config({ path: '.env.local' }); // Load env vars right before use
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
            const fileName = `${Date.now()}_${file.name.replace(/\s/g, '_')}`;
            const path = folderPath && folderPath !== '__uncategorized__' 
                ? `uploads/${folderPath}/${fileName}` 
                : `uploads/${fileName}`;
            
            const buffer = Buffer.from(await file.arrayBuffer());
            
            const fileUpload = bucket.file(path);
            await fileUpload.save(buffer, {
                contentType: file.type,
                // Make the file publicly readable
                public: true,
            });

            // Construct the public URL manually
            const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(path)}?alt=media`;

            await addDoc(collection(firestore, 'media'), {
                filename: file.name,
                url: publicUrl,
                mimeType: file.type,
                size: file.size,
                uploadDate: serverTimestamp(),
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
    config({ path: '.env.local' }); // Load env vars right before use
    const { firebaseApp } = initializeFirebaseAdmin();
    const storage = getStorage(firebaseApp);
    const bucket = storage.bucket();
    const firestore = getFirestore(firebaseApp);

    try {
        // Extract the file path from the public URL
        const url = new URL(fileUrl);
        const encodedPath = url.pathname.split('/o/')[1].split('?')[0];
        const filePath = decodeURIComponent(encodedPath);
        
        await bucket.file(filePath).delete();

    } catch (error: any) {
        if (error.code !== 404 && error.code !== 'storage/object-not-found') {
            console.error('Storage deletion error:', error);
            // Don't return, still try to delete from Firestore
            // return { error: 'Failed to delete file from storage.' };
        }
    }
    
    try {
        await deleteDoc(doc(firestore, 'media', mediaId));
        revalidatePath('/admin/media');
        return { success: true };
    } catch (error: any) {
        console.error('Firestore deletion error:', error);
        return { error: 'Failed to delete media record from Firestore.' };
    }
}
