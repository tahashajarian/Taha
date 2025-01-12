import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";

const FloatingPoint = ({ color, position, amplitude, frequency }) => {
  const mesh = useRef();
  const light = useRef();
  let elapsed = useRef(0);

  useFrame((state, delta) => {
    elapsed.current += delta;
    const time = elapsed.current * frequency;

    const newY = position[1] + amplitude * Math.cos(time);
    const newZ = position[2] + amplitude * Math.sin(2 * time);

    mesh.current.position.y = newY;
    mesh.current.position.z = newZ;

    light.current.position.y = newY;
    light.current.position.z = newZ;

  
  });

  return (
    <group>
      <mesh ref={mesh} position={position}>
        <sphereGeometry args={[0.02, 4, 4]} />
        <meshStandardMaterial emissive={color} emissiveIntensity={10} />
      </mesh>
      <pointLight ref={light} power={1} color={color} intensity={1} distance={2} position={position} />
    </group>
  );
};

export default FloatingPoint;
