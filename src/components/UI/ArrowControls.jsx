import React from "react";
import { useArrows } from "../../contexts/ArrowsProvider";

const isMobileDevice = () => {
  return /Mobi|Android|iPhone|iPad|iPod/.test(navigator.userAgent);
};

const ArrowButton = ({ direction, symbol }) => {
  const { handleButtonPress, handleButtonRelease } = useArrows();

  return (
    <button
      className="select-none font-bold w-[30px] h-[30px] rounded-md shadow-lg transform transition-transform duration-200 active:scale-90 text-3xl flex items-center justify-center"
      onMouseDown={() => handleButtonPress(direction)}
      onMouseUp={() => handleButtonRelease(direction)}
      onTouchStart={() => handleButtonPress(direction)}
      onTouchEnd={() => handleButtonRelease(direction)}
    >
      {symbol}
    </button>
  );
};

const ArrowControls = () => {
  if (isMobileDevice()) {
    return null;
  }

  return (
    <div className="absolute bottom-10 left-10 flex flex-col items-center space-y-2 select-none">
      <ArrowButton direction="ArrowUp" symbol="⬆️" />
      <div className="flex space-x-2">
        <ArrowButton direction="ArrowLeft" symbol="⬅️" />
        <ArrowButton direction="ArrowDown" symbol="⬇️" />
        <ArrowButton direction="ArrowRight" symbol="➡️" />
      </div>
    </div>
  );
};

export default ArrowControls;
