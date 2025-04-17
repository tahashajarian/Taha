import React, { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import Bird from "./Bird"
import { wallSize } from "../../constances/constances"

const Birds = ({ baseRadius = 1.5, speed = 2.5 }) => {
  const groupRef = useRef()
  const zOffsetRef = useRef(Math.random() * 2 + 1)

  const birdCount = useMemo(() => Math.floor(Math.random() * 19) + 2, [])
  const radius = useMemo(() => baseRadius + birdCount * 0.1, [baseRadius, birdCount])
  const ySpread = useMemo(() => birdCount * 0.2, [birdCount])

  const birdPositions = useMemo(() => {
    return Array.from({ length: birdCount }, (_, i) => {
      const angle = (i / birdCount) * Math.PI * 2
      const x = Math.cos(angle) * radius
      const y = (Math.random() - 0.5) * ySpread
      const z = Math.sin(angle) * radius
      return [x, y, z]
    })
  }, [birdCount, radius, ySpread])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    const newX = 6 - ((time * speed) % 12)
    if (groupRef.current) {
      if (newX > 5.9) zOffsetRef.current = Math.random() * 10
      groupRef.current.position.set(
        newX,
        2,
        Math.max(wallSize / 2 + zOffsetRef.current, wallSize / 2 + 4)
      )
    }
  })

  return (
    <group ref={groupRef}>
      {birdPositions.map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          <Bird />
        </group>
      ))}
    </group>
  )
}

export default Birds
