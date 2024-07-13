import React, { useMemo, useState } from "react";
import * as THREE from 'three';
import Modal from "../UI/Modal";
import PaintingCanvas from "./PaintingCanvas";
import { Html } from "@react-three/drei";

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

const Picture = ({ width, height, image }) => {
  const texture = useMemo(() => {
    if (!image) return null;
    const loader = new THREE.TextureLoader();
    return loader.load(image);
  }, [image]);

  return (
    <mesh position={[0, 0, 0.1]}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
};

const PaintFrame = () => {
  const pictureWidth = 3;
  const pictureHeight = 1.5;
  const frameThickness = 0.1;
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [image, setImage] = useState(() => localStorage.getItem('painting') || null);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const saveImage = (dataURL) => {
    setImage(dataURL);
    localStorage.setItem('painting', dataURL);
    closeModal();
  };

  const handleMeshClick = () => {
    openModal();
  };

  return (
    <>
      <group onClick={handleMeshClick}>
        <Frame width={pictureWidth} height={pictureHeight} thickness={frameThickness} />
        <Picture width={pictureWidth} height={pictureHeight} image={image} />
      </group>
      {modalIsOpen && (
        <Html position={[0, 0, 0]}>
          <Modal isOpen={modalIsOpen} onClose={closeModal}>
            <PaintingCanvas onSave={saveImage} />
          </Modal>
        </Html>
      )}
    </>
  );
};

export default PaintFrame;