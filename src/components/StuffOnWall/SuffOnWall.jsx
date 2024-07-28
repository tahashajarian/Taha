import React from "react";
import ReactIcon from "./ReactIcon";
import { wallHeight, wallSize } from "../Walls";
import WebpackIcon3D from "./WebpackIcon";
import JSIcon from "./JSIcon";
import TailwindIcon from "./TailwindIcon";
import PaintFrame from "./PaintFrame";
import GodsHand from "./GodsHand";

const SuffOnWall = () => {
  return (
    <group>
      <group
        rotation={[0, 0, Math.PI / -2]}
        position={[wallSize / -2, wallHeight / 2, 1]}
      >
        <ReactIcon />
      </group>
      <group
        rotation={[0, Math.PI / -2, 0]}
        position={[wallSize / 2.001, wallHeight / 2, 2]}
      >
        <PaintFrame />
      </group>
      <group
        rotation={[0, 0, Math.PI / -2]}
        position={[wallSize / -2.2, 0.5, -3]}
      >
        <WebpackIcon3D />
      </group>

      <group
        rotation={[Math.PI / 2, 0, Math.PI / -2]}
        position={[wallSize / -2.2, 0.5, 3]}
      >
        <JSIcon />
      </group>
      <group
        rotation={[Math.PI / 2, 0, Math.PI / -2]}
        position={[wallSize / -2.2, 0.75, -0.4]}
      >
        <TailwindIcon />
      </group>
      <group rotation={[0, 0, 0]} position={[-3.2, 2, wallSize / -2 + 0.1]}>
        <GodsHand />
      </group>
    </group>
  );
};

export default SuffOnWall;
