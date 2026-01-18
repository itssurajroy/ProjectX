
'use client';
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldAlert, User, MessageSquare, Clock, AlertOctagon, CheckCircle, Eye } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

type ReportStatus = "Pending" | "In Review" | "Resolved";
type ReportSeverity = "Low" | "Medium" | "High";

interface Report {
  id: string;
  type: "Comment" | "User Profile" | "Video";
  contentSnippet: string;
  reason: string;
  status: ReportStatus;
  severity: ReportSeverity;
  timestamp: Date;
  reportedUserId: string;
  reportedUserName: string;
  reportedUserAvatar: string;
  reporterId: string;
  reporterName: string;
}

const mockReports: Report[] = [
  { id: 'REP001', type: 'Comment', contentSnippet: "This is honestly the worst take I've ever seen...", reason: 'Hate Speech', status: 'Pending', severity: 'High', timestamp: new Date(Date.now() - 3600000), reportedUserId: 'user123', reportedUserName: 'AnimeFanatic', reportedUserAvatar: 'https://i.pravatar.cc/150?u=user123', reporterId: 'user456', reporterName: 'JusticeWarrior' },
  { id: 'REP002', type: 'User Profile', contentSnippet: "Inappropriate avatar and bio.", reason: 'Inappropriate Content', status: 'Pending', severity: 'Medium', timestamp: new Date(Date.now() - 86400000), reportedUserId: 'user789', reportedUserName: 'EdgyLord', reportedUserAvatar: 'https://i.pravatar.cc/150?u=user789', reporterId: 'user101', reporterName: 'ConcernedCitizen' },
  { id: 'REP003', type: 'Comment', contentSnippet: "Massive spoilers for the manga in this comment!", reason: 'Spoilers', status: 'In Review', severity: 'Medium', timestamp: new Date(Date.now() - 172800000), reportedUserId: 'user234', reportedUserName: 'SpoilerKing', reportedUserAvatar: 'https://i.pravatar.cc/150?u=user234', reporterId: 'user567', reporterName: 'MangaReader' },
  { id: 'REP004', type: 'Video', contentSnippet: "Video quality is extremely poor and buffers constantly.", reason: 'Technical Issues', status: 'Resolved', severity: 'Low', timestamp: new Date(Date.now() - 259200000), reportedUserId: 'N/A', reportedUserName: 'N/A', reportedUserAvatar: '', reporterId: 'user890', reporterName: 'TechGuru' },
];


const StatusBadge = ({ status }: { status: ReportStatus }) => {
  const statusMap = {
    Pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    'In Review': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    Resolved: 'bg-green-500/20 text-green-400 border-green-500/30',
  };
  return <Badge className={statusMap[status]}>{status}</Badge>;
}

const SeverityBadge = ({ severity }: { severity: ReportSeverity }) => {
  const severityMap = {
    Low: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
    Medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    High: 'bg-red-500/20 text-red-400 border-red-500/30',
  };
  return <Badge variant="outline" className={severityMap[severity]}>{severity}</Badge>;
}

export default function AdminModerationPage() {
  const [selectedReport, setSelectedReport] = useState<Report | null>(mockReports[0]);
  const [filter, setFilter] = useState<ReportStatus | "All">("Pending");

  const filteredReports = mockReports.filter(report => filter === "All" || report.status === filter);

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
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="Pending">Pending</TabsTrigger>
                <TabsTrigger value="In Review">In Review</TabsTrigger>
                <TabsTrigger value="Resolved">Resolved</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <ScrollArea className="flex-grow">
            <CardContent className="space-y-2">
              {filteredReports.map(report => (
                <button key={report.id} onClick={() => setSelectedReport(report)} className={`w-full text-left p-3 rounded-lg border transition-colors ${selectedReport?.id === report.id ? 'bg-muted border-primary' : 'bg-card/50 border-border hover:bg-muted'}`}>
                  <div className="flex justify-between items-start">
                    <p className="font-semibold text-sm">{report.type}: {report.reason}</p>
                    <StatusBadge status={report.status} />
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">"{report.contentSnippet}"</p>
                  <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                    <SeverityBadge severity={report.severity} />
                    <span>{formatDistanceToNow(report.timestamp, { addSuffix: true })}</span>
                  </div>
                </button>
              ))}
            </CardContent>
          </ScrollArea>
        </Card>

        <Card className="lg:col-span-2 flex flex-col">
          {selectedReport ? (
            <>
              <CardHeader className="border-b border-border">
                <CardTitle className="flex items-center gap-2"><ShieldAlert className="w-6 h-6 text-primary" /> Case Details: {selectedReport.id}</CardTitle>
                <CardDescription>Reported {formatDistanceToNow(selectedReport.timestamp, { addSuffix: true })} for {selectedReport.reason}</CardDescription>
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
                          <AvatarImage src={selectedReport.reportedUserAvatar} />
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
                           <AvatarImage src={`https://i.pravatar.cc/150?u=${selectedReport.reporterId}`} />
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
                        <Button variant="outline" size="sm" className="gap-2"><Eye className="w-4 h-4" /> Ignore</Button>
                        <Button variant="outline" size="sm" className="gap-2 text-amber-400 border-amber-500/50 hover:bg-amber-500/10 hover:text-amber-400"><AlertOctagon className="w-4 h-4"/> Warn User</Button>
                        <Button variant="destructive" size="sm" className="gap-2"><User className="w-4 h-4"/> Ban User</Button>
                        <Button size="sm" className="gap-2"><CheckCircle className="w-4 h-4" /> Resolve</Button>
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
