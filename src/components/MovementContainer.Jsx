import { directionOffset } from "@/functions/offset-direction";
import { useArrows } from "@/hooks/use-arrows";
import { useAnimations, Text } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

let walkDirection = new THREE.Vector3();
let rotatAngle = new THREE.Vector3(0, 1, 0);
let rotateQuaternion = new THREE.Quaternion();
let cameraTarget = new THREE.Vector3();

const MovementContainer = (props) => {
  const { actions } = useAnimations(props.model.animations, props.model.scene);

  const controlRef = useRef(null);
  const modelRef = useRef(null);
  const usernameRef = useRef(null);
  const camera = useThree((state) => state.camera);
  const { right, forward, left, backward } = useArrows();
  const currentAction = useRef("");

  const updateCamera = (moveX, moveZ) => {
    camera.position.x += moveX;
    camera.position.z += moveZ;
    cameraTarget.x = modelRef.current.position.x;
    cameraTarget.y = modelRef.current.position.y + 4;
    cameraTarget.z = modelRef.current.position.z;
    if (controlRef.current) {
      controlRef.current.target = cameraTarget;
    }
  };

  useEffect(() => {
    let action = "";
    if (right || left || forward || backward) {
      action = "walking";
    } else {
      action = "idle";
    }
    if (currentAction.current !== action) {
      const nextActionToPlay = actions[action];
      const current = actions[currentAction.current];
      current?.fadeOut(0.2);
      nextActionToPlay?.reset().fadeIn(0.2).play();
      currentAction.current = action;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [right, left, forward, backward]);

  useEffect(() => {
    cameraTarget.x = modelRef.current.position.x;
    cameraTarget.y = modelRef.current.position.y + 4;
    cameraTarget.z = modelRef.current.position.z;
    if (controlRef.current) {
      controlRef.current.target = cameraTarget;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame((state, delta) => {
    if (currentAction.current === "walking") {
      let angleYCameraDirection = Math.atan2(
        camera.position.x - modelRef.current.position.x,
        camera.position.z - modelRef.current.position.z
      );
      let newDirectionOffset = directionOffset({
        forward,
        backward,
        left,
        right,
      });
      rotateQuaternion.setFromAxisAngle(
        rotatAngle,
        angleYCameraDirection + newDirectionOffset
      );
      props.model.scene.quaternion.rotateTowards(rotateQuaternion, 0.2);

      camera.getWorldDirection(walkDirection);
      walkDirection.y = 0;
      walkDirection.normalize();
      walkDirection.applyAxisAngle(rotatAngle, newDirectionOffset);

      const velocity = 1;
      const moveX = walkDirection.x * velocity * delta;
      const moveZ = walkDirection.z * velocity * delta;
      modelRef.current.position.x += moveX;
      modelRef.current.position.z += moveZ;
      if (props.withCamera) {
        updateCamera(moveX, moveZ);
      }
      // usernameRef.current.lookAt(camera.position);
    }
  });

  return (
    <group ref={modelRef}>
      <Text ref={usernameRef} position={[0, 2.2, 0]} scale={0.2}>
        {props.name}
      </Text>
      {/* <OrbitControls ref={controlRef} /> */}
      <primitive object={props.model.scene} />
    </group>
  );
};

export default MovementContainer;
