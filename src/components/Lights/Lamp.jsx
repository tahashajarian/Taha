import React, { useState, useMemo } from "react"
import { useGLTF } from "@react-three/drei"
import { MeshStandardMaterial } from "three"
import { useGraphicsSettings } from "../../stores/useGraphicsSettings"

const Lamp = (props) => {
  const { nodes, materials } = useGLTF("/models/lamp.glb")
  const [lampIsOn, setLampIsOn] = useState(true)
  const { quality } = useGraphicsSettings()

  const isLowQuality = quality === "low" || quality === "ultra-low"

  const shinyEmissiveMaterial = useMemo(
    () =>
      new MeshStandardMaterial({
        color: 0xffaaaa,
        roughness: 0.1,
        metalness: 0.9,
        emissive: 0xffaaaa,
        emissiveIntensity: 1,
      }),
    []
  )

  // update emissive without recreating material
  shinyEmissiveMaterial.emissiveIntensity = lampIsOn ? 1 : 0

  const handleOnClick = () => setLampIsOn((v) => !v)

  return (
    <group {...props} dispose={null} scale={0.3} onClick={handleOnClick}>
      <group position={[0.5, 3.4, 0.66]} scale={[0.875, 1.5, 0.875]}>
        <mesh
          geometry={nodes.Цилиндр012.geometry}
          material={shinyEmissiveMaterial}
        />
        <mesh
          geometry={nodes.Цилиндр012_1.geometry}
          material={materials["Matte Black"]}
        />
      </group>

      <pointLight
        position={[0, 4, 0]}
        color="#ffaaaa"
        distance={4}
        decay={0.5}
        power={10}
        intensity={lampIsOn ? 8 : 0}
        castShadow={!isLowQuality}
        shadow-mapSize-width={!isLowQuality ? 1024 : 0}
        shadow-mapSize-height={!isLowQuality ? 1024 : 0}
      />
    </group>
  )
}

useGLTF.preload("/models/lamp.glb")
export default Lamp
