import React from "react"

const WelcomeMessage = ({ showMessage, handleClose }) => {
  if (!showMessage) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* glass card */}
      <div
        className="
          relative z-10
          w-[420px] max-w-full
          p-6 rounded-2xl
          text-white
          select-none
          border border-white/10
          shadow-[0_12px_40px_rgba(0,0,0,0.6)]
        "
        style={{
          WebkitBackdropFilter: "blur(18px)",
          backdropFilter: "blur(18px)",
          background:
            "linear-gradient(180deg, rgba(6,8,11,0.75), rgba(12,14,18,0.55))",
        }}
      >
        <h1 className="text-3xl font-semibold mb-3">Welcome</h1>

        <p className="text-white/75 mb-3">
          I’m Taha — welcome to my website.
        </p>

        <p className="text-white/75 mb-3">
          You can use the arrow controls to move around the scene.
        </p>

        <p className="text-white/75 mb-6">
          Have fun, and feel free to send me an email.
        </p>

        <button
          onClick={handleClose}
          className="
            select-none
            w-full py-3 rounded-xl font-semibold tracking-wide
            bg-gradient-to-b
            from-[rgba(0,166,237,0.18)]
            to-[rgba(0,166,237,0.10)]
            border border-[rgba(0,166,237,0.18)]
            hover:from-[rgba(0,166,237,0.24)]
            hover:to-[rgba(0,166,237,0.14)]
            active:scale-95
            transition
          "
        >
          Enter
        </button>
      </div>
    </div>
  )
}

export default WelcomeMessage
