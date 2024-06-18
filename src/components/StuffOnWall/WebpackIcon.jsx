import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const WebpackIcon3D = () => {
  const groupRef = useRef();



  return (
    <group ref={groupRef}>
      {/* Outer Cube (Transparent) */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#8fd6fb" opacity={0.5} side={THREE.BackSide} />
      </mesh>

      {/* Inner Cube */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.6, 0.6, 0.6]} />
        <meshBasicMaterial color="#1c79c2" />
      </mesh>
    </group>
  );
};

export default WebpackIcon3D;
