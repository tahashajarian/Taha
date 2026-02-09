import { useThree } from "@react-three/fiber"
import React, { useEffect, useRef, useMemo } from "react"
import { AudioListener, AudioLoader, PositionalAudio } from "three"

const Sound = ({ url, volume = 1.0 }) => {
  const { camera } = useThree()
  const sound = useRef()
  const listener = useMemo(() => new AudioListener(), [])
  const isInitialized = useRef(false)

  // Load audio once
  useEffect(() => {
    if (!url) return
    const loader = new AudioLoader()
    let isCancelled = false
    loader.load(url, (buffer) => {
      if (!isCancelled && sound.current) {
        sound.current.setBuffer(buffer)
        sound.current.setRefDistance(0.1)
        sound.current.setLoop(true)
        sound.current.setVolume(volume)
      }
    })
    return () => {
      isCancelled = true
    }
  }, [url, volume])

  // Attach listener to camera once
  useEffect(() => {
    camera.add(listener)
    return () => camera.remove(listener)
  }, [camera, listener])

  // Play on user interaction (once)
  useEffect(() => {
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
      document.removeEventListener("click", handleUserInteraction)
      document.removeEventListener("touchstart", handleUserInteraction)
    }
  }, [])

  // Volume update if prop changes
  useEffect(() => {
    if (sound.current) sound.current.setVolume(volume)
  }, [volume])

  return <positionalAudio ref={sound} args={[listener]} />
}

export default React.memo(Sound)