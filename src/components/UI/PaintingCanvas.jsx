import React, { useRef, useEffect, useState, useMemo } from "react";
import useCanvasEvents from "../../hooks/useCanvasEvents";
import ColorAndBrushSelector from "./ColorAndBrushSelector";
import { usePaintingStore } from "../../stores/usePaintingStore";

const PaintingCanvas = ({ width, height, onSave }) => {
  const containerRef = useRef(null);
  const paintingImage = usePaintingStore((s) => s.paintingImage);
  const canvasRef = usePaintingStore((s) => s.canvasRef);
  const brushType = usePaintingStore((s) => s.brushType);
  const brushColor = usePaintingStore((s) => s.brushColor);
  const brushSize = usePaintingStore((s) => s.brushSize);
  const setBrushType = usePaintingStore((s) => s.setBrushType);
  const setBrushColor = usePaintingStore((s) => s.setBrushColor);
  const setBrushSize = usePaintingStore((s) => s.setBrushSize);
  const [isPainting, setIsPainting] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  useCanvasEvents(
    canvasRef,
    isPainting,
    setIsPainting,
    brushColor,
    brushSize,
    onSave,
    brushType
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !containerRef.current) return;
    
    const context = canvas.getContext("2d");

    const tempImage = new Image();
    tempImage.src = paintingImage;
    tempImage.onload = function () {
      canvas.width = containerRef.current.clientWidth;
      canvas.height = containerRef.current.clientHeight;
      context.drawImage(tempImage, 0, 0, canvas.width, canvas.height);
    };
  }, [paintingImage, canvasRef]);

  const onMouseMoveCanvas = (event) => {
    setCursorPosition({ x: event.clientX, y: event.clientY });
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    onSave(canvas.toDataURL());
  };

  const cursorStyle = useMemo(() => ({
    position: "fixed",
    width: `${brushSize}px`,
    height: `${brushSize}px`,
    borderRadius: "50%",
    backgroundColor: brushColor,
    border:
      brushColor === "white" || brushColor === "#ffffff"
        ? "1px solid black"
        : "1px solid white",
    pointerEvents: "none",
    zIndex: 1000,
    transform: "translate(-50%, -50%)",
    left: `${cursorPosition.x}px`,
    top: `${cursorPosition.y}px`,
  }), [brushSize, brushColor, cursorPosition.x, cursorPosition.y]);

  return (
    <div
      ref={containerRef}
      className="w-full relative"
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      <canvas
        onMouseMove={onMouseMoveCanvas}
        ref={canvasRef}
        style={{
          border: "1px solid black",
          width: "100%",
          height: "100%",
          cursor: "none",
        }}
      />
      <div className="absolute" style={cursorStyle} />
      <ColorAndBrushSelector
        setBrushSize={setBrushSize}
        setCurrentColor={setBrushColor}
        currentColor={brushColor}
        brushSize={brushSize}
        brushType={brushType}
        setBrushType={setBrushType}
        clearCanvas={clearCanvas}
      />
    </div>
  );
};

export default PaintingCanvas;
