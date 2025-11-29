import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sanitizeFirestoreId(id: string): string {
  if (!id) return 'unknown_id';
  return id.replace(/[?&=/\\.#$[\]]/g, '_');
}

export function extractEpisodeId(episodeId: string): string | null {
  if (!episodeId) return null;
  // This regex is more robust, handling cases like "ep=123", "ep:123", and just the number.
  // It will match ?ep=, &ep=, or just the episode number from an ID like `...-episode-123`
  const match = episodeId.match(/(?:[?&]ep=|episode-)(\d+)/);
  if (match && match[1]) {
    return match[1];
  }

  // Fallback for cases where the ID is just the number itself
  if (/^\d+$/.test(episodeId)) {
    return episodeId;
  }
  
  return null;
}
