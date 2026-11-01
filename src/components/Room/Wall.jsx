import React, { useEffect, useMemo } from "react";
import { Color, RepeatWrapping, Shape, ShapeGeometry } from "three";
import { useTexture } from "@react-three/drei";
import { wallHeight, wallSize } from "../../constances/constances";

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

// Baked version of the green RectAreaLight strips that used to hang 5cm in
// front of each wall top, facing the wall. They only ever lit the wall itself,
// so their contribution is evaluated here instead of running four LTC area
// lights for every pixel of every material in the scene.
// This is three.js's own RectAreaLight diffuse term (LTC_Evaluate with an
// identity matrix + LTC_ClippedSphereFormFactor, r160), written in a
// wall-aligned frame: x along the wall, y up, z out of the wall. The strip is
// always fully in front of the wall, so the result is view-independent and
// matches the real light exactly. Outgoing = lightColor * albedo * F.
const STRIP_COLOR = new Color("green").multiplyScalar(50);
const STRIP_HALF_WIDTH = (wallSize - 0.05) / 2;
const STRIP_CENTER_Y = wallHeight - 0.01;
const STRIP_HALF_HEIGHT = 0.05;
const STRIP_DISTANCE = 0.05;

const glslFloat = (value) => value.toFixed(5);

const bakeStripLight = (shader) => {
  shader.uniforms.uStripColor = { value: STRIP_COLOR };
  shader.vertexShader = shader.vertexShader
    .replace(
      "#include <common>",
      `#include <common>
      varying vec2 vBakeStripPos;`,
    )
    .replace(
      "#include <begin_vertex>",
      // local x runs along every wall; world y is up even for the flipped front wall
      `#include <begin_vertex>
      vBakeStripPos = vec2(transformed.x, (modelMatrix * vec4(transformed, 1.0)).y);`,
    );
  shader.fragmentShader = shader.fragmentShader
    .replace(
      "#include <common>",
      `#include <common>
      varying vec2 vBakeStripPos;
      uniform vec3 uStripColor;
      vec3 bakeStripEdge(vec3 v1, vec3 v2) {
        float x = dot(v1, v2);
        float y = abs(x);
        float a = 0.8543985 + (0.4965155 + 0.0145206 * y) * y;
        float b = 3.4175940 + (4.1616724 + y) * y;
        float v = a / b;
        float t = (x > 0.0) ? v : 0.5 * inversesqrt(max(1.0 - x * x, 1e-7)) - v;
        return cross(v1, v2) * t;
      }`,
    )
    .replace(
      "#include <emissivemap_fragment>",
      `#include <emissivemap_fragment>
      {
        float stripL = ${glslFloat(-STRIP_HALF_WIDTH)} - vBakeStripPos.x;
        float stripR = ${glslFloat(STRIP_HALF_WIDTH)} - vBakeStripPos.x;
        float stripBottom = ${glslFloat(STRIP_CENTER_Y - STRIP_HALF_HEIGHT)} - vBakeStripPos.y;
        float stripTop = ${glslFloat(STRIP_CENTER_Y + STRIP_HALF_HEIGHT)} - vBakeStripPos.y;
        vec3 c0 = normalize(vec3(stripR, stripBottom, ${glslFloat(STRIP_DISTANCE)}));
        vec3 c1 = normalize(vec3(stripL, stripBottom, ${glslFloat(STRIP_DISTANCE)}));
        vec3 c2 = normalize(vec3(stripL, stripTop, ${glslFloat(STRIP_DISTANCE)}));
        vec3 c3 = normalize(vec3(stripR, stripTop, ${glslFloat(STRIP_DISTANCE)}));
        vec3 stripVec = bakeStripEdge(c0, c1) + bakeStripEdge(c1, c2) + bakeStripEdge(c2, c3) + bakeStripEdge(c3, c0);
        float stripLen = length(stripVec);
        float stripF = max((stripLen * stripLen + abs(stripVec.z)) / (stripLen + 1.0), 0.0);
        totalEmissiveRadiance += diffuseColor.rgb * uStripColor * stripF;
      }`,
    );
};

const bakedStripCacheKey = () => "wall-baked-strip-v2";

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

const Wall = ({ position, rotation, args, windowPosition, windowSize, bakeStrip = false }) => {
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
        {...(bakeStrip && {
          onBeforeCompile: bakeStripLight,
          customProgramCacheKey: bakedStripCacheKey,
        })}
      />
    </mesh>
  );
};

export default Wall;
