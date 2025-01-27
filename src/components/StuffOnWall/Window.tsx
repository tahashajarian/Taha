import { useGLTF } from "@react-three/drei";
import React, { useRef } from "react";
import * as THREE from "three";

type Props = {};

const Window = (props: Props) => {
  const { nodes, materials } = useGLTF("/models/window.glb");
  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={
          (nodes.BodyCourtyard_Template002_Window_referencesmdmesh_0 as THREE.Mesh).geometry
        }
        material={
          (nodes.BodyCourtyard_Template002_Window_referencesmdmesh_0 as THREE.Mesh).material
        }
        scale={0.01}
      />
    </group>
  );
};

useGLTF.preload('/models/window.glb')

export default Window;
