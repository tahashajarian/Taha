import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { Texture, LinearFilter, LinearMipmapLinearFilter } from "three";
import { useGraphicsSettings } from "../stores/useGraphicsSettings";

export default function WebGLPerformanceManager() {
  const { gl } = useThree();
  const quality = useGraphicsSettings((s) => s.quality);

  const devLog = (...args: any[]) => {
    if (process.env.NODE_ENV !== "production")
      console.log("[WebGLPerf]", ...args);
  };

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
