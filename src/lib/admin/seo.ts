'use server';

import { initializeFirebase } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';

const { firestore } = initializeFirebase();

export async function updateSEO(
  page: string,
  data: { title: string; description: string; ogImage?: string }
) {
  await setDoc(doc(firestore, 'admin', 'seo', 'pages', page), data);
}
