// useAppStatusStore.js
import { create } from "zustand";

export const useAppStatusStore = create((set) => ({
  modalIsOpen: false,
  isApploaded: false,
  paintModalIsPoen: false,
  isMobileDevice: false,
  curtainOpen: true,
  chessPlay: false,
  chessPlayEnd: false,
  resetChess: false,

  // Accept optional value; default true -> triggers a reset
  setResetChess: (value = true) =>
    set({
      resetChess: value,
      // when triggering a reset, make sure to stop the "play" flag
      chessPlay: value ? false : undefined,
      chessPlayEnd: value ? false : undefined,
    }),

  setModalIsOpen: (value) => set({ modalIsOpen: value }),
  setIsAppLoaded: (value) => set({ isApploaded: value }),
  setPaintModalIsOpen: (value) => set({ paintModalIsPoen: value }),
  setIsMobileDevice: (value) => set({ isMobileDevice: value }),
  setCurtainOpen: (value) => set({ curtainOpen: value }),
  // when starting a play, clear resetChess
  setChessPlay: (value) => set({ chessPlay: value, resetChess: false }),
  setChessPlayEnd: (value) => set({ chessPlayEnd: value }),
}));