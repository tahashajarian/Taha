import React from "react";
import Lamp from "./Lamp";
import Luster from "./Luster";
import { wallHeight } from "./Walls";

const Lights = () => {
  return (
    <>
      <ambientLight intensity={2} />

      <directionalLight
        position={[-5, wallHeight, -5]}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        intensity={1}
      />
      <group position={[0, wallHeight, 0]} scale={[0.4, 1, 0.4]}>
        <Luster />
      </group>
      {/* <group position={[5.5, 0, -5.5]}>
        <Lamp />
      </group> */}
      <group position={[-5.5, 0, -5.5]}>
        <Lamp />
      </group>
      {/* <group position={[-5.5, 0, 5.5]}>
        <Lamp />
      </group> */}
      <group position={[5.5, 0, 5.5]}>
        <Lamp />
      </group>
    </>
  );
};

export default Lights;
