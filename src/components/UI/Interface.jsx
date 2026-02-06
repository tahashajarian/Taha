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

  // include setChessMode so we can turn it off from UI
  const { setCameraLookAt, chessMode, setChessMode } = useCameraControlStore();

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

  // Button click to reset camera and exit chessMode
  const handleCloseView = (e) => {
    // prevent any bubble to canvas / controls
    if (e && e.stopPropagation) e.stopPropagation();

    // reset to default camera (using your existing cameraIdle constant)
    setCameraLookAt(cameraIdle);
    setChessMode(false);
  };

  return (
    <div className="">
      {isApploaded && (
        <>
          <QualityTag />
          {!(modalIsOpen || showMessage) && !chessMode && (
            <>
              <button
                className="
                  absolute bottom-10 right-8
                  px-6 py-3 rounded-2xl
                  text-lg font-semibold tracking-wide text-white
                  backdrop-blur-xl
                  bg-white/10
                  border border-white/20
                  shadow-[0_8px_30px_rgba(0,0,0,0.25)]
                  hover:bg-white/20
                  hover:shadow-[0_12px_40px_rgba(0,0,0,0.35)]
                  active:scale-95
                  transition-all duration-200
                "
                style={{
                  WebkitBackdropFilter: "blur(18px)",
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.22), rgba(255,255,255,0.06))",
                }}
                onClick={() => {
                  if (animation === "idle") {
                    resetArrows();
                    setCameraLookAt(cameraLookAtConst);
                    setAnimation("typing");
                  } else {
                    setAnimation("idle");
                    setCameraLookAt(cameraIdle);
                  }
                }}
              >
                {animation === "typing" ? "Idle" : "Work"}
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
{chessMode && (
  <div
    className="
      fixed bottom-10 left-1/2 -translate-x-1/2 z-50
      flex flex-col items-center gap-4
      px-6 py-4 rounded-2xl
      text-white
      backdrop-blur-xl
      bg-black/50
      border border-white/20
      shadow-[0_8px_30px_rgba(0,0,0,0.25)]
      text-center
    "
    style={{ WebkitBackdropFilter: "blur(18px)" }}
  >
    <span className="text-lg font-semibold">
      White to move — Mate in 2
    </span>
    <div className="flex gap-4 mt-2">
      <button
        className="
          px-5 py-2.5 rounded-full
          text-sm font-semibold tracking-wide text-white
          backdrop-blur-xl
          bg-white/10
          border border-green-400/40
          shadow-[0_8px_30px_rgba(0,0,0,0.25)]
          hover:bg-white/20
          hover:shadow-[0_12px_40px_rgba(0,0,0,0.35)]
          active:scale-95
          transition-all duration-200
        "
        style={{ WebkitBackdropFilter: "blur(18px)" }}
        onClick={() => setPaintModalIsOpen(true)}
      >
        See Solution
      </button>
      <button
        className="
          px-5 py-2.5 rounded-full
          text-sm font-semibold tracking-wide text-white
          backdrop-blur-xl
          bg-white/10
          border border-red-400/40
          shadow-[0_8px_30px_rgba(0,0,0,0.25)]
          hover:bg-white/20
          hover:shadow-[0_12px_40px_rgba(0,0,0,0.35)]
          active:scale-95
          transition-all duration-200
        "
        style={{ WebkitBackdropFilter: "blur(18px)" }}
        onClick={handleCloseView}
      >
        Back to Scene
      </button>
    </div>
  </div>
)}
    </div>
  );
};

export default Interface;
