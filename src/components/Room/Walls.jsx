// Walls.jsx
import React, { useRef, useEffect } from "react";
import { wallData, wallHeight, wallSize } from "../../constances/constances";
import Library from "../Stuff/Library";
import TexturedFloor from "./Ground";
import Wall from "./Wall";
import Outside from "./Outside";

const Walls = ({ onCollidersReady }) => {
  const collidersRef = useRef([]);

  const setColliderRef = (i) => (el) => {
    collidersRef.current[i] = el;
  };

  useEffect(() => {
    // wait a tick so refs are attached; filter out undefined
    if (onCollidersReady) {
      const ready = collidersRef.current.filter(Boolean);
      onCollidersReady(ready);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  // thickness of wall colliders (increase if you still see clipping)
  const thickness = 2;

  return (
    <>
      <TexturedFloor />
      <Outside />
      {wallData.map((wall, index) => (
        <Wall
          key={index}
          args={wall.args}
          position={wall.pos}
          rotation={wall.rot}
          windowPosition={wall.windowPosition || undefined}
          windowSize={wall.windowSize || undefined}
        />
      ))}

      {/* invisible box colliders: create one per wallData entry */}
      {wallData.map((w, i) => {
        // try to read width/height from args but fallback to global constants
        const args = w.args || [];
        const width = args[0] ?? wallSize;
        const height = args[1] ?? wallHeight;

        // detect floor-like wall (rotated 90deg on X)
        const isFloor = Math.abs((w.rot?.[0] ?? 0) - 0.5 * Math.PI) < 0.01;

        // For a vertical wall: box args = [width, height, thickness]
        // For floor: box args = [width, thickness, depth], depth ~ args[2] or wallSize
        const boxArgs = isFloor
          ? [width, thickness, args[2] ?? wallSize]
          : [width, height, thickness];

        // Use same position/rotation as the wall so collider aligns.
        // visible={false} keeps it from rendering but still raycastable.
        return (
          <mesh
            key={`collider-${i}`}
            ref={setColliderRef(i)}
            position={w.pos}
            rotation={w.rot}
            visible={false}
          >
            <boxGeometry args={boxArgs} />
            <meshBasicMaterial visible={false} />
          </mesh>
        );
      })}

      <Library position={[wallSize / 2 - 0.3, wallHeight / 2 + 0.4, -3]} />
    </>
  );
};

export default Walls;