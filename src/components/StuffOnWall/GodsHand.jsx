import { useLoader } from "@react-three/fiber";
import React, { useRef } from "react";
import { TextureLoader } from "three";

const GodsHand = () => {
  const ref = useRef();
  const texture = useLoader(TextureLoader, "/textures/gods-hand.png");

  return (
    <mesh position={[0, 0, 0]} ref={ref}>
      <planeGeometry args={[4, 3]} />
      <meshBasicMaterial map={texture} transparent />
    </mesh>
  );
};

export default GodsHand;
