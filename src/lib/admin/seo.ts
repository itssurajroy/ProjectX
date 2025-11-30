'use server';

import { doc, setDoc } from 'firebase/firestore';
import { initializeAdminFirebase } from '@/firebase/server-admin';

const { firestore } = initializeAdminFirebase();

export async function updateSEO(
  page: string,
  data: { title: string; description: string; ogImage?: string }
) {
  await setDoc(doc(firestore, 'admin', 'seo', 'pages', page), data);
}
