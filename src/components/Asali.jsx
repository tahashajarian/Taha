import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

const Asali = (props) => {
  const { nodes, materials } = useGLTF("/models/asali.glb");
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.table001.geometry}
        material={materials.table}
      />
    </group>
  );
};

useGLTF.preload("/models/asali.glb");

export default Asali;
