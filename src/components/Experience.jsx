import React, { Suspense } from "react";
import { OrbitControls } from "@react-three/drei";
import LoaderComponent from "./LoaderComponent";
import CameraControl from "./CameraControl";
import Walls from "./Walls";
import TableSetup from "./TableSetup";
import TahaContainer from "./TahaContainer";
import StuffOnWall from "./StuffOnWall/SuffOnWall";
import Lights from "./Lights";
import FlightPoints from "./FlightPoints";


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

    </>
  );
};

export default Experience;
