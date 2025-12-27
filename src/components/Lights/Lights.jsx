import React, { useRef } from "react";
import Lamp from "./Lamp";
import Luster from "./Luster";
import { wallHeight } from "../../constances/constances";
import { useAppStatusContext } from "../../contexts/AppStatusContext";

const Lights = () => {
  const dirLightRef = useRef(null);
  const { curtainOpen } = useAppStatusContext();

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
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      <group position={[-5.5, 0, -5.5]}>
        <Lamp />
      </group>
      <group position={[5.5, 0, 5.5]}>
        <Lamp />
      </group>
    </>
  );
};

export default Lights;
