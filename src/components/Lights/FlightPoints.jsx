import React from "react";
import { wallSize } from "../../constances/constances";
import FloatingPoints from "./FloatingLight";
import { useAppStatusStore } from "../../stores/useAppStatusStore";
import { useGraphicsSettings } from "../../stores/useGraphicsSettings";

const points = [
  { color: "red", position: [-wallSize / 2 + 0.5, 1, 1], amplitude: 0.5, frequency: 0.5 },
  { color: "green", position: [-wallSize / 2 + 0.5, 1, -3], amplitude: 0.5, frequency: 0.75 },
  { color: "blue", position: [-wallSize / 2 + 0.5, 2, 3], amplitude: 0.5, frequency: 0.4 },
  { color: "yellow", position: [-wallSize / 2 + 0.5, 2, -1], amplitude: 0.5, frequency: 0.7 },
  { color: "red", position: [wallSize / 2 - 0.5, 1, -4], amplitude: 0.5, frequency: 0.5 },
  { color: "green", position: [wallSize / 2 - 0.5, 1, -3], amplitude: 0.5, frequency: 0.75 },
  { color: "blue", position: [wallSize / 2 - 0.5, 2, 0], amplitude: 0.5, frequency: 0.4 },
  { color: "yellow", position: [wallSize / 2 - 0.5, 2, -1], amplitude: 0.5, frequency: 0.7 },
];

const FlightPoints = () => {
  const isMobileDevice = useAppStatusStore((s) => s.isMobileDevice);
  const quality = useGraphicsSettings((s) => s.quality);

  const isLowQuality = quality === "low" || quality === "ultra-low";

  return (
    <>
      {!isMobileDevice && !isLowQuality && (
        <>
          <FloatingPoints points={points} />
        </>
      )}
    </>
  );
};

export default FlightPoints;
