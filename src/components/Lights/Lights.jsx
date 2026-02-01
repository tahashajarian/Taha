import React, { useRef } from "react";
import Lamp from "./Lamp";
import Luster from "./Luster";
import { wallHeight } from "../../constances/constances";
import { useAppStatusStore } from "../../stores/useAppStatusStore";
import { useGraphicsSettings } from "../../stores/useGraphicsSettings";
import FlightPoints from "./FlightPoints";

const Lights = () => {
  const dirLightRef = useRef(null);
  const { curtainOpen } = useAppStatusStore();
  const { quality } = useGraphicsSettings();

  const isLowQuality = quality === "low" || quality === "ultra-low";

  return (
    <>
      <group position={[0, wallHeight, 0]} scale={[0.4, 1, 0.4]}>
        <Luster />
      </group>

      <ambientLight intensity={0.2} />

      <directionalLight
        ref={dirLightRef}
        position={[0, 3, 8]}
        intensity={!curtainOpen ? 5 : 1}
        castShadow={!isLowQuality}
        shadow-mapSize-width={!isLowQuality ? 1024 : 0}
        shadow-mapSize-height={!isLowQuality ? 1024 : 0}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      <group position={[-5.5, 0, -5.5]}>
        <Lamp />
      </group>
      {!isLowQuality && (
        <group position={[5.5, 0, 5.5]}>
          <Lamp />
        </group>
      )}

      {!isLowQuality && <FlightPoints />}
    </>
  );
};

export default Lights;
