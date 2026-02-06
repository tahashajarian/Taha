import React, { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { a, useSpring } from "@react-spring/three";
import { useAppStatusStore } from "../../stores/useAppStatusStore";

export function Chess({ moveDuration = 600, ...props }) {
  // <- faster by default
  const { nodes, materials } = useGLTF("/models/chess.glb");
  const { chessPlay, setChessPlayEnd, resetChess, setResetChess } =
    useAppStatusStore();

  const queenRef = useRef();
  const pawnRef = useRef();
  const queenBRef = useRef();
  const knightRef = useRef();
  const timeoutsRef = useRef([]);

  const [queenSpring, queenApi] = useSpring(() => ({
    position: nodes?.queen?.position.toArray() ?? [0, 0, 0],
    immediate: true,
  }));
  const [pawnSpring, pawnApi] = useSpring(() => ({
    position: nodes?.pawn?.position.toArray() ?? [0, 0, 0],
    immediate: true,
  }));
  const [queenBSpring, queenBApi] = useSpring(() => ({
    position: nodes?.queenB?.position.toArray() ?? [0, 0, 0],
    immediate: true,
  }));
  const [knightSpring, knightApi] = useSpring(() => ({
    position: nodes?.knight?.position.toArray() ?? [0, 0, 0],
    immediate: true,
  }));

  // helper clamp
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  useEffect(() => {
    if (!nodes) return;

    // cleanup previous timeouts
    timeoutsRef.current.forEach((t) => clearTimeout(t));
    timeoutsRef.current = [];

    // reset to original if chessPlay is false
    if (!chessPlay) {
      const cfg = { duration: 600 };
      queenApi.start({
        position: nodes.queen.position.toArray(),
        config: cfg,
        immediate: false,
      });
      pawnApi.start({
        position: nodes.pawn.position.toArray(),
        config: cfg,
        immediate: false,
      });
      queenBApi.start({
        position: nodes.queenB.position.toArray(),
        config: cfg,
        immediate: false,
      });
      knightApi.start({
        position: nodes.knight.position.toArray(),
        config: cfg,
        immediate: false,
      });
      return () => timeoutsRef.current.forEach((t) => clearTimeout(t));
    }

    const MOVE_DURATION = Math.max(1, Math.round(moveDuration));
    const DEFAULT_GAP = 1000;

    // Absolute overlaps (clamped so never longer than move duration)
    const OVERLAP_FOR_PAWN = clamp(450, 0, MOVE_DURATION - 50);
    const OVERLAP_FOR_QUEEN2 = clamp(800, 0, MOVE_DURATION - 50);

    const cfg = { duration: MOVE_DURATION };

    const sequence = [
      {
        key: "queen1",
        fn: () =>
          queenApi.start({
            position: [0, 0, -0.37],
            config: cfg,
            immediate: false,
          }),
        overlapAmount: 0,
      },
      {
        key: "pawn",
        fn: () =>
          pawnApi.start({
            position: [0.12, 0, -0.1],
            config: cfg,
            immediate: false,
          }),
        overlapAmount: OVERLAP_FOR_PAWN,
      },
      {
        key: "queenB",
        fn: () =>
          queenBApi.start({
            position: [0.1, 0, -0.1],
            config: cfg,
            immediate: false,
          }),
        overlapAmount: 0,
      },
      {
        key: "queen2",
        fn: () =>
          queenApi.start({
            position: [0.1, 0, -0.4],
            config: cfg,
            immediate: false,
          }),
        overlapAmount: OVERLAP_FOR_QUEEN2,
      },
      {
        key: "knight",
        fn: () => {
          knightApi.start({
            position: [-0.1, 0, -0.2],
            config: cfg,
            immediate: false,
          });
          setChessPlayEnd(true);
        },
        overlapAmount: 0,
      },
    ];

    let prevStart = 0;
    for (let i = 0; i < sequence.length; i++) {
      const step = sequence[i];
      let startAt;
      if (i === 0) {
        startAt = 0;
      } else {
        const prevFinish = prevStart + MOVE_DURATION;
        startAt = step.overlapAmount
          ? prevFinish - step.overlapAmount
          : prevFinish + DEFAULT_GAP;
        if (startAt < 0) startAt = 0;
      }

      timeoutsRef.current.push(
        setTimeout(() => step.fn(), Math.round(startAt)),
      );
      prevStart = startAt;
    }

    return () => timeoutsRef.current.forEach((t) => clearTimeout(t));
  }, [chessPlay, nodes, moveDuration]);

  useEffect(() => {
    if (!nodes || !resetChess) return;

    const cfg = { tension: 220, friction: 22 };
    queenApi.start({ position: nodes.queen.position.toArray(), config: cfg });
    pawnApi.start({ position: nodes.pawn.position.toArray(), config: cfg });
    queenBApi.start({ position: nodes.queenB.position.toArray(), config: cfg });
    knightApi.start({ position: nodes.knight.position.toArray(), config: cfg });

    setResetChess(false);
  }, [resetChess, nodes]);

  return (
    <group
      {...props}
      scale={1.5}
      position={[-0.3, 1.12, 0]}
      rotation={[0, Math.PI, 0]}
      dispose={null}
    >
      <a.mesh
        ref={queenRef}
        geometry={nodes?.queen?.geometry}
        material={materials?.WHITE}
        position={queenSpring.position}
        castShadow
        receiveShadow
      />
      <a.mesh
        ref={knightRef}
        geometry={nodes?.knight?.geometry}
        material={materials?.WHITE}
        position={knightSpring.position}
        castShadow
        receiveShadow
      />

      {[
        "Alfil_Circle011",
        "Peon_Circle005",
        "Rey_Circle007",
        "Torre_Circle010",
        "Caballo_Circle001",
        "Alfil_Circle001",
        "Torre_Circle001",
        "Peon_Circle001",
        "Peon_Circle002",
        "Peon_Circle003",
        "Peon_Circle004",
        "Peon_Circle006",
        "Peon_Circle007",
        "Peon_Circle008",
      ].map((name) => (
        <mesh
          key={name}
          geometry={nodes?.[name]?.geometry}
          material={materials?.WHITE}
          position={nodes?.[name]?.position}
          castShadow
          receiveShadow
        />
      ))}

      <a.mesh
        ref={pawnRef}
        geometry={nodes?.pawn?.geometry}
        material={materials?.BLACK}
        position={pawnSpring.position}
        castShadow
        receiveShadow
      />
      <a.mesh
        ref={queenBRef}
        geometry={nodes?.queenB?.geometry}
        material={materials?.BLACK}
        position={queenBSpring.position}
        castShadow
        receiveShadow
      />

      {[
        "Alfil_Circle002",
        "Caballo_Circle002",
        "Rey_Circle001",
        "Torre_Circle002",
        "Caballo_Circle003",
        "Alfil_Circle003",
        "Torre_Circle003",
        "Peon_Circle010",
        "Peon_Circle011",
        "Peon_Circle012",
        "Peon_Circle013",
        "Peon_Circle014",
        "Peon_Circle015",
        "Peon_Circle016",
      ].map((name) => (
        <mesh
          key={name}
          geometry={nodes?.[name]?.geometry}
          material={materials?.BLACK}
          position={nodes?.[name]?.position}
          castShadow
          receiveShadow
        />
      ))}

      {[
        ["Cube002", "Material.007"],
        ["Cube002_1", "Material.009"],
        ["Cube002_2", "Material.019"],
      ].map(([name, mat]) => (
        <mesh
          key={name}
          geometry={nodes?.[name]?.geometry}
          material={materials?.[mat]}
          position={nodes?.[name]?.position}
          castShadow
          receiveShadow
        />
      ))}
    </group>
  );
}

useGLTF.preload("/models/chess.glb", "/draco/");
