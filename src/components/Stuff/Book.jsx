import React, { useMemo, useState, useEffect } from "react";
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

const Book = ({
  id,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  clickAble = true,
}) => {
  const [dropped, setDropped] = useState(false);
  const [settled, setSettled] = useState(false);
  useEffect(() => seedDefaultDrops(), []);
  const height = useMemo(() => 0.4 - Math.random() * 0.06, []);
  const color = useMemo(() => randomColor(), []);
  const idHash = useMemo(() => deterministicHash(String(id)), [id]);
  const tinyYOffset = useMemo(() => (idHash % 7) * 0.0006, [idHash]);
  const polygonOffsetFactor = useMemo(() => (idHash % 5) * 0.5 + 0.1, [idHash]);

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
      const fallDistance = Math.abs(position[1] - dropTarget.position[1]);
      const fallDuration = Math.min(700, Math.max(220, fallDistance * 150));

      api.start({
        to: async (next) => {
          // slow hang at the top
          await next({
            pos: [position[0], position[1] + 0.4, position[2]],
            rot: rotation,
            config: { duration: 220 },
          });

          // distance-based fall
          await next({
            pos: dropTarget.position,
            rot: dropTarget.rotation,
            config: { duration: fallDuration },
          });
        },
        onRest: () => {
          setDrop(id, {
            position: dropTarget.position,
            rotation: dropTarget.rotation,
          });
        },
      });
    } else {
      api.start({
        pos: position,
        rot: rotation,
        config: { duration: 180 },
      });
      removeDropFromStorage(id);
    }
  }, [dropped]);

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
