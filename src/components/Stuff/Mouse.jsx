import React, { memo } from "react"
import { useGLTF } from "@react-three/drei"

const Mouse = (props) => {
  const { nodes, materials } = useGLTF("/models/mouse.glb", "/draco/")

  return (
    <group {...props} dispose={null}>
      <group position={[0, 0.022, 0]} rotation={[Math.PI / 2, 0, 0]} scale={1.6}>
        <mesh
          geometry={nodes.Cube001.geometry}
          material={materials["Material.001"]}
          castShadow={false}
          receiveShadow={false}
        />
        <mesh
          geometry={nodes.Cube001_1.geometry}
          material={materials["Material.002"]}
          castShadow={false}
          receiveShadow={false}
        />
      </group>
    </group>
  )
}

useGLTF.preload("/models/mouse.glb", "/draco/")
export default memo(Mouse)
