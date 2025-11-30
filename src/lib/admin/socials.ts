'use server';

import { initializeFirebase } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';

const { firestore } = initializeFirebase();

export async function updateSocials(links: {
  discord?: string;
  twitter?: string;
  telegram?: string;
}) {
  await setDoc(doc(firestore, 'admin', 'socials'), links, { merge: true });
}
