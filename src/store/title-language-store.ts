
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type TitleLanguage = 'english' | 'romaji';

interface TitleLanguageState {
  language: TitleLanguage;
  toggleLanguage: () => void;
  setLanguage: (language: TitleLanguage) => void;
}

export const useTitleLanguageStore = create<TitleLanguageState>()(
  persist(
    (set) => ({
      language: 'english',
      toggleLanguage: () => set((state) => ({ language: state.language === 'english' ? 'romaji' : 'english' })),
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'projectx-title-language-settings',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
