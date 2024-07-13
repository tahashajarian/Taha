// PaintingCanvas.js

import React, { useRef, useEffect } from "react";

const PaintingCanvas = () => {
  // const canvasRef = useRef(null);

  // useEffect(() => {
  //   const canvas = canvasRef.current;
  //   const context = canvas.getContext("2d");

  //   let painting = false;

  //   const startPosition = (e) => {
  //     painting = true;
  //     draw(e);
  //   };

  //   const endPosition = () => {
  //     painting = false;
  //     context.beginPath();
  //   };

  //   const draw = (e) => {
  //     if (!painting) return;

  //     context.lineWidth = 5;
  //     context.lineCap = "round";
  //     context.strokeStyle = "black";

  //     const rect = canvas.getBoundingClientRect();
  //     context.lineTo(e.clientX - rect.left, e.clientY - rect.top);
  //     context.stroke();
  //     context.beginPath();
  //     context.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  //   };

  //   canvas.addEventListener("mousedown", startPosition);
  //   canvas.addEventListener("mouseup", endPosition);
  //   canvas.addEventListener("mousemove", draw);

  //   return () => {
  //     canvas.removeEventListener("mousedown", startPosition);
  //     canvas.removeEventListener("mouseup", endPosition);
  //     canvas.removeEventListener("mousemove", draw);
  //   };
  // }, []);

  // const handleSave = () => {
  //   const dataURL = canvasRef.current.toDataURL();
  //   onSave(dataURL);
  // };

  return (
    <div>
      <h1>salam</h1>
      {/* <canvas ref={canvasRef} width={800} height={400} style={{ border: "1px solid black" }} />
      <button onClick={handleSave}>Save</button> */}
    </div>
  );
};

export default PaintingCanvas;
