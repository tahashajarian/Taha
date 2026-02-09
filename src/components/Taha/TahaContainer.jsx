import React, { useRef, useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import Taha from "./Taha";
import { useCharacterAnimationsStore } from "../../stores/useCharacterAnimationsStore";
import { useArrowsStore } from "../../stores/useArrowStore";
import { useAppStatusStore } from "../../stores/useAppStatusStore";
import { useArrowControls } from "../../hooks/useArrowControls";
import { tableRotation } from "../../constances/constances";

/* -------------------- CONSTANTS -------------------- */
const roomMinX = -5.5;
const roomMaxX = 5.5;
const roomMinZ = -5.5;
const roomMaxZ = 5.5;

const SPEED = 2.2;
const ROTATION_DAMPING = 10.0;

const tableMinx = -1.2;
const tableMaxx = 1.2;
const tableMinz = 0.2;
const tableMaxz = 1.4;

const chairMinX = -0.4;
const chairMaxX = 0.4;
const chairMinZ = -1.4;
const chairMaxZ = -0.2;

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

  const { nodes, materials, animations } = useGLTF(
    "/models/Taha.glb",
    "/draco/",
  );
  const { actions, names } = useAnimations(animations, group);

  const { animation, setAnimation, setAnimations, setPosition, setRotation } =
    useCharacterAnimationsStore();

  // single boolean selector to track movement intent
  const isMoving = useArrowsStore(
    (s) => s.forward || s.backward || s.left || s.right,
  );
  const resetArrows = useArrowsStore.getState().resetArrows;

  const modalIsOpen = useAppStatusStore((s) => s.modalIsOpen);
  const isApploaded = useAppStatusStore((s) => s.isApploaded);
  const { camera } = useThree();

  useArrowControls();

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
    if (!isApploaded || modalIsOpen) return;
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

      vOffset.set(0, 2.0, -3.5);
      vOffset.applyQuaternion(group.current.quaternion);
      camera.position.copy(group.current.position).add(vOffset);
    }

    // normal crossfade to next
    activeAction.current?.fadeOut(0.2);
    next.reset().fadeIn(0.2).play();
    activeAction.current = next;
  }, [animation, actions, resetArrows, setPosition, setRotation, camera]);

  /* ---------------- MOVEMENT (camera follow intentionally removed) ---------------- */
  useFrame((_, delta) => {
    if (!group.current || modalIsOpen) return;
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
    const isInDesk =
      nextX > tableMinx &&
      nextX < tableMaxx &&
      nextZ > tableMinz &&
      nextZ < tableMaxz;

    const isInChair =
      nextX > chairMinX &&
      nextX < chairMaxX &&
      nextZ > chairMinZ &&
      nextZ < chairMaxZ;

    if (
      nextX >= roomMinX &&
      nextX <= roomMaxX &&
      nextZ >= roomMinZ &&
      nextZ <= roomMaxZ &&
      !isInChair &&
      !isInDesk
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

useGLTF.preload("/models/Taha.glb", "/draco/");
export default TahaContainer;
