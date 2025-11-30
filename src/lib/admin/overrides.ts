'use server';

import { initializeFirebase } from '@/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { AdminError, handleAdminError } from './utils';

const { firestore } = initializeFirebase();

// This is a placeholder. In a real app, you'd get this from your auth state.
const mockAuth = { currentUser: { uid: 'admin-user-placeholder' } };

export async function setAnimeOverride(
  animeId: string,
  data: Partial<{
    title: string;
    poster: string;
    description: string;
    status: string;
  }>
) {
  if (!animeId || !data || Object.keys(data).length === 0) {
    throw new AdminError('Invalid anime data');
  }

  try {
    const overrideRef = doc(firestore, 'admin', 'overrides', 'animes', animeId);
    await setDoc(
      overrideRef,
      {
        ...data,
        updatedAt: serverTimestamp(),
        updatedBy: mockAuth.currentUser?.uid || 'unknown',
      },
      { merge: true }
    );
    toast.success('Anime override saved!');
  } catch (error) {
    handleAdminError(error, 'setAnimeOverride');
    throw error;
  }
}
