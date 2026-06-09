import React from "react";
import ReactDOM from "react-dom";

const Modal = ({ isOpen, onClose, children, className = "" }) => {
  // OPTIMIZATION: Render children even when closed (display:none) to pre-mount heavy components
  return ReactDOM.createPortal(
    <div 
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ display: isOpen ? 'flex' : 'none' }}
    >
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div
        className={` p-6  z-10 w-full max-w-md mx-auto relative ${className}`}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
