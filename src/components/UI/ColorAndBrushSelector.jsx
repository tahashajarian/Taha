import React from "react";

const ColorAndBrushSelector = ({
  currentColor,
  setCurrentColor,
  brushSize,
  setBrushSize,
  brushType,
  setBrushType,
  clearCanvas,
  fetchPainting,
}) => {
  return (
    <div
      className="
        absolute -bottom-20 left-1/2 transform -translate-x-1/2
        flex justify-evenly items-center
        py-4
        px-4
        rounded-lg
        w-full
        backdrop-blur-xl
        bg-black/50 border border-white/20
        shadow-[0_8px_30px_rgba(0,0,0,0.25)]
        text-white/50
        bg-opacity-45
      "
      style={{ WebkitBackdropFilter: "blur(18px)" }}
    >
      <input
        type="color"
        value={currentColor}
        onChange={(e) => setCurrentColor(e.target.value)}
        className="
    w-6 h-6  cursor-pointer rounded-md
        "
      />
      <input
        type="range"
        min="1"
        max="20"
        value={brushSize}
        onChange={(e) => setBrushSize(parseInt(e.target.value))}
        className="
          w-28
          accent-white
          cursor-pointer
        "
      />
      <select
        value={brushType}
        onChange={(e) => setBrushType(e.target.value)}
        className="
          px-3 py-1
          rounded-md
          text-sm text-white
          bg-white/10 border border-white/20
          backdrop-blur-xl
          hover:bg-white/20
          transition-all duration-200
        "
      >
        <option className="backdrop-blur-xl
        bg-black/50 border border-white/20" value="round">Round</option>
        <option className="backdrop-blur-xl
        bg-black/50 border border-white/20" value="square">Square</option>
        <option className="backdrop-blur-xl
        bg-black/50 border border-white/20" value="triangle">Triangle</option>
        <option className="backdrop-blur-xl
        bg-black/50 border border-white/20" value="line">Line</option>
        <option className="backdrop-blur-xl
        bg-black/50 border border-white/20" value="circle">Circle</option>
        <option className="backdrop-blur-xl
        bg-black/50 border border-white/20" value="spray">Spray</option>
        <option className="backdrop-blur-xl
        bg-black/50 border border-white/20" value="pattern">Pattern</option>
        <option className="backdrop-blur-xl
        bg-black/50 border border-white/20" value="calligraphy">Calligraphy</option>
      </select>
    </div>
  );
};

// OPTIMIZATION: Prevent unnecessary rerenders
export default React.memo(ColorAndBrushSelector);
