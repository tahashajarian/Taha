import React, { useEffect, useState } from "react";
import { useGLTF } from "@react-three/drei";
import Sound from "./Sound";

export const Cat3 = (props) => {
  const { nodes, materials } = useGLTF("/models/cat3.glb");

  return (
    <group {...props} dispose={null} scale={0.9}>
      <group>
        <mesh position={[0, -0.02, 0.25]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.54, 0.045, 0.02]} />
          <meshBasicMaterial color={"#333"} transparent />
        </mesh>

        <mesh position={[0, -0.02, -0.25]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.54, 0.045, 0.02]} />
          <meshBasicMaterial color={"#333"} transparent />
        </mesh>
        <mesh position={[-0.27, -0.02, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[0.52, 0.045, 0.02]} />
          <meshBasicMaterial color={"#333"} transparent />
        </mesh>

        <mesh position={[0.26, -0.02, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[0.52, 0.045, 0.02]} />
          <meshBasicMaterial color={"#333"} transparent />
        </mesh>
      </group>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Mesh_0006.geometry}
        material={materials["Material_0.006"]}
        position={[-0.011, 0, -0.017]}
        rotation={[-Math.PI, 1.562, -Math.PI]}
      />
      <Sound
        // url={"/audio/Ludwing Van Beethoven - 5th Symphony 1st Movement.mp3"}
        url={"/audio/cat.mp3"}
        isPlaying={true}
      />
    </group>
  );
};

useGLTF.preload("/models/cat3.glb");

export default Cat3;
