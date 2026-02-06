import { Billboard } from "@react-three/drei";
import { useFrame, useLoader } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";

export default function MoveFeedback({
  position = [0, 0, 0],
  texturePath,
  duration = 1.5, // seconds
  rise = 0.4,
  onFinish,
}) {
  const meshRef = useRef(null);
  const startTime = useRef(null);
  const [alive, setAlive] = useState(true);

  // Load texture from path
  const texture = useLoader(THREE.TextureLoader, texturePath);

  // Make sure a fresh startTime is used whenever component mounts
  useEffect(() => {
    startTime.current = null;
    setAlive(true);
  }, [texturePath]);

  useFrame(({ clock }) => {
    if (!alive) return;

    if (startTime.current === null) startTime.current = clock.elapsedTime;

    const t = (clock.elapsedTime - startTime.current) / duration;

    if (t >= 1) {
      setAlive(false);
      if (onFinish) onFinish();
      return;
    }

    // fade in -> fade out
    const opacity = t < 0.25 ? t / 0.25 : 1 - (t - 0.25) / 0.75;
    if (meshRef.current.material) meshRef.current.material.opacity = opacity;

    // **update Billboard Y by moving parent group**
    meshRef.current.parent.position.y =
      position[1] + 0.1 + (rise * Math.max(0, t - 0.25)) / 0.75;
  });

  if (!alive) return null;

  return (
    <Billboard position={position} lockX={false} lockY={false} lockZ={false}>
      <mesh ref={meshRef}>
        <planeGeometry args={[0.06, 0.06]} />
        <meshBasicMaterial
          map={texture}
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>
    </Billboard>
  );
}
