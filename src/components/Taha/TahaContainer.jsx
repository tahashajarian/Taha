import React, { useRef, useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import Taha from "./Taha";
import { useCharacterAnimationsStore } from "../../stores/useCharacterAnimationsStore";
import { useArrowsStore } from "../../stores/useArrowStore";
import { useAppStatusStore } from "../../stores/useAppStatusStore";
import { useArrowControls } from "../../hooks/useArrowControls";
import { useTourStore } from "../../stores/useTourStore";
import { tableRotation } from "../../constances/constances";

/* -------------------- CONSTANTS -------------------- */
const roomMinX = -5.5;
const roomMaxX = 5.5;
const roomMinZ = -5.5;
const roomMaxZ = 5.5;

const SPEED = 2.2;
const ROTATION_DAMPING = 10.0;
const PLAYER_RADIUS = 0.22;

const tableMinx = -1.2;
const tableMaxx = 1.2;
const tableMinz = 0.2;
const tableMaxz = 1.4;

const chairMinX = -0.4;
const chairMaxX = 0.4;
const chairMinZ = -1.4;
const chairMaxZ = -0.2;

const sofaMinX = 2.25;
const sofaMaxX = 4.75;
const sofaMinZ = -5.8;
const sofaMaxZ = -4.3;

const asaliMinX = 2.8;
const asaliMaxX = 4.2;
const asaliMinZ = -4.05;
const asaliMaxZ = -2.75;

const fireplaceMinX = -6.05;
const fireplaceMaxX = -4.55;
const fireplaceMinZ = 3.25;
const fireplaceMaxZ = 4.75;

const catCornerMinX = 0.75;
const catCornerMaxX = 1.95;
const catCornerMinZ = -5.55;
const catCornerMaxZ = -4.5;

const isInBounds = (x, z, minX, maxX, minZ, maxZ, padding = 0) =>
  x >= minX - padding &&
  x <= maxX + padding &&
  z >= minZ - padding &&
  z <= maxZ + padding;

/* ---------- REUSED OBJECTS (NO ALLOCATIONS) -------- */
const vInput = new THREE.Vector3();
const vCamDir = new THREE.Vector3();
const vCamRight = new THREE.Vector3();
const vMove = new THREE.Vector3();
const vOffset = new THREE.Vector3();
const qTarget = new THREE.Quaternion();
const eulerTmp = new THREE.Euler();
/* =================================================== */

const TahaContainer = (props) => {
  const group = useRef(null);
  const activeAction = useRef(null);
  const typingForcedRef = useRef(false);
  const typingKeyRef = useRef(null);
  const preWelcomeRotationRef = useRef(null);

  const { nodes, materials, animations } = useGLTF(
    "/models/Taha-optimized.glb",
    "/draco/",
  );
  const { actions, names } = useAnimations(animations, group);

  const animation = useCharacterAnimationsStore((s) => s.animation);
  const setAnimation = useCharacterAnimationsStore((s) => s.setAnimation);
  const setAnimations = useCharacterAnimationsStore((s) => s.setAnimations);
  const setPosition = useCharacterAnimationsStore((s) => s.setPosition);
  const setRotation = useCharacterAnimationsStore((s) => s.setRotation);

  // single boolean selector to track movement intent
  const isMoving = useArrowsStore(
    (s) => s.forward || s.backward || s.left || s.right,
  );
  const resetArrows = useArrowsStore.getState().resetArrows;

  const modalIsOpen = useAppStatusStore((s) => s.modalIsOpen);
  const isApploaded = useAppStatusStore((s) => s.isApploaded);
  const welcomeOpen = useAppStatusStore((s) => s.welcomeOpen);
  const tourActive = useTourStore((s) => s.active);
  const { camera } = useThree();

  useArrowControls();

  useEffect(() => {
    if (!welcomeOpen || !group.current) return;
    preWelcomeRotationRef.current = group.current.quaternion.clone();

    return () => {
      if (group.current && preWelcomeRotationRef.current) {
        group.current.quaternion.copy(preWelcomeRotationRef.current);
      }
      preWelcomeRotationRef.current = null;
    };
  }, [welcomeOpen]);

  /* ---------- REGISTER ANIMATION NAMES ---------- */
  useEffect(() => {
    if (names && names.length) setAnimations?.(names);
  }, [names, setAnimations]);

  /* ---------- when actions obj appears, cache typing key & stop auto-play ---------- */
  useEffect(() => {
    if (!actions) return;

    // cache a case-insensitive match for "typing"
    const typingKey =
      Object.keys(actions).find((k) => k.toLowerCase() === "typing") || null;
    typingKeyRef.current = typingKey;

    // stop all actions once when actions object first arrives to avoid drei auto-play mixing
    Object.values(actions).forEach((a) => {
      a.stop();
    });

    // reset activeAction; we'll control playing explicitly
    activeAction.current = null;
  }, [actions]);

  /* ---------- WELCOME: IDLE, FACING THE CAMERA ---------- */
  useEffect(() => {
    if (!welcomeOpen || !actions || !group.current) return;
    const idleKey = Object.keys(actions).find(
      (key) => key.toLowerCase() === "idle",
    );
    if (!idleKey) return;

    const idleAction = actions[idleKey];
    idleAction.reset().fadeIn(0.15).play();
    activeAction.current = idleAction;
  }, [welcomeOpen, actions]);

  /* ---------- helper: play one action and stop all others ---------- */
  const playExclusive = (key, fade = 0.2) => {
    if (!actions) return;
    const act = actions[key];
    if (!act) return;
    // stop everything first to avoid blended mixes
    Object.values(actions).forEach((a) => a.stop());
    act.reset().fadeIn(fade).play();
    activeAction.current = act;
  };

  /* ---------- FORCE typing on first ready state (safe & deterministic) ---------- */
  useEffect(() => {
    if (typingForcedRef.current) return;
    if (!actions || !group.current) return;
    if (!isApploaded || modalIsOpen || welcomeOpen || tourActive) return;
    // only force if there's no movement now
    if (
      useArrowsStore.getState().forward ||
      useArrowsStore.getState().backward ||
      useArrowsStore.getState().left ||
      useArrowsStore.getState().right
    )
      return;

    const typingKey = typingKeyRef.current;
    if (!typingKey) return;

    typingForcedRef.current = true;
    setAnimation("typing");
    resetArrows?.();

    // stop everything and start typing exclusively
    playExclusive(typingKey, 0.2);

    const pos = [0, 0, 0];
    group.current.position.set(...pos);
    group.current.rotation.set(...tableRotation);
    setPosition?.(pos);
    setRotation?.(tableRotation);

    vOffset.set(0, 2.0, -3.5);
    vOffset.applyQuaternion(group.current.quaternion);
    camera.position.copy(group.current.position).add(vOffset);
  }, [
    actions,
    isApploaded,
    modalIsOpen,
    welcomeOpen,
    tourActive,
    resetArrows,
    setAnimation,
    setPosition,
    setRotation,
    camera,
  ]);

  /* ---------- INPUT → ANIMATION STATE (guard typing) ---------- */
  useEffect(() => {
    if (modalIsOpen) return;
    if (animation === "typing") return; // lock typing

    if (isMoving) setAnimation("walk");
    else setAnimation("idle");
  }, [isMoving, animation, modalIsOpen, setAnimation]);

  /* ---------- ANIMATION SWITCHING (fade to next) ---------- */
  useEffect(() => {
    if (!actions || !group.current) return;
    const next = actions[animation];
    if (!next) return;

    // if next is already active, nothing to do
    if (activeAction.current === next) return;

    if (animation === "typing") {
      // on explicit typing switch, ensure position/camera are consistent
      resetArrows?.();
      const pos = [0, 0, 0];
      group.current.position.set(...pos);
      group.current.rotation.set(...tableRotation);
      setPosition?.(pos);
      setRotation?.(tableRotation);

      if (!tourActive) {
        vOffset.set(0, 2.0, -3.5);
        vOffset.applyQuaternion(group.current.quaternion);
        camera.position.copy(group.current.position).add(vOffset);
      }
    }

    // normal crossfade to next
    activeAction.current?.fadeOut(0.2);
    next.reset().fadeIn(0.2).play();
    activeAction.current = next;
  }, [
    animation,
    actions,
    resetArrows,
    setPosition,
    setRotation,
    camera,
    tourActive,
  ]);

  /* ---------------- MOVEMENT (camera follow intentionally removed) ---------------- */
  useFrame((_, delta) => {
    if (!group.current || modalIsOpen) return;
    if (welcomeOpen) {
      vCamDir.copy(camera.position).sub(group.current.position);
      vCamDir.y = 0;
      if (vCamDir.lengthSq() > 0.0001) {
        qTarget.setFromAxisAngle(
          THREE.Object3D.DEFAULT_UP,
          Math.atan2(vCamDir.x, vCamDir.z),
        );
        group.current.quaternion.slerp(
          qTarget,
          1 - Math.exp(-6 * delta),
        );
      }
      return;
    }
    if (animation === "typing") return; // lock movement while typing

    // read arrows state once per frame (avoids re-subscribing)
    const { forward, backward, left, right } = useArrowsStore.getState();
    vInput.set(
      (left ? 1 : 0) + (right ? -1 : 0),
      0,
      (forward ? 1 : 0) + (backward ? -1 : 0),
    );
    if (vInput.lengthSq() === 0) return;

    camera.getWorldDirection(vCamDir);
    vCamDir.y = 0;
    vCamDir.normalize();

    vCamRight.crossVectors(camera.up, vCamDir).normalize();

    vMove
      .set(0, 0, 0)
      .addScaledVector(vCamDir, vInput.z)
      .addScaledVector(vCamRight, vInput.x)
      .normalize()
      .multiplyScalar(SPEED * delta);

    const nextX = group.current.position.x + vMove.x;
    const nextZ = group.current.position.z + vMove.z;
    const isInDesk = isInBounds(
      nextX,
      nextZ,
      tableMinx,
      tableMaxx,
      tableMinz,
      tableMaxz,
    );

    const isInChair = isInBounds(
      nextX,
      nextZ,
      chairMinX,
      chairMaxX,
      chairMinZ,
      chairMaxZ,
    );

    const isInSofa = isInBounds(
      nextX,
      nextZ,
      sofaMinX,
      sofaMaxX,
      sofaMinZ,
      sofaMaxZ,
      PLAYER_RADIUS,
    );

    const isInAsali = isInBounds(
      nextX,
      nextZ,
      asaliMinX,
      asaliMaxX,
      asaliMinZ,
      asaliMaxZ,
      PLAYER_RADIUS,
    );

    const isInFireplace = isInBounds(
      nextX,
      nextZ,
      fireplaceMinX,
      fireplaceMaxX,
      fireplaceMinZ,
      fireplaceMaxZ,
      PLAYER_RADIUS,
    );

    const isInCatCorner = isInBounds(
      nextX,
      nextZ,
      catCornerMinX,
      catCornerMaxX,
      catCornerMinZ,
      catCornerMaxZ,
      PLAYER_RADIUS,
    );

    if (
      nextX >= roomMinX &&
      nextX <= roomMaxX &&
      nextZ >= roomMinZ &&
      nextZ <= roomMaxZ &&
      !isInChair &&
      !isInDesk &&
      !isInSofa &&
      !isInAsali &&
      !isInFireplace &&
      !isInCatCorner
    ) {
      group.current.position.set(nextX, 0, nextZ);

      // smooth rotation toward movement direction
      const angle = Math.atan2(vMove.x, vMove.z);
      qTarget.setFromAxisAngle(THREE.Object3D.DEFAULT_UP, angle);

      const t = 1 - Math.exp(-ROTATION_DAMPING * delta);
      group.current.quaternion.slerp(qTarget, t);

      setPosition?.([nextX, 0, nextZ]);

      eulerTmp.setFromQuaternion(group.current.quaternion, "YXZ");
      setRotation?.([0, eulerTmp.y, 0]);
    }
  });

  /* ------------------- RENDER ------------------- */
  return (
    <Taha charRef={group} nodes={nodes} materials={materials} {...props} />
  );
};

useGLTF.preload("/models/Taha-optimized.glb", "/draco/");
export default TahaContainer;
