import { create } from "zustand";

export const useCameraControlStore = create((set) => ({
  cameraLookAt: undefined,
  setCameraLookAt: (v) => set({ cameraLookAt: v }),
}));
