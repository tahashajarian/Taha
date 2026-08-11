import React, { useRef, useLayoutEffect, useMemo } from "react";
import * as THREE from "three";
import { extend, useFrame, useLoader } from "@react-three/fiber";
import { FireMaterial } from "./FireShaderMaterial.js";
import { wallSize } from "../../../constances/constances.jsx";
import Fireplace from "../../Stuff/Fireplace.jsx";
import { useGraphicsSettings } from "../../../stores/useGraphicsSettings";

// only call extend once
extend({ FireMaterial });

const LOG_BASE_COLOR = new THREE.Color("red");
const LOG_LOW_COLOR = new THREE.Color("#24130d");
const LOG_HOT_COLOR = new THREE.Color("#ff6a24");
const logColor = new THREE.Color();

export default function FireCube() {
  const flameGroupRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const sparkPointsRef = useRef<THREE.Points>(null);
  const logMaterialsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  const flareRef = useRef(0);
  const liveSparkCountRef = useRef(0);
  const quality = useGraphicsSettings((s) => s.quality);
  const isLowQuality = quality === "low" || quality === "ultra-low";
  const isMedium = quality === "medium";

  // fire colors / emissive strength based on quality
  const fireColor = isLowQuality ? "#24130d" : "red";
  const logBaseColor = isLowQuality ? LOG_LOW_COLOR : LOG_BASE_COLOR;
  const fireEmissive = isLowQuality ? 0 : 1.5;
  const baseLightIntensity = isLowQuality ? 0 : 6;
  const sparkCount = isLowQuality ? 0 : isMedium ? 7 : 10;
  const sparkPositions = useMemo(
    () => new Float32Array(Math.max(sparkCount, 1) * 3),
    [sparkCount],
  );
  const sparks = useMemo(
    () =>
      Array.from({ length: sparkCount }, () => ({
        life: 0,
        velocityX: 0,
        velocityY: 0,
        velocityZ: 0,
      })),
    [sparkCount],
  );

  useLayoutEffect(() => {
    flareRef.current = 0;
    liveSparkCountRef.current = 0;
    flameGroupRef.current?.scale.setScalar(0.8);
    if (flameGroupRef.current) flameGroupRef.current.position.y = 0.8;
    if (lightRef.current) {
      lightRef.current.intensity = baseLightIntensity;
      lightRef.current.distance = 1;
    }
    logMaterialsRef.current.forEach((material) => {
      if (material) {
        material.color.copy(logBaseColor);
        material.emissive.copy(logBaseColor);
        material.emissiveIntensity = fireEmissive;
      }
    });
    if (sparkPointsRef.current) sparkPointsRef.current.visible = false;
  }, [baseLightIntensity, fireEmissive, isLowQuality, logBaseColor]);

  const ignite = (event) => {
    event.stopPropagation();
    if (isLowQuality) return;
    flareRef.current = Math.min(flareRef.current + 1, 1.6);

    sparks.forEach((spark, index) => {
      const offset = index * 3;
      spark.life = 0.45 + Math.random() * 0.45;
      spark.velocityX = (Math.random() - 0.5) * 0.32;
      spark.velocityY = 0.65 + Math.random() * 0.65;
      spark.velocityZ = (Math.random() - 0.5) * 0.32;
      sparkPositions[offset] = (Math.random() - 0.5) * 0.22;
      sparkPositions[offset + 1] = 0;
      sparkPositions[offset + 2] = (Math.random() - 0.5) * 0.22;
    });
    liveSparkCountRef.current = sparkCount;

    if (sparkPointsRef.current) sparkPointsRef.current.visible = sparkCount > 0;
  };

  useFrame((_, delta) => {
    if (isLowQuality) return;
    const flare = flareRef.current;
    if (flare === 0 && liveSparkCountRef.current === 0) return;
    let updatedSparks = false;

    if (flare > 0.001) {
      flareRef.current = flare * Math.exp(-3.6 * delta);
      const flameGroup = flameGroupRef.current;
      if (flameGroup) {
        const scaleY = 0.8 + flare * 0.22;
        flameGroup.scale.set(0.8 + flare * 0.025, scaleY, 0.8 + flare * 0.025);
        // The shader box is centred. Lift it by the growth amount so its
        // lower edge stays planted on the logs and the flare grows upward.
        flameGroup.position.y = 0.8 + (scaleY - 0.8);
      }
      logColor
        .copy(logBaseColor)
        .lerp(LOG_HOT_COLOR, Math.min(flare * 0.28, 0.28));
      logMaterialsRef.current.forEach((material) => {
        if (material) {
          material.color.copy(logColor);
          material.emissive.copy(logColor);
          material.emissiveIntensity = fireEmissive * (1 + flare * 0.55);
        }
      });
    } else if (flare !== 0) {
      flareRef.current = 0;
      flameGroupRef.current?.scale.setScalar(0.8);
      if (flameGroupRef.current) flameGroupRef.current.position.y = 0.8;
      if (lightRef.current) {
        lightRef.current.intensity = baseLightIntensity;
        lightRef.current.distance = 1;
      }
      logMaterialsRef.current.forEach((material) => {
        if (material) {
          material.color.copy(logBaseColor);
          material.emissive.copy(logBaseColor);
          material.emissiveIntensity = fireEmissive;
        }
      });
    }

    sparks.forEach((spark, index) => {
      if (spark.life <= 0) return;
      updatedSparks = true;
      spark.life -= delta;
      const offset = index * 3;
      sparkPositions[offset] += spark.velocityX * delta;
      sparkPositions[offset + 1] += spark.velocityY * delta;
      sparkPositions[offset + 2] += spark.velocityZ * delta;
      spark.velocityY -= 0.45 * delta;
      if (spark.life <= 0) {
        sparkPositions[offset + 1] = -10;
        liveSparkCountRef.current = Math.max(
          0,
          liveSparkCountRef.current - 1,
        );
      }
    });

    const points = sparkPointsRef.current;
    if (points && updatedSparks) {
      const position = points.geometry.attributes.position;
      position.needsUpdate = true;
    }
    if (points?.visible && liveSparkCountRef.current === 0) {
      points.visible = false;
    }
  });

  return (
    <group position={[-wallSize / 2 + 0.7, 0, wallSize / 2 - 2]}>
      <Fireplace />
      <group position={[0.2, 0.2, 0]}>
        {/* Three small cheap cylinders — scale emissive by quality */}
        <mesh position={[0, 0, -0.1]} rotation={[Math.PI / 3, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.5, 3]} />
          <meshStandardMaterial
            ref={(material) => {
              if (material) logMaterialsRef.current[0] = material;
            }}
            color={fireColor}
            emissive={fireColor}
            emissiveIntensity={fireEmissive}
          />
        </mesh>

        <mesh position={[0, 0, 0.1]} rotation={[-Math.PI / 3, 0, Math.PI / 3]}>
          <cylinderGeometry args={[0.05, 0.05, 0.5, 3]} />
          <meshStandardMaterial
            ref={(material) => {
              if (material) logMaterialsRef.current[1] = material;
            }}
            color={fireColor}
            emissive={fireColor}
            emissiveIntensity={fireEmissive}
          />
        </mesh>

        <mesh position={[0.2, 0, 0]} rotation={[-0, 0, Math.PI / 3]}>
          <cylinderGeometry args={[0.05, 0.05, 0.5, 3]} />
          <meshStandardMaterial
            ref={(material) => {
              if (material) logMaterialsRef.current[2] = material;
            }}
            color={fireColor}
            emissive={fireColor}
            emissiveIntensity={fireEmissive}
          />
        </mesh>

        {/* pointLight: expensive only on higher quality */}
        <pointLight
          ref={lightRef}
          distance={1}
          decay={1}
          position={[0, 0.5, 0]}
          color={"#ffaaaa"}
          intensity={baseLightIntensity} // off on ultra-low
          castShadow={false}
        />
      </group>

      <group
        ref={flameGroupRef}
        position={[0, 0.8, 0]}
        scale={0.8}
        onPointerDown={ignite}
      >
        {/* keep passing a visible color for the shader; the mesh will be hidden internally on ultra-low */}
        <Fire
          scale={4}
          color={0xffaa88}
          isUltraLow={isLowQuality}
          isMedium={isMedium}
          interactionStrengthRef={flareRef}
        />
        <mesh>
          <boxGeometry args={[0.75, 1.15, 0.75]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
        <points ref={sparkPointsRef} visible={false} frustumCulled={false}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[sparkPositions, 3]}
              usage={THREE.DynamicDrawUsage}
            />
          </bufferGeometry>
          <pointsMaterial
            color="#ffb347"
            size={0.045}
            transparent
            opacity={0.9}
            depthWrite={false}
            sizeAttenuation
          />
        </points>
      </group>
    </group>
  );
}

