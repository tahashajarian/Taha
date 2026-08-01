/* eslint-disable jsx-a11y/alt-text */
import React, { memo, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGraphicsSettings } from "../stores/useGraphicsSettings";

const CYBER_VARIANT = "brighter";
const CYBER_PRESETS = {
  brighter: {
    colorA: "#34d8ff",
    colorB: "#6a57ff",
    colorC: "#e05dff",
    pulseBase: 0.68,
    pulseAmplitude: 0.42,
    pulseSpeed: 1.9,
    glow: 0.34,
    opacity: 1,
  },
  darker: {
    colorA: "#0ca4d4",
    colorB: "#392bba",
    colorC: "#8a34d2",
    pulseBase: 0.5,
    pulseAmplitude: 0.28,
    pulseSpeed: 1.35,
    glow: 0.18,
    opacity: 0.92,
  },
  disabled: {
    colorA: "#5a5f6d",
    colorB: "#2f3442",
    colorC: "#7a818f",
    pulseBase: 0.24,
    pulseAmplitude: 0,
    pulseSpeed: 0,
    glow: 0.03,
    opacity: 0.4,
  },
};
const ACTIVE_PRESET = CYBER_PRESETS[CYBER_VARIANT] ?? CYBER_PRESETS.brighter;

const portalVertexShader = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const portalFragmentShader = /* glsl */ `
precision highp float;

uniform float uTime;
uniform float uPulse;
uniform float uSeed;
uniform float uGlow;
uniform float uOpacity;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);

  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));

  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p);
    p *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  vec2 uv = vUv * 2.0 - 1.0;
  float radius = length(uv);
  float angle = atan(uv.y, uv.x);
  float t = uTime + uSeed;

  float swirl = sin(angle * 8.0 - t * 1.8 + radius * 12.5);
  float flow = fbm(vec2(angle * 2.6 + t * 0.35, radius * 6.2 - t * 0.75));

  float ring = smoothstep(0.82, 0.52, radius);
  float core = smoothstep(0.35, 0.0, radius);
  float rim = smoothstep(0.95, 0.78, radius) - smoothstep(0.78, 0.65, radius);
  float halo = smoothstep(1.15, 0.72, radius);

  float gradientMix = clamp(0.48 + 0.55 * swirl + flow * 0.4, 0.0, 1.0);
  vec3 gradient = mix(uColorA, uColorB, gradientMix);

  vec3 color = gradient * (ring * (1.18 + 0.35 * flow) + core * (0.45 + 0.45 * uPulse));
  color += rim * uColorC * (1.0 + 0.25 * sin(t * 4.4 + angle * 6.0));
  color += halo * uColorB * uGlow;
  color += uColorC * pow(max(0.0, 1.0 - radius), 3.2) * (0.7 + 0.45 * sin(t * 7.2 + angle * 12.0));

  float alpha = clamp(ring * 0.82 + core * 0.62 + rim * 0.5 + halo * 0.18, 0.0, 1.0);
  alpha *= smoothstep(1.08, 0.08, radius);
  alpha *= uOpacity;

  gl_FragColor = vec4(color, alpha);
}
`;

const PortalShader = memo(({ disabled = false }) => {
  const quality = useGraphicsSettings((s) => s.quality);
  const highQualityStage = useGraphicsSettings((s) => s.highQualityStage);
  const useHighEffects = quality === "high" && highQualityStage >= 2;
  
  const meshRef = useRef(null);
  const materialRef = useRef(null);
  const seed = useMemo(() => Math.random() * 10, []);
  const preset = disabled ? CYBER_PRESETS.disabled : ACTIVE_PRESET;

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPulse: { value: preset.pulseBase },
      uSeed: { value: seed },
      uGlow: { value: preset.glow },
      uOpacity: { value: preset.opacity },
      uColorA: { value: new THREE.Color(preset.colorA) },
      uColorB: { value: new THREE.Color(preset.colorB) },
      uColorC: { value: new THREE.Color(preset.colorC) },
    }),
    [seed, preset],
  );

  useFrame(({ clock }) => {
    // Skip animation on non-high quality
    if (!useHighEffects) return;

    const time = clock.elapsedTime;

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = time;
      
      if (!disabled) {
        materialRef.current.uniforms.uPulse.value =
          preset.pulseBase + Math.sin(time * preset.pulseSpeed + seed) * preset.pulseAmplitude;
      }
    }

    if (meshRef.current && !disabled) {
      meshRef.current.rotation.z = Math.sin(time * 0.65 + seed) * 0.12;
      const scale = 1 + Math.sin(time * 1.2 + seed * 0.7) * 0.055;
      meshRef.current.scale.setScalar(scale);
    }
  });

  // Don't render on non-high quality
  if (!useHighEffects) {
    return null;
  }

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[0.4, 0.4]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={portalVertexShader}
        fragmentShader={portalFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
});

export default PortalShader;
