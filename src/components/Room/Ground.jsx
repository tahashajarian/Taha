import React, { useEffect, useMemo } from "react";
import { wallSize } from "../../constances/constances";
import { RepeatWrapping } from "three";
import { useTexture } from "@react-three/drei";
import { useAppStatusStore } from "../../stores/useAppStatusStore";

const FLOOR_TEXTURE_URL =
  "/textures/Poliigon_SlateFloorTile_7657/1K/Poliigon_SlateFloorTile_7657_BaseColor.jpg";

useTexture.preload(FLOOR_TEXTURE_URL);

const TexturedFloor = () => {
  const isApploaded = useAppStatusStore((s) => s.isApploaded);
  const mapTexture = useTexture(FLOOR_TEXTURE_URL);

  const map = useMemo(() => {
    const texture = mapTexture.clone();
    texture.wrapS = texture.wrapT = RepeatWrapping;
    texture.repeat.set(8, 8);
    texture.needsUpdate = true;
    return texture;
  }, [mapTexture]);

  useEffect(() => {
    return () => {
      map.dispose();
    };
  }, [map]);

  return (
    <mesh
      receiveShadow
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
    >
      <planeGeometry args={[wallSize, wallSize]} />
      {isApploaded ? (
        <meshStandardMaterial map={map} color={0xffffff} />
      ) : (
        <meshStandardMaterial color="gray" />
      )}
    </mesh>
  );
};
export default TexturedFloor;
