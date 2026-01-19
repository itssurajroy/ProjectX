
'use client';
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldAlert, User, MessageSquare, Clock, AlertOctagon, CheckCircle, Eye, Loader2 } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { useCollection, useFirestore, updateDocumentNonBlocking, addDocumentNonBlocking } from "@/firebase";
import { Report, ReportStatus } from "@/lib/types/report";
import { collection, doc, serverTimestamp } from "firebase/firestore";
import toast from "react-hot-toast";

const StatusBadge = ({ status }: { status: ReportStatus }) => {
  const statusMap = {
    Pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    'In Review': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    Resolved: 'bg-green-500/20 text-green-400 border-green-500/30',
  };
  return <Badge className={statusMap[status]}>{status}</Badge>;
}

const SeverityBadge = ({ severity }: { severity: Report['severity'] }) => {
  const severityMap = {
    Low: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
    Medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    High: 'bg-red-500/20 text-red-400 border-red-500/30',
  };
  return <Badge variant="outline" className={severityMap[severity]}>{severity}</Badge>;
}

export default function AdminModerationPage() {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [filter, setFilter] = useState<ReportStatus | "All">("Pending");

  const { data: reports, loading: loadingReports } = useCollection<Report>('reports');
  const firestore = useFirestore();

  const filteredReports = useMemo(() => {
    if (!reports) return [];
    const sorted = [...reports].sort((a,b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
    if (filter === 'All') return sorted;
    return sorted.filter(report => report.status === filter);
  }, [reports, filter]);

  const handleUpdateStatus = (reportId: string, status: ReportStatus) => {
    const toastId = toast.loading(`Updating status to ${status}...`);
    const reportRef = doc(firestore, 'reports', reportId);
    updateDocumentNonBlocking(reportRef, { status: status });
    toast.success("Status updated!", { id: toastId });
    if (selectedReport?.id === reportId) {
        setSelectedReport(prev => prev ? {...prev, status} : null);
    }
  }

  const handleSeedReport = () => {
    const toastId = toast.loading("Seeding a mock report...");
    const mockReport = {
        type: 'Comment',
        contentId: 'mock_comment_id_' + Date.now(),
        contentSnippet: 'This is a sample comment that was reported for being potentially offensive or spammy.',
        reason: "Mock Report - Seeding",
        status: "Pending",
        severity: "High",
        reportedUserId: 'mock_user_id',
        reportedUserName: 'MockUser123',
        reporterId: 'admin_user_id',
        reporterName: 'Admin',
        createdAt: serverTimestamp()
    };
    const reportsCol = collection(firestore, 'reports');
    addDocumentNonBlocking(reportsCol, mockReport)
        .then(() => {
            toast.success("Mock report created! It should appear shortly.", { id: toastId });
        })
        .catch(err => {
            toast.error("Failed to seed report.", { id: toastId });
        });
  };


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Moderation</h1>
        <p className="text-muted-foreground">Review and act on user-submitted reports.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-12rem)]">
        <Card className="col-span-1 flex flex-col">
          <CardHeader>
            <CardTitle>Reports Queue</CardTitle>
            <Tabs value={filter} onValueChange={(value) => setFilter(value as any)} className="mt-2">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="Pending">Pending</TabsTrigger>
                <TabsTrigger value="In Review">In Review</TabsTrigger>
                <TabsTrigger value="Resolved">Resolved</TabsTrigger>
                <TabsTrigger value="All">All</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <ScrollArea className="flex-grow">
            <CardContent className="space-y-2">
              {loadingReports ? (
                <div className="flex items-center justify-center p-8"><Loader2 className="w-8 h-8 animate-spin" /></div>
              ) : filteredReports.length > 0 ? (
                filteredReports.map(report => (
                <button key={report.id} onClick={() => setSelectedReport(report)} className={`w-full text-left p-3 rounded-lg border transition-colors ${selectedReport?.id === report.id ? 'bg-muted border-primary' : 'bg-card/50 border-border hover:bg-muted'}`}>
                  <div className="flex justify-between items-start">
                    <p className="font-semibold text-sm">{report.type}: {report.reason}</p>
                    <StatusBadge status={report.status} />
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">"{report.contentSnippet}"</p>
                  <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                    <SeverityBadge severity={report.severity} />
                    <span>{report.createdAt ? formatDistanceToNow(report.createdAt.toDate(), { addSuffix: true }) : ''}</span>
                  </div>
                </button>
              ))) : (
                <div className="text-center p-8 text-muted-foreground">
                    <p>No reports in this category.</p>
                    {reports && reports.length === 0 && (
                        <Button size="sm" variant="secondary" className="mt-4" onClick={handleSeedReport}>
                            Seed Mock Report
                        </Button>
                    )}
                </div>
              )}
            </CardContent>
          </ScrollArea>
        </Card>

        <Card className="lg:col-span-2 flex flex-col">
          {selectedReport ? (
            <>
              <CardHeader className="border-b border-border">
                <CardTitle className="flex items-center gap-2"><ShieldAlert className="w-6 h-6 text-primary" /> Case Details: {selectedReport.id}</CardTitle>
                <CardDescription>Reported {selectedReport.createdAt ? formatDistanceToNow(selectedReport.createdAt.toDate(), { addSuffix: true }) : ''} for {selectedReport.reason}</CardDescription>
              </CardHeader>
              <ScrollArea className="flex-grow">
                <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-muted-foreground flex items-center gap-2"><MessageSquare className="w-4 h-4"/> Reported Content</h4>
                      <div className="p-4 bg-muted rounded-lg border border-border">
                        <p className="text-sm italic">"{selectedReport.contentSnippet}"</p>
                        <Badge variant="secondary" className="mt-2">{selectedReport.type}</Badge>
                      </div>
                    </div>
                     <div className="space-y-2">
                      <h4 className="font-semibold text-muted-foreground flex items-center gap-2"><User className="w-4 h-4"/> Reported User</h4>
                      <div className="flex items-center gap-3 p-3 bg-muted rounded-lg border border-border">
                        <Avatar>
                          <AvatarImage src={`https://api.dicebear.com/8.x/identicon/svg?seed=${selectedReport.reportedUserId}`} />
                          <AvatarFallback>{selectedReport.reportedUserName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{selectedReport.reportedUserName}</p>
                          <p className="text-xs text-muted-foreground">{selectedReport.reportedUserId}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                   <div className="space-y-6">
                     <div className="space-y-2">
                      <h4 className="font-semibold text-muted-foreground flex items-center gap-2"><User className="w-4 h-4"/> Reporter</h4>
                      <div className="flex items-center gap-3 p-3 bg-muted rounded-lg border border-border">
                        <Avatar>
                           <AvatarImage src={`https://api.dicebear.com/8.x/identicon/svg?seed=${selectedReport.reporterId}`} />
                           <AvatarFallback>{selectedReport.reporterName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{selectedReport.reporterName}</p>
                          <p className="text-xs text-muted-foreground">{selectedReport.reporterId}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-muted-foreground">Moderator Actions</h4>
                       <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" className="gap-2" onClick={() => handleUpdateStatus(selectedReport.id, 'In Review')}><Eye className="w-4 h-4" /> Mark as Reviewing</Button>
                        <Button variant="destructive" size="sm" className="gap-2"><User className="w-4 h-4"/> Ban User</Button>
                        <Button size="sm" className="gap-2" onClick={() => handleUpdateStatus(selectedReport.id, 'Resolved')}><CheckCircle className="w-4 h-4" /> Resolve</Button>
                       </div>
                    </div>
                  </div>
                </CardContent>
              </ScrollArea>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-6">
              <ShieldAlert className="w-16 h-16 mb-4" />
              <h3 className="text-lg font-semibold">Select a Report</h3>
              <p className="text-sm">Choose a case from the queue to view its details and take action.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
