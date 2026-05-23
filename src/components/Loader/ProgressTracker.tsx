import React, { useEffect, useRef } from "react";
import { useProgress } from "@react-three/drei";

interface ProgressTrackerProps {
  onProgressUpdate: (progress: number) => void;
  onLoadComplete: () => void;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ 
  onProgressUpdate, 
  onLoadComplete 
}) => {
  const { progress, active } = useProgress();
  const lastProgress = useRef<number>(0);
  const completionTimeoutRef = useRef<number | null>(null);
  
  useEffect(() => {
    // Update progress from drei's useProgress
    if (progress > lastProgress.current) {
      lastProgress.current = progress;
      onProgressUpdate(progress);
    }
    
    if (progress === 100 && !active && completionTimeoutRef.current === null) {
      completionTimeoutRef.current = window.setTimeout(() => {
        onLoadComplete();
        completionTimeoutRef.current = null;
      }, 500);
    }
  }, [progress, active, onProgressUpdate, onLoadComplete]);

  useEffect(() => {
    return () => {
      if (completionTimeoutRef.current !== null) {
        window.clearTimeout(completionTimeoutRef.current);
      }
    };
  }, []);
  
  return null;
};

export default ProgressTracker;
