import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGraphicsSettings } from "../../stores/useGraphicsSettings";

const Keyboard = (props) => {
  const { nodes, materials } = useGLTF("/models/keyboard.glb");
  const quality = useGraphicsSettings((s) => s.quality);

  // Fix material response (VERY IMPORTANT)
  materials.klawisze.metalness = 0.6;
  materials.klawisze.roughness = quality === "high" ? 0.25 : 0.4;
  materials.klawisze.envMapIntensity = quality === "high" ? 1.2 : 0.6;

  return (
    <group {...props} dispose={null}>
      <RGBLight quality={quality} />
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

const RGBLight = ({ quality }) => {
  const lightRefR = useRef(null);
  const lightRefG = useRef(null);
  const lightRefB = useRef(null);

  const intensity = quality === "high" ? 55 : quality === "medium" ? 30 : 15;

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const r = (Math.sin(t * 2) + 1) / 2;
    const g = (Math.sin(t * 2 + Math.PI / 2) + 1) / 2;
    const b = (Math.sin(t * 2 + Math.PI) + 1) / 2;

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
        intensity={intensity}
        color="red"
      />
      <rectAreaLight
        ref={lightRefB}
        position={[0, 0.03, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        width={0.45}
        height={0.04}
        intensity={intensity}
        color="blue"
      />
      <rectAreaLight
        ref={lightRefG}
        position={[0, 0.03, -0.04]}
        rotation={[-Math.PI / 2, 0, 0]}
        width={0.45}
        height={0.02}
        intensity={intensity}
        color="green"
      />
    </group>
  );
};
