import React, { useEffect, useMemo } from "react";
import { RepeatWrapping, Shape, ShapeGeometry } from "three";
import { useTexture } from "@react-three/drei";

const WALL_TEXTURE_URL =
  "/textures/Poliigon_PlasticMoldDryBlast_7495/256/Poliigon_PlasticMoldDryBlast_7495_BaseColor.jpg";

useTexture.preload(WALL_TEXTURE_URL);

const makeWallGeometry = (args, windowPosition, windowSize) => {
  const [wallWidth, wallHeight] = args;
  const shape = new Shape();

  shape.moveTo(-wallWidth / 2, -wallHeight / 2);
  shape.lineTo(wallWidth / 2, -wallHeight / 2);
  shape.lineTo(wallWidth / 2, wallHeight / 2);
  shape.lineTo(-wallWidth / 2, wallHeight / 2);
  shape.lineTo(-wallWidth / 2, -wallHeight / 2);

  if (windowPosition && windowSize) {
    const [windowX, windowY] = windowPosition;
    const [windowWidth, windowHeight] = windowSize;
    const hole = new Shape();

    hole.moveTo(windowX - windowWidth / 2, windowY - windowHeight / 2);
    hole.lineTo(windowX + windowWidth / 2, windowY - windowHeight / 2);
    hole.lineTo(windowX + windowWidth / 2, windowY + windowHeight / 2);
    hole.lineTo(windowX - windowWidth / 2, windowY + windowHeight / 2);
    hole.lineTo(windowX - windowWidth / 2, windowY - windowHeight / 2);
    shape.holes.push(hole);
  }

  return new ShapeGeometry(shape);
};

const buildWallKey = (args, windowPosition, windowSize) =>
  `${args.join(",")}|${windowPosition?.join(",") || "none"}|${windowSize?.join(",") || "none"}`;

const geometryCache = new Map();

const getCachedWallGeometry = (args, windowPosition, windowSize) => {
  const key = buildWallKey(args, windowPosition, windowSize);
  const existing = geometryCache.get(key);
  if (existing) {
    existing.count += 1;
    return existing.geometry;
  }

  const geometry = makeWallGeometry(args, windowPosition, windowSize);
  geometryCache.set(key, { geometry, count: 1 });
  return geometry;
};

const releaseCachedWallGeometry = (args, windowPosition, windowSize) => {
  const key = buildWallKey(args, windowPosition, windowSize);
  const cached = geometryCache.get(key);
  if (!cached) return;

  cached.count -= 1;
  if (cached.count <= 0) {
    cached.geometry.dispose();
    geometryCache.delete(key);
  }
};

const Wall = ({ position, rotation, args, windowPosition, windowSize }) => {
  const texture = useTexture(WALL_TEXTURE_URL);

  const map = useMemo(() => {
    const next = texture.clone();
    next.wrapS = next.wrapT = RepeatWrapping;
    next.repeat.set(1, 1);
    next.needsUpdate = true;
    return next;
  }, [texture]);

  const wallGeometry = useMemo(
    () => getCachedWallGeometry(args, windowPosition, windowSize),
    [args, windowPosition, windowSize],
  );

  useEffect(() => {
    return () => {
      releaseCachedWallGeometry(args, windowPosition, windowSize);
      map.dispose();
    };
  }, [args, windowPosition, windowSize, map]);

  return (
    <mesh rotation={rotation} position={position} castShadow receiveShadow>
      <primitive object={wallGeometry} />
      <meshStandardMaterial
        map={map}
        metalness={0.0}
        roughness={1.0}
        color={0xffffff}
      />
    </mesh>
  );
};

export default Wall;
