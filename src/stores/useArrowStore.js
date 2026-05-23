import { create } from "zustand";

export const useArrowsStore = create((set) => ({
  left: false,
  right: false,
  forward: false,
  backward: false,

  setArrow: (direction, state) =>
    set((s) => (s[direction] === state ? s : { [direction]: state })),

  resetArrows: () =>
    set((s) =>
      s.left || s.right || s.forward || s.backward
        ? {
            left: false,
            right: false,
            forward: false,
            backward: false,
          }
        : s,
    ),
}));
