import React, { useMemo } from "react";
import WallLibrary from "./WallLibrary";
import Book from "./Book";
import { Text } from "@react-three/drei";

const shelfCount = new Array(3).fill(null); // Initialize array with null values
const bookCount = new Array(18).fill(null); // Initialize array with null values
const fontURL = "/fonts/Floydian-v177.ttf"; // Replace with the path to your custom font

const Library = React.memo(({ position }) => {
  // Memoize the shelves and books to avoid unnecessary re-renders
  const shelves = useMemo(
    () =>
      shelfCount.map((_, indexUp) => (
        <group key={indexUp}>
          <WallLibrary position={[0, 0 - indexUp * 0.5, 0]} />
          {bookCount.map((_, index) => (
            <Book
              key={index}
              position={[0, 0 - indexUp * 0.5 + 0.15, index * 0.08 - 0.7]}
            />
          ))}
        </group>
      )),
    []
  );

  return (
    <group position={position}>
      <Text
        font={fontURL}
        rotation={[0, -Math.PI / 2, 0]}
        position={[-0.2, 0.8, 0]}
        fontSize={0.1}
        color="gray"
        textAlign="center"
      >
       The place that I want to forever be inspired by
      </Text>
      {shelves}
    </group>
  );
});

export default Library;
