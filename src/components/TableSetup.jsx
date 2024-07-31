import React from "react";
import { tablePosition, tableRotation } from "../constances/constances";
import { useAppStatusContext } from "../contexts/AppStatusContext";

import Textes from "./textes/Textes";
import Chair from "./Chair";
import Desk from "./Desk";
import Keyboard from "./Keyboard";
import Mouse from "./Mouse";
import Monitor2 from "./Monitor2";
import Mug from "./Mug";
import Papers from "./Papers";
import Speaker from "./Speaker";
import Clock from "./Clock";

const TableSetup = () => {
  const { isApploaded } = useAppStatusContext();

  return (
    <group position={tablePosition} rotation={tableRotation}>
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
      <group position={[-0.5, 0.771, 0.55]}>
        <Mug />
      </group>
      <group position={[-0.75, 0.71, 0.75]} rotation={[-Math.PI / 2, 0, 0]}>
        <Papers />
      </group>
      <group position={[0.8, 0.8, 0.99]} rotation={[0, 0, 0]}>
        <Speaker />
      </group>
      <group position={[0.8, 0.532, 0.506]} rotation={[0, Math.PI / 2, 0]}>
        <Clock />
      </group>
      <Textes />
    </group>
  );
};

export default TableSetup;
