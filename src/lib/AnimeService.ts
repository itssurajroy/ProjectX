
import { AnimeAboutResponse, AnimeEpisode, EpisodeServer, EpisodeSourcesResponse, HomeData, SearchResult, ScheduleResponse, SearchSuggestionResponse, QtipAnime } from "@/types/anime";
import { env } from "./env";

type ServiceError = { success: false; error: string; status?: number };

/**
 * Fetches data from the anime API. It constructs the URL and handles fetch operations.
 * This function is for internal use by the AnimeService class.
 *
 * @param path - The API endpoint path.
 * @param queryParams - An object representing URL query parameters.
 * @returns A promise that resolves to the JSON response data or a service error object.
 */
async function fetchFromApi(path: string, queryParams: Record<string, string | number | string[] | undefined> = {}): Promise<any> {
    const url = new URL(`${env.NEXT_PUBLIC_HIANIME_API_BASE}/${path}`);
    
    // Append query parameters to the URL
    Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== undefined) {
             if (Array.isArray(value)) {
                value.forEach(v => url.searchParams.append(key, v));
            } else {
                url.searchParams.append(key, String(value));
            }
        }
    });

    try {
        const res = await fetch(url.toString(), {
            headers: {
                'Accept': 'application/json',
            }
        });
        
        if (!res.ok) {
            // Don't log 404s as they are expected for some tooltips
            if (res.status !== 404) {
                const errorBody = await res.json().catch(() => ({ error: 'Failed to parse error response' }));
                console.error(`API error for ${path}:`, res.status, errorBody);
            }
            return { success: false, error: `API returned status ${res.status}`, status: res.status };
        }

        const data = await res.json();
        return data; 
    } catch (e: any) {
        console.error(`Failed to fetch from API for path ${path}:`, e);
        return { success: false, error: e.message || 'Unknown fetch error' };
    }
}


/**
 * A service class to interact with the anime data API.
 * It provides methods to fetch various types of anime data, such as home page content,
 * search results, anime details, and episode information.
 * All methods are static and can be called directly.
 */
export class AnimeService {
  /**
   * Fetches the data required for the home page.
   * @returns A promise resolving to home page data or a service error.
   */
  static async getHomeData(): Promise<{ data: HomeData } | ServiceError> {
    return await fetchFromApi('home');
  }

  /**
   * Searches for anime based on a query and various filters.
   * @param query - The search term.
   * @param page - The page number for pagination.
   * @returns A promise resolving to search results or a service error.
   */
  static async searchAnime(
    query: string, 
    page: number = 1
  ): Promise<{data: SearchResult} | ServiceError> {
     return await fetchFromApi('search', { q: query, page });
  }
  
  /**
   * Fetches search suggestions based on a partial query.
   * @param query - The search term.
   * @returns A promise resolving to a list of suggestions or a service error.
   */
  static async getSearchSuggestions(query: string): Promise<{data: SearchSuggestionResponse} | ServiceError> {
    if (!query) return { data: { suggestions: [] } };
    return await fetchFromApi('search/suggest', { q: query });
  }

  /**
   * Fetches detailed information about a specific anime.
   * @param id - The ID of the anime.
   * @returns A promise resolving to the anime's details or a service error.
   */
  static async getAnimeAbout(id: string): Promise<{ data: AnimeAboutResponse } | ServiceError> {
     return await fetchFromApi(`anime/${id}`);
  }

  /**
   * Fetches tooltip information for a specific anime.
   * @param id - The ID of the anime.
   * @returns A promise resolving to tooltip data or a service error.
   */
  static async getAnimeQtip(id: string): Promise<{ data: { anime: QtipAnime } } | ServiceError> {
    return await fetchFromApi(`qtip/${id}`);
  }
  
  /**
   * Fetches the list of episodes for a specific anime.
   * @param animeId - The ID of the anime.
   * @returns A promise resolving to a list of episodes or a service error.
   */
  static async getEpisodes(animeId: string): Promise<{data: {episodes: AnimeEpisode[]}} | ServiceError> {
     return await fetchFromApi(`anime/${animeId}/episodes`);
  }
  
  /**
   * Fetches anime belonging to a specific genre.
   * @param genre - The genre to filter by.
   * @param page - The page number for pagination.
   * @returns A promise resolving to a list of anime or a service error.
   */
  static async getGenre(genre: string, page: number = 1) {
    return await fetchFromApi(`genre/${genre}`, { page });
  }

  /**
   * Fetches the anime release schedule for a given date.
   * @param date - The date in YYYY-MM-DD format.
   * @returns A promise resolving to the schedule or a service error.
   */
  static async getSchedule(date: string): Promise<{data: ScheduleResponse} | ServiceError> {
    return await fetchFromApi('schedule', { date });
  }

  /**
   * Fetches a list of anime sorted alphabetically.
   * @param sortOption - The character or category to sort by.
   * @param page - The page number for pagination.
   * @returns A promise resolving to a sorted list of anime or a service error.
   */
  static async getAZList(sortOption: string, page: number = 1): Promise<{data: SearchResult } | ServiceError> {
    return await fetchFromApi(`az-list/${sortOption}`, { page });
  }

  /**
   * Fetches available streaming servers for a specific anime episode.
   * @param animeEpisodeId - The ID of the anime episode.
   * @returns A promise resolving to a list of servers or a service error.
   */
  static async getEpisodeServers(animeEpisodeId: string): Promise<{data: {sub: EpisodeServer[], dub: EpisodeServer[], raw: EpisodeServer[]}} | ServiceError> {
    return await fetchFromApi('anime/episode/servers', { episodeId: animeEpisodeId });
  }

  /**
   * Proxies a URL to bypass CORS restrictions, typically for HLS streams.
   * @param url - The URL to proxy.
   * @returns The proxied URL.
   */
  static getProxiedUrl(url: string): string {
    return `/api/proxy?url=${encodeURIComponent(url)}`;
  }
  
  /**
   * Fetches the video sources for a specific anime episode from a given server.
   * It proxies HLS and subtitle URLs to avoid CORS issues.
   * @param animeEpisodeId - The ID of the anime episode.
   * @param server - The server to fetch from.
   * @param category - The language category (sub, dub, or raw).
   * @returns A promise resolving to the episode sources or a service error.
   */
  static async getEpisodeSources(animeEpisodeId: string, server: string, category: 'sub' | 'dub' | 'raw'): Promise<EpisodeSourcesResponse | ServiceError> {
    const data = await fetchFromApi('anime/episode/sources', { 
        episodeId: animeEpisodeId, 
        server, 
        category 
    });

    if (data.success === false) {
        return data;
    }

    return {
        ...data,
        sources: data.sources.map((source: any) => ({
            ...source,
            url: source.isM3U8 ? this.getProxiedUrl(source.url) : source.url,
        })),
        subtitles: data.subtitles?.map((subtitle: any) => ({
            ...subtitle,
            url: this.getProxiedUrl(subtitle.url),
        })) || [],
    };
  }
}
