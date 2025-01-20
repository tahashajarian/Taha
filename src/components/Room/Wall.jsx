import React, { useState, useEffect, useRef } from "react";
import { TextureLoader, RepeatWrapping, Shape, ShapeGeometry } from "three";
import { useAppStatusContext } from "../../contexts/AppStatusContext";

const Wall = ({ position, rotation, args, windowPosition, windowSize }) => {
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

        map.wrapS = map.wrapT = RepeatWrapping;
        map.repeat.set(1, 1);

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

  // Create the geometry with or without a window
// Create the geometry with or without a window
const createWallGeometry = () => {
    const [wallWidth, wallHeight] = args;
    const shape = new Shape();
  
    // Define the wall's outer boundary
    shape.moveTo(-wallWidth / 2, -wallHeight / 2);
    shape.lineTo(wallWidth / 2, -wallHeight / 2);
    shape.lineTo(wallWidth / 2, wallHeight / 2);
    shape.lineTo(-wallWidth / 2, wallHeight / 2);
    shape.lineTo(-wallWidth / 2, -wallHeight / 2);
  
    // Add a hole if windowPosition and windowSize are defined
    if (windowPosition && windowSize) {
      const [windowX, windowY] = windowPosition;
      const [windowWidth, windowHeight] = windowSize;
      console.log({ windowHeight, windowPosition });
  
      const hole = new Shape();
      hole.moveTo(windowX - windowWidth / 2, windowY - windowHeight / 2);
      hole.lineTo(windowX + windowWidth / 2, windowY - windowHeight / 2);
      hole.lineTo(windowX + windowWidth / 2, windowY + windowHeight / 2);
      hole.lineTo(windowX - windowWidth / 2, windowY + windowHeight / 2);
      hole.lineTo(windowX - windowWidth / 2, windowY - windowHeight / 2);
  
      shape.holes.push(hole);
    }
  
    return new ShapeGeometry(shape);
  };
  
  return (
    <mesh ref={meshRef} rotation={rotation} position={position}>
      <primitive object={createWallGeometry()} />
      {textures ? (
        <meshStandardMaterial
          map={textures.map}
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

export default Wall;
