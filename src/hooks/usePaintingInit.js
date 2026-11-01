import { useEffect } from "react";
import { usePaintingStore } from "../stores/usePaintingStore";
import { useAppStatusStore } from "../stores/useAppStatusStore";

const REFRESH_INTERVAL = 60_000;

export const usePaintingInit = () => {
  const fetchPainting = usePaintingStore((s) => s.fetchPainting);

  useEffect(() => {
    fetchPainting();

    // Pick up other visitors' edits. Skipped while painting so an incoming
    // image never replaces strokes in progress.
    const refresh = () => {
      if (document.visibilityState !== "visible") return;
      if (useAppStatusStore.getState().paintModalIsPoen) return;
      fetchPainting({ background: true });
    };

    const interval = setInterval(refresh, REFRESH_INTERVAL);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [fetchPainting]);
};
