import React, { useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import Experience from "./components/Experience";
import Interface from "./components/UI/Interface";
import { useCameraControl } from "./contexts/CameraControlContext";
import { cameraLookAtConst } from "./constances/constances";
import { useAppStatusContext } from "./contexts/AppStatusContext";
import ErrorBoundary from "./components/ErrorBoundary";
import HandlePerformance from "./performance/HandlePerformance";
import { sRGBEncoding, NoToneMapping, LoadingManager, Color } from 'three'
import ProgressTracker from "./components/Loader/ProgressTracker";
import LoadingOverlay from "./components/Loader/LoadingOverlay";
import { useLoadingManager } from "./components/Loader/useLoadingManager";

// Create a custom loading manager to track all assets
const loadingManager = new LoadingManager();

function App() {
  const { setCameraLookAt } = useCameraControl();
  const { setIsAppLoaded } = useAppStatusContext();
  const {
    loaded,
    percent,
    showLoader,
    showContent,
    handleProgressUpdate,
    handleLoadComplete
  } = useLoadingManager();

  // Configure the loading manager
  useEffect(() => {
    let totalItems = 0;
    let loadedItems = 0;

    loadingManager.onStart = (url, itemsLoaded, itemsTotal) => {
      totalItems = itemsTotal;
      loadedItems = itemsLoaded;
    };

    loadingManager.onLoad = () => {
      // Individual item loaded
      loadedItems++;
      const progress = Math.min(95, (loadedItems / totalItems) * 100);
      handleProgressUpdate(Math.round(progress));
    };

    loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
      const progress = Math.min(95, (itemsLoaded / itemsTotal) * 100);
      handleProgressUpdate(Math.round(progress));
    };

    loadingManager.onError = (url) => {
      console.error('Error loading', url);
    };
  }, [handleProgressUpdate]);

  useEffect(() => {
    if (loaded) {
      setCameraLookAt(cameraLookAtConst);
      setIsAppLoaded(true);
    }
  }, [loaded, setCameraLookAt, setIsAppLoaded]);

  return (
    <ErrorBoundary>
      <div className="w-full h-svh relative">
        {/* Main content - hidden until loading is complete */}
        <div 
          className={`w-full h-full ${showContent ? 'opacity-100' : 'opacity-0 pointer-events-none'} transition-opacity duration-700`}
          style={{ visibility: showContent ? 'visible' : 'hidden' }}
        >
          <Canvas
            camera={{ position: [0, 3, 8], fov: 50 }}
            shadows
            style={{ background: "rgb(42 50 60)" }}
            frameloop={loaded ? "demand" : "always"}
            dpr={[1, 2]}
            onCreated={({ gl, scene }) => {
              gl.physicallyCorrectLights = true;
              // Set the custom loading manager
              gl.setPixelRatio(window.devicePixelRatio);
              scene.background = new Color(0x2a323c);
            }}
            onPointerMissed={() => (document.body.style.cursor = "default")}
            gl={{
              antialias: true,
              powerPreference: "high-performance",
              stencil: false,
              outputEncoding: sRGBEncoding,
              toneMapping: NoToneMapping
            }}
          >
            <Experience loadingManager={loadingManager} />
            <HandlePerformance />
            <ProgressTracker
              onProgressUpdate={handleProgressUpdate} 
              onLoadComplete={handleLoadComplete}
            />
          </Canvas>

          <Interface />
        </div>

        {/* Loading overlay */}
        {showLoader && <LoadingOverlay percent={percent} />}
      </div>
    </ErrorBoundary>
  );
}

export default App;