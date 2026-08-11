import React from "react";
import Modal from "../UI/Modal";
import PaintingCanvas from "./PaintingCanvas";
import { usePaintingStore } from "../../stores/usePaintingStore";

const PaintingModal = ({ modalIsOpen, closeModal }) => {
  const setPaintingImage = usePaintingStore((s) => s.setPaintingImage);

  const onSave = (imageData) => {
    // closeModal();
    setPaintingImage(imageData);
  };
  return (
    <Modal
      isOpen={modalIsOpen}
      onClose={closeModal}
      className="!max-w-3xl !p-3 sm:!p-6"
    >
      <div className="w-full">
        <PaintingCanvas
          width={4}
          height={3}
          onSave={onSave}
          // closeModal={closeModal}
        />
      </div>
    </Modal>
  );
};

export default PaintingModal;
