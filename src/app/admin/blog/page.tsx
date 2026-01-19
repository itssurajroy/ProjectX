
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useCollection } from "@/firebase";
import { BlogPost } from "@/lib/types/blog";
import { Loader2, PenSquare, PlusCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function AdminBlogPage() {
    const { data: blogPosts, loading, error } = useCollection<BlogPost>('blogs');

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
                        <Button className="gap-2">
                            <PlusCircle className="w-4 h-4" />
                            Create New Post
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
                                <TableHead>Created At</TableHead>
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
                            ) : blogPosts && blogPosts.length > 0 ? (
                                blogPosts.map(post => (
                                <TableRow key={post.id}>
                                    <TableCell className="font-semibold">{post.title}</TableCell>
                                    <TableCell>
                                        <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                                            {post.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{post.authorName || 'N/A'}</TableCell>
                                    <TableCell>
                                        {post.createdAt ? format(post.createdAt.toDate(), 'MMM dd, yyyy') : 'N/A'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="outline" size="sm" className="gap-2">
                                            <PenSquare className="w-4 h-4"/> Edit
                                        </Button>
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
