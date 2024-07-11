import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { Color, ShaderMaterial } from 'three';

const TailwindIcon = (props) => {
  const { nodes } = useGLTF('/models/Tailwind.glb');

  const gradientMaterial = useRef(null);

  // Define a custom shader material with gradient effect
  const gradientShader = {
    uniforms: {
      color1: { value: new Color('#06B6D4') }, // Start color of gradient
      color2: { value: new Color('#48BB78') }, // End color of gradient
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 color1;
      uniform vec3 color2;
      varying vec2 vUv;
      void main() {
        gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
      }
    `,
  };

  // Assign the shader material to the icon's mesh
  gradientMaterial.current = new ShaderMaterial({
    uniforms: gradientShader.uniforms,
    vertexShader: gradientShader.vertexShader,
    fragmentShader: gradientShader.fragmentShader,
  });

  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Curve.geometry}
        material={gradientMaterial.current}
        scale={12}
      />
    </group>
  );
};

useGLTF.preload('/models/Tailwind.glb');

export default TailwindIcon;
