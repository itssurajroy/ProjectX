
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, MessageSquare, ShieldAlert } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { collectionGroup, onSnapshot, query, orderBy, collection } from "firebase/firestore";
import { initializeFirebase } from "@/firebase";
import { deleteComment, resolveReport } from "@/lib/admin/moderation";
import { sanitizeFirestoreId } from "@/lib/utils";
import toast from "react-hot-toast";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError, type SecurityRuleContext } from "@/firebase/errors";

const { firestore } = initializeFirebase();

interface Comment {
    id: string;
    path: string;
    author: string;
    text: string;
    timestamp: any;
}

interface Report {
    id: string;
    type: 'Broken Link' | 'Wrong Info' | 'Spam' | 'DMCA' | 'Toxicity';
    contentId: string;
    reporter: string;
    message: string;
    status: 'Pending' | 'In Progress' | 'Resolved';
    timestamp?: any;
}

const statusColors: {[key: string]: string} = {
    Pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'In Progress': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    Resolved: 'bg-green-500/20 text-green-400 border-green-500/30'
};

const typeColors: {[key: string]: string} = {
    'Broken Link': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    'Wrong Info': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    'Spam': 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    'DMCA': 'bg-red-500/20 text-red-300 border-red-500/30',
    'Toxicity': 'bg-rose-500/20 text-rose-300 border-rose-500/30',
};

const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp.seconds * 1000).toLocaleString();
}

function CommentsModeration() {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const commentsQuery = query(collectionGroup(firestore, 'messages'), orderBy('timestamp', 'desc'));
        
        const unsubscribe = onSnapshot(commentsQuery, (snapshot) => {
            const commentsData: Comment[] = snapshot.docs.map(doc => ({
                id: doc.id,
                path: doc.ref.path,
                ...doc.data()
            } as Comment));
            setComments(commentsData);
            setLoading(false);
        }, (serverError) => {
            const permissionError = new FirestorePermissionError({
                path: 'comments/{animeId}/{section}/messages',
                operation: 'list',
            } satisfies SecurityRuleContext);
            errorEmitter.emit('permission-error', permissionError);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleDelete = async (path: string) => {
        if(window.confirm("Are you sure you want to delete this comment? This cannot be undone.")) {
            await deleteComment(path);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Comments</CardTitle>
                <CardDescription>{comments.length} comments found across all episodes.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Author</TableHead>
                            <TableHead>Comment</TableHead>
                            <TableHead>Context</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={5} className="text-center py-8">Loading comments...</TableCell></TableRow>
                        ) : comments.map(comment => (
                            <TableRow key={comment.id}>
                                <TableCell className="font-medium">{comment.author}</TableCell>
                                <TableCell className="max-w-md truncate">{comment.text}</TableCell>
                                <TableCell className="text-xs text-muted-foreground">{comment.path.split('/')[1]}/{sanitizeFirestoreId(comment.path.split('/')[3])}</TableCell>
                                <TableCell>{formatDate(comment.timestamp)}</TableCell>
                                <TableCell className="text-right">
                                     <DropdownMenu>
                                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4"/></Button></DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem>View Context</DropdownMenuItem>
                                            <DropdownMenuItem>Warn User</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDelete(comment.path)} className="text-destructive focus:text-destructive">Delete Comment</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}


function ReportsModeration() {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);

     useEffect(() => {
        const reportsRef = collection(firestore, 'admin/reports/active');
        const q = query(reportsRef, orderBy('timestamp', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const reportsData: Report[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Report));
            setReports(reportsData);
            setLoading(false);
        }, (serverError) => {
            const permissionError = new FirestorePermissionError({
                path: reportsRef.path,
                operation: 'list',
            } satisfies SecurityRuleContext);
            errorEmitter.emit('permission-error', permissionError);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleResolve = async (reportId: string) => {
        const resolution = prompt("Enter resolution notes:");
        if (resolution) {
            try {
                await resolveReport(reportId, resolution);
            } catch(e) {
                // error handled by global handler
            }
        }
    }


    return (
        <Card>
            <CardHeader>
                <CardTitle>Content Reports</CardTitle>
                 <CardDescription>
                    {reports.filter(r => r.status === 'Pending').length} pending reports.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>Content ID</TableHead>
                            <TableHead>Message</TableHead>
                            <TableHead>Reporter</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                         {loading ? (
                            <TableRow><TableCell colSpan={7} className="text-center py-8">Loading reports...</TableCell></TableRow>
                        ) : reports.map(report => (
                            <TableRow key={report.id}>
                                <TableCell><Badge variant="outline" className={typeColors[report.type]}>{report.type}</Badge></TableCell>
                                <TableCell className="font-mono text-xs">{report.contentId}</TableCell>
                                <TableCell className="max-w-xs truncate">{report.message}</TableCell>
                                <TableCell>{report.reporter}</TableCell>
                                <TableCell>{formatDate(report.timestamp)}</TableCell>
                                <TableCell><Badge className={statusColors[report.status]}>{report.status}</Badge></TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4"/></Button></DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem onClick={() => handleResolve(report.id)}>Resolve</DropdownMenuItem>
                                            <DropdownMenuItem>Fix Content</DropdownMenuItem>
                                            <DropdownMenuItem>Ban Reporter</DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive focus:text-destructive">Delete Report</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                         {reports.length === 0 && !loading && (
                             <TableRow><TableCell colSpan={7} className="text-center py-8">No pending reports.</TableCell></TableRow>
                         )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}


export default function ModerationPage() {
    return (
        <Tabs defaultValue="comments" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="comments">
                    <MessageSquare className="w-4 h-4 mr-2" /> Comments
                </TabsTrigger>
                <TabsTrigger value="reports">
                    <ShieldAlert className="w-4 h-4 mr-2" /> Reports
                </TabsTrigger>
            </TabsList>
            <TabsContent value="comments" className="mt-4">
                <CommentsModeration />
            </TabsContent>
            <TabsContent value="reports" className="mt-4">
                <ReportsModeration />
            </TabsContent>
        </Tabs>
    );
}
