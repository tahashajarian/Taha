import React, { useState, useEffect } from "react";
import { cameraIdle, cameraLookAtConst } from "../../constances/constances";
import EmailModal from "./EmailModal";
import WelcomeMessage from "./WelcomeMessage";
import PaintingModal from "./PaintingModal";
import ArrowControls from "./ArrowControls";
import { useCameraControlStore } from "../../stores/useCameraControlStore";
import { useCharacterAnimationsStore } from "../../stores/useCharacterAnimationsStore";
import { useAppStatusStore } from "../../stores/useAppStatusStore";
import { useArrowsStore } from "../../stores/useArrowStore";
import QualityTag from "./QualityTag";

const Interface = () => {
  const animation = useCharacterAnimationsStore((s) => s.animation);
  const setAnimation = useCharacterAnimationsStore((s) => s.setAnimation);
  const setCameraLookAt = useCameraControlStore((s) => s.setCameraLookAt);

  const modalIsOpen = useAppStatusStore((s) => s.modalIsOpen);
  const setModalIsOpen = useAppStatusStore((s) => s.setModalIsOpen);
  const isApploaded = useAppStatusStore((s) => s.isApploaded);
  const paintModalIsPoen = useAppStatusStore((s) => s.paintModalIsPoen);
  const setPaintModalIsOpen = useAppStatusStore((s) => s.setPaintModalIsOpen);

  // grab resetArrows *without subscribing* to avoid rerenders
  const resetArrows = useArrowsStore.getState().resetArrows;

  const [showMessage, setShowMessage] = useState(true);

  useEffect(() => {
    const isMessageShown = localStorage.getItem("welcomeMessageShown");
    if (isMessageShown) setShowMessage(false);
  }, []);

  const handleClose = () => {
    localStorage.setItem("welcomeMessageShown", "true");
    setShowMessage(false);
  };

  return (
    <div className="">
      {isApploaded && (
        <>
         <QualityTag />
          {!(modalIsOpen || showMessage) && (
            <>
              <button
                className="absolute bottom-10 right-8 py-2 bg-[#00a6ed] text-white font-semibold rounded-lg shadow-md opacity-80 hover:bg-[#10b6fd] focus:outline-none focus:ring-2 focus:ring-opacity-75 text-2xl px-6"
                onClick={() => {
                  if (animation === "idle") {
                    // clear any arrow input first so the movement logic doesn't immediately override teleport
                    resetArrows();
                    // set camera & animation
                    setCameraLookAt(cameraLookAtConst);
                    setAnimation("typing");
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
    </div>
  );
};

export default Interface;
