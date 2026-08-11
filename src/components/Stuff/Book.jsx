import React, { useMemo, useState, useEffect, useRef } from "react";
import { a, useSpring } from "@react-spring/three";
import { useFrame } from "@react-three/fiber";
import { randomColor } from "./../../constances/constances";
import { DEFAULT_DROPS } from "../../constances/defaultDrops";

const STORAGE_KEY = "books:drops";
const GRAVITY = 14;

const loadDrops = () => {
  try {
    if (typeof window === "undefined") return {};
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "{}");
  } catch (e) {
    console.warn("failed to load drops", e);
    return {};
  }
};

const seedDefaultDrops = () => {
  if (typeof window === "undefined") return;
  const existing = loadDrops();
  if (Object.keys(existing).length > 0) return;
  saveDrops(DEFAULT_DROPS);
};

const saveDrops = (drops) => {
  try {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(drops));
  } catch (e) {
    console.warn("failed to save drops", e);
  }
};

const setDrop = (id, payload) => {
  const drops = loadDrops();
  drops[id] = payload;
  saveDrops(drops);
};

const removeDropFromStorage = (id) => {
  const drops = loadDrops();
  if (drops[id]) {
    delete drops[id];
    saveDrops(drops);
  }
};

const deterministicHash = (s) => {
  if (!s) return 0;
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
};

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const easeOutQuad = (t) => 1 - (1 - t) * (1 - t);

