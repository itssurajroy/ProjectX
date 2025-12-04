
'use server';
import { doc, updateDoc, writeBatch } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { handleAdminError, AdminError } from './utils';
import { initializeFirebase } from '@/firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';

type UserRole = 'user' | 'premium' | 'moderator' | 'admin' | 'banned';

async function updateUserRole(uid: string, role: UserRole) {
  if (!uid || !role) {
    throw new AdminError('User ID and role are required.');
  }
  const { firestore } = initializeFirebase();
  const userRef = doc(firestore, 'users', uid);
  const payload = { role };

  updateDoc(userRef, payload)
    .then(() => {
        toast.success(`User role updated to ${role}.`);
    })
    .catch((serverError) => {
        const permissionError = new FirestorePermissionError({
            path: userRef.path,
            operation: 'update',
            requestResourceData: payload,
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
    });
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
    const { firestore } = initializeFirebase();
    try {
        const batch = writeBatch(firestore);
        uids.forEach(uid => {
            const userRef = doc(firestore, 'users', uid);
            batch.update(userRef, { role });
        });
        
        await batch.commit()
            .then(() => {
                toast.success(`${uids.length} users updated to ${role}.`);
            })
            .catch((serverError) => {
                // Note: Batch errors are harder to contextualize to a single doc.
                // This will report the first failed operation if possible, but it's a limitation.
                const permissionError = new FirestorePermissionError({
                    path: `users/[MULTIPLE]`,
                    operation: 'update',
                    requestResourceData: { role },
                } satisfies SecurityRuleContext);
                errorEmitter.emit('permission-error', permissionError);
            });

    } catch (error) {
        handleAdminError(error, 'bulkUpdateUserRoles');
        throw error;
    }
}
