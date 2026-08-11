import { useEffect, useRef } from "react";

const BASE_BRUSH_WIDTH = 600;

const useCanvasEvents = (
  canvasRef,
  currentColor,
  brushSize,
  onSave,
  brushType,
  onStrokeStart,
) => {
  const isPaintingRef = useRef(false);
  const drawConfigRef = useRef({ currentColor, brushSize, brushType });
  const callbacksRef = useRef({ onSave, onStrokeStart });
  const coordsRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    drawConfigRef.current = { currentColor, brushSize, brushType };
  }, [currentColor, brushSize, brushType]);

  useEffect(() => {
    callbacksRef.current = { onSave, onStrokeStart };
  }, [onSave, onStrokeStart]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const getCoords = (event) => {
      const rect = canvas.getBoundingClientRect();
      coordsRef.current.x =
        (event.clientX - rect.left) * (canvas.width / rect.width);
      coordsRef.current.y =
        (event.clientY - rect.top) * (canvas.height / rect.height);
      return coordsRef.current;
    };

    const draw = (event) => {
      if (!isPaintingRef.current) return;
      if (event.cancelable) event.preventDefault();

      const { x, y } = getCoords(event);
      const { currentColor: color, brushSize: size, brushType: type } =
        drawConfigRef.current;
      const logicalSize = size * (canvas.width / BASE_BRUSH_WIDTH);

      context.strokeStyle = color;
      context.fillStyle = color;
      context.lineWidth = logicalSize;

      switch (type) {
        case "triangle":
          context.beginPath();
          context.moveTo(x, y - logicalSize / 2);
          context.lineTo(x + logicalSize / 2, y + logicalSize / 2);
          context.lineTo(x - logicalSize / 2, y + logicalSize / 2);
          context.closePath();
          context.fill();
          break;

        case "circle":
          context.beginPath();
          context.arc(x, y, logicalSize / 2, 0, Math.PI * 2);
          context.fill();
          context.beginPath();
          context.moveTo(x, y);
          break;

        case "spray":
          for (let index = 0; index < 10; index += 1) {
            const offsetX = (Math.random() - 0.5) * logicalSize;
            const offsetY = (Math.random() - 0.5) * logicalSize;
            context.fillRect(x + offsetX, y + offsetY, 2, 2);
          }
          context.beginPath();
          context.moveTo(x, y);
          break;

        case "pattern":
          for (let offset = 0; offset < logicalSize; offset += 10) {
            context.fillRect(x + offset, y + offset, 8, 8);
          }
          context.beginPath();
          context.moveTo(x, y);
          break;

        case "calligraphy":
          context.lineCap = "butt";
          context.lineTo(x, y);
          context.stroke();
          context.beginPath();
          context.moveTo(x, y);
          context.lineWidth = logicalSize / 2;
          context.lineTo(x + logicalSize / 2, y + logicalSize / 2);
          context.stroke();
          context.beginPath();
          context.moveTo(x, y);
          break;

        default:
          context.lineCap = type === "square" || type === "line" ? "butt" : "round";
          context.lineJoin = "round";
          context.lineTo(x, y);
          context.stroke();
          context.beginPath();
          context.moveTo(x, y);
          break;
      }
    };

    const startPosition = (event) => {
      if (event.button !== undefined && event.button !== 0) return;
      event.preventDefault();
      canvas.setPointerCapture?.(event.pointerId);
      callbacksRef.current.onStrokeStart?.();
      isPaintingRef.current = true;
      const { x, y } = getCoords(event);
      context.beginPath();
      context.moveTo(x, y);
      draw(event);
    };

    const endPosition = (event) => {
      if (!isPaintingRef.current) return;
      isPaintingRef.current = false;
      context.closePath();
      if (canvas.hasPointerCapture?.(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId);
      }
      callbacksRef.current.onSave?.(canvas.toDataURL("image/png"));
    };

    canvas.addEventListener("pointerdown", startPosition);
    canvas.addEventListener("pointermove", draw);
    canvas.addEventListener("pointerup", endPosition);
    canvas.addEventListener("pointercancel", endPosition);

    return () => {
      canvas.removeEventListener("pointerdown", startPosition);
      canvas.removeEventListener("pointermove", draw);
      canvas.removeEventListener("pointerup", endPosition);
      canvas.removeEventListener("pointercancel", endPosition);
    };
  }, [canvasRef]);
};

export default useCanvasEvents;
