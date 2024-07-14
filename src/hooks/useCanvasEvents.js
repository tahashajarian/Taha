import { useEffect } from "react";

const useCanvasEvents = (canvasRef, isPainting, setIsPainting, currentColor, brushSize, onSave, brushType) => {
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

            switch (brushType) {
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
                    context.moveTo(clientX, clientY - brushSize / 2);
                    context.lineTo(clientX + brushSize / 2, clientY + brushSize / 2);
                    context.lineTo(clientX - brushSize / 2, clientY + brushSize / 2);
                    context.closePath();
                    context.fillStyle = currentColor;
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
                    context.arc(clientX, clientY, brushSize / 2, 0, Math.PI * 2);
                    context.fillStyle = currentColor;
                    context.fill();
                    context.beginPath();
                    context.moveTo(clientX, clientY);
                    break;

                case "spray":
                    for (let i = 0; i < 10; i++) {
                        const offsetX = (Math.random() - 0.5) * brushSize;
                        const offsetY = (Math.random() - 0.5) * brushSize;
                        context.fillStyle = currentColor;
                        context.fillRect(clientX + offsetX, clientY + offsetY, 1, 1);
                    }
                    context.beginPath();
                    context.moveTo(clientX, clientY);
                    break;

                case "pattern":
                    context.fillStyle = currentColor;
                    for (let i = 0; i < brushSize; i += 5) {
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
                    context.lineWidth = brushSize / 2;
                    context.lineTo(clientX + brushSize / 2, clientY + brushSize / 2);
                    context.stroke();
                    context.lineWidth = brushSize;
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
    }, [canvasRef, isPainting, currentColor, brushSize, onSave, brushType]);
};

export default useCanvasEvents;
