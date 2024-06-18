import React from "react";
import Lamp from "./Lamp";
import Luster from "./Luster";
import { wallHeight } from "./Walls";

const Lights = () => {
  return (
    <>
      <ambientLight intensity={0.5} />

      <directionalLight
        position={[0, wallHeight, 0]}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        intensity={0.75}
      />
      <group position={[0, wallHeight, 0]} scale={0.6}>
        <Luster />
      </group>
      <group position={[5.5, 0, -5.5]}>
        <Lamp />
      </group>
      <group position={[-5.5, 0, -5.5]}>
        <Lamp />
      </group>
      <group position={[-5.5, 0, 5.5]}>
        <Lamp />
      </group>
      <group position={[5.5, 0, 5.5]}>
        <Lamp />
      </group>
    </>
  );
};

export default Lights;
