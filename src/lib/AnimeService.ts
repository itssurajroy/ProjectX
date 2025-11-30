

import { AnimeAboutResponse, AnimeEpisode, EpisodeServer, EpisodeSourcesResponse, HomeData, SearchResult, ScheduleResponse, SearchSuggestionResponse, QtipAnime, EpisodeServersResponse } from "@/types/anime";

const HIANIME_API_BASE = "/api/proxy"

// Helper: Extract clean episode number from "one-piece-100?ep=12345" → "12345"
export const extractEpisodeNumber = (episodeId: string): string | null => {
  if (!episodeId) return null;
  const match = episodeId.match(/[\?&]ep[=:]?(\d+)/i);
  return match ? match[1] : episodeId.split('/').pop() || "1";
};

// Advanced fetch with timeout + retry + proper headers
async function fetchWithRetry(url: string, retries = 3): Promise<any> {
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "User-Agent": "ProjectX/1.0 (+https://projectx.to)",
        },
        cache: "default",
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      if (i === retries - 1) {
        console.error(`[AnimeService] Final fail after ${retries} retries:`, url, error);
        return { success: false, error: error.message || "Network error" };
      }
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
}

export class AnimeService {
  // Home Page
  static async getHomeData() {
    return fetchWithRetry(`${HIANIME_API_BASE}/home`);
  }

  // Anime Detail Page
  static async getAnimeAbout(id: string) {
    const response = await fetchWithRetry(`${HIANIME_API_BASE}/anime/${id}`);
    if (response.success) {
      return { data: response.data };
    }
    return response;
  }

  // Quick Tooltip
  static async getAnimeQtip(id: string) {
    return fetchWithRetry(`${HIANIME_API_BASE}/qtip/${id}`);
  }

  // Episodes List
  static async getEpisodes(animeId: string) {
    return fetchWithRetry(`${HIANIME_API_BASE}/anime/${animeId}/episodes`);
  }

  // Search
  static async searchAnime(query: string, page = 1) {
    return fetchWithRetry(`${HIANIME_API_BASE}/search?q=${encodeURIComponent(query)}&page=${page}`);
  }

  static async getMovies(page = 1) {
    return fetchWithRetry(`${HIANIME_API_BASE}/movies?page=${page}`);
  }

  static async getSearchSuggestions(query: string) {
    if (!query.trim()) return { success: true, data: { suggestions: [] } };
    return fetchWithRetry(`${HIANIME_API_BASE}/search/suggestion?q=${encodeURIComponent(query)}`);
  }
  
  static async getSchedule(date: string): Promise<{data: ScheduleResponse} | { success: false; error: string }> {
    return await fetchWithRetry(`${HIANIME_API_BASE}/schedule?date=${date}`);
  }

  // A-Z List
  static async getAZList(sortOption: string = "all", page = 1) {
    return fetchWithRetry(`${HIANIME_API_BASE}/az-list/${sortOption}?page=${page}`);
  }

  // Episode Streaming Links
  static async getEpisodeSources(animeEpisodeId: string, server: string, category: "sub" | "dub" | "raw" = "sub") {
     return fetchWithRetry(`${HIANIME_API_BASE}/episode/sources?animeEpisodeId=${animeEpisodeId}&server=${server}&category=${category}`);
  }

  // Episode Servers
  static async getEpisodeServers(animeEpisodeId: string): Promise<{ success: boolean, data: EpisodeServersResponse }> {
    return fetchWithRetry(`${HIANIME_API_BASE}/episode/servers?animeEpisodeId=${animeEpisodeId}`);
  }

  // Advanced Search (ALL filters)
  static buildSearchUrl(filters: {
    query?: string;
    page?: number;
    genres?: string[];
    type?: string;
    status?: string;
    season?: string;
    language?: string;
    rated?: string;
    score?: string;
    start_date?: string;
    end_date?: string;
    sort?: string;
  }) {
    const params = new URLSearchParams();
    if (filters.query) {
      params.set("q", filters.query);
    }
    if (filters.page) params.set("page", filters.page.toString());
    if (filters.genres?.length) params.set("genres", filters.genres.join(","));
    if (filters.type) params.set("type", filters.type);
    if (filters.status) params.set("status", filters.status);
    if (filters.season) params.set("season", filters.season);
    if (filters.language) params.set("language", filters.language);
    if (filters.rated) params.set("rated", filters.rated);
    if (filters.score) params.set("score", filters.score);
    if (filters.start_date) params.set("start_date", filters.start_date);
    if (filters.end_date) params.set("end_date", filters.end_date);
    if (filters.sort) params.set("sort", filters.sort);

    return `${HIANIME_API_BASE}/search?${params.toString()}`;
  }

  static async advancedSearch(filters: Parameters<typeof this.buildSearchUrl>[0]) {
    const url = this.buildSearchUrl(filters);
    return fetchWithRetry(url);
  }
}
