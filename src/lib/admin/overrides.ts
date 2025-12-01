'use server';

import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { handleAdminError } from './utils';
import { initializeAdminFirebase } from '@/firebase/server-admin';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import type { SecurityRuleContext } from '@/firebase/errors';

const { firestore } = initializeAdminFirebase();

// This is a placeholder. In a real app, you'd get this from your auth state.
const mockAuth = { currentUser: { uid: 'admin-user-placeholder' } };

export function setAnimeOverride(
  animeId: string,
  data: Partial<{
    title: string;
    poster: string;
    description: string;
    status: string;
    malId?: number;
  }>
) {
  if (!animeId || !data || Object.keys(data).length === 0) {
    // This is a validation error, not a permission error, so using AdminError is fine.
    handleAdminError(new Error('Invalid anime data'), 'setAnimeOverride');
    return;
  }

  const overrideRef = doc(firestore, 'admin', 'overrides', 'animes', animeId);
  const payload = {
    ...data,
    updatedAt: serverTimestamp(),
    updatedBy: mockAuth.currentUser?.uid || 'unknown',
  };

  // Do not `await` the setDoc call directly. Chain a .catch() instead.
  setDoc(overrideRef, payload, { merge: true })
    .then(() => {
        // We can still show a success toast on the happy path.
        // Note: This won't show in Next.js Server Actions without a client-side component.
        console.log('Anime override saved successfully!');
    })
    .catch(async (serverError) => {
        // Check if the error is a permission error before creating the contextual error.
        if (serverError.code === 'permission-denied') {
            const permissionError = new FirestorePermissionError({
                path: overrideRef.path,
                operation: 'update', // or 'create' depending on logic, 'update' is safer with merge:true
                requestResourceData: payload,
            } satisfies SecurityRuleContext);

            // Emit the error through the central emitter.
            errorEmitter.emit('permission-error', permissionError);
        } else {
            // For other types of errors (network, etc.), use the generic handler.
            handleAdminError(serverError, 'setAnimeOverride');
        }
    });
}
