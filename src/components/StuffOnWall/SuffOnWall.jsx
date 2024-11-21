import React, { Suspense } from "react";
import { wallHeight, wallSize } from "../../constances/constances";
import { useAppStatusContext } from "../../contexts/AppStatusContext";

import GodsHand from "./GodsHand";
import Flower from "../Flower";
import TheWallWallPaper from "./TheWallWallPaper";
import Sofa from "../Sofa";
import PaintFrame from "./PaintFrame";

const SuffOnWall = () => {
  const { isApploaded } = useAppStatusContext();

  return (
    <group>
      {isApploaded && (
        <>
          <group
            rotation={[0, Math.PI / -2, 0]}
            position={[wallSize / 2.001, wallHeight / 2, 2]}
          >
            <PaintFrame />
          </group>

          <group rotation={[0, 0, 0]} position={[0, 1.8, wallSize / -2 + 0.01]} receiveShadow>
            <TheWallWallPaper />
          </group>
          <group
            rotation={[0, 0, 0]}
            position={[-wallSize / 2 + 0.75, 0.98, wallSize / 2 - 1]}
          >
            <Flower />
          </group>
          <group
            rotation={[0, Math.PI / 2, 0]}
            position={[-wallSize / 2 + 0.1, 2, 0]}
          >
            <GodsHand />
          </group>
          <Sofa />
        </>
      )}
    </group>
  );
};

export default SuffOnWall;
