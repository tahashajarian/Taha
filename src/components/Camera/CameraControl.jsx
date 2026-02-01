import { CameraControls } from "@react-three/drei"
import React, { useEffect, useRef } from "react"
import { useCameraControlStore } from "../../stores/useCameraControlStore"

const CameraControl = () => {
  const cameraControlsRef = useRef()
  const { cameraLookAt } = useCameraControlStore()

  useEffect(() => {
    if (cameraLookAt) {
      setTimeout(() => {
        cameraControlsRef.current?.setLookAt(...cameraLookAt, true)
      }, 500)
    }
  }, [cameraLookAt])

  return (
    <CameraControls
      ref={cameraControlsRef}
      minDistance={1.2}
      maxDistance={5.5}
      verticalDragToForward={false}
      maxPolarAngle={Math.PI / 2}
      enablePan={false}           
    />
  )
}

export default CameraControl
