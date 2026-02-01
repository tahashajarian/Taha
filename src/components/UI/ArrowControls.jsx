import React from "react";
import { useArrowsStore } from "../../stores/useArrowStore";


const ArrowButton = ({ direction, symbol }) => {
  const setArrow = useArrowsStore((s) => s.setArrow);

  return (
    <button
      className="select-none font-bold w-[30px] h-[30px] rounded-md shadow-lg transform transition-transform duration-200 active:scale-90 text-3xl flex items-center justify-center"
      onMouseDown={() => setArrow(direction, true)}
      onMouseUp={() => setArrow(direction, false)}
      onMouseLeave={() => setArrow(direction, false)}
      onTouchStart={() => setArrow(direction, true)}
      onTouchEnd={() => setArrow(direction, false)}
    >
      {symbol}
    </button>
  );
};

const ArrowControls = () => {

  return (
    <div className="absolute bottom-10 left-10 flex flex-col items-center space-y-2 select-none">
      <ArrowButton direction="forward" symbol="⬆️" />
      <div className="flex space-x-2">
        <ArrowButton direction="left" symbol="⬅️" />
        <ArrowButton direction="backward" symbol="⬇️" />
        <ArrowButton direction="right" symbol="➡️" />
      </div>
    </div>
  );
};

export default ArrowControls;
