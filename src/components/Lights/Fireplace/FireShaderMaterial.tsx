import { extend, ReactThreeFiber } from "@react-three/fiber";
import noiseGlsl from "./noise.glsl"; // Import the GLSL file as raw string

import * as THREE from "three";

export class FireMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      defines: { ITERATIONS: "10", OCTIVES: "3" },
      uniforms: {
        fireTex: { value: null },
        color: { value: null },
        time: { value: 0.0 },
        seed: { value: 0.0 },
        invModelMatrix: { value: null },
        scale: { value: null },
        noiseScale: { value: new THREE.Vector4(1, 2, 1, 0.5) },
        magnitude: { value: 1.5 },
        lacunarity: { value: 2.0 },
        gain: { value: 0.6 },
      },
      vertexShader: `
        varying vec3 vWorldPos;
        void main() {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
        }`,
      fragmentShader: `
        // Simplex Noise (GLSL code adapted)
        ${noiseGlsl} // Include the GLSL noise functions

      
        // Uniforms and varying variables
        uniform vec3 color;
        uniform float time;
        uniform float seed;
        uniform mat4 invModelMatrix;
        uniform vec3 scale;
        uniform vec4 noiseScale;
        uniform float magnitude;
        uniform float lacunarity;
        uniform float gain;
        uniform sampler2D fireTex;
        varying vec3 vWorldPos;
      
        float turbulence(vec3 p) {
          float sum = 0.0;
          float freq = 1.0;
          float amp = 1.0;
          for (int i = 0; i < OCTIVES; i++) {
            sum += abs(snoise(p * freq)) * amp;
            freq *= lacunarity;
            amp *= gain;
          }
          return sum;
        }
      
        vec4 samplerFire(vec3 p, vec4 scale) {
          vec2 st = vec2(sqrt(dot(p.xz, p.xz)), p.y);
          if (st.x <= 0.0 || st.x >= 1.0 || st.y <= 0.0 || st.y >= 1.0) return vec4(0.0);
          p.y -= (seed + time) * scale.w;
          p *= scale.xyz;
          st.y += sqrt(st.y) * magnitude * turbulence(p);
          if (st.y <= 0.0 || st.y >= 1.0) return vec4(0.0);
          return texture2D(fireTex, st);
        }
      
        vec3 localize(vec3 p) {
          return (invModelMatrix * vec4(p, 1.0)).xyz;
        }
      
        void main() {
          vec3 rayPos = vWorldPos;
          vec3 rayDir = normalize(rayPos - cameraPosition);
          float rayLen = 0.0288 * length(scale.xyz);
          vec4 col = vec4(0.0);
          for (int i = 0; i < ITERATIONS; i++) {
            rayPos += rayDir * rayLen;
            vec3 lp = localize(rayPos);
            lp.y += 0.5;
            lp.xz *= 2.0;
            col += samplerFire(lp, noiseScale);
          }
          col.a = col.r;
          gl_FragColor = col;
        }
      `,
    });
  }
}
extend({ FireMaterial });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      fireMaterial: ReactThreeFiber.Object3DNode<
        FireMaterial,
        typeof FireMaterial
      >;
    }
  }
}
extend({ FireMaterial });