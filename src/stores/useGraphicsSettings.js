import { create } from 'zustand'

let highTransitionTimers = []

const cancelHighTransition = () => {
  highTransitionTimers.forEach((timer) => clearTimeout(timer))
  highTransitionTimers = []
}

const getDPR = () =>
  typeof window !== 'undefined'
    ? Math.min(window.devicePixelRatio, 1.5)
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
    return 'medium'

  const userAgent = navigator.userAgent.toLowerCase()
  const isMobile =
    /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
      userAgent
    )

  let isLowEndDevice = false

  // Memory detection
  if (navigator.deviceMemory && navigator.deviceMemory <= 4) {
    isLowEndDevice = true
  }

  // CPU core detection
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) {
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

  // Start conservatively. PerformanceMonitor can raise the quality after the
  // scene is stable, without making weaker devices pay a high startup cost.
  return isLowEndDevice ? 'low' : 'medium'
}

// Get initial quality setting
const getInitialQuality = () => {
  if (typeof window === 'undefined') return 'medium'

  try {
    const savedQuality = localStorage.getItem('graphics-quality')
    if (
      savedQuality &&
      ['high', 'medium', 'low', 'ultra-low'].includes(savedQuality)
    ) {
      // Never cold-start with the most expensive preset. The performance
      // monitor can safely raise quality after the scene has warmed up.
      return savedQuality === 'high' ? 'medium' : savedQuality
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
    highQualityStage: initialQuality === 'high' ? 3 : 0,
    pixelRatio:
      typeof window !== 'undefined' ? PRESETS[initialQuality]() : 1,

    setQuality: (q) => {
      cancelHighTransition()

      try {
        localStorage.setItem('graphics-quality', q)
      } catch (e) {
        console.warn('Could not save to localStorage:', e)
      }

      set({
        quality: q,
        highQualityStage: q === 'high' ? 3 : 0,
        pixelRatio: PRESETS[q](),
      })
    },

    beginHighQualityTransition: () => {
      if (get().quality !== 'medium') return

      cancelHighTransition()

      try {
        localStorage.setItem('graphics-quality', 'high')
      } catch (e) {
        console.warn('Could not save to localStorage:', e)
      }

      const targetDPR = PRESETS.high()
      set({ quality: 'high', highQualityStage: 0 })

      const scheduleStage = (delay, stage, pixelRatio) => {
        const timer = setTimeout(() => {
          if (get().quality !== 'high') return
          set({ highQualityStage: stage, pixelRatio })
        }, delay)
        highTransitionTimers.push(timer)
      }

      scheduleStage(600, 1, Math.min(targetDPR, 1.25))
      scheduleStage(1400, 2, Math.min(targetDPR, 1.5))
      scheduleStage(2400, 3, targetDPR)
    },

    recalculatePixelRatio: () => {
      const { quality } = get()
      set({ pixelRatio: PRESETS[quality]() })
    },
  }
})
