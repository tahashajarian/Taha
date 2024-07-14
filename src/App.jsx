import React from "react";
import { Canvas } from "@react-three/fiber";
import Experience from "./components/Experience";
import Interface from "./components/Interface";
import { Loader } from "@react-three/drei";
import { useCameraControl } from "./contexts/CameraControlContext";
import { cameraLookAtConst } from "./constances/constances";
import { useAppStatusContext } from "./contexts/AppStatusContext";

// ErrorBoundary component to catch errors
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state to trigger fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service
    console.error("Error caught by boundary:", error, errorInfo);
    // Perform any additional cleanup or actions
    // Optionally, you can refresh the page here:
    // window.location.reload();
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI after error occurs
      return <p>Oops! Something went wrong. Please refresh the page.</p>;
    }

    return this.props.children; // Render children if no error
  }
}

function App() {
  const { setCameraLookAt } = useCameraControl();
  const { setIsAppLoaded } = useAppStatusContext();

  return (
    <ErrorBoundary>
      <div className="w-full h-svh">
        <Canvas
          camera={{ position: [0, 3, 8], fov: 50 }}
          shadows
          style={{
            background: "#00264d",
          }}
          frameloop="demand"
          className=""
          onCreated={({ gl }) => {
            gl.physicallyCorrectLights = true;
            // gl.gammaOutput = true;
            // gl.setClearColor(0xcccccc);
          }}
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
    </ErrorBoundary>
  );
}

export default App;
