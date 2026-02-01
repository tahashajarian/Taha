import React from "react";
import { PerformanceMonitor } from "@react-three/drei";
import WebGLPerformanceManager from "./WebGLPerformanceManager";
import { useRecalculateDPR } from "../hooks/useRecalculateDPR";
import { useGraphicsSettings } from "../stores/useGraphicsSettings";


const HandlePerformance: React.FC = () => {
  useRecalculateDPR();

  return (
    <>
      <PerformanceMonitor
        ms={250}
        threshold={0.75}
        onDecline={({ fps }) => {
          const { quality, setQuality } = useGraphicsSettings.getState();

          // DOWNGRADE (one step)
          if (fps < 20 && quality !== "ultra-low") {
            setQuality("ultra-low");
          } else if (fps < 30 && quality === "medium") {
            setQuality("low");
          } else if (fps < 45 && quality === "high") {
            setQuality("medium");
          }
        }}
        onIncline={({ fps }) => {
          const { quality, setQuality } = useGraphicsSettings.getState();

          // UPGRADE (one step)
          if (fps >= 45 && quality !== "high") {
            setQuality("high");
          } else if (fps >= 30 && quality === "ultra-low") {
            setQuality("low");
          } else if (fps >= 45 && quality === "low") {
            setQuality("medium");
          }
        }}
      />

      <WebGLPerformanceManager />
      {/* <Stats className="z-999" /> */}
    </>
  );
};

export default HandlePerformance;
