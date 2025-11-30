
'use server';
// src/lib/MALService.ts
const CLIENT_ID = process.env.NEXT_PUBLIC_MAL_CLIENT_ID!;

interface MALAnime {
  id: number;
  title: string;
  main_picture: { medium: string; large: string };
  mean: number;
  rank: number;
  status: string;
  num_episodes: number;
  start_season?: { year: number; season: string };
  genres: { id: number; name: string }[];
  synopsis: string;
  recommendations: { node: { id: number; title: string, main_picture: { medium: string; large: string } } }[];
}

export class MALService {
  private static cache = new Map<string, any>();
  private static cacheTime = new Map<string, number>();

  private static async fetchMAL(endpoint: string, params: Record<string, any> = {}) {
    const url = new URL(`https://api.myanimelist.net/v2${endpoint}`);
    Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, String(v)));
    
    if(!url.searchParams.has('limit')) {
        url.searchParams.append('limit', '10');
    }
    if(!url.searchParams.has('fields')) {
        url.searchParams.append('fields', 'id,title,main_picture,mean,rank,status,num_episodes,start_season,genres,synopsis,recommendations');
    }

    const cacheKey = url.toString();
    const now = Date.now();

    if (this.cache.has(cacheKey) && this.cacheTime.get(cacheKey)! > now - 1000 * 60 * 30) {
      return this.cache.get(cacheKey);
    }

    try {
        const res = await fetch(url.toString(), {
          headers: {
            'X-MAL-CLIENT-ID': CLIENT_ID,
          },
          next: { revalidate: 3600 },
        });

        if (!res.ok) {
          console.warn('[MAL] Rate limited or error:', res.status);
          return null;
        }

        const data = await res.json();
        this.cache.set(cacheKey, data);
        this.cacheTime.set(cacheKey, now);
        return data;

    } catch (e) {
        console.error("[MAL] Fetch failed", e);
        return null;
    }
  }

  static async getById(malId: number): Promise<MALAnime | null> {
    return await this.fetchMAL(`/anime/${malId}`);
  }

  static async search(title: string) {
    return await this.fetchMAL('/anime', { q: title });
  }

  static async getRecommendations(malId: number) {
    const data = await this.fetchMAL(`/anime/${malId}`, { fields: 'recommendations' });
    return data?.recommendations || [];
  }
}
