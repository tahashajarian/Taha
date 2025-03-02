import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import Bird from "./Bird";
import { wallSize } from "../../constances/constances";

const Birds = ({ count = 5, radius = 1.5, speed = 2.5 }) => {
  const groupRef = useRef();
  const zOffsetRef = useRef(Math.random() * 2 + 1);

  const prevX = useRef(4);
  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.getElapsedTime();
      const newX = 6 - ((time * speed) % 12); // Reversed direction
      if (newX > 5.9) {
        zOffsetRef.current = Math.random() * 10; // Randomize Z offset on reset
        prevX.current = newX; // Randomize Z offset on reset
      }
      groupRef.current.position.x = newX;
      groupRef.current.position.z = Math.max(
        wallSize / 2 + zOffsetRef.current,
        wallSize / 2 + 3
      );
    }
  });

  return (
    <group ref={groupRef} position={[0, 2, wallSize / 2 + 3]}>
      {Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2;
        return (
          <group
            key={i}
            position={[
              Math.cos(angle) * radius,
              (Math.random() - 0.5) * radius * 2,
              Math.sin(angle) * radius,
            ]}
          >
            <Bird />
          </group>
        );
      })}
    </group>
  );
};

export default Birds;
