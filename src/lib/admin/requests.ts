'use server';

import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

const { firestore } = initializeFirebase();

// This is a placeholder. In a real app, you'd get this from your auth state.
const mockAuth = { currentUser: { uid: 'anonymous-user-placeholder' } };

export async function submitRequest(
  type: string,
  animeId: string,
  message: string
) {
  await addDoc(collection(firestore, 'admin', 'requests', 'pending'), {
    uid: mockAuth.currentUser?.uid,
    animeId,
    type,
    message,
    status: 'pending',
    createdAt: serverTimestamp(),
  });
}
