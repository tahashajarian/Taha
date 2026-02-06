import { Billboard } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";

export default function MoveFeedback({
  position = [0, 0, 0],
  texture,        // ✅ texture is now passed as a prop
  duration = 1.5,
  rise = 0.4,
  onFinish,
}) {
  const meshRef = useRef(null);
  const startTime = useRef(null);
  const [alive, setAlive] = useState(true);

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

    // Update parent Y position (rise effect)
    if (meshRef.current.parent) {
      meshRef.current.parent.position.y =
        position[1] + 0.1 + (rise * Math.max(0, t - 0.25)) / 0.75;
    }
  });

  if (!alive) return null;

  return (
    <Billboard position={position} lockX={false} lockY={false} lockZ={false}>
      <mesh ref={meshRef}>
        <planeGeometry args={[0.06, 0.06]} />
        <meshBasicMaterial
          map={texture}       // ✅ use the preloaded texture
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>
    </Billboard>
  );
}