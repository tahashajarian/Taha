import React, { useState } from 'react'
import { AdaptiveDpr, PerformanceMonitor } from '@react-three/drei'
import WebGLPerformanceManager from './WebGLPerformanceManager'
import CleanUpHandler from './CleanupHandler'

const HandlePerformance: React.FC = () => {
  const [lowPerformance, setLowPerformance] = useState(false)

  return (
    <>
      <PerformanceMonitor
        ms={1000 / 45} // Target ~45 FPS (i.e. ~22ms per frame)
        threshold={0.3} // A narrow buffer zone before toggling state
        flipflops={3} // Require 3 consecutive changes before switching state
        onDecline={(api) => {
          console.log(`performance => FPS declined: ${api.fps.toFixed(1)}`)
          if (!lowPerformance) {
            setLowPerformance(true)
          }
        }}
        onIncline={(api) => {
          console.log(`performance => FPS improved: ${api.fps.toFixed(1)}`)
          if (lowPerformance) {
            setLowPerformance(false)
          }
        }}
      >
        {/* AdaptiveDpr can automatically adjust the device pixel ratio.
            You can further configure it or even conditionally change settings */}
        <AdaptiveDpr pixelated />
      </PerformanceMonitor>

      {/* Handle any necessary cleanup */}
      <CleanUpHandler />

      {/* Pass the lowPerformance state to adjust quality in your WebGL manager */}
      <WebGLPerformanceManager lowPerformance={lowPerformance} />
    </>
  )
}

export default HandlePerformance
