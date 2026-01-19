
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useCollection, useFirestore, deleteDocumentNonBlocking } from "@/firebase";
import { BlogPost } from "@/lib/types/blog";
import { Loader2, PenSquare, PlusCircle, MoreHorizontal, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import toast from "react-hot-toast";
import { doc } from "firebase/firestore";

export default function AdminBlogPage() {
    const { data: blogPosts, loading, error } = useCollection<BlogPost>('blogs');
    const firestore = useFirestore();

    const sortedBlogPosts = blogPosts?.sort((a, b) => (b.updatedAt?.toMillis() || 0) - (a.updatedAt?.toMillis() || 0));

    const handleDelete = (postId: string) => {
        if (!confirm('Are you sure you want to delete this post? This cannot be undone.')) {
            return;
        }
        const toastId = toast.loading('Deleting post...');
        const docRef = doc(firestore, 'blogs', postId);
        deleteDocumentNonBlocking(docRef);
        toast.success('Post deleted.', { id: toastId });
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Blog Management</h1>
                <p className="text-muted-foreground">Create, edit, and publish articles.</p>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>All Posts</CardTitle>
                            <CardDescription>Manage all articles for the site.</CardDescription>
                        </div>
                        <Button asChild className="gap-2">
                            <Link href="/admin/blog/new">
                                <PlusCircle className="w-4 h-4" />
                                Create New Post
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Author</TableHead>
                                <TableHead>Last Updated</TableHead>
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
                            ) : sortedBlogPosts && sortedBlogPosts.length > 0 ? (
                                sortedBlogPosts.map(post => (
                                <TableRow key={post.id}>
                                    <TableCell className="font-semibold">{post.title}</TableCell>
                                    <TableCell>
                                        <Badge variant={post.status === 'published' ? 'default' : post.status === 'archived' ? 'destructive' : 'secondary'}>
                                            {post.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{post.authorName || 'N/A'}</TableCell>
                                    <TableCell>
                                        {post.updatedAt ? format(post.updatedAt.toDate(), 'MMM dd, yyyy') : 'N/A'}
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
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/admin/blog/${post.id}`} className="cursor-pointer">
                                                        <PenSquare className="mr-2 h-4 w-4" />
                                                        <span>Edit</span>
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => handleDelete(post.id)} className="text-destructive focus:text-destructive cursor-pointer">
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
                                        No blog posts found. Create one to get started.
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
