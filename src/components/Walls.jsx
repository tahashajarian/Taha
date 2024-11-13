import React, { useState, useEffect, useRef } from "react";
import { TextureLoader, RepeatWrapping } from "three";
import { wallHeight, wallSize } from "../constances/constances";
import Library from "./Library";
import { useAppStatusContext } from "../contexts/AppStatusContext";

const Walls = () => {
  return (
    <>
      <TexturedFloor />
      {wallData.map((wall, index) => (
        <Wall
          key={index}
          args={wall.args}
          position={wall.pos}
          rotation={wall.rot}
        />
      ))}
      <Library position={[wallSize / 2 - 0.3, wallHeight / 2 + 0.4, -3]} />
    </>
  );
};

export default Walls;

const Wall = ({ position, rotation, args }) => {
  const [textures, setTextures] = useState(null);
  const meshRef = useRef();
  const { isApploaded } = useAppStatusContext();

  useEffect(() => {
    const loader = new TextureLoader();
    const loadTextures = async () => {
      try {
        const map = await loader.loadAsync(
          "/textures/Poliigon_PlasticMoldDryBlast_7495/256/Poliigon_PlasticMoldDryBlast_7495_BaseColor.jpg"
        );

        [map].forEach((texture) => {
          texture.wrapS = texture.wrapT = RepeatWrapping;
          texture.repeat.set(1, 1);
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
    <mesh ref={meshRef} rotation={rotation} position={position}>
      <planeGeometry args={args} />
      {textures ? (
        <meshStandardMaterial
          map={textures.map}
          aoMap={textures.aoMap}
          metalnessMap={textures.metalnessMap}
          normalMap={textures.normalMap}
          metalness={0.0}
          roughness={1.0}
          color={0xffffff}
        />
      ) : (
        <meshStandardMaterial color="gray" />
      )}
    </mesh>
  );
};

const segments = 1;

const wallData = [
  {
    pos: [0, wallHeight, 0],
    rot: [0.5 * Math.PI, 0, 0],
    args: [wallSize, wallSize, segments, segments],
  },
  {
    pos: [0, wallHeight / 2, wallSize / 2],
    rot: [Math.PI, 0, 0],
    args: [wallSize, wallHeight, segments, segments],
  },
  {
    pos: [0, wallHeight / 2, -wallSize / 2],
    rot: [0, 0, 0],
    args: [wallSize, wallHeight, segments, segments],
  },
  {
    pos: [-wallSize / 2, wallHeight / 2, 0],
    rot: [0, Math.PI / 2, 0],
    args: [wallSize, wallHeight, segments, segments],
  },
  {
    pos: [wallSize / 2, wallHeight / 2, 0],
    rot: [0, -Math.PI / 2, 0],
    args: [wallSize, wallHeight, segments, segments],
  },
];

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
        // const aoMap = await loader.loadAsync(
        //   "/textures/Poliigon_SlateFloorTile_7657/1K/Poliigon_SlateFloorTile_7657_AmbientOcclusion.jpg"
        // );
        // const metalnessMap = await loader.loadAsync(
        //   "/textures/Poliigon_SlateFloorTile_7657/1K/Poliigon_SlateFloorTile_7657_Metallic.jpg"
        // );
        // const normalMap = await loader.loadAsync(
        //   "/textures/Poliigon_SlateFloorTile_7657/1K/Poliigon_SlateFloorTile_7657_Normal.jpg"
        // );
        // const roughnessMap = await loader.loadAsync(
        //   "/textures/Poliigon_SlateFloorTile_7657/1K/Poliigon_SlateFloorTile_7657_Roughness.jpg"
        // );

        [map].forEach(
          (texture) => {
            texture.wrapS = texture.wrapT = RepeatWrapping;
            texture.repeat.set(8, 8);
          }
        );

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
