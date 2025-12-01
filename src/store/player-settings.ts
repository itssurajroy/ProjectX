
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface PlayerSettingsState {
  isFocusMode: boolean;
  autoNext: boolean;
  autoPlay: boolean;
  autoSkip: boolean;
  toggleFocusMode: () => void;
  toggleAutoNext: () => void;
  toggleAutoPlay: () => void;
  toggleAutoSkip: () => void;
}

export const usePlayerSettings = create<PlayerSettingsState>()(
  persist(
    (set) => ({
      isFocusMode: false,
      autoNext: true,
      autoPlay: true,
      autoSkip: true,
      toggleFocusMode: () => set((state) => ({ isFocusMode: !state.isFocusMode })),
      toggleAutoNext: () => set((state) => ({ autoNext: !state.autoNext })),
      toggleAutoPlay: () => set((state) => ({ autoPlay: !state.autoPlay })),
      toggleAutoSkip: () => set((state) => ({ autoSkip: !state.autoSkip })),
    }),
    {
      name: 'projectx-player-settings', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
