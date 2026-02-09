import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

const createTextTexture = (text) => {
  const canvas = document.createElement("canvas");
  canvas.width = 128; // larger for better resolution
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "100px sans-serif";
  ctx.fillStyle = "#88f";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  return new THREE.CanvasTexture(canvas);
};

const SnoreParticles = ({ count = 3 }) => {
  const groupRef = useRef();
  const texture = useMemo(() => createTextTexture("Z"), []);

  // Particle state stored in a ref
  const particlesRef = useRef(
    new Array(count).fill().map(() => ({
      position: new THREE.Vector3(
        Math.random() * 0.2 - 0.1,
        0,
        Math.random() * 0.2 - 0.1
      ),
      speed: 0.003 + Math.random() * 0.002,
      life: 0,
      opacity: 0,
      sprite: null, // will store sprite ref
    }))
  );

  useFrame((_, delta) => {
    particlesRef.current.forEach((p) => {
      p.position.y += p.speed;
      p.life += delta;

      // Fade in/out
      if (p.life < 0.5) p.opacity = p.life * 2;
      else if (p.life > 0.8) p.opacity = Math.max(1 - (p.life - 0.8) * 0.6, 0);

      // Reset particle
      if (p.life > 3) {
        p.position.set(Math.random() * 0.2 - 0.1, 0, Math.random() * 0.2 - 0.1);
        p.life = 0;
        p.opacity = 0;
      }

      if (p.sprite) {
        p.sprite.position.copy(p.position);
        p.sprite.material.opacity = p.opacity;
      }
    });
  });

  return (
    <group ref={groupRef} position={[0.1, 0.15, 0]}>
      {particlesRef.current.map((p, i) => (
        <sprite
          key={i}
          ref={(el) => (p.sprite = el)}
          scale={[0.1, 0.1, 0.1]}
        >
          <spriteMaterial
            map={texture}
            transparent
            depthWrite={false}
          />
        </sprite>
      ))}
    </group>
  );
};

export default SnoreParticles;