import React, { useEffect } from "react";
import { Html, useProgress } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useCameraControl } from "../contexts/CameraControlContext";
import { useAppStatusContext } from "../contexts/AppStatusContext";
import { cameraLookAtConst } from "../constances/constances";

export default function CustomLoader() {
  const { progress } = useProgress();
  const invalidate = useThree((state) => state.invalidate);
  const { setCameraLookAt } = useCameraControl();
  const { setIsAppLoaded } = useAppStatusContext();

  useEffect(() => {
    if (progress < 100) {
      // force a re-render so our <Html> overlay updates
      invalidate();
    } else {
      // once done, do your camera and app‑loaded logic
      setCameraLookAt(cameraLookAtConst);
      setIsAppLoaded(true);
    }
  }, [progress]);

  // while loading, show a centered percentage
  return progress < 100 ? (
    <Html center style={{ color: "white", fontSize: "2rem" }}>
      {Math.ceil(progress)}%
    </Html>
  ) : null;
}
