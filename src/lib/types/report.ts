
export type ReportStatus = "Pending" | "In Review" | "Resolved";
export type ReportType = "Comment" | "User Profile" | "Video";

export interface Report {
  id: string;
  type: ReportType;
  contentId: string; 
  contentSnippet: string;
  reason: string;
  status: ReportStatus;
  severity: "Low" | "Medium" | "High";
  reportedUserId: string;
  reportedUserName: string;
  reporterId: string;
  reporterName: string;
  createdAt: any; 
  notes?: string;
}
