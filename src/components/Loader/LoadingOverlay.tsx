import React from "react"

interface LoadingOverlayProps {
  percent: number
  issue: string | null
  onRetry: () => void
  onContinue: () => void
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ percent, issue, onRetry, onContinue }) => {
  return (
    <div
      className="
        fixed inset-0 z-50 flex flex-col items-center justify-center
        bg-slate-950 text-white select-none
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
      {issue && (
        <div className="mt-6 px-6 text-center">
          <p className="mb-4 text-sm text-amber-200">{issue}</p>
          <div className="flex justify-center gap-3">
            <button type="button" onClick={onRetry} className="rounded-xl bg-white px-4 py-2 font-semibold text-slate-950">Retry</button>
            <button type="button" onClick={onContinue} className="rounded-xl border border-white/30 px-4 py-2 font-semibold">Continue</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default LoadingOverlay
