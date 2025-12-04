
import { FieldValue } from 'firebase/firestore';

export interface UserProfile {
  displayName: string;
  photoURL?: string;
  email: string;
  role: 'user' | 'admin' | 'moderator';
  level?: number;
  xp?: number;
  premiumUntil?: FieldValue | Date;
  createdAt: FieldValue;
  lastLogin: FieldValue;
}
