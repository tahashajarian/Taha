import React, { useMemo, useState, useEffect } from "react";
import { a, useSpring } from "@react-spring/three";
import { randomColor } from "./../../constances/constances";

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

// Keep behavior: drop to a randomized spot near the provided position, persist to localStorage,
// click toggles back to original. Simpler: no "taken spot" checks — same-place overlap is allowed.
// Add a tiny deterministic Y offset per id + polygonOffset on material to avoid z-fighting.

const deterministicHash = (s) => {
  if (!s) return 0;
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
};

const Book = ({ id, position = [0, 0, 0], rotation = [0, 0, 0], clickAble = true }) => {
  const [dropped, setDropped] = useState(false);
  const [settled, setSettled] = useState(false);

  // keep original size behavior
  const height = useMemo(() => 0.3 - Math.random() * 0.05, []);
  const color = useMemo(() => randomColor(), []);

  // tiny deterministic offset per id to reduce z-fighting when many books rest on the same plane
  const idHash = useMemo(() => deterministicHash(String(id)), [id]);
  const tinyYOffset = useMemo(() => (idHash % 7) * 0.0006, [idHash]);
  const polygonOffsetFactor = useMemo(() => (idHash % 5) * 0.5 + 0.1, [idHash]);

  // compute dropTarget: if saved in localStorage use it, otherwise randomize near provided position
  const dropTarget = useMemo(() => {
    const saved = loadDrops()[id];
    if (saved && saved.position && saved.rotation) {
      return { position: saved.position, rotation: saved.rotation };
    }

    // simple randomized target near the original position (keeps the book near its original spot)
    const x = position[0] + Math.random() * -4; // same pattern as your original code
    const z = position[2] + Math.random() * 2;
    // floor Y is absolute (same as your original code), do NOT offset from position[1]
    const y = -2.3555 + Math.random() * 0.02; // keep your original-ish floor Y
    const rotZ = (Math.random() - 0.5) * 0.5;
    return { position: [x, y + tinyYOffset, z], rotation: [Math.PI / 2, 0, rotZ * Math.PI] };
  }, [id, position, tinyYOffset]);

  // if there's a saved drop for this id, mark it dropped on mount
  useEffect(() => {
    const saved = loadDrops()[id];
    if (saved && saved.position) setDropped(true);
  }, [id]);

  // --- Animation only: keep initial pos = provided position
  const [{ pos, rot, scale, wobble }, api] = useSpring(() => ({
    pos: [position[0], position[1], position[2]],
    rot: rotation,
    scale: [1, 1, 1],
    wobble: 0,
    config: { mass: 1, tension: 120, friction: 18 },
  }));

  useEffect(() => {
    if (dropped) {
      setSettled(false);

      api.start({
        to: async (next) => {
          // start above target to give a falling arc
          await next({
            pos: [dropTarget.position[0], dropTarget.position[1] + 0.6 + Math.random() * 0.4, dropTarget.position[2]],
            rot: [dropTarget.rotation[0] + (Math.random() - 0.5) * 0.25, dropTarget.rotation[1], dropTarget.rotation[2] + (Math.random() - 0.5) * 0.25],
            config: { mass: 1, tension: 260, friction: 26 },
          });

          // impact: small overshoot downwards + squash
          await next({
            pos: [dropTarget.position[0], dropTarget.position[1] - 0.04, dropTarget.position[2]],
            scale: [1.06, 0.8, 1.06],
            config: { mass: 1, tension: 420, friction: 40 },
          });

          // rebound and settle to final
          await next({ pos: [dropTarget.position[0], dropTarget.position[1] + 0.01, dropTarget.position[2]], scale: [0.98, 1.02, 0.98], config: { mass: 1, tension: 200, friction: 26 } });

          await next({ pos: dropTarget.position, rot: dropTarget.rotation, scale: [1, 1, 1], config: { mass: 1, tension: 140, friction: 18 } });

          // small wobble to feel alive
          await next({ wobble: 0.02, config: { duration: 140 } });
          await next({ wobble: 0, config: { duration: 380 } });
        },
        onRest: () => setSettled(true),
      });

      // persist position
      setDrop(id, {
        position: dropTarget.position,
        rotation: dropTarget.rotation,
      });
    } else {
      // return to original spot
      api.start({ pos: [position[0], position[1], position[2]], rot: rotation, scale: [1, 1, 1], config: { mass: 1, tension: 220, friction: 26 } });
      removeDropFromStorage(id);
      setSettled(false);
    }
  }, [dropped]);

  // derive rotation with wobble (small extra wiggle)
  const derivedRot = rot.to((r0, r1, r2) => [r0, r1, r2]);

  const toggleDrop = () => {
    if (!clickAble) return;
    setDropped((prev) => !prev);
  };

  return (
    <a.mesh position={pos} rotation={derivedRot} onClick={toggleDrop} castShadow scale={scale}>
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
