import { useCallback, useEffect, useRef, useState } from "react";

interface UseLoadingManagerReturn {
  loaded: boolean;
  percent: number;
  showLoader: boolean;
  showContent: boolean;
  loadIssue: string | null;
  handleProgressUpdate: (progress: number) => void;
  handleLoadComplete: () => void;
  handleLoadError: () => void;
  continueLoading: () => void;
}

export const useLoadingManager = (): UseLoadingManagerReturn => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [percent, setPercent] = useState<number>(0);
  const [showLoader, setShowLoader] = useState<boolean>(true);
  const [showContent, setShowContent] = useState<boolean>(false);
  const [loadIssue, setLoadIssue] = useState<string | null>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const hideLoaderTimeout = useRef<NodeJS.Timeout | null>(null);
  const showContentTimeout = useRef<NodeJS.Timeout | null>(null);
  const loadTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Fallback progress indicator for cases where loading manager doesn't report
    if (percent < 10) {
      progressInterval.current = setInterval(() => {
        setPercent(prev => Math.min(95, prev + 1));
      }, 300);
    }

    loadTimeout.current = setTimeout(() => {
      setLoadIssue("Loading is taking longer than expected.");
    }, 25_000);

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
      setLoadIssue(null);
      if (loadTimeout.current) clearTimeout(loadTimeout.current);
      
      // Hide loader after a short delay to allow smooth transition
      hideLoaderTimeout.current = setTimeout(() => {
        setShowLoader(false);
        // Show content after loader is hidden
        showContentTimeout.current = setTimeout(() => {
          setShowContent(true);
        }, 100);
      }, 800);
    }
  }, [percent, loaded]);

  useEffect(() => {
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
      if (hideLoaderTimeout.current) {
        clearTimeout(hideLoaderTimeout.current);
      }
      if (showContentTimeout.current) {
        clearTimeout(showContentTimeout.current);
      }
      if (loadTimeout.current) clearTimeout(loadTimeout.current);
    };
  }, []);

  const handleProgressUpdate = useCallback((progress: number): void => {
    // Clear the fallback interval if we're getting real progress updates
    if (progress > 10 && progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
    
    // Ensure we don't go backwards in progress
    setPercent(prev => Math.max(prev, Math.round(progress)));
  }, []);

  const handleLoadComplete = useCallback((): void => {
    // Set to 100% when loading is complete
    setPercent(100);
  }, []);

  const handleLoadError = useCallback((): void => {
    setLoadIssue("Some scene files could not be loaded.");
  }, []);

  const continueLoading = useCallback((): void => {
    if (progressInterval.current) clearInterval(progressInterval.current);
    if (loadTimeout.current) clearTimeout(loadTimeout.current);
    setLoaded(true);
    setPercent(100);
    setShowLoader(false);
    setShowContent(true);
  }, []);

  return {
    loaded,
    percent,
    showLoader,
    showContent,
    loadIssue,
    handleProgressUpdate,
    handleLoadComplete,
    handleLoadError,
    continueLoading
  };
};
