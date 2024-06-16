import React from "react";
import * as THREE from "three";

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const Papers = () => {
  const paperCount = 10;
  const papers = Array.from({ length: paperCount }, (_, index) => {
    const rotation = new THREE.Euler(0, 0, (Math.random() * 2 * Math.PI)/12);
    const position = new THREE.Vector3(0, 0, index * 0.0001);
    const color = getRandomColor();

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

  return <group>{papers}</group>;
};

export default Papers;
