import React, { useMemo } from "react";
import * as THREE from "three";
import { randomColor } from "../../constances/constances";

const Papers = () => {
  const paperCount = 10;

  // Generate positions, rotations, and colors only once
  const papers = useMemo(
    () =>
      Array.from({ length: paperCount }, (_, index) => {
        const rotation = new THREE.Euler(
          0,
          0,
          (Math.random() * 2 * Math.PI) / 12,
        );
        const position = new THREE.Vector3(0, 0, index * 0.0001);
        const color = randomColor();
        return { rotation, position, color };
      }),
    [paperCount],
  );

  return (
    <group>
      <Pen />
      {papers.map((p, index) => (
        <mesh
          key={index}
          rotation={[p.rotation.x, p.rotation.y, p.rotation.z]}
          position={[p.position.x, p.position.y, p.position.z]}
        >
          <planeGeometry args={[0.2, 0.3]} />
          <meshBasicMaterial color={p.color} />
        </mesh>
      ))}
    </group>
  );
};

export default Papers;

const Pen = () => (
  <mesh position={[0, 0, 0.005]}>
    <cylinderGeometry args={[0.005, 0.005, 0.118]} />
    <meshBasicMaterial color={"black"} />
  </mesh>
);
