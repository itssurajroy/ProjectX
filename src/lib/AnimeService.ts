// src/lib/AnimeService.ts
const API_BASE = "/api";

async function api<T>(endpoint: string): Promise<any> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    next: { revalidate: 300 },
    headers: { "User-Agent": "ProjectX/1.0" }
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`API Request Failed: ${res.status} ${res.statusText} - ${errorBody}`);
  }
  const json = await res.json();
  if (json.status === 500) throw new Error(json.message || `API error ${json.status}`)
  if (!json.success && json.message) throw new Error(json.message);
  
  return json.data ?? json;
}

export class AnimeService {
  static request = (endpoint: string) => api(endpoint.startsWith('/') ? endpoint : `/${endpoint}`);
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
  static getGenres = () => api("/genres");
  
  static async getEpisodeSources(episodeId: string, server: string, category: "sub" | "dub" = "sub") {
    const endpoint = `/episode/sources?animeEpisodeId=${episodeId}&server=${server}&category=${category}`;
    const data = await this.request(endpoint);
    
    if (!data || !data.sources || data.sources.length === 0) {
        throw new Error(`No sources found on server: ${server}`);
    }

    const M3U8_PROXY = "https://m3u8proxy-kohl-one.vercel.app/?url=";

    // Auto-proxy all M3U8 and subtitle URLs
    const proxiedData = {
        ...data,
        sources: data.sources.map((s: any) => ({
            ...s,
            url: s.isM3U8 ? `${M3U8_PROXY}${encodeURIComponent(s.url)}` : s.url,
        })),
        subtitles: (data.subtitles || []).map((sub: any) => ({
            ...sub,
            url: `${M3U8_PROXY}${encodeURIComponent(sub.url)}`,
        })),
    };
    
    return proxiedData;
  }
}
