import React, { useState, useEffect, useRef } from "react";
import { wallSize } from "../../constances/constances";
import { TextureLoader, RepeatWrapping } from "three";
import { useAppStatusContext } from "../../contexts/AppStatusContext";

const TexturedFloor = () => {
  const [textures, setTextures] = useState(null);
  const meshRef = useRef();
  const { isApploaded } = useAppStatusContext();

  useEffect(() => {
    const loader = new TextureLoader();
    const loadTextures = async () => {
      try {
        const map = await loader.loadAsync(
          "/textures/Poliigon_SlateFloorTile_7657/1K/Poliigon_SlateFloorTile_7657_BaseColor.jpg"
        );

        [map].forEach((texture) => {
          texture.wrapS = texture.wrapT = RepeatWrapping;
          texture.repeat.set(8, 8);
        });

        setTextures({ map });
      } catch (error) {
        console.error("Error loading textures:", error);
      }
    };
    if (isApploaded) {
      loadTextures();
    }
  }, [isApploaded]);

  useEffect(() => {
    if (textures && meshRef.current) {
      meshRef.current.material.needsUpdate = true;
    }
  }, [textures]);

  return (
    <mesh
      ref={meshRef}
      receiveShadow
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
    >
      <planeGeometry args={[wallSize, wallSize]} />
      {textures ? (
        <meshStandardMaterial
          map={textures.map}
          aoMap={textures.aoMap}
          metalnessMap={textures.metalnessMap}
          normalMap={textures.normalMap}
          roughnessMap={textures.roughnessMap}
          color={0xffffff}
        />
      ) : (
        <meshStandardMaterial color="gray" />
      )}
    </mesh>
  );
};
export default TexturedFloor;
