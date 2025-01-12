import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import Book from "./Book";

const Asali = (props) => {
  const { nodes, materials } = useGLTF("/models/asali.glb");
  return (
    <group castShadow receiveShadow {...props} dispose={null}>
      <Book position={[0, 0.73, 0]} rotation={[Math.PI / 2, 0, 0]} />
      <Book position={[0, 0.78, 0]} rotation={[Math.PI / 2, 0, 0]} />
      <Book position={[0, 0.83, 0]} rotation={[Math.PI / 2, 0, 0]} />
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
