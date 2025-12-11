
// src/types/watch2gether.ts

export interface WatchTogetherRoom {
  id: string;
  name: string;
  animeId: string;
  animeName?: string;
  animePoster?: string;
  episodeId: string;
  episodeNumber: number;
  hostId: string;
  createdAt: any; // Could be Date or a server timestamp object
  playerState: {
    isPlaying: boolean;
    currentTime: number;
    updatedAt: any;
  };
}

export interface RoomUser {
  id: string;
  name: string;
  avatar: string;
  isHost: boolean;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  avatar: string;
  text: string;
  timestamp: any; // Could be Date or a server timestamp object
}
