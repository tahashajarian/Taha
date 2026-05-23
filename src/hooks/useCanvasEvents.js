import { useEffect, useRef } from "react";

const useCanvasEvents = (
  canvasRef,
  isPainting,
  setIsPainting,
  currentColor,
  brushSize,
  onSave,
  brushType,
) => {
  const isPaintingRef = useRef(isPainting);
  const drawConfigRef = useRef({ currentColor, brushSize, brushType });
  const onSaveRef = useRef(onSave);
  const touchOptions = useRef({ passive: false });

  useEffect(() => {
    isPaintingRef.current = isPainting;
  }, [isPainting]);

  useEffect(() => {
    drawConfigRef.current = { currentColor, brushSize, brushType };
  }, [currentColor, brushSize, brushType]);

  useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const getCoords = (event) => {
      const rect = canvas.getBoundingClientRect();
      if (event.type === "touchmove" || event.type === "touchstart") {
        return {
          clientX: event.touches[0].clientX - rect.left,
          clientY: event.touches[0].clientY - rect.top,
        };
      }
      return {
        clientX: event.clientX - rect.left,
        clientY: event.clientY - rect.top,
      };
    };

    const draw = (event) => {
      if (!isPaintingRef.current) return;

      if (event.cancelable) event.preventDefault();

      const { clientX, clientY } = getCoords(event);
      const { currentColor: color, brushSize: size, brushType: type } =
        drawConfigRef.current;

      context.strokeStyle = color;
      context.lineWidth = size;

      switch (type) {
        case "round":
          context.lineCap = "round";
          context.lineTo(clientX, clientY);
          context.stroke();
          context.beginPath();
          context.moveTo(clientX, clientY);
          break;

        case "square":
          context.lineCap = "butt";
          context.lineTo(clientX, clientY);
          context.stroke();
          context.beginPath();
          context.moveTo(clientX, clientY);
          break;

        case "triangle":
          context.save();
          context.beginPath();
          context.moveTo(clientX, clientY - size / 2);
          context.lineTo(clientX + size / 2, clientY + size / 2);
          context.lineTo(clientX - size / 2, clientY + size / 2);
          context.closePath();
          context.fillStyle = color;
          context.fill();
          context.restore();
          break;

        case "line":
          context.lineCap = "square";
          context.lineTo(clientX, clientY);
          context.stroke();
          context.beginPath();
          context.moveTo(clientX, clientY);
          break;

        case "circle":
          context.beginPath();
          context.arc(clientX, clientY, size / 2, 0, Math.PI * 2);
          context.fillStyle = color;
          context.fill();
          context.beginPath();
          context.moveTo(clientX, clientY);
          break;

        case "spray":
          context.fillStyle = color;
          for (let i = 0; i < 10; i++) {
            const offsetX = (Math.random() - 0.5) * size;
            const offsetY = (Math.random() - 0.5) * size;
            context.fillRect(clientX + offsetX, clientY + offsetY, 1, 1);
          }
          context.beginPath();
          context.moveTo(clientX, clientY);
          break;

        case "pattern":
          context.fillStyle = color;
          for (let i = 0; i < size; i += 5) {
            context.fillRect(clientX + i, clientY + i, 5, 5);
          }
          context.beginPath();
          context.moveTo(clientX, clientY);
          break;

        case "calligraphy":
          context.lineCap = "butt";
          context.lineTo(clientX, clientY);
          context.stroke();
          context.beginPath();
          context.moveTo(clientX, clientY);
          context.lineWidth = size / 2;
          context.lineTo(clientX + size / 2, clientY + size / 2);
          context.stroke();
          context.lineWidth = size;
          break;

        default:
          context.lineCap = "round";
          context.lineTo(clientX, clientY);
          context.stroke();
          context.beginPath();
          context.moveTo(clientX, clientY);
          break;
      }
    };

    const startPosition = (event) => {
      event.preventDefault();
      isPaintingRef.current = true;
      setIsPainting(true);
      draw(event);
    };

    const endPosition = () => {
      if (!isPaintingRef.current) return;
      isPaintingRef.current = false;
      setIsPainting(false);
      onSaveRef.current(canvas.toDataURL());
      context.closePath();
    };

    canvas.addEventListener("mousedown", startPosition);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", endPosition);
    canvas.addEventListener("mouseleave", endPosition);
    canvas.addEventListener("touchstart", startPosition, touchOptions.current);
    canvas.addEventListener("touchmove", draw, touchOptions.current);
    canvas.addEventListener("touchend", endPosition);

    return () => {
      canvas.removeEventListener("mousedown", startPosition);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", endPosition);
      canvas.removeEventListener("mouseleave", endPosition);
      canvas.removeEventListener("touchstart", startPosition, touchOptions.current);
      canvas.removeEventListener("touchmove", draw, touchOptions.current);
      canvas.removeEventListener("touchend", endPosition);
    };
  }, [canvasRef, setIsPainting]);
};

export default useCanvasEvents;
