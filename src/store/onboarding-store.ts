
import { create } from 'zustand';

interface OnboardingState {
  isOpen: boolean;
  step: number;
  open: () => void;
  close: () => void;
  nextStep: () => void;
  setStep: (step: number) => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  isOpen: false,
  step: 1,
  open: () => set({ isOpen: true, step: 1 }),
  close: () => set({ isOpen: false }),
  nextStep: () => set((state) => ({ step: state.step + 1 })),
  setStep: (step) => set({ step }),
}));
