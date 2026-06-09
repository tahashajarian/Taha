import { useFrame } from "@react-three/fiber"
import React, { useRef, useMemo, useCallback, useEffect } from "react"
import * as THREE from "three"
import { wallData, wallHeight, wallSize } from "../../constances/constances"
import { useGraphicsSettings } from "../../stores/useGraphicsSettings"

const vertexShader = `
precision mediump float;
attribute float size;
attribute vec3 color;
varying vec3 vColor;
void main() {
  vColor = color;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = size * (300.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
`

const fragmentShader = `
precision mediump float;
varying vec3 vColor;
void main() {
  vec2 c = gl_PointCoord - vec2(0.5);
  float d = length(c);
  float alpha = smoothstep(0.5, 0.0, d);
  gl_FragColor = vec4(vColor, alpha);
}
`

const WALL_FLOOR_ROTATION_X = 0.5 * Math.PI
const WALL_AXIS_EPSILON = 0.01

const getRoomBoundsFromWalls = () => {
  let minX = Infinity
  let maxX = -Infinity
  let minZ = Infinity
  let maxZ = -Infinity
  let maxY = wallHeight

  for (const wall of wallData) {
    const args = wall.args || []
    const width = args[0] ?? wallSize
    const height = args[1] ?? wallHeight
    const [posX = 0, posY = 0, posZ = 0] = wall.pos || [0, 0, 0]
    const [rotX = 0, rotY = 0] = wall.rot || [0, 0, 0]
    const isFloor = Math.abs(Math.abs(rotX) - WALL_FLOOR_ROTATION_X) < WALL_AXIS_EPSILON

    if (isFloor) continue

    maxY = Math.max(maxY, posY + height / 2)

    const sinY = Math.abs(Math.sin(rotY))
    const cosY = Math.abs(Math.cos(rotY))

    if (sinY > cosY) {
      minX = Math.min(minX, posX)
      maxX = Math.max(maxX, posX)
      minZ = Math.min(minZ, posZ - width / 2)
      maxZ = Math.max(maxZ, posZ + width / 2)
    } else {
      minZ = Math.min(minZ, posZ)
      maxZ = Math.max(maxZ, posZ)
      minX = Math.min(minX, posX - width / 2)
      maxX = Math.max(maxX, posX + width / 2)
    }
  }

  const fallbackHalf = wallSize / 2
  const resolvedMinX = Number.isFinite(minX) ? minX : -fallbackHalf
  const resolvedMaxX = Number.isFinite(maxX) ? maxX : fallbackHalf
  const resolvedMinZ = Number.isFinite(minZ) ? minZ : -fallbackHalf
  const resolvedMaxZ = Number.isFinite(maxZ) ? maxZ : fallbackHalf
  const resolvedMaxY = Number.isFinite(maxY) ? maxY : wallHeight

  return {
    minX: resolvedMinX,
    maxX: resolvedMaxX,
    minY: 0,
    maxY: resolvedMaxY,
    minZ: resolvedMinZ,
    maxZ: resolvedMaxZ,
  }
}

const ROOM_BOUNDS = getRoomBoundsFromWalls()

