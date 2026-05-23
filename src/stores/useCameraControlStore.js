import { create } from "zustand";

const isSameCameraLookAt = (a, b) => {
  if (a === b) return true;
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};

export const useCameraControlStore = create((set) => ({
  cameraLookAt: undefined,
  setCameraLookAt: (v) =>
    set((s) => (isSameCameraLookAt(s.cameraLookAt, v) ? s : { cameraLookAt: v })),
  chessMode: false,
  setChessMode: (v) => set((s) => (s.chessMode === v ? s : { chessMode: v })),
}));
