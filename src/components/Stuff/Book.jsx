import React, { useMemo, useState } from "react";
import { a, useSpring } from "@react-spring/three";
import { randomColor } from "./../../constances/constances";

const Book = ({ position, rotation = [0, 0, 0] }) => {
  const [dropped, setDropped] = useState(false);

  const height = useMemo(() => 0.3 - Math.random() * 0.05, []);
  const color = useMemo(() => randomColor(), []);

  const dropTarget = useMemo(() => {
    const offsetX = Math.random() * -4;
    const offsetZ = Math.random() * 2;
    const rotX = Math.PI / 2; // flat
    const rotZ = (Math.random() - 0.5) * 0.5;
    return {
      position: [position[0] + offsetX, -2.3555, position[2] + offsetZ],
      rotation: [Math.PI / 2, 0 * Math.PI, rotZ * Math.PI],
    };
  }, [position]);

  // Create the spring with a sin-like effect for the Y-position
  const { pos, rot } = useSpring({
    pos: dropped
      ? dropTarget.position
      : [
          position[0], // X stays the same
          position[1],
          position[2], // Z stays the same
        ],
    rot: dropped ? dropTarget.rotation : rotation,
    config: {
      mass: 1,
      tension: 100,
      friction: 22,
      bounce: 1,
      damping: 1,
      clamp: true,
    },
  });

  return (
    <a.mesh
      position={pos}
      rotation={rot}
      onClick={() => setDropped((prev) => !prev)}
      castShadow
    >
      <boxGeometry args={[0.25, height, 0.05]} />
      <meshStandardMaterial color={color} />
    </a.mesh>
  );
};

export default Book;
