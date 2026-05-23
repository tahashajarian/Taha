import React, { useRef, useMemo } from "react";
import { useSpring, animated } from "@react-spring/three";
import { Color, DoubleSide } from "three";
import { useTexture } from "@react-three/drei";

const HAND_SPREAD = 1.3;
const HAND_CLOSE = 0.975;

const BASE_LINE_WIDTH = 0.8;
const BASE_LINE_HEIGHT = 0.12;

const ADAM_HAND_TEXTURE_URL = "/textures/adam-hand.png";
const GOD_HAND_TEXTURE_URL = "/textures/god-hand.png";

useTexture.preload(ADAM_HAND_TEXTURE_URL);
useTexture.preload(GOD_HAND_TEXTURE_URL);

const GodsHand = () => {
  const adamTex = useTexture(ADAM_HAND_TEXTURE_URL);
  const godTex = useTexture(GOD_HAND_TEXTURE_URL);

  const isAnimating = useRef(false);

  const [{ leftX, rightX }, api] = useSpring(() => ({
    leftX: -HAND_SPREAD,
    rightX: HAND_SPREAD,
    config: { tension: 60, friction: 80 },
  }));

  const animate = () => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    api.start({
      leftX: -HAND_CLOSE,
      rightX: HAND_CLOSE,
      onRest: () =>
        api.start({
          leftX: -HAND_SPREAD,
          rightX: HAND_SPREAD,
          config: { friction: 50 },
          onRest: () => (isAnimating.current = false),
        }),
    });
  };

  const centerX = leftX.to([leftX, rightX], (l, r) => (l + r) / 2);
  const scaleX = leftX.to(
    [leftX, rightX],
    (l, r) => Math.max((r - l) / BASE_LINE_WIDTH, 0.001),
  );

  const lineMaterial = useMemo(
    () => ({
      uniforms: {
        color: { value: new Color("#ffffff") },
        thickness: { value: 0.08 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        uniform float thickness;
        varying vec2 vUv;

        void main() {
          float dist = abs(vUv.y - 0.5);
          float alpha = 1.0 - smoothstep(0.0, thickness, dist);
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
    }),
    [],
  );

  return (
    <group>
      <animated.mesh position-x={rightX} onClick={animate}>
        <planeGeometry args={[2, 1.5]} />
        <meshBasicMaterial map={godTex} transparent />
      </animated.mesh>

      <animated.mesh
        position-x={centerX}
        position-y={0.06}
        position-z={-0.05}
        scale-x={scaleX}
        renderOrder={1}
      >
        <planeGeometry args={[BASE_LINE_WIDTH, BASE_LINE_HEIGHT]} />
        <shaderMaterial
          attach="material"
          {...lineMaterial}
          depthWrite={false}
          side={DoubleSide}
        />
      </animated.mesh>

      <animated.mesh position-x={leftX} rotation={[0, 0, 0.2]} onClick={animate}>
        <planeGeometry args={[2, 1.5]} />
        <meshBasicMaterial map={adamTex} transparent />
      </animated.mesh>
    </group>
  );
};

export default React.memo(GodsHand);
