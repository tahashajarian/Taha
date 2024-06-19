import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const Speaker = (props) => {
  const { nodes, materials } = useGLTF("/models/speaker.glb");
  const circleRef = useRef();

  useFrame(({ clock }) => {
    if (circleRef.current) {
      circleRef.current.material.uniforms.time.value = clock.getElapsedTime();
    }
  });

  const shaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    },
    vertexShader: `
      uniform float time;
      varying vec2 vUv;

      void main() {
        vUv = uv;
        vec3 transformed = position;

        // Add wave effect
        float frequency = 2.0; // Adjust the frequency of the waves
        float amplitude = 0.02; // Adjust the amplitude of the waves
        transformed.z += amplitude * sin(position.x * frequency + time);

        gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      varying vec2 vUv;

      void main() {
        vec2 uv = vUv - 0.5; // Center the UV coordinates
        float radius = length(uv); // Compute the distance from the center

        // Add concentric circles
        float rings = 5.0; // Number of rings
        float ringWidth = 0.05; // Width of each ring
        float edge = 0.0;

        for (float i = 0.0; i < rings; i++) {
          float step = ringWidth * (i + 1.0);
          edge += smoothstep(step - ringWidth, step, radius);
        }

        // RGB color gradient effect
        vec3 rgbColor = 0.5 + 0.5 * cos(time + uv.xyx * 2.0 + vec3(0, 2, 4));

        // Mix white center with RGB concentric rings
        vec3 color = mix(vec3(1.0), rgbColor, edge / rings);

        gl_FragColor = vec4(color, 1.0);
      }
    `,
    transparent: true,
  });

  return (
    <group {...props} dispose={null} scale={0.08} rotation={[Math.PI, 0, 0]}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube.geometry}
        material={materials["Material.002"]}
      />
      <mesh
        ref={circleRef}
        castShadow
        receiveShadow
        geometry={nodes.Circle.geometry}
        material={shaderMaterial}
        position={[0, 0, 1.277]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.764}
      />
    </group>
  );
};

useGLTF.preload("/models/speaker.glb");
export default Speaker;
