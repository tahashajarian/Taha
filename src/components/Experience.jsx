import React, { Suspense, useState } from "react";
import { OrbitControls } from "@react-three/drei";
import CameraControl from "./Camera/CameraControl";
import TableSetup from "./Desk/TableSetup";
import TahaContainer from "./Taha/TahaContainer";
import StuffOnWall from "./StuffOnWall/SuffOnWall";
import Lights from "./Lights/Lights";
import Walls from "./Room/Walls";
import FireCube from "./Lights/Fireplace/Fire";

const Experience = () => {
  const [colliders, setColliders] = useState([]);

  return (
    <>
      <Lights />
      <CameraControl colliderMeshes={colliders} />
      <TahaContainer />
      <TableSetup />
      <Walls onCollidersReady={(arr) => setColliders(arr)} />
      <StuffOnWall />
      <FireCube />
    </>
  );
};

export default Experience;
