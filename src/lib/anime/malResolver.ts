
import { doc, getDoc } from 'firebase/firestore';
import { AnimeService } from '../AnimeService';
import { MALService } from '../MALService';
import { initializeAdminFirebase } from '@/firebase/server-admin';

// Use the server-side initialized firestore instance
const { firestore } = initializeAdminFirebase();


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
      console.warn(`Could not check for MAL override for ${animeId}. This is expected if not logged in as admin.`);
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
