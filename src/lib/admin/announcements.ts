'use server';

import { initializeFirebase } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const { firestore } = initializeFirebase();

// This is a placeholder. In a real app, you'd get this from your auth state.
const mockAuth = { currentUser: { uid: 'admin-user-placeholder' } };

export async function createAnnouncement(data: {
  title: string;
  message: string;
  type: 'banner' | 'modal' | 'toast';
  active: boolean;
}) {
  await addDoc(collection(firestore, 'admin', 'announcements', 'list'), {
    ...data,
    createdAt: serverTimestamp(),
    createdBy: mockAuth.currentUser?.uid,
  });
}
