import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { BackSide } from "three";

const JSIcon = (props) => {
  const { nodes, materials } = useGLTF("/models/jsIcon.glb", "/draco/");
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Curve001.geometry}
        material={materials.JS}
        position={[0.1, 0.0, 0.2]}
        scale={100}
      />
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial
          color="#ffd600"
          opacity={0.5}
          side={BackSide}
        />
      </mesh>
    </group>
  );
};

useGLTF.preload("/models/jsIcon.glb", "/draco/");

export default JSIcon;
