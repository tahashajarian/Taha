import React, { useRef, useMemo, useEffect } from "react"
import { useGLTF, useTexture } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

const PARTICLE_COUNT = 50
const tmpMatrix = new THREE.Matrix4() // reusable rotation matrix

export default function Mug(props) {
  const { nodes } = useGLTF("/models/mug.glb", "/draco/")
  const group = useRef()
  const particlesRef = useRef()

  // Persistent particle data
  const particlesData = useRef(
    Array.from({ length: PARTICLE_COUNT }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 0.1,
        Math.random() * 0.1,
        (Math.random() - 0.5) * 0.1
      ),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.002,
        0.002 + Math.random() * 0.001,
        (Math.random() - 0.5) * 0.002
      ),
      rotationSpeed: (Math.random() - 0.5) * 0.0005,
      life: Math.random() * 100 + 50,
    }))
  )

  // Geometry (positions only)
  const particleGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(PARTICLE_COUNT * 3), 3)
    )
    return geometry
  }, [])

  const particleTexture = useTexture("/textures/smoke.png")

  const particleMaterial = useMemo(
    () =>
      new THREE.PointsMaterial({
        size: 0.1,
        map: particleTexture,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        opacity: 0.2,
      }),
    [particleTexture]
  )

  // initialize positions once
  useEffect(() => {
    const pos = particleGeometry.attributes.position.array
    particlesData.current.forEach((p, i) => {
      pos[i * 3] = p.position.x
      pos[i * 3 + 1] = p.position.y
      pos[i * 3 + 2] = p.position.z
    })
    particleGeometry.attributes.position.needsUpdate = true
  }, [particleGeometry])

  // Animate particles
  useFrame(() => {
    const pos = particleGeometry.attributes.position.array

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = particlesData.current[i]
      p.position.add(p.velocity)

      // apply small Y rotation using reusable matrix
      tmpMatrix.makeRotationY(p.rotationSpeed)
      p.velocity.applyMatrix4(tmpMatrix)

      if (p.position.y > 0.9 || p.life <= 0) {
        p.position.set(
          (Math.random() - 0.5) * 0.1,
          Math.random() * 0.1,
          (Math.random() - 0.5) * 0.1
        )
        p.velocity.set(
          (Math.random() - 0.5) * 0.002,
          0.002 + Math.random() * 0.001,
          (Math.random() - 0.5) * 0.002
        )
        p.life = Math.random() * 100 + 50
      }

      p.life -= 1

      pos[i * 3] = p.position.x
      pos[i * 3 + 1] = p.position.y
      pos[i * 3 + 2] = p.position.z
    }

    particleGeometry.attributes.position.needsUpdate = true
  })

  return (
    <group {...props} ref={group} dispose={null} scale={0.6} rotation={[0, Math.PI / 2, 0]}>
      <mesh castShadow receiveShadow geometry={nodes.Mug.geometry} material={nodes.Mug.material} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <circleGeometry args={[0.079, 16]} />
        <meshStandardMaterial color="#6F4F37" />
      </mesh>

      <points ref={particlesRef} geometry={particleGeometry} material={particleMaterial} />
    </group>
  )
}

useGLTF.preload("/models/mug.glb", "/draco/")
