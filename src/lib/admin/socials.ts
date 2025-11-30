'use server';

import { doc, setDoc } from 'firebase/firestore';
import { initializeAdminFirebase } from '@/firebase/server-admin';

const { firestore } = initializeAdminFirebase();

export async function updateSocials(links: {
  discord?: string;
  twitter?: string;
  telegram?: string;
}) {
  await setDoc(doc(firestore, 'admin', 'socials'), links, { merge: true });
}
