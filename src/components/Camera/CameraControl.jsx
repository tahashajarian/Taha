// CameraControl.jsx
import { CameraControls } from "@react-three/drei";
import React, { useEffect, useRef } from "react";
import { useCameraControlStore } from "../../stores/useCameraControlStore";

const CameraControl = () => {
  const cameraControlsRef = useRef();
  const { cameraLookAt, chessMode } = useCameraControlStore();

  useEffect(() => {
    if (cameraLookAt && cameraControlsRef.current) {
      // call setLookAt immediately and animate (true => smooth)
      cameraControlsRef.current?.setLookAt(...cameraLookAt, true);
    }
  }, [cameraLookAt]);

  return (
    <CameraControls
      ref={cameraControlsRef}
      minDistance={1.2}
      maxDistance={chessMode ? 2 : 5.5}
      verticalDragToForward={false}
      maxPolarAngle={Math.PI / 2}
      enablePan={false}
    />
  );
};

export default CameraControl;