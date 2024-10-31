import React, { useRef, useEffect, useState } from "react";
import * as fabric from "fabric";
import Header from "../Header/Header";
import "./CanvasField.scss";
interface CanvasFieldProps {
  canvas: fabric.Canvas | null;
  setCanvas: React.Dispatch<React.SetStateAction<fabric.Canvas | null>>;
}
const SIDEBAR_WIDTH = 320;
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

  const [canvasSizes, setCanvasSizes] = useState({
    width: window.innerWidth - 320,
    height: window.innerHeight,
  });

  useEffect(() => {
    // todo fix - resize doesn't change canvas size correctly
    const handleResize = () => {
      setCanvasSizes({
        width: window.innerWidth - SIDEBAR_WIDTH,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="canvas_field_container">
      <Header canvas={canvas} />

      <canvas
        ref={canvasRef}
        className="canvas"
        width={canvasSizes.width}
        height={canvasSizes.height}
      />
    </div>
  );
};

export default CanvasField;
