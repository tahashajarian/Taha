import React from "react";
import * as THREE from "three";

type Props = {};

const Window = (props: Props) => {
  const meshes = [
    { rotation: new THREE.Euler(0, Math.PI / 2, 0), position: [0.1, 0, 1.79], args: [0.1, 3] },  // Side 1
    { rotation: new THREE.Euler(0, Math.PI / 2, 0), position: [0.1, 1.2, 0], args: [0.1, 0.7] },  // Middle
    { rotation: new THREE.Euler(0, Math.PI / 2, 0), position: [0.1, 0, -1.79], args: [0.1, 3] }, // Side 2
    { rotation: new THREE.Euler(0, Math.PI / 2, Math.PI / 2), position: [0.1, 1.54, 0], args: [0.1, 3.68] }, // Top
    { rotation: new THREE.Euler(0, Math.PI / 2, Math.PI / 2), position: [0.1, 0.8, 0], args: [0.1, 3.68] },  // Middle Top
    { rotation: new THREE.Euler(0, Math.PI / 2, Math.PI / 2), position: [0.1, -1.54, 0], args: [0.1, 3.68] }, // Bottom
  ];

  return (
    <group {...props} dispose={null}>
      {meshes.map((mesh, index) => (
        <mesh key={index} rotation={mesh.rotation} position={mesh.position as [number, number, number]}>
          <planeGeometry args={mesh.args as [number, number]} />
          <meshBasicMaterial color="black" />
        </mesh>
      ))}
      
    </group>
  );
};

export default Window;
