import React, { useRef, useEffect } from "react";
import { TextureLoader, ShaderMaterial, Color } from "three";
import { useFrame, useLoader } from "@react-three/fiber";
import { usePaintingStore } from "../../stores/usePaintingStore";
import { useAppStatusStore } from "../../stores/useAppStatusStore";

const Frame = ({ width, height, thickness, color, position, isLoading }) => {
  const frameWidth = width + thickness * 2;
  const frameHeight = height + thickness * 2;
  const materialRef = useRef();

  useFrame((state, delta) => {
    if (isLoading) {
      const t = (Math.sin(state.clock.elapsedTime * 5) + 1) / 2; // Normalize to range [0, 1]
      const color = new Color(t * 0, t * 1, t * 0); // Interpolate between black and green
      materialRef.current.color.set(color);
    } else {
      materialRef.current.color.set(color);
    }
  });

  return (
    <mesh position={[0, 0, position]}>
      <boxGeometry args={[frameWidth, frameHeight, thickness]} />
      <meshBasicMaterial color={color} ref={materialRef} transparent />
    </mesh>
  );
};

const Picture = ({ width, height, map }) => {
  const texture = new TextureLoader().load(map);
  return (
    <mesh position={[0, 0, 0.13]}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} transparent={true} color={"white"} />
    </mesh>
  );
};

const RefreshIcon = ({ onClick }) => {
  const ref = useRef();
  const texture = useLoader(TextureLoader, "/textures/refresh.png");

  return (
    <mesh position={[-1.85, 1.05, 0.1]} ref={ref} onClick={onClick}>
      <planeGeometry args={[0.3, 0.3]} />
      <meshBasicMaterial map={texture} transparent />
    </mesh>
  );
};

const ShaderFrame = () => {
  const { paintingImage, canvasRef, fetchPainting, loading } =
    usePaintingStore();
  const pictureWidth = 3; // Adjust the width to be smaller
  const pictureHeight = 2.25; // Adjust the height to be smaller
  const frameThickness = 0.0001;
  const { setPaintModalIsOpen } = useAppStatusStore();

  return (
    <>
      <group onClick={fetchPainting}>
        <RefreshIcon />
      </group>
      <group onClick={() => setPaintModalIsOpen(true)}>
        <Frame
          width={pictureWidth}
          height={pictureHeight}
          thickness={frameThickness + 0.1}
          color="black"
          position={0.01}
          isLoading={loading}
        />
        <Frame
          width={pictureWidth}
          height={pictureHeight}
          thickness={frameThickness}
          color={"white"}
          position={0.12}
        />
        <Picture
          width={pictureWidth}
          height={pictureHeight}
          map={paintingImage}
          canvasRef={canvasRef}
        />
      </group>
    </>
  );
};

export default ShaderFrame;
