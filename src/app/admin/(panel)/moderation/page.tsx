'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, MessageSquare, ShieldAlert } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { collectionGroup, onSnapshot, query, orderBy } from "firebase/firestore";
import { initializeFirebase } from "@/firebase";

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
    type: 'Broken Link' | 'Wrong Info' | 'Spam' | 'DMCA';
    contentId: string;
    reporter: string;
    message: string;
    status: 'Pending' | 'In Progress' | 'Resolved';
}

const statusColors: {[key: string]: string} = {
    Pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'In Progress': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    Resolved: 'bg-green-500/20 text-green-400 border-green-500/30'
};

const typeColors: {[key: string]: string} = {
    'Broken Link': 'bg-orange-500/20',
    'Wrong Info': 'bg-purple-500/20',
    'Spam': 'bg-pink-500/20',
    'DMCA': 'bg-red-500/20',
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
        });

        return () => unsubscribe();
    }, []);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Comments</CardTitle>
                <CardDescription>{comments.length} comments found.</CardDescription>
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
                                <TableCell className="text-xs text-muted-foreground">{comment.path.split('/')[1]}</TableCell>
                                <TableCell>{formatDate(comment.timestamp)}</TableCell>
                                <TableCell className="text-right">
                                     <DropdownMenu>
                                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4"/></Button></DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem>View Context</DropdownMenuItem>
                                            <DropdownMenuItem>Warn User</DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive">Delete Comment</DropdownMenuItem>
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
        const q = query(collection(firestore, 'admin/reports/active'), orderBy('timestamp', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const reportsData: Report[] = [];
            snapshot.forEach(doc => {
                reportsData.push({ id: doc.id, ...doc.data() } as Report);
            });
            setReports(reportsData);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

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
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                         {loading ? (
                            <TableRow><TableCell colSpan={6} className="text-center py-8">Loading reports...</TableCell></TableRow>
                        ) : reports.map(report => (
                            <TableRow key={report.id}>
                                <TableCell><Badge variant="outline" className={typeColors[report.type]}>{report.type}</Badge></TableCell>
                                <TableCell className="font-mono text-xs">{report.contentId}</TableCell>
                                <TableCell className="max-w-xs truncate">{report.message}</TableCell>
                                <TableCell>{report.reporter}</TableCell>
                                <TableCell><Badge className={statusColors[report.status]}>{report.status}</Badge></TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4"/></Button></DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem>Resolve</DropdownMenuItem>
                                            <DropdownMenuItem>Fix Content</DropdownMenuItem>
                                            <DropdownMenuItem>Ban Reporter</DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive">Delete Report</DropdownMenuItem>
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
