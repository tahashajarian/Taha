import React, { useEffect, useState } from 'react';

const WelcomeMessage = () => {
  const [showMessage, setShowMessage] = useState(true);

  useEffect(() => {
    // Check local storage to see if the message has been shown before
    const isMessageShown = localStorage.getItem('welcomeMessageShown');
    if (isMessageShown) {
      setShowMessage(false); // Don't show the message if it has been shown before
    }
  }, []);

  const handleClose = () => {
    // Set local storage to remember that the message has been shown
    localStorage.setItem('welcomeMessageShown', 'true');
    setShowMessage(false); // Hide the message
  };

  return (
    showMessage && (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50">
        <div className="bg-gray-900 bg-opacity-90 p-6 rounded-lg shadow-lg max-w-md text-white">
          <h1 className="text-4xl font-bold mb-4">Welcome!</h1>
          <p className="text-lg mb-4">I'm Taha and this is my website.</p>
          <p className="text-lg mb-4">If you're on PC, use W,A,S,D to navigate around!</p>
          <p className="text-lg mb-4">Have fun, and don't forget to send me an email.</p>
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none"
          >
            Close
          </button>
        </div>
      </div>
    )
  );
};

export default WelcomeMessage;
