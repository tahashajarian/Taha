import { CameraControls } from "@react-three/drei";
import React, { useEffect, useRef } from "react";
import { useCameraControl } from "../contexts/CameraControlContext";

const CameraControl = () => {
  const cameraControlsRef = useRef();
  const { cameraLookAt } = useCameraControl();

  // const {Camera}

  useEffect(() => {
    if (cameraLookAt) {
      setTimeout(() => {
        cameraControlsRef.current?.setLookAt(...cameraLookAt, true);
      }, 500);
    }
  }, [cameraControlsRef, cameraLookAt]);

  return (
    <CameraControls
      ref={cameraControlsRef}
      minDistance={1.2}
      maxDistance={5.5}
      verticalDragToForward={false}
      maxPolarAngle={Math.PI / 2} // Limit rotation to not show below horizon
    />
  );
};

export default CameraControl;
