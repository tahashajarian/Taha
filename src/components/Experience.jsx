import React, { lazy, Suspense } from "react";
import { Float, Html, OrbitControls } from "@react-three/drei";
import LoaderComponent from "./LoaderComponent";
import CameraControl from "./CameraControl";
const Lights = lazy(() => import("./Lights"));
const Walls = lazy(() => import("./Walls"));
const TableSetup = lazy(() => import("./TableSetup"));
const Sofa = lazy(() => import("./Sofa"));
const Mobleman = lazy(() => import("./Mobleman"));
const Mirror = lazy(() => import("./Mirror"));
const TahaContainer = lazy(() => import("./TahaContainer"));

const Experience = () => {
  return (
    <>
      <OrbitControls />
      {/* <Float speed={2} rotationIntensity={2} floatIntensity={2}> */}
      <Lights />
      <CameraControl />
      {/* </Float> */}
      <Suspense fallback={<LoaderComponent />}>
        <TahaContainer />
      </Suspense>
      <Suspense fallback={<LoaderComponent />}>
        <TableSetup />
      </Suspense>
      <Suspense fallback={<LoaderComponent />}>
        <Walls />
      </Suspense>
      <Suspense fallback={<LoaderComponent />}>
        <Sofa />
      </Suspense>
      <Suspense fallback={<LoaderComponent />}>
        <Mirror />
      </Suspense>
      {/* <Mobleman /> */}
    </>
  );
};

export default Experience;
