import React from "react";
import { useGLTF } from "@react-three/drei";

const Cat = (props) => {
  const { nodes, materials } = useGLTF("/models/cat.glb");
  return (
    <group {...props} dispose={null} position={[0, 0, 3]}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cat.geometry}
        material={materials["01 - Default"]}
        position={[0, 0, -0.147]}
        scale={[0.011, 0.01, 0.011]}
      />
    </group>
  );
};

export default Cat;

useGLTF.preload("/models/cat.glb");
