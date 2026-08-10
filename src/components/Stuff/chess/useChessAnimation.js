import { useEffect, useRef, useState } from "react";
import { useSpring } from "@react-spring/three";
import { useAppStatusStore } from "../../../stores/useAppStatusStore";
import * as THREE from "three";

/* ---------------- helpers ---------------- */

const easeInQuartic = (value) => value * value * value * value;

const FEEDBACK_MAP = {
  queen1: { path: "/textures/moves/brilliant.png", duration: 1700 },
};

/* ---------------- hook ---------------- */

export function useChessController({ nodes, moveDuration, kingPivotPosition }) {
  const chessPlay = useAppStatusStore((s) => s.chessPlay);
  const setChessPlayEnd = useAppStatusStore((s) => s.setChessPlayEnd);
  const resetChess = useAppStatusStore((s) => s.resetChess);
  const setResetChess = useAppStatusStore((s) => s.setResetChess);

  const timeoutsRef = useRef([]);
  const texturesRef = useRef({});

  const [feedbacks, setFeedbacks] = useState([]);

  /* -------- springs -------- */

  const [queenSpring, queenApi] = useSpring(() => ({
    position: nodes?.queen?.position.toArray() ?? [0, 0, 0],
    rotation: nodes?.queen?.rotation.toArray().slice(0, 3) ?? [0, 0, 0],
    scale: nodes?.queen?.scale.toArray() ?? [1, 1, 1],
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

  const [kingBSpring, kingBApi] = useSpring(() => ({
    position: kingPivotPosition ?? [0, 0, 0],
    rotation: nodes?.Rey_Circle001?.rotation.toArray().slice(0, 3) ?? [0, 0, 0],
    immediate: true,
  }));

  /* -------- load textures -------- */

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    Object.entries(FEEDBACK_MAP).forEach(([key, { path }]) => {
      loader.load(path, (tex) => {
        texturesRef.current[key] = tex;
      });
    });
  }, []);

  /* -------- feedback -------- */

  const pushFeedback = (position, texture, durationMs) => {
    if (!texture) return;
    const id = `${Date.now()}_${Math.random().toString(36).slice(2)}`;
    setFeedbacks((s) => [...s, { id, position, texture, durationMs }]);
    const t = setTimeout(() => {
      setFeedbacks((s) => s.filter((f) => f.id !== id));
    }, durationMs + 200);
    timeoutsRef.current.push(t);
  };

  /* -------- main sequence -------- */

  useEffect(() => {
    if (!nodes) return;

    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    if (!chessPlay) {
      const cfg = { duration: 600 };
      queenApi.start({
        rotation: nodes.queen.rotation.toArray().slice(0, 3),
        immediate: true,
      });
      queenApi.start({
        position: nodes.queen.position.toArray(),
        scale: nodes.queen.scale.toArray(),
        config: cfg,
      });
      pawnApi.start({ position: nodes.pawn.position.toArray(), config: cfg });
      queenBApi.start({
        position: nodes.queenB.position.toArray(),
        config: cfg,
      });
      knightApi.start({
        position: nodes.knight.position.toArray(),
        config: cfg,
      });
      setFeedbacks([]);
      return;
    }

    const MOVE = Math.max(1, Math.round(moveDuration));
    const GAP = 1000;
    const OVERLAP_QUEEN2 = Math.max(0, Math.min(800, MOVE - 50));
    const SAC_DURATION = MOVE + 400;
    const QUEEN_IMPACT_AT = SAC_DURATION * 0.9;
    const cfg = { duration: MOVE };
    const queenStart = nodes.queen.position.toArray();
    const queenTarget = [0, 0, -0.37];
    const queenRotation = nodes.queen.rotation.toArray().slice(0, 3);
    const queenScale = nodes.queen.scale.toArray();

    const sequence = [
      {
        key: "queen1",
        fn: () => queenApi.start({
          to: async (next) => {
            await next({
              position: [queenStart[0], queenStart[1] + 0.004, queenStart[2]],
              rotation: [queenRotation[0], queenRotation[1], queenRotation[2] - 0.018],
              scale: queenScale.map((value) => value * 0.985),
              config: { duration: SAC_DURATION * 0.09 },
            });
            await next({
              position: queenStart,
              rotation: [queenRotation[0], queenRotation[1], queenRotation[2] + 0.018],
              scale: queenScale.map((value) => value * 1.015),
              config: { duration: SAC_DURATION * 0.09 },
            });
            await next({
              position: queenStart,
              rotation: queenRotation,
              config: { duration: SAC_DURATION * 0.09 },
            });
            await next({
              position: queenTarget,
              rotation: queenRotation,
              scale: queenScale,
              config: { duration: SAC_DURATION * 0.63, easing: easeInQuartic },
            });
          },
        }),
        feedback: {
          position: [0.23, 0.05, -0.27],
          delay: QUEEN_IMPACT_AT - MOVE + 40,
        },
      },
      {
        fn: () => pawnApi.start({ position: [0.12, 0, -0.2], config: cfg }),
        at: QUEEN_IMPACT_AT,
      },
      {
        key: "queenB",
        fn: () => queenBApi.start({ position: [0.1, 0, -0.1], config: cfg }),
        // feedback: { position: [0.23, 0.05, -0.27], delay: 150 },
      },
      {
        fn: () => queenApi.start({ position: [0.1, 0, -0.4], config: cfg }),
        overlap: OVERLAP_QUEEN2,
      },
      {
        key: "knight",
        fn: () => {
          knightApi.start({ position: [-0.1, 0, -0.2], config: cfg });
          setChessPlayEnd(true);
        },
        // feedback: { position: [0.03, 0.05, -0.27], delay: 150 },
      },
    ];

    let prevStart = 0;
    sequence.forEach((step, i) => {
      const startAt =
        Number.isFinite(step.at)
          ? step.at
          : i === 0
          ? 0
          : step.overlap
            ? prevStart + MOVE - step.overlap
            : prevStart + MOVE + GAP;

      timeoutsRef.current.push(setTimeout(step.fn, startAt));

      if (step.feedback && step.key) {
        const tex = texturesRef.current[step.key];
        timeoutsRef.current.push(
          setTimeout(
            () =>
              pushFeedback(
                step.feedback.position,
                tex,
                FEEDBACK_MAP[step.key].duration,
              ),
            startAt + MOVE + step.feedback.delay,
          ),
        );
      }

      prevStart = startAt;
    });

    const end = prevStart + MOVE;
    timeoutsRef.current.push(
      setTimeout(() => {
        const kingRotation = nodes.Rey_Circle001.rotation.toArray().slice(0, 3);
        kingBApi.start({
          to: async (next) => {
            await next({
              rotation: [kingRotation[0], kingRotation[1], kingRotation[2] - 0.28],
              config: { duration: 180 },
            });
            await next({
              rotation: [
                kingRotation[0],
                kingRotation[1],
                kingRotation[2] - Math.PI / 2 - 0.1,
              ],
              config: { tension: 240, friction: 18 },
            });
          },
        });
      }, end + 1000),
    );

    return () => timeoutsRef.current.forEach(clearTimeout);
  }, [chessPlay, nodes, moveDuration, kingPivotPosition]);

  /* -------- reset -------- */

  useEffect(() => {
    if (!nodes || !resetChess) return;
    const cfg = { tension: 220, friction: 22 };
    queenApi.start({
      rotation: nodes.queen.rotation.toArray().slice(0, 3),
      immediate: true,
    });
    queenApi.start({
      position: nodes.queen.position.toArray(),
      scale: nodes.queen.scale.toArray(),
      config: cfg,
    });
    pawnApi.start({ position: nodes.pawn.position.toArray(), config: cfg });
    queenBApi.start({ position: nodes.queenB.position.toArray(), config: cfg });
    knightApi.start({ position: nodes.knight.position.toArray(), config: cfg });

    kingBApi.start({
      position: kingPivotPosition,
      rotation: nodes.Rey_Circle001.rotation.toArray().slice(0, 3),
      config: cfg,
    });

    setFeedbacks([]);
    setResetChess(false);
  }, [resetChess, nodes, kingPivotPosition]);

  return {
    queenSpring,
    pawnSpring,
    queenBSpring,
    knightSpring,
    kingBSpring,
    feedbacks,
  };
}
