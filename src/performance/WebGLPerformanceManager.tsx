import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

export default function WebGLPerformanceManager({
  lowPerformance,
}: {
  lowPerformance: boolean;
}) {
  const { gl, clock, scene, camera } = useThree();

  const handleFocus = () => {
    console.log("performance => App regained focus, ensuring smooth FPS");
    // Restore WebGL internal state
    gl.state.reset();
    // Optionally restart the animation loop (if needed)
    gl.setAnimationLoop(() => {});
  };
  const handleVisibilityChange = () => {
    const webglContext = gl.getContext();
    if (document.hidden) {
      console.log("performance => Pausing rendering (tab hidden)");
      // Pause the render loop when the tab is hidden
      gl.setAnimationLoop(null);
    } else {
      console.log("performance => Resuming rendering (tab active)");
      // Restore internal state and restart clock for smooth animations
      gl.state.reset();
      clock.start();
      // Resume the render loop, rendering the scene with the camera
      gl.setAnimationLoop(() => {
        gl.render(scene, camera);
      });
    }

    // Check if the WebGL context is lost and restore it if so
    if (webglContext?.isContextLost && webglContext.isContextLost()) {
      console.warn("performance => WebGL context lost! Attempting restore...");
      if (gl.forceContextRestore) {
        gl.forceContextRestore();
      }
    }
  };

  useEffect(() => {
    if (lowPerformance) {
      console.log(
        "performance => WebGLPerformanceManager: Low performance detected, reducing quality..."
      );
      handleFocus();
      handleVisibilityChange();
    }
  }, [lowPerformance]);
  useEffect(() => {
    handleFocus();
  }, []);

  useEffect(() => {
    // Get the WebGLRenderingContext once when the effect runs

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [gl, clock, scene, camera]);

  return null;
}
