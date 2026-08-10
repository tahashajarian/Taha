import React, { useEffect, useRef } from "react";
import { wallHeight, wallSize } from "../../constances/constances";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { SRGBColorSpace, TextureLoader } from "three";
import Birds from "../Stuff/Birds";
import { useGraphicsSettings } from "../../stores/useGraphicsSettings";

const Outside = () => {
  const ref = useRef();
  const texture = useLoader(TextureLoader, "/textures/city-skyline.jpg");
  const gl = useThree((state) => state.gl);
  const quality = useGraphicsSettings((s) => s.quality);

  const isLowQuality = quality === "low" || quality === "ultra-low";

  useEffect(() => {
    texture.colorSpace = SRGBColorSpace;
    texture.anisotropy = Math.min(4, gl.capabilities.getMaxAnisotropy());
    texture.needsUpdate = true;
  }, [gl, texture]);

  useFrame((state) => {
    if (!ref.current || isLowQuality) return;
    ref.current.position.x = Math.sin(state.clock.elapsedTime * 0.04) * 0.12;
  });

  return (
    <group>
      <mesh
        ref={ref}
        rotation={[0, Math.PI, 0]}
        position={[0, wallHeight / 2 + 0.5, wallSize / 2 + 8]}
      >
        <planeGeometry args={[26, 14.625]} />
        <meshBasicMaterial
          map={texture}
          toneMapped={false}
        />
      </mesh>
      {!isLowQuality && <Birds />}
    </group>
  );
};

export default Outside;