const PRESETS = {
  arcane: {
    rotY: 0.00042,
    rotX: 0.00014,
    spinWaveSpeed: 0.42,
    spinWaveAmpY: 0.000025,
    spinWaveAmpX: 0.000012,
    rollSpeed: 0.17,
    rollAmp: 0.045,
    floatSpeed: 0.42,
    floatAmp: 0.085,
    floatSecondarySpeed: 0.24,
    floatSecondaryAmp: 0.034,
    floatXSpeed: 0.21,
    floatXAmp: 0.038,
    floatZSpeed: 0.27,
    floatZAmp: 0.032,
    roamSpeed: 0.34,
    roamWanderSpeed: 0.16,
    roamTurnStrength: 0.62,
    roamVerticalBias: 0.28,
    roamDecisionMin: 1.8,
    roamDecisionMax: 3.6,
    roamJitter: 0.2,
    roomPadding: 0.7,
    roomFloorPadding: 0.86,
    roomCeilPadding: 0.7,
    roomSwaySpeed: 0.16,
    roomSwayAmp: 0.038,
    breathSpeed: 0.24,
    breathAmp: 0.01,
    maxPixelSize: 22,
    baseMin: 0.1,
    baseMax: 0.2,
    ampMin: 0.4,
    ampMax: 0.95,
    freqMin: 0.28,
    freqRange: 0.62,
    orbitMin: 0.011,
    orbitRange: 0.022,
    hueMin: 0.56,
    hueRange: 0.08,
    satMin: 0.45,
    satRange: 0.14,
    lightMin: 0.52,
    lightRange: 0.15,
    auraSpeed: 0.5,
    glowBase: 0.42,
    glowPulse: 0.6,
    glowAura: 0.18,
    waveSpeed: 0.95,
    waveSpatial: 1.75,
    waveAmp: 0.011,
    liquidSpeed: 0.78,
    liquidSpatial: 1.25,
    liquidAmp: 0.12,
    liquidShearAmp: 0.085,
    liquidLiftAmp: 0.062,
    liquidTwistSpeed: 0.46,
    liquidTwistAmp: 0.1,
    jellySquashAmp: 0.085,
    jellySquashSpeed: 0.46,
    waveSizeAmp: 0.14,
    waveGlowAmp: 0.06,
    lineWaveAmp: 0.008,
    lineFreqMin: 0.34,
    lineFreqRange: 0.58,
    lineAmpMin: 0.004,
    lineAmpRange: 0.012,
    lineOpacityMin: 0.16,
    lineOpacityAmp: 0.2,
    lineHueBase: 0.6,
    lineHueSwing: 0.02,
    lineSatBase: 0.5,
    lineSatSwing: 0.05,
    lineLightBase: 0.6,
    lineLightAura: 0.08,
    clickScatter: 0.9,
    clickOutDuration: 0.09,
    clickReturnDuration: 0.8,
    clickMinSpread: 0.72,
    clickTintR: 0.16,
    clickTintG: 0.24,
    clickTintB: 0.38,
    clickGlow: 0.32,
    clickSizeBoost: 0.34,
    clickJitterSpeed: 5.6,
    clickLineBoost: 0.12,
  },
  cosmic: {
    rotY: 0.00064,
    rotX: 0.0002,
    spinWaveSpeed: 0.58,
    spinWaveAmpY: 0.000045,
    spinWaveAmpX: 0.00002,
    rollSpeed: 0.22,
    rollAmp: 0.08,
    floatSpeed: 0.58,
    floatAmp: 0.105,
    floatSecondarySpeed: 0.32,
    floatSecondaryAmp: 0.04,
    floatXSpeed: 0.24,
    floatXAmp: 0.046,
    floatZSpeed: 0.3,
    floatZAmp: 0.038,
    roamSpeed: 0.41,
    roamWanderSpeed: 0.17,
    roamTurnStrength: 0.72,
    roamVerticalBias: 0.34,
    roamDecisionMin: 1.6,
    roamDecisionMax: 3.1,
    roamJitter: 0.24,
    roomPadding: 0.64,
    roomFloorPadding: 0.82,
    roomCeilPadding: 0.66,
    roomSwaySpeed: 0.19,
    roomSwayAmp: 0.045,
    breathSpeed: 0.28,
    breathAmp: 0.012,
    maxPixelSize: 26,
    baseMin: 0.12,
    baseMax: 0.26,
    ampMin: 0.58,
    ampMax: 1.35,
    freqMin: 0.32,
    freqRange: 1.28,
    orbitMin: 0.02,
    orbitRange: 0.044,
    hueMin: 0.52,
    hueRange: 0.2,
    satMin: 0.68,
    satRange: 0.22,
    lightMin: 0.5,
    lightRange: 0.24,
    auraSpeed: 0.72,
    glowBase: 0.42,
    glowPulse: 0.82,
    glowAura: 0.3,
    waveSpeed: 1.28,
    waveSpatial: 2.2,
    waveAmp: 0.02,
    liquidSpeed: 0.96,
    liquidSpatial: 1.45,
    liquidAmp: 0.16,
    liquidShearAmp: 0.11,
    liquidLiftAmp: 0.082,
    liquidTwistSpeed: 0.58,
    liquidTwistAmp: 0.13,
    jellySquashAmp: 0.11,
    jellySquashSpeed: 0.58,
    waveSizeAmp: 0.26,
    waveGlowAmp: 0.1,
    lineWaveAmp: 0.014,
    lineFreqMin: 0.45,
    lineFreqRange: 1.4,
    lineAmpMin: 0.008,
    lineAmpRange: 0.022,
    lineOpacityMin: 0.2,
    lineOpacityAmp: 0.3,
    lineHueBase: 0.58,
    lineHueSwing: 0.05,
    lineSatBase: 0.72,
    lineSatSwing: 0.08,
    lineLightBase: 0.62,
    lineLightAura: 0.14,
    clickScatter: 1.28,
    clickOutDuration: 0.08,
    clickReturnDuration: 0.9,
    clickMinSpread: 0.7,
    clickTintR: 0.2,
    clickTintG: 0.3,
    clickTintB: 0.48,
    clickGlow: 0.42,
    clickSizeBoost: 0.48,
    clickJitterSpeed: 6.6,
    clickLineBoost: 0.16,
  },
}

