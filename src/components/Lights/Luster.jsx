import React, { useState, useMemo } from "react"
import { useGLTF } from "@react-three/drei"
import { MeshStandardMaterial } from "three"
import { wallHeight } from "../../constances/constances"
import { useGraphicsSettings } from "../../stores/useGraphicsSettings"

const Luster = (props) => {
  const { nodes, materials } = useGLTF("/models/luster.glb", "/draco/")
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
        emissiveIntensity: 4,
        clipShadows: false,
      }),
    []
  )

  shinyEmissiveMaterial.emissiveIntensity = lampIsOn ? 4 : 0

  const handleOnClick = () => setLampIsOn((v) => !v)

  return (
    <group {...props} dispose={null} onClick={handleOnClick}>
      <directionalLight
        position={[0, wallHeight, 0]}
        intensity={lampIsOn ? 2 : 0}
        shadow-mapSize-width={!isLowQuality ? 1024 : 0}
        shadow-mapSize-height={!isLowQuality ? 1024 : 0}
      />

      <group rotation={[-Math.PI, 0, 0]} scale={0.025}>
        <mesh geometry={nodes.Mesh.geometry} material={materials.Body} />
        <mesh
          geometry={nodes.Mesh_1.geometry}
          material={shinyEmissiveMaterial}
        />
      </group>
    </group>
  )
}

useGLTF.preload("/models/luster.glb", "/draco/")
export default Luster
