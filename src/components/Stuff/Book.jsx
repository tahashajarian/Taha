import React from "react";
import { randomColor } from './../../constances/constances';

const Book = ({ position, rotation = [0, 0, 0] }) => {
  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={[0.25, 0.3 - Math.random() * 0.05, 0.05]} />
      <meshStandardMaterial color={randomColor()} />
    </mesh>
  );
};

export default Book;
