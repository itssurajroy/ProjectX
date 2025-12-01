
// src/lib/AnimeService.ts — FINAL 100% WORKING VERSION
const API_BASE = "/api";
const PROXY = "/api/stream?url=";

async function api<T>(endpoint: string): Promise<any> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    next: { revalidate: 300 },
    headers: { "User-Agent": "ProjectX/1.0" }
  });

  if (!res.ok) {
    // Forward the error from the proxy
    const errorBody = await res.text();
    throw new Error(`API Request Failed: ${res.status} ${res.statusText} - ${errorBody}`);
  }
  const json = await res.json();
  if (json.status === 500) throw new Error(json.message || `API error ${json.status}`)
  if (!json.success && json.message) throw new Error(json.message);
  
  // The external API nests the data, the proxy returns it directly.
  return json.data ?? json;
}

export class AnimeService {
  static home = () => api("/home");
  static movies = (page = 1) => api(`/category/movie?page=${page}`);
  static tv = (page = 1) => api(`/category/tv?page=${page}`);
  static search = (q: string, page = 1) => api(`/search?q=${encodeURIComponent(q)}&page=${page}`);
  static anime = (id: string) => api(`/anime/${id}`);
  static qtip = (id: string) => api(`/qtip/${id}`);
  static episodes = (id: string) => api(`/anime/${id}/episodes`);
  static servers = (epId: string) => api(`/episode/servers?animeEpisodeId=${epId}`);
  static getAZList = (character: string, page = 1) => api(`/azlist/${character}?page=${page}`);
  static getSchedule = (date: string) => api(`/schedule?date=${date}`);
  static getCategory = (category: string, page: number) => api(`/category/${category}?page=${page}`);
  
  static async sources(epId: string, server = "hd-1", category: "sub" | "dub" = "sub") {
    const data = await api(`/episode/sources?animeEpisodeId=${epId}&server=${server}&category=${category}`);
    
    return {
      ...data,
      sources: data.sources.map((s: any) => ({
        ...s,
        url: s.isM3U8 ? `${PROXY}${encodeURIComponent(s.url)}` : s.url
      })),
      subtitles: data.subtitles?.map((s: any) => ({
        ...s,
        url: `${PROXY}${encodeURIComponent(s.url)}`
      })) || []
    };
  }
}
