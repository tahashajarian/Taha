import React, { useRef, useMemo, useState, useEffect } from "react"
import { TextureLoader, Color } from "three"
import { useFrame } from "@react-three/fiber"
import { usePaintingStore } from "../../stores/usePaintingStore"
import { useAppStatusStore } from "../../stores/useAppStatusStore"

// ---------------- Frame ----------------
const Frame = React.memo(({ width, height, thickness, color, position, isLoading }) => {
  const frameWidth = useMemo(() => width + thickness * 1, [width, thickness])
  const frameHeight = useMemo(() => height + thickness * 1, [height, thickness])
  const materialRef = useRef()
  const tempColor = useRef(new Color(color))

  useFrame((state) => {
    if (!materialRef.current) return
    if (isLoading) {
      const t = (Math.sin(state.clock.elapsedTime * 5) + 1) / 2
      tempColor.current.setRGB(0.1 * t, 0.1 * t, 0.1 * t) // black -> green
      materialRef.current.color.copy(tempColor.current)
    } else {
      materialRef.current.color.set(color)
    }
  })

  return (
    <mesh position={[0, 0, position]}>
      <boxGeometry args={[frameWidth, frameHeight, thickness]} />
      <meshBasicMaterial color={color} ref={materialRef} transparent />
    </mesh>
  )
})

// ---------------- Picture ----------------
const Picture = React.memo(({ width, height, map }) => {
  const geometryArgs = useMemo(() => [width, height], [width, height])
  const [texture, setTexture] = useState(null)

  useEffect(() => {
    if (!map) return
    const loader = new TextureLoader()
    loader.load(
      map,
      (loaded) => setTexture(loaded),
      undefined,
      (err) => console.error("Texture load failed:", err)
    )
  }, [map])

  if (!texture) return null // don’t render until texture is loaded

  return (
    <mesh position={[0, 0, 0.13]}>
      <planeGeometry args={geometryArgs} />
      <meshBasicMaterial map={texture} transparent color="white" />
    </mesh>
  )
})

// ---------------- RefreshIcon ----------------
const RefreshIcon = React.memo(({ onClick }) => {
  const ref = useRef()
  const [texture, setTexture] = useState(null)

  useEffect(() => {
    new TextureLoader().load("/textures/refresh.png", setTexture)
  }, [])

  if (!texture) return null

  return (
    <mesh
      position={[-1.85, 1.05, 0.1]}
      ref={ref}
      onClick={onClick}
    >
      <planeGeometry args={[0.3, 0.3]} />
      <meshStandardMaterial
        map={texture}
        color="#111111"    
        transparent

      />
    </mesh>
  )
})

// ---------------- ShaderFrame ----------------
const ShaderFrame = () => {
  const { paintingImage, fetchPainting, loading } = usePaintingStore()
  const { setPaintModalIsOpen } = useAppStatusStore()

  const pictureWidth = 3
  const pictureHeight = 2.25
  const frameThickness = 0.0001

  return (
    <>
      <group onClick={fetchPainting}>
        <RefreshIcon />
      </group>
      <group onClick={() => setPaintModalIsOpen(true)}>
        <Frame
          width={pictureWidth}
          height={pictureHeight}
          thickness={frameThickness + 0.1}
          color="black"
          position={0.01}
          isLoading={loading}
        />
        <Frame
          width={pictureWidth}
          height={pictureHeight}
          thickness={frameThickness}
          color="black"
          position={0.12}
        />
        <Picture width={pictureWidth} height={pictureHeight} map={paintingImage} />
      </group>
    </>
  )
}

export default React.memo(ShaderFrame)
