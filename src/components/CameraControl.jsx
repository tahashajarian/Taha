import { CameraControls } from "@react-three/drei";
import React, { useEffect, useRef } from "react";
import { useCameraControl } from "../contexts/CameraControlContext";

const CameraControl = () => {
  const cameraControlsRef = useRef();
  const { cameraLookAt } = useCameraControl();

  // const {Camera}

  useEffect(() => {
    if (cameraLookAt) {
      cameraControlsRef.current?.setLookAt(...cameraLookAt, true);
    }
  }, [cameraControlsRef, cameraLookAt]);

  return (
    <CameraControls
      ref={cameraControlsRef}
      minDistance={0.001}
      maxDistance={5.5}
      verticalDragToForward={false}
      maxPolarAngle={Math.PI / 2} // Limit rotation to not show below horizon
    />
  );
};

export default CameraControl;
