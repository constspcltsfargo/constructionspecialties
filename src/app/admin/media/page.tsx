
'use client';

import { useState, useRef, ChangeEvent, useMemo } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { uploadMedia, deleteMedia } from '../actions/media';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Upload, Trash2, Copy, Check, FolderPlus, Folder } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';


interface Media {
    id: string;
    filename: string;
    url: string;
    mimeType: string;
    size: number;
    uploadDate: { toDate: () => Date };
    folder?: string;
}

const UNCATEGORIZED_VALUE = "__uncategorized__";

export default function MediaPage() {
    const firestore = useFirestore();
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
    const [selectedFolder, setSelectedFolder] = useState<string>(UNCATEGORIZED_VALUE);
    const [isCreatingFolder, setIsCreatingFolder] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');

    const mediaCollectionRef = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'media'), orderBy('uploadDate', 'desc'));
    }, [firestore]);

    const { data: media, isLoading, error } = useCollection<Media>(mediaCollectionRef);

    const { folders, groupedMedia } = useMemo(() => {
        if (!media) return { folders: [], groupedMedia: {} };
        const folderSet = new Set<string>();
        const groups: { [key: string]: Media[] } = { [UNCATEGORIZED_VALUE]: [] };

        media.forEach(item => {
            if (item.folder) {
                folderSet.add(item.folder);
                if (!groups[item.folder]) {
                    groups[item.folder] = [];
                }
                groups[item.folder].push(item);
            } else {
                groups[UNCATEGORIZED_VALUE].push(item);
            }
        });
        
        return {
            folders: Array.from(folderSet).sort(),
            groupedMedia: groups
        };
    }, [media]);

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

        if (selectedFolder && selectedFolder !== UNCATEGORIZED_VALUE) {
            formData.append('folderPath', selectedFolder);
        }

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

    const handleCreateFolder = () => {
        const trimmedName = newFolderName.trim();
        if (trimmedName && !folders.includes(trimmedName) && trimmedName !== UNCATEGORIZED_VALUE) {
            setSelectedFolder(trimmedName);
            setIsCreatingFolder(false);
            setNewFolderName('');
        } else if (folders.includes(trimmedName)) {
            toast({ variant: 'destructive', title: 'Folder exists', description: 'A folder with this name already exists.' });
        }
    }


    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center flex-wrap gap-4">
                    <div>
                        <CardTitle>Media Library</CardTitle>
                        <CardDescription>Upload, view, and manage your assets.</CardDescription>
                    </div>
                    <div className="flex gap-2 flex-wrap justify-end">
                        <div className="flex gap-2 items-center">
                            {isCreatingFolder ? (
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="New folder name..."
                                        value={newFolderName}
                                        onChange={(e) => setNewFolderName(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
                                    />
                                    <Button onClick={handleCreateFolder}>Create</Button>
                                    <Button variant="ghost" onClick={() => setIsCreatingFolder(false)}>Cancel</Button>
                                </div>
                            ) : (
                                <>
                                    <Select value={selectedFolder} onValueChange={setSelectedFolder}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Select folder..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={UNCATEGORIZED_VALUE}>Uncategorized</SelectItem>
                                            {folders.map(folder => (
                                                <SelectItem key={folder} value={folder}>{folder}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Button variant="outline" size="icon" onClick={() => setIsCreatingFolder(true)} title="Create new folder">
                                        <FolderPlus className="h-4 w-4" />
                                    </Button>
                                </>
                            )}
                        </div>

                        <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                            {isUploading ? <><span className="animate-spin mr-2">...</span> Uploading...</> : <><Upload className="mr-2 h-4 w-4" /> Upload</>}
                        </Button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            multiple
                            className="hidden"
                            accept="image/*,video/*"
                            disabled={isUploading}
                        />
                    </div>
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
                     <Accordion type="multiple" defaultValue={["__uncategorized__", ...folders]} className="w-full">
                        {Object.entries(groupedMedia).map(([folderName, items]) => {
                            if (items.length === 0) return null;
                            const displayFolderName = folderName === UNCATEGORIZED_VALUE ? 'Uncategorized' : folderName;
                            return (
                                <AccordionItem value={folderName} key={folderName}>
                                    <AccordionTrigger className="capitalize text-lg font-semibold">
                                       <div className="flex items-center gap-2">
                                         <Folder className="h-5 w-5"/> {displayFolderName} ({items.length})
                                       </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 pt-4">
                                            {items.map(item => (
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
                                                            <AlertDialogDescription>This will permanently delete the media file. This action cannot be undone.</AlertDialogDescription>
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
                                    </AccordionContent>
                                </AccordionItem>
                            )
                        })}
                     </Accordion>
                )}
                {media && media.length === 0 && !isLoading && !isUploading && (
                     <div className="text-center py-12 border-2 border-dashed rounded-lg">
                        <h3 className="text-lg font-semibold">No media found</h3>
                        <p className="text-muted-foreground mt-2">Click "Upload" to get started.</p>
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

    