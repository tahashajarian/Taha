import React, { useMemo, useEffect } from "react";
import { RepeatWrapping } from "three";
import { wallHeight, wallSize } from "../../constances/constances";
import { Text, useTexture } from "@react-three/drei";

const BRICK_TEXTURE_URL = "/textures/brick.png";

useTexture.preload(BRICK_TEXTURE_URL);

const TheWallWallPaper = () => {
  const fontURL = "/fonts/Floydian-v177.ttf";
  const mapTexture = useTexture(BRICK_TEXTURE_URL);

  const texture = useMemo(() => {
    const next = mapTexture.clone();
    next.wrapS = RepeatWrapping;
    next.wrapT = RepeatWrapping;
    next.repeat.set(3, 2);
    next.needsUpdate = true;
    return next;
  }, [mapTexture]);

  useEffect(() => {
    return () => {
      texture.dispose();
    };
  }, [texture]);

  return (
    <>
      <Text
        font={fontURL}
        rotation={[0, 0, 0]}
        position={[0, 0.2, 0.05]}
        fontSize={0.5}
        color="red"
        textAlign="center"
        fillOpacity={0.8}
      >
        {`Pink

Floyd

The

Wall`}
      </Text>

      <mesh position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[wallSize, wallHeight]} />
        <meshBasicMaterial map={texture} transparent opacity={0.2} />
      </mesh>

      <Text
        font={fontURL}
        rotation={[0, 0, 0]}
        position={[-4, 1.3, 0.1]}
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

export default React.memo(TheWallWallPaper);
