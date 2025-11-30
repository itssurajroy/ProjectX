'use server';

import { initializeFirebase } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { AdminError, handleAdminError } from './utils';

const { firestore } = initializeFirebase();

// This is a placeholder. In a real app, you'd get this from your auth state.
const mockAuth = { currentUser: { uid: 'admin-user-placeholder' } };

export async function createAnnouncement(data: {
  title: string;
  message: string;
  type: 'banner' | 'modal' | 'toast';
  active: boolean;
}) {
  if (!data.title?.trim() || !data.message?.trim()) {
    throw new AdminError('Title and message are required');
  }

  try {
    await addDoc(collection(firestore, 'admin', 'announcements', 'list'), {
      ...data,
      createdAt: serverTimestamp(),
      createdBy: mockAuth.currentUser?.uid,
    });
    toast.success('Announcement created!');
  } catch (error) {
    handleAdminError(error, 'createAnnouncement');
    throw error;
  }
}
