import React, { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { useGLTF } from "@react-three/drei"
import * as THREE from "three"
import { wallHeight, wallSize } from "../../constances/constances"
import { useGraphicsSettings } from "../../stores/useGraphicsSettings"

const INNER_ROTATION = new THREE.Quaternion().setFromEuler(
  new THREE.Euler(Math.PI / 2, 0, Math.PI / 2),
)
const FLAP_AXIS = new THREE.Vector3(1, 0, 0)
const BIRD_SCALE = new THREE.Vector3(0.04, 0.04, 0.04)

const fillFormation = (formation, count, baseRadius) => {
  const radius = count < 3 ? baseRadius * 0.35 : baseRadius + count * 0.1
  const ySpread = count * 0.2
  for (let index = 0; index < count; index += 1) {
    const angle = (index / count) * Math.PI * 2
    const offset = index * 3
    formation[offset] = count === 1 ? 0 : Math.cos(angle) * radius
    formation[offset + 1] = (Math.random() - 0.5) * ySpread
    formation[offset + 2] = count === 1 ? 0 : Math.sin(angle) * radius
  }
}

const Birds = ({ baseRadius = 1.5, speed = 2.5 }) => {
  const { nodes, materials } = useGLTF("/models/bird.glb", "/draco/")
  const quality = useGraphicsSettings((state) => state.quality)
  const maxCount = quality === "high" ? 9 : 6
  const groupRef = useRef()
  const meshRefs = useRef([])
  const formationRef = useRef(new Float32Array(9 * 3))
  const flightRef = useRef({
    activeCount: Math.floor(Math.random() * maxCount) + 1,
    delay: 0,
    initialized: false,
    x: 6,
  })
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const flapRotation = useMemo(() => new THREE.Quaternion(), [])
  const birdParts = useMemo(
    () => [
      [nodes.Mesh.geometry, materials.lambert3],
      [nodes.Mesh_1.geometry, materials.lambert4],
      [nodes.Mesh_2.geometry, materials.lambert5],
      [nodes.Mesh_3.geometry, materials.lambert6],
    ],
    [materials, nodes],
  )

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime
    const group = groupRef.current
    if (!group || meshRefs.current.some((mesh) => !mesh)) return
    const flight = flightRef.current

    if (!flight.initialized) {
      flight.activeCount = Math.min(flight.activeCount, maxCount)
      fillFormation(formationRef.current, flight.activeCount, baseRadius)
      group.position.z = wallSize / 2 + 4 + Math.random() * 2.8
      flight.initialized = true
    }

    if (flight.delay > 0) {
      flight.delay -= Math.min(delta, 0.1)
      group.visible = false
      return
    }

    if (!group.visible) {
      flight.activeCount = Math.floor(Math.random() * maxCount) + 1
      fillFormation(formationRef.current, flight.activeCount, baseRadius)
      group.position.z = wallSize / 2 + 4 + Math.random() * 2.8
      flight.x = 6
      group.visible = true
    }

    flight.x -= speed * Math.min(delta, 0.1)
    group.position.x = flight.x
    if (flight.x < -6) {
      flight.delay = 1.5 + Math.random() * 6.5
      return
    }

    for (let index = 0; index < maxCount; index += 1) {
      const offset = index * 3
      dummy.position.set(
        formationRef.current[offset],
        formationRef.current[offset + 1],
        formationRef.current[offset + 2],
      )
      if (index < flight.activeCount) {
        flapRotation.setFromAxisAngle(FLAP_AXIS, Math.cos(time + index * 0.37))
        dummy.quaternion.copy(flapRotation).multiply(INNER_ROTATION)
        dummy.scale.copy(BIRD_SCALE)
      } else {
        dummy.scale.setScalar(0)
      }
      dummy.updateMatrix()

      for (let part = 0; part < meshRefs.current.length; part += 1) {
        meshRefs.current[part].setMatrixAt(index, dummy.matrix)
      }
    }

    for (let part = 0; part < meshRefs.current.length; part += 1) {
      meshRefs.current[part].instanceMatrix.needsUpdate = true
    }
  })

  return (
    <group
      ref={groupRef}
      position={[6, wallHeight / 2, wallSize / 2 + 4]}
    >
      {birdParts.map(([geometry, material], index) => (
        <instancedMesh
          key={geometry.uuid}
          ref={(mesh) => {
            meshRefs.current[index] = mesh
            mesh?.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
          }}
          args={[geometry, material, maxCount]}
          castShadow={false}
          receiveShadow={false}
        />
      ))}
    </group>
  )
}

export default Birds

useGLTF.preload("/models/bird.glb", "/draco/")
