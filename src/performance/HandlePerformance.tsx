import React from "react";
import { PerformanceMonitor } from "@react-three/drei";
import WebGLPerformanceManager from "./WebGLPerformanceManager";
import { useRecalculateDPR } from "../hooks/useRecalculateDPR";
import { useGraphicsSettings } from "../stores/useGraphicsSettings";

const HandlePerformance: React.FC = () => {
  useRecalculateDPR();
  const [lockedLowMode, setLockedLowMode] = React.useState(false);
  const lockedLowModeRef = React.useRef(false);

  React.useEffect(() => {
    lockedLowModeRef.current = lockedLowMode;
  }, [lockedLowMode]);

  return (
    <>
      <PerformanceMonitor
        ms={250}
        threshold={0.75}
        onDecline={({ fps }) => {
          const { quality, setQuality } = useGraphicsSettings.getState();

          if (fps < 20 && quality !== "ultra-low") {
            setQuality("ultra-low");
            setLockedLowMode(true);
          } else if (fps < 30 && quality === "medium") {
            setQuality("low");
            setLockedLowMode(true);
          } else if (fps < 45 && quality === "high") {
            setQuality("medium");
          }
        }}
        onIncline={({ fps }) => {
          const { quality, setQuality, beginHighQualityTransition } =
            useGraphicsSettings.getState();

          if (lockedLowModeRef.current) {
            // Only allow upgrade one step, never back to high
            if (fps >= 35 && quality === "ultra-low") setQuality("low");
            return;
          }

          if (fps >= 45 && quality === "medium") beginHighQualityTransition();
          else if (fps >= 30 && quality === "low") setQuality("medium");
        }}
      />

      <WebGLPerformanceManager />
    </>
  );
};

export default HandlePerformance;
