import React from "react";

const ColorsAndRange = ({ setCurrentColor, brushSize, setBrushSize }) => {
  return (
    <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 flex justify-center space-x-4">
      <button
        onClick={() => setCurrentColor("black")}
        className="px-3 py-0 bg-black text-white rounded-md"
      ></button>
      <button
        onClick={() => setCurrentColor("red")}
        className="px-3 py-0 bg-red-500 text-white rounded-md"
      ></button>
      <button
        onClick={() => setCurrentColor("blue")}
        className="px-3 py-0 bg-blue-500 text-white rounded-md"
      ></button>
      <button
        onClick={() => setCurrentColor("green")}
        className="px-3 py-0 bg-green-500 text-white rounded-md"
      ></button>
      <button
        onClick={() => setCurrentColor("white")}
        className="px-3 py-0 bg-gray-300 text-black rounded-md"
      >
        Eraser
      </button>
      <input
        type="range"
        min="1"
        max="20"
        value={brushSize}
        onChange={(e) => setBrushSize(parseInt(e.target.value))}
        className="w-32"
      />
    </div>
  );
};

export default ColorsAndRange;
