import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Curtain = ({ primaryColor = 'gray', secondaryColor = 'silver' }) => {
  const curtainRef = useRef();

  const shaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uOpacity: { value: 0.9 },
      uPrimaryColor: { value: new THREE.Color(primaryColor) },
      uSecondaryColor: { value: new THREE.Color(secondaryColor) },
    },
    vertexShader: `
      uniform float uTime;
      varying vec2 vUv;
      varying float vWave;

      void main() {
        vUv = uv;
        vec3 pos = position;

        // Combine sin and cos waves
        float sinWave = sin(pos.x * 40.0 + uTime) * 0.1;
        float cosWave = cos(pos.y * 20.0 + uTime) * 0.05; // Subtle cos wave
        vWave = sinWave + cosWave;

        pos.z += vWave; // Apply combined wave motion
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uOpacity;
      uniform vec3 uPrimaryColor;
      uniform vec3 uSecondaryColor;
      varying vec2 vUv;
      varying float vWave;

      void main() {
        // Gradient color influenced by wave motion and UV mapping
        vec3 gradient = mix(uPrimaryColor, uSecondaryColor, vUv.y + vWave * 10.0);
        gl_FragColor = vec4(gradient, uOpacity);
      }
    `,
    transparent: true,
  });

  useFrame(({ clock }) => {
    if (curtainRef.current) {
      curtainRef.current.material.uniforms.uTime.value = clock.elapsedTime / 2;
    }
  });

  return (
    <mesh ref={curtainRef} rotation={[0, -Math.PI, 0]}>
      <planeBufferGeometry attach="geometry" args={[0.8, 3.4, 32, 64]} />
      <primitive attach="material" object={shaderMaterial} />
    </mesh>
  );
};

export default Curtain;
