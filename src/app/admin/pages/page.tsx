
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useCollection, useFirestore, deleteDocumentNonBlocking, addDocumentNonBlocking } from "@/firebase";
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
import { doc, collection, serverTimestamp } from "firebase/firestore";
import { useEffect, useRef } from "react";

export default function AdminPagesPage() {
    const { data: pages, loading, error } = useCollection<Page>('pages');
    const firestore = useFirestore();
    const seededRef = useRef(false);

    useEffect(() => {
        // Only run this logic on the client, once, if the collection is empty.
        if (!loading && pages && pages.length === 0 && !seededRef.current) {
            seededRef.current = true; // Prevents re-seeding on re-renders
            
            const toastId = toast.loading("No pages found. Seeding default pages...");
            const pagesCol = collection(firestore, 'pages');
            
            const defaultPages: Omit<Page, 'id' | 'createdAt' | 'updatedAt'>[] = [
                {
                    title: 'Terms of Service',
                    slug: 'terms-of-service',
                    content: '# Terms of Service\n\nWelcome to our website. If you continue to browse and use this website, you are agreeing to comply with and be bound by the following terms and conditions of use, which together with our privacy policy govern our relationship with you in relation to this website. If you disagree with any part of these terms and conditions, please do not use our website.',
                    status: 'draft',
                    metaDescription: 'Read the Terms of Service for using our platform.'
                },
                {
                    title: 'DMCA Policy',
                    slug: 'dmca',
                    content: '# DMCA Takedown Notice Policy\n\nWe comply with the Digital Millennium Copyright Act (DMCA). If you believe your copyrighted work has been infringed upon on our service, please contact us with the required information. We will respond to all valid takedown notices.',
                    status: 'draft',
                    metaDescription: 'Our DMCA policy and information on how to submit a takedown request.'
                }
            ];

            const promises = defaultPages.map(page => {
                const data = { ...page, createdAt: serverTimestamp(), updatedAt: serverTimestamp() };
                return addDocumentNonBlocking(pagesCol, data);
            });

            Promise.all(promises)
                .then(() => {
                    toast.success("Default pages created! The list will refresh automatically.", { id: toastId });
                })
                .catch(err => {
                    toast.error("Failed to create default pages.", { id: toastId });
                    console.error("Page seeding error:", err);
                });
        }
    }, [loading, pages, firestore]);

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
