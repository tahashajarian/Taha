import React, { useRef, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

const Bird = ({ seed =1}) => {
  const { nodes, materials } = useGLTF('/models/bird.glb', '/draco/')
  const groupRef = useRef()
  const offset = useMemo(() => seed, []) // Unique offset per instance

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = Math.cos(state.clock.elapsedTime + offset)
    }
  })

  return (
    <group ref={groupRef} dispose={null} scale={0.04}>
      <group rotation={[Math.PI / 2, 0, Math.PI / 2]}>
        <mesh geometry={nodes.Mesh.geometry} material={materials.lambert3} />
        <mesh geometry={nodes.Mesh_1.geometry} material={materials.lambert4} />
        <mesh geometry={nodes.Mesh_2.geometry} material={materials.lambert5} />
        <mesh geometry={nodes.Mesh_3.geometry} material={materials.lambert6} />
      </group>
    </group>
  )
}

export default Bird

useGLTF.preload('/models/bird.glb', '/draco/')