const Book = ({
  id,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  clickAble = true,
  dropBounds,
  plannedDropPosition,
}) => {
  const [dropped, setDropped] = useState(false);
  const animationRunRef = useRef(0);
  const meshRef = useRef(null);
  const impactHandlerRef = useRef(null);
  const flightRef = useRef({
    active: false,
    elapsed: 0,
    duration: 0,
    runId: 0,
    startX: 0,
    startY: 0,
    startZ: 0,
    velocityX: 0,
    velocityY: 0,
    velocityZ: 0,
    startRotX: 0,
    startRotY: 0,
    startRotZ: 0,
    angularX: 0,
    angularY: 0,
    angularZ: 0,
  });
  useEffect(() => seedDefaultDrops(), []);
  const height = useMemo(() => 0.4 - Math.random() * 0.06, []);
  const color = useMemo(() => randomColor(), []);
  const idHash = useMemo(() => deterministicHash(String(id)), [id]);
  const tinyYOffset = useMemo(() => (idHash % 7) * 0.0006, [idHash]);
  const polygonOffsetFactor = useMemo(() => (idHash % 5) * 0.5 + 0.1, [idHash]);
  const motionProfile = useMemo(() => {
    const primary = ((idHash % 97) + 3) / 100;
    const secondary = (((Math.floor(idHash / 7) % 101) / 100) * 2) - 1;
    const direction = idHash % 2 === 0 ? 1 : -1;

    return {
      launchY: 0.5 + primary * 0.34,
      driftX: direction * (0.025 + primary * 0.045),
      driftZ: secondary * 0.045,
      spinX: direction * (0.06 + primary * 0.16),
      spinY: secondary * 0.12,
      spinZ: direction * (0.15 + primary * 0.28) * Math.PI,
      impactDepth: 0.012 + primary * 0.018,
      bounceY: 0.018 + primary * 0.035,
      settleTilt: secondary * 0.06,
    };
  }, [idHash]);

  const dropTarget = useMemo(() => {
    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
    const clampPosition = (target, limitTravel = true) => {
      const roomClamped = [
        dropBounds ? clamp(target[0], dropBounds[0], dropBounds[1]) : target[0],
        target[1],
        dropBounds ? clamp(target[2], dropBounds[2], dropBounds[3]) : target[2],
      ];
      if (!limitTravel) return roomClamped;

      const deltaX = roomClamped[0] - position[0];
      const deltaZ = roomClamped[2] - position[2];
      const travelDistance = Math.hypot(deltaX, deltaZ);
      const maxTravel = 1.05 + (idHash % 11) * 0.045;
      if (travelDistance <= maxTravel) return roomClamped;

      const travelScale = maxTravel / travelDistance;
      return [
        position[0] + deltaX * travelScale,
        roomClamped[1],
        position[2] + deltaZ * travelScale,
      ];
    };
    const saved = loadDrops()[id];
    const defaultDrop = DEFAULT_DROPS[id];
    if (plannedDropPosition) {
      return {
        position: clampPosition(plannedDropPosition, false),
        rotation:
          saved?.rotation ||
          defaultDrop?.rotation ||
          [Math.PI / 2, 0, ((idHash % 101) / 100 - 0.5) * Math.PI],
      };
    }
    if (saved && saved.position && saved.rotation) {
      return { position: clampPosition(saved.position), rotation: saved.rotation };
    }
    const x = position[0] + Math.random() * -4;
    const z = position[2] + Math.random() * 2;
    const y = -2.3555 + Math.random() * 0.02;
    const rotZ = (Math.random() - 0.5) * 0.5;
    return {
      position: clampPosition([x, y + tinyYOffset, z]),
      rotation: [Math.PI / 2, 0, rotZ * Math.PI],
    };
  }, [dropBounds, id, idHash, plannedDropPosition, position, tinyYOffset]);

  useEffect(() => {
    const saved = loadDrops()[id];
    if ((saved && saved.position) || DEFAULT_DROPS[id]) setDropped(true);
  }, [id]);

  const [{ pos, rot, scale }, api] = useSpring(() => ({
    pos: [position[0], position[1], position[2]],
    rot: rotation,
    scale: [1, 1, 1],
    config: { mass: 1, tension: 120, friction: 18 },
  }));

  useFrame((_, delta) => {
    const flight = flightRef.current;
    const mesh = meshRef.current;
    if (!flight.active || !mesh) return;

    flight.elapsed = Math.min(
      flight.elapsed + Math.min(delta, 0.05),
      flight.duration,
    );
    const time = flight.elapsed;
    mesh.position.set(
      flight.startX + flight.velocityX * time,
      flight.startY + flight.velocityY * time - 0.5 * GRAVITY * time * time,
      flight.startZ + flight.velocityZ * time,
    );
    mesh.rotation.set(
      flight.startRotX + flight.angularX * time,
      flight.startRotY + flight.angularY * time,
      flight.startRotZ + flight.angularZ * time,
    );

    if (time < flight.duration) return;
    flight.active = false;
    impactHandlerRef.current?.(flight.runId);
  });

  useEffect(() => {
    if (dropped) {
      const runId = ++animationRunRef.current;
      const bounceDuration = 120 + (idHash % 3) * 22;
      const settleDuration = 190 + (idHash % 5) * 16;
      const impactPos = [
        dropTarget.position[0],
        dropTarget.position[1] - motionProfile.impactDepth,
        dropTarget.position[2],
      ];
      const bouncePos = [
        dropTarget.position[0] + motionProfile.driftX * 0.1,
        dropTarget.position[1] + motionProfile.bounceY,
        dropTarget.position[2] + motionProfile.driftZ * 0.1,
      ];

      const impactRot = [
        dropTarget.rotation[0] + motionProfile.spinX,
        dropTarget.rotation[1] + motionProfile.spinY,
        dropTarget.rotation[2] + motionProfile.spinZ,
      ];
      const bounceRot = [
        dropTarget.rotation[0] + motionProfile.spinX * 0.25,
        dropTarget.rotation[1] + motionProfile.spinY * 0.3,
        dropTarget.rotation[2] + motionProfile.settleTilt,
      ];
      impactHandlerRef.current = (impactRunId) => {
        if (impactRunId !== animationRunRef.current) return;
        api.set({ pos: impactPos, rot: impactRot, scale: [1.03, 0.94, 1.03] });
        api.start({
          to: async (next) => {
            await next({
              pos: bouncePos,
              rot: bounceRot,
              scale: [0.99, 1.02, 0.99],
              config: { duration: bounceDuration, easing: easeOutQuad },
            });

            if (impactRunId !== animationRunRef.current) return;
            await next({
              pos: dropTarget.position,
              rot: dropTarget.rotation,
              scale: [1, 1, 1],
              config: { duration: settleDuration, easing: easeOutCubic },
            });

            if (impactRunId !== animationRunRef.current) return;
            setDrop(id, {
              position: dropTarget.position,
              rotation: dropTarget.rotation,
            });
            impactHandlerRef.current = null;
          },
        });
      };

      api.stop();
      const velocityY = Math.sqrt(2 * GRAVITY * motionProfile.launchY);
      const verticalDelta = impactPos[1] - position[1];
      const duration =
        (velocityY +
          Math.sqrt(velocityY * velocityY - 2 * GRAVITY * verticalDelta)) /
        GRAVITY;
      const flight = flightRef.current;
      flight.active = true;
      flight.elapsed = 0;
      flight.duration = duration;
      flight.runId = runId;
      flight.startX = position[0];
      flight.startY = position[1];
      flight.startZ = position[2];
      flight.velocityX = (impactPos[0] - position[0]) / duration;
      flight.velocityY = velocityY;
      flight.velocityZ = (impactPos[2] - position[2]) / duration;
      flight.startRotX = rotation[0];
      flight.startRotY = rotation[1];
      flight.startRotZ = rotation[2];
      flight.angularX = (impactRot[0] - rotation[0]) / duration;
      flight.angularY = (impactRot[1] - rotation[1]) / duration;
      flight.angularZ = (impactRot[2] - rotation[2]) / duration;
    } else {
      animationRunRef.current += 1;
      flightRef.current.active = false;
      impactHandlerRef.current = null;
      api.start({
        pos: position,
        rot: rotation,
        scale: [1, 1, 1],
        config: { duration: 220, easing: easeOutCubic },
      });
      removeDropFromStorage(id);
    }
  }, [api, dropped, dropTarget, id, idHash, motionProfile, position, rotation]);

  const derivedRot = rot.to((r0, r1, r2) => [r0, r1, r2]);

  const toggleDrop = () => {
    if (!clickAble || flightRef.current.active) return;
    setDropped((p) => !p);
  };

  return (
    <a.mesh
      ref={meshRef}
      position={pos}
      rotation={derivedRot}
      onClick={toggleDrop}
      castShadow
      scale={scale}
    >
      <boxGeometry args={[0.25, height, 0.05]} />
      <meshStandardMaterial
        color={color}
        polygonOffset={true}
        polygonOffsetFactor={polygonOffsetFactor}
        polygonOffsetUnits={1}
      />
    </a.mesh>
  );
};

export default Book;
