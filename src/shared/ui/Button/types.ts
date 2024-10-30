import { ReactNode } from "react";

export enum BtnSize {
  MEDIUM = "medium",
  SMALL = "small",
}
export enum BtnType {
  PRIMARY = "primary",
  SECONDARY = "secondary",
  CLEAR = "clear",
}

export interface TButton {
  type?: BtnType;
  children: JSX.Element | string | ReactNode;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  size?: BtnSize;
  className?: string | any;
  animated?: boolean;
}