const Thing = ({ rotate = true, preset = "cosmic" }) => {
  const quality = useGraphicsSettings((s) => s.quality)
  
  const groupRef = useRef(null)
  const pointsRef = useRef(null)
  const linesRef = useRef(null)
  const lineMaterialRef = useRef(null)
  const burstTimerRef = useRef(Infinity)
  const burstPhaseRef = useRef(0)
  const roamRef = useRef({
    position: new THREE.Vector3(),
    localPosition: new THREE.Vector3(),
    velocity: new THREE.Vector3(),
    targetVelocity: new THREE.Vector3(),
    nextDecisionTime: 0,
    ready: false,
  })
  const settings = PRESETS[preset] || PRESETS.cosmic

  // constants
  const ROT_Y = settings.rotY
  const ROT_X = settings.rotX
  const MAX_PIXEL_SIZE = settings.maxPixelSize
  const BASE_MIN = settings.baseMin
  const BASE_MAX = settings.baseMax
  const AMP_MIN = settings.ampMin
  const AMP_MAX = settings.ampMax
  const roamBounds = useMemo(() => {
    const minX = ROOM_BOUNDS.minX + settings.roomPadding
    const maxX = ROOM_BOUNDS.maxX - settings.roomPadding
    const minY = ROOM_BOUNDS.minY + settings.roomFloorPadding
    const maxY = ROOM_BOUNDS.maxY - settings.roomCeilPadding
    const minZ = ROOM_BOUNDS.minZ + settings.roomPadding
    const maxZ = ROOM_BOUNDS.maxZ - settings.roomPadding

    return {
      minX: Math.min(minX, maxX),
      maxX: Math.max(minX, maxX),
      minY: Math.min(minY, maxY),
      maxY: Math.max(minY, maxY),
      minZ: Math.min(minZ, maxZ),
      maxZ: Math.max(minZ, maxZ),
      decisionSpan: Math.max(0.01, settings.roamDecisionMax - settings.roamDecisionMin),
    }
  }, [settings])

  useEffect(() => {
    const state = roamRef.current
    state.ready = false
  }, [preset])

  // geometry + attributes
  const {
    pointsGeometry,
    linesGeometry,
    pointPositionAttr,
    pointColorAttr,
    pointSizeAttr,
    linePositionAttr,
    pointPositions,
    pointColors,
    pointSizes,
    linePositions,
    pointNormals,
    pointTangents,
    pointWaveOffsets,
    phases,
    freqs,
    amps,
    baseSizes,
    baseColors,
    pointOrbitPhase,
    pointOrbitStrength,
    burstDirections,
    burstSeeds,
    basePointPositions,
    baseLinePositions,
    linePhases,
    lineFreqs,
    lineAmps,
    lineNormals,
    lineTangents,
    lineWaveOffsets,
    count,
    lineCount,
  } = useMemo(() => {
    const ico = new THREE.IcosahedronGeometry(1, 2)
    const edges = new THREE.EdgesGeometry(ico)
    const pos = edges.attributes.position.array
    const lineCount = pos.length / 3

    // dedupe positions for points
    const seen = new Set()
    const unique = []
    for (let i = 0; i < pos.length; i += 3) {
      const key = `${pos[i].toFixed(5)}_${pos[i + 1].toFixed(5)}_${pos[i + 2].toFixed(5)}`
      if (!seen.has(key)) {
        seen.add(key)
        unique.push(pos[i], pos[i + 1], pos[i + 2])
      }
    }

    const cnt = unique.length / 3
    const ph = new Float32Array(cnt)
    const fr = new Float32Array(cnt)
    const ap = new Float32Array(cnt)
    const sizes = new Float32Array(cnt)
    const baseColors = new Float32Array(cnt * 3)
    const colors = new Float32Array(cnt * 3)
    const pointNormals = new Float32Array(cnt * 3)
    const pointTangents = new Float32Array(cnt * 3)
    const pointWaveOffsets = new Float32Array(cnt)
    const orbitPhase = new Float32Array(cnt)
    const orbitStrength = new Float32Array(cnt)
    const burstDirections = new Float32Array(cnt * 3)
    const burstSeeds = new Float32Array(cnt)
    const tint = new THREE.Color()

    for (let i = 0; i < cnt; i++) {
      const idx = i * 3
      const px = unique[idx]
      const py = unique[idx + 1]
      const pz = unique[idx + 2]
      const plen = Math.sqrt(px * px + py * py + pz * pz) || 1
      const nx = px / plen
      const ny = py / plen
      const nz = pz / plen
      const tx = -nz
      const ty = ny * 0.35
      const tz = nx

      ph[i] = Math.random() * Math.PI * 2
      fr[i] = settings.freqMin + Math.random() * settings.freqRange
      ap[i] = AMP_MIN + Math.random() * (AMP_MAX - AMP_MIN)
      sizes[i] = BASE_MIN + Math.random() * (BASE_MAX - BASE_MIN)
      pointNormals[idx] = nx
      pointNormals[idx + 1] = ny
      pointNormals[idx + 2] = nz
      pointTangents[idx] = tx
      pointTangents[idx + 1] = ty
      pointTangents[idx + 2] = tz
      pointWaveOffsets[i] = (nx + ny + nz) * settings.waveSpatial + ph[i] * 0.35
      orbitPhase[i] = Math.random() * Math.PI * 2
      orbitStrength[i] = settings.orbitMin + Math.random() * settings.orbitRange
      burstSeeds[i] = Math.random() * Math.PI * 2

      const randomX = Math.random() * 2 - 1
      const randomY = Math.random() * 2 - 1
      const randomZ = Math.random() * 2 - 1
      let dirX = nx * (0.6 + Math.random() * 0.5) + randomX * 0.75
      let dirY = ny * (0.6 + Math.random() * 0.5) + randomY * 0.75
      let dirZ = nz * (0.6 + Math.random() * 0.5) + randomZ * 0.75
      const dirLen = Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ) || 1
      dirX /= dirLen
      dirY /= dirLen
      dirZ /= dirLen
      burstDirections[idx] = dirX
      burstDirections[idx + 1] = dirY
      burstDirections[idx + 2] = dirZ

      const hue = settings.hueMin + Math.random() * settings.hueRange
      const sat = settings.satMin + Math.random() * settings.satRange
      const light = settings.lightMin + Math.random() * settings.lightRange
      tint.setHSL(hue, sat, light)
      baseColors.set([tint.r, tint.g, tint.b], idx)
      colors.set([tint.r, tint.g, tint.b], idx)
    }

    const g = new THREE.BufferGeometry()
    g.setAttribute("position", new THREE.Float32BufferAttribute(unique, 3))
    g.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3))
    g.setAttribute("size", new THREE.Float32BufferAttribute(sizes, 1))

    const pointPositionAttr = g.getAttribute("position")
    const pointColorAttr = g.getAttribute("color")
    const pointSizeAttr = g.getAttribute("size")
    pointPositionAttr.setUsage(THREE.DynamicDrawUsage)
    pointColorAttr.setUsage(THREE.DynamicDrawUsage)
    pointSizeAttr.setUsage(THREE.DynamicDrawUsage)

    const linePositionAttr = edges.getAttribute("position")
    linePositionAttr.setUsage(THREE.DynamicDrawUsage)

    const linePhases = new Float32Array(lineCount)
    const lineFreqs = new Float32Array(lineCount)
    const lineAmps = new Float32Array(lineCount)
    const lineNormals = new Float32Array(lineCount * 3)
    const lineTangents = new Float32Array(lineCount * 3)
    const lineWaveOffsets = new Float32Array(lineCount)
    for (let i = 0; i < lineCount; i++) {
      const idx = i * 3
      const x = pos[idx]
      const y = pos[idx + 1]
      const z = pos[idx + 2]
      const length = Math.sqrt(x * x + y * y + z * z) || 1
      const nx = x / length
      const ny = y / length
      const nz = z / length

      linePhases[i] = Math.random() * Math.PI * 2
      lineFreqs[i] = settings.lineFreqMin + Math.random() * settings.lineFreqRange
      lineAmps[i] = settings.lineAmpMin + Math.random() * settings.lineAmpRange
      lineNormals[idx] = nx
      lineNormals[idx + 1] = ny
      lineNormals[idx + 2] = nz
      lineTangents[idx] = -nz
      lineTangents[idx + 1] = 0
      lineTangents[idx + 2] = nx
      lineWaveOffsets[i] = (x + y + z) * settings.waveSpatial + linePhases[i]
    }

    return {
      pointsGeometry: g,
      linesGeometry: edges,
      pointPositionAttr,
      pointColorAttr,
      pointSizeAttr,
      linePositionAttr,
      pointPositions: pointPositionAttr.array,
      pointColors: pointColorAttr.array,
      pointSizes: pointSizeAttr.array,
      linePositions: linePositionAttr.array,
      pointNormals,
      pointTangents,
      pointWaveOffsets,
      basePointPositions: new Float32Array(unique),
      baseLinePositions: new Float32Array(pos),
      phases: ph,
      freqs: fr,
      amps: ap,
      baseSizes: sizes,
      baseColors,
      pointOrbitPhase: orbitPhase,
      pointOrbitStrength: orbitStrength,
      burstDirections,
      burstSeeds,
      linePhases,
      lineFreqs,
      lineAmps,
      lineNormals,
      lineTangents,
      lineWaveOffsets,
      count: cnt,
      lineCount,
    }
  }, [settings, AMP_MIN, AMP_MAX, BASE_MIN, BASE_MAX])

  const burstDistanceRef = useRef(0.9)
  const lastClickTimeRef = useRef(-999)
  const clockRef = useRef(0)
  const persistentBurstRef = useRef(0)
  const storedPersistentRef = useRef(0)

  const triggerBurst = useCallback((event) => {
    event.stopPropagation()
    const now = clockRef.current
    const timeSinceLastClick = now - lastClickTimeRef.current
    
    // If clicking rapidly, keep and increase current position
    if (timeSinceLastClick < 1.0) {
      // Lock in current burst state and add more
      persistentBurstRef.current = Math.min(persistentBurstRef.current + 0.4, 2.5)
    } else {
      persistentBurstRef.current = 0
    }
    lastClickTimeRef.current = now
    burstTimerRef.current = 0
  }, [])

  const shaderMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    []
  )

  useEffect(
    () => () => {
      pointsGeometry.dispose()
      linesGeometry.dispose()
    },
    [pointsGeometry, linesGeometry]
  )

  useEffect(
    () => () => {
      shaderMat.dispose()
    },
    [shaderMat]
  )

  useFrame(({ clock }, delta) => {
    // Skip animation if not high quality
    if (quality !== "high") return

    const t = clock.getElapsedTime()
    clockRef.current = t
    burstTimerRef.current += delta
    const waveTime = t * settings.waveSpeed
    const liquidTime = t * settings.liquidSpeed
    const liquidTwistTime = t * settings.liquidTwistSpeed
    const clickJitterTime = t * settings.clickJitterSpeed + burstPhaseRef.current
    const lineWaveTime = waveTime * 1.12

    let burstEase = 0
    const outDuration = settings.clickOutDuration
    const returnDuration = settings.clickReturnDuration
    const totalDuration = outDuration + returnDuration

    if (burstTimerRef.current < outDuration) {
      // Out phase - keep it with cubic easing for punch
      const outT = burstTimerRef.current / outDuration
      burstEase = 1 - Math.pow(1 - outT, 3)
    } else if (burstTimerRef.current < totalDuration) {
      // Return phase - linear
      const backT = (burstTimerRef.current - outDuration) / returnDuration
      burstEase = 1 - backT
    }

    // Calculate total offset
    const currentBurstAmount = burstEase * 0.9

    // Decay persistent offset linearly when animation completes
    const timeSinceLastClick = t - lastClickTimeRef.current
    if (burstTimerRef.current >= totalDuration && persistentBurstRef.current > 0) {
      // Store the value when decay starts
      if (storedPersistentRef.current === 0) {
        storedPersistentRef.current = persistentBurstRef.current
      }
      
      // Linear decay over fixed duration (same as return animation)
      const decayDuration = timeSinceLastClick > 1.0 ? 0.5 : returnDuration
      const decayElapsed = burstTimerRef.current - totalDuration
      const decayProgress = Math.min(1, decayElapsed / decayDuration)
      persistentBurstRef.current = storedPersistentRef.current * (1 - decayProgress)
      
      if (decayProgress >= 1) storedPersistentRef.current = 0
    }

    const totalBurstOffset = persistentBurstRef.current + currentBurstAmount

    const group = groupRef.current
    if (rotate && group) {
      const roam = roamRef.current

      if (!roam.ready) {
        group.updateWorldMatrix(true, false)
        group.getWorldPosition(roam.position)

        const angle = Math.random() * Math.PI * 2
        const vertical = (Math.random() * 2 - 1) * settings.roamVerticalBias
        roam.velocity
          .set(Math.cos(angle), vertical, Math.sin(angle))
          .normalize()
          .multiplyScalar(settings.roamSpeed)
        roam.targetVelocity.copy(roam.velocity)
        roam.nextDecisionTime =
          t + settings.roamDecisionMin + Math.random() * roamBounds.decisionSpan
        roam.ready = true
      }

      if (t >= roam.nextDecisionTime) {
        const wanderAngle = t * settings.roamWanderSpeed + burstPhaseRef.current * 0.25
        const jitter = settings.roamJitter
        roam.targetVelocity.set(
          Math.sin(wanderAngle) + Math.sin(wanderAngle * 0.47 + 1.8) * 0.45 + (Math.random() * 2 - 1) * jitter,
          Math.sin(wanderAngle * 0.63 + 0.9) * settings.roamVerticalBias + (Math.random() * 2 - 1) * jitter * 0.45,
          Math.cos(wanderAngle * 0.82 + 0.4) + Math.sin(wanderAngle * 0.31 + 2.3) * 0.4 + (Math.random() * 2 - 1) * jitter
        )

        if (roam.targetVelocity.lengthSq() > 0.00001) {
          roam.targetVelocity.normalize().multiplyScalar(settings.roamSpeed)
        }

        roam.nextDecisionTime =
          t + settings.roamDecisionMin + Math.random() * roamBounds.decisionSpan
      }

      const turnLerp = Math.min(1, delta * settings.roamTurnStrength)
      roam.velocity.lerp(roam.targetVelocity, turnLerp)

      if (roam.velocity.lengthSq() > 0.00001) {
        roam.velocity.normalize().multiplyScalar(settings.roamSpeed)
      } else {
        roam.velocity.set(settings.roamSpeed, 0, 0)
      }

      roam.position.addScaledVector(roam.velocity, delta)
      let didBounce = false

      if (roam.position.x < roamBounds.minX) {
        roam.position.x = roamBounds.minX
        roam.velocity.x = Math.abs(roam.velocity.x)
        didBounce = true
      } else if (roam.position.x > roamBounds.maxX) {
        roam.position.x = roamBounds.maxX
        roam.velocity.x = -Math.abs(roam.velocity.x)
        didBounce = true
      }

      if (roam.position.y < roamBounds.minY) {
        roam.position.y = roamBounds.minY
        roam.velocity.y = Math.abs(roam.velocity.y)
        didBounce = true
      } else if (roam.position.y > roamBounds.maxY) {
        roam.position.y = roamBounds.maxY
        roam.velocity.y = -Math.abs(roam.velocity.y)
        didBounce = true
      }

      if (roam.position.z < roamBounds.minZ) {
        roam.position.z = roamBounds.minZ
        roam.velocity.z = Math.abs(roam.velocity.z)
        didBounce = true
      } else if (roam.position.z > roamBounds.maxZ) {
        roam.position.z = roamBounds.maxZ
        roam.velocity.z = -Math.abs(roam.velocity.z)
        didBounce = true
      }

      if (didBounce) {
        roam.targetVelocity.copy(roam.velocity)
      }

      const localFloatX =
        Math.sin(t * settings.floatXSpeed) * settings.floatXAmp +
        Math.cos(t * settings.floatXSpeed * 0.57 + 1.4) * settings.floatXAmp * 0.45
      const localFloatY =
        Math.sin(t * settings.floatSpeed) * settings.floatAmp +
        Math.cos(t * settings.floatSecondarySpeed + 0.9) * settings.floatSecondaryAmp
      const localFloatZ =
        Math.cos(t * settings.floatZSpeed) * settings.floatZAmp +
        Math.sin(t * settings.floatZSpeed * 0.62 + 0.4) * settings.floatZAmp * 0.42

      group.rotation.y += ROT_Y + Math.sin(t * settings.spinWaveSpeed) * settings.spinWaveAmpY
      group.rotation.x += ROT_X + Math.cos(t * settings.spinWaveSpeed * 0.83) * settings.spinWaveAmpX
      group.rotation.z =
        Math.sin(t * settings.rollSpeed) * settings.rollAmp +
        Math.sin(t * settings.roomSwaySpeed + 1.2) * settings.roomSwayAmp
      roam.localPosition.copy(roam.position)
      if (group.parent) {
        group.parent.worldToLocal(roam.localPosition)
      }

      group.position.x = roam.localPosition.x + localFloatX
      group.position.y = roam.localPosition.y + localFloatY
      group.position.z = roam.localPosition.z + localFloatZ
      const breath = Math.sin(t * settings.breathSpeed) * settings.breathAmp
      const jelly = Math.sin(t * settings.jellySquashSpeed + 0.9) * settings.jellySquashAmp
      group.scale.set(
        1 + breath + jelly * 0.6,
        1 + breath - jelly,
        1 + breath + jelly * 0.6
      )
    }

    const aura = 0.5 + Math.sin(t * settings.auraSpeed) * 0.5
    const globalWave = Math.sin(waveTime)

    if (pointsRef.current) {
      for (let i = 0; i < count; i++) {
        const idx = i * 3
        const x = basePointPositions[idx]
        const y = basePointPositions[idx + 1]
        const z = basePointPositions[idx + 2]
        const nx = pointNormals[idx]
        const ny = pointNormals[idx + 1]
        const nz = pointNormals[idx + 2]
        const tx = pointTangents[idx]
        const ty = pointTangents[idx + 1]
        const tz = pointTangents[idx + 2]

        const pulse = (
          Math.sin(t * freqs[i] + phases[i]) * 0.6 +
          Math.sin(t * (freqs[i] * 1.25) + phases[i] * 0.57) * 0.4 +
          1
        ) * 0.5

        const orbitA =
          Math.sin(t * (0.34 + freqs[i] * 0.28) + pointOrbitPhase[i]) *
          pointOrbitStrength[i]
        const orbitB =
          Math.cos(t * (0.21 + freqs[i] * 0.23) + pointOrbitPhase[i] * 0.8) *
          pointOrbitStrength[i] *
          0.85
        const lift =
          Math.sin(t * 0.5 + pointOrbitPhase[i] * 1.1) * pointOrbitStrength[i] * 0.35
        const wave = Math.sin(waveTime + pointWaveOffsets[i]) * settings.waveAmp
        const liquidPhase =
          liquidTime +
          phases[i] * 0.7 +
          (nx - nz) * settings.liquidSpatial
        const liquidWave = Math.sin(liquidPhase) * settings.liquidAmp
        const liquidShear = Math.cos(liquidPhase * 0.82 + pointOrbitPhase[i]) * settings.liquidShearAmp
        const liquidLift = Math.sin(liquidPhase * 1.17 + pointOrbitPhase[i] * 0.5) * settings.liquidLiftAmp
        const liquidTwist =
          Math.sin(liquidTwistTime + pointOrbitPhase[i] + ny * 1.4) *
          settings.liquidTwistAmp
        const burstJitter =
          (settings.clickMinSpread +
            (1 - settings.clickMinSpread) *
              (Math.sin(clickJitterTime + burstSeeds[i]) *
                0.5 +
                0.5)) *
          totalBurstOffset
        const burstScatter = settings.clickScatter * burstJitter
        const burstX = burstDirections[idx] * burstScatter
        const burstY = burstDirections[idx + 1] * burstScatter
        const burstZ = burstDirections[idx + 2] * burstScatter

        pointPositions[idx] =
          x +
          nx * (orbitA + wave + liquidWave) +
          tx * (orbitB + liquidShear) +
          ny * liquidTwist +
          burstX
        pointPositions[idx + 1] =
          y +
          ny * (orbitA + wave + liquidWave * 0.72) +
          ty * (orbitB + liquidShear * 0.6) +
          lift +
          wave * 0.3 +
          liquidLift +
          burstY
        pointPositions[idx + 2] =
          z +
          nz * (orbitA + wave + liquidWave) +
          tz * (orbitB + liquidShear) -
          ny * liquidTwist +
          burstZ

        const glow =
          settings.glowBase +
          Math.pow(pulse, 1.25) * settings.glowPulse +
          aura * settings.glowAura +
          (0.5 + wave * 0.5) * settings.waveGlowAmp +
          burstEase * settings.clickGlow
        pointColors[idx] = Math.min(1, baseColors[idx] * glow + burstEase * settings.clickTintR)
        pointColors[idx + 1] = Math.min(1, baseColors[idx + 1] * glow + burstEase * settings.clickTintG)
        pointColors[idx + 2] = Math.min(1, baseColors[idx + 2] * glow + burstEase * settings.clickTintB)

        pointSizes[i] = Math.min(
          MAX_PIXEL_SIZE,
          baseSizes[i] *
            (1 +
              amps[i] * pulse * 0.45 +
              aura * 0.3 +
              wave * settings.waveSizeAmp +
              burstEase * settings.clickSizeBoost)
        )
      }

      pointPositionAttr.needsUpdate = true
      pointColorAttr.needsUpdate = true
      pointSizeAttr.needsUpdate = true
    }

    if (linesRef.current) {
      for (let i = 0; i < lineCount; i++) {
        const idx = i * 3
        const x = baseLinePositions[idx]
        const y = baseLinePositions[idx + 1]
        const z = baseLinePositions[idx + 2]
        const nx = lineNormals[idx]
        const ny = lineNormals[idx + 1]
        const nz = lineNormals[idx + 2]
        const tx = lineTangents[idx]
        const tz = lineTangents[idx + 2]

        const bend = Math.sin(t * lineFreqs[i] + linePhases[i]) * lineAmps[i]
        const curl = Math.cos(t * (lineFreqs[i] * 0.72) + linePhases[i] * 1.2) * lineAmps[i] * 0.75
        const travelingWave = Math.sin(lineWaveTime + lineWaveOffsets[i]) * settings.lineWaveAmp
        const lineLiquidPhase =
          liquidTime + linePhases[i] * 0.65 + (nx - nz) * settings.liquidSpatial
        const lineLiquid = Math.sin(lineLiquidPhase) * settings.liquidAmp * 0.5
        const lineShear = Math.cos(lineLiquidPhase * 0.84) * settings.liquidShearAmp * 0.4

        linePositions[idx] = x + nx * (bend + travelingWave + lineLiquid) + tx * (curl + lineShear)
        linePositions[idx + 1] =
          y +
          ny * (bend + travelingWave + lineLiquid * 0.7) +
          Math.sin(t * 0.7 + linePhases[i]) * lineAmps[i] * 0.22 +
          Math.sin(lineLiquidPhase * 1.2) * settings.liquidLiftAmp * 0.35
        linePositions[idx + 2] = z + nz * (bend + travelingWave + lineLiquid) + tz * (curl + lineShear)
      }

      linePositionAttr.needsUpdate = true

      if (lineMaterialRef.current) {
        const material = lineMaterialRef.current
        material.opacity =
          settings.lineOpacityMin +
          aura * settings.lineOpacityAmp +
          globalWave * 0.035 +
          burstEase * settings.clickLineBoost
        material.color.setHSL(
          settings.lineHueBase +
            Math.sin(t * 0.38) * settings.lineHueSwing +
            globalWave * 0.008 +
            burstEase * 0.01,
          settings.lineSatBase + Math.sin(t * 0.21) * settings.lineSatSwing + burstEase * 0.05,
          settings.lineLightBase + aura * settings.lineLightAura + burstEase * 0.09
        )
      }
    }
  })

  // Don't render on non-high quality
  if (quality !== "high") {
    return null
  }

  return (
    <group ref={groupRef}>
      <lineSegments ref={linesRef} geometry={linesGeometry} onClick={triggerBurst}>
        <lineBasicMaterial ref={lineMaterialRef} color="#b7ccff" transparent opacity={0.35} />
      </lineSegments>

      <points ref={pointsRef} geometry={pointsGeometry} onClick={triggerBurst}>
        <primitive object={shaderMat} attach="material" />
      </points>

    </group>
  )
}

export default Thing
