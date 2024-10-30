import { useEffect, useState } from "react";
import "./Header.scss";
import * as fabric from "fabric";
import { createPortal } from "react-dom";
import { ModalOverlay } from "../../shared/ui/ModalOverlay/ModalOverlay";
import Button from "../../shared/ui/Button/Button";
import { BtnSize, BtnType } from "../../shared/ui/Button/types";
import ArrowNarrowLeft from "../../shared/assets/icons/arrow-narrow-left";
import ArrowNarrowRight from "../../shared/assets/icons/arrow-narrow-right";
interface Action {
  type: "object:added" | "object:moved" | "object:scaled" | "object:rotated";
  object: fabric.Object;
  originalLeft?: number;
  originalTop?: number;
  originalScaleX?: number;
  originalScaleY?: number;
  originalAngle?: number;
}
interface HeaderProps {
  canvas: fabric.Canvas | null;
}
const Header: React.FC<HeaderProps> = ({ canvas }) => {
  const [svg, setSvg] = useState<string>("");
  const [history, setHistory] = useState<Action[]>([]);
  const [redoHistory, setRedoHistory] = useState<Action[]>([]);

  let isObjectMoving = false;
  let isObjectScaling = false;
  let isObjectRotating = false;
  const BUTTONS_GROUP = [
    {
      id: 1,
      title: <ArrowNarrowLeft />,
      onClick: undo,
      disabled: !history.length,
    },
    {
      id: 2,
      title: <ArrowNarrowRight />,
      onClick: redo,
      disabled: !redoHistory.length,
    },
  ];
  const onSave = () => {
    if (canvas) {
      const svgData = canvas.toSVG();
      setSvg(svgData);
    }
  }; // Функция для добавления действия в историю
  function addActionToHistory(action: Action) {
    setHistory((p) => [...p, action]);
  }
  useEffect(() => {
    if (canvas) {
      canvas?.on("object:added", (e) => {
        addActionToHistory({ type: "object:added", object: e.target });
      }); // Обработчик начала перемещения объекта

      canvas?.on("object:moving", (e: any) => {
        isObjectMoving = true;
        e.target.originalLeft = e.target.left;
        e.target.originalTop = e.target.top;
      });
      canvas?.on("mouse:up", function (e: any) {
        if (isObjectMoving) {
          isObjectMoving = false;
          addActionToHistory({
            type: "object:moved",
            object: e.target,
            originalLeft: e.target.originalLeft || e.target.left,
            originalTop: e.target.originalTop || e.target.top,
          });
        }
        if (isObjectScaling) {
          isObjectScaling = false;
          addActionToHistory({
            type: "object:scaled",
            object: e.target,
            originalScaleX: e.target.originalScaleX || e.target.scaleX,
            originalScaleY: e.target.originalScaleY || e.target.scaleY,
          });
        }
        if (isObjectRotating) {
          isObjectRotating = false;
          addActionToHistory({
            type: "object:rotated",
            object: e.target,
            originalAngle: e.target.originalAngle || e.target.angle,
          });
        }
      }); // Обработчик начала изменения размера объекта
      canvas?.on("object:scaling", (e: any) => {
        isObjectScaling = true;
        e.target.originalScaleX = e.target.scaleX;
        e.target.originalScaleY = e.target.scaleY;
      }); // Обработчик начала поворота объекта
      canvas?.on("object:rotating", (e: any) => {
        isObjectRotating = true;
        e.target.originalAngle = e.target.originalAngle || e.target.angle;
      });
    }
  }, [canvas]);

  function undo() {
    if (history.length === 0) {
      return;
    }
    const lastAction = history[history.length - 1];
    setHistory((p) => p.slice(0, p.length - 1));
    if (
      JSON.stringify(lastAction) !==
      JSON.stringify(redoHistory[redoHistory.length - 1])
    ) {
      setRedoHistory((p) => [...p, lastAction]);
    }
    switch (lastAction.type) {
      case "object:added":
        canvas?.remove(lastAction.object);
        break;
      case "object:moved":
        lastAction.object.set({
          left: lastAction.originalLeft,
          top: lastAction.originalTop,
        });
        canvas?.renderAll();
        break;
      case "object:scaled":
        lastAction.object.set({
          scaleX: lastAction.originalScaleX,
          scaleY: lastAction.originalScaleY,
        });
        canvas?.renderAll();
        break;
      case "object:rotated":
        lastAction.object.set({ angle: -(lastAction.originalAngle || 0) });
        canvas?.renderAll();
        break;
    }
  }

  function redo() {
    if (redoHistory.length === 0) {
      return;
    }
    const lastAction = redoHistory[redoHistory.length - 1];
    setRedoHistory((p) => p.slice(0, p.length - 1));
    if (
      JSON.stringify(lastAction) !== JSON.stringify(history[history.length - 1])
    ) {
      setHistory((p) => [...p, lastAction]);
    }

    switch (lastAction.type) {
      case "object:added":
        canvas?.add(lastAction.object);
        break;
      case "object:moved":
        lastAction.object.set({
          left: lastAction.originalLeft,
          top: lastAction.originalTop,
        });
        canvas?.renderAll();
        break;
      case "object:scaled":
        lastAction.object.set({
          scaleX: lastAction.originalScaleX,
          scaleY: lastAction.originalScaleY,
        });
        canvas?.renderAll();
        break;
      case "object:rotated":
        lastAction.object.set({ angle: lastAction.originalAngle });
        canvas?.renderAll();
        break;
    }
  }

  const copySvg = () => {
    if (canvas) {
      const svgData = canvas.toSVG();
      navigator.clipboard.writeText(svgData);
    }
  };
  const downloadSvg = () => {
    if (canvas) {
      const svgData = canvas.toSVG();
      var element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," + encodeURIComponent(svgData)
      );
      element.setAttribute("download", "canvas-svg.svg");

      element.style.display = "none";
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    }
  };

  return (
    <header className="header">
      <div className="header__buttons">
        {BUTTONS_GROUP.map((button) => (
          <Button
            type={BtnType.SECONDARY}
            key={button.id}
            onClick={button.onClick}
            size={BtnSize.SMALL}
            disabled={button.disabled}
          >
            {button.title}
          </Button>
        ))}
        <Button onClick={onSave} size={BtnSize.SMALL}>
          Сохранить
        </Button>
      </div>
      {createPortal(
        <ModalOverlay
          open={Boolean(svg)}
          onClose={() => setSvg("")}
          title={"Сохранить SVG"}
        >
          <div className="modal__download-content">{svg}</div>
          <div className="modal__buttons">
            <Button onClick={downloadSvg}>Скачать</Button>
            <Button type={BtnType.SECONDARY} onClick={copySvg}>
              Скопировать
            </Button>
          </div>
        </ModalOverlay>,
        document.body
      )}
    </header>
  );
};
export default Header;
