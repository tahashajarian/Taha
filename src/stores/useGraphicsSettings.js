import { create } from 'zustand'

const getDPR = () =>
  typeof window !== 'undefined'
    ? Math.min(window.devicePixelRatio, 2)
    : 1

export const PRESETS = {
  high: () => getDPR(),
  medium: () => 1,
  low: () => 0.8,
  'ultra-low': () => 0.75,
}

// Enhanced device capability detection
const detectDeviceCapability = () => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined')
    return 'high'

  const userAgent = navigator.userAgent.toLowerCase()
  const isMobile =
    /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
      userAgent
    )

  let isLowEndDevice = false

  // Memory detection
  if (navigator.deviceMemory && navigator.deviceMemory < 4) {
    isLowEndDevice = true
  }

  // CPU core detection
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) {
    isLowEndDevice = true
  }

  // Older mobile devices
  if (
    isMobile &&
    /(android [0-7]|ios [0-9]_|iphone [0-9],)/i.test(userAgent)
  ) {
    isLowEndDevice = true
  }

  // WebGL capability check
  try {
    const canvas = document.createElement('canvas')
    const gl =
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')
    if (!gl) isLowEndDevice = true
  } catch {
    isLowEndDevice = true
  }

  return isLowEndDevice ? 'medium' : 'high'
}

// Get initial quality setting
const getInitialQuality = () => {
  if (typeof window === 'undefined') return 'high'

  try {
    const savedQuality = localStorage.getItem('graphics-quality')
    if (
      savedQuality &&
      ['high', 'medium', 'low', 'ultra-low'].includes(savedQuality)
    ) {
      return savedQuality
    }
  } catch (e) {
    console.warn('Could not access localStorage:', e)
  }

  return detectDeviceCapability()
}

export const useGraphicsSettings = create((set, get) => {
  const initialQuality = getInitialQuality()

  return {
    quality: initialQuality,
    pixelRatio:
      typeof window !== 'undefined' ? PRESETS[initialQuality]() : 1,

    setQuality: (q) => {
      try {
        localStorage.setItem('graphics-quality', q)
      } catch (e) {
        console.warn('Could not save to localStorage:', e)
      }

      set({
        quality: q,
        pixelRatio: PRESETS[q](),
      })
    },

    recalculatePixelRatio: () => {
      const { quality } = get()
      set({ pixelRatio: PRESETS[quality]() })
    },
  }
})
