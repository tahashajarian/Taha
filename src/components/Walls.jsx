import React from "react";
import { useTexture } from "@react-three/drei";
import { wallHeight, wallSize } from "../constances/constances";
import ReactIcon from "./StuffOnWall/ReactIcon";
import Library from "./Library";
import { RepeatWrapping } from "three";

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
  const textures2 = useTexture({
    map: "/textures/Poliigon_PlasticMoldDryBlast_7495/256/Poliigon_PlasticMoldDryBlast_7495_BaseColor.jpg",
    aoMap:
      "/textures/Poliigon_PlasticMoldDryBlast_7495/256/Poliigon_PlasticMoldDryBlast_7495_AmbientOcclusion.jpg",
    metalnessMap:
      "/textures/Poliigon_PlasticMoldDryBlast_7495/256/Poliigon_PlasticMoldDryBlast_7495_Metallic.jpg",
    normalMap:
      "/textures/Poliigon_PlasticMoldDryBlast_7495/256/Poliigon_PlasticMoldDryBlast_7495_Normal.jpg",
    
  });

  // Set the repeat and wrapping properties for each texture
  Object.values(textures2).forEach((texture) => {
    texture.wrapS = texture.wrapT = RepeatWrapping;
    texture.repeat.set(1, 1);
  });

  return (
    <mesh rotation={rotation} position={position} receiveShadow> 
      <planeGeometry args={args} />
      <meshStandardMaterial
        {...textures2}
        metalness={0.0}  // Ensure metalness is set to zero
        roughness={1.0}  // Ensure roughness is set to one
        envMapIntensity={0.0}  // Set environment map intensity to zero if using environment maps
      />
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
  const textures = useTexture({
    map: "/textures/Poliigon_SlateFloorTile_7657/1K/Poliigon_SlateFloorTile_7657_BaseColor.jpg",
    aoMap:
      "/textures/Poliigon_SlateFloorTile_7657/1K/Poliigon_SlateFloorTile_7657_AmbientOcclusion.jpg",
    metalnessMap:
      "/textures/Poliigon_SlateFloorTile_7657/1K/Poliigon_SlateFloorTile_7657_Metallic.jpg",
    normalMap:
      "/textures/Poliigon_SlateFloorTile_7657/1K/Poliigon_SlateFloorTile_7657_Normal.jpg",
    roughnessMap:
      "/textures/Poliigon_SlateFloorTile_7657/1K/Poliigon_SlateFloorTile_7657_Roughness.jpg",
  });

  const repeatX = 8; // Adjust this value to scale the texture in the X direction
  const repeatY = 8; // Adjust this value to scale the texture in the Y direction

  // Set the repeat and wrapping properties for each texture
  Object.values(textures).forEach((texture) => {
    texture.wrapS = texture.wrapT = RepeatWrapping;
    texture.repeat.set(repeatX, repeatY);
  });

  return (
    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[wallSize, wallSize]} />
      <meshStandardMaterial {...textures} />
    </mesh>
  );
};
