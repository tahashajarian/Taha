import { create } from "zustand";
import { tableRotation } from "../constances/constances";

export const useCharacterAnimationsStore = create((set) => ({
  animation: undefined,
  setAnimation: (v) => set({ animation: v }),

  animations: [],
  setAnimations: (arr) => set({ animations: arr }),

  position: [0, 0, 0],
  setPosition: (p) => set({ position: p }),

  rotation: tableRotation,
  setRotation: (r) => set({ rotation: r }),
}));
