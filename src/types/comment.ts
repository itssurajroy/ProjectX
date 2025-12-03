
// src/types/comment.ts
import { FieldValue } from 'firebase/firestore';

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
  timestamp: FieldValue;
  userAvatar?: string;
  rank?: string; // From gamification
}
