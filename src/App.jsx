import { Canvas } from "@react-three/fiber";
import Experience from "./components/Experience";
import Interface from "./components/Interface";
import { Suspense } from "react";
import { Loader } from "@react-three/drei";
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
            setIsAppLoaded(true);
          }
          return Math.ceil(persentLoaded);
        }}
      />
      <Interface />
    </div>
  );
}

export default App;
