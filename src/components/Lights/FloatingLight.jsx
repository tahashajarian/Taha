import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";

const FloatingPoint = ({ color, position, amplitude, frequency }) => {
  const groupRef = useRef();
  let elapsed = useRef(0);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    elapsed.current += delta;
    const time = elapsed.current * frequency;

    const newY = position[1] + amplitude * Math.cos(time);
    const newZ = position[2] + amplitude * Math.sin(2 * time);

    groupRef.current.position.y = newY;
    groupRef.current.position.z = newZ;
  });

  return (
    <group ref={groupRef} position={[position[0], position[1], position[2]]}>
      <mesh>
        <sphereGeometry args={[0.02, 4, 4]} />
        <meshStandardMaterial emissive={color} emissiveIntensity={10} />
      </mesh>
      <pointLight power={1} color={color} intensity={1} distance={2} />
    </group>
  );
};

export default FloatingPoint;
