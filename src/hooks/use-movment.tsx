import { useFrame } from "@react-three/fiber";
import { useArrows } from "./use-arrows";
// import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { Ref, RefObject, useEffect } from "react";
import { useAnimations } from "@react-three/drei";

export const useMovment = ({ objectRef, stickCamera, model }) => {
  const smoothness = 1;
  const speed = 2;
  const { right, backward, left, forward } = useArrows();

  const { actions } = useAnimations(model.animations, model.scene);

  useEffect(() => {
    actions?.wallking?.play();
    // actions?.wallking?.fadeOut(1);
  }, [actions]);
};
