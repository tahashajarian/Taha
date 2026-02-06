import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { MeshStandardMaterial } from "three";

const Flower = (props) => {
  const { nodes, materials } = useGLTF("/models/flower.glb", "/draco/");
  return (
    <group {...props} dispose={null}>
      <group
        position={[0.039, 0.808, 0.028]}
        rotation={[0, -0.262, 0]}
        scale={0.0022}
      >
        <group position={[-47.723, -808.277, -17.511]}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Mesh002.geometry}
            material={materials.arch75_024_001}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Mesh002_1.geometry}
            material={materials.arch75_024_003}
          />
        </group>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Pot.geometry}
          material={
            new MeshStandardMaterial({
              color: "#8B8000",
             roughness: 0.9,
             metalness: 0.2,
            })
          }
          position={[-47.723, -808.277, -17.511]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Stems.geometry}
          material={materials.arch75_024_002}
          position={[-47.723, -808.277, -17.511]}
        />
      </group>
    </group>
  );
};

useGLTF.preload("/models/flower.glb", "/draco/");

export default Flower;
