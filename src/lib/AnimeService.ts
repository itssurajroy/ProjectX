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

async function safeFetch<T>(endpoint: string, retries = 3): Promise<{ success: true; data: T } | { success: false; error: string }> {
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
        if (json.data === undefined) return { success: false, error: json.message || "API error" };
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
export const getHomeData = () => safeFetch<any>("/home");
export const getMovies = (page = 1) => safeFetch<any>(`/movies?page=${page}`);
export const getTV = (page = 1) => safeFetch<any>(`/tv?page=${page}`);
export const getAnime = (id: string) => safeFetch<any>(`/info/${id}`);
export const getAnimeAbout = (id: string) => safeFetch<any>(`/info/${id}`);
export const getAnimeQtip = (id: string) => safeFetch<any>(`/qtip/${id}`);
export const getEpisodes = (animeId: string) => safeFetch<any>(`/episodes/${animeId}`);
export const search = (q: string, page = 1) => safeFetch<any>(`/search?q=${encodeURIComponent(q)}&page=${page}`);
export const getSearchSuggestions = (q: string) => safeFetch<any>(`/search/suggest?q=${encodeURIComponent(q)}`);
export const getAZList = (char: string, page=1) => safeFetch<any>(`/az-list/${char}?page=${page}`);
export const getCategory = (category: string, page=1) => safeFetch<any>(`/category/${category}?page=${page}`);
export const getSchedule = (date: string) => safeFetch<any>(`/schedule?date=${date}`);

// Episode Servers
export const getEpisodeServers = async (episodeId: string) => {
    return safeFetch<any>(`/servers?episodeId=${episodeId}`);
}

// GOD-TIER: Smart Stream Loader with Fallbacks
export const getSmartSources = async (
    episodeId: string,
    preferredServers = ["hd-1", "vidstreaming", "megacloud"],
    category: "sub" | "dub" = "sub"
): Promise<StreamResult> => {
    const result: StreamResult = {
        sources: [],
        subtitles: [],
        backupSources: [],
    };

    for (const server of preferredServers) {
        const res = await safeFetch<any>(
        `/sources?episodeId=${episodeId}&server=${server}&category=${category}`
        );

        if (!res.success) continue;

        const { sources = [], subtitles = [] } = res.data;

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

        if (source.quality?.includes("1080") || source.isM3U8) {
            validSources.unshift(streamObj);
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