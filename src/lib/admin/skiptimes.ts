'use server';

import { doc, setDoc } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

const { firestore } = initializeFirebase();

export async function updateSkipTimes(
  animeId: string,
  episode: number,
  times: {
    intro?: { start: number; end: number };
    outro?: { start: number; end: number };
  }
) {
  await setDoc(
    doc(firestore, 'admin', 'skiptimes', 'animes', animeId),
    {
      episodes: { [episode]: times },
    },
    { merge: true }
  );
}
