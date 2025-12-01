// src/lib/AnimeService.ts — FINAL 100% WORKING VERSION
const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;
const PROXY = process.env.NEXT_PUBLIC_CORS_PROXY!;

async function api<T>(endpoint: string): Promise<any> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    next: { revalidate: 300 },
    headers: { "User-Agent": "ProjectX/1.0" }
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "API failed");
  return json.data;
}

export const getHomeData = () => api("/home");
export const getMovies = (page = 1) => api(`/category/movie?page=${page}`);
export const getTV = (page = 1) => api(`/category/tv?page=${page}`);
export const search = (q: string, page = 1) => api(`/search?q=${encodeURIComponent(q)}&page=${page}`);
export const getAnime = (id: string) => api(`/anime/${id}`);
export const getQtip = (id: string) => api(`/qtip/${id}`);
export const getEpisodes = (id: string) => api(`/anime/${id}/episodes`);
export const getEpisodeServers = (epId: string) => api(`/episode/servers?animeEpisodeId=${epId}`);
export const getAZList = (character: string, page = 1) => api(`/azlist/${character}?page=${page}`);
export const getSchedule = (date: string) => api(`/schedule?date=${date}`);
export const getCategory = (category: string, page: number) => api(`/category/${category}?page=${page}`);

export async function getSources(epId: string, server = "hd-1", category: "sub" | "dub" = "sub") {
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
