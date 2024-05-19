import React from "react";
import { OrbitControls } from "@react-three/drei";
import Taha from "./Taha";
import Lights from "./Lights";
import Walls from "./Walls";
import TableSetup from "./TableSetup";
import Sofa from "./Sofa";
import Mobleman from "./Mobleman";
import Mirror from "./Mirror";

const Experience = () => {
  return (
    <>
      <OrbitControls />
      <Lights />
      <Taha />
      <TableSetup />
      <Walls />
      <Sofa />
      <Mirror />
      {/* <Mobleman /> */}
    </>
  );
};

export default Experience;
