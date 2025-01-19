
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

const Fireplace = (props) => {
  const { nodes, materials } = useGLTF('/models/fireplace.glb')
  return (
    <group {...props} rotation={[0, Math.PI, 0]} scale={[2, 1, 1]} dispose={null}>
      <group  scale={8.404}>
        <group  scale={0.01}>
          <mesh
            geometry={nodes.fireplace_fireplace_0.geometry}
            material={materials.fireplace}
            scale={12}
          />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/models/fireplace.glb')

export default Fireplace