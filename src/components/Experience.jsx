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
import Cat from "./Cat";

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
      <StuffOnWall />
      <FlightPoints />
      <Cat />
    </>
  );
};

export default Experience;
