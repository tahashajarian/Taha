import React from "react";

interface LoadingOverlayProps {
  percent: number;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ percent }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 z-50 transition-opacity duration-500">
      <div className="text-center w-80">
        <h2 className="text-2xl font-bold text-white mb-6">
          Loading Experience
        </h2>

        {/* Progress bar */}
        <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ease-out"
            style={{ width: `${percent}%` }}
          ></div>
        </div>

        {/* Percentage indicator */}
        <p className="text-white text-xl font-semibold mb-2">{percent}%</p>

        {/* Loading details */}
        <div className="text-gray-300 text-sm">
          {percent < 100 ? (
            <>
              Loading
              <span
                className="inline-block animate-bounce"
                style={{ animationDelay: "0ms" }}
              >
                .
              </span>
              <span
                className="inline-block animate-bounce"
                style={{ animationDelay: "150ms" }}
              >
                .
              </span>
              <span
                className="inline-block animate-bounce"
                style={{ animationDelay: "300ms" }}
              >
                .
              </span>
            </>
          ) : (
            "Finalizing..."
          )}
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
