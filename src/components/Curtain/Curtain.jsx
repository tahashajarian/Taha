import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useSpring, a } from "@react-spring/three";
import { useAppStatusStore } from "../../stores/useAppStatusStore";

const Curtain = ({ primaryColor = "gray", secondaryColor = "silver" }) => {
  const curtainRef = useRef();
  const curtainOpen = useAppStatusStore((s) => s.curtainOpen);
  const setCurtainOpen = useAppStatusStore((s) => s.setCurtainOpen);

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

            float verticalWave = cos(pos.x * 80.0) * 0.1;
            vWave = verticalWave;

            pos.z += vWave;
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
            vec3 gradient = mix(uPrimaryColor, uSecondaryColor, vUv.y + vWave * 10.0);
            gl_FragColor = vec4(gradient, uOpacity);
          }
        `,
        transparent: true,
      }),
    [primaryColor, secondaryColor]
  );

  const { scale, position } = useSpring({
    scale: curtainOpen ? [5, 1, 1] : [0.4, 1, 1], // 0.8 * 5 = 4
    position: curtainOpen ? [1.75, 0, 0] : [-0.1, 0, 0],
    config: { tension: 170, friction: 26 },
  });

  return (
    <a.mesh
      ref={curtainRef}
      rotation={[0, -Math.PI, 0]}
      scale={scale}
      position={position}
      onClick={() => setCurtainOpen(!curtainOpen)}
    >
      <planeGeometry args={[0.8, 3.4, 32, 64]} />
      <primitive attach="material" object={shaderMaterial} />
    </a.mesh>
  );
};

export default Curtain;
