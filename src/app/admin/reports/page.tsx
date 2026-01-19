'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Loader2, Users, Flag, Film } from 'lucide-react';
import { useCollection } from "@/firebase";
import { UserProfile } from "@/lib/types/user";
import { Report } from "@/lib/types/report";
import { useQuery } from "@tanstack/react-query";
import { AnimeService } from "@/lib/services/AnimeService";
import { HomeData } from "@/lib/types/anime";
import { format } from "date-fns";

// Helper function to download data as CSV
const downloadAsCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;
    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => {
            let cell = row[header];
            if (cell instanceof Date) {
                cell = cell.toISOString();
            } else if (typeof cell === 'object' && cell !== null && cell.toDate) { // Firestore Timestamp
                cell = cell.toDate().toISOString();
            } else if (typeof cell === 'object' && cell !== null) {
                cell = JSON.stringify(cell);
            }
            const stringCell = String(cell).replace(/"/g, '""');
            return `"${stringCell}"`;
        }).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


// User Report Component
const UserReport = () => {
    const { data: users, loading } = useCollection<UserProfile>('users');
    
    const handleDownload = () => {
        if (users) {
            const dataToDownload = users.map(u => ({
                id: u.id,
                displayName: u.displayName,
                email: u.email,
                role: u.role,
                status: u.status || 'active',
                createdAt: u.createdAt,
                lastLogin: u.lastLogin,
            }));
            downloadAsCSV(dataToDownload, 'user-report');
        }
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5"/> User Report</CardTitle>
                    <CardDescription>A complete list of all registered users.</CardDescription>
                </div>
                <Button onClick={handleDownload} disabled={loading || !users || users.length === 0}><Download className="w-4 h-4 mr-2"/> Download CSV</Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Display Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Joined</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                         {loading ? (
                            <TableRow><TableCell colSpan={4} className="text-center p-8"><Loader2 className="w-6 h-6 animate-spin mx-auto"/></TableCell></TableRow>
                        ) : users && users.length > 0 ? (
                            users.slice(0, 5).map(user => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.displayName}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell className="capitalize">{user.role}</TableCell>
                                    <TableCell>{user.createdAt ? format(user.createdAt.toDate(), 'yyyy-MM-dd') : 'N/A'}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow><TableCell colSpan={4} className="text-center p-8 text-muted-foreground">No users found.</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
                {users && users.length > 5 && <p className="text-xs text-center text-muted-foreground mt-2">Showing first 5 of {users.length} users. Download for full list.</p>}
            </CardContent>
        </Card>
    );
};

// Moderation Report Component
const ModerationReport = () => {
    const { data: reports, loading } = useCollection<Report>('reports');
    
    const handleDownload = () => {
        if (reports) {
            downloadAsCSV(reports, 'moderation-report');
        }
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2"><Flag className="w-5 h-5"/> Moderation Report</CardTitle>
                    <CardDescription>Log of all user-submitted content reports.</CardDescription>
                </div>
                <Button onClick={handleDownload} disabled={loading || !reports || reports.length === 0}><Download className="w-4 h-4 mr-2"/> Download CSV</Button>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Reason</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Reported User</TableHead>
                            <TableHead>Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                         {loading ? (
                            <TableRow><TableCell colSpan={4} className="text-center p-8"><Loader2 className="w-6 h-6 animate-spin mx-auto"/></TableCell></TableRow>
                        ) : reports && reports.length > 0 ? (
                            reports.slice(0, 5).map(report => (
                                <TableRow key={report.id}>
                                    <TableCell>{report.reason}</TableCell>
                                    <TableCell className="capitalize">{report.status}</TableCell>
                                    <TableCell>{report.reportedUserName}</TableCell>
                                    <TableCell>{report.createdAt ? format(report.createdAt.toDate(), 'yyyy-MM-dd') : 'N/A'}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow><TableCell colSpan={4} className="text-center p-8 text-muted-foreground">No reports found.</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
                {reports && reports.length > 5 && <p className="text-xs text-center text-muted-foreground mt-2">Showing first 5 of {reports.length} reports. Download for full list.</p>}
            </CardContent>
        </Card>
    );
}

// Content Report Component
const ContentReport = () => {
    const { data: homeData, isLoading } = useQuery<HomeData>({
        queryKey: ['homeDataForReports'],
        queryFn: AnimeService.home
    });

    const popularAnime = homeData?.mostPopularAnimes || [];

     const handleDownload = () => {
        if (popularAnime) {
            downloadAsCSV(popularAnime, 'popular-content-report');
        }
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2"><Film className="w-5 h-5"/> Popular Content Report</CardTitle>
                    <CardDescription>List of most popular anime based on current data.</CardDescription>
                </div>
                <Button onClick={handleDownload} disabled={isLoading || popularAnime.length === 0}><Download className="w-4 h-4 mr-2"/> Download CSV</Button>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Rank</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Episodes</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                         {isLoading ? (
                            <TableRow><TableCell colSpan={4} className="text-center p-8"><Loader2 className="w-6 h-6 animate-spin mx-auto"/></TableCell></TableRow>
                        ) : popularAnime.length > 0 ? (
                            popularAnime.slice(0, 5).map(anime => (
                                <TableRow key={anime.id}>
                                    <TableCell>{anime.rank}</TableCell>
                                    <TableCell>{anime.name}</TableCell>
                                    <TableCell>{anime.type}</TableCell>
                                    <TableCell>{anime.episodes?.sub || 'N/A'}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow><TableCell colSpan={4} className="text-center p-8 text-muted-foreground">No content data available.</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
                {popularAnime.length > 5 && <p className="text-xs text-center text-muted-foreground mt-2">Showing first 5 of {popularAnime.length} entries. Download for full list.</p>}
            </CardContent>
        </Card>
    );
}


// Main Page Component
export default function AdminReportsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Reports</h1>
                <p className="text-muted-foreground">Download raw data reports for users, content, and moderation.</p>
            </div>
            
            <div className="space-y-8">
                <UserReport />
                <ModerationReport />
                <ContentReport />
            </div>
        </div>
    );
}
