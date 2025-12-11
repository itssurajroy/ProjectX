
// src/types/watchlist.ts

export type WatchlistStatus = 'Watching' | 'Completed' | 'On-Hold' | 'Dropped' | 'Plan to Watch';

export interface WatchlistItem {
  id: string; // The anime ID
  status: WatchlistStatus;
  addedAt: any; // Firestore timestamp
  updatedAt: any;
}
