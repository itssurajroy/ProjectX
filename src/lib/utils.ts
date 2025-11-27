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
  const match = episodeId.match(/ep=(\d+)/);
  return match ? match[1] : null;
}
