import { create } from "zustand";

export const usePaintingStore = create((set, get) => ({
  paintingImage: "",
  loading: false,
  canvasRef: { current: null },

  setPaintingImage: async (image) => {
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
    set({ loading: true });
    try {
      const res = await fetch(
        "https://taha-shajarian.ir/server/load_painting.php"
      );
      const data = await res.text();
      if (data && data !== get().paintingImage) set({ paintingImage: data });
    } catch (err) {
      console.error("Error fetching painting:", err);
    } finally {
      set({ loading: false });
    }
  },
}));
