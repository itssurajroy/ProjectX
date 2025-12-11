// src/types/comment.ts

export interface Comment {
  id: string;
  animeId: string;
  episodeId?: string;
  userId: string;
  username: string;
  text: string;
  parentId?: string | null;
  spoiler: boolean;
  likes: string[]; // Store an array of user IDs who liked the comment
  timestamp: any; // Could be Date or a server timestamp object
  userAvatar?: string;
  rank?: string; // From gamification
}
