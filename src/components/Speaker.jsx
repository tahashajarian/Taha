import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

const Speaker = (props) => {
  const { nodes, materials } = useGLTF("/models/speaker.glb");
  return (
    <group {...props} dispose={null} scale={0.08} rotation={[Math.PI, 0, 0]}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube.geometry}
        material={materials["Material.002"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Circle.geometry}
        material={materials["Material.001"]}
        position={[0, 0, 1.277]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.764}
      />
    </group>
  );
};

useGLTF.preload("/models/speaker.glb");
export default Speaker;
