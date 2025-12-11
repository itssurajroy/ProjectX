
export type NotificationType = 
  | 'new_episode'
  | 'poll_result'
  | 'announcement'
  | 'user_mention'
  | 'premium_expiring'
  | 'reply'
  | 'follow';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  icon?: string;
  read: boolean;
  createdAt: any; // Could be Date or a server timestamp object
}
