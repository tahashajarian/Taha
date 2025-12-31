import { create } from "zustand";

export const useAppStatusStore = create((set) => ({
  modalIsOpen: false,
  isApploaded: false,
  paintModalIsPoen: false,
  isMobileDevice: false,
  curtainOpen: true,

  setModalIsOpen: (value) => set({ modalIsOpen: value }),
  setIsAppLoaded: (value) => set({ isApploaded: value }),
  setPaintModalIsOpen: (value) => set({ paintModalIsPoen: value }),
  setIsMobileDevice: (value) => set({ isMobileDevice: value }),
  setCurtainOpen: (value) => set({ curtainOpen: value }),
}));
