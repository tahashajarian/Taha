import React from "react";

const Walls = () => {
  const wallSize = 12;
  const wallHeight = 4;
  const segments = 1;
  return (
    <>
      <mesh
        rotation={[-0.5 * Math.PI, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[wallSize, wallSize, segments, segments]} />
        <meshStandardMaterial />
      </mesh>
      <mesh
        rotation={[Math.PI, 0, 0]}
        position={[0, wallHeight / 2, wallSize / 2]}
        receiveShadow
      >
        <planeGeometry args={[wallSize, wallHeight, segments, segments]} />
        <meshStandardMaterial />
      </mesh>
      <mesh
        rotation={[0, 0, 0]}
        position={[0, wallHeight / 2, -wallSize / 2]}
        receiveShadow
      >
        <planeGeometry args={[wallSize, wallHeight, segments, segments]} />
        <meshStandardMaterial />
      </mesh>
      <mesh
        rotation={[0, Math.PI / 2, 0]}
        position={[-wallSize / 2, wallHeight / 2, 0]}
        receiveShadow
      >
        <planeGeometry args={[wallSize, wallHeight, segments, segments]} />
        <meshStandardMaterial />
      </mesh>
      <mesh
        rotation={[0, -Math.PI / 2, 0]}
        position={[wallSize / 2, wallHeight / 2, 0]}
        receiveShadow
      >
        <planeGeometry args={[wallSize, wallHeight, segments, segments]} />
        <meshStandardMaterial />
      </mesh>
    </>
  );
};

export default Walls;
