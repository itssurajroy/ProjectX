'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useCollection, useFirestore, deleteDocumentNonBlocking } from "@/firebase";
import { Comment } from "@/lib/types/comment";
import { Loader2, MessageSquare, Trash2, Search, MoreHorizontal, Link as LinkIcon, AlertTriangle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import toast from "react-hot-toast";
import { doc } from "firebase/firestore";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "use-debounce";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AdminCommentsPage() {
    const { data: comments, loading, error } = useCollection<Comment>('comments');
    const firestore = useFirestore();
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm] = useDebounce(searchTerm, 300);

    const sortedComments = useMemo(() => {
        return comments?.sort((a, b) => (b.timestamp?.toMillis() || 0) - (a.timestamp?.toMillis() || 0));
    }, [comments]);
    
    const filteredComments = useMemo(() => {
        if (!sortedComments) return [];
        if (!debouncedSearchTerm) return sortedComments;

        const lowercasedFilter = debouncedSearchTerm.toLowerCase();
        return sortedComments.filter(comment => 
            comment.text.toLowerCase().includes(lowercasedFilter) ||
            comment.username.toLowerCase().includes(lowercasedFilter) ||
            comment.userId.toLowerCase().includes(lowercasedFilter) ||
            comment.animeId.toLowerCase().includes(lowercasedFilter)
        );
    }, [sortedComments, debouncedSearchTerm]);


    const handleDelete = (commentId: string) => {
        if (!confirm('Are you sure you want to delete this comment? This cannot be undone.')) {
            return;
        }
        const toastId = toast.loading('Deleting comment...');
        const docRef = doc(firestore, 'comments', commentId);
        deleteDocumentNonBlocking(docRef);
        toast.success('Comment deleted.', { id: toastId });
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-3"><MessageSquare className="w-8 h-8"/> Comments Management</h1>
                <p className="text-muted-foreground">Browse, search, and moderate all user comments.</p>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>All Comments</CardTitle>
                            <CardDescription>Found {filteredComments?.length.toLocaleString() || '...'} comments.</CardDescription>
                        </div>
                         <div className="relative w-full max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input 
                                placeholder="Search by text, user, anime ID..." 
                                className="pl-10" 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead className="w-[40%]">Comment</TableHead>
                                <TableHead>Context</TableHead>
                                <TableHead>Posted</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-10">
                                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                                    </TableCell>
                                </TableRow>
                            ) : error ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-10 text-destructive">
                                        Error: {error.message}
                                    </TableCell>
                                </TableRow>
                            ) : filteredComments && filteredComments.length > 0 ? (
                                filteredComments.map(comment => (
                                <TableRow key={comment.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Avatar className="w-8 h-8">
                                                <AvatarImage src={comment.userAvatar || `https://api.dicebear.com/8.x/identicon/svg?seed=${comment.userId}`} />
                                                <AvatarFallback>{comment.username?.[0] || 'A'}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-semibold truncate">{comment.username}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <p className="text-sm line-clamp-2" title={comment.text}>
                                            {comment.spoiler && <Badge variant="destructive" className="mr-2"><AlertTriangle className="w-3 h-3 mr-1" />Spoiler</Badge>}
                                            {comment.text}
                                        </p>
                                    </TableCell>
                                    <TableCell>
                                        <Link href={comment.episodeNumber ? `/watch/${comment.animeId}?ep=${comment.episodeNumber}` : `/anime/${comment.animeId}`} passHref>
                                            <Button variant="outline" size="sm" className="gap-1 text-xs h-auto py-1">
                                                <LinkIcon className="w-3 h-3" />
                                                {comment.episodeNumber ? `Ep. ${comment.episodeNumber}` : 'Anime Page'}
                                            </Button>
                                        </Link>
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground">
                                        {comment.timestamp ? formatDistanceToNow(comment.timestamp.toDate(), { addSuffix: true }) : 'N/A'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                       <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleDelete(comment.id)} className="text-destructive focus:text-destructive cursor-pointer">
                                                   <Trash2 className="mr-2 h-4 w-4" />
                                                    <span>Delete</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                        No comments found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
