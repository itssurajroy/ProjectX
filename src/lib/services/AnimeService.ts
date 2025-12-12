
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
  static home = () => api("/home");
  static search = (params: URLSearchParams) => api(`/search?${params.toString()}`);
  static getSearchSuggestions = (query: string) => api(`/search/suggestion?limit=10&q=${encodeURIComponent(query)}`);
  static anime = (id: string) => api(`/anime/${id}`);
  static qtip = (id: string) => api(`/qtip/${id}`);
  static episodes = (id: string) => api(`/anime/${id}/episodes`);
  static getAZList = (character: string, page = 1) => api(`/azlist/${character}?page=${page}`);
  static getSchedule = (date: string) => api(`/schedule?date=${date}`);
  static getCategory = (category: string, page: number) => api(`/category/${category}?page=${page}`);
  static getGenres = () => api("/genres");
  static tv = (page: number) => api(`/tv-shows?page=${page}`);
}
