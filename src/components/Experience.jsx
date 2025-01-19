import React, { Suspense } from "react";
import { OrbitControls } from "@react-three/drei";
import CameraControl from "./Camera/CameraControl";
import TableSetup from "./Desk/TableSetup";
import TahaContainer from "./Taha/TahaContainer";
import StuffOnWall from "./StuffOnWall/SuffOnWall";
import Lights from "./Lights/Lights";
import FlightPoints from "./Lights/FlightPoints";
import Walls from './Room/Walls'
import FireCube from "./Lights/Fireplace/Fire";


const Experience = () => {
  return (
    <>
      <Lights />
      <CameraControl />
      <TahaContainer />
      <TableSetup />
      <Walls />
      <StuffOnWall />
      <FlightPoints />
      <FireCube />
    </>
  );
};

export default Experience;
