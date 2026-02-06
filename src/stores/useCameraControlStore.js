import { create } from "zustand";

export const useCameraControlStore = create((set) => ({
  cameraLookAt: undefined,
  setCameraLookAt: (v) => set({ cameraLookAt: v }),
  chessMode: false,
  setChessMode: (v) => set({ chessMode: v }),
}));
