import { createContext, useContext, useEffect, useRef, useState } from "react";

const PaintingContext = createContext({});

export const PaintingContextProvider = (props) => {
  const [paintingImage, setPaintingImage] = useState("");
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(false)

  const fetchPainting = () => {
    setLoading(true)
    fetch("https://taha-shajarian.ir/server/load_painting.php")
      .then((response) => response.text())
      .then((data) => {
        setLoading(false)
        if (data && data !== paintingImage) {
          setPaintingImage(data);
        }
      })
      .catch((error) => {
        setLoading(false)
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    // Load the image from the server when the component mounts
    fetchPainting();

    
  }, []);

  // Save the image to the server whenever it changes
  useEffect(() => {
    if (paintingImage) {
      fetch("https://taha-shajarian.ir/server/save_painting.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ image_data: paintingImage }),
      })
        .then((response) => response.text())
        .then((data) => {
          console.log("Saved painting:", data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }, [paintingImage]);

  return (
    <PaintingContext.Provider
      value={{
        paintingImage,
        setPaintingImage,
        canvasRef,
        fetchPainting, 
        loading
      }}
    >
      {props.children}
    </PaintingContext.Provider>
  );
};

export const usePaintingContext = () => {
  return useContext(PaintingContext);
};
