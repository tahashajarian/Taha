import React, { useRef } from "react";
import { wallHeight, wallSize } from "../../constances/constances";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";

const Outside = () => {
  const ref = useRef();
  const texture = useLoader(TextureLoader, "/textures/city2.jpg");

  return (
    <mesh ref={ref} rotation={[0, Math.PI, 0]} position={[0, wallHeight / 2 -0.5, wallSize / 2 + 8]}>
      <planeGeometry args={[25, 12]} />
      <meshStandardMaterial
        map={texture}
        // emissive={0xffffff} // Adds glow effect
        // emissiveIntensity={0.1} // Adjusts the intensity of the glow
        // metalness={0.3} // Adds some shine
        // roughness={0.9} // Makes the surface less rough, increasing shininess
      />
    </mesh>
  );
};

export default Outside;
