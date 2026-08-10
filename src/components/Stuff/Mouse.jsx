import React, { memo, useRef } from "react"
import { useGLTF } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { useCharacterAnimationsStore } from "../../stores/useCharacterAnimationsStore"

const fingertipWorld = new THREE.Vector3()
const palmControlWorld = new THREE.Vector3()
const mouseWorld = new THREE.Vector3()
const anchorWorld = new THREE.Vector3()
const targetWorld = new THREE.Vector3()
const targetLocal = new THREE.Vector3()

const MAX_MOUSE_X = 0.11
const MAX_MOUSE_Z = 0.09
const FINGERTIP_ATTACH_DISTANCE = 0.12
const FINGERTIP_RELEASE_DISTANCE = FINGERTIP_ATTACH_DISTANCE * 1.6
const FOLLOW_DAMPING = 14

const dampMouseHome = (group, smoothing) => {
  group.position.x = THREE.MathUtils.lerp(group.position.x, 0, smoothing)
  group.position.z = THREE.MathUtils.lerp(group.position.z, 0, smoothing)
}

const Mouse = (props) => {
  const { nodes, materials } = useGLTF("/models/mouse.glb", "/draco/")
  const { nodes: characterNodes } = useGLTF("/models/Taha.glb", "/draco/")
  const fingertip = characterNodes.RightHandIndex4
  const palmControl = characterNodes.RightHandMiddle1
  const animation = useCharacterAnimationsStore((s) => s.animation)
  const groupRef = useRef(null)
  const trackingRef = useRef({ attached: false, offsetX: 0, offsetZ: 0 })

  useFrame((_, delta) => {
    const group = groupRef.current
    const parent = group?.parent
    if (!group || !fingertip || !palmControl || !parent) {
      trackingRef.current.attached = false
      return
    }

    const smoothing = 1 - Math.exp(-FOLLOW_DAMPING * Math.min(delta, 0.05))

    if (animation !== "typing") {
      trackingRef.current.attached = false
      dampMouseHome(group, smoothing)
      return
    }

    fingertip.getWorldPosition(fingertipWorld)
    palmControl.getWorldPosition(palmControlWorld)
    group.getWorldPosition(mouseWorld)
    anchorWorld.set(0, group.position.y, 0)
    parent.localToWorld(anchorWorld)

    const fingertipDistance = fingertipWorld.distanceTo(anchorWorld)
    const tracking = trackingRef.current

    if (!tracking.attached) {
      if (fingertipDistance > FINGERTIP_ATTACH_DISTANCE) {
        dampMouseHome(group, smoothing)
        return
      }
      tracking.attached = true
      tracking.offsetX = mouseWorld.x - palmControlWorld.x
      tracking.offsetZ = mouseWorld.z - palmControlWorld.z
    } else if (fingertipDistance > FINGERTIP_RELEASE_DISTANCE) {
      tracking.attached = false
      dampMouseHome(group, smoothing)
      return
    }

    targetWorld.set(
      palmControlWorld.x + tracking.offsetX,
      mouseWorld.y,
      palmControlWorld.z + tracking.offsetZ,
    )
    targetLocal.copy(targetWorld)
    parent.worldToLocal(targetLocal)
    targetLocal.x = THREE.MathUtils.clamp(
      targetLocal.x,
      -MAX_MOUSE_X,
      MAX_MOUSE_X,
    )
    targetLocal.z = THREE.MathUtils.clamp(
      targetLocal.z,
      -MAX_MOUSE_Z,
      MAX_MOUSE_Z,
    )

    group.position.x = THREE.MathUtils.lerp(
      group.position.x,
      targetLocal.x,
      smoothing,
    )
    group.position.z = THREE.MathUtils.lerp(
      group.position.z,
      targetLocal.z,
      smoothing,
    )
  })

  return (
    <group ref={groupRef} {...props} dispose={null}>
      <group
        position={[0, 0.022, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={1.6}
      >
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
