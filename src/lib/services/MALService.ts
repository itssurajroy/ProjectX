
// src/lib/services/MALService.ts
const API_BASE = "/api/mal";

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
  private static async fetchMAL(endpoint: string, params: Record<string, any> = {}) {
    const url = new URL(`${API_BASE}${endpoint}`);
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) {
        url.searchParams.append(k, String(v));
      }
    });

    try {
        const res = await fetch(url.toString(), {
          next: { revalidate: 3600 }, // Revalidate every hour
        });

        if (!res.ok) {
          console.warn(`[MAL PROXY] Failed to fetch from MAL API: ${res.status}`);
          return null;
        }

        const data = await res.json();
        return data;

    } catch (e) {
        console.error("[MAL Service] Fetch failed", e);
        return null;
    }
  }

  static async getById(malId: number): Promise<MALAnime | null> {
    const params = {
      fields: 'id,title,main_picture,mean,rank,status,num_episodes,start_season,genres,synopsis,recommendations'
    };
    return await this.fetchMAL(`/anime/${malId}`, params);
  }

  static async search(title: string) {
    const params = {
      q: title,
      limit: 1, // Only need the top result for resolution
      fields: 'id,title'
    };
    return await this.fetchMAL('/anime', params);
  }

  static async getRecommendations(malId: number) {
    const data = await this.getById(malId);
    return data?.recommendations || [];
  }
}
