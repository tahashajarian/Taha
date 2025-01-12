import React from "react";
import Lamp from "./Lamp";
import Luster from "./Luster";
import { wallHeight } from "../../constances/constances";

const Lights = () => {
  return (
    <>
      <ambientLight intensity={1} />

      <directionalLight
        position={[-5, wallHeight, 2]}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        intensity={3}
        castShadow
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
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
      {/* <group position={[5.5, 0, 5.5]}>
        <Lamp />
      </group> */}
    </>
  );
};

export default Lights;
