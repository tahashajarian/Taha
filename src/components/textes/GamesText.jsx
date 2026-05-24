import { Text } from "@react-three/drei";
import React, { useCallback, useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { wallHeight, wallSize } from "../../constances/constances";
import { useAppStatusStore } from "../../stores/useAppStatusStore";
import PortalShader from "../../shaders/PortalShader";

const FONT_URL = "/fonts/Roboto-Regular.ttf";
const Y_OFFSET = -0.4;
const DEFAULT_ICON_SIZE = 0.25;
const DEFAULT_ICON_SPACE = 0.85;
const PORTAL_COLUMN_X = -0.8;

const TEXTURE_PATHS = [
  "/textures/flappy-bird.png",
  "/textures/game.png",
  "/textures/shotgun.png",
  "/textures/jeton.png",
  "/textures/envelope.png",
  "/textures/github.png",
  "/textures/earth.png",
  "/textures/snake.png",
  "/textures/slot.png",
  "/textures/platformer.png",
];

export default function GamesText() {
  const textures = useLoader(TextureLoader, TEXTURE_PATHS);

  const textureMap = useMemo(
    () => ({
      flappy: textures[0],
      game: textures[1],
      shotgun: textures[2],
      jeton: textures[3],
      envelope: textures[4],
      github: textures[5],
      earth: textures[6],
      snake: textures[7],
      slot: textures[8],
      platformer: textures[9],
    }),
    [textures],
  );

  const items = useMemo(
    () => [
      {
        label: "Platformer",
        link: "https://taha-shajarian.ir/projects/platformer",
        texture: textureMap.platformer,
        margin: -0.06,
        iconSize: 0.3,
        space: 0.75,
      },
      {
        label: "Slot Machine",
        link: "https://taha-shajarian.ir/projects/slot-machin",
        texture: textureMap.slot,
        margin: 0.06,

      },
      {
        label: "Simple Snake",
        link: "",
        texture: textureMap.snake,
        margin: 0.06,

      },
      {
        label: "Earth",
        link: "https://taha-shajarian.ir/projects/earth",
        texture: textureMap.earth,
        margin: -0.3,
        space: 0.5,
      },
      {
        label: "Black Jack",
        link: "https://taha-shajarian.ir/projects/blackjack",
        texture: textureMap.jeton,
        space: 0.8,
        margin: -0.05,

      },
      {
        label: "War Land",
        link: "https://taha-shajarian.ir/projects/warland",
        texture: textureMap.shotgun,
        iconSize: 0.4,
        margin: -0.09,
        space: 0.7,
      },
      {
        label: "Flappy Bird",
        link: "https://taha-shajarian.ir/projects/flappybird",
        texture: textureMap.flappy,
        iconSize: 0.4,
      },
    ],
    [textureMap],
  );

  const setModalIsOpen = useAppStatusStore((s) => s.setModalIsOpen);
  const navigateTo = useCallback(
    (url) => url && window.open(url, "_blank"),
    [],
  );
  const openModal = useCallback(() => setModalIsOpen(true), [setModalIsOpen]);

  return (
    <group
      position={[0, wallHeight - 0.6, wallSize / 2 - 0.001]}
      rotation={[0, Math.PI, 0]}
    >
      <group position={[-4, 0, 0]}>
        <group>
          <Text
            font={FONT_URL}
            fontSize={0.4}
            maxWidth={wallSize}
            color="silver"
          >
            Game Projects
          </Text>
          <mesh position={[1.75, 0, 0]}>
            <planeGeometry args={[0.5, 0.5]} />
            <meshBasicMaterial map={textureMap.game} transparent />
          </mesh>
        </group>

        {items.map((item, i) => {
          const hasLink = Boolean(item.link);
          return (
            <group
              key={item.label}
              position={[0, -3 - i * Y_OFFSET, 0]}
              onClick={hasLink ? () => navigateTo(item.link) : undefined}
            >
            <group position={[PORTAL_COLUMN_X, 0, 0]}>
              <PortalShader disabled={!hasLink} />
            </group>

            <group position={[item.margin ?? 0, 0, 0]}>
              <Text
                font={FONT_URL}
                fontSize={0.2}
                color={hasLink ? "silver" : "#7f8592"}
              >
                {item.label}
              </Text>
              <mesh position={[item.space ?? DEFAULT_ICON_SPACE, 0.033, 0]}>
                <planeGeometry
                  args={[
                    item.iconSize ?? DEFAULT_ICON_SIZE,
                    item.iconSize ?? DEFAULT_ICON_SIZE,
                  ]}
                />
                <meshBasicMaterial map={item.texture} transparent />
              </mesh>
            </group>
            </group>
          );
        })}
      </group>

      <group position={[3, -2.8, 0]}>
        <Text font={FONT_URL} fontSize={0.2} color="silver" onClick={openModal}>
          Send an Email
        </Text>
        <mesh position={[1, 0.1, 0]}>
          <planeGeometry args={[0.4, 0.4]} />
          <meshBasicMaterial map={textureMap.envelope} transparent />
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
        <mesh position={[0.7, 0.06, 0]}>
          <planeGeometry args={[0.3, 0.3]} />
          <meshBasicMaterial map={textureMap.github} transparent />
        </mesh>
      </group>
    </group>
  );
}
