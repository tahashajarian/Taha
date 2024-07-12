import { Canvas } from "@react-three/fiber";
import Experience from "./components/Experience";
import Interface from "./components/Interface";
import { Suspense, useEffect } from "react";
import { Loader, Html } from "@react-three/drei";
import { useCameraControl } from "./contexts/CameraControlContext";
import { cameraLookAtConst } from "./constances/constances";
import { useAppStatusContext } from "./contexts/AppStatusContext";

function App() {
  const { setCameraLookAt } = useCameraControl();
  const { setIsAppLoaded } = useAppStatusContext();

  return (
    <div className="w-full h-svh">
      <Canvas
        camera={{ position: [0, 3, 8], fov: 50 }}
        shadows
        style={{
          background: "black",
        }}
        frameloop="demand"
        className=""
      >
        <Experience />
      </Canvas>
      <Loader
        dataInterpolation={(percentLoaded) => {
          if (percentLoaded === 100) {
            console.log("Loading completed");
            setCameraLookAt(cameraLookAtConst);
            setIsAppLoaded(true);
          }
          return `${Math.ceil(percentLoaded)}%`;
        }}
      />
      <Interface />
    </div>
  );
}

export default App;
