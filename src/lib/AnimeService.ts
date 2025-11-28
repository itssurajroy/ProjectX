

import { AnimeAboutResponse, AnimeEpisode, EpisodeServer, EpisodeSourcesResponse, HomeData, SearchResult, ScheduleResponse, SearchSuggestionResponse, QtipAnime } from "@/types/anime";
import { env } from '@/lib/env';

type ServiceError = { success: false; error: string; status?: number };

async function fetchFromApi(path: string, queryParams: Record<string, string | number> = {}): Promise<any> {
    const params = new URLSearchParams();
    for (const key in queryParams) {
        params.append(key, String(queryParams[key]));
    }

    const fullPath = path.startsWith('/') ? path : `/${path}`;
    const url = `${env.HIANIME_API_BASE}${fullPath}?${params.toString()}`;
    
    try {
        const res = await fetch(url, {
            headers: {
                'Accept': 'application/json',
            }
        });
        
        if (!res.ok) {
            const errorBody = await res.json().catch(() => ({ error: 'Failed to parse error response' }));
            console.error(`API error for ${path}:`, res.status, errorBody);
            return { success: false, error: `API returned status ${res.status}`, status: res.status };
        }

        const data = await res.json();
        return data; 
    } catch (e: any) {
        console.error(`Failed to fetch from API for path ${path}:`, e);
        return { success: false, error: e.message || 'Unknown fetch error' };
    }
}

export class AnimeService {
  static async getHomeData(): Promise<{ data: HomeData } | ServiceError> {
    return await fetchFromApi('/home');
  }

  static async searchAnime(query: string, page: number = 1): Promise<{data: SearchResult} | ServiceError> {
     return await fetchFromApi('/search', { q: query, page });
  }
  
  static async getSearchSuggestions(query: string): Promise<{data: SearchSuggestionResponse} | ServiceError> {
    if (!query) return { data: { suggestions: [] } };
    return await fetchFromApi('/search/suggestion', { q: query });
  }

  static async getAnimeAbout(id: string): Promise<{ data: AnimeAboutResponse } | ServiceError> {
     return await fetchFromApi(`/anime/${id}`);
  }
  
  static async getAnimeQtip(id: string): Promise<{ data: { anime: QtipAnime } } | ServiceError> {
    return await fetchFromApi(`/qtip/${id}`);
  }

  static async getEpisodes(animeId: string): Promise<{data: {episodes: AnimeEpisode[]}} | ServiceError> {
     return await fetchFromApi(`/anime/${animeId}/episodes`);
  }
  
  static async getGenre(genre: string, page: number = 1) {
    return await fetchFromApi(`/genre/${genre}`, { page });
  }

  static async getSchedule(date: string): Promise<{data: ScheduleResponse} | ServiceError> {
    return await fetchFromApi('/schedule', { date });
  }

  static async getAZList(sortOption: string, page: number = 1): Promise<{data: SearchResult } | ServiceError> {
    return await fetchFromApi(`/az-list/${sortOption}`, { page });
  }

  static async getEpisodeServers(animeEpisodeId: string): Promise<{data: {sub: EpisodeServer[], dub: EpisodeServer[], raw: EpisodeServer[]}} | ServiceError> {
    const res = await fetchFromApi('/episode/servers', { episodeId: animeEpisodeId });
    return res;
  }

  static async getEpisodeSources(animeEpisodeId: string, server: string, category: 'sub' | 'dub' | 'raw'): Promise<EpisodeSourcesResponse | ServiceError> {
    const res = await fetchFromApi('/episode/sources', { episodeId: animeEpisodeId, server, category });
    return res?.data || res;
  }
}
