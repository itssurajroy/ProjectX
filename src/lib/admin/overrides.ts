'use server';

import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { handleAdminError } from './utils';
import { initializeAdminFirebase } from '@/firebase/server-admin';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import type { SecurityRuleContext } from '@/firebase/errors';

const { firestore } = initializeAdminFirebase();

// This is a placeholder. In a real app, you'd get this from your auth state.
const mockAuth = { currentUser: { uid: 'admin-user-placeholder' } };

export async function setAnimeOverride(
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
    handleAdminError(new Error('Invalid anime data'), 'setAnimeOverride');
    return;
  }

  const overrideRef = doc(firestore, 'admin', 'overrides', 'animes', animeId);
  const payload = {
    ...data,
    updatedAt: serverTimestamp(),
    updatedBy: mockAuth.currentUser?.uid || 'unknown',
  };

  try {
    // Check if the document exists to determine operation type
    const docSnap = await getDoc(overrideRef);
    const operation: SecurityRuleContext['operation'] = docSnap.exists() ? 'update' : 'create';

    await setDoc(overrideRef, payload, { merge: true });
    console.log('Anime override saved successfully!');
  } catch (serverError: any) {
    if (serverError.code === 'permission-denied') {
      const docSnap = await getDoc(overrideRef);
      const operation: SecurityRuleContext['operation'] = docSnap.exists() ? 'update' : 'create';

      const permissionError = new FirestorePermissionError({
        path: overrideRef.path,
        operation: operation,
        requestResourceData: payload,
      } satisfies SecurityRuleContext);

      errorEmitter.emit('permission-error', permissionError);
    } else {
      handleAdminError(serverError, 'setAnimeOverride');
    }
  }
}
