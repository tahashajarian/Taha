
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

const Keyboard = (props) => {
  const { nodes, materials } = useGLTF('/models/keyboard.glb')
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube.geometry}
        material={materials.klawisze}
        scale={1}
        rotation={[0, Math.PI/2, 0]}
      />
    </group>
  )
}

useGLTF.preload('/models/keyboard.glb')

export default Keyboard;