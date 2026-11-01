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

// All steam puffs render as one Points draw call. The shader reproduces what
// the old per-puff SpriteMaterial did: a camera-facing rectangle with its own
// size, aspect, screen-space rotation and opacity.
const steamVertexShader = /* glsl */ `
  attribute vec2 aSize;
  attribute float aOpacity;
  attribute float aRotation;
  uniform float uViewportHalfHeight;
  varying vec2 vSize;
  varying float vOpacity;
  varying float vRotation;
  varying float vExtent;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    vSize = aSize;
    vOpacity = aOpacity;
    vRotation = aRotation;
    // The point square has to hold the rotated rectangle, so use its diagonal.
    vExtent = length(aSize);
    // Like a sprite, take the parent group's scale into account.
    float worldScale = length(modelMatrix[0].xyz);
    gl_PointSize = aOpacity > 0.0
      ? vExtent * worldScale * projectionMatrix[1][1] * uViewportHalfHeight / -mvPosition.z
      : 0.0;
  }
`

const steamFragmentShader = /* glsl */ `
  uniform sampler2D uMap;
  uniform vec3 uColor;
  varying vec2 vSize;
  varying float vOpacity;
  varying float vRotation;
  varying float vExtent;

  void main() {
    vec2 p = (vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y) - 0.5) * vExtent;
    float c = cos(vRotation);
    float s = sin(vRotation);
    // Undo the screen-space rotation, then map into the puff's rectangle.
    p = vec2(c * p.x + s * p.y, -s * p.x + c * p.y);
    vec2 uv = p / vSize + 0.5;
    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) discard;

    vec4 texel = texture2D(uMap, uv);
    gl_FragColor = vec4(uColor * texel.rgb, vOpacity * texel.a);
    if (gl_FragColor.a < 0.007) discard;
    #include <colorspace_fragment>
  }
`

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

  const steamGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const attributes = {
      position: new THREE.BufferAttribute(new Float32Array(PARTICLE_COUNT * 3), 3),
      aSize: new THREE.BufferAttribute(new Float32Array(PARTICLE_COUNT * 2), 2),
      aOpacity: new THREE.BufferAttribute(new Float32Array(PARTICLE_COUNT), 1),
      aRotation: new THREE.BufferAttribute(new Float32Array(PARTICLE_COUNT), 1),
    }
    Object.entries(attributes).forEach(([name, attribute]) => {
      attribute.setUsage(THREE.DynamicDrawUsage)
      geometry.setAttribute(name, attribute)
    })
    return geometry
  }, [])

  const steamMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: steamVertexShader,
        fragmentShader: steamFragmentShader,
        uniforms: {
          uMap: { value: smokeTexture },
          uColor: { value: new THREE.Color("#dbe1ea") },
          uViewportHalfHeight: { value: 1 },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.NormalBlending,
      }),
    [smokeTexture]
  )

  useEffect(
    () => () => {
      steamGeometry.dispose()
      steamMaterial.dispose()
    },
    [steamGeometry, steamMaterial]
  )

  useEffect(() => {
    // R3F only auto-tags textures as sRGB when they're set as a JSX map prop;
    // this one goes into a shader uniform, so tag it here.
    smokeTexture.colorSpace = THREE.SRGBColorSpace
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

  useFrame(({ clock, size, gl: renderer }, delta) => {
    const wasRendered = renderedLastFrameRef.current
    renderedLastFrameRef.current = false
    // Skip steam animation only on ultra-low quality
    if (quality === "ultra-low" || !wasRendered) return

    steamMaterial.uniforms.uViewportHalfHeight.value =
      size.height * renderer.getPixelRatio() * 0.5

    const dt = Math.min(delta, MAX_FRAME_DELTA)
    const elapsed = clock.elapsedTime
    const positions = steamGeometry.attributes.position.array
    const sizes = steamGeometry.attributes.aSize.array
    const opacities = steamGeometry.attributes.aOpacity.array
    const rotations = steamGeometry.attributes.aRotation.array

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const particle = steamParticles.current[i]

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

      particle.position.toArray(positions, i * 3)
      sizes[i * 2] = width
      sizes[i * 2 + 1] = height
      opacities[i] = opacity
      rotations[i] = Math.sin(swirlPhase * 0.8) * particle.rotationFactor
    }

    steamGeometry.attributes.position.needsUpdate = true
    steamGeometry.attributes.aSize.needsUpdate = true
    steamGeometry.attributes.aOpacity.needsUpdate = true
    steamGeometry.attributes.aRotation.needsUpdate = true
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

      <points
        geometry={steamGeometry}
        material={steamMaterial}
        visible={quality !== "ultra-low"}
        frustumCulled={false}
      />
    </group>
  )
}

useGLTF.preload("/models/mug.glb", "/draco/")
