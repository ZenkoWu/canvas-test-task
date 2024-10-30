import React, { useRef, useEffect } from "react";
import * as fabric from "fabric";
import Header from "../Header/Header";
import "./CanvasField.scss";
interface CanvasFieldProps {
  canvas: fabric.Canvas | null;
  setCanvas: React.Dispatch<React.SetStateAction<fabric.Canvas | null>>;
}
const CanvasField: React.FC<CanvasFieldProps> = ({ canvas, setCanvas }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      // Удаляем предыдущий канвас, если он есть
      if (canvas) {
        canvas.dispose();
      }

      const newCanvas = new fabric.Canvas(canvasRef.current);
      setCanvas(newCanvas);

      return () => {
        newCanvas?.dispose();
      };
    }
  }, []); // Запускается только один раз после рендеринга

  useEffect(() => {
    if (canvas) {
      canvas.on("mouse:wheel", function (opt: any) {
        var delta = opt.e.deltaY;
        var zoom = canvas.getZoom();
        zoom *= 0.999 ** delta;
        if (zoom > 20) zoom = 20;
        if (zoom < 0.01) zoom = 0.01;
        // @ts-ignore
        canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
        opt.e.preventDefault();
        opt.e.stopPropagation();
      });
    }
  }, [canvas]);

  return (
    <div className="canvas_field_container">
      <Header canvas={canvas} />

      <canvas ref={canvasRef} className="canvas" width={1408} height={940} />
    </div>
  );
};

export default CanvasField;
