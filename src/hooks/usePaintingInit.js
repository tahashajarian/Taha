import { useEffect } from "react";
import { usePaintingStore } from "../stores/usePaintingStore";

export const usePaintingInit = () => {
  const fetchPainting = usePaintingStore((s) => s.fetchPainting);
  useEffect(() => {
    fetchPainting();
  }, [fetchPainting]);
};
