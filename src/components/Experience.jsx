import React, { useState, useCallback } from "react";
import CameraControl from "./Camera/CameraControl";
import TableSetup from "./Desk/TableSetup";
import TahaContainer from "./Taha/TahaContainer";
import StuffOnWall from "./StuffOnWall/SuffOnWall";
import Lights from "./Lights/Lights";
import Walls from "./Room/Walls";
import FireCube from "./Lights/Fireplace/Fire";
import CatCorner from "./Stuff/CatCorner";

const Experience = () => {
  const [colliders, setColliders] = useState([]);

  const handleCollidersReady = useCallback((arr) => {
    setColliders(arr);
  }, []);

  return (
    <>
      <Lights />
      <CameraControl colliderMeshes={colliders} />
      <TahaContainer />
      <TableSetup />
      <CatCorner />
      <Walls onCollidersReady={handleCollidersReady} />
      <StuffOnWall />
      <FireCube />
    </>
  );
};

export default Experience;
