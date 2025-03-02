import { Text } from "@react-three/drei";
import React, { useRef } from "react";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { useAppStatusContext } from "../../contexts/AppStatusContext";
import { wallHeight, wallSize } from "../../constances/constances";

const GamesText = () => {
  // Load textures using TextureLoader
  const flappyBirdTexture = useLoader(
    TextureLoader,
    "/textures/flappy-bird.png"
  );
  const gameIcon = useLoader(TextureLoader, "/textures/game.png");
  const shotgun = useLoader(TextureLoader, "/textures/shotgun.png");
  const jeton = useLoader(TextureLoader, "/textures/jeton.png");
  const envelope = useLoader(TextureLoader, "/textures/envelope.png");
  const github = useLoader(TextureLoader, "/textures/github.png");
  const earth = useLoader(TextureLoader, "/textures/earth.png");
  const snake = useLoader(TextureLoader, "/textures/snake.png");
  const slot = useLoader(TextureLoader, "/textures/slot.png");
  const platformer = useLoader(TextureLoader, "/textures/heart.png");

  // Reference for plane geometries
  const flappyBirdRef = useRef();
  const gameIconRef = useRef();
  const shotgunRef = useRef();
  const blackJackRef = useRef();
  const envelopeRef = useRef();
  const githubRef = useRef();
  const earthRef = useRef();
  const snakeRef = useRef();
  const slotRef = useRef();
  const platformerRef = useRef();

  const yOffset = -0.4; // Vertical offset between items
  const items = [
    {
      label: "Platformer",
      link: "https://taha-shajarian.ir/projects/platformer",
      iconRef: platformerRef,
      texture: platformer,
      margin: -0.05,
      iconSize: 0.2,
      space: 0.75
    },
    {
      label: "Slot Machine",
      link: "https://taha-shajarian.ir/projects/slot-machin",
      iconRef: slotRef,
      texture: slot,
      margin: 0.1,
    },
    {
      label: "Simple Snake",
      link: "https://taha-shajarian.ir/projects/simple-snake",
      iconRef: snakeRef,
      texture: snake,
      margin: 0.1,
    },
    {
      label: "Earh",
      link: "https://taha-shajarian.ir/projects/earth",
      iconRef: earthRef,
      texture: earth,
      margin: -0.3,
      space: 0.5,
    },
    {
      label: "Black Jack",
      link: "https://taha-shajarian.ir/projects/blackjack",
      iconRef: blackJackRef,
      texture: jeton,
      space: 0.8
    },
    {
      label: "War Land",
      link: "https://taha-shajarian.ir/projects/warland",
      iconRef: shotgunRef,
      texture: shotgun,
      iconSize: 0.4,
      margin: -0.09,
      space: 0.7
    },
    {
      label: "Flappy Bird",
      link: "https://taha-shajarian.ir/projects/flappybird",
      iconRef: flappyBirdRef,
      texture: flappyBirdTexture,
      iconSize: 0.4,
    },
  ];

  const { setModalIsOpen } = useAppStatusContext();
  const navigateTo = (address) => {
    window.open(address, "_blank");
  };

  const fontURL = "/fonts/Roboto-Regular.ttf"; // Replace with the path to your custom font

  return (
    <group
      position={[0, wallHeight - 0.6, wallSize / 2 - 0.001]}
      rotation={[0, Math.PI, 0]}
    >
      <group position={[-4, 0, 0]}>
        <Text
          font={fontURL}
          fontSize={0.4}
          maxWidth={wallSize}
          color="silver"
          textAlign="left"
        >
          Game Projects
          <mesh position={[1.75, 0, 0]} ref={gameIconRef}>
            <planeGeometry args={[0.5, 0.5]} />
            <meshBasicMaterial map={gameIcon} transparent={true} />
          </mesh>
        </Text>
        {items.map((item, index) => (
          <Text
            key={index}
            font={fontURL}
            position={[
              item.margin ? item.margin : 0,
              -3 - index * yOffset,
              0,
            ]} // Dynamically calculated position
            fontSize={0.2}
            color="silver"
            textAlign="left"
            onClick={() => navigateTo(item.link)}
          >
            {item.label}
            <mesh
              position={[item.space ? item.space : 0.85, 0.033, 0]}
              ref={item.iconRef}
            >
              <planeGeometry
                args={[
                  item.iconSize ? item.iconSize : 0.25,
                  item.iconSize ? item.iconSize : 0.25,
                ]}
              />
              <meshBasicMaterial map={item.texture} transparent />
            </mesh>
          </Text>
        ))}
      </group>
      ;
      <Text
        font={fontURL}
        position={[3, -2.8, 0]}
        fontSize={0.2}
        color="silver"
        textAlign="center"
        onClick={() => {
          setModalIsOpen(true);
        }}
      >
        Send an Email
        <mesh position={[1, 0.1, 0]} ref={envelopeRef}>
          <planeGeometry args={[0.4, 0.4]} />
          <meshBasicMaterial map={envelope} transparent />
        </mesh>
      </Text>
      <Text
        font={fontURL}
        position={[2.82, -2.3, 0]}
        fontSize={0.2}
        color="silver"
        textAlign="center"
        onClick={() => {
          navigateTo("https://github.com/tahashajarian");
        }}
      >
        My Github
        <mesh position={[0.7, 0.06, 0]} ref={githubRef}>
          <planeGeometry args={[0.3, 0.3]} />
          <meshBasicMaterial map={github} transparent />
        </mesh>
      </Text>
    </group>
  );
};

export default GamesText;
