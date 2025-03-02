import React, { useRef } from "react";
import { wallHeight, wallSize } from "../../constances/constances";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import Bird from "../Stuff/Bird";
import Birds from "../Stuff/Birds";

const Outside = () => {
  const ref = useRef();
  const texture = useLoader(TextureLoader, "/textures/city2.jpg");

  return (
    <group>
      <mesh
        ref={ref}
        rotation={[0, Math.PI, 0]}
        position={[0, wallHeight / 2 - 0.5, wallSize / 2 + 8]}
      >
        <planeGeometry args={[25, 12]} />
        <meshStandardMaterial map={texture} />
      </mesh>
      <Birds/>
    </group>
  );
};

export default Outside;
