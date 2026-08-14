import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import { useSpring, a } from "@react-spring/three";
import { useAppStatusStore } from "../../stores/useAppStatusStore";

const CURTAIN_ART_URL = "/textures/curtain-art-v1.jpg";

useTexture.preload(CURTAIN_ART_URL);

const Curtain = () => {
  const curtainRef = useRef();
  const curtainOpen = useAppStatusStore((s) => s.curtainOpen);
  const setCurtainOpen = useAppStatusStore((s) => s.setCurtainOpen);
  const sourceTexture = useTexture(CURTAIN_ART_URL);
  const artTexture = useMemo(() => {
    const texture = sourceTexture.clone();
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.repeat.set(1, 1);
    texture.offset.set(0, 0);
    texture.needsUpdate = true;
    return texture;
  }, [sourceTexture]);

  const shaderMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uOpacity: { value: 0.8 },
          uArtTexture: { value: artTexture },
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
          uniform sampler2D uArtTexture;
          varying vec2 vUv;
          varying float vWave;

          void main() {
            vec3 artColor = texture2D(uArtTexture, vUv).rgb;
            float foldLight = clamp(0.9 + vWave * 1.25, 0.72, 1.08);
            float foldHighlight = smoothstep(-0.02, 0.1, vWave) * 0.09;
            vec3 shadedColor = artColor * foldLight + vec3(foldHighlight);
            gl_FragColor = vec4(shadedColor, uOpacity);
          }
        `,
        transparent: true,
      }),
    [artTexture]
  );

  useEffect(
    () => () => {
      artTexture.dispose();
      shaderMaterial.dispose();
    },
    [artTexture, shaderMaterial],
  );

  const { scale, position } = useSpring({
    scale: curtainOpen ? [5, 1, 1] : [0.4, 1, 1], // 0.8 * 5 = 4
    position: curtainOpen ? [1.75, 0, 0] : [-0.1, 0, 0],
    config: { tension: 170, friction: 26 },
  });

  const isFrontmostCurtainHit = (event) => {
    let object = event.intersections[0]?.object;
    while (object) {
      if (object === curtainRef.current) return true;
      object = object.parent;
    }
    return false;
  };

  const handleCurtainClick = (event) => {
    if (!isFrontmostCurtainHit(event)) return;
    event.stopPropagation();
    setCurtainOpen(!curtainOpen);
  };

  return (
    <a.mesh
      ref={curtainRef}
      rotation={[0, -Math.PI, 0]}
      scale={scale}
      position={position}
      onClick={handleCurtainClick}
    >
      <planeGeometry args={[0.8, 3.4, 32, 64]} />
      <primitive attach="material" object={shaderMaterial} />
    </a.mesh>
  );
};

export default Curtain;
