import React from "react";
import WallLibrary from "./WallLibrary";
import Book from "./Book";

const shelfCount = new Array(3).fill(null); // Initialize array with null values
const bookCount = new Array(18).fill(null); // Initialize array with null values

const Library = ({ position }) => (
  <group position={position}>
    {shelfCount.map((_, indexUp) => (
      <group key={indexUp}>
        <WallLibrary position={[0, 0 - indexUp * 0.5, 0]} />
        {bookCount.map((_, index) => (
          <Book key={index} position={[0, (0 - indexUp * 0.5) + 0.15, index * 0.08 - 0.7]} />
        ))}
      </group>
    ))}
  </group>
);

export default Library;
