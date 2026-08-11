import { create } from "zustand";

export const useTourStore = create((set) => ({
  active: false,
  step: 0,
  startTour: () => set({ active: true, step: 0 }),
  setStep: (step) => set((state) => (state.step === step ? state : { step })),
  stopTour: () => set({ active: false, step: 0 }),
}));
