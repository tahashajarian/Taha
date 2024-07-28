import React, { useRef } from "react";
import { useAppStatusContext } from "../../contexts/AppStatusContext";
import { usePaintingContext } from "../../contexts/PaintingContext";
import { TextureLoader } from "three";
import { Html } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";

const Frame = ({ width, height, thickness, color, position }) => {
  const frameWidth = width + thickness * 2;
  const frameHeight = height + thickness * 2;

  return (
    <mesh position={[0, 0, position]}>
      <boxGeometry args={[frameWidth, frameHeight, thickness]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
};

const Picture = ({ width, height, map }) => {
  const texture = new TextureLoader().load(map);
  return (
    <mesh position={[0, 0, 0.12]}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} transparent={true} color={"white"} />
    </mesh>
  );
};

const RefreshIcon = () => {
  const ref = useRef();
  const texture = useLoader(TextureLoader, "/textures/refresh.png");

  return (
    <mesh position={[-1.85, 1.05, 0.2]} ref={ref}> 
      <planeGeometry args={[0.3, 0.3]} />
      <meshBasicMaterial map={texture} transparent />
    </mesh>
  );
};

const ShaderFrame = () => {
  const { paintingImage, canvasRef } = usePaintingContext();
  const pictureWidth = 3; // Adjust the width to be smaller
  const pictureHeight = 2.25; // Adjust the height to be smaller
  const frameThickness = 0.0001;
  const { setPaintModalIsOpen } = useAppStatusContext();
  const { fetchPainting, loading } = usePaintingContext();

  return (
    <>
      <group
        onClick={fetchPainting}
      >
        <RefreshIcon />
      </group>
      {loading && (
        <Html center>
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <p className="text-white text-xl">Loading...</p>
          </div>
        </Html>
      )}
      <group onClick={() => setPaintModalIsOpen(true)}>
        <Frame
          width={pictureWidth}
          height={pictureHeight}
          thickness={frameThickness + 0.1}
          color="black"
          position={0.01}
        />
        <Frame
          width={pictureWidth}
          height={pictureHeight}
          thickness={frameThickness}
          color={"white"}
          position={0.1}
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
