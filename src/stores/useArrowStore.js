import { create } from "zustand";

export const useArrowsStore = create((set) => ({
  left: false,
  right: false,
  forward: false,
  backward: false,

  setArrow: (direction, state) => set((s) => ({ ...s, [direction]: state })),

  resetArrows: () =>
    set({
      left: false,
      right: false,
      forward: false,
      backward: false,
    }),
}));
