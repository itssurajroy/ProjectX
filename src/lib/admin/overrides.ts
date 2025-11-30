'use server';

import { initializeFirebase } from '@/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

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
  const overrideRef = doc(firestore, 'admin', 'overrides', 'animes', animeId);
  await setDoc(
    overrideRef,
    {
      ...data,
      updatedAt: serverTimestamp(),
      updatedBy: mockAuth.currentUser?.uid,
    },
    { merge: true }
  );
}
