import { createContext, useContext, useRef, useState } from "react";

const PaintingContext = createContext({});

export const PaintingContextProvider = (props) => {
  const [paintingImage, setPaintingImage] = useState("");
  //   const [canvasRef, setCanvasRef] = useState(null);

  const canvasRef = useRef(null);
  return (
    <PaintingContext.Provider
      value={{
        paintingImage,
        setPaintingImage,
        canvasRef,
      }}
    >
      {props.children}
    </PaintingContext.Provider>
  );
};

export const usePaintingContext = () => {
  return useContext(PaintingContext);
};
