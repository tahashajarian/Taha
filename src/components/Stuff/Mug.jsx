import React, { useRef, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Mug = (props) => {
  const { nodes } = useGLTF("/models/mug.glb", "/draco/");
  const group = useRef();
  const particlesRef = useRef();
  const particleCount = 50;

  // Create particle data
  const particlesData = useRef(
    Array.from({ length: particleCount }, () => ({
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
      size: Math.random() * 0.04 + 0.02, // Random size between 0.02 and 0.06
      opacity: 1.0, // Initial opacity set to 1.0
    }))
  );

  // Particle geometry and material
  const particleGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const opacities = new Float32Array(particleCount).fill(1.0);

  particleGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );
  particleGeometry.setAttribute(
    "opacity",
    new THREE.BufferAttribute(opacities, 1)
  );

  // Load particle texture
  const textureLoader = new THREE.TextureLoader();
  const particleTexture = textureLoader.load("/textures/smoke.png");
  particleTexture.encoding = THREE.sRGBEncoding;
  particleTexture.format = THREE.RGBAFormat;
  particleTexture.type = THREE.UnsignedByteType;

  const particleMaterial = new THREE.PointsMaterial({
    size: 0.1,
    map: particleTexture,
    transparent: true,
    opacity: 0.2, // Initial opacity set to 0.1 for fade-in effect
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  useEffect(() => {
    particlesData.current.forEach((data, i) => {
      positions[i * 3] = data.position.x;
      positions[i * 3 + 1] = data.position.y;
      positions[i * 3 + 2] = data.position.z;
    });

    particleGeometry.attributes.position.needsUpdate = true;
  }, []);

  useFrame(() => {
    particlesData.current.forEach((data, i) => {
      data.position.add(data.velocity);

      const rotationMatrix = new THREE.Matrix4().makeRotationY(
        data.rotationSpeed
      );
      data.velocity.applyMatrix4(rotationMatrix);

      if (data.position.y > 0.9 || data.life <= 0) {
        // Reset particle properties
        data.position.set(
          (Math.random() - 0.5) * 0.1,
          Math.random() * 0.1,
          (Math.random() - 0.5) * 0.1
        );
        data.velocity.set(
          (Math.random() - 0.5) * 0.002,
          0.002 + Math.random() * 0.001,
          (Math.random() - 0.5) * 0.002
        );
        data.life = Math.random() * 100 + 50;
        data.opacity = 1.0; // Reset opacity
      }

      // Update opacity based on particle's vertical position
      data.opacity = Math.max(0, (0.9 - data.position.y) / 0.9); // Fade out as it reaches 0.9

      positions[i * 3] = data.position.x;
      positions[i * 3 + 1] = data.position.y;
      positions[i * 3 + 2] = data.position.z;
      opacities[i] = data.opacity;

      data.rotationSpeed += (Math.random() - 0.5) * 0.0002;
      data.life -= 1;
    });

    particleGeometry.attributes.position.needsUpdate = true;
    particleGeometry.attributes.opacity.needsUpdate = true;
  });

  return (
    <group
      {...props}
      dispose={null}
      scale={0.6}
      rotation={[0, Math.PI / 2, 0]}
      ref={group}
    >
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Mug.geometry}
        material={nodes.Mug.material}
      />
      <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, 0.05, 0]}>
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
};

useGLTF.preload("/models/mug.glb", "/draco/");

export default Mug;

