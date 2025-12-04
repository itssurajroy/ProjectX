'use server';

import { doc, deleteDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { AdminError, handleAdminError } from './utils';
import { initializeFirebase } from '@/firebase';

const { firestore } = initializeFirebase();

// NOTE: VERCEL_TOKEN is a placeholder. You would need to set this in your environment variables.
const VERCEL_TOKEN = process.env.ADMIN_REVALIDATE_TOKEN;

export async function clearCache(key: string) {
  if (!key) throw new AdminError('Cache key is required');

  try {
    // Clear Firestore cache entry
    await deleteDoc(doc(firestore, 'admin', 'cache', 'keys', key));

    // Also trigger Vercel revalidation if a token is provided
    if (VERCEL_TOKEN) {
      const res = await fetch(`https://api.vercel.com/v1/integrations/revalidate?token=${VERCEL_TOKEN}`, {
          method: 'POST',
          body: JSON.stringify({ paths: ['/'] }), // Revalidate the home page, adjust as needed
      });
      if (!res.ok) throw new Error('Vercel revalidation failed');
    }

    toast.success('Cache cleared + site revalidated!');
  } catch (error) {
    handleAdminError(error, 'clearCache');
    throw error;
  }
}
