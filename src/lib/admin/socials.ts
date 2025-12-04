'use server';

import { doc, setDoc } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

const { firestore } = initializeFirebase();

export async function updateSocials(links: {
  discord?: string;
  twitter?: string;
  telegram?: string;
}) {
  await setDoc(doc(firestore, 'admin', 'socials'), links, { merge: true });
}
