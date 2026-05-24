import React, { useRef } from "react";
import { useSpring, animated } from "@react-spring/three";
import { useTexture } from "@react-three/drei";

const HAND_SPREAD = 1.3;
const HAND_CLOSE = 0.975;

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

  return (
    <group>
      <animated.mesh position-x={rightX} onClick={animate}>
        <planeGeometry args={[2, 1.5]} />
        <meshBasicMaterial map={godTex} transparent />
      </animated.mesh>

      <animated.mesh position-x={leftX} rotation={[0, 0, 0.2]} onClick={animate}>
        <planeGeometry args={[2, 1.5]} />
        <meshBasicMaterial map={adamTex} transparent />
      </animated.mesh>
    </group>
  );
};

export default React.memo(GodsHand);
