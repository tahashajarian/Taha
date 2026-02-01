import { useGraphicsSettings } from "../../stores/useGraphicsSettings"

const QualityTag = () => {
  const quality = useGraphicsSettings((s) => s.quality)

  const color =
    quality === "high"
      ? "bg-green-600"
      : quality === "medium"
      ? "bg-yellow-500"
      : "bg-red-600"

  return (
    <div
      className={`absolute top-4 left-4 px-3 py-1 text-xs font-semibold text-white rounded-md shadow-md ${color}`}
      style={{ pointerEvents: "none" }}
    >
      QUALITY: {quality.toUpperCase()}
    </div>
  )
}

export default QualityTag
