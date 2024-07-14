// useCanvasEvents.js
import { useEffect } from "react";

const useCanvasEvents = (canvasRef, isPainting, setIsPainting, currentColor, brushSize, onSave) => {
    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        const startPosition = (event) => {
            event.preventDefault();
            setIsPainting(true);
            draw(event);
        };

        const draw = (event) => {
            if (!isPainting) return;

            let clientX, clientY;
            if (event.type === "touchmove" || event.type === "touchstart") {
                clientX = event.touches[0].clientX - canvas.getBoundingClientRect().left;
                clientY = event.touches[0].clientY - canvas.getBoundingClientRect().top;
            } else {
                clientX = event.clientX - canvas.getBoundingClientRect().left;
                clientY = event.clientY - canvas.getBoundingClientRect().top;
            }

            context.strokeStyle = currentColor;
            context.lineWidth = brushSize;
            context.lineCap = "round";

            context.lineTo(clientX, clientY);
            context.stroke();

            context.beginPath();
            context.moveTo(clientX, clientY);
        };

        const endPosition = () => {
            setIsPainting(false);
            onSave(canvas.toDataURL());
            context.closePath();
        };

        canvas.addEventListener("mousedown", startPosition);
        canvas.addEventListener("mousemove", draw);
        canvas.addEventListener("mouseup", endPosition);
        canvas.addEventListener("mouseleave", endPosition);
        canvas.addEventListener("touchstart", startPosition);
        canvas.addEventListener("touchmove", draw);
        canvas.addEventListener("touchend", endPosition);

        return () => {
            canvas.removeEventListener("mousedown", startPosition);
            canvas.removeEventListener("mousemove", draw);
            canvas.removeEventListener("mouseup", endPosition);
            canvas.removeEventListener("mouseleave", endPosition);
            canvas.removeEventListener("touchstart", startPosition);
            canvas.removeEventListener("touchmove", draw);
            canvas.removeEventListener("touchend", endPosition);
        };
    }, [canvasRef, isPainting, currentColor, brushSize, onSave]);
};

export default useCanvasEvents;
