'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { collection, onSnapshot } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import { useEffect, useState } from "react";


const { firestore } = initializeFirebase();

interface Report {
    id: string;
    type: 'Broken Link' | 'Wrong Info' | 'Spam' | 'DMCA';
    anime?: string;
    episode?: number;
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


export default function ReportsPage() {
    const [reports, setReports] = useState<Report[]>([]);
    
    useEffect(() => {
        const q = collection(firestore, 'admin/reports/active');
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const reportsData: Report[] = [];
            snapshot.forEach(doc => {
                reportsData.push({ id: doc.id, ...doc.data() } as Report);
            });
            setReports(reportsData);
        });
        return () => unsubscribe();
    }, []);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Reports & Moderation Queue</CardTitle>
                <CardDescription>
                    {reports.filter(r => r.status === 'Pending').length} pending reports.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Report Type</TableHead>
                            <TableHead>Content</TableHead>
                            <TableHead>Message</TableHead>
                            <TableHead>Reporter</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reports.map(report => (
                            <TableRow key={report.id}>
                                <TableCell><Badge variant="outline" className={typeColors[report.type]}>{report.type}</Badge></TableCell>
                                <TableCell>
                                    <div>{report.anime}</div>
                                    {report.episode && <div className="text-xs text-muted-foreground">Ep. {report.episode}</div>}
                                </TableCell>
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
    )
}
