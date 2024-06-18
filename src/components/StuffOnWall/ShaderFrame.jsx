import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const GradientShaderMaterial = () => {
  const shaderMaterialRef = useRef();

  useFrame(({ clock }) => {
    if (shaderMaterialRef.current) {
      shaderMaterialRef.current.uniforms.u_time.value = clock.getElapsedTime();
    }
  });

  return (
    <shaderMaterial
    ref={shaderMaterialRef}
    attach="material"
    uniforms={{
      u_time: { value: 0.0 },
      u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    }}
    vertexShader={`
      void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `}
    fragmentShader={`
      uniform float u_time;
      uniform vec2 u_resolution;

      float random (in vec2 st) {
        return fract(sin(dot(st.xy,
                             vec2(12.9898,78.233)))*
                     43758.5453123);
      }

      float noise (in vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);

        // Smooth interpolation
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));

        vec2 u = f * f * (3.0 - 2.0 * f);

        return mix(a, b, u.x) +
               (c - a) * u.y * (1.0 - u.x) +
               (d - b) * u.x * u.y;
      }

      void main() {
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        vec3 color = vec3(0.0);

        // Use sine and cosine functions to create pulsating color effect
        color.r = 0.5 + 0.5 * sin(u_time + st.x * 10.0) * cos(u_time + st.y * 10.0);
        color.g = 0.5 + 0.5 * cos(u_time + st.y * 5.0) * sin(u_time + st.x * 5.0);
        color.b = 0.5 + 0.5 * sin(u_time * 2.0 + st.x + st.y) * cos(u_time * 2.0 + st.x - st.y);

        // Adding noise to color
        float noisy = noise(st * 20.0);
        color += noisy * 0.2;

        gl_FragColor = vec4(color, 1.0);
      }
    `}
  />
  );
};

const Frame = ({ width, height, thickness }) => {
  const frameWidth = width + thickness * 2;
  const frameHeight = height + thickness * 2;

  return (
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[frameWidth, frameHeight, thickness]} />
      <meshBasicMaterial color="black" />
    </mesh>
  );
};

const Picture = ({ width, height }) => {
  return (
    <mesh position={[0, 0, 0.1]}>
      <planeGeometry args={[width, height]} />
      <GradientShaderMaterial />
    </mesh>
  );
};

const ShaderFrame = () => {
  const pictureWidth = 2;
  const pictureHeight = 1;
  const frameThickness = 0.1;

  return (
    <group>
      <Frame
        width={pictureWidth}
        height={pictureHeight}
        thickness={frameThickness}
      />
      <Picture width={pictureWidth} height={pictureHeight} />
    </group>
  );
};

export default ShaderFrame;
