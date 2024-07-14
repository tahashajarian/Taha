import React, { useRef, useEffect } from "react";

const PaintingCanvas = ({ width, height }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    let painting = false;

    const startPosition = (e) => {
      painting = true;
      draw(e);
    };

    const endPosition = () => {
      painting = false;
      context.beginPath();
    };

    const draw = (e) => {
      if (!painting) return;

      const rect = canvas.getBoundingClientRect();
      context.lineWidth = 5;
      context.lineCap = "round";
      context.strokeStyle = "black";

      context.lineTo(e.clientX - rect.left, e.clientY - rect.top);
      context.stroke();
      context.beginPath();
      context.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    };

    const resizeCanvas = () => {
      const container = containerRef.current;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      }
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    canvas.addEventListener("mousedown", startPosition);
    canvas.addEventListener("mouseup", endPosition);
    canvas.addEventListener("mousemove", draw);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener("mousedown", startPosition);
      canvas.removeEventListener("mouseup", endPosition);
      canvas.removeEventListener("mousemove", draw);
    };
  }, []);

  const handleSave = () => {
    const dataURL = canvasRef.current.toDataURL();
    console.log(dataURL);
  };

  return (
    <div ref={containerRef} className="w-full" style={{ aspectRatio: `${width} / ${height}` }}>
      <canvas
        ref={canvasRef}
        style={{ border: "1px solid black", width: '100%', height: '100%' }}
      />
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default PaintingCanvas;
