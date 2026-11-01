import { create } from "zustand";

let saveTimer;
let lastLocalEditAt = 0;

const savePainting = async (image) => {
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
};

export const usePaintingStore = create((set, get) => ({
  paintingImage: "",
  // True once the server answered with a valid painting (or a valid "none yet").
  // The paint canvas stays locked until then so a stroke on an empty canvas
  // can never overwrite the real painting.
  paintingLoaded: false,
  loading: true, // CHANGE: Start with loading=true to avoid flash
  brushType: "spray",
  brushColor: "#ffffff",
  brushSize: 5,
  canvasRef: { current: null },

  setPaintingImage: (image) => {
    if (image === get().paintingImage) return;
    set({ paintingImage: image });
    if (!image) return;
    lastLocalEditAt = Date.now();
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => savePainting(image), 700);
  },

  // Resolves to false when the server didn't return a usable answer.
  fetchPainting: async ({ background = false } = {}) => {
    if (get().loading && get().paintingImage !== "") return true; // Don't refetch if already loading with data
    // A background refresh must not replace a local edit that may not be saved yet.
    if (background && Date.now() - lastLocalEditAt < 10_000) return true;
    if (!background) set({ loading: true });
    const startedAt = Date.now();
    try {
      const res = await fetch(
        "https://taha-shajarian.ir/server/load_painting.php"
      );
      const data = await res.text();
      // Anything other than an image (an error page, a DB error message) must
      // never replace the painting: it would show up as an empty board.
      if (!res.ok || (data && !data.startsWith("data:image/"))) {
        console.warn("Ignoring invalid painting response", res.status);
        return false;
      }
      if (background && lastLocalEditAt >= startedAt) return true; // user painted meanwhile
      if (data && data !== get().paintingImage) {
        set({ paintingImage: data });
      }
      if (!get().paintingLoaded) set({ paintingLoaded: true });
      return true;
    } catch (err) {
      console.error("Error fetching painting:", err);
      return false;
    } finally {
      if (!background) set({ loading: false });
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
