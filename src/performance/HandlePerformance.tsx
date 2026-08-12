import React from "react";
import { PerformanceMonitor } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import WebGLPerformanceManager from "./WebGLPerformanceManager";
import { useRecalculateDPR } from "../hooks/useRecalculateDPR";
import { useGraphicsSettings } from "../stores/useGraphicsSettings";

const SustainedHighQuality: React.FC<{
  lockedLowModeRef: React.MutableRefObject<boolean>;
  cooldownUntilRef: React.MutableRefObject<number>;
}> = ({ lockedLowModeRef, cooldownUntilRef }) => {
  const sampleRef = React.useRef({ elapsed: 0, frames: 0, stableSeconds: 0 });

  useFrame((_, delta) => {
    const sample = sampleRef.current;
    sample.elapsed += delta;
    sample.frames += 1;

    if (sample.elapsed < 1) return;

    const fps = sample.frames / sample.elapsed;
    const { quality, beginHighQualityTransition } =
      useGraphicsSettings.getState();

    if (
      quality !== "medium" ||
      lockedLowModeRef.current ||
      document.visibilityState !== "visible" ||
      Date.now() < cooldownUntilRef.current
    ) {
      sample.stableSeconds = 0;
    } else if (fps >= 55) {
      sample.stableSeconds += sample.elapsed;
      if (sample.stableSeconds >= 12) {
        sample.stableSeconds = 0;
        beginHighQualityTransition();
      }
    } else if (fps < 52) {
      sample.stableSeconds = 0;
    }

    sample.elapsed = 0;
    sample.frames = 0;
  });

  return null;
};

const HandlePerformance: React.FC = () => {
  useRecalculateDPR();
  const [lockedLowMode, setLockedLowMode] = React.useState(false);
  const lockedLowModeRef = React.useRef(false);
  const cooldownUntilRef = React.useRef(0);

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
            cooldownUntilRef.current = Date.now() + 30_000;
          }
        }}
        onIncline={({ fps }) => {
          const { quality, setQuality } = useGraphicsSettings.getState();

          if (lockedLowModeRef.current) {
            // Only allow upgrade one step, never back to high
            if (fps >= 35 && quality === "ultra-low") setQuality("low");
            return;
          }

          // Devices that start or fall back to low stay there. This prevents
          // decorative assets and effects from being added again mid-session.
        }}
      />

      <SustainedHighQuality
        lockedLowModeRef={lockedLowModeRef}
        cooldownUntilRef={cooldownUntilRef}
      />

      <WebGLPerformanceManager />
    </>
  );
};

export default HandlePerformance;
