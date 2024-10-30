import { memo } from "react";
import "./Button.scss";
import { TButton, BtnSize, BtnType } from "./types";
import { classNames } from "../../lib/classNames/classNames";

const Button = memo(
  ({
    type = BtnType.PRIMARY,
    onClick,
    disabled,
    children,
    size = BtnSize.MEDIUM,
    className,
    animated = true,
  }: TButton) => {
    const mods = {
      ["button--animated"]: animated,
    };
    const extraClasses = [type, size, className];
    const props = {
      disabled: disabled,
      className: classNames("button", mods, extraClasses),
      onClick: (e: any) => !disabled && onClick && onClick(e),
    };
    return <button {...props}>{children}</button>;
  }
);

export default Button;
