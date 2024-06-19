import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

const JSIcon = (props) => {
  const { nodes, materials } = useGLTF("/models/jsIcon.glb");
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane.geometry}
        material={materials["SVGMat.001"]}
        position={[-0.281, 0.005, -0.352]}
        scale={0.677}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Curve001.geometry}
        material={materials.JS}
        position={[0, 0.039, 0]}
        scale={117.068}
      />
    </group>
  );
};

useGLTF.preload("/models/jsIcon.glb");

export default JSIcon;
