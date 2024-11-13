import { useLoader } from "@react-three/fiber";
import React, { useRef } from "react";
import { TextureLoader, RepeatWrapping } from "three";
import { wallHeight, wallSize } from "../../constances/constances";
import { Text } from "@react-three/drei";

const TheWallWallPaper = () => {
  const ref = useRef();
  const texture = useLoader(TextureLoader, "/textures/brick.png");
  const fontURL = "/fonts/Floydian-v177.ttf"; // Replace with the path to your custom font

  // Adjust texture properties
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(3, 2); // Adjust the repeat values as needed

  return (
    <>
      <Text
        font={fontURL}
        rotation={[0, 0, 0]}
        position={[0, 0.2, 0.1]}
        fontSize={0.5}
        color="red"
        textAlign="center"
        fillOpacity={0.8}
      >
        {`Pink

Floyd

The

Wall`}{" "}
      </Text>
      <mesh position={[0, 0, 0]} ref={ref} receiveShadow>
        <planeGeometry args={[wallSize, wallHeight]} />
        <meshBasicMaterial map={texture} transparent opacity={0.2} />
      </mesh>
      <Text
        font={fontURL}
        rotation={[0, 0, 0]}
        position={[-4.5, 1.3, 0.1]}
        fontSize={0.2}
        color="red"
        textAlign="left"
        fillOpacity={1}
      >
        {`
        All alone, or in two,
        
        the wall was too high
        
        as you can see.
        `}
      </Text>
    </>
  );
};

export default TheWallWallPaper;
