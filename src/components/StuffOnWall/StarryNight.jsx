import { useLoader } from "@react-three/fiber";
import React, { useRef } from "react";
import { TextureLoader } from "three";

const StarryNight = () => {
  const ref = useRef();
  const texture = useLoader(TextureLoader, "/textures/starry_night.png");

  return (
    <mesh position={[0, 0, 0]} ref={ref}>
      <planeGeometry args={[3, 3]} />
      <meshBasicMaterial map={texture} transparent />
    </mesh>
  );
};

export default StarryNight;
