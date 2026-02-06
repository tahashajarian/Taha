import { useGraphicsSettings } from "../../stores/useGraphicsSettings"

const QualityTag = () => {
  const quality = useGraphicsSettings((s) => s.quality)

  const tint =
    quality === "high"
      ? "from-green-400/40 to-green-400/10"
      : quality === "medium"
      ? "from-yellow-400/40 to-yellow-400/10"
      : "from-red-400/40 to-red-400/10"

  return (
    <div
      className={`
        absolute top-4 left-4
        px-3 py-1.5
        text-xs font-semibold tracking-wide text-white
        rounded-full
        backdrop-blur-lg
        bg-gradient-to-b ${tint}
        border border-white/25
        shadow-[0_6px_20px_rgba(0,0,0,0.25)]
      `}
      style={{
        pointerEvents: "none",
        WebkitBackdropFilter: "blur(14px)",
      }}
    >
      QUALITY · {quality.toUpperCase()}
    </div>
  )
}

export default QualityTag
