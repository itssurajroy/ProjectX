// src/types/watch2gether.ts

import { FieldValue } from 'firebase/firestore';

export interface WatchTogetherRoom {
  id: string;
  name: string;
  animeId: string;
  animeName?: string;
  animePoster?: string;
  episodeId: string;
  episodeNumber: number;
  hostId: string;
  createdAt: FieldValue;
  playerState: {
    isPlaying: boolean;
    currentTime: number;
    updatedAt: FieldValue;
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
  timestamp: FieldValue;
}
