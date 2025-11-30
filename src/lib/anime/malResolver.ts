
import { initializeFirebase } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { AnimeService } from '../AnimeService';
import { MALService } from '../MALService';

const { firestore } = initializeFirebase();

export async function getMALId(animeId: string): Promise<number | null> {
  // 1. Check override
  try {
    const overrideRef = doc(firestore, 'admin/overrides/animes', animeId);
    const overrideSnap = await getDoc(overrideRef);
    
    if (overrideSnap.exists() && overrideSnap.data()?.malId) {
      return overrideSnap.data()?.malId;
    }
  } catch (e) {
      // This might fail if user is not admin, which is fine.
  }

  // 2. Auto search by title
  const anime = await AnimeService.getAnimeAbout(animeId);
  if (!anime || 'success' in anime && !anime.success || !anime.data?.anime?.info?.name) return null;

  const title = anime.data.anime.info.name;
  const search = await MALService.search(title);

  if (search?.data?.length > 0) {
    const bestMatch = search.data[0].node;
    return bestMatch.id;
  }

  return null;
}
