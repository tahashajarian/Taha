import React from "react";
import * as THREE from "three";
import { randomColor } from "../constances/constances";

const Papers = () => {
  const paperCount = 10;
  const papers = Array.from({ length: paperCount }, (_, index) => {
    const rotation = new THREE.Euler(0, 0, (Math.random() * 2 * Math.PI) / 12);
    const position = new THREE.Vector3(0, 0, index * 0.0001);
    const color = randomColor();

    return (
      <mesh
        key={index}
        rotation={[rotation.x, rotation.y, rotation.z]}
        position={[position.x, position.y, position.z]}
      >
        <planeGeometry args={[0.2, 0.3]} />
        <meshBasicMaterial color={color} />
      </mesh>
    );
  });

  return (
    <group>
      <Pen />
      {papers}
    </group>
  );
};

export default Papers;

const Pen = () => {
  return (
    <mesh position={[0, 0, 0.005]}>
      <cylinderGeometry args={[0.005, 0.005, 0.118]} />
      <meshBasicMaterial color={"black"} />
    </mesh>
  );
};
