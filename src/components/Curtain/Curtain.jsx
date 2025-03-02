import React, { useMemo, useRef } from "react";
import * as THREE from "three";

const Curtain = ({ primaryColor = "gray", secondaryColor = "silver" }) => {
  const curtainRef = useRef();

  const shaderMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uOpacity: { value: 0.9 },
          uPrimaryColor: { value: new THREE.Color(primaryColor) },
          uSecondaryColor: { value: new THREE.Color(secondaryColor) },
        },
        vertexShader: `
          varying vec2 vUv;
          varying float vWave;

          void main() {
            vUv = uv;
            vec3 pos = position;

            // Only vertical wave effect
            float verticalWave = cos(pos.x * 80.0) * 0.1;
            vWave = verticalWave;

            pos.z += vWave; // Apply only vertical wave deformation
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
            // Gradient color influenced by vertical wave motion
            vec3 gradient = mix(uPrimaryColor, uSecondaryColor, vUv.y + vWave * 10.0);
            gl_FragColor = vec4(gradient, uOpacity);
          }
        `,
        transparent: true,
      }),
    [primaryColor, secondaryColor]
  );

  return (
    <mesh ref={curtainRef} rotation={[0, -Math.PI, 0]}>
      <planeGeometry args={[0.8, 3.4, 32, 64]} />
      <primitive attach="material" object={shaderMaterial} />
    </mesh>
  );
};

export default Curtain;
