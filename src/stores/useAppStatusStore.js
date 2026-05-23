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
    set((s) => {
      const next = {
        resetChess: value,
        chessPlay: value ? false : s.chessPlay,
        chessPlayEnd: value ? false : s.chessPlayEnd,
      };

      if (
        s.resetChess === next.resetChess &&
        s.chessPlay === next.chessPlay &&
        s.chessPlayEnd === next.chessPlayEnd
      ) {
        return s;
      }

      return next;
    }),

  setModalIsOpen: (value) => set((s) => (s.modalIsOpen === value ? s : { modalIsOpen: value })),
  setIsAppLoaded: (value) => set((s) => (s.isApploaded === value ? s : { isApploaded: value })),
  setPaintModalIsOpen: (value) =>
    set((s) => (s.paintModalIsPoen === value ? s : { paintModalIsPoen: value })),
  setIsMobileDevice: (value) =>
    set((s) => (s.isMobileDevice === value ? s : { isMobileDevice: value })),
  setCurtainOpen: (value) => set((s) => (s.curtainOpen === value ? s : { curtainOpen: value })),
  // when starting a play, clear resetChess
  setChessPlay: (value) =>
    set((s) =>
      s.chessPlay === value && s.resetChess === false
        ? s
        : { chessPlay: value, resetChess: false },
    ),
  setChessPlayEnd: (value) => set((s) => (s.chessPlayEnd === value ? s : { chessPlayEnd: value })),
}));
