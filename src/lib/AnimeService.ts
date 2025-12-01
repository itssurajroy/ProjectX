
// src/lib/AnimeService.ts
const API_PROXY = "/api/proxy";
const STREAM_PROXY = "/api/stream";

// Types
type StreamSource = {
  url: string;
  quality?: string;
  isM3U8: boolean;
  status?: "ok" | "failed" | "loading";
};

type StreamResult = {
  sources: StreamSource[];
  subtitles: { lang: string; url: string }[];
  backupSources?: StreamSource[];
};

class AnimeService {
  private static async safeFetch<T>(endpoint: string, retries = 3): Promise<{ success: true; data: T } | { success: false; error: string }> {
    for (let i = 0; i < retries; i++) {
      try {
        const controller = new AbortController ? new AbortController() : null;
        const timeout = setTimeout(() => controller?.abort(), 15000);

        const res = await fetch(`${API_PROXY}${endpoint}`, {
          signal: controller?.signal,
          headers: {
            "User-Agent": "ProjectX/1.0",
            Accept: "application/json",
          },
          next: { revalidate: 300 },
        });

        clearTimeout(timeout);

        if (!res.ok) {
          if (res.status === 404) return { success: false, error: "Not found" };
          if (res.status === 429) return { success: false, error: "Rate limited" };
          continue;
        }

        const json = await res.json();
        if (!json.success && json.data === undefined) return { success: false, error: json.message || "API error" };
        if (!json.success) return { success: false, error: json.message || "API error" };

        return { success: true, data: json.data };
      } catch (err: any) {
        if (i === retries - 1) {
          return { success: false, error: err.message || "Network failed" };
        }
        await new Promise(r => setTimeout(r, 1000 * (i + 1)));
      }
    }
    return { success: false, error: "All retries failed" };
  }

  // Core Endpoints
  static getHomeData = () => this.safeFetch<any>("/home");
  static getMovies = (page = 1) => this.safeFetch<any>(`/movies?page=${page}`);
  static getTV = (page = 1) => this.safeFetch<any>(`/tv?page=${page}`);
  static getAnime = (id: string) => this.safeFetch<any>(`/anime/${id}`);
  static getAnimeAbout = (id: string) => this.safeFetch<any>(`/info/${id}`);
  static getAnimeQtip = (id: string) => this.safeFetch<any>(`/qtip/${id}`);
  static getEpisodes = (animeId: string) => this.safeFetch<any>(`/anime/${animeId}/episodes`);
  static search = (q: string, page = 1) => this.safeFetch<any>(`/search?q=${encodeURIComponent(q)}&page=${page}`);
  static getSearchSuggestions = (q: string) => this.safeFetch<any>(`/search/suggest?q=${encodeURIComponent(q)}`);
  static getAZList = (char: string, page=1) => this.safeFetch<any>(`/az-list/${char}?page=${page}`);
  static getCategory = (category: string, page=1) => this.safeFetch<any>(`/category/${category}?page=${page}`);
  static getSchedule = (date: string) => this.safeFetch<any>(`/schedule?date=${date}`);


  // Episode Servers
  static async getEpisodeServers(episodeId: string) {
    return this.safeFetch<any>(`/episode/servers?animeEpisodeId=${episodeId}`);
  }

  // GOD-TIER: Smart Stream Loader with Fallbacks
  static async getSmartSources(
    episodeId: string,
    preferredServers = ["hd-1", "vidstreaming", "megacloud"],
    category: "sub" | "dub" = "sub"
  ): Promise<StreamResult> {
    const result: StreamResult = {
      sources: [],
      subtitles: [],
      backupSources: [],
    };

    // Try each server until one works
    for (const server of preferredServers) {
      const res = await this.safeFetch<any>(
        `/episode/sources?animeEpisodeId=${episodeId}&server=${server}&category=${category}`
      );

      if (!res.success) continue;

      const { sources = [], subtitles = [] } = res.data;

      // Proxy + validate each source
      const validSources: StreamSource[] = [];
      const backup: StreamSource[] = [];

      for (const source of sources) {
        const proxiedUrl = `${STREAM_PROXY}?url=${encodeURIComponent(source.url)}`;
        const streamObj: StreamSource = {
          url: proxiedUrl,
          quality: source.quality || "auto",
          isM3U8: source.isM3U8 || source.url.includes(".m3u8"),
          status: "loading",
        };

        // Primary if HD or M3U8, else backup
        if (source.quality?.includes("1080") || source.isM3U8) {
          validSources.unshift(streamObj); // Best first
        } else {
          backup.push(streamObj);
        }
      }

      result.sources = validSources;
      result.backupSources = backup;
      result.subtitles = subtitles.map((s: any) => ({
        lang: s.lang,
        url: `${STREAM_PROXY}?url=${encodeURIComponent(s.url)}`,
      }));

      if (validSources.length > 0) {
        console.log(`[SmartStream] Success with server: ${server}`);
        return result;
      }
    }

    return result; // All failed → empty but safe
  }
}

export default AnimeService;

// Helper: Extract clean episode number from "one-piece-100?ep=12345" → "12345"
export const extractEpisodeNumber = (episodeId: string): string | null => {
  if (!episodeId) return null;
  // Case 1: "one-piece-episode-1111"
  const standardMatch = episodeId.match(/-episode-(\d+)$/i);
  if (standardMatch) return standardMatch[1];
  
  // Case 2: "?ep=1111 or &ep=1111"
  const queryMatch = episodeId.match(/[?&]ep[=:]?(\d+)/i);
  if (queryMatch) return queryMatch[1];

  // Case 3: Simple number "1111"
  if (/^\d+$/.test(episodeId.trim())) return episodeId.trim();
  
  return episodeId.split('/').pop() || "1";
};
