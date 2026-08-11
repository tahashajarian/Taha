import React, { useEffect } from "react";
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
import GuidedTour from "./GuidedTour";
import { useTourStore } from "../../stores/useTourStore";

const Interface = () => {
  const animation = useCharacterAnimationsStore((s) => s.animation);
  const setAnimation = useCharacterAnimationsStore((s) => s.setAnimation);

  // include setChessMode so we can turn it off from UI
  const setCameraLookAt = useCameraControlStore((s) => s.setCameraLookAt);
  const chessMode = useCameraControlStore((s) => s.chessMode);
  const setChessMode = useCameraControlStore((s) => s.setChessMode);

  const modalIsOpen = useAppStatusStore((s) => s.modalIsOpen);
  const setModalIsOpen = useAppStatusStore((s) => s.setModalIsOpen);
  const isApploaded = useAppStatusStore((s) => s.isApploaded);
  const paintModalIsPoen = useAppStatusStore((s) => s.paintModalIsPoen);
  const setPaintModalIsOpen = useAppStatusStore((s) => s.setPaintModalIsOpen);
  const setChessPlay = useAppStatusStore((s) => s.setChessPlay);
  const chessPlayEnd = useAppStatusStore((s) => s.chessPlayEnd);
  const setResetChess = useAppStatusStore((s) => s.setResetChess);
  const showMessage = useAppStatusStore((s) => s.welcomeOpen);
  const setShowMessage = useAppStatusStore((s) => s.setWelcomeOpen);
  const tourActive = useTourStore((s) => s.active);
  const startTour = useTourStore((s) => s.startTour);

  // grab resetArrows *without subscribing* to avoid rerenders
  const resetArrows = useArrowsStore.getState().resetArrows;

  useEffect(() => {
    const isMessageShown = localStorage.getItem("welcomeMessageShown");
    if (isMessageShown) setShowMessage(false);
  }, [setShowMessage]);

  const handleClose = () => {
    localStorage.setItem("welcomeMessageShown", "true");
    setShowMessage(false);
    resetArrows();
    setChessMode(false);
    setAnimation("typing");
    if (!localStorage.getItem("guidedTourSeen")) {
      startTour();
    }
  };

  const handleStartTour = () => {
    resetArrows();
    setChessMode(false);
    setAnimation("idle");
    startTour();
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
          {!(modalIsOpen || showMessage || paintModalIsPoen) && !chessMode && !tourActive && (
            <>
              <button
                type="button"
                onClick={handleStartTour}
                className="absolute right-8 top-16 rounded-xl border border-white/20 bg-black/40 px-4 py-2 text-sm font-semibold text-white/70 backdrop-blur-xl transition hover:bg-white/15 active:scale-95"
              >
                Tour
              </button>
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
          <GuidedTour />
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
          <div className="flex gap-4 mt-2 justify-center w-full">
            <button
              className="
      px-5 py-2.5 rounded-2xl
      text-sm font-semibold tracking-wide text-white/70
      backdrop-blur-xl
      bg-white/10
      shadow-[0_8px_30px_rgba(0,0,0,0.25)]
      hover:bg-white/20
      hover:shadow-[0_12px_40px_rgba(0,0,0,0.35)]
      active:scale-95
      transition-all duration-200
      text-center
      whitespace-nowrap
    "
              style={{
                width: "150px", // fixed width
                WebkitBackdropFilter: "blur(18px)",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.05))",
              }}
              onClick={() =>
                chessPlayEnd ? setResetChess() : setChessPlay(true)
              }
            >
              {chessPlayEnd ? "Reset" : "Solution"}
            </button>

            <button
              className="
      px-5 py-2.5 rounded-2xl
      text-sm font-semibold tracking-wide text-white/70
      backdrop-blur-xl
      bg-white/10
      shadow-[0_8px_30px_rgba(0,0,0,0.25)]
      hover:bg-white/20
      hover:shadow-[0_12px_40px_rgba(0,0,0,0.35)]
      active:scale-95
      transition-all duration-200
      text-center
      whitespace-nowrap
    "
              style={{
                width: "150px", // same fixed width
                WebkitBackdropFilter: "blur(18px)",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.05))",
              }}
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
