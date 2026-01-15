
import { AnimeService } from './AnimeService';
import { MALService } from './MALService';

// This function is now disconnected from any user database. It only uses the Anime and MAL services.

export async function getMALId(animeId: string): Promise<number | null> {
  // Auto search by title
  const anime = await AnimeService.anime(animeId);
  if (!anime || !anime?.anime?.info?.name) return null;

  const title = anime.anime.info.name;
  const search = await MALService.search(title);

  if (search?.data?.length > 0) {
    const bestMatch = search.data[0].node;
    return bestMatch.id;
  }

  return null;
}
