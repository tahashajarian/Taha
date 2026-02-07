import { useThree } from "@react-three/fiber"
import React, { useEffect, useRef, useMemo, useState } from "react"
import { AudioListener, AudioLoader, Audio } from "three"

const Sound = ({ url, volume = 1.0 }) => {
  const { camera } = useThree()
  const sound = useRef()
  const listener = useMemo(() => new AudioListener(), [])
  const [buffer, setBuffer] = useState(null)
  const isInitialized = useRef(false)

  // Load audio asynchronously
  useEffect(() => {
    if (!url) return
    const loader = new AudioLoader()
    loader.load(url, (loadedBuffer) => setBuffer(loadedBuffer))
  }, [url])

  useEffect(() => {
    if (!buffer || !sound.current) return

    // Setup sound properties
    sound.current.setBuffer(buffer)
    sound.current.setRefDistance(0.1)
    sound.current.setLoop(true)
    sound.current.setVolume(volume)

    // Attach listener to camera
    camera.add(listener)

    const handleUserInteraction = async () => {
      if (!isInitialized.current && sound.current) {
        const context = sound.current.context
        if (context.state === "suspended") await context.resume()
        sound.current.play()
        isInitialized.current = true
      }
    }

    document.addEventListener("click", handleUserInteraction)
    document.addEventListener("touchstart", handleUserInteraction)

    return () => {
      camera.remove(listener)
      if (sound.current?.isPlaying) sound.current.stop()
      document.removeEventListener("click", handleUserInteraction)
      document.removeEventListener("touchstart", handleUserInteraction)
    }
  }, [buffer, camera, listener, volume])

  return <positionalAudio ref={sound} args={[listener]} />
}

export default React.memo(Sound)
