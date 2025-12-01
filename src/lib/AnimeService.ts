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
  if (json.status === 500) throw new Error(json.message || `API error ${json.status}`)
  if (!json.success) {
    if (json.message) throw new Error(json.message)
    throw new Error("API failed");
  }
  return json.data;
}

export const home = () => api("/home");
export const movies = (page = 1) => api(`/category/movie?page=${page}`);
export const tv = (page = 1) => api(`/category/tv?page=${page}`);
export const search = (q: string, page = 1) => api(`/search?q=${encodeURIComponent(q)}&page=${page}`);
export const anime = (id: string) => api(`/anime/${id}`);
export const qtip = (id: string) => api(`/qtip/${id}`);
export const episodes = (id: string) => api(`/anime/${id}/episodes`);
export const servers = (epId: string) => api(`/episode/servers?animeEpisodeId=${epId}`);
export const getAZList = (character: string, page = 1) => api(`/azlist/${character}?page=${page}`);
export const getSchedule = (date: string) => api(`/schedule?date=${date}`);
export const getCategory = (category: string, page: number) => api(`/category/${category}?page=${page}`);

export async function sources(epId: string, server = "hd-1", category: "sub" | "dub" = "sub") {
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
