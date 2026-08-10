import React, { useEffect, useMemo, useRef } from "react"
import { useGLTF } from "@react-three/drei"
import { a } from "@react-spring/three"
import { useChessController } from "./useChessAnimation"
import MoveFeedback from "./MoveFeedBack"

export function Chess({ moveDuration = 600, ...props }) {
  const { nodes, materials } = useGLTF("/models/chess.glb")

  const queenRef = useRef()
  const pawnRef = useRef()
  const queenBRef = useRef()
  const knightRef = useRef()
  const kingPivot = useMemo(() => {
    const geometry = nodes.Rey_Circle001.geometry
    geometry.computeBoundingBox()
    const bounds = geometry.boundingBox
    const offset = [bounds?.max.x ?? 0, bounds?.min.y ?? 0, 0]
    return {
      offset,
      position: [
        nodes.Rey_Circle001.position.x + offset[0],
        nodes.Rey_Circle001.position.y + offset[1],
        nodes.Rey_Circle001.position.z,
      ],
    }
  }, [nodes])

  const {
    queenSpring,
    pawnSpring,
    queenBSpring,
    knightSpring,
    kingBSpring,
    feedbacks,
  } = useChessController({
    nodes,
    moveDuration,
    kingPivotPosition: kingPivot.position,
  })

  useEffect(() => {
    if (queenBRef.current) queenBRef.current.scale.set(1.02, 1.02, 1.02)
  }, [])

  return (
    <group
      {...props}
      scale={1.5}
      position={[-0.3, 1.12, 0]}
      rotation={[0, Math.PI, 0]}
      dispose={null}
    >
      {/* Main pieces */}
      <a.mesh
        ref={queenRef}
        geometry={nodes.queen.geometry}
        material={materials.WHITE}
        position={queenSpring.position}
        rotation={queenSpring.rotation}
        scale={queenSpring.scale}
      />
      <a.mesh
        ref={knightRef}
        geometry={nodes.knight.geometry}
        material={materials.WHITE}
        position={knightSpring.position}
      />
      <a.mesh
        ref={pawnRef}
        geometry={nodes.pawn.geometry}
        material={materials.BLACK}
        position={pawnSpring.position}
      />
      <a.mesh
        ref={queenBRef}
        geometry={nodes.queenB.geometry}
        material={materials.BLACK}
        position={queenBSpring.position}
      />

      {/* Other static pieces */}
      {[
        "Alfil_Circle011",
        "Peon_Circle005",
        "Rey_Circle007",
        "Torre_Circle010",
        "Caballo_Circle001",
        "Alfil_Circle001",
        "Torre_Circle001",
        "Peon_Circle001",
        "Peon_Circle002",
        "Peon_Circle003",
        "Peon_Circle004",
        "Peon_Circle006",
        "Peon_Circle007",
        "Peon_Circle008",
      ].map((n) => (
        <mesh key={n} geometry={nodes[n].geometry} material={materials.WHITE} position={nodes[n].position} />
      ))}

      {[
        "Alfil_Circle002",
        "Caballo_Circle002",
        "Rey_Circle001",
        "Torre_Circle002",
        "Caballo_Circle003",
        "Alfil_Circle003",
        "Torre_Circle003",
        "Peon_Circle010",
        "Peon_Circle011",
        "Peon_Circle012",
        "Peon_Circle013",
        "Peon_Circle014",
        "Peon_Circle015",
        "Peon_Circle016",
      ].map((n) =>
        n === "Rey_Circle001" ? (
          <a.group
            key={n}
            position={kingBSpring.position}
            rotation={kingBSpring.rotation}
          >
            <mesh
              geometry={nodes[n].geometry}
              material={materials.BLACK}
              position={[-kingPivot.offset[0], -kingPivot.offset[1], 0]}
            />
          </a.group>
        ) : (
          <mesh key={n} geometry={nodes[n].geometry} material={materials.BLACK} position={nodes[n].position} />
        )
      )}

      {[
        ["Cube002", "Material.007"],
        ["Cube002_1", "Material.009"],
        ["Cube002_2", "Material.019"],
      ].map(([n, m]) => (
        <mesh key={n} geometry={nodes[n].geometry} material={materials[m]} position={nodes[n].position} />
      ))}

      {/* Move feedbacks */}
      {feedbacks.map((fb) => (
        <MoveFeedback
          key={fb.id}
          position={fb.position}
          texture={fb.texture} // pass THREE.Texture object directly
          duration={fb.durationMs / 1000}
        />
      ))}
    </group>
  )
}

useGLTF.preload("/models/chess.glb", "/draco/")
