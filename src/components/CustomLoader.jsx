import React from "react";

const CustomLoader = ({  }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
      <p className="text-white text-xl">Loading... </p>
    </div>
  );
};

export default CustomLoader;