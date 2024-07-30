import React, { Suspense } from "react";
import { useAppStatusContext } from "../contexts/AppStatusContext";

// Lazy load components
const OrbitControls = React.lazy(() => import("@react-three/drei").then(module => ({ default: module.OrbitControls })));
const LoaderComponent = React.lazy(() => import("./LoaderComponent"));
const CameraControl = React.lazy(() => import("./CameraControl"));
const Walls = React.lazy(() => import("./Walls"));
const TableSetup = React.lazy(() => import("./TableSetup"));
const Sofa = React.lazy(() => import("./Sofa"));
const Mirror = React.lazy(() => import("./Mirror"));
const TahaContainer = React.lazy(() => import("./TahaContainer"));
const StuffOnWall = React.lazy(() => import("./StuffOnWall/SuffOnWall"));
const Lights = React.lazy(() => import("./Lights"));

const Experience = () => {
  const { isAppLoaded } = useAppStatusContext(); // Use your context to get the loaded status

  return (
    <Suspense fallback={<LoaderComponent />}>
      {/* Render components only if the app is loaded */}
      {isAppLoaded && (
        <>
          <OrbitControls />
          <Lights />
          <CameraControl />
          <TahaContainer />
          <TableSetup />
          <Walls />
          <Sofa />
          <Mirror />
          <StuffOnWall />
        </>
      )}
    </Suspense>
  );
};

export default Experience;
