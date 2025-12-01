// src/lib/AnimeService.ts
const API_BASE = "/api";
const STREAM_PROXY_BASE = "/api/stream";

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
  
  static async getEpisodeSources(episodeId: string, category: "sub" | "dub" = "sub") {
    const servers = ["hd-1", "vidstreaming", "megacloud", "streamwish", "filemoon"];
    
    for (const server of servers) {
      try {
        const res = await fetch(`${STREAM_PROXY_BASE}/episode/sources?animeEpisodeId=${episodeId}&server=${server}&category=${category}`);
        
        if (!res.ok) continue;
        
        const json = await res.json();
        
        if (json.success && json.data?.sources?.length > 0) {
          // Auto proxy all m3u8 and subtitles
          return {
            ...json.data,
            sources: json.data.sources.map((s: any) => ({
              ...s,
              url: s.isM3U8 || s.url.includes(".m3u8")
                ? `https://m3u8proxy-kohl-one.vercel.app/?url=${encodeURIComponent(s.url)}`
                : s.url
            })),
            subtitles: (json.data.subtitles || []).map((s: any) => ({
              ...s,
              url: `https://m3u8proxy-kohl-one.vercel.app/?url=${encodeURIComponent(s.url)}`
            }))
          };
        }
      } catch (err) {
        console.log(`Server ${server} failed, trying next...`);
        continue;
      }
    }

    // Final fallback
    return {
      sources: [],
      subtitles: [],
      message: "All servers failed. Please try again later."
    };
  }
}