import { Canvas } from "@react-three/fiber";
import Experience from "./components/Experience";
import Interface from "./components/Interface";
import { Suspense } from "react";
import { Loader } from "@react-three/drei";
import { useCameraControl } from "./contexts/CameraControlContext";
import { cameraLookAtConst } from "./constances/constances";

function App() {
  const { setCameraLookAt } = useCameraControl();
  return (
    <div className="w-full h-svh">
      <Canvas
        camera={{ position: [0, 3, 8], fov: 50 }}
        shadows
        style={{
          background: "white",
        }}
        frameloop="always"
        className=""
      >
        <Suspense fallback={null}>
          <Experience />
        </Suspense>
      </Canvas>
      <Loader
        dataInterpolation={(persentLoaded) => {
          if (persentLoaded === 100) {
            console.log("loading compeleted");
            setCameraLookAt(cameraLookAtConst);
          }
          return Math.ceil(persentLoaded);
        }}
      />
      <Interface />
    </div>
  );
}

export default App;
