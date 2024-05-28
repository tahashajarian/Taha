import React, { Suspense } from "react";
import Chair from "./Chair";
import Desk from "./Desk";
import Monitor from "./Monitor";
import Keyboard from "./Keyboard";
import Mouse from "./Mouse";
import Monitor2 from "./Monitor2";

const TableSetup = () => {
  return (
    <group position={[0, 0, 0]}>
      <Suspense fallback={null}>
        <Chair />
      </Suspense>
      <group position={[0, 0, 0.8]} scale={[1.2, 0.84, 1]}>
        <Suspense fallback={null}>
          <Desk />
        </Suspense>
      </group>
      <group position={[0, 0.71, 1]}>
        <Suspense fallback={null}>
          <Monitor2 />
        </Suspense>
      </group>
      <group position={[-0.26, 0.7, 0.68]} scale={[1, 1.2, 1]}>
        <Suspense fallback={null}>
          <Mouse />
        </Suspense>
      </group>
      <group position={[0.1, 0.715, 0.65]}>
        <Suspense fallback={null}>
          <Keyboard />
        </Suspense>
      </group>
    </group>
  );
};

export default TableSetup;
