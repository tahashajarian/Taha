// hooks/useRecalculateDPR.ts
import { useEffect } from 'react'
import { useGraphicsSettings } from '../stores/useGraphicsSettings'

export const useRecalculateDPR = () => {
  const { recalculatePixelRatio } = useGraphicsSettings()

  useEffect(() => {
    // Recalculate after mount to ensure proper DPR
    recalculatePixelRatio()
  }, [recalculatePixelRatio])
}
