import { useEffect, useCallback } from "react";
import { useArrowsStore } from "../stores/useArrowStore";
import { useTourStore } from "../stores/useTourStore";

export const useArrowControls = () => {
  const setArrow = useArrowsStore((s) => s.setArrow);
  const tourActive = useTourStore((s) => s.active);

  const handleKey = useCallback(
    (code, state) => {
      if (tourActive) return;
      switch (code) {
        case "ArrowLeft":
        case "KeyA":
          setArrow("left", state);
          break;
        case "ArrowRight":
        case "KeyD":
          setArrow("right", state);
          break;
        case "ArrowDown":
        case "KeyS":
          setArrow("backward", state);
          break;
        case "ArrowUp":
        case "KeyW":
          setArrow("forward", state);
          break;
      }
    },
    [setArrow, tourActive]
  );

  useEffect(() => {
    const keydown = (e) => handleKey(e.code, true);
    const keyup = (e) => handleKey(e.code, false);

    window.addEventListener("keydown", keydown);
    window.addEventListener("keyup", keyup);

    return () => {
      window.removeEventListener("keydown", keydown);
      window.removeEventListener("keyup", keyup);
    };
  }, [handleKey]);
};
