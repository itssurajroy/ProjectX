'use server';

import { initializeFirebase } from '@/firebase';
import { doc, deleteDoc } from 'firebase/firestore';

const { firestore } = initializeFirebase();

// NOTE: VERCEL_TOKEN is a placeholder. You would need to set this in your environment variables.
const VERCEL_TOKEN = process.env.ADMIN_REVALIDATE_TOKEN;

export async function clearCache(key: string) {
  await deleteDoc(doc(firestore, 'admin', 'cache', 'keys', key));

  // Also trigger Vercel revalidation if a token is provided
  if (VERCEL_TOKEN) {
    try {
      await fetch(`https://api.vercel.com/v1/integrations/revalidate?token=${VERCEL_TOKEN}`, {
        method: 'POST',
        body: JSON.stringify({ paths: ['/'] }), // Revalidate the home page, adjust as needed
      });
    } catch (error) {
      console.error('Failed to trigger Vercel revalidation:', error);
    }
  }
}
