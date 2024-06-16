import React, { useEffect, useRef, useState } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useCharacterAnimations } from "../contexts/CharacterAnimations";
import { useArrows } from "./../hooks/use-arrows";
import * as THREE from "three";
import Taha from "./Taha";

const roomMinX = -5.5;
const roomMaxX = 5.5;
const roomMinZ = -5.5;
const roomMaxZ = 5.5;

const TahaContainer = (props) => {
  const group = useRef();
  const currentAction = useRef("");
  const { nodes, materials, animations } = useGLTF("/models/Taha.glb");
  const { actions, names } = useAnimations(animations, group);
  const {
    setAnimations,
    animation,
    setAnimation,
    position,
    setPosition,
    rotation,
    setRotation,
  } = useCharacterAnimations();
  const { backward, forward, left, right } = useArrows();
  const { camera } = useThree();

  const speed = 0.04; // Adjust speed as needed

  useEffect(() => {
    if (right || left || forward || backward) {
      setAnimation("walk");
    } else {
      setAnimation("idle");
    }
  }, [right, left, forward, backward]);

  setAnimations(names);
  useEffect(() => {
    if (currentAction.current !== actions[animation]) {
      const nextActionToPlay = actions[animation];
      const current = actions[currentAction.current];
      current?.fadeOut(0.2);
      nextActionToPlay?.reset().fadeIn(0.2).play();
      currentAction.current = animation;
    }
  }, [animation, actions, names]);

  useEffect(() => {
    setAnimation("typing");
  }, []);

  useFrame(() => {
    const direction = [0, 0, 0];

    if (forward) direction[2] += speed;
    if (backward) direction[2] -= speed;
    if (left) direction[0] += speed;
    if (right) direction[0] -= speed;

    // Transform the direction based on the camera's orientation
    const cameraDirection = camera.getWorldDirection(new THREE.Vector3());
    const cameraRight = new THREE.Vector3();
    const cameraUp = new THREE.Vector3();
    cameraRight.crossVectors(camera.up, cameraDirection).normalize();
    cameraUp.crossVectors(cameraDirection, cameraRight).normalize();

    const transformedDirection = new THREE.Vector3()
      .addScaledVector(cameraDirection, direction[2])
      .addScaledVector(cameraRight, direction[0]);

    const newPosition = [
      position[0] + transformedDirection.x,
      position[1],
      position[2] + transformedDirection.z,
    ];

    if (
      newPosition[0] < roomMinX ||
      newPosition[0] > roomMaxX ||
      newPosition[2] < roomMinZ ||
      newPosition[2] > roomMaxZ
    ) {
      return; // Prevent movement if it exceeds boundaries
    }

    setPosition(newPosition);
    group.current.position.set(...newPosition);

    if (forward || backward || left || right) {
      const angle = Math.atan2(transformedDirection.x, transformedDirection.z);
      setRotation([0, angle, 0]);
    }
  });

  useEffect(() => {
    group.current.rotation.set(...rotation);
    camera.lookAt(
      new THREE.Vector3(
        group.current.position.x,
        group.current.position.y + 0.7,
        group.current.position.z
      )
    );
  }, [position, rotation]);
  return <Taha charRef={group} materials={materials} nodes={nodes} />;
};

useGLTF.preload("/models/Taha.glb");

export default TahaContainer;
