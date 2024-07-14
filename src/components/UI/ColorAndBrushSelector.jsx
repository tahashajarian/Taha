import React from "react";

const ColorAndBrushSelector = ({ setCurrentColor, brushSize, setBrushSize, setBrushType, clearCanvas }) => {
  return (
    <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 flex justify-center space-x-4 items-center">
      <input
        type="color"
        onChange={(e) => setCurrentColor(e.target.value)}
        className="px-3 py-0 rounded-md"
      />
      <input
        type="range"
        min="1"
        max="20"
        value={brushSize}
        onChange={(e) => setBrushSize(parseInt(e.target.value))}
        className="w-24"
      />
      <select
        onChange={(e) => setBrushType(e.target.value)}
        className="px-1 py-0 rounded-md text-sm"
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
      <button
        onClick={clearCanvas}
        className="px-3 py-1 bg-red-500 text-white rounded-md "
      >
        Clear
      </button>
    </div>
  );
};

export default ColorAndBrushSelector;
