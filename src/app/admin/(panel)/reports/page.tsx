
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const reports = [
  { id: 'rep_1', type: 'Broken Link', anime: 'one-piece-100', episode: 1089, reporter: 'user1@example.com', message: 'Vidstreaming server is not working.', status: 'Pending' },
  { id: 'rep_2', type: 'Wrong Info', anime: 'attack-on-titan-112', episode: null, reporter: 'user2@example.com', message: 'Synopsis is for the wrong season.', status: 'Pending' },
  { id: 'rep_3', type: 'Spam', anime: 'naruto-20', episode: 55, reporter: 'user3@example.com', message: 'Comment section is full of ads.', status: 'In Progress' },
  { id: 'rep_4', type: 'DMCA', anime: 'bleach-321', episode: null, reporter: 'copyright_holder@example.com', message: 'This content infringes our copyright.', status: 'Resolved' },
];

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
    return (
        <Card>
            <CardHeader>
                <CardTitle>Reports & Moderation Queue</CardTitle>
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
                                <TableCell><Badge className={typeColors[report.type]}>{report.type}</Badge></TableCell>
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
