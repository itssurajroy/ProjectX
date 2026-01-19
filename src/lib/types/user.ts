
export interface UserProfile {
  id?: string;
  displayName: string;
  photoURL?: string;
  email: string;
  role: 'user' | 'admin' | 'moderator';
  status?: 'active' | 'suspended' | 'banned';
  bio?: string;
  favoriteAnimeId?: string;
  level?: number;
  xp?: number;
  createdAt: any;
  lastLogin: any;
  onboardingCompleted?: boolean;
}
