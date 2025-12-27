import React from "react";
import * as THREE from "three";

type Props = {};

const Window = (props: Props) => {
  const meshes = [
    {
      rotation: new THREE.Euler(0, Math.PI / 2, 0),
      position: [0.1, 0, 1.79],
      args: [0.1, 2],
    }, // Side 1
    {
      rotation: new THREE.Euler(0, Math.PI / 2, 0),
      position: [0.1, 0.75, 0],
      args: [0.1, 0.5],
    }, // Middle
    {
      rotation: new THREE.Euler(0, Math.PI / 2, 0),
      position: [0.1, 0, -1.79],
      args: [0.1, 2],
    }, // Side 2
    {
      rotation: new THREE.Euler(0, Math.PI / 2, Math.PI / 2),
      position: [0.1, 1.05, 0],
      args: [0.1, 3.68],
    }, // Top
    {
      rotation: new THREE.Euler(0, Math.PI / 2, Math.PI / 2),
      position: [0.1, 0.55, 0],
      args: [0.1, 3.68],
    }, // Middle Top
    {
      rotation: new THREE.Euler(0, Math.PI / 2, Math.PI / 2),
      position: [0.1, -1, 0],
      args: [0.1, 3.68],
    }, // Bottom
  ];

  return (
    <group {...props} dispose={null} scale={[1, 1, 1]}>
      {meshes.map((mesh, index) => (
        <mesh
          key={index}
          rotation={mesh.rotation}
          position={mesh.position as [number, number, number]}
        >
          <planeGeometry args={mesh.args as [number, number]} />
          <meshBasicMaterial color="#333333" />
        </mesh>
      ))}
    </group>
  );
};

export default Window;
