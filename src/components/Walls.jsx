import React, { useRef } from "react";
import Ground from "./Ground";
import ReactIcon from "./ReactIcon";

const Walls = () => {
  return (
    <>
      <Ground />
      <group
        rotation={[0, 0, Math.PI / -2]}
        position={[wallSize / -2, wallHeight / 2, 1]}
      >
        <ReactIcon />
      </group>
      {wallData.map((wall, index) => (
        <Wall
          key={index}
          args={wall.args}
          position={wall.pos}
          rotation={wall.rot}
        />
      ))}
    </>
  );
};

export default Walls;

const Wall = ({ position, rotation, args }) => {
  return (
    <mesh rotation={rotation} position={position} receiveShadow>
      <planeGeometry args={args} />
      <meshStandardMaterial />
    </mesh>
  );
};

const wallSize = 12;
const wallHeight = 4;
const segments = 1;

const wallData = [
  // {
  //   pos: [0, 0, 0],
  //   rot: [-0.5 * Math.PI, 0, 0],
  //   args: [wallSize, wallSize, segments, segments],
  // },
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
