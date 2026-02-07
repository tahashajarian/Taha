import React, { useRef, useMemo, useState, useEffect } from "react"
import { useSpring, animated } from "@react-spring/three"
import { TextureLoader } from "three"

const GodsHand = () => {
  const [adamHandTex, setAdamHandTex] = useState(null)
  const [godHandTex, setGodHandTex] = useState(null)

  const isAnimating = useRef(false)
  const [{ leftX, rightX }, api] = useSpring(() => ({
    leftX: -1.3,
    rightX: 1.3,
  }))
  const planeArgs = useMemo(() => [2, 1.5], [])

  // Load Adam hand texture
  useEffect(() => {
    const loader = new TextureLoader()
    loader.load("/textures/adam-hand.png", setAdamHandTex)
  }, [])

  // Load God hand texture
  useEffect(() => {
    const loader = new TextureLoader()
    loader.load("/textures/god-hand.png", setGodHandTex)
  }, [])

  const handleClick = () => {
    if (isAnimating.current) return
    isAnimating.current = true

    api.start({
      leftX: -0.975,
      rightX: 0.975,
      config: { tension: 60, friction: 80 },
      onRest: () => {
        api.start({
          leftX: -1.3,
          rightX: 1.3,
          config: { tension: 60, friction: 50 },
          onRest: () => {
            isAnimating.current = false
          },
        })
      },
    })
  }

  if (!adamHandTex || !godHandTex) return null // wait until both textures are loaded

  return (
    <group>
      {/* God hand */}
      <animated.mesh position-x={rightX} onClick={handleClick}>
        <planeGeometry args={planeArgs} />
        <meshBasicMaterial map={godHandTex} transparent />
      </animated.mesh>

      {/* Adam hand */}
      <animated.mesh position-x={leftX} rotation={[0, 0, 0.2]} onClick={handleClick}>
        <planeGeometry args={planeArgs} />
        <meshBasicMaterial map={adamHandTex} transparent />
      </animated.mesh>
    </group>
  )
}

export default React.memo(GodsHand)
