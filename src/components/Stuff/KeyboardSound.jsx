import React, { memo, useEffect, useMemo, useRef } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { AudioListener, AudioLoader } from "three"
import { useCharacterAnimationsStore } from "../../stores/useCharacterAnimationsStore"
import { useAppStatusStore } from "../../stores/useAppStatusStore"
import { mouseInteractionRef } from "./Mouse"
import { monitorTypingRef } from "./Monitor2"

const KeyboardSound = () => {
  const { camera } = useThree()
  const animation = useCharacterAnimationsStore((s) => s.animation)
  const interfaceOpen = useAppStatusStore(
    (s) => s.modalIsOpen || s.paintModalIsPoen,
  )
  const soundRef = useRef(null)
  const listener = useMemo(() => new AudioListener(), [])
  const interactionReadyRef = useRef(false)
  const loadedRef = useRef(false)
  const pageActiveRef = useRef(!document.hidden)

  useEffect(() => {
    const sound = soundRef.current
    if (!sound) return

    let cancelled = false
    new AudioLoader().load("/audio/mechanical-keyboard.mp3", (buffer) => {
      if (cancelled || !soundRef.current) return
      soundRef.current.setBuffer(buffer)
      soundRef.current.setLoop(true)
      soundRef.current.setVolume(0.9)
      soundRef.current.setRefDistance(1.1)
      soundRef.current.setRolloffFactor(1.25)
      soundRef.current.setMaxDistance(12)
      soundRef.current.setDistanceModel("inverse")
      loadedRef.current = true
    })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    camera.add(listener)
    return () => camera.remove(listener)
  }, [camera, listener])

  useEffect(() => {
    const enableAudio = async () => {
      const sound = soundRef.current
      if (!sound) return
      if (sound.context.state === "suspended") await sound.context.resume()
      interactionReadyRef.current = true
    }
    document.addEventListener("pointerdown", enableAudio, { once: true })
    document.addEventListener("keydown", enableAudio, { once: true })
    return () => {
      document.removeEventListener("pointerdown", enableAudio)
      document.removeEventListener("keydown", enableAudio)
    }
  }, [])

  useEffect(() => {
    const pauseWhenHidden = () => {
      pageActiveRef.current = !document.hidden && document.hasFocus()
      if (!pageActiveRef.current && soundRef.current?.isPlaying) {
        soundRef.current.pause()
      }
    }
    const resumeWhenFocused = () => {
      pageActiveRef.current = !document.hidden
    }

    document.addEventListener("visibilitychange", pauseWhenHidden)
    window.addEventListener("blur", pauseWhenHidden)
    window.addEventListener("focus", resumeWhenFocused)
    return () => {
      document.removeEventListener("visibilitychange", pauseWhenHidden)
      window.removeEventListener("blur", pauseWhenHidden)
      window.removeEventListener("focus", resumeWhenFocused)
    }
  }, [])

  useFrame(() => {
    const sound = soundRef.current
    if (!sound || !loadedRef.current || !interactionReadyRef.current) return

    const shouldPlay =
      pageActiveRef.current &&
      !interfaceOpen &&
      animation === "typing" &&
      monitorTypingRef.current &&
      !mouseInteractionRef.current
    if (shouldPlay && !sound.isPlaying) sound.play()
    if (!shouldPlay && sound.isPlaying) sound.pause()
  })

  useEffect(() => () => {
    if (soundRef.current?.isPlaying) soundRef.current.stop()
  }, [])

  return <positionalAudio ref={soundRef} args={[listener]} />
}

export default memo(KeyboardSound)
