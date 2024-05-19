import { useEffect, useState } from "react";

export const useArrows = () => {
  const [arrows, setArrows] = useState({
    left: false,
    right: false,
    forward: false,
    backward: false,
  });

  useEffect(() => {
    const handleKey = ({ code, state }: { code: string; state: boolean }) => {
      switch (code) {
        case "ArrowLeft":
        // case "KeyA":
          arrows.left = state;
          break;
        case "ArrowRight":
        // case "KeyD":
          arrows.right = state;
          break;
        case "ArrowDown":
        // case "KeyS":
          arrows.backward = state;
          break;
        case "ArrowUp":
        // case "KeyW":
          arrows.forward = state;
          break;
        default:
          break;
      }
      setArrows({ ...arrows });
    };
    window.addEventListener("keydown", ({ code }) =>
      handleKey({ code, state: true })
    );
    window.addEventListener("keyup", ({ code }) =>
      handleKey({ code, state: false })
    );
    return () => {
      window.removeEventListener("keyup", ({ code }) =>
        handleKey({ code, state: true })
      );
      window.removeEventListener("keyup", ({ code }) =>
        handleKey({ code, state: false })
      );
    };
  }, []);
  return arrows;
};
