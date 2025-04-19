import React, { useRef, useMemo } from "react"
import * as THREE from "three"
import { useFrame } from "@react-three/fiber"

const createTextTexture = (text) => {
  const canvas = document.createElement("canvas")
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext("2d")
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.font = "48px sans-serif"
  ctx.fillStyle = "#88f"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText(text, canvas.width / 2, canvas.height / 2)
  return new THREE.CanvasTexture(canvas)
}

const ZSprite = ({ refSprite, texture }) => (
  <sprite ref={refSprite} scale={[0.1, 0.1, 0.1]}>
    <spriteMaterial
      map={texture}
      transparent
      opacity={0}
      depthWrite={false}
    />
  </sprite>
)

const SnoreParticles = ({ count = 3 }) => {
  const group = useRef()
  const texture = useMemo(() => createTextTexture("Z"), [])

  const particles = useMemo(() => {
    return new Array(count).fill().map(() => ({
      position: new THREE.Vector3(
        Math.random() * 0.2 - 0.1,
        0,
        Math.random() * 0.2 - 0.1
      ),
      speed: 0.003 + Math.random() * 0.002,
      life: 0,
      opacity: 0,
      ref: React.createRef()
    }))
  }, [count])

  useFrame((_, delta) => {
    particles.forEach((p) => {
      p.position.y += p.speed
      p.life += delta

      // Fade in (0–0.5s)
      if (p.life < 0.5) {
        p.opacity = p.life * 2
      }
      // Fade out sooner (starts at 0.8s)
      else if (p.life > 0.8) {
        p.opacity = Math.max(1 - (p.life - 0.8) * 0.6, 0)
      }

      if (p.life > 3) {
        p.position.set(Math.random() * 0.2 - 0.1, 0, Math.random() * 0.2 - 0.1)
        p.life = 0
        p.opacity = 0
      }

      if (p.ref.current) {
        p.ref.current.position.copy(p.position)
        p.ref.current.material.opacity = p.opacity
      }
    })
  })

  return (
    <group ref={group} position={[0.1, 0.15, 0]}>
      {particles.map((p, i) => (
        <ZSprite key={i} refSprite={p.ref} texture={texture} />
      ))}
    </group>
  )
}

export default SnoreParticles
