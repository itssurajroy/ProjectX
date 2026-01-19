'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useCollection, useFirestore, deleteDocumentNonBlocking } from "@/firebase";
import { Page } from "@/lib/types/page";
import { Loader2, Files, PlusCircle, MoreHorizontal, PenSquare, Trash2 } from "lucide-react";
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

export default function AdminPagesPage() {
    const { data: pages, loading, error } = useCollection<Page>('pages');
    const firestore = useFirestore();

    const sortedPages = pages?.sort((a, b) => (b.updatedAt?.toMillis() || 0) - (a.updatedAt?.toMillis() || 0));

    const handleDelete = (pageId: string) => {
        if (!confirm('Are you sure you want to delete this page? This cannot be undone.')) {
            return;
        }
        const toastId = toast.loading('Deleting page...');
        const docRef = doc(firestore, 'pages', pageId);
        deleteDocumentNonBlocking(docRef);
        toast.success('Page deleted.', { id: toastId });
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Pages Management</h1>
                <p className="text-muted-foreground">Create and manage static pages like 'About Us' or 'DMCA'.</p>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>All Pages</CardTitle>
                            <CardDescription>Manage all static pages for the site.</CardDescription>
                        </div>
                        <Button asChild className="gap-2">
                            <Link href="/admin/pages/new">
                                <PlusCircle className="w-4 h-4" />
                                Create New Page
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
                                <TableHead>Last Updated</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-10">
                                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                                    </TableCell>
                                </TableRow>
                            ) : error ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-10 text-destructive">
                                        Error: {error.message}
                                    </TableCell>
                                </TableRow>
                            ) : sortedPages && sortedPages.length > 0 ? (
                                sortedPages.map(page => (
                                <TableRow key={page.id}>
                                    <TableCell className="font-semibold">{page.title}</TableCell>
                                    <TableCell>
                                        <Badge variant={page.status === 'published' ? 'default' : 'secondary'}>
                                            {page.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {page.updatedAt ? format(page.updatedAt.toDate(), 'MMM dd, yyyy') : 'N/A'}
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
                                                    <Link href={`/admin/pages/${page.id}`} className="cursor-pointer">
                                                        <PenSquare className="mr-2 h-4 w-4" />
                                                        <span>Edit</span>
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => handleDelete(page.id)} className="text-destructive focus:text-destructive cursor-pointer">
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
                                    <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                                        No pages found. Create one to get started.
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
