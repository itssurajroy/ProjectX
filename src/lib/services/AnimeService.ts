

const API_BASE = "/api";

async function api<T>(endpoint: string): Promise<any> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    next: { revalidate: 300 },
    headers: { "User-Agent": "ProjectX/1.0" }
  });

  if (!res.ok) {
    const errorBody = await res.text();
    console.error(`[API Request Error] ${res.status} ${res.statusText} on ${endpoint}. Body: ${errorBody}`);
    throw new Error(`API Request Failed: ${res.status} ${res.statusText} - ${errorBody}`);
  }
  const json = await res.json();
  if (json.status === 500 || json.success === false) {
    throw new Error(json.message || `API error ${json.status}`);
  }
  
  return json.data ?? json;
}

export class AnimeService {
  static request = (endpoint: string) => api(endpoint.startsWith('/') ? endpoint : `/${endpoint}`);
  static home = () => api("/meta/anilist/home");
  static search = (params: URLSearchParams) => api(`/meta/anilist/advanced-search?${params.toString()}`);
  static getSearchSuggestions = (query: string) => api(`/meta/anilist/search/suggest?limit=10&q=${encodeURIComponent(query)}`);
  static anime = (id: string) => api(`/meta/anilist/info/${id}`);
  static qtip = (id: string) => api(`/meta/anilist/qtip/${id}`);
  static episodes = (id: string) => api(`/meta/anilist/episodes/${id}`);
  static getEpisodeServers = (epId: string) => api(`/meta/anilist/servers?episodeId=${encodeURIComponent(epId)}`);
  static getEpisodeSources = (epId: string, server: string, category: "sub" | "dub" = "sub") => api(`/meta/anilist/sources?episodeId=${encodeURIComponent(epId)}&server=${server}&category=${category}`);
  static getAZList = (character: string, page = 1) => api(`/meta/anilist/az-list/${character}?page=${page}`);
  static getSchedule = (date: string) => api(`/meta/anilist/schedule?date=${date}`);
  static getCategory = (category: string, page: number) => api(`/meta/anilist/${category}?page=${page}`);
  static getGenres = () => api("/meta/anilist/genres");
  static tv = (page: number) => api(`/meta/anilist/tv?page=${page}`);
}
