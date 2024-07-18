import React, { useState, useEffect } from "react";

const Book = ({ position }) => {
  const bookColors = [
    "#8B4513", // SaddleBrown
    "#A0522D", // Sienna
    "#D2B48C", // Tan
    "#F4A460", // SandyBrown
    "#CD853F", // Peru
    "#DEB887", // BurlyWood
    "#BC8F8F", // RosyBrown
    "#F5DEB3", // Wheat
    "#DAA520", // GoldenRod
    "#808080", // Gray
    "#556B2F", // DarkOliveGreen
    "#8B0000", // DarkRed
  ];

  const randomColor = () => bookColors[Math.floor(Math.random() * bookColors.length)];

  const [color, setColor] = useState(randomColor);

  useEffect(() => {
    setColor(randomColor());
  }, []);

  return (
    <mesh position={position}>
      <boxGeometry args={[0.25, 0.3, 0.05]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

export default Book;
