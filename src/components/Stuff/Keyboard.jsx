import React, { useRef, useEffect, memo } from "react"
import { useGLTF } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useGraphicsSettings } from "../../stores/useGraphicsSettings"

/* ----------------- Keyboard ----------------- */
const Keyboard = (props) => {
  const { nodes, materials } = useGLTF("/models/keyboard.glb", "/draco/")
  const quality = useGraphicsSettings((s) => s.quality)
  const highQualityStage = useGraphicsSettings((s) => s.highQualityStage)
  const useHighEffects = quality === "high" && highQualityStage >= 1

  // keep original material values so we can restore them when returning to "high"
  const origRef = useRef(null)
  useEffect(() => {
    const m = materials?.klawisze
    if (!m) return

    if (!origRef.current) {
      origRef.current = {
        metalness: m.metalness,
        roughness: m.roughness,
        envMapIntensity: m.envMapIntensity,
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
    }
    // note: we intentionally mutate the gltf material once here,
    // that's fine because we avoid doing it every render.
  }, [materials, quality, useHighEffects])

  return (
    <group {...props} dispose={null}>
      {/* Only mount RGB lights in high quality */}
      {useHighEffects && <RGBLightHigh />}

      <mesh
        castShadow={useHighEffects}
        receiveShadow={quality !== "low"}
        geometry={nodes.Cube.geometry}
        material={materials.klawisze}
        rotation={[0, Math.PI / 2, 0]}
      />
    </group>
  )
}

useGLTF.preload("/models/keyboard.glb", "/draco/")

/* ----------------- RGB Light (high quality only) ----------------- */
const RGBLightHigh = memo(() => {
  const rRef = useRef(null)
  const gRef = useRef(null)
  const bRef = useRef(null)

  // per-frame update of colors (only runs when component mounted -> quality === "high")
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    // compute rgb wave values
    const r = (Math.sin(t * 2) + 1) * 0.5
    const g = (Math.sin(t * 2 + Math.PI / 2) + 1) * 0.5
    const b = (Math.sin(t * 2 + Math.PI) + 1) * 0.5

    if (rRef.current) rRef.current.color.setRGB(r, 0, 0)
    if (gRef.current) gRef.current.color.setRGB(0, g, 0)
    if (bRef.current) bRef.current.color.setRGB(0, 0, b)
  })

  return (
    <group>
      <rectAreaLight
        ref={rRef}
        position={[0, 0.03, 0.04]}
        rotation={[-Math.PI / 2, 0, 0]}
        width={0.45}
        height={0.02}
        intensity={50}
        color="red"
        power={0.5}
      />
      <rectAreaLight
        ref={bRef}
        position={[0, 0.03, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        width={0.45}
        height={0.04}
        intensity={50}
        color="blue"
        power={0.5}
      />
      <rectAreaLight
        ref={gRef}
        position={[0, 0.03, -0.04]}
        rotation={[-Math.PI / 2, 0, 0]}
        width={0.45}
        height={0.02}
        intensity={50}
        color="green"
        power={0.5}
      />
    </group>
  )
})

export default memo(Keyboard)
