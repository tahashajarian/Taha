import React, { Suspense } from "react";
import Textes from "./textes/Textes";
import Chair from "./Chair";
import Desk from "./Desk";
import Keyboard from "./Keyboard";
import Mouse from "./Mouse";
import Monitor2 from "./Monitor2";
import Mug from "./Mug";
import Papers from "./Papers";
import Speaker from "./Speaker";

const TableSetup = () => {
  return (
    <group position={[0, 0, 0]}>
      <Chair />
      <group position={[0, 0, 0.8]} scale={[1.2, 0.84, 1]}>
        <Desk />
      </group>
      <group position={[0, 0.71, 1]}>
        <Monitor2 />
      </group>
      <group position={[-0.26, 0.7, 0.68]} scale={[1, 1.2, 1]}>
        <Mouse />
      </group>
      <group position={[0.1, 0.715, 0.65]}>
        <Keyboard />
      </group>
      <group position={[-0.6, 0.771, 0.65]}>
        <Mug />
      </group>
      <group position={[0.7, 0.71, 0.65]} rotation={[-Math.PI / 2, 0, 0]}>
        <Papers />
      </group>
      <group position={[0.8, 0.8, 0.99]} rotation={[0, 0, 0]}>
        <Speaker />
      </group>
      <Textes />
    </group>
  );
};

export default TableSetup;
