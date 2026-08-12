import React, { useEffect, useRef } from "react";
import { cameraIdle } from "../../constances/constances";
import { useCameraControlStore } from "../../stores/useCameraControlStore";
import { useTourStore } from "../../stores/useTourStore";

const TOUR_STOPS = [
  {
    title: "The workspace",
    text: "Where the character codes, types, and occasionally pretends to work.",
    camera: [2.9, 1.75, -1.8, 0, 0.85, 0.7],
  },
  {
    title: "Game projects",
    text: "A wall of playable experiments and small games.",
    camera: [3.2, 1.9, 2.1, 3.8, 1.85, 5.8],
  },
  {
    title: "The painting",
    text: "A shared canvas where every visitor can leave a mark.",
    camera: [1.7, 2.15, 2, 5.75, 2, 2],
  },
  {
    title: "The chess puzzle",
    text: "Solve it if you can. If you get stuck, reveal the solution.",
    camera: [2.2, 2.7, -0.5, 3.5, 0.85, -3.25],
  },
  {
    title: "The bookshelf",
    text: "Click a book and gravity will handle the rest.",
    camera: [1.7, 1.9, -3, 5.55, 1.65, -3],
  },
  {
    title: "The fireplace",
    text: "A warm corner for the moments when pretending to work gets exhausting.",
    camera: [-2.2, 1.8, 1.4, -5.25, 0.85, 4],
  },
  {
    title: "The sleeping cat",
    text: "He is sleeping in his little cat tree. Please don't bother him.",
    camera: [0, 1.65, -2.8, 1.35, 0.8, -5.05],
  },
  {
    title: "The view outside",
    text: "A calmer corner of the room, with a city beyond the window.",
    camera: [-0.4, 2.1, 2.5, 0, 2.05, 5.8],
  },
  {
    title: "Let's connect",
    text: "Open GitHub or send a message directly from the room.",
    camera: [-3, 1.65, 2.1, -3, 1.05, 5.8],
  },
];

const GuidedTour = () => {
  const active = useTourStore((s) => s.active);
  const step = useTourStore((s) => s.step);
  const setStep = useTourStore((s) => s.setStep);
  const stopTour = useTourStore((s) => s.stopTour);
  const setCameraLookAt = useCameraControlStore((s) => s.setCameraLookAt);
  const wheelReadyRef = useRef(true);
  const touchStartRef = useRef(0);

  useEffect(() => {
    if (!active) return;
    setCameraLookAt(TOUR_STOPS[step].camera);
  }, [active, setCameraLookAt, step]);

  const finishTour = () => {
    localStorage.setItem("guidedTourSeen", "true");
    stopTour();
    setCameraLookAt(cameraIdle);
  };

  const changeStep = (direction) => {
    const nextStep = step + direction;
    if (nextStep < 0) return;
    if (nextStep >= TOUR_STOPS.length) {
      finishTour();
      return;
    }
    setStep(nextStep);
  };

  useEffect(() => {
    if (!active) return;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") finishTour();
      if (event.key === "ArrowDown" || event.key === "ArrowRight") changeStep(1);
      if (event.key === "ArrowUp" || event.key === "ArrowLeft") changeStep(-1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  if (!active) return null;
  const currentStop = TOUR_STOPS[step];

  return (
    <div
      className="fixed inset-0 z-40 touch-none select-none"
      onWheel={(event) => {
        event.preventDefault();
        if (!wheelReadyRef.current || Math.abs(event.deltaY) < 12) return;
        wheelReadyRef.current = false;
        changeStep(event.deltaY > 0 ? 1 : -1);
        window.setTimeout(() => {
          wheelReadyRef.current = true;
        }, 700);
      }}
      onTouchStart={(event) => {
        touchStartRef.current = event.touches[0].clientY;
      }}
      onTouchEnd={(event) => {
        const delta = touchStartRef.current - event.changedTouches[0].clientY;
        if (Math.abs(delta) > 45) changeStep(delta > 0 ? 1 : -1);
      }}
    >
      <button
        type="button"
        onClick={finishTour}
        className="absolute right-4 top-4 rounded-xl border border-white/20 bg-black/45 px-4 py-2 text-sm text-white/75 backdrop-blur-xl transition hover:bg-white/15 sm:right-8"
      >
        Skip tour
      </button>

      <div className="absolute bottom-5 left-1/2 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-2xl border border-white/20 bg-black/55 p-4 text-center text-white shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:bottom-8 sm:p-5">
        <div className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/45">
          {step + 1} / {TOUR_STOPS.length}
        </div>
        <h2 className="text-xl font-semibold sm:text-2xl">{currentStop.title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-white/70 sm:text-base">
          {currentStop.text}
        </p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <button
            type="button"
            disabled={step === 0}
            onClick={() => changeStep(-1)}
            className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/70 transition hover:bg-white/20 disabled:opacity-25"
          >
            Back
          </button>
          <div className="flex gap-1.5">
            {TOUR_STOPS.map((stop, index) => (
              <span
                key={stop.title}
                className={`h-1.5 rounded-full transition-all ${
                  index === step ? "w-5 bg-white" : "w-1.5 bg-white/30"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => changeStep(1)}
            className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20 active:scale-95"
          >
            {step === TOUR_STOPS.length - 1 ? "Explore" : "Next"}
          </button>
        </div>
        <p className="mt-3 text-xs text-white/35">Scroll or swipe to continue</p>
      </div>
    </div>
  );
};

export default GuidedTour;
