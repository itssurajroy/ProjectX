
// This will be the main notification type stored in the `notifications` collection
export interface AppNotification {
  id: string;
  title: string;
  message: string;
  link?: string;
  icon?: string; // emoji or lucide-react icon name
  createdAt: any; // Firestore Timestamp
}
