import { useEffect, useRef, useState } from "react";
import { useSpring } from "@react-spring/three";
import { useAppStatusStore } from "../../../stores/useAppStatusStore";

/* ---------------- helpers ---------------- */

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

const FEEDBACK_MAP = {
  queen1: { texture: "/textures/moves/brilliant.png", duration: 1500 },
  queenB: { texture: "/textures/moves/forced.png", duration: 1500 },
  knight: { texture: "/textures/moves/best.png", duration: 1500 },
};

/* ---------------- hook ---------------- */

export function useChessController({ nodes, moveDuration, kingBRef }) {
  const {
    chessPlay,
    setChessPlayEnd,
    resetChess,
    setResetChess,
  } = useAppStatusStore();

  const timeoutsRef = useRef([]);
  const kingBInitial = useRef(null);

  const [feedbacks, setFeedbacks] = useState([]);

  /* -------- springs -------- */

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

  /* -------- save initial king state -------- */

  useEffect(() => {
    if (!kingBRef.current || kingBInitial.current) return;

    kingBInitial.current = {
      position: kingBRef.current.position.clone(),
      rotation: kingBRef.current.rotation.clone(),
    };
  }, [kingBRef]);

  /* -------- feedback -------- */

  const pushFeedback = (position, texturePath, durationMs) => {
    const id = `${Date.now()}_${Math.random().toString(36).slice(2)}`;

    setFeedbacks((s) => [...s, { id, position, texturePath, durationMs }]);

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

      queenApi.start({ position: nodes.queen.position.toArray(), config: cfg });
      pawnApi.start({ position: nodes.pawn.position.toArray(), config: cfg });
      queenBApi.start({ position: nodes.queenB.position.toArray(), config: cfg });
      knightApi.start({ position: nodes.knight.position.toArray(), config: cfg });

      setFeedbacks([]);
      return;
    }

    const MOVE = Math.max(1, Math.round(moveDuration));
    const GAP = 1000;

    const OVERLAP_PAWN = clamp(450, 0, MOVE - 50);
    const OVERLAP_QUEEN2 = clamp(800, 0, MOVE - 50);

    const cfg = { duration: MOVE };

    const sequence = [
      {
        key: "queen1",
        fn: () =>
          queenApi.start({ position: [0, 0, -0.37], config: cfg }),
        feedback: { position: [0.23, 0.05, -0.27], delay: 150 },
      },
      {
        fn: () =>
          pawnApi.start({ position: [0.12, 0, -0.2], config: cfg }),
        overlap: OVERLAP_PAWN,
      },
      {
        key: "queenB",
        fn: () =>
          queenBApi.start({ position: [0.1, 0, -0.1], config: cfg }),
        feedback: { position: [0.23, 0.05, -0.27], delay: 150 },
      },
      {
        fn: () =>
          queenApi.start({ position: [0.1, 0, -0.4], config: cfg }),
        overlap: OVERLAP_QUEEN2,
      },
      {
        key: "knight",
        fn: () => {
          knightApi.start({ position: [-0.1, 0, -0.2], config: cfg });
          setChessPlayEnd(true);
        },
        feedback: { position: [0.03, 0.05, -0.27], delay: 150 },
      },
    ];

    let prevStart = 0;

    sequence.forEach((step, i) => {
      const startAt =
        i === 0
          ? 0
          : step.overlap
          ? prevStart + MOVE - step.overlap
          : prevStart + MOVE + GAP;

      timeoutsRef.current.push(setTimeout(step.fn, startAt));

      if (step.feedback) {
        const fb = FEEDBACK_MAP[step.key];
        timeoutsRef.current.push(
          setTimeout(() => {
            pushFeedback(step.feedback.position, fb.texture, fb.duration);
          }, startAt + MOVE + step.feedback.delay)
        );
      }

      prevStart = startAt;
    });

    const end = prevStart + MOVE;

    timeoutsRef.current.push(
      setTimeout(() => {
        if (kingBRef.current) {
          kingBRef.current.rotation.z = -Math.PI / 2 - 0.1;
          kingBRef.current.position.set(0.2, 0.3, 0);
        }
      }, end + 1000)
    );

    return () => timeoutsRef.current.forEach(clearTimeout);
  }, [chessPlay, nodes, moveDuration]);

  /* -------- reset -------- */

  useEffect(() => {
    if (!nodes || !resetChess) return;

    const cfg = { tension: 220, friction: 22 };

    queenApi.start({ position: nodes.queen.position.toArray(), config: cfg });
    pawnApi.start({ position: nodes.pawn.position.toArray(), config: cfg });
    queenBApi.start({ position: nodes.queenB.position.toArray(), config: cfg });
    knightApi.start({ position: nodes.knight.position.toArray(), config: cfg });

    if (kingBRef.current && kingBInitial.current) {
      kingBRef.current.position.copy(kingBInitial.current.position);
      kingBRef.current.rotation.copy(kingBInitial.current.rotation);
    }

    setFeedbacks([]);
    setResetChess(false);
  }, [resetChess, nodes]);

  return {
    queenSpring,
    pawnSpring,
    queenBSpring,
    knightSpring,
    feedbacks,
  };
}