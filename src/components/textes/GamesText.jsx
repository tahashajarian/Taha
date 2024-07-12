import { Text } from "@react-three/drei";
import React, { useRef } from "react";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { wallHeight, wallSize } from "../Walls";
import PortalShaderPlane from "../shaders/PortalShaderPlane";
import { useAppStatusContext } from "../../contexts/AppStatusContext";

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

  // Reference for plane geometries
  const flappyBirdRef = useRef();
  const gameIconRef = useRef();
  const shotgunRef = useRef();
  const blackJackRef = useRef();
  const envelopeRef = useRef();

  const { setModalIsOpen } = useAppStatusContext();
  const navigateTo = (address) => {
    window.open(address, "_blank");
  };

  return (
    <group
      position={[0, wallHeight - 0.6, wallSize / 2 - 0.001]}
      rotation={[0, Math.PI, 0]}
    >
      <group position={[-4, 0, 0]}>
        <Text
          fontSize={0.4}
          maxWidth={wallSize}
          color="black"
          textAlign="center"
        >
          Game Projects
          <mesh position={[1.75, -0.04, 0]} ref={gameIconRef}>
            <planeGeometry args={[0.5, 0.5]} />
            <meshBasicMaterial map={gameIcon} transparent={true} />
          </mesh>
        </Text>
        <Text
          position={[0, -0.8, 0]}
          fontSize={0.3}
          color="black"
          textAlign="center"
          onClick={() =>
            navigateTo("https://taha-shajarian.ir/projects/flappybird")
          }
        >
          Flappy Bird
          <mesh position={[1.12, 0, 0]} ref={flappyBirdRef}>
            <planeGeometry args={[0.75, 0.75]} />
            <meshBasicMaterial map={flappyBirdTexture} transparent />
          </mesh>
        </Text>

        <Text
          position={[0, -1.5, 0]}
          fontSize={0.3}
          color="black"
          textAlign="center"
          onClick={() => {
            navigateTo('https://taha-shajarian.ir/projects/warland')
          }}
        >
          War Land
          <mesh position={[1.12, 0, 0]} ref={shotgunRef}>
            <planeGeometry args={[0.75, 0.75]} />
            <meshBasicMaterial map={shotgun} transparent />
          </mesh>
        </Text>

        <Text
          position={[0, -2.2, 0]}
          fontSize={0.3}
          color="black"
          textAlign="center"
          onClick={() => {
            navigateTo("https://taha-shajarian.ir/projects/blackjack");
          }}
        >
          Black Jack
          <mesh position={[1.1, 0, 0]} ref={blackJackRef}>
            <planeGeometry args={[0.5, 0.5]} />
            <meshBasicMaterial map={jeton} transparent />
          </mesh>
        </Text>
      </group>
      <Text
        position={[3, -2.5, 0]}
        fontSize={0.3}
        color="black"
        textAlign="center"
        onClick={() => {
          setModalIsOpen(true);
        }}
      >
        Send an Email
        <mesh position={[1.5, 0.1, 0]} ref={envelopeRef}>
          <planeGeometry args={[0.75, 0.75]} />
          <meshBasicMaterial map={envelope} transparent />
        </mesh>
      </Text>
    </group>
  );
};

export default GamesText;
