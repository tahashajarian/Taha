import { Billboard } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState, useEffect, useMemo } from "react";
import * as THREE from "three";

export default function MoveFeedback({
  position = [0, 0, 0],
  texture,        // ✅ texture is now passed as a prop
  duration = 1.5,
  rise = 0.4,
  onFinish,
}) {
  const meshRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);
  const labelGroupRef = useRef(null);
  const startTime = useRef(null);
  const [alive, setAlive] = useState(true);
  const labelTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 256;
    const context = canvas.getContext("2d");
    const label = "SAAAAAC THE QUEEN!";
    let fontSize = 104;
    context.font = `900 ${fontSize}px Arial, sans-serif`;
    const measuredWidth = context.measureText(label).width;
    if (measuredWidth > 930) fontSize *= 930 / measuredWidth;
    context.font = `900 ${fontSize}px Arial, sans-serif`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.lineWidth = 18;
    context.strokeStyle = "#07131d";
    context.strokeText(label, 512, 128);
    context.fillStyle = "#65efff";
    context.fillText(label, 512, 128);
    const canvasTexture = new THREE.CanvasTexture(canvas);
    canvasTexture.colorSpace = THREE.SRGBColorSpace;
    canvasTexture.generateMipmaps = false;
    canvasTexture.minFilter = THREE.LinearFilter;
    return canvasTexture;
  }, []);

  useEffect(() => () => labelTexture.dispose(), [labelTexture]);

  // Reset alive state when texture changes
  useEffect(() => {
    startTime.current = null;
    setAlive(true);
  }, [texture]);

  useFrame(({ clock }) => {
    if (!alive || !meshRef.current) return;

    if (startTime.current === null) startTime.current = clock.elapsedTime;

    const t = (clock.elapsedTime - startTime.current) / duration;

    if (t >= 1) {
      setAlive(false);
      if (onFinish) onFinish();
      return;
    }

    // Fade in -> fade out
    const opacity = t < 0.25 ? t / 0.25 : 1 - (t - 0.25) / 0.75;
    if (meshRef.current.material) meshRef.current.material.opacity = opacity;

    // Quick overshoot gives the move marker a satisfying landing pop.
    const pop = Math.min(1, t / 0.18);
    const scale = 0.55 + pop * 0.55 + Math.sin(pop * Math.PI) * 0.22;
    meshRef.current.scale.setScalar(scale);
    if (ringRef.current) {
      ringRef.current.scale.setScalar(0.7 + Math.min(1, t / 0.35) * 0.8);
      ringRef.current.material.opacity = Math.max(0, 0.7 - t * 0.9);
    }
    if (labelRef.current) {
      const labelPop = Math.min(1, t / 0.22);
      labelRef.current.scale.x = 0.45 + labelPop * 0.55;
      labelRef.current.scale.y = 0.7 + Math.sin(labelPop * Math.PI) * 0.3;
      labelRef.current.material.opacity = Math.min(1, opacity * 1.4);
    }
    if (labelGroupRef.current) {
      labelGroupRef.current.position.y =
        position[1] + 0.2 + rise * 0.12 * Math.max(0, t - 0.25);
    }

    // Update parent Y position (rise effect)
    if (meshRef.current.parent) {
      meshRef.current.parent.position.y =
        position[1] + 0.05 + (rise * 0.12 * Math.max(0, t - 0.25)) / 0.75;
    }
  });

  if (!alive) return null;

  return (
    <>
      <Billboard position={position} lockX={false} lockY={false} lockZ={false}>
        <mesh ref={meshRef}>
          <planeGeometry args={[0.07, 0.07]} />
          <meshBasicMaterial
            map={texture}
            transparent
            opacity={0}
            depthWrite={false}
          />
        </mesh>
        <mesh ref={ringRef} position={[0, 0, -0.002]}>
          <ringGeometry args={[0.038, 0.052, 20]} />
          <meshBasicMaterial
            color="#55eaff"
            transparent
            opacity={0}
            depthWrite={false}
          />
        </mesh>
      </Billboard>
      <group
        ref={labelGroupRef}
        position={[position[0], position[1] + 0.2, position[2]]}
      >
        <Billboard lockX={false} lockY={false} lockZ={false}>
          <mesh ref={labelRef}>
            <planeGeometry args={[0.3, 0.075]} />
            <meshBasicMaterial
              map={labelTexture}
              transparent
              opacity={0}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
        </Billboard>
      </group>
    </>
  );
}
