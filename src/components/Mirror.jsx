import { MeshReflectorMaterial, Reflector } from "@react-three/drei";
import React from "react";

const Mirror = () => {
  return (
    <mesh
      rotation={[0, 0, 0]}
      position={[0, 1.7, -5.99]}
      receiveShadow
    >
      <planeGeometry args={[1.5, 3]} />
      <MeshReflectorMaterial
        blur={[100, 100]} // Blur reflections
        resolution={1024} // Resolution of the reflection
        mixBlur={1} // Mix of blur
        mixStrength={10} // Strength of the reflections
        roughness={0.5} // Roughness of the material
        depthScale={1} // Scale of the depth
        minDepthThreshold={0.9} // Minimum depth threshold
        maxDepthThreshold={1.1} // Maximum depth threshold
        color="#a0a0a0" // Base color
        metalness={0.5} // Metalness of the material
      />
    </mesh>
  );
};

export default Mirror;
