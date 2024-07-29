import React, { Suspense } from "react";
import { OrbitControls } from "@react-three/drei";
import LoaderComponent from "./LoaderComponent";
import CameraControl from "./CameraControl";
import Lights from "./Lights";
import Walls from "./Walls";
import TableSetup from "./TableSetup";
import Sofa from "./Sofa";
import Mirror from "./Mirror";
import TahaContainer from "./TahaContainer";
import StuffOnWall from "./StuffOnWall/SuffOnWall";

const Experience = () => {
  return (
    <>
      {/* <OrbitControls /> */}
      {/* <Float speed={2} rotationIntensity={2} floatIntensity={2}> */}
      <Lights />
      <CameraControl />
      {/* </Float> */}
      <TahaContainer />
      <TableSetup />
      <Walls />
      <Sofa />
      <Mirror />
      <StuffOnWall />
    </>
  );
};

export default Experience;
