import { useLoader } from "@react-three/fiber";
import React, { useRef } from "react";
import { TextureLoader } from "three";
import { wallHeight, wallSize } from "../../constances/constances";

const TheWallWallPaper = () => {
  const ref = useRef();
  const texture = useLoader(TextureLoader, "/textures/pink.png");

  return (
    <mesh position={[0, 0, 0]} ref={ref}>
      <planeGeometry args={[wallSize, wallHeight ]} />
      <meshBasicMaterial map={texture} transparent />
    </mesh>
  );
};

export default TheWallWallPaper;
