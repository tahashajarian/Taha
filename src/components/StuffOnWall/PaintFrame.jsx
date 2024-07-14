import React from "react";
import { useAppStatusContext } from "../../contexts/AppStatusContext";

const Frame = ({ width, height, thickness }) => {
  const frameWidth = width + thickness * 2;
  const frameHeight = height + thickness * 2;

  return (
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[frameWidth, frameHeight, thickness]} />
      <meshBasicMaterial color="black" />
    </mesh>
  );
};

const Picture = ({ width, height }) => {
  return (
    <mesh position={[0, 0, 0.1]}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial />
    </mesh>
  );
};

const ShaderFrame = () => {
  const pictureWidth = 3; // Adjust the width to be smaller
  const pictureHeight = 2.25; // Adjust the height to be smaller
  const frameThickness = 0.1;
  const { setPaintModalIsOpen } = useAppStatusContext();

  return (
    <group onClick={() => setPaintModalIsOpen(true)}>
      <Frame
        width={pictureWidth}
        height={pictureHeight}
        thickness={frameThickness}
      />
      <Picture width={pictureWidth} height={pictureHeight} />
    </group>
  );
};

export default ShaderFrame;
