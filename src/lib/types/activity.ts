
export type ActivityType =
  | 'new_user'
  | 'new_comment'
  | 'new_report'
  | 'update_user_role';

export interface ActivityLogItem {
  id: string;
  type: ActivityType;
  timestamp: any; // Firestore Timestamp
  userId?: string;
  username?: string;
  userAvatar?: string;
  details: {
    summary: string; // e.g., "John Doe registered." or "posted a comment on Jujutsu Kaisen Ep. 12"
    link?: string; // e.g., /admin/users/USER_ID or /watch/anime-id?ep=12
    [key: string]: any; // other context-specific details
  };
}
