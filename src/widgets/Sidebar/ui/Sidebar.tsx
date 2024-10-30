import { useEffect, useState } from "react";
import "./Sidebar.scss";
import PlusIcon from "../../../shared/assets/icons/plus";
import DownloadIcon from "../../../shared/assets/icons/download-01";
import * as fabric from "fabric";
import { createPortal } from "react-dom";
import { ModalOverlay } from "../../../shared/ui/ModalOverlay/ModalOverlay";
import CloseIcon from "../../../shared/assets/icons/x-close";
import Button from "../../../shared/ui/Button/Button";
import { BtnType } from "../../../shared/ui/Button/types";
import { classNames } from "../../../shared/lib/classNames/classNames";
import { SVG_GROUP } from "../constants/constants";
const Sidebar = ({ canvas }: { canvas: fabric.Canvas | null }) => {
  const [isSvgBarOpen, setIsSvgBarOpen] = useState(false);
  const [isAddTextModalOpen, setIsAddTextModalOpen] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [file, setFile] = useState<File | undefined>(undefined);
  useEffect(() => {
    if (canvas && file) {
      fabric.Image.fromURL(URL.createObjectURL(file)).then((image) => {
        canvas.add(image);
      });
    }
  }, [canvas, file]);
  const handleSvgLoad = (svgUrl: string) => {
    if (canvas) {
      let obj: { path: string; fill: string }[] = [];
      fabric
        .loadSVGFromURL(svgUrl, (object) => {
          const path = object.getAttribute("d");
          const fill = object.getAttribute("fill");
          if (path && fill) {
            obj.push({ path, fill });
          }
        })
        .then(() => {
          if (obj) {
            const group = new fabric.Group();
            obj.forEach((item) => {
              const path = new fabric.Path(item.path);
              path.set({
                fill: item.fill,
              });
              group.add(path);
            });
            group.scale(0.1);
            canvas.add(group);
            canvas.renderAll();
          }
        });
    }
  };
  const handleAddText = (text: string) => {
    if (canvas && text) {
      const newText = new fabric.Text(text, {
        fontSize: 20,
        left: 100,
        top: 100,
      });
      canvas.add(newText);
      setTextInput("");
      setIsAddTextModalOpen(false);
    }
  };
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter" && e.shiftKey) {
        handleAddText(textInput);
      }
    };
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [textInput]);
  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <h2>MyCanvas</h2>
      </div>
      <div
        className={classNames("sidebar__svgbar", {
          "sidebar__svgbar--active": isSvgBarOpen,
        })}
      >
        <Button type={BtnType.CLEAR} onClick={() => setIsSvgBarOpen(false)}>
          <CloseIcon />
        </Button>
        <div className="sidebar__svgbar-content">
          {SVG_GROUP.map((item) => (
            <button
              key={item.id}
              className="sidebar__svgbar-item"
              onClick={() => handleSvgLoad(item.svg)}
            >
              <img src={item.svg} alt={`SVG-${item.id}`} />
            </button>
          ))}
        </div>
      </div>
      <div className="sidebar__buttons">
        <Button
          onClick={() => setIsAddTextModalOpen(true)}
          type={BtnType.PRIMARY}
        >
          <span>Добавить текст</span> <PlusIcon />
        </Button>
        <label htmlFor="file" className="sidebar__btn-load">
          <span>Загрузить картинку</span>
          <input
            type="file"
            id="file"
            accept="image/png, image/jpeg"
            className="sidebar__input-file"
            onChange={(e) => setFile(e.target.files?.[0])}
          />
          <DownloadIcon />
        </label>
        <Button type={BtnType.PRIMARY} onClick={() => setIsSvgBarOpen(true)}>
          <span>Добавить SVG</span>
        </Button>
      </div>
      {createPortal(
        <ModalOverlay
          open={isAddTextModalOpen}
          onClose={() => setIsAddTextModalOpen(false)}
          title="Добавить текст"
        >
          <textarea
            autoFocus
            placeholder="Текст"
            className="modal__textarea"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
          />
          <Button
            type={BtnType.PRIMARY}
            disabled={!textInput}
            onClick={() => handleAddText(textInput)}
            className="modal__text-btn"
          >
            Добавить
          </Button>
        </ModalOverlay>,
        document.body
      )}
    </div>
  );
};
export default Sidebar;
