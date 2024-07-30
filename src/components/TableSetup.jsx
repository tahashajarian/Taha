import React, { Suspense } from "react";
import { tablePosition, tableRotation } from "../constances/constances";
import { useAppStatusContext } from "../contexts/AppStatusContext";

const Textes = React.lazy(() => import("./textes/Textes"));
const Chair = React.lazy(() => import("./Chair"));
const Desk = React.lazy(() => import("./Desk"));
const Keyboard = React.lazy(() => import("./Keyboard"));
const Mouse = React.lazy(() => import("./Mouse"));
const Monitor2 = React.lazy(() => import("./Monitor2"));
const Mug = React.lazy(() => import("./Mug"));
const Papers = React.lazy(() => import("./Papers"));
const Speaker = React.lazy(() => import("./Speaker"));
const Clock = React.lazy(() => import("./Clock"));

const TableSetup = () => {
  const { isApploaded } = useAppStatusContext();

  return (
    <group position={tablePosition} rotation={tableRotation}>
      {isApploaded ? (
        <>
          <Suspense fallback={null}>
            <Chair />
          </Suspense>
          <group position={[0, 0, 0.8]} scale={[1.2, 0.84, 1]}>
            <Suspense fallback={null}>
              <Desk />
            </Suspense>
          </group>
          <group position={[0, 0.71, 1]}>
            <Suspense fallback={null}>
              <Monitor2 />
            </Suspense>
          </group>
          <group position={[-0.26, 0.7, 0.68]} scale={[1, 1.2, 1]}>
            <Suspense fallback={null}>
              <Mouse />
            </Suspense>
          </group>
          <group position={[0.1, 0.715, 0.65]}>
            <Suspense fallback={null}>
              <Keyboard />
            </Suspense>
          </group>
          <group position={[-0.5, 0.771, 0.55]}>
            <Suspense fallback={null}>
              <Mug />
            </Suspense>
          </group>
          <group position={[-0.75, 0.71, 0.75]} rotation={[-Math.PI / 2, 0, 0]}>
            <Suspense fallback={null}>
              <Papers />
            </Suspense>
          </group>
          <group position={[0.8, 0.8, 0.99]} rotation={[0, 0, 0]}>
            <Suspense fallback={null}>
              <Speaker />
            </Suspense>
          </group>
          <group position={[0.8, 0.532, 0.506]} rotation={[0, Math.PI/2, 0]}>
            <Suspense fallback={null}>
              <Clock />
            </Suspense>
          </group>
          <Suspense fallback={null}>
            <Textes />
          </Suspense>
        </>
      ) : null}
    </group>
  );
};

export default TableSetup;
