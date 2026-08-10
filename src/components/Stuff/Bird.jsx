import React from 'react'
import { useGLTF } from '@react-three/drei'

const Bird = ({ groupRef }) => {
  const { nodes, materials } = useGLTF('/models/bird.glb', '/draco/')

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
