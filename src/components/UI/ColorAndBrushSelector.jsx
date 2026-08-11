import React from "react";

const buttonClass =
  "flex h-8 w-8 select-none items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white/70 shadow-[0_6px_18px_rgba(0,0,0,0.25)] backdrop-blur-xl transition-all duration-150 hover:bg-white/20 hover:text-white active:scale-90 disabled:cursor-not-allowed disabled:opacity-30 disabled:active:scale-100";

const HistoryIcon = ({ redo = false }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className={`h-4 w-4 ${redo ? "-scale-x-100" : ""}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 7 4 12l5 5" />
    <path d="M20 17a8 8 0 0 0-16-5" />
  </svg>
);

const ColorAndBrushSelector = ({
  currentColor,
  setCurrentColor,
  brushSize,
  setBrushSize,
  brushType,
  setBrushType,
  undo,
  redo,
  canUndo,
  canRedo,
}) => {
  return (
    <div
      className="flex w-full flex-wrap items-center justify-center gap-3 rounded-b-lg border border-t-0 border-white/20 bg-black/60 px-3 py-2.5 text-white shadow-lg backdrop-blur-xl"
      style={{ WebkitBackdropFilter: "blur(18px)" }}
    >
      <input
        aria-label="Brush color"
        type="color"
        value={currentColor}
        onChange={(event) => setCurrentColor(event.target.value)}
        className="h-8 w-8 cursor-pointer rounded-md"
      />
      <input
        aria-label="Brush size"
        type="range"
        min="1"
        max="20"
        value={brushSize}
        onChange={(event) => setBrushSize(parseInt(event.target.value, 10))}
        className="w-24 cursor-pointer accent-white sm:w-32"
      />
      <select
        aria-label="Brush type"
        value={brushType}
        onChange={(event) => setBrushType(event.target.value)}
        className="rounded-md border border-white/20 bg-neutral-900 px-3 py-1 text-sm text-white"
      >
        <option value="round">Round</option>
        <option value="square">Square</option>
        <option value="triangle">Triangle</option>
        <option value="line">Line</option>
        <option value="circle">Circle</option>
        <option value="spray">Spray</option>
        <option value="pattern">Pattern</option>
        <option value="calligraphy">Calligraphy</option>
      </select>
      <div className="flex gap-2">
        <button
          type="button"
          aria-label="Undo"
          title="Undo"
          onClick={undo}
          disabled={!canUndo}
          className={buttonClass}
        >
          <HistoryIcon />
        </button>
        <button
          type="button"
          aria-label="Redo"
          title="Redo"
          onClick={redo}
          disabled={!canRedo}
          className={buttonClass}
        >
          <HistoryIcon redo />
        </button>
      </div>
    </div>
  );
};

export default React.memo(ColorAndBrushSelector);
