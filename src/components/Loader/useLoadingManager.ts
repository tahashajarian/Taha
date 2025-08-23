import { useEffect, useRef, useState } from "react";

interface UseLoadingManagerReturn {
  loaded: boolean;
  percent: number;
  showLoader: boolean;
  showContent: boolean;
  handleProgressUpdate: (progress: number) => void;
  handleLoadComplete: () => void;
}

export const useLoadingManager = (): UseLoadingManagerReturn => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [percent, setPercent] = useState<number>(0);
  const [showLoader, setShowLoader] = useState<boolean>(true);
  const [showContent, setShowContent] = useState<boolean>(false);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Fallback progress indicator for cases where loading manager doesn't report
    if (percent < 10) {
      progressInterval.current = setInterval(() => {
        setPercent(prev => Math.min(95, prev + 1));
      }, 300);
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, []);

  useEffect(() => {
    if (percent === 100 && !loaded) {
      // Clear the fallback interval
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
      
      setLoaded(true);
      
      // Hide loader after a short delay to allow smooth transition
      setTimeout(() => {
        setShowLoader(false);
        // Show content after loader is hidden
        setTimeout(() => {
          setShowContent(true);
        }, 100);
      }, 800);
    }
  }, [percent, loaded]);

  const handleProgressUpdate = (progress: number): void => {
    // Clear the fallback interval if we're getting real progress updates
    if (progress > 10 && progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
    
    // Ensure we don't go backwards in progress
    setPercent(prev => Math.max(prev, Math.round(progress)));
  };

  const handleLoadComplete = (): void => {
    // Set to 100% when loading is complete
    setPercent(100);
  };

  return {
    loaded,
    percent,
    showLoader,
    showContent,
    handleProgressUpdate,
    handleLoadComplete
  };
};