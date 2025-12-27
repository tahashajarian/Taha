import { useLoader } from "@react-three/fiber";
import { useSpring, animated } from "@react-spring/three";
import React, { useRef } from "react";
import { TextureLoader } from "three";

const GodsHand = () => {
  const adamHandTex = useLoader(TextureLoader, "/textures/adam-hand.png");
  const godHandTex = useLoader(TextureLoader, "/textures/god-hand.png");

  const isAnimating = useRef(false);

  const [{ leftX, rightX }, api] = useSpring(() => ({
    leftX: -1.3,
    rightX: 1.3,
  }));

  const handleClick = () => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    api.start({
      leftX: -0.975,
      rightX: 0.975,
      config: {
        tension: 60,
        friction: 80,
      },
      onRest: () => {
        api.start({
          leftX: -1.3,
          rightX: 1.3,
          config: {
            tension: 60,
            friction: 50,
          },
          onRest: () => {
            isAnimating.current = false;
          },
        });
      },
    });
  };

  return (
    <group>
      {/* God hand */}
      <animated.mesh position-x={rightX} onClick={handleClick}>
        <planeGeometry args={[2, 1.5]} />
        <meshBasicMaterial map={godHandTex} transparent />
      </animated.mesh>

      {/* Adam hand */}
      <animated.mesh
        position-x={leftX}
        rotation={[0, 0, 0.2]}
        onClick={handleClick}
      >
        <planeGeometry args={[2, 1.5]} />
        <meshBasicMaterial map={adamHandTex} transparent />
      </animated.mesh>
    </group>
  );
};

export default GodsHand;
