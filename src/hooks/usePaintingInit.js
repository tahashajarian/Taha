import { useEffect } from "react";
import { usePaintingStore } from "../stores/usePaintingStore";
import { useAppStatusStore } from "../stores/useAppStatusStore";

const REFRESH_INTERVAL = 60_000;

export const usePaintingInit = () => {
  const fetchPainting = usePaintingStore((s) => s.fetchPainting);

  useEffect(() => {
    let cancelled = false;
    let retryTimer;
    // Shared hosting occasionally drops a request; retry the first load
    // quickly instead of leaving the board empty until the next refresh.
    const loadInitial = async (attempt = 0) => {
      const ok = await fetchPainting();
      if (!ok && !cancelled && attempt < 4) {
        retryTimer = setTimeout(() => loadInitial(attempt + 1), 2000 * (attempt + 1));
      }
    };
    loadInitial();

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
      cancelled = true;
      clearTimeout(retryTimer);
      clearInterval(interval);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [fetchPainting]);
};
