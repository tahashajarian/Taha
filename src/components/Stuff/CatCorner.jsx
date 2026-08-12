import React from "react";
import Cat3 from "./Cat3";

const CatCorner = () => {
  return (
    <group position={[1.35, 0, -5.05]} rotation={[0, Math.PI, 0]}>
      <mesh position={[0, 0.04, 0]} receiveShadow>
        <boxGeometry args={[1.05, 0.08, 0.85]} />
        <meshStandardMaterial color="#6f302d" roughness={0.95} />
      </mesh>

      <mesh position={[-0.32, 0.38, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.68, 10]} />
        <meshStandardMaterial color="#b49469" roughness={1} />
      </mesh>

      <mesh position={[0.3, 0.65, 0.18]} castShadow>
        <boxGeometry args={[0.12, 1.15, 0.12]} />
        <meshStandardMaterial color="#6f302d" roughness={0.95} />
      </mesh>

      <mesh position={[-0.18, 0.72, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.78, 0.1, 0.68]} />
        <meshStandardMaterial color="#8d3e38" roughness={0.95} />
      </mesh>

      <mesh position={[0.12, 1.22, 0.08]} castShadow receiveShadow>
        <boxGeometry args={[0.82, 0.1, 0.72]} />
        <meshStandardMaterial color="#8d3e38" roughness={0.95} />
      </mesh>

      <mesh position={[0.12, 1.3, 0.46]} castShadow>
        <boxGeometry args={[0.82, 0.26, 0.08]} />
        <meshStandardMaterial color="#6f302d" roughness={0.95} />
      </mesh>

      <group position={[0.12, 1.312, 0.03]} rotation={[0, Math.PI, 0]} scale={1.12}>
        <Cat3 />
      </group>
    </group>
  );
};

export default CatCorner;
