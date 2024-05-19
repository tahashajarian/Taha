import React from "react";
import Lamp from "./Lamp";

const Lights = () => {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[-5, 5, 5]}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        intensity={0.5}
      />
      <group position={[5.7, 0, -5]}>
        <Lamp />
      </group>
      <pointLight
        distance={4}
        decay={2}
        power={10}
        position={[5.7, 0.9, -5]}
        color={"red"}
        intensity={0.6}
      />
    </>
  );
};

export default Lights;
