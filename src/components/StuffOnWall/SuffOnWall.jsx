import React from "react";
import ReactIcon from "./ReactIcon";
import { wallHeight, wallSize } from "../Walls";
import ShaderFrame from "./ShaderFrame";
import WebpackIcon3D from "./WebpackIcon";

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
        <ShaderFrame />
      </group>
      <group
        rotation={[0, 0, Math.PI / -2]}
        position={[wallSize / -2.2, 0.5, -3]}
      >
        <WebpackIcon3D />
      </group>
    </group>
  );
};

export default SuffOnWall;
