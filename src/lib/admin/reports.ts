'use server';

import { collection, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { AdminError, handleAdminError } from './utils';
import { initializeFirebase } from '@/firebase';

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

export async function resolveReport(reportId: string, action: 'ban' | 'dismiss' | 'warning') {
  if (!reportId) throw new AdminError('Report ID required');

  try {
    await updateDoc(doc(firestore, 'admin', 'reports', 'active', reportId), {
        status: action,
        resolvedAt: serverTimestamp(),
        resolvedBy: mockAuth.currentUser?.uid,
      });

    toast.success(`Report ${action} — user notified`);
  } catch (error) {
    handleAdminError(error, 'resolveReport');
    throw error;
  }
}
