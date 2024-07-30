import React, { Suspense } from "react";
import { wallHeight, wallSize } from "../../constances/constances";
import { useAppStatusContext } from "../../contexts/AppStatusContext";

// Lazy import components
const ReactIcon = React.lazy(() => import("./ReactIcon"));
const WebpackIcon3D = React.lazy(() => import("./WebpackIcon"));
const JSIcon = React.lazy(() => import("./JSIcon"));
const TailwindIcon = React.lazy(() => import("./TailwindIcon"));
const PaintFrame = React.lazy(() => import("./PaintFrame"));
const GodsHand = React.lazy(() => import("./GodsHand"));
const Flower = React.lazy(() => import("../Flower"));
const StarryNight = React.lazy(() => import("./StarryNight"));
const Mirror = React.lazy(() =>import("../Mirror") );
const Sofa = React.lazy(() =>import("../Sofa") );


const SuffOnWall = () => {
  const { isApploaded } = useAppStatusContext();

  return (
    <group>
      {isApploaded && (
        <>
          {/* Uncomment the following block if you want to use ReactIcon */}
          {/* <Suspense fallback={null}>
            <group
              rotation={[0, 0, Math.PI / -2]}
              position={[wallSize / -2, wallHeight / 2, 1]}
            >
              <ReactIcon />
            </group>
          </Suspense> */}
          <Suspense fallback={null}>
            <group
              rotation={[0, Math.PI / -2, 0]}
              position={[wallSize / 2.001, wallHeight / 2, 2]}
            >
              <PaintFrame />
            </group>
          </Suspense>
          {/* Uncomment the following block if you want to use WebpackIcon3D */}
          {/* <Suspense fallback={null}>
            <group
              rotation={[0, 0, Math.PI / -2]}
              position={[wallSize / -2.2, 0.6, 1]}
            >
              <WebpackIcon3D />
            </group>
          </Suspense> */}
          {/* Uncomment the following block if you want to use JSIcon */}
          {/* <Suspense fallback={null}>
            <group
              rotation={[Math.PI / 2, 0, Math.PI / -2]}
              position={[wallSize / -2.2, 0.6, 3]}
            >
              <JSIcon />
            </group>
          </Suspense> */}
          {/* Uncomment the following block if you want to use TailwindIcon */}
          {/* <Suspense fallback={null}>
            <group
              rotation={[Math.PI / 2, 0, Math.PI / -2]}
              position={[wallSize / -2.2, 0.75, -0.4]}
            >
              <TailwindIcon />
            </group>
          </Suspense> */}
          <Suspense fallback={null}>
            <group rotation={[0, 0, 0]} position={[-3.2, 2, wallSize / -2 + 0.1]}>
              <StarryNight />
            </group>
          </Suspense>
          <Suspense fallback={null}>
            <group rotation={[0, 0, 0]} position={[-wallSize/2 + 0.75, 0.98, wallSize/2 - 1]}>
              <Flower />
            </group>
          </Suspense>
          <Suspense fallback={null}>
            <group rotation={[0, Math.PI/2, 0]} position={[-wallSize/2 + 0.1, 2, 0]}>
              <GodsHand />
            </group>
          </Suspense>
          <Suspense fallback={null}>
            <Sofa />
          </Suspense>
          <Suspense fallback={null}>
            <Mirror />
          </Suspense>
        </>
      )}
    </group>
  );
};

export default SuffOnWall;
