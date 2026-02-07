import React, { useRef, useState, useEffect } from "react"
import { TextureLoader, RepeatWrapping } from "three"
import { wallHeight, wallSize } from "../../constances/constances"
import { Text } from "@react-three/drei"

const TheWallWallPaper = () => {
  const ref = useRef()
  const [texture, setTexture] = useState(null)
  const fontURL = "/fonts/Floydian-v177.ttf"

  // Async texture loading
  useEffect(() => {
    const loader = new TextureLoader()
    loader.load(
      "/textures/brick.png",
      (loaded) => {
        loaded.wrapS = RepeatWrapping
        loaded.wrapT = RepeatWrapping
        loaded.repeat.set(3, 2)
        setTexture(loaded)
      },
      undefined,
      (err) => console.error("Texture load failed:", err)
    )
  }, [])

  if (!texture) return null // wait until texture is loaded

  return (
    <>
      <Text
        font={fontURL}
        rotation={[0, 0, 0]}
        position={[0, 0.2, 0.05]}
        fontSize={0.5}
        color="red"
        textAlign="center"
        fillOpacity={0.8}
      >
        {`Pink

Floyd

The

Wall`}
      </Text>

      <mesh position={[0, 0, 0]} ref={ref} receiveShadow>
        <planeGeometry args={[wallSize, wallHeight]} />
        <meshBasicMaterial map={texture} transparent opacity={0.2} />
      </mesh>

      <Text
        font={fontURL}
        rotation={[0, 0, 0]}
        position={[-4, 1.3, 0.1]}
        fontSize={0.2}
        color="red"
        textAlign="left"
        fillOpacity={1}
      >
        {`
        All alone, or in two,
        
        the wall was too high
        
        as you can see.
        `}
      </Text>
    </>
  )
}

export default React.memo(TheWallWallPaper)
