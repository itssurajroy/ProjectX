
import { UserProfile } from "./user";

export interface Comment {
  id: string;
  animeId: string;
  episodeId?: string;
  episodeNumber?: number;
  userId: string;
  username: string;
  text: string;
  parentId: string | null;
  spoiler: boolean;
  likes: string[]; // Store an array of user IDs who liked the comment
  timestamp: any; // Could be Date or a server timestamp object
  userAvatar?: string;
  rank?: string; // From gamification
}


export interface CommentWithUser extends Comment {
    userProfile?: UserProfile;
    replies: CommentWithUser[];
}
