import React, { useRef, useLayoutEffect, useMemo } from "react";
import * as THREE from "three";
import { extend, useFrame, useLoader } from "@react-three/fiber";
import { FireMaterial } from "./FireShaderMaterial.js";
import { wallSize } from "../../../constances/constances.jsx";
import Fireplace from "../../Stuff/Fireplace.jsx";
import { useGraphicsSettings } from "../../../stores/useGraphicsSettings"; // adjust path if needed

// only call extend once
extend({ FireMaterial });

export default function FireCube() {
  const quality = useGraphicsSettings((s) => s.quality);
  const isLowQuality = quality === "low" || quality === "ultra-low";
  const isUltraLow = quality === "ultra-low";
  const isMedium = quality === "medium";

  // fire colors / emissive strength based on quality
  const fireColor = isUltraLow ? "black" : "red";
  const fireEmissive = isUltraLow ? 0 : isLowQuality ? 0.6 : 1.5;

  return (
    <group position={[-wallSize / 2 + 0.7, 0, wallSize / 2 - 2]}>
      <Fireplace />
      <group position={[0.2, 0.2, 0]}>
        {/* Two small cheap cylinders — scale emissive by quality */}
        <mesh position={[0, 0, -0.1]} rotation={[Math.PI / 3, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.5, 3]} />
          <meshStandardMaterial
            color={fireColor}
            emissive={fireColor}
            emissiveIntensity={fireEmissive}
          />
        </mesh>

        <mesh position={[0, 0, 0.1]} rotation={[-Math.PI / 3, 0, Math.PI / 3]}>
          <cylinderGeometry args={[0.05, 0.05, 0.5, 3]} />
          <meshStandardMaterial
            color={fireColor}
            emissive={fireColor}
            emissiveIntensity={fireEmissive}
          />
        </mesh>

        <mesh position={[0.2, 0, 0]} rotation={[-0, 0, Math.PI / 3]}>
          <cylinderGeometry args={[0.05, 0.05, 0.5, 3]} />
          <meshStandardMaterial
            color={fireColor}
            emissive={fireColor}
            emissiveIntensity={fireEmissive}
          />
        </mesh>

        {/* pointLight: expensive only on higher quality */}
        <pointLight
          distance={1}
          decay={1}
          power={10}
          position={[0, 0.5, 0]}
          color={"#ffaaaa"}
          intensity={isUltraLow ? 0 : isLowQuality ? 0.8 : 6} // off on ultra-low
          castShadow={!isLowQuality} // avoid point-shadow cost on low
        />
      </group>

      <group position={[0, 0.8, 0]} scale={0.8}>
        {/* keep passing a visible color for the shader; the mesh will be hidden internally on ultra-low */}
        <Fire scale={4} color={0xffaa88} isUltraLow={isUltraLow} isMedium={isMedium} />
      </group>
    </group>
  );
}

/* FIRE MESH */
function Fire({ color = 0xeeeeee, isUltraLow = false, isMedium = false, ...props }) {
  const ref = useRef<THREE.Mesh>(null);
  const texture = useLoader(THREE.TextureLoader, "/textures/fire.png");

  // convert color to THREE.Color once
  const colorThree = useMemo(() => new THREE.Color(color), [color]);

  // cheap texture tuning (no mipmaps, low anisotropy) — reduces sampling cost
  useLayoutEffect(() => {
    if (!texture) return;
    texture.generateMipmaps = false;
    texture.anisotropy = 1;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.needsUpdate = true;
  }, [texture]);

  // initialize uniforms only once / when mesh available
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;

    const mat = mesh.material as THREE.ShaderMaterial;
    if (!mat || !mat.uniforms) return;

    mat.uniforms.fireTex.value = texture;
    mat.uniforms.color.value = colorThree;
    mat.uniforms.invModelMatrix.value = new THREE.Matrix4();
    mat.uniforms.scale.value = new THREE.Vector3(1, 1, 1);
    mat.uniforms.seed.value = Math.random() * 19.19;
    mat.uniforms.time.value = 0;

    // On ultra-low we skip drawing the shader mesh entirely (hide it)
    mesh.visible = !isUltraLow;
  }, [texture, colorThree, isUltraLow]);

  // animation loop: skip or throttle based on quality
  useFrame((state, delta) => {
    const mesh = ref.current;
    if (!mesh) return;
    const mat = mesh.material as THREE.ShaderMaterial;
    if (!mat || !mat.uniforms) return;

    // If ultra-low, do nothing (we hid mesh above)
    if (isUltraLow) return;

    // If medium, advance time slower to reduce work
    if (isMedium) {
      mat.uniforms.time.value += delta * 0.5;
    } else {
      // high-quality (and defaults): use actual elapsed time for smoothness
      mat.uniforms.time.value = state.clock.elapsedTime;
    }

    // Update invModelMatrix only when visible (and not ultra-low)
    mesh.updateMatrixWorld();
    const invModelMatrix = mat.uniforms.invModelMatrix.value;
    invModelMatrix.copy(mesh.matrixWorld).invert();

    // keep scale uniform updated if needed
    mat.uniforms.scale.value = mesh.scale;
  });

  return (
    <mesh ref={ref} {...props} scale={new THREE.Vector3(1.2, 2, 1.2)} position={[0, 0, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      {/* your custom shader material (from extend) */}
      <fireMaterial transparent={!isUltraLow} opacity={1} side={THREE.DoubleSide} />
    </mesh>
  );
}
