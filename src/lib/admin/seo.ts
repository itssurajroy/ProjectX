'use server';

import { doc, setDoc } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

const { firestore } = initializeFirebase();

export async function updateSEO(
  page: string,
  data: { title: string; description: string; ogImage?: string }
) {
  await setDoc(doc(firestore, 'admin', 'seo', 'pages', page), data);
}
