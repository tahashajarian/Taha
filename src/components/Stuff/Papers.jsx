import React, { useMemo } from "react";
import * as THREE from "three";
import { randomColor } from "../../constances/constances";

const PAPER_COUNT = 10;

const Papers = () => {
  // Shared geometry
  const geometry = useMemo(() => new THREE.PlaneGeometry(0.2, 0.3), []);

  // Generate static paper data once
  const papers = useMemo(
    () =>
      Array.from({ length: PAPER_COUNT }, (_, i) => ({
        rotation: [0, 0, (Math.random() * Math.PI) / 6],
        position: [0, 0, i * 0.0001],
        color: randomColor(),
      })),
    [],
  );

  return (
    <group>
      <Pen />
      {papers.map((p, i) => (
        <mesh
          key={i}
          geometry={geometry}
          rotation={p.rotation}
          position={p.position}
        >
          <meshBasicMaterial color={p.color} />
        </mesh>
      ))}
    </group>
  );
};

export default Papers;

const Pen = () => {
  const geometry = useMemo(
    () => new THREE.CylinderGeometry(0.005, 0.005, 0.118),
    [],
  );

  return (
    <mesh position={[0, 0, 0.005]} geometry={geometry}>
      <meshBasicMaterial color="black" />
    </mesh>
  );
};