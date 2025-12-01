export interface AnimeBase {
    id: string;
    name: string;
    poster: string;
    jname?: string;
    episodes?: {
        sub: number;
        dub: number;
    };
    totalEpisodes?: number;
    type?: string;
    duration?: string;
    rank?: number;
    rating?: string;
}

export interface SpotlightAnime extends AnimeBase {
    description: string;
    rank: number;
    otherInfo: string[];
}

export interface TrendingAnime extends AnimeBase {
    rank: number;
}

export interface Top10Anime extends AnimeBase {
    rank: number;
}

export interface HomeData {
    trendingAnimes: TrendingAnime[];
    spotlightAnimes: SpotlightAnime[];
    latestEpisodeAnimes: AnimeBase[];
    topAiringAnimes: AnimeBase[];
    topUpcomingAnimes: AnimeBase[];
    top10Animes: {
        today: Top10Anime[];
        week: Top10Anime[];
        month: Top10Anime[];
    };
    mostPopularAnimes: AnimeBase[];
    mostFavoriteAnimes: AnimeBase[];
    latestCompletedAnimes: AnimeBase[];
    genres: string[];
}

export interface SearchResult {
    animes: AnimeBase[];
    mostPopularAnimes: AnimeBase[];
    currentPage: number;
    hasNextPage: boolean;
    totalPages: number;
    totalAnimes?: number;
}

export interface AnimeSeason {
    id: string;
    name: string;
    title: string;
    poster: string;
    isCurrent: boolean;
}

export interface VoiceActor {
    id: string;
    name: string;
    poster: string;
    cast: string;
}

export interface Character {
    id: string;
    name: string;
    poster: string;
    cast: string;
}

export interface CharacterVoiceActor {
    character: Character;
    voiceActor: VoiceActor;
}

export interface PromotionalVideo {
    title?: string;
    source?: string;
    thumbnail?: string;
}

export interface AnimeInfo {
    id: string;
    name: string;
    poster: string;
    description: string;
    stats: {
        rating: string;
        quality: string;
        episodes: {
            sub: number;
            dub: number;
        };
        type: string;
        duration: string;
    };
    promotionalVideos: PromotionalVideo[];
    characterVoiceActors: CharacterVoiceActor[];
}

export interface AnimeAbout {
    info: AnimeInfo;
    moreInfo: Record<string, any> & { 
        malId?: number;
        nextAiringEpisode?: {
            airingTime: number;
            timeUntilAiring: number;
            episode: number;
        };
     };
}

export interface AnimeAboutResponse {
    anime: AnimeAbout;
    seasons: AnimeSeason[];
    relatedAnimes: AnimeBase[];
    recommendedAnimes: AnimeBase[];
    mostPopularAnimes: AnimeBase[];
}

export interface AnimeEpisode {
    number: number;
    title: string;
    episodeId: string;
    isFiller: boolean;
}

export interface EpisodeServer {
    serverId: number;
    serverName: string;
}

export interface EpisodeServersResponse {
    episodeId: string;
    episodeNo: number;
    sub: EpisodeServer[];
    dub: EpisodeServer[];
    raw: EpisodeServer[];
}


export interface Source {
    url: string;
    isM3U8: boolean;
    quality?: string;
}

export interface Subtitle {
    lang: string;
    url: string;
}

export interface EpisodeSourcesResponse {
    headers: Record<string, string>;
    sources: Source[];
    subtitles: Subtitle[];
    anilistID: number | null;
    malID: number | null;
}

export interface ScheduleResponse {
    scheduledAnimes: {
        id: string;
        time: string;
        name: string;
        jname: string;
        episode: number;
        airingTimestamp: number;
        secondsUntilAiring: number;
    }[];
}

export interface SearchSuggestion {
    id: string;
    name: string;
    poster: string;
jname: string;
    moreInfo: string[];
}

export interface SearchSuggestionResponse {
    suggestions: SearchSuggestion[];
}

export interface QtipAnime {
  id: string;
  name: string;
  malscore: string;
  quality: string;
  episodes: {
    sub: number;
    dub: number;
  };
  type: string;
  description: string;
  jname: string;
  synonyms: string;
  aired: string;
  status: string;
  genres: string[];
}
