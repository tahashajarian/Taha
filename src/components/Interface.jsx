import React, { useState, useEffect, Suspense } from "react";
import {
  cameraIdle,
  cameraLookAtConst,
  cameraLookAtDefault,
} from "../constances/constances";
import { useCameraControl } from "../contexts/CameraControlContext";
import { useCharacterAnimations } from "../contexts/CharacterAnimations";
import { useAppStatusContext } from "../contexts/AppStatusContext";
import EmailModal from "./UI/EmailModal";
const WelcomeMessage = React.lazy(() => import("./UI/WelcomeMessage"));
const PaintingModal = React.lazy(() => import("./UI/PaintingModal"));
const ArrowControls = React.lazy(() => import("./UI/ArrowControls"));

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
          <Suspense fallback={null}>
            <EmailModal
              isOpen={modalIsOpen}
              onClose={() => setModalIsOpen(false)}
            />
          </Suspense>
          <Suspense fallback={null}>
            <WelcomeMessage
              showMessage={showMessage}
              handleClose={handleClose}
            />
          </Suspense>
          <Suspense fallback={null}>
            <PaintingModal
              closeModal={() => setPaintModalIsOpen(false)}
              modalIsOpen={paintModalIsPoen}
            />
          </Suspense>
        </>
      )}
    </div>
  );
};

export default Interface;
