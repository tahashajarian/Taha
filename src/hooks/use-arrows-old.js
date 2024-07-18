import { useEffect, useState, useCallback } from "react";

export const useArrows = () => {
  const [arrows, setArrows] = useState({
    left: false,
    right: false,
    forward: false,
    backward: false,
  });

  const handleKey = useCallback(({ code, state }) => {
    setArrows((prevArrows) => {
      switch (code) {
        case "ArrowLeft":
        case "KeyA":
          return { ...prevArrows, left: state };
        case "ArrowRight":
        case "KeyD":
          return { ...prevArrows, right: state };
        case "ArrowDown":
        case "KeyS":
          return { ...prevArrows, backward: state };
        case "ArrowUp":
        case "KeyW":
          return { ...prevArrows, forward: state };
        default:
          return {...prevArrows};
      }
    });
  }, []);



  useEffect(() => {
    const keydownHandler = (event) =>
      handleKey({ code: event.code, state: true });
    const keyupHandler = (event) =>
      handleKey({ code: event.code, state: false });

    window.addEventListener("keydown", keydownHandler);
    window.addEventListener("keyup", keyupHandler);

    return () => {
      window.removeEventListener("keydown", keydownHandler);
      window.removeEventListener("keyup", keyupHandler);
    };
  }, [handleKey]);

  const handleButtonPress = useCallback(
    (direction) => {
      handleKey({ code: direction, state: true });
    },
    [handleKey]
  );

  const handleButtonRelease = useCallback(
    (direction) => {
      handleKey({ code: direction, state: false });
    },
    [handleKey]
  );

  return {
    right: arrows.right,
    left: arrows.left,
    backward: arrows.backward,
    forward: arrows.forward,
    handleButtonPress,
    handleButtonRelease,
  };
};
