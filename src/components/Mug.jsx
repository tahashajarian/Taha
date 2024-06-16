import React, { useRef, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Mug = (props) => {
  const { nodes } = useGLTF("/models/mug.glb");
  const group = useRef();
  const particlesRef = useRef();
  const particleCount = 200; // Increase particle count for denser effect

  // Create particle data
  const particlesData = useRef(
    Array.from({ length: particleCount }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 0.1, // Random initial x position within a smaller range
        Math.random() * 0.1, // Random initial y position closer to the mug
        (Math.random() - 0.5) * 0.1 // Random initial z position within a smaller range
      ),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.002, // Slower horizontal speed
        0.002 + Math.random() * 0.001, // Slower upward speed
        (Math.random() - 0.5) * 0.002 // Slower horizontal speed
      ),
      rotationSpeed: (Math.random() - 0.5) * 0.0005, // Random rotation speed
      life: Math.random() * 100 + 50 // Random lifespan between 50 to 150 frames
    }))
  );

  // Particle geometry and material
  const particleGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const opacities = new Float32Array(particleCount).fill(1.0);

  particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  particleGeometry.setAttribute("opacity", new THREE.BufferAttribute(opacities, 1));

  const particleMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.02, // Slightly larger particle size
    transparent: true,
    opacity: 0.1, // Lower opacity for more realistic appearance
    depthWrite: false,
    blending: THREE.AdditiveBlending // Additive blending for a more natural look
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
      // Update position
      data.position.add(data.velocity);

      // Apply rotation
      const rotationMatrix = new THREE.Matrix4().makeRotationY(data.rotationSpeed);
      data.velocity.applyMatrix4(rotationMatrix);

      // Reset particle position and velocity if it goes too far from the mug or lifespan ends
      if (data.position.y > 0.9 || data.life <= 0) {
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
        data.life = Math.random() * 100 + 50; // Reset random lifespan between 50 to 150 frames
      }

      // Update positions and opacities
      positions[i * 3] = data.position.x;
      positions[i * 3 + 1] = data.position.y;
      positions[i * 3 + 2] = data.position.z;
      opacities[i] = Math.max(0, (data.position.y - 0.1) / 0.2); // Fade out particles as they rise

      // Update rotation speed
      data.rotationSpeed += (Math.random() - 0.5) * 0.0002; // Random variation in rotation speed
      data.life -= 1; // Decrease lifespan
    });

    particleGeometry.attributes.position.needsUpdate = true;
    particleGeometry.attributes.opacity.needsUpdate = true;
  });

  return (
    <group {...props} dispose={null} scale={0.6} rotation={[0, Math.PI / 2, 0]} ref={group}>
      <mesh geometry={nodes.Mug.geometry} material={nodes.Mug.material} />
      <points ref={particlesRef} geometry={particleGeometry} material={particleMaterial} />
    </group>
  );
};

useGLTF.preload("/models/mug.glb");

export default Mug;
