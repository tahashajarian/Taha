import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

const ArrowsContext = createContext();

export const ArrowsProvider = ({ children }) => {
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
          return { ...prevArrows };
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

  return (
    <ArrowsContext.Provider
      value={{ ...arrows, handleButtonPress, handleButtonRelease }}
    >
      {children}
    </ArrowsContext.Provider>
  );
};

export const useArrows = () => useContext(ArrowsContext);
