'use server';

import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { handleAdminError } from './utils';
import { initializeAdminFirebase } from '@/firebase/server-admin';


const { firestore } = initializeAdminFirebase();
// This is a placeholder. In a real app, you'd get this from your auth state.
const mockAuth = { currentUser: { uid: 'admin-user-placeholder' } };

export async function toggleMaintenance(enabled: boolean) {
  try {
    await setDoc(doc(firestore, 'admin', 'settings'), { 
        maintenance: enabled,
        maintenanceUpdatedAt: serverTimestamp(),
        maintenanceBy: mockAuth.currentUser?.uid,
    }, { merge: true });

    toast.success(enabled ? 'Site in maintenance mode' : 'Site is live!');
  } catch (error) {
    handleAdminError(error, 'toggleMaintenance');
    throw error;
  }
}

export async function disableSignups(disabled: boolean) {
  await setDoc(doc(firestore, 'admin', 'settings'), { signupDisabled: disabled }, { merge: true });
}
