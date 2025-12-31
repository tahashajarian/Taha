import React, { useState, useEffect } from "react";
import {
  cameraIdle,
  cameraLookAtConst,
  cameraLookAtDefault,
} from "../../constances/constances";
import EmailModal from "./EmailModal";
import WelcomeMessage from "./WelcomeMessage";
import PaintingModal from "./PaintingModal";
import ArrowControls from "./ArrowControls";
import { useCameraControlStore } from "../../stores/useCameraControlStore";
import { useCharacterAnimationsStore } from "../../stores/useCharacterAnimationsStore";
import { useAppStatusStore } from "../../stores/useAppStatusStore";

const Interface = () => {
  const { animation, setAnimation, setPosition, setRotation } =
    useCharacterAnimationsStore();
  const { setCameraLookAt } = useCameraControlStore();

  const {
    modalIsOpen,
    setModalIsOpen,
    isApploaded,
    paintModalIsPoen,
    setPaintModalIsOpen,
  } = useAppStatusStore();
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
            <>
              <button
                className="absolute bottom-10 right-8 py-2 bg-[#00a6ed] text-white font-semibold rounded-lg shadow-md opacity-80 hover:bg-[#10b6fd] focus:outline-none focus:ring-2 focus:ring-opacity-75 text-2xl px-6"
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
              <ArrowControls />
            </>
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
      <span className="fixed top-0 right-0 z-50 text-black text-xs">13</span>
    </div>
  );
};

export default Interface;
