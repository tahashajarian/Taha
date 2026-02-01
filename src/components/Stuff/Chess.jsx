import React from 'react'
import { useGLTF } from '@react-three/drei'

export function Chess(props) {
  const { nodes, materials } = useGLTF('/models/chess.glb')

  // Map of all meshes
  const whitePieces = [
    'Alfil_Circle011','knight','Peon_Circle005','queen','Rey_Circle007',
    'Torre_Circle010','Caballo_Circle001','Alfil_Circle001','Torre_Circle001',
    'Peon_Circle001','Peon_Circle002','Peon_Circle003','Peon_Circle004',
    'Peon_Circle006','Peon_Circle007','Peon_Circle008'
  ]
  
  const blackPieces = [
    'Alfil_Circle002','Caballo_Circle002','pawn','queenB','Rey_Circle001',
    'Torre_Circle002','Caballo_Circle003','Alfil_Circle003','Torre_Circle003',
    'Peon_Circle010','Peon_Circle011','Peon_Circle012','Peon_Circle013',
    'Peon_Circle014','Peon_Circle015','Peon_Circle016'
  ]

  const otherMeshes = [
    ['Cube002','Material.007'],
    ['Cube002_1','Material.009'],
    ['Cube002_2','Material.019']
  ]

  return (
    <group {...props} dispose={null} scale={1.5} position={[-0.3, 1.18, 0]} rotation={[0, Math.PI , 0]}>
      {whitePieces.map(name => (
        <mesh key={name} geometry={nodes[name].geometry} material={materials.WHITE} castShadow receiveShadow />
      ))}
      {blackPieces.map(name => (
        <mesh key={name} geometry={nodes[name].geometry} material={materials.BLACK} castShadow receiveShadow />
      ))}
      {otherMeshes.map(([name, mat]) => (
        <mesh key={name} geometry={nodes[name].geometry} material={materials[mat]} castShadow receiveShadow />
      ))}
    </group>
  )
}

useGLTF.preload('/models/chess.glb')
