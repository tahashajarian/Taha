import React from "react";
import Modal from "../UI/Modal";
import PaintingCanvas from "./PaintingCanvas";

const PaintingModal = ({ modalIsOpen, closeModal }) => {
  return (
    <Modal
      isOpen={modalIsOpen}
      onClose={closeModal}
      className="max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl 2xl:max-w-3xl"
    >
      <PaintingCanvas width={4} height={3} />
    </Modal>
  );
};

export default PaintingModal;