/* FIRE MESH */
function Fire({
  color = 0xeeeeee,
  isUltraLow = false,
  isMedium = false,
  interactionStrengthRef,
  ...props
}) {
  const ref = useRef<THREE.Mesh>(null);
  const renderedLastFrameRef = useRef(true);
  const lastInteractionStrengthRef = useRef(0);
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
    const wasRendered = renderedLastFrameRef.current;
    renderedLastFrameRef.current = false;
    const mesh = ref.current;
    if (!mesh) return;
    const mat = mesh.material as THREE.ShaderMaterial;
    if (!mat || !mat.uniforms) return;

    // If ultra-low, do nothing (we hid mesh above)
    if (isUltraLow || !wasRendered) return;

    const interactionStrength = interactionStrengthRef?.current || 0;
    if (interactionStrength > 0 || lastInteractionStrengthRef.current > 0) {
      mat.uniforms.color.value
        .copy(colorThree)
        .multiplyScalar(1 + interactionStrength * 0.55);
      lastInteractionStrengthRef.current = interactionStrength;
    }

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
    <mesh
      ref={ref}
      {...props}
      scale={new THREE.Vector3(1.2, 2, 1.2)}
      position={[0, 0, 0]}
      onBeforeRender={() => { renderedLastFrameRef.current = true; }}
    >
      <boxGeometry args={[1, 1, 1]} />
      {/* your custom shader material (from extend) */}
      <fireMaterial transparent={!isUltraLow} opacity={1} side={THREE.DoubleSide} />
    </mesh>
  );
}
