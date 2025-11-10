'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { uploadMedia, deleteMedia } from '../actions/media';

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

export default function MediaPage() {
    const firestore = useFirestore();
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
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
            handleUpload(files);
        }
    };

    const handleUpload = async (files: FileList) => {
        setIsUploading(true);
        const formData = new FormData();
        Array.from(files).forEach(file => {
            formData.append('files', file);
        });

        try {
            const result = await uploadMedia(formData);
            if (result.error) {
                throw new Error(result.error);
            }
            toast({ title: "Upload complete", description: `${result.count} file(s) uploaded successfully.` });
        } catch (error: any) {
            toast({ variant: 'destructive', title: "Upload failed", description: error.message || "Something went wrong during upload." });
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleDelete = async (mediaItem: Media) => {
        try {
            const result = await deleteMedia(mediaItem.id, mediaItem.url);
            if (result.error) {
                throw new Error(result.error);
            }
            toast({ title: 'Media deleted' });
        } catch (error: any) {
            console.error("Deletion error:", error);
            toast({ variant: 'destructive', title: 'Deletion failed', description: error.message });
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
                        {isUploading ? <><span className="animate-spin mr-2">...</span> Uploading...</> : <><Upload className="mr-2 h-4 w-4" /> Upload Image(s)</>}
                    </Button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        multiple
                        className="hidden"
                        accept="image/*"
                        disabled={isUploading}
                    />
                </div>
            </CardHeader>
            <CardContent>
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
