import { createPortal } from "react-dom";
import "./ModalOverlay.scss";
import { memo, useEffect, useRef, useState } from "react";
import { classNames } from "../../lib/classNames/classNames";
import Button from "../Button/Button";
import { BtnType } from "../Button/types";
import XClose from "../../assets/icons/x-close";
export interface TModalOverlay {
  onClose: () => void;
  open: boolean;
  children: React.ReactNode;
  title: string;
}

const ANIMATION_DELAY = 300;
export const ModalOverlay = memo(
  ({ onClose, open, children, title }: TModalOverlay) => {
    const [isVisible, setIsVisible] = useState(false);

    const timerRef = useRef<ReturnType<typeof setTimeout>>();
    useEffect(() => {
      if (open) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    }, [open]);

    const handleClose = () => {
      setIsVisible(false);
      timerRef.current = setTimeout(() => {
        onClose();
      }, ANIMATION_DELAY); // Задержка совпадает с продолжительностью анимации
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    useEffect(() => {
      document.addEventListener("keydown", onKeyDown);
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        document.removeEventListener("keydown", onKeyDown);
      };
    }, []);

    return createPortal(
      <>
        <div
          className={classNames("modal__overlay", { open: isVisible })}
          onClick={handleClose}
        >
          <div
            className={classNames("modal__overlay--animated", {
              "modal__overlay--animated-open": isVisible,
            })}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal">
              <div className="modal__content">
                <div className="modal__header">
                  <h3>{title}</h3>
                  <Button type={BtnType.CLEAR} onClick={onClose}>
                    <XClose />
                  </Button>
                </div>
                {children}
              </div>
            </div>
          </div>
        </div>
      </>,
      document.querySelector("body")!
    );
  }
);
