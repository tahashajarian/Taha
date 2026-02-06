import React, { useRef, useEffect, useMemo } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 50;

export default function Mug(props) {
  const { nodes } = useGLTF("/models/mug.glb", "/draco/");
  const group = useRef();
  const particlesRef = useRef();

  /* ---------------- Particle data (persistent) ---------------- */
  const particlesData = useRef(
    Array.from({ length: PARTICLE_COUNT }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 0.1,
        Math.random() * 0.1,
        (Math.random() - 0.5) * 0.1
      ),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.002,
        0.002 + Math.random() * 0.001,
        (Math.random() - 0.5) * 0.002
      ),
      rotationSpeed: (Math.random() - 0.5) * 0.0005,
      life: Math.random() * 100 + 50,
      opacity: 1,
    }))
  );

  /* ---------------- Geometry (memoized) ---------------- */
  const particleGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(PARTICLE_COUNT * 3), 3)
    );

    geometry.setAttribute(
      "opacity",
      new THREE.BufferAttribute(new Float32Array(PARTICLE_COUNT).fill(1), 1)
    );

    return geometry;
  }, []);

  /* ---------------- Texture (Suspense-safe) ---------------- */
  const particleTexture = useTexture("/textures/smoke.png");

  /* ---------------- Material (memoized) ---------------- */
  const particleMaterial = useMemo(() => {
    return new THREE.PointsMaterial({
      size: 0.1,
      map: particleTexture,
      transparent: true,
      opacity: 0.2,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, [particleTexture]);

  /* ---------------- Initial positions ---------------- */
  useEffect(() => {
    const positions = particleGeometry.attributes.position.array;

    particlesData.current.forEach((p, i) => {
      positions[i * 3] = p.position.x;
      positions[i * 3 + 1] = p.position.y;
      positions[i * 3 + 2] = p.position.z;
    });

    particleGeometry.attributes.position.needsUpdate = true;
  }, [particleGeometry]);

  /* ---------------- Animation ---------------- */
  useFrame(() => {
    const positions = particleGeometry.attributes.position.array;
    const opacities = particleGeometry.attributes.opacity.array;

    particlesData.current.forEach((p, i) => {
      p.position.add(p.velocity);

      const rot = new THREE.Matrix4().makeRotationY(p.rotationSpeed);
      p.velocity.applyMatrix4(rot);

      if (p.position.y > 0.9 || p.life <= 0) {
        p.position.set(
          (Math.random() - 0.5) * 0.1,
          Math.random() * 0.1,
          (Math.random() - 0.5) * 0.1
        );
        p.velocity.set(
          (Math.random() - 0.5) * 0.002,
          0.002 + Math.random() * 0.001,
          (Math.random() - 0.5) * 0.002
        );
        p.life = Math.random() * 100 + 50;
        p.opacity = 1;
      }

      p.opacity = Math.max(0, (0.9 - p.position.y) / 0.9);

      positions[i * 3] = p.position.x;
      positions[i * 3 + 1] = p.position.y;
      positions[i * 3 + 2] = p.position.z;
      opacities[i] = p.opacity;

      p.rotationSpeed += (Math.random() - 0.5) * 0.0002;
      p.life -= 1;
    });

    particleGeometry.attributes.position.needsUpdate = true;
    particleGeometry.attributes.opacity.needsUpdate = true;
  });

  /* ---------------- Render ---------------- */
  return (
    <group
      {...props}
      ref={group}
      dispose={null}
      scale={0.6}
      rotation={[0, Math.PI / 2, 0]}
    >
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Mug.geometry}
        material={nodes.Mug.material}
      />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <circleGeometry args={[0.079, 16]} />
        <meshStandardMaterial color="#6F4F37" />
      </mesh>

      <points
        ref={particlesRef}
        geometry={particleGeometry}
        material={particleMaterial}
      />
    </group>
  );
}

/* ---------------- Preload ---------------- */
useGLTF.preload("/models/mug.glb", "/draco/");