import { create } from "zustand";
import { tableRotation, wallSize } from "../constances/constances";

export const useCharacterAnimationsStore = create((set) => ({
  animation: undefined,
  setAnimation: (v) => set({ animation: v }),

  animations: [],
  setAnimations: (arr) => set({ animations: arr }),

  position:[-wallSize/2 + 1.2, 0, -wallSize/2 + 3],
  setPosition: (p) => set({ position: p }),

  rotation: tableRotation,
  setRotation: (r) => set({ rotation: r }),
}));
