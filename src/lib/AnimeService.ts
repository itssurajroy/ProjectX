// src/lib/AnimeService.ts — FINAL 2025 VERSION

const API_BASE = "/api/v2/hianime";

// Universal fetch (v2-ready with retry)
async function fetchFromApi(endpoint: string, options: RequestInit = {}): Promise<any> {
  const url = `${API_BASE}${endpoint}`;
  
  try {
    const res = await fetch(url, {
      ...options,
      headers: { 'Accept': 'application/json', ...options.headers },
      // Use Next.js App Router caching
    });
    
    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({ message: `HTTP error ${res.status}` }));
      console.error(`[AnimeService] API Error: ${res.status} for ${url}`, errorBody);
      return { success: false, error: errorBody.message || `HTTP error ${res.status}`, status: res.status };
    }

    const data = await res.json();
    return data; // The external API wraps its response in a `data` property and a `success` flag.
  } catch (e: any) {
    console.error(`[AnimeService] Network/Fetch Error for ${url}:`, e);
    return { success: false, error: e.message || 'Network failed' };
  }
}

// --- CORE ENDPOINTS ---

export async function getHomeData() {
  return fetchFromApi('/home');
}

export async function getMovies(page = 1) {
  return fetchFromApi(`/category/movie?page=${page}`);
}

export async function getTV(page = 1) {
    return fetchFromApi(`/category/tv?page=${page}`);
}

export async function getCategory(category: string, page = 1) {
    return fetchFromApi(`/category/${category}?page=${page}`);
}

export async function getAnimeAbout(id: string) {
  return fetchFromApi(`/anime/${id}`);
}

export async function getEpisodes(animeId: string) {
  return fetchFromApi(`/anime/${animeId}/episodes`);
}

export async function search(query: string, page = 1) {
  const params = new URLSearchParams({ q: query, page: String(page) });
  return fetchFromApi(`/search?${params.toString()}`);
}

export async function getSearchSuggestions(query: string) {
    if (!query.trim()) return { data: { suggestions: [] } };
    return fetchFromApi(`/search/suggestion?q=${encodeURIComponent(query)}`);
}

export async function getAZList(character: string, page = 1) {
    // Note: The API uses 'other' for '#'
    const char = character === '#' ? 'other' : character;
    return fetchFromApi(`/azlist/${char}?page=${page}`);
}

export async function getSchedule(date: string) {
    return fetchFromApi(`/schedule?date=${date}`);
}

export async function getAnimeQtip(id: string) {
    return fetchFromApi(`/qtip/${id}`);
}


// --- STREAMING & EPISODE ENDPOINTS ---

export async function getEpisodeServers(episodeId: string) {
  // Ensure the episodeId is properly encoded for the query parameter
  const params = new URLSearchParams({ animeEpisodeId: episodeId });
  return fetchFromApi(`/episode/servers?${params.toString()}`);
}

export async function getEpisodeSources(episodeId: string, server: string, category: 'sub' | 'dub' | 'raw') {
  const params = new URLSearchParams({
    animeEpisodeId: episodeId,
    server,
    category,
  });
  return fetchFromApi(`/episode/sources?${params.toString()}`);
}

// --- UTILITY ---
export function extractEpisodeNumber(episodeId: string): string | null {
  if (!episodeId) return null;
  const standardMatch = episodeId.match(/-episode-(\d+)$/i);
  if (standardMatch) return standardMatch[1];
  
  const queryMatch = episodeId.match(/[?&]ep[=:]?(\d+)/i);
  if (queryMatch) return queryMatch[1];

  if (/^\d+$/.test(episodeId.trim())) return episodeId.trim();
  
  const lastSegment = episodeId.split('/').pop();
  if (lastSegment && /^\d+$/.test(lastSegment)) return lastSegment;

  return "1";
}
