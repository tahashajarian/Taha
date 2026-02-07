import React from "react"

interface LoadingOverlayProps {
  percent: number
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ percent }) => {
  return (
    <div
      className="
        fixed inset-0 z-50 flex flex-col items-center justify-center
        bg-black/90 backdrop-blur-[12px] text-white select-none
        transition-opacity duration-500
      "
    >
      {/* Title */}
      <h2 className="text-3xl font-bold mb-6 select-none">Loading Experience</h2>

      {/* Progress bar container */}
      <div className="w-3/4 max-w-lg h-4 bg-white/10 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Percentage */}
      <p className="text-xl font-semibold mb-2 select-none">{percent}%</p>

      {/* Loading dots */}
      <div className="text-white/70 text-sm select-none">
        {percent < 100 ? (
          <>
            Loading
            <span className="inline-block animate-bounce" style={{ animationDelay: "0ms" }}>
              .
            </span>
            <span className="inline-block animate-bounce" style={{ animationDelay: "150ms" }}>
              .
            </span>
            <span className="inline-block animate-bounce" style={{ animationDelay: "300ms" }}>
              .
            </span>
          </>
        ) : (
          "Finalizing..."
        )}
      </div>
    </div>
  )
}

export default LoadingOverlay
