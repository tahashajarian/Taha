import React, { Suspense } from "react";
const Chair = React.lazy(() => import("./Chair"));
const Desk = React.lazy(() => import("./Desk"));
const Keyboard = React.lazy(() => import("./Keyboard"));
const Mouse = React.lazy(() => import("./Mouse"));
const Monitor2 = React.lazy(() => import("./Monitor2"));
const Mug = React.lazy(() => import("./Mug"));

const TableSetup = () => {
  return (
    <group position={[0, 0, 0]}>
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
      <group position={[-0.6, 0.77, 0.65]}>
        <Suspense fallback={null}>
          <Mug />
        </Suspense>
      </group>
    </group>
  );
};

export default TableSetup;
