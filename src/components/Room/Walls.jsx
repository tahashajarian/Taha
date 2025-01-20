import React from "react";
import { wallData, wallHeight, wallSize } from "../../constances/constances";
import Library from "../Stuff/Library";
import TexturedFloor from "./Ground";
import Wall from "./Wall";
import Outside from "./Outside";

const Walls = () => {
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
      <Library position={[wallSize / 2 - 0.3, wallHeight / 2 + 0.4, -3]} />
    </>
  );
};

export default Walls;







