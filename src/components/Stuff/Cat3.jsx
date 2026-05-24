import React, { useMemo, useRef, memo } from "react";
import { useGLTF } from "@react-three/drei";
import Sound from "./Sound";
import SnoreParticles from "./SnoringParticles";
import * as THREE from "three";

export const Cat3 = (props) => {
  const { nodes, materials } = useGLTF("/models/cat3.glb", "/draco/");
  const chestRef = useRef();

  // Shared geometry & material for borders
  const borderGeometry = useMemo(
    () => new THREE.BoxGeometry(0.54, 0.045, 0.02),
    [],
  );

  const borderMaterial = useMemo(
    () => new THREE.MeshBasicMaterial({ color: "#333" }),
    [],
  );

  return (
    <group {...props} dispose={null} scale={0.9}>
      {/* Bed frame */}
      <group>
        <mesh
          geometry={borderGeometry}
          material={borderMaterial}
          position={[0, -0.02, 0.26]}
        />
        <mesh
          geometry={borderGeometry}
          material={borderMaterial}
          position={[0, -0.02, -0.26]}
        />
        <mesh
          geometry={borderGeometry}
          material={borderMaterial}
          rotation={[0, Math.PI / 2, 0]}
          position={[-0.27, -0.02, 0]}
        />
        <mesh
          geometry={borderGeometry}
          material={borderMaterial}
          rotation={[0, Math.PI / 2, 0]}
          position={[0.26, -0.02, 0]}
        />
      </group>

      {/* Cat mesh */}
      <mesh
        ref={chestRef}
        geometry={nodes.Mesh_0006.geometry}
        material={materials["Material_0.006"]}
        position={[-0.011, 0, -0.017]}
        rotation={[-Math.PI, 1.562, -Math.PI]}
      />

      <SnoreParticles />

      <Sound url="/audio/cat.mp3" isPlaying={true} volume={8.0} />
    </group>
  );
};

useGLTF.preload("/models/cat3.glb", "/draco/");
export default memo(Cat3);
