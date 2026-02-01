import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useGraphicsSettings } from "../../stores/useGraphicsSettings";

const Keyboard = (props) => {
  const { nodes, materials } = useGLTF("/models/keyboard.glb");
  const quality = useGraphicsSettings((s) => s.quality);

  // Only change material for non-high qualities.
  // High quality must remain exactly as the original.
  if (materials && materials.klawisze && quality !== "high") {
    materials.klawisze.metalness = 0.6;
    materials.klawisze.roughness = quality === "medium" ? 0.4 : 0.5;
    materials.klawisze.envMapIntensity = quality === "medium" ? 0.8 : 0.4;
  }

  return (
    <group {...props} dispose={null}>
      {quality === "high" && <RGBLightHigh />}
      {quality === "medium" && <RGBLightMedium />}
      {(quality === "low" || quality === "ultra-low") && (
        <RGBLightLow isUltraLow={quality === "ultra-low"} />
      )}

      <mesh
        castShadow={quality === "high"}
        receiveShadow={quality !== "low"}
        geometry={nodes.Cube.geometry}
        material={materials.klawisze}
        rotation={[0, Math.PI / 2, 0]}
      />
    </group>
  );
};

useGLTF.preload("/models/keyboard.glb");
export default Keyboard;

/* ---------- RGB Light Variants ---------- */

/* EXACT original behavior — untouched for HIGH */
const RGBLightHigh = () => {
  const lightRefR = useRef(null);
  const lightRefG = useRef(null);
  const lightRefB = useRef(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const r = (Math.sin(time * 2) + 1) / 2;
    const g = (Math.sin(time * 2 + Math.PI / 2) + 1) / 2;
    const b = (Math.sin(time * 2 + Math.PI) + 1) / 2;

    lightRefR.current?.color.setRGB(r, 0, 0);
    lightRefG.current?.color.setRGB(0, g, 0);
    lightRefB.current?.color.setRGB(0, 0, b);
  });

  return (
    <group>
      <rectAreaLight
        ref={lightRefR}
        position={[0, 0.03, 0.04]}
        rotation={[-Math.PI / 2, 0, 0]}
        width={0.45}
        height={0.02}
        intensity={50}
        color="red"
        power={0.5}
      />
      <rectAreaLight
        ref={lightRefB}
        position={[0, 0.03, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        width={0.45}
        height={0.04}
        intensity={50}
        color="blue"
        power={0.5}
      />
      <rectAreaLight
        ref={lightRefG}
        position={[0, 0.03, -0.04]}
        rotation={[-Math.PI / 2, 0, 0]}
        width={0.45}
        height={0.02}
        intensity={50}
        color="green"
        power={0.5}
      />
    </group>
  );
};

/* Medium: single cheaper rectAreaLight with slower color shift */
const RGBLightMedium = () => {
  const lightRef = useRef(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * 0.6; // slower
    // smooth hue rotation
    if (lightRef.current) {
      lightRef.current.color.setHSL((t * 0.15) % 1, 1, 0.5);
    }
  });

  return (
    <rectAreaLight
      ref={lightRef}
      position={[0, 0.03, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      width={0.45}
      height={0.05}
      intensity={30}
      // medium keeps physical light behavior but cheaper
    />
  );
};

/* Low / Ultra-low: very cheap. Ultra-low can disable entirely by setting intensity 0 */
const RGBLightLow = ({ isUltraLow = false }) => {
  // ultra-low => invisible / off
  const intensity = isUltraLow ? 0 : 8;

  return (
    <rectAreaLight
      position={[0, 0.03, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      width={0.4}
      height={0.05}
      intensity={intensity}
      color="white"
    />
  );
};
