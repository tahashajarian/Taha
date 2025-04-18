import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { WebGLRenderer, Texture } from "three";
// Overriding R3F's Render Loop: Manually setting gl.setAnimationLoop interferes with R3F's optimized rendering, causing duplicate renders
export default function WebGLPerformanceManager({
  lowPerformance,
}: {
  lowPerformance: boolean;
}) {
  const { gl } = useThree();
  const originalSettings = useRef({
    pixelRatio: gl.getPixelRatio(),
    anisotropy: Texture.DEFAULT_ANISOTROPY,
  });

  // Handle performance adjustments
  useEffect(() => {
    const canvas = gl.domElement;

    if (lowPerformance) {
      // Save original settings
      originalSettings.current = {
        pixelRatio: gl.getPixelRatio(),
        anisotropy: Texture.DEFAULT_ANISOTROPY,
      };

      // Apply performance optimizations
      gl.setPixelRatio(1);
      Texture.DEFAULT_ANISOTROPY = 1;
      canvas.style.imageRendering = "crisp-edges";
      canvas.setAttribute('data-performance-mode', 'low');
    } else {
      // Restore original settings
      gl.setPixelRatio(originalSettings.current.pixelRatio);
      Texture.DEFAULT_ANISOTROPY = originalSettings.current.anisotropy;
      canvas.style.imageRendering = "auto";
      canvas.removeAttribute('data-performance-mode');
    }

    // Cleanup on unmount
    return () => {
      gl.setPixelRatio(originalSettings.current.pixelRatio);
      Texture.DEFAULT_ANISOTROPY = originalSettings.current.anisotropy;
      canvas.style.imageRendering = "auto";
      canvas.removeAttribute('data-performance-mode');
    };
  }, [lowPerformance, gl]);

  return null;
}