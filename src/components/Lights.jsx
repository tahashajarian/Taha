import React from "react";
import Lamp from "./Lamp";

const Lights = () => {
  return (
    <>
      <ambientLight intensity={0.2} />
      
      <directionalLight
        position={[-5, 5, 5]}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        intensity={0.7}
      />
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
