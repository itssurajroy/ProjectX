
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
  premiumUntil?: any; // Could be Date or a server timestamp object
  subscriptionTier?: 'free' | 'premium' | 'vip';
  createdAt: any;
  lastLogin: any;
  onboardingCompleted?: boolean;
}
