import React, { useRef, useEffect, useMemo, memo } from "react"
import { useGLTF } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { useGraphicsSettings } from "../../stores/useGraphicsSettings"

/* ----------------- Keyboard ----------------- */
const Keyboard = (props) => {
  const { nodes, materials } = useGLTF("/models/keyboard.glb", "/draco/")
  const quality = useGraphicsSettings((s) => s.quality)
  const highQualityStage = useGraphicsSettings((s) => s.highQualityStage)
  const useHighEffects = quality === "high" && highQualityStage >= 1
  const lastColorUpdateRef = useRef(0)
  const keyboardShaderRef = useRef(null)

  const keyboardGeometry = useMemo(() => {
    const geometry = nodes.Cube.geometry.clone()
    const positions = geometry.attributes.position
    const vertexCount = positions.count
    const keyMask = new Float32Array(vertexCount)
    for (let i = 0; i < vertexCount; i += 1) {
      // The key rows slope downward along local X. Flatten that slope before
      // separating the keycaps (~0.022) from the base (~0.010).
      const flattenedHeight = positions.getY(i) + positions.getX(i) * 0.069
      keyMask[i] = THREE.MathUtils.smoothstep(flattenedHeight, 0.015, 0.019)
    }
    geometry.setAttribute(
      "keyboardKeyMask",
      new THREE.Float32BufferAttribute(keyMask, 1),
    )
    return geometry
  }, [nodes])

  useEffect(() => () => keyboardGeometry.dispose(), [keyboardGeometry])

  const keyboardMaterial = useMemo(() => {
    const material = materials.klawisze.clone()
    material.color.set("#050505")
    material.emissive.set("#6f7dff")
    material.emissiveIntensity = 1
    material.onBeforeCompile = (shader) => {
      keyboardShaderRef.current = shader
      shader.uniforms.keyboardTime = { value: 0 }
      shader.vertexShader = shader.vertexShader
        .replace(
          "#include <common>",
          "#include <common>\nattribute float keyboardKeyMask;\nvarying float vKeyboardKeyMask;\nvarying vec3 vKeyboardPosition;",
        )
        .replace(
          "#include <begin_vertex>",
          "#include <begin_vertex>\nvKeyboardKeyMask = keyboardKeyMask;\nvKeyboardPosition = position;",
        )
      shader.fragmentShader = shader.fragmentShader
        .replace(
          "#include <common>",
          "#include <common>\nvarying float vKeyboardKeyMask;\nvarying vec3 vKeyboardPosition;\nuniform float keyboardTime;",
        )
        .replace(
          "vec3 totalEmissiveRadiance = emissive;",
          "float keyboardPhase = keyboardTime * 1.35 + vKeyboardPosition.z * 13.0 + vKeyboardPosition.x * 7.0;\nvec3 keyboardRgb = 0.55 + 0.45 * cos(keyboardPhase + vec3(0.0, 2.094, 4.188));\nfloat keyboardPulse = 0.88 + 0.12 * sin(keyboardTime * 2.0 + vKeyboardPosition.z * 10.0);\nvec3 totalEmissiveRadiance = emissive * keyboardRgb * keyboardPulse * vKeyboardKeyMask;",
        )
    }
    material.customProgramCacheKey = () => "keyboard-key-rgb-wave-v3"
    material.needsUpdate = true
    return material
  }, [materials])

  useEffect(() => () => keyboardMaterial.dispose(), [keyboardMaterial])

  // keep original material values so we can restore them when returning to "high"
  const origRef = useRef(null)
  useEffect(() => {
    const m = keyboardMaterial
    if (!m) return

    if (!origRef.current) {
      origRef.current = {
        metalness: m.metalness,
        roughness: m.roughness,
        envMapIntensity: m.envMapIntensity,
        emissive: m.emissive.clone(),
        emissiveIntensity: m.emissiveIntensity,
      }
    }

    if (useHighEffects) {
      // restore original values (if we have them)
      const o = origRef.current
      m.metalness = o?.metalness ?? m.metalness
      m.roughness = o?.roughness ?? m.roughness
      m.envMapIntensity = o?.envMapIntensity ?? m.envMapIntensity
    } else {
      // low/medium quality overrides
      m.metalness = 0.6
      m.roughness = quality === "medium" ? 0.4 : 0.5
      m.envMapIntensity = quality === "medium" ? 0.8 : 0.4
      m.emissive.setRGB(0, 0, 0)
      m.emissiveIntensity = 0
    }
    // note: we intentionally mutate the gltf material once here,
    // that's fine because we avoid doing it every render.
  }, [keyboardMaterial, quality, useHighEffects])

  useFrame(({ clock }) => {
    const time = clock.elapsedTime
    const updateInterval = quality === "high" ? 0 : quality === "medium" ? 1 / 30 : 1 / 15
    if (time - lastColorUpdateRef.current < updateInterval) return
    lastColorUpdateRef.current = time

    const colorTime = time * 1.4
    keyboardMaterial.emissive.setRGB(1, 1, 1)
    if (keyboardShaderRef.current) {
      keyboardShaderRef.current.uniforms.keyboardTime.value = colorTime
    }
    keyboardMaterial.emissiveIntensity =
      quality === "high" ? 1.35 : quality === "medium" ? 0.9 : 0.65
  })

  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow={useHighEffects}
        receiveShadow={quality !== "low"}
        geometry={keyboardGeometry}
        material={keyboardMaterial}
        rotation={[0, Math.PI / 2, 0]}
      />
    </group>
  )
}

useGLTF.preload("/models/keyboard.glb", "/draco/")

export default memo(Keyboard)
