import { useState } from "react";
import CanvasField from "../../../widgets/CanvasField/CanvasField";
import Sidebar from "../../../widgets/Sidebar/ui/Sidebar";
import * as fabric from "fabric";
import "./Main.scss";
const Main = () => {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  return (
    <div className="container">
      <Sidebar canvas={canvas} />
      <CanvasField canvas={canvas} setCanvas={setCanvas} />
    </div>
  );
};

export default Main;
