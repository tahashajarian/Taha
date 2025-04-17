import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import Experience from "./components/Experience";
import Interface from "./components/UI/Interface";
import { Loader } from "@react-three/drei";
import { useCameraControl } from "./contexts/CameraControlContext";
import { cameraLookAtConst } from "./constances/constances";
import { useAppStatusContext } from "./contexts/AppStatusContext";
import ErrorBoundary from "./components/ErrorBoundary";
import HandlePerformance from "./performance/HandlePerformance";

function App() {
  const { setCameraLookAt } = useCameraControl();
  const { setIsAppLoaded } = useAppStatusContext();
  const [loaded, setLoaded] = useState(false);

  return (
    <ErrorBoundary>
      <div className="w-full h-svh">
        <Canvas
          camera={{ position: [0, 3, 8], fov: 50 }}
          shadows
          style={{
            background: "rgb(42 50 60)",
          }}
          frameloop="demand"
          className=""
          gl={{ antialias: true }}
          dpr={[1, 2]}
          onCreated={({ gl }) => {
            gl.physicallyCorrectLights = true;
          }}
        >
          <Experience />
          <HandlePerformance />
        </Canvas>

        {/* Drei’s Loader now animates from 0→100 */}
        {!loaded && (
          <Loader
            dataInterpolation={(percent) => {
              if (percent === 100) {
                setCameraLookAt(cameraLookAtConst);
                setIsAppLoaded(true);
                setLoaded(true);
              }
              return `${Math.ceil(percent)}%`;
            }}
          />
        )}

        <Interface />
      </div>
    </ErrorBoundary>
  );
}

export default App;
