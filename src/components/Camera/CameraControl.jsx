// CameraControl.jsx
import { CameraControls } from "@react-three/drei";
import React, { useEffect, useRef } from "react";
import { useCameraControlStore } from "../../stores/useCameraControlStore";

const CameraControl = ({ colliderMeshes = [] }) => {
  const cameraControlsRef = useRef();
  const cameraLookAt = useCameraControlStore((s) => s.cameraLookAt);

  useEffect(() => {
    if (cameraLookAt && cameraControlsRef.current) {
      cameraControlsRef.current.setLookAt(...cameraLookAt, true);
    }
  }, [cameraLookAt]);

  // When colliderMeshes change, assign them to the control instance
  useEffect(() => {
    const cc = cameraControlsRef.current;
    if (!cc) return;
    // camera-controls expects actual Mesh objects
    cc.colliderMeshes = colliderMeshes;
    // optional: small collision offset if you see the camera touch geometry
    // cc.collisionOffset = 0.05; // might not exist depending on camera-controls version
  }, [colliderMeshes]);

  return (
    <CameraControls
      ref={cameraControlsRef}
      minDistance={1.2}
      maxDistance={5.5}
      maxPolarAngle={Math.PI / 2}
      enablePan={false}
    />
  );
};

export default CameraControl;
