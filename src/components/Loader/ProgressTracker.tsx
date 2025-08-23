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
  
  useEffect(() => {
    // Update progress from drei's useProgress
    if (progress > lastProgress.current) {
      lastProgress.current = progress;
      onProgressUpdate(progress);
    }
    
    if (progress === 100 && !active) {
      // Ensure we're really at 100%
      setTimeout(() => {
        onLoadComplete();
      }, 500);
    }
  }, [progress, active, onProgressUpdate, onLoadComplete]);
  
  return null;
};

export default ProgressTracker;