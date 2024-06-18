import { Text } from "@react-three/drei";
import React from "react";
import { wallHeight, wallSize } from "../Walls";

const GamesText = () => {
  return (
    <group
      position={[0, wallHeight - 0.6, wallSize / 2 - 0.1]}
      rotation={[0, Math.PI, 0]}
    >
      <Text
        fontSize={0.4} // Adjust font size as needed
        maxWidth={wallSize} // Ensure text doesn't exceed wall width
        color="black" // Text color
        textAlign="center" // Text alignment
      >
       Game Projects
      </Text>
    </group>
  );
};

export default GamesText;
