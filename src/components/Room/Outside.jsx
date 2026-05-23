import React, { useRef } from "react";
import { wallHeight, wallSize } from "../../constances/constances";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import Birds from "../Stuff/Birds";
import { useGraphicsSettings } from "../../stores/useGraphicsSettings";

const Outside = () => {
  const ref = useRef();
  const texture = useLoader(TextureLoader, "/textures/city2.jpg");
  const quality = useGraphicsSettings((s) => s.quality);

  const isLowQuality = quality === "low" || quality === "ultra-low";
  return (
    <group>
      <mesh
        ref={ref}
        rotation={[0, Math.PI, 0]}
        position={[0, wallHeight / 2 - 0.5, wallSize / 2 + 8]}
      >
        <planeGeometry args={[25, 12]} />
        <meshStandardMaterial
          map={texture}
          color={"white"}
          emissive={"white"}
          emissiveIntensity={0.1}
          // toneMapped={false}
        />
      </mesh>
      {!isLowQuality && <Birds />}
    </group>
  );
};

export default Outside;
