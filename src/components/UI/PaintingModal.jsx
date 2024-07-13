import React from "react";
import Modal from "../UI/Modal";
import PaintingCanvas from "./PaintingCanvas";

const PaintingModal = ({ modalIsOpen, closeModal }) => {
  return (
    <Modal isOpen={modalIsOpen} onClose={closeModal}>
      <PaintingCanvas  />
    </Modal>
  );
};

export default PaintingModal;
