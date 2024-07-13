import React, { useState, useEffect } from "react";
import {
  cameraIdle,
  cameraLookAtConst,
  cameraLookAtDefault,
} from "../constances/constances";
import { useCameraControl } from "../contexts/CameraControlContext";
import { useCharacterAnimations } from "../contexts/CharacterAnimations";
import { useAppStatusContext } from "../contexts/AppStatusContext";
import EmailModal from "./UI/EmailModal";
import WelcomeMessage from "./UI/WelcomeMessage";
import PaintingModal from "./UI/PaintingModal";

const Interface = () => {
  const { animation, setAnimation, setPosition, setRotation } =
    useCharacterAnimations();
  const { setCameraLookAt } = useCameraControl();

  const {
    modalIsOpen,
    setModalIsOpen,
    isApploaded,
    paintModalIsPoen,
    setPaintModalIsOpen,
  } = useAppStatusContext();
  const [showMessage, setShowMessage] = useState(true);

  useEffect(() => {
    // Check local storage to see if the message has been shown before
    const isMessageShown = localStorage.getItem("welcomeMessageShown");
    if (isMessageShown) {
      setShowMessage(false); // Don't show the message if it has been shown before
    }
  }, []);

  const handleClose = () => {
    // Set local storage to remember that the message has been shown
    localStorage.setItem("welcomeMessageShown", "true");
    setShowMessage(false); // Hide the message
  };
  return (
    <div className="">
      {isApploaded && (
        <>
          {!(modalIsOpen || showMessage) && (
            <button
              className="absolute bottom-4 left-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md opacity-80 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 text-2xl px-6"
              onClick={() => {
                if (animation === "idle") {
                  setAnimation("typing");
                  setCameraLookAt(cameraLookAtConst);
                  setPosition([0, 0, 0]);
                  setRotation([0, 0, 0]);
                } else {
                  setAnimation("idle");
                  setCameraLookAt(cameraIdle);
                }
              }}
            >
              {animation === "typing" ? "idle" : "working"}
            </button>
          )}
          <EmailModal
            isOpen={modalIsOpen}
            onClose={() => setModalIsOpen(false)}
          />
          <WelcomeMessage showMessage={showMessage} handleClose={handleClose} />
          <PaintingModal
            closeModal={() => setPaintModalIsOpen(false)}
            modalIsOpen={paintModalIsPoen}
          />
        </>
      )}
    </div>
  );
};

export default Interface;
