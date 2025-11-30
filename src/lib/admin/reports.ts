'use server';

import { initializeFirebase } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const { firestore } = initializeFirebase();

// This is a placeholder. In a real app, you'd get this from your auth state.
const mockAuth = { currentUser: { uid: 'anonymous-user-placeholder' } };

export async function reportContent(
  targetId: string,
  type: 'anime' | 'user' | 'comment',
  reason: string
) {
  await addDoc(collection(firestore, 'admin', 'reports', 'active'), {
    reporterUid: mockAuth.currentUser?.uid,
    targetId,
    type,
    reason,
    timestamp: serverTimestamp(),
  });
}
