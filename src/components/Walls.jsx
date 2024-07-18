import React, { useRef } from "react";
import Ground from "./Ground";
import ReactIcon from "./StuffOnWall/ReactIcon";
import { MeshWobbleMaterial } from "@react-three/drei";
import Library from "./Library";

const Walls = () => {
  return (
    <>
      <Ground />
      {wallData.map((wall, index) => (
        <Wall
          key={index}
          args={wall.args}
          position={wall.pos}
          rotation={wall.rot}
        />
      ))}
      <Library position={[wallSize / 2 - 0.3, wallHeight / 2 + 0.5, -3]} />
    </>
  );
};

export default Walls;

const Wall = ({ position, rotation, args }) => {
  return (
    <mesh rotation={rotation} position={position}>
      <planeGeometry args={args} />
      <meshStandardMaterial color={"#bed4e6"} />
    </mesh>
  );
};

export const wallSize = 12;
export const wallHeight = 4;
const segments = 1;

const wallData = [
  {
    pos: [0, wallHeight, 0],
    rot: [0.5 * Math.PI, 0, 0],
    args: [wallSize, wallSize, segments, segments],
  },
  {
    pos: [0, wallHeight / 2, wallSize / 2],
    rot: [Math.PI, 0, 0],
    args: [wallSize, wallHeight, segments, segments],
  },

  {
    pos: [0, wallHeight / 2, -wallSize / 2],
    rot: [0, 0, 0],
    args: [wallSize, wallHeight, segments, segments],
  },

  {
    pos: [-wallSize / 2, wallHeight / 2, 0],
    rot: [0, Math.PI / 2, 0],
    args: [wallSize, wallHeight, segments, segments],
  },

  {
    pos: [wallSize / 2, wallHeight / 2, 0],
    rot: [0, -Math.PI / 2, 0],
    args: [wallSize, wallHeight, segments, segments],
  },
];
