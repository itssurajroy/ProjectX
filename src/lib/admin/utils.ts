'use client';
import toast from 'react-hot-toast';
// import { captureException } from '@sentry/nextjs'; // Optional: Sentry

export class AdminError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'AdminError';
  }
}

export function handleAdminError(error: unknown, context: string) {
  console.error(`[ADMIN ERROR] ${context}:`, error);

  // Log to Sentry (optional but recommended)
  // if (process.env.NODE_ENV === 'production') {
  //   captureException(error);
  // }

  let userMessage = 'Something went wrong. Please try again.';

  if (error instanceof AdminError) {
    userMessage = error.message;
  } else if (error instanceof Error) {
    if (error.message.includes('permission-denied')) {
      userMessage = "You don't have permission to do this.";
    } else if (error.message.includes('network')) {
      userMessage = 'Network error. Check your connection.';
    } else if (error.message.includes('not-found')) {
      userMessage = 'Resource not found.';
    }
  }

  toast.error(userMessage, {
    duration: 6000,
    style: {
      background: '#1a1a1a',
      color: '#fff',
      border: '1px solid #333',
    },
  });
}
