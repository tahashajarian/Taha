import React, { useCallback, useEffect, useRef, useState } from "react";
import useCanvasEvents from "../../hooks/useCanvasEvents";
import ColorAndBrushSelector from "./ColorAndBrushSelector";
import { usePaintingStore } from "../../stores/usePaintingStore";

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 900;
const HISTORY_LIMIT = 12;

const PaintingCanvas = ({ width, height, onSave }) => {
  const paintingImage = usePaintingStore((s) => s.paintingImage);
  const paintingLoaded = usePaintingStore((s) => s.paintingLoaded);
  const canvasRef = usePaintingStore((s) => s.canvasRef);
  const brushType = usePaintingStore((s) => s.brushType);
  const brushColor = usePaintingStore((s) => s.brushColor);
  const brushSize = usePaintingStore((s) => s.brushSize);
  const setBrushType = usePaintingStore((s) => s.setBrushType);
  const setBrushColor = usePaintingStore((s) => s.setBrushColor);
  const setBrushSize = usePaintingStore((s) => s.setBrushSize);
  const cursorRef = useRef(null);
  const currentImageRef = useRef("");
  // Strokes are blocked until the saved painting is on the canvas; otherwise
  // the first stroke would save a mostly empty canvas over it.
  const [baseReady, setBaseReady] = useState(false);
  const baseReadyRef = useRef(false);
  const historyRef = useRef({ undo: [], redo: [] });
  const [historyState, setHistoryState] = useState({
    canUndo: false,
    canRedo: false,
  });

  const updateHistoryState = useCallback(() => {
    setHistoryState({
      canUndo: historyRef.current.undo.length > 0,
      canRedo: historyRef.current.redo.length > 0,
    });
  }, []);

  const drawImage = useCallback((imageData, done) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    if (!imageData) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      done?.();
      return;
    }

    // Clear only once the new image is decoded, so the canvas is never blank
    // while it loads.
    const image = new Image();
    image.onerror = () => {
      console.error("Could not decode painting");
      context.clearRect(0, 0, canvas.width, canvas.height);
      done?.();
    };
    image.onload = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      const scale = Math.min(
        canvas.width / image.naturalWidth,
        canvas.height / image.naturalHeight,
      );
      const drawWidth = image.naturalWidth * scale;
      const drawHeight = image.naturalHeight * scale;
      context.drawImage(
        image,
        (canvas.width - drawWidth) / 2,
        (canvas.height - drawHeight) / 2,
        drawWidth,
        drawHeight,
      );
      done?.();
    };
    image.src = imageData;
  }, [canvasRef]);

  const markBaseReady = useCallback(() => {
    baseReadyRef.current = true;
    setBaseReady(true);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !paintingLoaded) return;

    if (paintingImage === currentImageRef.current && currentImageRef.current) {
      return;
    }
    if (canvas.width !== CANVAS_WIDTH || canvas.height !== CANVAS_HEIGHT) {
      canvas.width = CANVAS_WIDTH;
      canvas.height = CANVAS_HEIGHT;
    }
    if (!paintingImage) {
      currentImageRef.current = canvas.toDataURL("image/png");
      markBaseReady();
      return;
    }

    drawImage(paintingImage, () => {
      currentImageRef.current = paintingImage;
      historyRef.current = { undo: [], redo: [] };
      updateHistoryState();
      markBaseReady();
    });
  }, [canvasRef, drawImage, markBaseReady, paintingImage, paintingLoaded, updateHistoryState]);

  const rememberCurrentImage = useCallback(() => {
    const imageData = currentImageRef.current;
    if (!imageData) return;
    const undo = historyRef.current.undo;
    if (undo[undo.length - 1] !== imageData) undo.push(imageData);
    if (undo.length > HISTORY_LIMIT) undo.shift();
    historyRef.current.redo = [];
    updateHistoryState();
  }, [updateHistoryState]);

  const saveImage = useCallback((imageData) => {
    if (!baseReadyRef.current) return;
    currentImageRef.current = imageData;
    onSave(imageData);
  }, [onSave]);

  useCanvasEvents(
    canvasRef,
    brushColor,
    brushSize,
    saveImage,
    brushType,
    rememberCurrentImage,
  );

  const restoreImage = useCallback((direction) => {
    const source = historyRef.current[direction];
    if (!source.length) return;

    const target = direction === "undo" ? "redo" : "undo";
    historyRef.current[target].push(currentImageRef.current);
    const imageData = source.pop();
    drawImage(imageData, () => {
      saveImage(imageData);
      updateHistoryState();
    });
  }, [drawImage, saveImage, updateHistoryState]);

  const moveCursor = (event) => {
    const cursor = cursorRef.current;
    const canvas = canvasRef.current;
    if (!cursor || !canvas || event.pointerType === "touch") return;
    const displaySize = brushSize * (canvas.getBoundingClientRect().width / 600);
    cursor.style.width = `${displaySize}px`;
    cursor.style.height = `${displaySize}px`;
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
    cursor.style.opacity = "1";
  };

  return (
    <div className="w-full">
      <div
        className="relative w-full overflow-hidden rounded-t-lg border border-white/20 bg-black"
        style={{ aspectRatio: `${width} / ${height}` }}
      >
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          onPointerMove={moveCursor}
          onPointerLeave={() => {
            if (cursorRef.current) cursorRef.current.style.opacity = "0";
          }}
          className="block h-full w-full"
          style={{
            cursor: "none",
            touchAction: "none",
            pointerEvents: baseReady ? "auto" : "none",
          }}
        />
        {!baseReady && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-white/70">
            Loading the painting…
          </div>
        )}
        <div
          ref={cursorRef}
          className="pointer-events-none fixed z-[1000] rounded-full border opacity-0"
          style={{
            backgroundColor: brushColor,
            borderColor: brushColor === "#ffffff" ? "black" : "white",
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>
      <ColorAndBrushSelector
        setBrushSize={setBrushSize}
        setCurrentColor={setBrushColor}
        currentColor={brushColor}
        brushSize={brushSize}
        brushType={brushType}
        setBrushType={setBrushType}
        undo={() => restoreImage("undo")}
        redo={() => restoreImage("redo")}
        canUndo={historyState.canUndo}
        canRedo={historyState.canRedo}
      />
    </div>
  );
};

export default PaintingCanvas;
