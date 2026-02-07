import React from "react";
import WallLibrary from "./WallLibrary";
import Book from "./Book";
import { Text } from "@react-three/drei";

const Library = ({ position }) => (
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
            />
          ))}
        </group>
      );
    })}
  </group>
);

export default Library;
