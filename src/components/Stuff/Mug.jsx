import React, { useRef, useEffect, useMemo } from "react"
import { useGLTF, useTexture } from "@react-three/drei"
import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"
import { useGraphicsSettings } from "../../stores/useGraphicsSettings"

const PARTICLE_COUNT = 32
const STEAM_SOURCE_Y = 0.06
const MAX_FRAME_DELTA = 1 / 24
const MUG_ART_URL = "/textures/mug-metal-art-v1.jpg"

useTexture.preload(MUG_ART_URL)

const createSteamParticle = () => ({
  position: new THREE.Vector3(),
  baseX: 0,
  baseZ: 0,
  age: 0,
  lifeSpan: 0,
  riseHeight: 0,
  driftAmp: 0,
  driftFreq: 0,
  swirlAmp: 0,
  swirlFreq: 0,
  phase: 0,
  sizeStart: 0,
  sizeEnd: 0,
  opacityPeak: 0,
  rotationFactor: 0,
  sprite: null,
})

const resetSteamParticle = (particle, randomizeAge = false) => {
  const angle = Math.random() * Math.PI * 2
  const radius = 0.005 + Math.random() * 0.02

  particle.baseX = Math.cos(angle) * radius
  particle.baseZ = Math.sin(angle) * radius
  particle.lifeSpan = 3.8 + Math.random() * 2.2
  particle.age = randomizeAge ? Math.random() * particle.lifeSpan : 0
  particle.riseHeight = 0.3 + Math.random() * 0.18
  particle.driftAmp = 0.012 + Math.random() * 0.015
  particle.driftFreq = 0.35 + Math.random() * 0.35
  particle.swirlAmp = 0.005 + Math.random() * 0.008
  particle.swirlFreq = 0.6 + Math.random() * 0.5
  particle.phase = Math.random() * Math.PI * 2
  particle.sizeStart = 0.036 + Math.random() * 0.02
  particle.sizeEnd = particle.sizeStart * (1.7 + Math.random() * 0.7)
  particle.opacityPeak = 0.14 + Math.random() * 0.1
  particle.rotationFactor = (Math.random() - 0.5) * 0.28
  particle.position.set(particle.baseX, STEAM_SOURCE_Y, particle.baseZ)
}

export default function Mug(props) {
  const { nodes } = useGLTF("/models/mug.glb", "/draco/")
  const { gl } = useThree()
  const quality = useGraphicsSettings((s) => s.quality)
  const group = useRef()
  const renderedLastFrameRef = useRef(true)
  const sourceMugTexture = useTexture(MUG_ART_URL)
  const mugTexture = useMemo(() => {
    const texture = sourceMugTexture.clone()
    texture.colorSpace = THREE.SRGBColorSpace
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.ClampToEdgeWrapping
    texture.flipY = false
    texture.needsUpdate = true
    return texture
  }, [sourceMugTexture])
  const mugMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#ffffff",
        map: mugTexture,
        roughness: 0.48,
        metalness: 0.12,
      }),
    [mugTexture]
  )
  const steamParticles = useRef(
    Array.from({ length: PARTICLE_COUNT }, () => {
      const particle = createSteamParticle()
      resetSteamParticle(particle, true)
      return particle
    })
  )

  const smokeTexture = useTexture("/textures/smoke.png")

  useEffect(() => {
    smokeTexture.generateMipmaps = true
    smokeTexture.magFilter = THREE.LinearFilter
    smokeTexture.minFilter = THREE.LinearMipmapLinearFilter
    smokeTexture.anisotropy = Math.min(4, gl.capabilities.getMaxAnisotropy())
    smokeTexture.needsUpdate = true
  }, [gl, smokeTexture])

  useEffect(
    () => () => {
      mugMaterial.dispose()
      mugTexture.dispose()
    },
    [mugMaterial, mugTexture]
  )

  useFrame(({ clock }, delta) => {
    const wasRendered = renderedLastFrameRef.current
    renderedLastFrameRef.current = false
    // Skip steam animation only on ultra-low quality
    if (quality === "ultra-low" || !wasRendered) return

    const dt = Math.min(delta, MAX_FRAME_DELTA)
    const elapsed = clock.elapsedTime

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const particle = steamParticles.current[i]
      const sprite = particle.sprite
      if (!sprite) continue

      particle.age += dt
      if (particle.age >= particle.lifeSpan) {
        resetSteamParticle(particle)
      }

      const lifeT = particle.age / particle.lifeSpan
      const lift = lifeT * lifeT
      const spread = 1 + lift * 2.1
      const driftX =
        Math.sin(elapsed * particle.driftFreq + particle.phase) * particle.driftAmp * spread
      const driftZ =
        Math.cos(elapsed * (particle.driftFreq * 0.87) + particle.phase) *
        particle.driftAmp *
        spread
      const swirlPhase = elapsed * particle.swirlFreq + particle.phase
      const swirlX = Math.cos(swirlPhase + lifeT * 5.5) * particle.swirlAmp * lift
      const swirlZ = Math.sin(swirlPhase * 1.1 + lifeT * 4.6) * particle.swirlAmp * lift

      particle.position.x = particle.baseX + driftX + swirlX
      particle.position.y = STEAM_SOURCE_Y + lift * particle.riseHeight
      particle.position.z = particle.baseZ + driftZ + swirlZ

      const fadeIn = THREE.MathUtils.smoothstep(lifeT, 0, 0.18)
      const fadeOut = 1 - THREE.MathUtils.smoothstep(lifeT, 0.62, 1)
      const middleBoost = 0.78 + (1 - Math.abs(lifeT - 0.5) * 2) * 0.22
      const opacity = Math.min(fadeIn, fadeOut) * middleBoost * particle.opacityPeak
      const width = THREE.MathUtils.lerp(particle.sizeStart, particle.sizeEnd, lifeT)
      const height = width * THREE.MathUtils.lerp(1.2, 1.55, lifeT)

      sprite.position.copy(particle.position)
      sprite.scale.set(width, height, 1)
      sprite.material.opacity = opacity
      sprite.material.rotation = Math.sin(swirlPhase * 0.8) * particle.rotationFactor
    }
  })

  return (
    <group {...props} ref={group} dispose={null} scale={0.6} rotation={[0, Math.PI / 2, 0]}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Mug.geometry}
        material={mugMaterial}
        onBeforeRender={() => { renderedLastFrameRef.current = true }}
      />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <circleGeometry args={[0.079, 16]} />
        <meshStandardMaterial color="#6F4F37" />
      </mesh>

      <group>
        {steamParticles.current.map((particle, i) => (
          <sprite
            key={i}
            ref={(node) => {
              particle.sprite = node
            }}
            position={particle.position}
          >
            <spriteMaterial
              map={smokeTexture}
              color="#dbe1ea"
              transparent
              alphaTest={0.007}
              depthWrite={false}
              blending={THREE.NormalBlending}
              toneMapped={false}
              opacity={0}
            />
          </sprite>
        ))}
      </group>
    </group>
  )
}

useGLTF.preload("/models/mug.glb", "/draco/")
