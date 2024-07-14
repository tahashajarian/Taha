import React from "react";
import Modal from "../UI/Modal";
import PaintingCanvas from "./PaintingCanvas";
import { usePaintingContext } from "../../contexts/PaintingContext";

const PaintingModal = ({ modalIsOpen, closeModal }) => {
  const { setPaintingImage } = usePaintingContext();

  const onSave = (imageData) => {
    // closeModal();
    setPaintingImage(imageData);
  };
  return (
    <Modal
      isOpen={modalIsOpen}
      onClose={closeModal}
      className="max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl 2xl:max-w-3xl"
    >
      <PaintingCanvas
        width={4}
        height={3}
        onSave={onSave}
        // closeModal={closeModal}
      />
    </Modal>
  );
};

export default PaintingModal;
