import React, { useMemo, useState, useEffect, useRef } from "react";
import { a, useSpring } from "@react-spring/three";
import { randomColor } from "./../../constances/constances";
import { DEFAULT_DROPS } from "../../constances/defaultDrops";

const STORAGE_KEY = "books:drops";

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

const easeInCubic = (t) => t * t * t;
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const easeOutQuad = (t) => 1 - (1 - t) * (1 - t);

const Book = ({
  id,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  clickAble = true,
}) => {
  const [dropped, setDropped] = useState(false);
  const animationRunRef = useRef(0);
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
      liftY: 0.12 + primary * 0.08,
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
    const saved = loadDrops()[id];
    if (saved && saved.position && saved.rotation) {
      return { position: saved.position, rotation: saved.rotation };
    }
    const x = position[0] + Math.random() * -4;
    const z = position[2] + Math.random() * 2;
    const y = -2.3555 + Math.random() * 0.02;
    const rotZ = (Math.random() - 0.5) * 0.5;
    return {
      position: [x, y + tinyYOffset, z],
      rotation: [Math.PI / 2, 0, rotZ * Math.PI],
    };
  }, [id, position, tinyYOffset]);

  useEffect(() => {
    const saved = loadDrops()[id];
    if (saved && saved.position) setDropped(true);
  }, [id]);

  const [{ pos, rot, scale }, api] = useSpring(() => ({
    pos: [position[0], position[1], position[2]],
    rot: rotation,
    scale: [1, 1, 1],
    config: { mass: 1, tension: 120, friction: 18 },
  }));

  useEffect(() => {
    if (dropped) {
      const runId = ++animationRunRef.current;
      const fallDistance = Math.abs(position[1] - dropTarget.position[1]);
      const releaseDuration = 90 + (idHash % 3) * 18;
      const fallDuration = Math.min(840, Math.max(300, fallDistance * 180));
      const bounceDuration = 120 + (idHash % 3) * 22;
      const settleDuration = 190 + (idHash % 5) * 16;

      const releasePos = [
        position[0] + motionProfile.driftX * 0.35,
        position[1] + motionProfile.liftY,
        position[2] + motionProfile.driftZ * 0.25,
      ];
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

      const releaseRot = [
        rotation[0] + motionProfile.spinX * 0.45,
        rotation[1] + motionProfile.spinY * 0.5,
        rotation[2] + motionProfile.spinZ * 0.35,
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

      api.start({
        to: async (next) => {
          if (runId !== animationRunRef.current) return;
          await next({
            pos: releasePos,
            rot: releaseRot,
            scale: [1, 1, 1],
            config: { duration: releaseDuration, easing: easeOutCubic },
          });

          if (runId !== animationRunRef.current) return;
          await next({
            pos: impactPos,
            rot: impactRot,
            scale: [1.03, 0.94, 1.03],
            config: { duration: fallDuration, easing: easeInCubic },
          });

          if (runId !== animationRunRef.current) return;
          await next({
            pos: bouncePos,
            rot: bounceRot,
            scale: [0.99, 1.02, 0.99],
            config: { duration: bounceDuration, easing: easeOutQuad },
          });

          if (runId !== animationRunRef.current) return;
          await next({
            pos: dropTarget.position,
            rot: dropTarget.rotation,
            scale: [1, 1, 1],
            config: { duration: settleDuration, easing: easeOutCubic },
          });

          if (runId !== animationRunRef.current) return;
          setDrop(id, {
            position: dropTarget.position,
            rotation: dropTarget.rotation,
          });
        },
      });
    } else {
      animationRunRef.current += 1;
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
    if (!clickAble) return;
    setDropped((p) => !p);
  };

  return (
    <a.mesh
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
