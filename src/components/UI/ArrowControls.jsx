import React, { memo, useCallback } from "react"
import { useArrowsStore } from "../../stores/useArrowStore"
import { useCharacterAnimationsStore } from "../../stores/useCharacterAnimationsStore"

/* -------------------- ICON -------------------- */

const ArrowIcon = memo(({ direction }) => {
  const base =
    "w-0 h-0 border-l-[6px] border-r-[6px] border-l-transparent border-r-transparent"

  switch (direction) {
    case "forward":
      return <div className={`${base} border-b-[10px] border-b-white/80`} />
    case "backward":
      return <div className={`${base} border-t-[10px] border-t-white/80`} />
    case "left":
      return (
        <div className="w-0 h-0 border-t-[6px] border-b-[6px] border-t-transparent border-b-transparent border-r-[10px] border-r-white/80" />
      )
    case "right":
      return (
        <div className="w-0 h-0 border-t-[6px] border-b-[6px] border-t-transparent border-b-transparent border-l-[10px] border-l-white/80" />
      )
    default:
      return null
  }
})

/* -------------------- BUTTON -------------------- */

const ArrowButton = memo(({ direction }) => {
  const setArrow = useArrowsStore((s) => s.setArrow)

  const press = useCallback(() => {
    setArrow(direction, true)
  }, [setArrow, direction])

  const release = useCallback(() => {
    setArrow(direction, false)
  }, [setArrow, direction])

  return (
    <button
      type="button"
      className="
        select-none
        w-[44px] h-[44px]
        rounded-xl
        flex items-center justify-center
        backdrop-blur-xl
        bg-white/10
        border border-white/25
        shadow-[0_8px_24px_rgba(0,0,0,0.3)]
        hover:bg-white/20
        active:scale-90
        transition-all duration-150
        outline-none
        [-webkit-tap-highlight-color:transparent]
      "
      style={{
        touchAction: "manipulation",
        WebkitBackdropFilter: "blur(16px)",
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.22), rgba(255,255,255,0.05))",
        WebkitUserSelect: "none",
        userSelect: "none",
      }}
      onMouseDown={press}
      onMouseUp={release}
      onMouseLeave={release}
      onTouchStart={(e) => {
        e.preventDefault()
        press()
      }}
      onTouchEnd={(e) => {
        e.preventDefault()
        release()
      }}
    >
      <ArrowIcon direction={direction} />
    </button>
  )
})

/* -------------------- CONTROLS -------------------- */

const ArrowControls = () => {
  // 🔑 Only re-render when animation changes
  const animation = useCharacterAnimationsStore((s) => s.animation)

  // 🚫 Hide arrows while typing
  if (animation === "typing") return null

  return (
    <div className="absolute bottom-10 left-10 flex flex-col items-center gap-2 select-none">
      <ArrowButton direction="forward" />
      <div className="flex gap-2">
        <ArrowButton direction="left" />
        <ArrowButton direction="backward" />
        <ArrowButton direction="right" />
      </div>
    </div>
  )
}

export default memo(ArrowControls)
