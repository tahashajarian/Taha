import React, { useMemo } from "react";
import WallLibrary from "./WallLibrary";
import Book from "./Book";
import { Text } from "@react-three/drei";
import { wallSize } from "../../constances/constances";

const ROOM_MARGIN = 0.35;
const BOOK_COUNT = 54;
const MIN_LANDING_SPACING = 0.32;
const SOFA_BOUNDS = {
  minX: 2,
  maxX: 5,
  minZ: -6.05,
  maxZ: -4.05,
};

const createLandingTargets = (libraryPosition) => {
  let seed = 481516;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  const targets = [];

  for (let index = 0; index < BOOK_COUNT; index += 1) {
    let selected = null;
    let bestDistance = -1;

    for (let attempt = 0; attempt < 80; attempt += 1) {
      const candidate = [
        -(0.55 + random() * 2.7),
        -2.3555 + random() * 0.018,
        -1.6 + random() * 3.2,
      ];
      const worldX = candidate[0] + libraryPosition[0];
      const worldZ = candidate[2] + libraryPosition[2];
      if (
        worldX >= SOFA_BOUNDS.minX &&
        worldX <= SOFA_BOUNDS.maxX &&
        worldZ >= SOFA_BOUNDS.minZ &&
        worldZ <= SOFA_BOUNDS.maxZ
      ) {
        continue;
      }
      let nearestDistance = Infinity;
      for (let targetIndex = 0; targetIndex < targets.length; targetIndex += 1) {
        const deltaX = candidate[0] - targets[targetIndex][0];
        const deltaZ = candidate[2] - targets[targetIndex][2];
        nearestDistance = Math.min(
          nearestDistance,
          Math.hypot(deltaX, deltaZ),
        );
      }

      if (nearestDistance > bestDistance) {
        selected = candidate;
        bestDistance = nearestDistance;
      }
      if (nearestDistance >= MIN_LANDING_SPACING) break;
    }

    targets.push(selected);
  }

  return targets;
};

const Library = ({ position }) => {
  const roomLimit = wallSize / 2 - ROOM_MARGIN;
  const dropBounds = [
    -roomLimit - position[0],
    roomLimit - position[0],
    -roomLimit - position[2],
    roomLimit - position[2],
  ];
  const landingTargets = useMemo(
    () => createLandingTargets(position),
    [position[0], position[1], position[2]],
  );
  return (
    <group position={position}>
      <Text
        font="/fonts/Floydian-v177.ttf"
        rotation={[0, -Math.PI / 2, 0]}
        position={[-0.2, 0.8, 0]}
        fontSize={0.1}
        color="gray"
        textAlign="center"
      >
        The place that I want to forever be inspired by
      </Text>

      <LibraryDecor />

      {[...Array(3)].map((_, row) => {
        const yPos = -row * 0.5;
        return (
          <group key={row}>
            <WallLibrary position={[0, yPos, 0]} />
            {[...Array(18)].map((_, col) => (
              <Book
                key={row * 18 + col}
                id={String(row * 18 + col)}
                position={[0, yPos + 0.17, col * 0.08 - 0.7]}
                dropBounds={dropBounds}
                plannedDropPosition={landingTargets[row * 18 + col]}
              />
            ))}
          </group>
        );
      })}
    </group>
  );
};

const LibraryDecor = () => (
  <group>
    <group position={[-0.08, 0.1, -0.86]} rotation={[0, -Math.PI / 2, 0]}>
      <mesh castShadow>
        <boxGeometry args={[0.2, 0.12, 0.1]} />
        <meshStandardMaterial color="#34231d" roughness={0.62} />
      </mesh>
      <mesh position={[0, 0.025, 0.057]}>
        <circleGeometry args={[0.038, 16]} />
        <meshStandardMaterial color="#a87832" metalness={0.55} roughness={0.35} />
      </mesh>
      <mesh position={[0.07, 0.09, 0]}>
        <boxGeometry args={[0.035, 0.07, 0.035]} />
        <meshStandardMaterial color="#46332b" />
      </mesh>
    </group>

    <group position={[-0.08, -0.425, -0.86]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.075, 0.1, 0.08, 14]} />
        <meshStandardMaterial color="#2c4d46" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.12, 0]} castShadow>
        <sphereGeometry args={[0.075, 16, 10]} />
        <meshStandardMaterial color="#b18b66" roughness={0.92} />
      </mesh>
      <mesh position={[0, 0.2, 0]} scale={[0.75, 1, 0.72]} castShadow>
        <sphereGeometry args={[0.055, 14, 9]} />
        <meshStandardMaterial color="#b18b66" roughness={0.92} />
      </mesh>
    </group>
  </group>
);

export default Library;
