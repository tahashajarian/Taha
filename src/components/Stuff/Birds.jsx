import React, { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import Bird from "./Bird"
import { wallSize } from "../../constances/constances"

const Birds = ({ baseRadius = 1.5, speed = 2.5 }) => {
  const groupRef = useRef()
  const birdCountRef = useRef(Math.floor(Math.random() * 19) + 1)
  const zOffsetRef = useRef(Math.random() * 10)
  const birdPositionsRef = useRef([])

  const generatePositions = () => {
    const count = Math.floor(Math.random() * 19) + 1
    birdCountRef.current = count
    const radius = baseRadius + count * 0.1
    const ySpread = count * 0.2
    birdPositionsRef.current = Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2
      const x = Math.cos(angle) * radius
      const y = (Math.random() - 0.5) * ySpread
      const z = Math.sin(angle) * radius
      return [x, y, z]
    })
    zOffsetRef.current = Math.random() * 10
  }

  // initialize positions
  if (!birdPositionsRef.current.length) generatePositions()

  const prevXRef = useRef(0)
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    const newX = 6 - ((time * speed) % 12)

    // detect wrap
    if (prevXRef.current <= 5.9 && newX > 5.9) generatePositions()
    prevXRef.current = newX

    if (groupRef.current) {
      groupRef.current.position.set(
        newX,
        2,
        Math.max(wallSize / 2 + zOffsetRef.current, wallSize / 2 + 4)
      )
    }
  })

  return (
    <group ref={groupRef}>
      {birdPositionsRef.current.map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          <Bird />
        </group>
      ))}
    </group>
  )
}

export default Birds
