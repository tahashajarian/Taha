import React, { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import Experience from "./components/Experience";
import Interface from "./components/UI/Interface";
import { useProgress } from "@react-three/drei";
import { useCameraControl } from "./contexts/CameraControlContext";
import { cameraLookAtConst } from "./constances/constances";
import { useAppStatusContext } from "./contexts/AppStatusContext";
import ErrorBoundary from "./components/ErrorBoundary";
import HandlePerformance from "./performance/HandlePerformance";
import { sRGBEncoding, NoToneMapping, LoadingManager, Color } from 'three'

// Create a custom loading manager to track all assets
const loadingManager = new LoadingManager();
let totalItems = 0;
let loadedItems = 0;

// Create a component that will be inside the Canvas to track progress
function ProgressTracker({ onProgressUpdate, onLoadComplete }) {
  const { progress, active } = useProgress();
  const lastProgress = useRef(0);
  
  useEffect(() => {
    // Update progress from drei's useProgress
    if (progress > lastProgress.current) {
      lastProgress.current = progress;
      onProgressUpdate(progress);
    }
    
    if (progress === 100 && !active) {
      // Ensure we're really at 100%
      setTimeout(() => {
        onLoadComplete();
      }, 500);
    }
  }, [progress, active, onProgressUpdate, onLoadComplete]);
  
  return null;
}

function App() {
  const { setCameraLookAt } = useCameraControl();
  const { setIsAppLoaded } = useAppStatusContext();
  const [loaded, setLoaded] = useState(false);
  const [percent, setPercent] = useState(0);
  const [showLoader, setShowLoader] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const progressInterval = useRef(null);

  // Configure the loading manager
  useEffect(() => {
    loadingManager.onStart = (url, itemsLoaded, itemsTotal) => {
      totalItems = itemsTotal;
      loadedItems = itemsLoaded;
    };

    loadingManager.onLoad = () => {
      // Individual item loaded
      loadedItems++;
      const progress = Math.min(95, (loadedItems / totalItems) * 100);
      setPercent(Math.round(progress));
    };

    loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
      const progress = Math.min(95, (itemsLoaded / itemsTotal) * 100);
      setPercent(Math.round(progress));
    };

    loadingManager.onError = (url) => {
      console.error('Error loading', url);
    };

    // Fallback progress indicator for cases where loading manager doesn't report
    if (percent < 10) {
      progressInterval.current = setInterval(() => {
        setPercent(prev => {
          const newPercent = Math.min(95, prev + 1);
          return newPercent;
        });
      }, 300);
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, []);

  useEffect(() => {
    if (percent === 100 && !loaded) {
      // Clear the fallback interval
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
      
      setCameraLookAt(cameraLookAtConst);
      setIsAppLoaded(true);
      setLoaded(true);
      
      // Hide loader after a short delay to allow smooth transition
      setTimeout(() => {
        setShowLoader(false);
        // Show content after loader is hidden
        setTimeout(() => {
          setShowContent(true);
        }, 100);
      }, 800);
    }
  }, [percent, loaded, setCameraLookAt, setIsAppLoaded]);

  const handleProgressUpdate = (progress) => {
    // Clear the fallback interval if we're getting real progress updates
    if (progress > 10 && progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
    
    // Ensure we don't go backwards in progress
    setPercent(prev => Math.max(prev, Math.round(progress)));
  };

  const handleLoadComplete = () => {
    // Set to 100% when loading is complete
    setPercent(100);
  };

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

        {/* Loading overlay - shown until everything is loaded */}
        {showLoader && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 z-50 transition-opacity duration-500">
            <div className="text-center w-80">
              <h2 className="text-2xl font-bold text-white mb-6">Loading Experience</h2>
              
              {/* Progress bar */}
              <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden mb-4">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ease-out"
                  style={{ width: `${percent}%` }}
                ></div>
              </div>
              
              {/* Percentage indicator */}
              <p className="text-white text-xl font-semibold mb-2">
                {percent}%
              </p>
              
              {/* Loading details */}
              <div className="text-gray-300 text-sm">
                {percent < 100 ? (
                  <>
                    Loading
                    <span className="inline-block animate-bounce delay-100">.</span>
                    <span className="inline-block animate-bounce delay-200">.</span>
                    <span className="inline-block animate-bounce delay-300">.</span>
                  </>
                ) : (
                  "Finalizing..."
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;