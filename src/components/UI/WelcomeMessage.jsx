import React from "react";

const WelcomeMessage = ({ showMessage, handleClose }) => {
  return (
    showMessage && (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50">
        <div className="bg-gray-900 bg-opacity-90 p-6 rounded-lg shadow-lg max-w-md text-white">
          <h1 className="text-4xl font-bold mb-4">Welcome!</h1>
          <p className="text-lg mb-4">I'm Taha and this is my website.</p>
          <p className="text-lg mb-4">
            You can use arrows to navigate around!
          </p>
          <p className="text-lg mb-4">
            Have fun, and don't forget to send me an email.
          </p>
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-[#00a6ed] hover:bg-[#10b6fd] text-white rounded-md focus:outline-none"
          >
            Close
          </button>
        </div>
      </div>
    )
  );
};

export default WelcomeMessage;
