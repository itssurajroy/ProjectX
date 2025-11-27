import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sanitizeFirestoreId(id: string): string {
  if (!id) return 'unknown_id';
  return id.replace(/[?&=/\\.#$[\]]/g, '_');
}
