import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

const Mouse = (props) => {
  const { nodes, materials } = useGLTF("/models/mouse.glb");
  return (
    <group {...props} dispose={null}>
      <group position={[0, 0.022, 0]} rotation={[Math.PI / 2, 0, 0]} scale={1.6}>
        <mesh
          
          castShadow
        receiveShadow
          geometry={nodes.Cube001.geometry}
          material={materials['Material.001']}
        />
        <mesh
          
          castShadow
        receiveShadow
          geometry={nodes.Cube001_1.geometry}
          material={materials['Material.002']}
        />
      </group>
    </group>
  )
};

useGLTF.preload('/models/mouse.glb')

export default Mouse;