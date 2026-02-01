import React, { useRef, useEffect, useCallback } from "react"
import { useGLTF, useAnimations } from "@react-three/drei"
import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"
import Taha from "./Taha"
import { useCharacterAnimationsStore } from "../../stores/useCharacterAnimationsStore"
import { useArrowsStore } from "../../stores/useArrowStore"
import { useAppStatusStore } from "../../stores/useAppStatusStore"
import { useArrowControls } from "../../hooks/useArrowControls"

const roomMinX = -5.5
const roomMaxX = 5.5
const roomMinZ = -5.5
const roomMaxZ = 5.5

const TahaContainer = (props) => {
  const group = useRef(null)
  const currentActionRef = useRef(null)
  const currentActionName = useRef("")

  const { nodes, materials, animations } = useGLTF("/models/Taha.glb")
  const { actions, names } = useAnimations(animations, group)

  const {
    setAnimations,
    animation,
    setAnimation,
    position,
    setPosition,
    rotation,
    setRotation
  } = useCharacterAnimationsStore()

  const { backward, forward, left, right } = useArrowsStore()
  const { camera } = useThree()
  const { modalIsOpen } = useAppStatusStore()

  const resetArrows = useArrowsStore.getState().resetArrows

  useArrowControls()

  const speed = 2.2

  // store animation names
  useEffect(() => {
    if (setAnimations) setAnimations(names)
  }, [names, setAnimations])

  // update animation based on input
  const updateAnimation = useCallback(() => {
    if (modalIsOpen) return

    if (right || left || forward || backward) {
      setAnimation("walk")
    } else if (animation !== "typing") {
      setAnimation("idle") // idle when no keys pressed
    }
  }, [right, left, forward, backward, setAnimation, animation, modalIsOpen])

  useEffect(() => {
    updateAnimation()
  }, [updateAnimation])

  // handle action fade in/out & always play
  useEffect(() => {
    if (!actions) return
    const nextAction = actions[animation]
    if (!nextAction) return

    // typing resets position & rotation
    if (animation === "typing") {
      resetArrows?.()
      const zeroPos = [0, 0, 0]
      const zeroRot = [0, 0, 0]
      setPosition?.(zeroPos)
      setRotation?.(zeroRot)
      group.current?.position.set(...zeroPos)
      group.current?.rotation.set(...zeroRot)
    }

    const prevAction = currentActionRef.current
    if (prevAction !== nextAction) {
      prevAction?.fadeOut(0.2)
      nextAction.reset().fadeIn(0.2).play()
      currentActionRef.current = nextAction
      currentActionName.current = animation
    } else {
      // keep playing current action
      nextAction.play()
    }
  }, [animation, actions, resetArrows, setPosition, setRotation])

  // force typing on mount
  useEffect(() => {
    setAnimation("typing")
  }, [setAnimation])

  // character movement
  useFrame((state, delta) => {
    if (modalIsOpen) return

    const direction = [0, 0, 0]
    if (forward) direction[2] += speed * delta
    if (backward) direction[2] -= speed * delta
    if (left) direction[0] += speed * delta
    if (right) direction[0] -= speed * delta

    const cameraDirection = camera.getWorldDirection(new THREE.Vector3())
    const cameraRight = new THREE.Vector3()
    cameraRight.crossVectors(camera.up, cameraDirection).normalize()

    const transformedDirection = new THREE.Vector3()
      .addScaledVector(cameraDirection, direction[2])
      .addScaledVector(cameraRight, direction[0])

    const newPosition = [
      position[0] + transformedDirection.x,
      position[1],
      position[2] + transformedDirection.z
    ]

    // keep within bounds
    if (
      newPosition[0] < roomMinX ||
      newPosition[0] > roomMaxX ||
      newPosition[2] < roomMinZ ||
      newPosition[2] > roomMaxZ
    ) return

    setPosition(newPosition)
    group.current.position.set(...newPosition)

    // rotate character towards movement
    if (forward || backward || left || right) {
      const angle = Math.atan2(transformedDirection.x, transformedDirection.z)
      setRotation([0, angle, 0])
    }
  })

  // apply rotation & camera look
  useEffect(() => {
    group.current?.rotation.set(...rotation)
    camera.lookAt(
      new THREE.Vector3(
        group.current.position.x,
        group.current.position.y + 0.7,
        group.current.position.z
      )
    )
  }, [position, rotation, camera])

  return <Taha charRef={group} materials={materials} nodes={nodes} {...props} />
}

useGLTF.preload("/models/Taha.glb")
export default TahaContainer
