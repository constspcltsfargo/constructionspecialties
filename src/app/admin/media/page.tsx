
'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Upload, Trash2, Copy, Check } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface Media {
    id: string;
    filename: string;
    url: string;
    mimeType: string;
    size: number;
    uploadDate: { toDate: () => Date };
}

interface UploadProgress {
    filename: string;
    progress: number;
}

export default function MediaPage() {
    const firestore = useFirestore();
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

    const mediaCollectionRef = useMemoFirebase(() => {
        if (!firestore) return null;
        return collection(firestore, 'media');
    }, [firestore]);

    const { data: media, isLoading, error } = useCollection<Media>(mediaCollectionRef);

    const handleCopyUrl = (url: string) => {
        navigator.clipboard.writeText(url);
        setCopiedUrl(url);
        toast({ title: 'URL copied!' });
        setTimeout(() => setCopiedUrl(null), 2000);
    };

    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            handleUpload(Array.from(files));
        }
    };

    const handleUpload = async (files: File[]) => {
        if (!firestore) return;
        setIsUploading(true);
        setUploadProgress(files.map(file => ({ filename: file.name, progress: 0 })));

        const storage = getStorage();

        const uploadPromises = files.map(file => {
            return new Promise<void>((resolve, reject) => {
                const storageRef = ref(storage, `uploads/${Date.now()}_${file.name}`);
                const uploadTask = uploadBytesResumable(storageRef, file);

                uploadTask.on('state_changed',
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        setUploadProgress(prev => prev.map(p => 
                            p.filename === file.name ? { ...p, progress } : p
                        ));
                    },
                    (error) => {
                        console.error(`Upload failed for ${file.name}:`, error);
                        reject(error);
                    },
                    async () => {
                        try {
                            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                            await addDoc(collection(firestore, 'media'), {
                                filename: file.name,
                                url: downloadURL,
                                mimeType: file.type,
                                size: file.size,
                                uploadDate: serverTimestamp(),
                            });
                            resolve();
                        } catch (dbError) {
                            console.error(`Firestore save failed for ${file.name}:`, dbError);
                            reject(dbError);
                        }
                    }
                );
            });
        });

        try {
            await Promise.all(uploadPromises);
            toast({ title: "Upload complete", description: `${files.length} file(s) uploaded successfully.` });
        } catch (error) {
            toast({ variant: 'destructive', title: "Upload failed", description: "Something went wrong during upload." });
        } finally {
            setIsUploading(false);
            setUploadProgress([]);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleDelete = async (mediaItem: Media) => {
        if (!firestore) return;
        const storage = getStorage();
        const fileRef = ref(storage, mediaItem.url);

        try {
            // Delete from Storage
            await deleteObject(fileRef);
            // Delete from Firestore
            await deleteDoc(doc(firestore, 'media', mediaItem.id));
            toast({ title: 'Media deleted' });
        } catch (error: any) {
            console.error("Deletion error:", error);
            // Handle cases where file might not exist in storage but doc exists in Firestore
            if (error.code === 'storage/object-not-found') {
                 await deleteDoc(doc(firestore, 'media', mediaItem.id));
                 toast({ title: 'Media metadata deleted', description: 'File was not found in storage.'});
            } else {
                toast({ variant: 'destructive', title: 'Deletion failed', description: error.message });
            }
        }
    };


    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Media Library</CardTitle>
                        <CardDescription>Upload, view, and manage your image assets.</CardDescription>
                    </div>
                    <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Image(s)
                    </Button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        multiple
                        className="hidden"
                        accept="image/*"
                    />
                </div>
            </CardHeader>
            <CardContent>
                {isUploading && (
                    <div className="space-y-4 mb-6">
                        <h3 className="font-semibold">Uploading...</h3>
                        {uploadProgress.map(p => (
                            <div key={p.filename} className="space-y-1">
                                <p className="text-sm text-muted-foreground truncate">{p.filename}</p>
                                <Progress value={p.progress} />
                            </div>
                        ))}
                    </div>
                )}
                {isLoading && (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {[...Array(6)].map((_, i) => <Skeleton key={i} className="aspect-square w-full" />)}
                    </div>
                )}
                {error && <p className="text-destructive text-center">Error: {error.message}</p>}
                
                {media && media.length > 0 && (
                     <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {media.map(item => (
                            <Card key={item.id} className="group relative overflow-hidden">
                                <div className="aspect-square relative">
                                     <Image src={item.url} alt={item.filename} fill className="object-cover" sizes="(max-width: 768px) 50vw, 20vw"/>
                                </div>
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                                   <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleCopyUrl(item.url)}>
                                            {copiedUrl === item.url ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Copy URL</TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>

                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button variant="destructive" size="icon" className="h-8 w-8">
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                          <AlertDialogDescription>This will permanently delete the image. This action cannot be undone.</AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                                          <AlertDialogAction onClick={() => handleDelete(item)}>Delete</AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </Card>
                        ))}
                     </div>
                )}
                {media && media.length === 0 && !isLoading && !isUploading && (
                     <div className="text-center py-12 border-2 border-dashed rounded-lg">
                        <h3 className="text-lg font-semibold">No media found</h3>
                        <p className="text-muted-foreground mt-2">Click "Upload Image(s)" to get started.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

// Add Tooltip components since they're used dynamically
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
