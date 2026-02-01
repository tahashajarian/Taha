import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { Texture, LinearFilter, LinearMipmapLinearFilter } from "three";
import { useShallow } from "zustand/react/shallow";
import { useGraphicsSettings } from "../stores/useGraphicsSettings";

export default function WebGLPerformanceManager() {
  const { gl } = useThree();
  const { pixelRatio, quality } = useGraphicsSettings(
    useShallow((s) => ({ quality: s.quality, pixelRatio: s.pixelRatio })),
  );

  const devLog = (...args: any[]) => {
    if (process.env.NODE_ENV !== "production")
      console.log("[WebGLPerf]", ...args);
  };

  // DPR handling
  useEffect(() => {
    if (!gl) return;

    const canvas = gl.domElement;
    gl.setPixelRatio(pixelRatio);
    gl.setSize(canvas.clientWidth, canvas.clientHeight, false);
    canvas.style.imageRendering = pixelRatio < 1 ? "crisp-edges" : "auto";
  }, [gl, pixelRatio]);

  // Texture quality handling
  useEffect(() => {
    if (!gl) return;
    devLog("quality => ", quality);
    const textures: Set<Texture> | undefined = (gl as any)._textures;
    if (!textures) {
      return;
    }

    devLog("Applying texture quality ->", quality);

    textures.forEach((tex) => {
      if (!tex) return;

      const wantMipmaps = quality === "high" || quality === "medium";
      const wantFilter = wantMipmaps ? LinearMipmapLinearFilter : LinearFilter;

      if (tex.generateMipmaps !== wantMipmaps || tex.minFilter !== wantFilter) {
        tex.generateMipmaps = wantMipmaps;
        tex.minFilter = wantFilter;
        tex.needsUpdate = true;
      }
    });
  }, [gl, quality]);

  return null;
}
