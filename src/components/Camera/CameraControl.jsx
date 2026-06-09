// CameraControl.jsx
import { CameraControls } from "@react-three/drei";
import React, { useEffect, useRef } from "react";
import { useCameraControlStore } from "../../stores/useCameraControlStore";

const CameraControl = ({ colliderMeshes = [] }) => {
  const cameraControlsRef = useRef();
  const cameraLookAt = useCameraControlStore((s) => s.cameraLookAt);
  const prevCollidersRef = useRef(colliderMeshes); // OPTIMIZATION: track previous

  useEffect(() => {
    if (cameraLookAt && cameraControlsRef.current) {
      cameraControlsRef.current.setLookAt(...cameraLookAt, true);
    }
  }, [cameraLookAt]);

  // OPTIMIZATION: Only update when collider array contents actually change
  useEffect(() => {
    const cc = cameraControlsRef.current;
    if (!cc) return;

    // Shallow check: if array length and mesh refs are same, skip
    const prev = prevCollidersRef.current;
    if (
      prev.length === colliderMeshes.length &&
      prev.every((m, i) => m === colliderMeshes[i])
    ) {
      return;
    }

    cc.colliderMeshes = colliderMeshes;
    prevCollidersRef.current = colliderMeshes;
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
