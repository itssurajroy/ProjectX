
'use server';
import { doc, updateDoc, writeBatch } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { handleAdminError, AdminError } from './utils';
import { initializeAdminFirebase } from '@/firebase/server-admin';

const { firestore } = initializeAdminFirebase();

type UserRole = 'user' | 'premium' | 'moderator' | 'admin' | 'banned';

async function updateUserRole(uid: string, role: UserRole) {
  if (!uid || !role) {
    throw new AdminError('User ID and role are required.');
  }

  try {
    const userRef = doc(firestore, 'users', uid);
    await updateDoc(userRef, { role });
    toast.success(`User role updated to ${role}.`);
  } catch (error) {
    handleAdminError(error, 'updateUserRole');
    throw error;
  }
}

export async function banUser(uid: string) {
  return updateUserRole(uid, 'banned');
}

export async function unbanUser(uid: string) {
  return updateUserRole(uid, 'user');
}

export async function makePremium(uid: string) {
  return updateUserRole(uid, 'premium');
}

export async function bulkUpdateUserRoles(uids: string[], role: UserRole) {
    if (!uids || uids.length === 0 || !role) {
        throw new AdminError('User IDs and a role are required for bulk update.');
    }

    try {
        const batch = writeBatch(firestore);
        uids.forEach(uid => {
            const userRef = doc(firestore, 'users', uid);
            batch.update(userRef, { role });
        });
        await batch.commit();
        toast.success(`${uids.length} users updated to ${role}.`);
    } catch (error) {
        handleAdminError(error, 'bulkUpdateUserRoles');
        throw error;
    }
}
