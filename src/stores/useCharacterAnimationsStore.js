import { create } from "zustand";
import { tableRotation, wallSize } from "../constances/constances";

const isSameVec3 = (a = [], b = []) =>
  a[0] === b[0] && a[1] === b[1] && a[2] === b[2];

export const useCharacterAnimationsStore = create((set) => ({
  animation: undefined,
  setAnimation: (v) => set((s) => (s.animation === v ? s : { animation: v })),

  animations: [],
  setAnimations: (arr) =>
    set((s) => (s.animations === arr ? s : { animations: arr })),

  position:[-wallSize/2 + 1.2, 0, -wallSize/2 + 3],
  setPosition: (p) => set((s) => (isSameVec3(s.position, p) ? s : { position: p })),

  rotation: tableRotation,
  setRotation: (r) => set((s) => (isSameVec3(s.rotation, r) ? s : { rotation: r })),
}));
