import React from "react";
import Chair from "./Chair";
import Desk from "./Desk";
import Monitor from "./Monitor";
import Keyboard from "./Keyboard";
import Mouse from "./Mouse";

const TableSetup = () => {
  return (
    <group position={[0, 0, 0]}>
      <Chair />
      <group position={[0, 0, 0.8]} scale={[1.2, 0.84, 1]}>
        <Desk />
      </group>
      <group position={[0, 0.7, 1]}>
        <Monitor />
      </group>
      <group position={[-0.26, 0.7, 0.68]} scale={[1, 1.2, 1]}>
        <Mouse />
      </group>
      <group position={[0.1, 0.715, 0.65]}>
        <Keyboard />
      </group>
    </group>
  );
};

export default TableSetup;
