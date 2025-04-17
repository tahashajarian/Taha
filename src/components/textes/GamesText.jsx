import { Text } from "@react-three/drei";
import React, { useRef } from "react";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { useAppStatusContext } from "../../contexts/AppStatusContext";
import { wallHeight, wallSize } from "../../constances/constances";

const GamesText = () => {
  // Texture loading optimized with default values
  const textures = useLoader(TextureLoader, [
    "/textures/flappy-bird.png",
    "/textures/game.png",
    "/textures/shotgun.png",
    "/textures/jeton.png",
    "/textures/envelope.png",
    "/textures/github.png",
    "/textures/earth.png",
    "/textures/snake.png",
    "/textures/slot.png",
    "/textures/heart.png"
  ]);

  const [
    flappyBirdTexture,
    gameIcon,
    shotgun,
    jeton,
    envelope,
    github,
    earth,
    snake,
    slot,
    platformer
  ] = textures;

  // Refs organized in a more compact way
  const refs = {
    flappyBird: useRef(),
    gameIcon: useRef(),
    shotgun: useRef(),
    blackJack: useRef(),
    envelope: useRef(),
    github: useRef(),
    earth: useRef(),
    snake: useRef(),
    slot: useRef(),
    platformer: useRef()
  };

  // Configuration constants
  const Y_OFFSET = -0.4;
  const FONT_URL = "/fonts/Roboto-Regular.ttf";
  const MATERIAL_PROPS = { transparent: true };
  
  const items = [
    {
      label: "Platformer",
      link: "https://taha-shajarian.ir/projects/platformer",
      iconRef: refs.platformer,
      texture: platformer,
      margin: -0.05,
      iconSize: 0.2,
      space: 0.75
    },
    {
      label: "Slot Machine",
      link: "https://taha-shajarian.ir/projects/slot-machin",
      iconRef: refs.slot,
      texture: slot,
      margin: 0.1
    },
    {
      label: "Simple Snake",
      link: "https://taha-shajarian.ir/projects/simple-snake",
      iconRef: refs.snake,
      texture: snake,
      margin: 0.1
    },
    {
      label: "Earh",
      link: "https://taha-shajarian.ir/projects/earth",
      iconRef: refs.earth,
      texture: earth,
      margin: -0.3,
      space: 0.5
    },
    {
      label: "Black Jack",
      link: "https://taha-shajarian.ir/projects/blackjack",
      iconRef: refs.blackJack,
      texture: jeton,
      space: 0.8
    },
    {
      label: "War Land",
      link: "https://taha-shajarian.ir/projects/warland",
      iconRef: refs.shotgun,
      texture: shotgun,
      iconSize: 0.4,
      margin: -0.09,
      space: 0.7
    },
    {
      label: "Flappy Bird",
      link: "https://taha-shajarian.ir/projects/flappybird",
      iconRef: refs.flappyBird,
      texture: flappyBirdTexture,
      iconSize: 0.4
    }
  ];

  const { setModalIsOpen } = useAppStatusContext();
  const navigateTo = (address) => window.open(address, "_blank");

  return (
    <group
      position={[0, wallHeight - 0.6, wallSize / 2 - 0.001]}
      rotation={[0, Math.PI, 0]}
    >
      {/* Left Column - Games List */}
      <group position={[-4, 0, 0]}>
        <group>
          <Text
            font={FONT_URL}
            fontSize={0.4}
            maxWidth={wallSize}
            color="silver"
            textAlign="left"
          >
            Game Projects
          </Text>
          <mesh position={[1.75, 0, 0]} ref={refs.gameIcon}>
            <planeGeometry args={[0.5, 0.5]} />
            <meshBasicMaterial map={gameIcon} {...MATERIAL_PROPS} />
          </mesh>
        </group>

        {items.map((item, index) => (
          <group
            key={item.label}
            position={[item.margin ?? 0, -3 - index * Y_OFFSET, 0]}
            onClick={() => navigateTo(item.link)}
          >
            <Text font={FONT_URL} fontSize={0.2} color="silver">
              {item.label}
            </Text>
            <mesh position={[item.space ?? 0.85, 0.033, 0]} ref={item.iconRef}>
              <planeGeometry args={[item.iconSize ?? 0.25, item.iconSize ?? 0.25]} />
              <meshBasicMaterial map={item.texture} {...MATERIAL_PROPS} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Right Column - Contact Links */}
      <group position={[3, -2.8, 0]}>
        <Text
          font={FONT_URL}
          fontSize={0.2}
          color="silver"
          onClick={() => setModalIsOpen(true)}
        >
          Send an Email
        </Text>
        <mesh position={[1, 0.1, 0]} ref={refs.envelope}>
          <planeGeometry args={[0.4, 0.4]} />
          <meshBasicMaterial map={envelope} {...MATERIAL_PROPS} />
        </mesh>
      </group>

      <group position={[2.82, -2.3, 0]}>
        <Text
          font={FONT_URL}
          fontSize={0.2}
          color="silver"
          onClick={() => navigateTo("https://github.com/tahashajarian")}
        >
          My Github
        </Text>
        <mesh position={[0.7, 0.06, 0]} ref={refs.github}>
          <planeGeometry args={[0.3, 0.3]} />
          <meshBasicMaterial map={github} {...MATERIAL_PROPS} />
        </mesh>
      </group>
    </group>
  );
};

export default GamesText;