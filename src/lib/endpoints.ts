

export const Endpoints = {
    home: `home`,
    azList: (sortOption: string) => `az-list/${sortOption}`,
    anime: (animeId: string) => `anime/${animeId}`,
    search: `search`,
    searchSuggestion: `search/suggest`,
    genre: (genre: string) => `genre/${genre}`,
    schedule: `schedule`,
    episodes: (animeId: string) => `anime/${animeId}/episodes`,
    episodeServers: `anime/episode/servers`,
    episodeSources: `anime/episode/sources`,
    qtip: (animeId: string) => `qtip/${animeId}`,
};
