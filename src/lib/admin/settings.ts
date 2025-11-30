'use server';

import { initializeFirebase } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';

const { firestore } = initializeFirebase();

export async function toggleMaintenance(enabled: boolean) {
  await setDoc(doc(firestore, 'admin', 'settings'), { maintenance: enabled }, { merge: true });
}

export async function disableSignups(disabled: boolean) {
  await setDoc(doc(firestore, 'admin', 'settings'), { signupDisabled: disabled }, { merge: true });
}
