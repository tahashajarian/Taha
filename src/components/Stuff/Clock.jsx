
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

const Clock = (props)  => {
  const { nodes, materials } = useGLTF('/models/clock.glb', '/draco/')
  return (
    <group {...props} dispose={null}>
      <group scale={0.005}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.repaired_meltedmeltingclock.geometry}
          material={materials.white}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.repaired_meltedmeltingclock_1.geometry}
          material={materials.black}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.repaired_meltedmeltingclock_2.geometry}
          material={materials.orange}
        />
      </group>
    </group>
  )
}

useGLTF.preload('/models/clock.glb', '/draco/')
export default Clock;