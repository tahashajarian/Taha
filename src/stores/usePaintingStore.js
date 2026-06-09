import { create } from "zustand";

export const usePaintingStore = create((set, get) => ({
  paintingImage: "",
  loading: false,
  brushType: "spray",
  brushColor: "#ffffff",
  brushSize: 5,
  canvasRef: { current: null },
  preloadedImage: null, // OPTIMIZATION: Store decoded image element

  setPaintingImage: async (image) => {
    if (image === get().paintingImage) return;
    set({ paintingImage: image });
    if (!image) return;
    try {
      const res = await fetch(
        "https://taha-shajarian.ir/server/save_painting.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ image_data: image }),
        }
      );
      const text = await res.text();
      console.log("Saved painting:", text);
    } catch (err) {
      console.error("Error saving painting:", err);
    }
  },

  fetchPainting: async () => {
    if (get().loading) return;
    set({ loading: true });
    try {
      const res = await fetch(
        "https://taha-shajarian.ir/server/load_painting.php"
      );
      const data = await res.text();
      if (data && data !== get().paintingImage) {
        set({ paintingImage: data });
        
        // OPTIMIZATION: Immediately decode image in background
        if (data) {
          const img = new Image();
          img.src = data;
          
          // Use decode() API for async non-blocking decode
          if (img.decode) {
            img.decode()
              .then(() => {
                set({ preloadedImage: img });
              })
              .catch(err => console.warn("Image decode failed:", err));
          } else {
            // Fallback for older browsers
            img.onload = () => set({ preloadedImage: img });
          }
        }
      }
    } catch (err) {
      console.error("Error fetching painting:", err);
    } finally {
      set({ loading: false });
    }
  },

  setBrushType: (type) => {
    if (type === get().brushType) return;
    set({ brushType: type });
  },

  setBrushColor: (color) => {
    if (color === get().brushColor) return;
    set({ brushColor: color });
  },

  setBrushSize: (size) => {
    if (size === get().brushSize) return;
    set({ brushSize: size });
  },
}));
