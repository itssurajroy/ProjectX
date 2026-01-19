'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useStorage } from "@/firebase/provider";
import { deleteObject, getDownloadURL, listAll, ref, uploadBytesResumable, StorageReference } from "firebase/storage";
import { Library, UploadCloud, Loader2, Copy, Trash2, Image as ImageIcon } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import ProgressiveImage from "@/components/ProgressiveImage";

interface MediaFile {
    url: string;
    name: string;
    ref: StorageReference;
}

const MediaFileCard = ({ file, onDelete }: { file: MediaFile, onDelete: (ref: StorageReference, name: string) => void }) => {
    const handleCopy = () => {
        navigator.clipboard.writeText(file.url);
        toast.success("URL copied to clipboard!");
    }
    
    return (
        <Card className="group relative">
            <CardContent className="p-0">
                <div className="aspect-square w-full relative">
                    <ProgressiveImage src={file.url} alt={file.name} fill className="object-cover rounded-t-lg"/>
                </div>
                <div className="p-3">
                    <p className="text-xs font-semibold truncate" title={file.name}>{file.name}</p>
                    <div className="flex items-center gap-1 mt-2">
                        <Button variant="outline" size="icon" className="h-7 w-7" onClick={handleCopy}><Copy className="w-3 h-3"/></Button>
                        <Button variant="destructive" size="icon" className="h-7 w-7" onClick={() => onDelete(file.ref, file.name)}><Trash2 className="w-3 h-3"/></Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}


export default function AdminMediaPage() {
    const storage = useStorage();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [files, setFiles] = useState<MediaFile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const listFiles = async () => {
        setIsLoading(true);
        const listRef = ref(storage, 'media');
        try {
            const res = await listAll(listRef);
            const filesData = await Promise.all(
                res.items.map(async (itemRef) => {
                    const url = await getDownloadURL(itemRef);
                    return { url, name: itemRef.name, ref: itemRef };
                })
            );
            setFiles(filesData);
        } catch (error) {
            console.error("Error listing files:", error);
            toast.error("Failed to load media files.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        listFiles();
    }, []);

    const handleFileUpload = (file: File) => {
        if (!file) return;
        setUploading(true);
        const storageRef = ref(storage, `media/${Date.now()}-${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(progress);
            },
            (error) => {
                console.error("Upload failed:", error);
                toast.error("Upload failed. Check console for details.");
                setUploading(false);
            },
            () => {
                toast.success("File uploaded successfully!");
                setUploading(false);
                setUploadProgress(0);
                listFiles(); // Refresh file list
            }
        );
    };

    const handleDeleteFile = async (fileRef: StorageReference, name: string) => {
        if (!confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) return;
        const toastId = toast.loading("Deleting file...");
        try {
            await deleteObject(fileRef);
            toast.success("File deleted.", { id: toastId });
            setFiles(files => files.filter(f => f.ref.fullPath !== fileRef.fullPath));
        } catch (error) {
            console.error("Deletion failed:", error);
            toast.error("Failed to delete file.", { id: toastId });
        }
    };
    
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-3"><Library className="w-8 h-8"/> Media Library</h1>
                <p className="text-muted-foreground">Manage uploaded images and other media assets.</p>
            </div>
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>All Files</CardTitle>
                        <Button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                            <UploadCloud className="w-4 h-4 mr-2"/>
                            Upload File
                        </Button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
                            className="hidden"
                            accept="image/*"
                        />
                    </div>
                    {uploading && (
                         <div className="space-y-1 pt-2">
                             <Progress value={uploadProgress} />
                             <p className="text-xs text-muted-foreground">{Math.round(uploadProgress)}% uploaded</p>
                         </div>
                    )}
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                         <div className="flex justify-center items-center h-64">
                            <Loader2 className="w-12 h-12 animate-spin text-primary"/>
                        </div>
                    ) : files.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {files.map(file => (
                                <MediaFileCard key={file.url} file={file} onDelete={handleDeleteFile} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 border border-dashed border-border/50 rounded-lg">
                            <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4"/>
                            <h3 className="font-semibold text-lg">Your library is empty</h3>
                            <p className="text-muted-foreground text-sm">Upload a file to get started.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
