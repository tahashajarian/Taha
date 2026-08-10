import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";

const FloatingPoints = ({ points }) => {
  const groupRefs = useRef([]);
  const elapsed = useRef(0);

  useFrame((_, delta) => {
    elapsed.current += delta;
    for (let i = 0; i < points.length; i += 1) {
      const group = groupRefs.current[i];
      if (!group) continue;
      const { position, amplitude, frequency } = points[i];
      const time = elapsed.current * frequency;
      group.position.y = position[1] + amplitude * Math.cos(time);
      group.position.z = position[2] + amplitude * Math.sin(2 * time);
    }
  });

  return (
    <>
      {points.map(({ color, position }, index) => (
        <group
          key={`${color}-${position.join("-")}`}
          ref={(node) => { groupRefs.current[index] = node; }}
          position={position}
        >
          <mesh>
            <sphereGeometry args={[0.02, 4, 4]} />
            <meshStandardMaterial emissive={color} emissiveIntensity={10} />
          </mesh>
        </group>
      ))}
    </>
  );
};

export default FloatingPoints;
