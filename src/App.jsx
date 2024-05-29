import { Canvas } from "@react-three/fiber";
import Experience from "./components/Experience";
import Interface from "./components/Interface";
import { Suspense } from "react";
import { Loader } from "@react-three/drei";

function App() {
  return (
    <div className="w-full h-svh">
      <Canvas
        camera={{ position: [1, 3, 2.5], fov: 50 }}
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
        onReady={() => {}}
        dataInterpolation={(persentLoaded) => {
          if (persentLoaded === 100) {
            console.log("loading compeleted");
          }
          return Math.ceil(persentLoaded);
        }}
      />
      <Interface />
    </div>
  );
}

export default App;
