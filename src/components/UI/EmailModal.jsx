import React, { useState } from "react"
import emailjs from "@emailjs/browser"
import Modal from "./Modal"

const EmailModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSent, setIsSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((s) => ({ ...s, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)

    emailjs
      .sendForm("service_vdscpwh", "template_kvey1du", e.target, {
        publicKey: "IO7J0l4e4BwzDdPbn",
      })
      .then(() => {
        setIsSent(true)
        setFormData({ name: "", email: "", message: "" })
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} blurredBg={false}>
      {/* Glass card */}
      <div
        className="
          w-[460px] max-w-full
          p-6 rounded-2xl
          text-white
          shadow-[0_12px_40px_rgba(0,0,0,0.6)]
          border border-white/10
        "
        style={{
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          background:
            "linear-gradient(180deg, rgba(6,8,11,0.75), rgba(12,14,18,0.55))",
        }}
      >
        {isSent ? (
          <div className="text-center select-none">
            <div className="text-green-400 text-5xl mb-3">✓</div>

            <h2 className="text-xl font-semibold mb-2">
              Thanks — message sent
            </h2>

            <p className="text-white/70 mb-6">
              I’ll get your email shortly.
            </p>

            <button
              onClick={onClose}
              className="
                w-full py-3 rounded-xl font-semibold
                bg-gradient-to-b from-white/6 to-white/4
                border border-white/10
                hover:from-white/8 hover:to-white/6
                active:scale-95 transition
              "
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-5 text-center">
              Contact me
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm text-white/70 mb-1">
                  Name
                </label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                  className="
                    w-full px-4 py-2.5 rounded-xl
                    bg-[rgba(255,255,255,0.02)]
                    border border-transparent
                    text-white placeholder-white/40
                    outline-none
                    focus:border-[rgba(0,166,237,0.45)]
                    focus:bg-[rgba(255,255,255,0.03)]
                    transition
                  "
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm text-white/70 mb-1">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="
                    w-full px-4 py-2.5 rounded-xl
                    bg-[rgba(255,255,255,0.02)]
                    border border-transparent
                    text-white placeholder-white/40
                    outline-none
                    focus:border-[rgba(0,166,237,0.45)]
                    focus:bg-[rgba(255,255,255,0.03)]
                    transition
                  "
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm text-white/70 mb-1">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Write something..."
                  className="
                    w-full px-4 py-2.5 rounded-xl
                    bg-[rgba(255,255,255,0.02)]
                    border border-transparent
                    text-white placeholder-white/40
                    outline-none resize-none
                    focus:border-[rgba(0,166,237,0.45)]
                    focus:bg-[rgba(255,255,255,0.03)]
                    transition
                  "
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className={`
                  w-full py-3 rounded-xl font-semibold tracking-wide
                  bg-gradient-to-b
                  from-[rgba(0,166,237,0.18)]
                  to-[rgba(0,166,237,0.10)]
                  border border-[rgba(0,166,237,0.18)]
                  hover:from-[rgba(0,166,237,0.24)]
                  hover:to-[rgba(0,166,237,0.14)]
                  active:scale-95 transition
                  ${loading ? "opacity-60 cursor-not-allowed" : ""}
                `}
              >
                {loading ? "Sending..." : "Send Email"}
              </button>
            </form>
          </>
        )}
      </div>
    </Modal>
  )
}

export default EmailModal
