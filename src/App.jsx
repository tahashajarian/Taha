import React, { useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import Experience from "./components/Experience";
import Interface from "./components/UI/Interface";
import { cameraLookAtConst } from "./constances/constances";
import ErrorBoundary from "./components/ErrorBoundary";
import HandlePerformance from "./performance/HandlePerformance";
import { NoToneMapping } from "three";
import ProgressTracker from "./components/Loader/ProgressTracker";
import LoadingOverlay from "./components/Loader/LoadingOverlay";
import { useLoadingManager } from "./components/Loader/useLoadingManager";
import { useCameraControlStore } from "./stores/useCameraControlStore";
import { useAppStatusStore } from "./stores/useAppStatusStore";
import { useArrowControls } from "./hooks/useArrowControls";
import { usePaintingInit } from "./hooks/usePaintingInit";
import { useGraphicsSettings } from "./stores/useGraphicsSettings";

function App() {
  const setCameraLookAt = useCameraControlStore((s) => s.setCameraLookAt);
  const setIsAppLoaded = useAppStatusStore((s) => s.setIsAppLoaded);
  const pixelRatio = useGraphicsSettings((s) => s.pixelRatio);
  const {
    loaded,
    percent,
    showLoader,
    showContent,
    handleProgressUpdate,
    handleLoadComplete,
  } = useLoadingManager();

  useArrowControls();
  usePaintingInit();

  useEffect(() => {
    if (loaded) {
      setCameraLookAt(cameraLookAtConst);
      setIsAppLoaded(true);
    }
  }, [loaded, setCameraLookAt, setIsAppLoaded]);

  return (
    <ErrorBoundary>
      <div className="w-full h-svh relative">
        <div
          className={`w-full h-full ${
            showContent ? "opacity-100" : "opacity-0 pointer-events-none"
          } transition-opacity duration-700`}
          style={{ visibility: showContent ? "visible" : "hidden" }}
        >
          <Canvas
            camera={{ position: [0, 3, 8], fov: 50 }}
            dpr={pixelRatio}
            shadows
            style={{ background: "rgb(42 50 60)" }}
            frameloop="always"
            onPointerMissed={() => (document.body.style.cursor = "default")}
            gl={{
              antialias: true,
              powerPreference: "high-performance",
              stencil: false,
              toneMapping: NoToneMapping,
            }}
          >
            <Experience />
            <HandlePerformance />
            <ProgressTracker
              onProgressUpdate={handleProgressUpdate}
              onLoadComplete={handleLoadComplete}
            />
          </Canvas>

          <Interface />
        </div>

        {showLoader && <LoadingOverlay percent={percent} />}
      </div>
    </ErrorBoundary>
  );
}

export default App;
