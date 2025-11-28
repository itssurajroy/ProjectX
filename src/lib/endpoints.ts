

const API_BASE_PATH = 'api/v2/hianime';

export const Endpoints = {
    home: `${API_BASE_PATH}/home`,
    azList: (sortOption: string) => `${API_BASE_PATH}/azlist/${sortOption}`,
    qtip: (animeId: string) => `${API_BASE_PATH}/qtip/${animeId}`,
    anime: (animeId: string) => `${API_BASE_PATH}/anime/${animeId}`,
    search: `${API_BASE_PATH}/search`,
    searchSuggestion: `${API_BASE_PATH}/search/suggestion`,
    genre: (genre: string) => `${API_BASE_PATH}/genre/${genre}`,
    schedule: `${API_BASE_PATH}/schedule`,
    episodes: (animeId: string) => `${API_BASE_PATH}/anime/${animeId}/episodes`,
    episodeServers: `${API_BASE_PATH}/episode/servers`,
    episodeSources: `${API_BASE_PATH}/episode/sources`,
};
