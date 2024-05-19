import React, { useRef } from "react";
import { OrbitControls } from "@react-three/drei";
import Taha from "./Taha";
import Lights from "./Lights";
import Walls from "./Walls";
import TableSetup from "./TableSetup";

const Experience = () => {
  return (
    <>
      <OrbitControls />
      <Lights />
      <Taha />
      <TableSetup />
      <Walls />
    </>
  );
};

export default Experience;
